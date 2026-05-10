const Database =
  require("better-sqlite3")

const db =
  new Database(
    "./database/cards.db"
  )

db.prepare(`
  CREATE TABLE IF NOT EXISTS WhiteCards (
    id INTEGER PRIMARY KEY AUTOINCREMENT,

    text TEXT NOT NULL UNIQUE
  )
`).run()

db.prepare(`
  CREATE TABLE IF NOT EXISTS BlackCards (
    id INTEGER PRIMARY KEY AUTOINCREMENT,

    text TEXT NOT NULL UNIQUE
  )
`).run()

console.log(
  "database initialized"
)

module.exports = db