const {
  createClient
} = require("@libsql/client")

const db =
  createClient({

    url:
      process.env.TURSO_DATABASE_URL,

    authToken:
      process.env.TURSO_AUTH_TOKEN
  })

async function initDatabase() {

  await db.execute(`

    CREATE TABLE IF NOT EXISTS WhiteCards (

      id INTEGER PRIMARY KEY AUTOINCREMENT,

      text TEXT NOT NULL UNIQUE
    )
  `)

  await db.execute(`

    CREATE TABLE IF NOT EXISTS BlackCards (

      id INTEGER PRIMARY KEY AUTOINCREMENT,

      text TEXT NOT NULL UNIQUE
    )
  `)

  console.log(
    "database initialized"
  )
}

initDatabase()

module.exports = db