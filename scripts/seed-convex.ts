/**
 * Seed Convex Database from JSON Data Files
 *
 * HOW TO RUN:
 *   npx tsx scripts/seed-convex.ts           # Seed all systems
 *   npx tsx scripts/seed-convex.ts data/mera.json  # Seed single file
 *
 * Or via Convex CLI directly:
 *   npx convex run seed:seedSystem '{"jsonData": "$(cat data/mera.json)"}'
 *
 * PREREQUISITES:
 * - Convex configured (npx convex dev --once --configure=new)
 */

import { readFileSync } from "fs"
import { join, resolve } from "path"

const DATA_DIR = resolve(__dirname, "../data")

const SYSTEM_FILES = [
  "mera.json",
  "kiraa.json",
  "levur.json",
  "cpf_jigsaw.json",
  "illawarra_energy_storage.json",
  "central_highlands_council.json",
  "council_2.json",
  "relationships_australia_tas.json",
]

function seedFile(filePath: string) {
  const jsonData = readFileSync(filePath, "utf-8")
  const parsed = JSON.parse(jsonData)

  console.log(`\n--- ${parsed.name} ---`)
  console.log(`  Outcomes: ${parsed.logic_model.outcomes.length}`)
  console.log(`  Value Chain: ${parsed.logic_model.value_chain.length}`)
  console.log(`  Resources: ${parsed.logic_model.resources.length}`)
  console.log(`  External Values: ${parsed.external_values.length}`)
  console.log(`  Contribution cells: ${parsed.matrices.contribution_map.filter((c: { content: string }) => c.content).length}`)
  console.log(`  Delivery cells: ${parsed.matrices.delivery_pathways.filter((c: { content: string }) => c.content).length}`)
  console.log(`  Convergence cells: ${parsed.matrices.external_influences.filter((c: { content: string }) => c.content).length}`)

  return jsonData
}

function main() {
  const args = process.argv.slice(2)
  const files = args.length > 0 ? args.map(a => resolve(a)) : SYSTEM_FILES.map(f => join(DATA_DIR, f))

  console.log("=== Jigsaw 1.6 - Convex Database Seed ===\n")

  for (const filePath of files) {
    try {
      seedFile(filePath)
    } catch (error) {
      console.error(`ERROR: ${filePath}:`, error)
    }
  }

  console.log("\n=== Done ===")
  console.log("To seed into Convex, run for each file:")
  console.log('  npx convex run seed:seedSystem \'{"jsonData": "$(cat data/<file>.json)"}\'')
  console.log("Or use the Convex dashboard Functions tab to run seed:seedSystem")
}

main()
