const rooms =
  require("../../state/rooms")

const {
  SOCKET_EVENTS
} = require("../../../shared/constants/socketEvents")

const {
  GAME_PHASES
} = require("../../../shared/constants/gamePhases")

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

      if (
        !room?.game ||
        room.game.phase !==
        GAME_PHASES.VOTING
      ) {
        return
      }

      const player =
        room.players.find(

          p =>

            p.id ===
            socket.id
        )

      if (
        !player ||
        player.ready
      ) {
        return
      }

      const submission =
        room.game.submissions.find(
          submission =>
            submission.id ===
            submissionId
        )

      if (
        !submission ||
        submission.player.id ===
        player.id
      ) {
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
