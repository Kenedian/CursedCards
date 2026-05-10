require("dotenv").config()

const express =
  require("express")

const http =
  require("http")

const cors =
  require("cors")

const { Server } =
  require("socket.io")

const registerSocketHandlers =
  require("./socket")

const app =
  express()

const ALLOWED_ORIGINS = [

  "http://localhost:5173",

  process.env.CLIENT_URL
].filter(Boolean)

app.use(
  cors({

    origin:
      ALLOWED_ORIGINS
  })
)

app.use(
  express.json()
)

app.get(
  "/",

  (req, res) => {

    res.json({

      status: "online"
    })
  }
)

const server =
  http.createServer(app)

const io =
  new Server(server, {

    cors: {

      origin:
        ALLOWED_ORIGINS,

      methods: [
        "GET",
        "POST"
      ]
    },

    transports: [
      "websocket",
      "polling"
    ]
  })

registerSocketHandlers(io)

const PORT =
  process.env.PORT || 3000

server.listen(
  PORT,

  () => {

    console.log(
      `server running on ${PORT}`
    )
  }
)