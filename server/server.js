require("dotenv").config()

const express =
  require("express")

const http =
  require("http")

const cors =
  require("cors")

const { Server } =
  require("socket.io")

const {
  SOCKET_EVENTS
} = require(
  "../shared/constants/socketEvents"
)

require("./database")

const app =
  express()

app.use(cors())

app.use(
  express.json()
)

const server =
  http.createServer(app)

const io =
  new Server(server, {
    cors: {
      origin: "*"
    }
  })

const admins =
  new Set()

io.on(
  "connection",

  socket => {

    console.log(
      "player connected:",
      socket.id
    )

    // ADMIN LOGIN

    socket.on(
      SOCKET_EVENTS.ADMIN_LOGIN,

      password => {

        if (
          password ===
          process.env.ADMIN_PASSWORD
        ) {

          admins.add(socket.id)

          socket.emit(
            SOCKET_EVENTS.ADMIN_LOGIN_SUCCESS
          )

          console.log(
            "admin authenticated:",
            socket.id
          )

          return
        }

        socket.emit(
          SOCKET_EVENTS.ADMIN_LOGIN_FAILED
        )

        console.log(
          "admin auth failed:",
          socket.id
        )
      }
    )

    // DISCONNECT

    socket.on(
      "disconnect",

      () => {

        admins.delete(socket.id)

        console.log(
          "player disconnected:",
          socket.id
        )
      }
    )
  }
)

server.listen(
  3000,

  () => {

    console.log(
      "server running on 3000"
    )
  }
)