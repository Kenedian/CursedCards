const rooms =
  require("../rooms")

const {
  SOCKET_EVENTS
} = require(
  "../../shared/constants/socketEvents"
)

function generateCode() {

  const letters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZ"

  let code = ""

  for (let i = 0; i < 4; i++) {

    code += letters[
      Math.floor(
        Math.random() *
        letters.length
      )
    ]
  }

  return code
}

module.exports =
  function registerLobbyHandlers(
    io,
    socket
  ) {

    function emitLobby(room) {

      io.to(room.code).emit(
        SOCKET_EVENTS.LOBBY_UPDATED,

        room
      )
    }

    // CREATE LOBBY

    socket.on(
      SOCKET_EVENTS.CREATE_LOBBY,

      ({ username }) => {

        const code =
          generateCode()

        const room = {

          code,

          hostId:
            socket.id,

          players: [
            {
              id:
                socket.id,

              username,

              isHost: true
            }
          ]
        }

        rooms.set(
          code,
          room
        )

        socket.join(code)

        socket.emit(
          SOCKET_EVENTS.CREATE_LOBBY_SUCCESS,

          room
        )

        console.log(
          "lobby created:",
          code
        )
      }
    )

    // JOIN LOBBY

    socket.on(
      SOCKET_EVENTS.JOIN_LOBBY,

      ({
        username,
        code
      }) => {

        const room =
          rooms.get(code)

        if (!room) {

          socket.emit(
            SOCKET_EVENTS.LOBBY_ERROR,

            "Lobby not found"
          )

          return
        }

        const alreadyInRoom =
          room.players.some(
            player =>
              player.id ===
              socket.id
          )

        if (alreadyInRoom) {
          return
        }

        const duplicateUsername =
          room.players.some(
            player =>

              player.username
                .toLowerCase()
                .trim()

              ===

              username
                .toLowerCase()
                .trim()
          )

        if (duplicateUsername) {

          socket.emit(
            SOCKET_EVENTS.LOBBY_ERROR,

            "Username already taken"
          )

          return
        }

        room.players.push({
          id:
            socket.id,

          username,

          isHost: false
        })

        socket.join(code)

        socket.emit(
          SOCKET_EVENTS.JOIN_LOBBY_SUCCESS,

          room
        )

        emitLobby(room)

        console.log(
          "player joined:",
          code
        )
      }
    )

    // KICK PLAYER

socket.on(
  SOCKET_EVENTS.KICK_PLAYER,

  ({
    code,
    playerId
  }) => {

    const room =
      rooms.get(code)

    if (!room) {
      return
    }

    // only host can kick

    if (
      room.hostId !==
      socket.id
    ) {

      return
    }

    const targetPlayer =
      room.players.find(
        player =>
          player.id ===
          playerId
      )

    if (!targetPlayer) {
      return
    }

    room.players =
      room.players.filter(
        player =>
          player.id !==
          playerId
      )

    const targetSocket =
      io.sockets.sockets.get(
        playerId
      )

    if (targetSocket) {

      targetSocket.leave(
        room.code
      )

      targetSocket.emit(
        SOCKET_EVENTS.PLAYER_KICKED
      )
    }

    emitLobby(room)

        console.log(
        "player kicked:",
        playerId
        )
      }
    )
    // LEAVE LOBBY

    socket.on(
      SOCKET_EVENTS.LEAVE_LOBBY,

      code => {

        const room =
          rooms.get(code)

        if (!room) {
          return
        }

        room.players =
          room.players.filter(
            player =>
              player.id !==
              socket.id
          )

        socket.leave(code)

        // host migration

        if (
          room.players.length > 0 &&
          room.hostId === socket.id
        ) {

          room.hostId =
            room.players[0].id

          room.players[0]
            .isHost = true
        }

        // delete empty room

        if (
          room.players.length === 0
        ) {

          rooms.delete(code)

          return
        }

        emitLobby(room)
      }
    )

    // DISCONNECT

    socket.on(
      "disconnect",

      () => {

        for (
          const [code, room]
          of rooms
        ) {

          const player =
            room.players.find(
              player =>
                player.id ===
                socket.id
            )

          if (!player) {
            continue
          }

          room.players =
            room.players.filter(
              player =>
                player.id !==
                socket.id
            )

          if (
            room.players.length === 0
          ) {

            rooms.delete(code)

            continue
          }

          if (
            room.hostId ===
            socket.id
          ) {

            room.hostId =
              room.players[0].id

            room.players[0]
              .isHost = true
          }

          emitLobby(room)
        }
      }
    )
  }