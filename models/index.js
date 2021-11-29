import { join, dirname } from 'path'
import { Low, JSONFile } from 'lowdb'
import { fileURLToPath } from 'url'
import initDb from './init.json'
import users from './users.js'
import auth from './auth.js'
import problems from './problems.js'
import submissions from './submissions.js'

const __dirname = dirname(fileURLToPath(import.meta.url))
const file = join(__dirname, 'db.json')
const adapter = new JSONFile(file)

export const db = new Low(adapter)

// Read data from JSON file, this will set db.data content
await db.read()

// If file.json doesn't exist, db.data will be null
// Set default data if null
db.data ||= initDb

// Write db.data content to db.json
// await db.write()

export default {
  users,
  auth,
  problems,
  submissions,
}
