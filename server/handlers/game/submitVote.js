const rooms =
  require("../../state/rooms")

const {
  SOCKET_EVENTS
} = require("../../../shared/constants/socketEvents")

module.exports =
function registerSubmitVote(
  io,
  socket
) {

  socket.on(
    SOCKET_EVENTS.SUBMIT_VOTE,

    ({
      code,
      submissionId
    }) => {

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

      player.selectedVoteId =
        submissionId

      console.log(
        "vote submitted:",
        player.username,
        submissionId
      )
    }
  )
}