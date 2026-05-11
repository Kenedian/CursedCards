const rooms =
  require("../../state/rooms")

const {
  SOCKET_EVENTS
} = require("../../../shared/constants/socketEvents")

const {
  GAME_PHASES
} = require("../../../shared/constants/gamePhases")

const {
  allPlayersReady
} = require("../../services/gameService")

const {
  emitGame
} = require("../../emitters/gameEmitter")

const {
  calculateResults
} = require("../../services/lobby/playerLifecycleService")

const {
  scheduleRevealFallback
} = require("../../services/game/revealPhaseService")

module.exports =
function registerToggleReady(
  io,
  socket
) {

  socket.on(
    SOCKET_EVENTS.TOGGLE_READY,

    code => {

      const room =
        rooms.get(code)

      if (!room?.game) {
        return
      }

      const player =
        room.players.find(

          p =>

            p.id ===
            socket.id
        )

      if (!player) {
        return
      }

      const wasReady =
        player.ready

      player.ready =
        !player.ready

      if (
        room.game.phase ===
        GAME_PHASES.PICKING &&
        wasReady
      ) {

        room.game.submissions =
          room.game.submissions.filter(
            submission =>
              submission.player.id !==
              player.id
          )

        player.selectedCards = []

        player.selectedCardInstanceIds =
          []
      }

      // PICKING → REVEAL

      if (

        room.game.phase ===
        GAME_PHASES.PICKING &&

        allPlayersReady(room)

      ) {

        room.players.forEach(
          player => {

            player.ready = false
          }
        )

        room.game.phase =
          GAME_PHASES.REVEAL

        scheduleRevealFallback(
          io,
          room
        )

        console.log(
          "phase switched to REVEAL"
        )
      }

      // VOTING → RESULTS

      if (

        room.game.phase ===
        GAME_PHASES.VOTING &&

        allPlayersReady(room)

      ) {

        calculateResults(room)

        console.log(
          "phase switched to RESULTS"
        )
      }

      emitGame(io, room)
    }
  )
}
