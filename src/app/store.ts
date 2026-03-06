
export interface Job {
  _id?: string;
  id?: string; // For backward compatibility during migration
  logo: string;
  company: string;
  location: string;
  title: string;
  description: string;
  tags: string[];
  type: string;
  featured?: boolean;
  latest?: boolean;
}

export interface Application {
  _id?: string;
  id?: string;
  jobId: string;
  jobTitle: string;
  name: string;
  email: string;
  resume: string;
  coverNote: string;
  date: string;
}

export interface User {
  _id?: string;
  id?: string;
  name: string;
  email: string;
  password?: string;
  role: 'admin' | 'user';
  isBanned?: boolean;
  dateJoined: string;
  savedJobs?: string[];
  profile?: {
    bio: string;
    education: string;
    experience: string;
    cvUrl: string;
  };
}

export const defaultJobsData: Job[] = [
  {
    id: "1",
    logo: "https://ui-avatars.com/api/?name=Stripe&background=random&color=fff&size=200",
    company: "Stripe",
    location: "San Francisco, US",
    title: "Senior Backend Engineer",
    description: "Stripe is building the economic infrastructure for the internet. You will be responsible for designing and implementing highly available services in Go and Node.js. Requirements include 5+ years of backend development and experience with building scalable REST APIs and microservices. You'll be working closely with cross-functional teams to shape the future of global payments.",
    tags: ["Engineering", "Backend", "Golang"],
    type: "Full Time",
    featured: true,
    latest: true
  },
  {
    id: "2",
    logo: "https://ui-avatars.com/api/?name=Netflix&background=random&color=fff&size=200",
    company: "Netflix",
    location: "Los Angeles, US",
    title: "UI/UX Product Designer",
    description: "Join Netflix's core product team to craft intuitive, engaging interfaces that millions of members interact with every day. You'll collaborate with user researchers, product managers, and engineers to deliver top-tier streaming experiences across web, mobile, and tv platforms. Deep knowledge of Figma, prototyping, and user-centered design methodologies is a must.",
    tags: ["Design", "UI/UX", "Product"],
    type: "Full Time",
    featured: true,
    latest: true
  },
  {
    id: "3",
    logo: "https://ui-avatars.com/api/?name=Slack&background=random&color=fff&size=200",
    company: "Slack",
    location: "Remote",
    title: "Developer Relations Advocate",
    description: "We are seeking a DevRel Advocate to inspire and equip builders using the Slack API. Your day-to-day will involve writing technical content, presenting at conferences, and building open-source SDKs and demo apps. Strong communication skills and hands-on experience building Slack integrations are preferred.",
    tags: ["Marketing", "Engineering", "Community"],
    type: "Full Time",
    featured: true
  },
  {
    id: "4",
    logo: "https://ui-avatars.com/api/?name=Figma&background=random&color=fff&size=200",
    company: "Figma",
    location: "London, UK",
    title: "Product Manager - Design Systems",
    description: "Lead the future of design systems at Figma. You will engage deeply with our most advanced customers to understand their workflows, prioritize new capabilities, and collaborate with engineering and design to ship groundbreaking features. Prior experience navigating complex enterprise requirements is highly valued.",
    tags: ["Product", "Business", "Management"],
    type: "Full Time",
    featured: true
  },
  {
    id: "5",
    logo: "https://ui-avatars.com/api/?name=Airbnb&background=random&color=fff&size=200",
    company: "Airbnb",
    location: "Berlin, Germany",
    title: "Data Scientist (Trust & Safety)",
    description: "Our Trust & Safety team ensures that hosts and guests have a secure experience. You will leverage machine learning and deep data analytics to detect anomalous behavior, prevent fraud, and build predictive models that keep the Airbnb community safe globally. Python and SQL mastery required.",
    tags: ["Engineering", "Data", "AI"],
    type: "Full Time",
    featured: true
  },
  {
    id: "6",
    logo: "https://ui-avatars.com/api/?name=Spotify&background=random&color=fff&size=200",
    company: "Spotify",
    location: "Stockholm, Sweden",
    title: "Machine Learning Engineer",
    description: "Help build the recommendation engines that power Spotify's iconic discover weekly playlists. You will train, test, and deploy large-scale ML models built on user streaming trends and audio analysis. Experience with TensorFlow or PyTorch and big data pipelines is essential.",
    tags: ["Engineering", "AI", "Machine Learning"],
    type: "Full Time",
    featured: true
  },
  {
    id: "7",
    logo: "https://ui-avatars.com/api/?name=Webflow&background=random&color=fff&size=200",
    company: "Webflow",
    location: "Remote",
    title: "Frontend React Specialist",
    description: "Webflow is empowering the world to create on the web without code. You will use your deep expertise in React and modern browser APIs to build an incredibly complex and highly performant canvas interface. Proficiency in state management, canvas rendering, and complex CSS architectures is critical.",
    tags: ["Engineering", "Frontend", "React"],
    type: "Full Time",
    featured: true,
    latest: true
  },
  {
    id: "8",
    logo: "https://ui-avatars.com/api/?name=Notion&background=random&color=fff&size=200",
    company: "Notion",
    location: "New York, US",
    title: "Growth Marketing Manager",
    description: "Drive new user acquisition and monetization at Notion. You will spearhead paid social campaigns, SEO optimization, and A/B testing frameworks across all major platforms. The ideal candidate blends creative ideation with rigorous analytical skills to scale our enterprise and individual subscriber bases.",
    tags: ["Marketing", "Growth", "Business"],
    type: "Full Time",
    featured: true
  },
  {
    id: "9",
    logo: "https://ui-avatars.com/api/?name=Vercel&background=random&color=fff&size=200",
    company: "Vercel",
    location: "Remote",
    title: "Cloud Infrastructure Engineer",
    description: "Vercel is making the web faster. You will be responsible for scaling our edge network, improving global CDN routing, and optimizing container deployment architectures. Experience with Kubernetes, Rust/Go, and deep networking protocols is necessary to succeed in this role.",
    tags: ["Engineering", "DevOps", "Cloud"],
    type: "Full Time",
    latest: true
  },
  {
    id: "10",
    logo: "https://ui-avatars.com/api/?name=Dropbox&background=random&color=fff&size=200",
    company: "Dropbox",
    location: "Seattle, US",
    title: "Staff Security Researcher",
    description: "Protect millions of users' data by leading offensive security operations at Dropbox. You will conduct penetration tests, audit legacy storage clusters, and architect new secure encryption policies for our sync clients. Expert background in cryptography and network security required.",
    tags: ["Engineering", "Security"],
    type: "Full Time",
    latest: true
  },
  {
    id: "11",
    logo: "https://ui-avatars.com/api/?name=GitHub&background=random&color=fff&size=200",
    company: "GitHub",
    location: "Remote",
    title: "Open Source Community Manager",
    description: "GitHub is seeking a community manager to act as a liaison between our team and top open-source maintainers. You will organize events, facilitate sponsorship programs, and champion maintainer success across the open ecosystem. Empathy and community-building skills are your superpowers.",
    tags: ["Marketing", "Community", "Open Source"],
    type: "Full Time",
    latest: true
  },
  {
    id: "12",
    logo: "https://ui-avatars.com/api/?name=Discord&background=random&color=fff&size=200",
    company: "Discord",
    location: "San Francisco, US",
    title: "Senior iOS Engineer",
    description: "Build delightful and blazingly fast communication experiences for mobile. You'll work heavily with Swift, improving our voice/video infrastructure and refining deep iOS integrations. A background in low-latency multimedia applications is highly preferred.",
    tags: ["Engineering", "Mobile", "iOS"],
    type: "Full Time"
  },
  {
    id: "13",
    logo: "https://ui-avatars.com/api/?name=Canva&background=random&color=fff&size=200",
    company: "Canva",
    location: "Sydney, Australia",
    title: "Content Strategist & Copywriter",
    description: "Canva is democratizing design. We need a creative wordsmith to craft compelling brand narratives, educational articles, and engaging social content that inspires our global user base. Proven portfolio demonstrating versatility across long-form and micro-copy is required.",
    tags: ["Marketing", "Content", "Creative"],
    type: "Full Time",
    latest: true
  },
  {
    id: "14",
    logo: "https://ui-avatars.com/api/?name=Shopify&background=random&color=fff&size=200",
    company: "Shopify",
    location: "Toronto, Canada",
    title: "E-Commerce Tech Lead",
    description: "Guide a team of engineers building out advanced storefront capabilities for premium merchants. You will mentor junior developers, architect resilient Ruby on Rails services, and ensure our checkout flows maintain 99.99% uptime during peak holiday traffic.",
    tags: ["Engineering", "Leadership", "Ruby"],
    type: "Full Time"
  },
  {
    id: "15",
    logo: "https://ui-avatars.com/api/?name=Cloudflare&background=random&color=fff&size=200",
    company: "Cloudflare",
    location: "Austin, US",
    title: "Customer Support Engineer",
    description: "Are you passionate about troubleshooting the internet? Cloudflare is looking for highly technical support engineers to resolve complex DNS, routing, and WAF issues for enterprise clients. Strong foundational knowledge of TCP/IP, HTTPS, and web security is essential.",
    tags: ["Engineering", "Support", "Networking"],
    type: "Full Time"
  },
  {
    id: "16",
    logo: "https://ui-avatars.com/api/?name=Twitch&background=random&color=fff&size=200",
    company: "Twitch",
    location: "Seattle, US",
    title: "Video Streaming Engineer",
    description: "Join the team that handles the ingestion, transcoding, and distribution of millions of live streams. You will optimize video codecs (H.264/H.265/AV1), write performant C++ processing pipelines, and work on adaptive bitrate algorithms. Deep knowledge of multimedia engineering is a must.",
    tags: ["Engineering", "Video", "C++"],
    type: "Full Time"
  },
  {
    id: "17",
    logo: "https://ui-avatars.com/api/?name=HubSpot&background=random&color=fff&size=200",
    company: "HubSpot",
    location: "Dublin, Ireland",
    title: "B2B Enterprise Account Executive",
    description: "We're expanding our European operations and looking for top-tier sales talent. You will prospect, negotiate, and close large-scale enterprise contracts, demonstrating how HubSpot's CRM suite can transform their businesses. Minimum 4 years of proven B2B SaaS sales experience required.",
    tags: ["Sales", "Business", "B2B"],
    type: "Full Time"
  },
  {
    id: "18",
    logo: "https://ui-avatars.com/api/?name=Zoom&background=random&color=fff&size=200",
    company: "Zoom",
    location: "San Jose, US",
    title: "QA Automation Engineer",
    description: "Ensure the reliability of Zoom's desktop clients. You will write automated test frameworks in Python and Java, executing daily regressions across Windows and MacOS builds. Candidates should have extensive experience with Selenium, Appium, or custom testing harnesses.",
    tags: ["Engineering", "QA", "Automation"],
    type: "Full Time"
  },
  {
    id: "19",
    logo: "https://ui-avatars.com/api/?name=Duolingo&background=random&color=fff&size=200",
    company: "Duolingo",
    location: "Pittsburgh, US",
    title: "Linguistics & Curriculum Designer",
    description: "Help build the world's most accessible language learning platform. We are seeking experts in applied linguistics to design course structures, calibrate difficulty algorithms, and ensure pedagogical efficacy. Native fluency in Spanish or French with an advanced degree in Linguistics required.",
    tags: ["Product", "Education", "Language"],
    type: "Full Time"
  },
  {
    id: "20",
    logo: "https://ui-avatars.com/api/?name=Revolut&background=random&color=fff&size=200",
    company: "Revolut",
    location: "London, UK",
    title: "Financial Controller",
    description: "Revolut is building a global superapp. We need a precise Financial Controller to oversee international accounting operations, manage tax compliance, and build financial models to support our rapid scaling. Qualified CPA/ACCA required with heavy tech/fintech industry experience.",
    tags: ["Business", "Finance", "Banking"],
    type: "Full Time"
  }
];

export const mockApplicationsData: Application[] = [];

export const mockUsersData: User[] = [
  { id: "u1", name: "Admin QuickHire", email: "admin@quickhire.com", role: "admin", dateJoined: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString() }
];

// Normalize _id to id for frontend compatibility
const normalizeId = (obj: any) => {
  if (!obj) return null;
  const newObj = { ...obj, id: obj._id || obj.id };
  delete newObj._id;
  return newObj;
}

// ------ ASYNC API FETCHES ------

export const getJobs = async (): Promise<Job[]> => {
  const res = await fetch('/api/jobs');
  if (!res.ok) throw new Error('Failed to fetch jobs');
  const data = await res.json();
  return data.map(normalizeId);
};

export const getJobById = async (id: string): Promise<Job | null> => {
  const res = await fetch(`/api/jobs/${id}`);
  if (!res.ok) return null;
  const data = await res.json();
  return normalizeId(data);
};

export const addJob = async (job: Omit<Job, 'id' | '_id'>): Promise<Job> => {
  const res = await fetch('/api/jobs', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(job),
  });
  if (!res.ok) throw new Error('Failed to add job');
  return normalizeId(await res.json());
};

export const deleteJob = async (id: string): Promise<void> => {
  await fetch(`/api/jobs/${id}`, { method: 'DELETE' });
};

export const updateJob = async (updatedJob: Job): Promise<Job> => {
  const res = await fetch(`/api/jobs/${updatedJob.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updatedJob),
  });
  if (!res.ok) throw new Error('Failed to update job');
  return normalizeId(await res.json());
};

export const getApplications = async (): Promise<Application[]> => {
  const res = await fetch('/api/applications');
  if (!res.ok) throw new Error('Failed to fetch applications');
  const data = await res.json();
  return data.map(normalizeId);
};

export const addApplication = async (app: Omit<Application, 'id' | '_id' | 'date'>): Promise<Application> => {
  const res = await fetch('/api/applications', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(app),
  });
  if (!res.ok) throw new Error('Failed to apply');
  return normalizeId(await res.json());
};

export const hasApplied = async (jobId: string, email: string): Promise<boolean> => {
  const res = await fetch(`/api/applications/check?jobId=${jobId}&email=${email}`);
  if (!res.ok) return false;
  const data = await res.json();
  return data.hasApplied;
};

export const getUsers = async (): Promise<User[]> => {
  const res = await fetch('/api/users');
  if (!res.ok) throw new Error('Failed to fetch users');
  const data = await res.json();
  return data.map(normalizeId);
};

export const register = async (user: Omit<User, 'id' | '_id' | 'dateJoined' | 'role'>): Promise<{ message: string }> => {
  const res = await fetch('/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(user),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to register');
  return data;
};

export const login = async (credentials: { email: string, password: string }): Promise<{ token: string, user: User }> => {
  const res = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to login');

  // Store session
  localStorage.setItem('token', data.token);
  localStorage.setItem('user', JSON.stringify(data.user));
  if (data.user.role === 'admin') localStorage.setItem('isAdmin', 'true');

  return data;
};

export const updateProfile = async (email: string, profile: NonNullable<User['profile']>): Promise<User> => {
  const res = await fetch('/api/users/profile', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, profile }),
  });
  if (!res.ok) throw new Error('Failed to update profile');
  const data = await res.json();

  // Update local storage
  const localUser = JSON.parse(localStorage.getItem('user') || '{}');
  localStorage.setItem('user', JSON.stringify({ ...localUser, profile: data.profile }));

  return normalizeId(data);
};

export const banUser = async (id: string): Promise<{ isBanned: boolean }> => {
  const res = await fetch(`/api/admin/users/${id}/ban`, { method: 'POST' });
  if (!res.ok) throw new Error('Failed to toggle ban status');
  return res.json();
};

export const getCurrentUser = (): User | null => {
  const userJson = localStorage.getItem('user');
  return userJson ? JSON.parse(userJson) : null;
};

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  localStorage.removeItem('isAdmin');
};

export const addUser = async (user: Omit<User, 'id' | '_id' | 'dateJoined'>): Promise<User> => {
  const res = await fetch('/api/users', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(user),
  });
  if (!res.ok) throw new Error('Failed to register/login');
  return normalizeId(await res.json());
};

export const toggleSaveJob = async (jobId: string, email: string) => {
  const res = await fetch('/api/users/save-job', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, jobId })
  });
  return await res.json();
};

export const getSavedJobIds = async (email: string): Promise<string[]> => {
  const res = await fetch(`/api/users/${email}/saved-jobs`);
  if (!res.ok) return [];
  const data = await res.json();
  return data.savedJobs || [];
};

export const isJobSaved = async (jobId: string, email: string): Promise<boolean> => {
  const savedJobs = await getSavedJobIds(email);
  return savedJobs.includes(jobId);
};
