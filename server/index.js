import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Job, Application, User } from './models.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// MongoDB Serverless Connection Logic
let cachedDb = null;

const connectToDatabase = async () => {
    if (cachedDb) return cachedDb;

    // For Vercel Serverless, ensure connections don't hang by setting pooling options
    const db = await mongoose.connect(process.env.MONGODB_URI, {
        bufferCommands: false,
    });

    cachedDb = db;
    console.log('Connected to MongoDB Atlas');
    return db;
};

// Connect immediately for long-running processes (like local dev)
connectToDatabase().catch(err => console.error('MongoDB connection error:', err));

// --- API Routes ---

// Vercel Serverless DB Middleware - Ensure connection before processing request
const requireDb = async (req, res, next) => {
    try {
        await connectToDatabase();
        next();
    } catch (err) {
        console.error("Failed to connect to DB in middleware:", err);
        res.status(500).json({ error: "Database connection failed" });
    }
};

app.use('/api', requireDb);

// Jobs
app.get('/api/jobs', async (req, res) => {
    try {
        const jobs = await Job.find().sort({ createdAt: -1 });
        res.json(jobs);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/jobs/:id', async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);
        if (!job) return res.status(404).json({ message: 'Job not found' });
        res.json(job);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/jobs', async (req, res) => {
    try {
        const job = new Job(req.body);
        await job.save();
        res.status(201).json(job);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

app.put('/api/jobs/:id', async (req, res) => {
    try {
        const job = await Job.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(job);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

app.delete('/api/jobs/:id', async (req, res) => {
    try {
        await Job.findByIdAndDelete(req.params.id);
        res.json({ message: 'Job deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Applications
app.get('/api/applications', async (req, res) => {
    try {
        const apps = await Application.find().sort({ date: -1 });
        res.json(apps);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/applications', async (req, res) => {
    try {
        const app = new Application(req.body);
        await app.save();
        res.status(201).json(app);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

app.get('/api/applications/check', async (req, res) => {
    try {
        const { jobId, email } = req.query;
        const app = await Application.findOne({ jobId, email });
        res.json({ hasApplied: !!app });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Auth & Registration
app.post('/api/auth/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ error: 'Email already registered' });

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ name, email, password: hashedPassword });
        await user.save();
        res.status(201).json({ message: 'Registration successful' });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log(`Login attempt for: ${email}`);

        const user = await User.findOne({ email });
        if (!user) {
            console.log(`User not found: ${email}`);
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        if (user.isBanned) {
            console.log(`Banned user tried to login: ${email}`);
            return res.status(403).json({ error: 'Your account has been banned. Please contact support.' });
        }

        if (!user.password) {
            console.error(`User ${email} has no password in database! Please re-seed.`);
            return res.status(500).json({ error: 'Account setup incomplete. Please re-seed the database.' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            console.log(`Invalid password for: ${email}`);
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET || 'secret', { expiresIn: '1d' });
        res.json({
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                dateJoined: user.dateJoined,
                savedJobs: user.savedJobs,
                profile: user.profile
            }
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/users', async (req, res) => {
    try {
        const users = await User.find().sort({ dateJoined: -1 });
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.put('/api/users/profile', async (req, res) => {
    try {
        const { email, profile } = req.body;
        const user = await User.findOneAndUpdate({ email }, { profile }, { new: true });
        res.json(user);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

app.post('/api/admin/users/:id/ban', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });
        user.isBanned = !user.isBanned;
        await user.save();
        res.json({ isBanned: user.isBanned });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// User Saved Jobs (Mocking specific user for now based on email)
app.post('/api/users/save-job', async (req, res) => {
    try {
        const { email, jobId } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: "User not found" });

        const index = user.savedJobs.indexOf(jobId);
        if (index === -1) {
            user.savedJobs.push(jobId);
        } else {
            user.savedJobs.splice(index, 1);
        }
        await user.save();
        res.json({ savedJobs: user.savedJobs, isSaved: index === -1 });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/users/:email/saved-jobs', async (req, res) => {
    try {
        const user = await User.findOne({ email: req.params.email });
        if (!user) return res.json({ savedJobs: [] });
        res.json({ savedJobs: user.savedJobs });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


// Seed Route
app.post('/api/seed', async (req, res) => {
    try {
        console.log("Seed endpoint hit");
        const { defaultJobsData, mockApplicationsData, mockUsersData } = req.body;

        if (!defaultJobsData) {
            console.error("No job data provided!");
            return res.status(400).json({ error: "Missing seed data" });
        }

        await Job.deleteMany({});
        await Application.deleteMany({});
        await User.deleteMany({});

        // Insert jobs and keep mapping of old ID to new Mongo ID
        const jobMap = {};
        for (const jobData of defaultJobsData) {
            const oldId = jobData.id;
            delete jobData.id;
            const newJob = new Job(jobData);
            await newJob.save();
            jobMap[oldId] = newJob._id;
        }

        // Insert applications with correct Mongo Job IDs
        for (const appData of mockApplicationsData) {
            delete appData.id;
            appData.jobId = jobMap[appData.jobId] || appData.jobId; // Map or fallback
            await new Application(appData).save();
        }

        // Insert users
        const hashedAdminPassword = await bcrypt.hash('admin123', 10);
        for (const userData of mockUsersData) {
            delete userData.id;
            userData.password = hashedAdminPassword; // Set default password for mock users
            await new User(userData).save();
        }

        res.json({ message: 'Database seeded successfully', jobMap });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}

export default app;
