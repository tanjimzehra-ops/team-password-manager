import { readFileSync, writeFileSync } from "fs";
import { execSync } from "child_process";
import { resolve } from "path";

const files = [
    "data/mera.json",
    "data/kiraa.json.json",
    "data/levur.json.json",
    "data/cpf_jigsaw.json",
    "data/illawarra_energy_storage.json",
    "data/central_highlands_council.json",
    "data/council_2.json",
    "data/relationships_australia_tas.json"
];

for (const file of files) {
    try {
        const json = readFileSync(file, "utf-8");
        const compact = JSON.stringify({ jsonData: json });
        writeFileSync("temp_args.json", compact);

        console.log(`Seeding ${file} via CLI...`);
        const cmd = `npx convex run --url https://hidden-fish-6.convex.cloud seed:seedSystemPublic --args-file temp_args.json`;
        // Wait, since --args-file failed, I'll try to use a different way.
    } catch (err) {
        console.error(err);
    }
}
