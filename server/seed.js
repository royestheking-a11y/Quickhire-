import { defaultJobsData, mockApplicationsData, mockUsersData } from '../src/app/store.ts';

async function seedDatabase() {
    console.log("Starting database seed process...");

    try {
        const response = await fetch('http://localhost:5001/api/seed', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                defaultJobsData,
                mockApplicationsData,
                mockUsersData
            })
        });

        const result = await response.json();

        if (response.ok) {
            console.log("Success:", result.message);
            console.log("Job ID Mapping:", result.jobMap);
        } else {
            console.error("Error from server:", result.error);
        }
    } catch (err) {
        console.error("Failed to connect to seed endpoint:", err);
    }
}

seedDatabase();
