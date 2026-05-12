const {
  GAME_PHASES
} = require("../../../shared/constants/gamePhases")

const {
  allPlayersReady
} = require("../gameService")

function calculateResults(room) {

  room.game.submissions.forEach(
    submission => {

      submission.voteCount = 0
    }
  )

  room.players.forEach(player => {

    const submission =

      room.game.submissions.find(

        sub =>

          sub.id ===
          player.selectedVoteId
      )

    if (submission) {

      submission.voteCount++
    }
  })

  room.game.submissions.forEach(
    submission => {

      const votedPlayer =

        room.players.find(

          player =>

            player.id ===
            submission.player.id
        )

      if (votedPlayer) {

        votedPlayer.score +=
          submission.voteCount
      }
    }
  )

  room.players.forEach(player => {

    player.ready = false
  })

  room.game.phase =
    GAME_PHASES.RESULTS
}

function assignHost(room, player) {
  room.players.forEach(candidate => {
    candidate.isHost =
      candidate.id === player.id
  })

  room.hostId =
    player.id
}

function ensureActiveHost(room) {
  const currentHost =
    room.players.find(player =>
      player.id === room.hostId
    )

  if (
    currentHost &&
    currentHost.connected !== false
  ) {
    assignHost(
      room,
      currentHost
    )

    return false
  }

  const nextHost =
    room.players.find(player =>
      player.connected !== false
    )

  if (!nextHost) {
    return false
  }

  assignHost(
    room,
    nextHost
  )

  return true
}

function removePlayerFromRoom(
  room,
  playerId
) {

  room.players =
    room.players.filter(

      player =>

        player.id !== playerId
    )

  if (room.game) {

    // remove submissions

    room.game.submissions =

      (room.game.submissions || [])
        .filter(

          submission =>

            submission.player.id !==
            playerId
        )

    // clear invalid votes

    room.players.forEach(player => {

      const votedSubmissionExists =

        room.game.submissions.some(

          submission =>

            submission.id ===
            player.selectedVoteId
        )

      if (!votedSubmissionExists) {

        player.selectedVoteId =
          null

        player.ready = false
      }
    })

    // game over

    if (
      room.players.length < 3
    ) {

      room.game.phase =
        GAME_PHASES.GAME_OVER
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
    }

    // VOTING → RESULTS

    if (

      room.game.phase ===
      GAME_PHASES.VOTING &&

      allPlayersReady(room)

    ) {

      calculateResults(room)
    }
  }

  // transfer host

  if (

    room.hostId === playerId &&

    room.players.length > 0

  ) {

    assignHost(
      room,
      room.players[0]
    )
  }
}

module.exports = {

  removePlayerFromRoom,
  ensureActiveHost,
  calculateResults
}
