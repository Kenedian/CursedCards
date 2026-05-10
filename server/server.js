require("dotenv").config()

const express =
  require("express")

const http =
  require("http")

const cors =
  require("cors")

const { Server } =
  require("socket.io")

require("./database")

const registerSocketHandlers =
  require("./socket")

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

      origin: [
        "http://localhost:5173",
        "https://tvujfrontend.vercel.app"
      ],

      methods: [
        "GET",
        "POST"
      ]
    }
  })

registerSocketHandlers(io)

server.listen(
  3000,

  () => {

    console.log(
      "server running on 3000"
    )
  }
)