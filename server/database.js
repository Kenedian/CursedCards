const path =
  require("path")

const {
  createClient
} = require("@libsql/client")

const useLocalSqlite =
  process.env.USE_LOCAL_SQLITE ===
  "true"

const db =
  createClient({

    url: useLocalSqlite

      ? `file:${path.join(
          __dirname,
          "db",
          "testingDatabase.db"
        )}`

      : process.env
          .TURSO_DATABASE_URL,

    authToken: useLocalSqlite

      ? undefined

      : process.env
          .TURSO_AUTH_TOKEN
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

    useLocalSqlite

      ? "local sqlite database initialized"

      : "turso database initialized"
  )
}

initDatabase()

module.exports = db