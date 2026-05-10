const rooms =
  require("../../state/rooms")

const crypto =
  require("crypto")

const {
  SOCKET_EVENTS
} = require("../../../shared/constants/socketEvents")

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

      if (!room?.game) {
        return
      }

      const player =
        room.players.find(
          p => p.id === socket.id
        )

      if (!player) {
        return
      }

      const selectedInstanceIds =
        data.cards || []

      const selectedCards =
        player.hand.filter(
          card =>

            selectedInstanceIds.includes(
              card.instanceId
            )
        )

      player.selectedCards =
        [...selectedCards]

      player.selectedCardInstanceIds =
        [...selectedInstanceIds]

      room.game.submissions.push({

        id:
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
      })
    }
  )
}