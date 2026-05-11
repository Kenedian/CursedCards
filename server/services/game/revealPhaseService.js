const {
  GAME_PHASES
} = require("../../../shared/constants/gamePhases")

const {
  emitGame
} = require("../../emitters/gameEmitter")

const revealTimers =
  new Map()

function getRevealFallbackDelay(room) {
  const submissionCount =
    room.game?.submissions?.length || 0

  return 15000 + (submissionCount * 12000)
}

function scheduleRevealFallback(io, room) {
  const existingTimer =
    revealTimers.get(room.code)

  if (existingTimer) {
    clearTimeout(existingTimer)
  }

  const timer =
    setTimeout(() => {
      revealTimers.delete(room.code)

      if (
        room.game?.phase !==
        GAME_PHASES.REVEAL
      ) {
        return
      }

      room.players.forEach(player => {
        player.ready = false
      })

      room.game.phase =
        GAME_PHASES.VOTING

      emitGame(io, room)

      console.log(
        "Reveal fallback -> Voting started"
      )
    }, getRevealFallbackDelay(room))

  revealTimers.set(
    room.code,
    timer
  )
}

module.exports = {
  scheduleRevealFallback
}
