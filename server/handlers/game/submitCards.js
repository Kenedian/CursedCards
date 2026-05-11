const rooms =
  require("../../state/rooms")

const crypto =
  require("crypto")

const {
  SOCKET_EVENTS
} = require("../../../shared/constants/socketEvents")

const {
  GAME_PHASES
} = require("../../../shared/constants/gamePhases")

module.exports =
function registerSubmitCards(
  io,
  socket
) {

  socket.on(
    SOCKET_EVENTS.SUBMIT_CARDS,

    data => {

      const room =
        rooms.get(data.code)

      if (
        !room?.game ||
        room.game.phase !==
        GAME_PHASES.PICKING
      ) {
        return
      }

      const player =
        room.players.find(
          p => p.id === socket.id
        )

      if (
        !player ||
        player.ready
      ) {
        return
      }

      const selectedInstanceIds =
        data.cards || []

      const handCardsByInstanceId =
        new Map(
          player.hand.map(card => [
            card.instanceId,
            card
          ])
        )

      const selectedCards =
        selectedInstanceIds
          .map(instanceId =>
            handCardsByInstanceId.get(
              instanceId
            )
          )
          .filter(Boolean)

      player.selectedCards =
        [...selectedCards]

      player.selectedCardInstanceIds =
        [...selectedInstanceIds]

      const existingSubmission =
        room.game.submissions.find(
          submission =>
            submission.player.id ===
            player.id
        )

      const submission = {

        id:
          existingSubmission?.id ||
          crypto.randomUUID(),

        player: {

          id:
            player.id,

          username:
            player.username
        },

        cards:
          [...selectedCards],

        voteCount: 0
      }

      if (existingSubmission) {

        Object.assign(
          existingSubmission,
          submission
        )

        return
      }

      room.game.submissions.push(
        submission
      )
    }
  )
}
