const rooms =
  require("../../state/rooms")

const {
  SOCKET_EVENTS
} = require("../../../shared/constants/socketEvents")

const {
  startGame,
  HAND_SIZE,
  MAX_ROUNDS
} = require("../../services/gameService")

const {
  getWhiteCards,
  getBlackCards
} = require("../../services/cardService")

const {
  emitGame
} = require("../../emitters/gameEmitter")

module.exports =
function registerStartGame(
  io,
  socket
) {

  socket.on(
    SOCKET_EVENTS.START_GAME,

    code => {

      const room =
        rooms.get(code)

      if (!room) {
        return
      }

      if (
        room.hostId !==
        socket.id
      ) {

        return
      }

      if (
        room.players.length < 3
      ) {

        socket.emit(
          SOCKET_EVENTS.LOBBY_ERROR,
          "Minimum 3 players required"
        )

        return
      }

      const whiteCardCount =
        getWhiteCards().length

      const requiredWhiteCards =
        room.players.length *
        HAND_SIZE

      if (
        whiteCardCount <
        requiredWhiteCards
      ) {

        socket.emit(
          SOCKET_EVENTS.LOBBY_ERROR,
          `Not enough white cards. Need ${requiredWhiteCards} for ${room.players.length} players, but only ${whiteCardCount} available.`
        )

        return
      }

      const blackCardCount =
        getBlackCards().length

      if (
        blackCardCount <
        MAX_ROUNDS
      ) {

        socket.emit(
          SOCKET_EVENTS.LOBBY_ERROR,
          `Not enough black cards. Need ${MAX_ROUNDS} for all rounds, but only ${blackCardCount} available.`
        )

        return
      }

      startGame(room)

      emitGame(io, room)

      console.log(
        "game started:",
        code
      )
    }
  )
}
