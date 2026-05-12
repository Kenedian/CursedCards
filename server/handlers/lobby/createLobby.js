const rooms =
  require("../../state/rooms")

const {
  SOCKET_EVENTS
} = require("../../../shared/constants/socketEvents")

const generateCode =
  require("../../utils/game/generateCode")

module.exports =
function registerCreateLobby(
  io,
  socket
) {

  socket.on(
    SOCKET_EVENTS.CREATE_LOBBY,

    ({
      username,
      sessionId
    }) => {

      const code =
        generateCode()

      const room = {

        code,

        hostId:
          socket.id,

        game: null,

        maxRounds: 10,

        players: [

          {
            id: socket.id,

            sessionId,

            connected: true,

            username,

            isHost: true,

            ready: false,

            score: 0,

            hand: [],

            selectedCards: [],

            selectedVoteId: null
          }
        ]
      }

      rooms.set(code, room)

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
}
