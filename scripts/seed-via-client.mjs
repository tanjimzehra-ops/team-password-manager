import { ConvexClient } from "convex/browser";
import { readFileSync, readdirSync } from "fs";
import { join } from "path";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const CONVEX_URL = process.env.NEXT_PUBLIC_CONVEX_URL;

if (!CONVEX_URL) {
    console.error("error: NEXT_PUBLIC_CONVEX_URL is not set in .env.local");
    process.exit(1);
}

const client = new ConvexClient(CONVEX_URL);

const DATA_DIR = "data";
const files = [
    "mera.json",
    "kiraa.json",
    "levur.json",
    "cpf_jigsaw.json",
    "illawarra_energy_storage.json",
    "central_highlands_council.json",
    "council_2.json",
    "relationships_australia_tas.json"
];

async function seed() {
    console.log(`Connecting to Convex at ${CONVEX_URL}...`);

    for (const fileName of files) {
        const filePath = join(DATA_DIR, fileName);
        try {
            console.log(`\nReading ${fileName}...`);
            const jsonData = readFileSync(filePath, "utf-8");

            console.log(`Seeding ${fileName} to Convex...`);
            // We use the public mutation we found in convex/seed.ts
            const result = await client.mutation("seed:seedSystemPublic", { jsonData });

            console.log(`Successfully seeded ${fileName}:`, result);
        } catch (err) {
            console.error(`Failed to seed ${fileName}:`, err.message);
        }
    }

    console.log("\nAll seeding operations completed.");
    process.exit(0);
}

seed();
