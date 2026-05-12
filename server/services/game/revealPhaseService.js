const {
  GAME_PHASES
} = require("../../../shared/constants/gamePhases")

const {
  emitGame
} = require("../../emitters/gameEmitter")

const revealTimers =
  new Map()

function formatRevealText(blackText, cards = []) {
  let index = 0

  return (blackText || "").replace(
    /_{3,}|\[BLANK\]/g,
    () => {
      const card =
        cards[index++]

      return card?.text || "_____"
    }
  )
}

function getRevealSpeechDelay(text) {
  return Math.max(
    6500,
    text.length * 120
  )
}

function getRevealMinimumDelay(room) {
  const submissions =
    room.game?.submissions || []

  const blackText =
    room.game?.blackCard?.text || ""

  const perSubmissionDelay =
    submissions.reduce(
      (total, submission) => {
        const revealText =
          formatRevealText(
            blackText,
            submission.cards
          )

        return (
          total +
          350 +
          getRevealSpeechDelay(revealText) +
          650
        )
      },
      0
    )

  return 1400 + perSubmissionDelay + 1800
}

function getRevealFallbackDelay(room) {
  return getRevealMinimumDelay(room) + 8000
}

function getRevealPlayerKey(player) {
  return player?.sessionId || player?.id
}

function getConnectedRevealPlayerKeys(room) {
  return room.players
    .filter(player =>
      player.connected !== false
    )
    .map(getRevealPlayerKey)
    .filter(Boolean)
}

function clearRevealTimer(room) {
  const existingTimer =
    revealTimers.get(room.code)

  if (existingTimer) {
    clearTimeout(existingTimer)
  }

  revealTimers.delete(room.code)
}

function completeReveal(io, room, reason) {
  clearRevealTimer(room)

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
    `Reveal ${reason} -> Voting started`
  )
}

function scheduleRevealFallback(io, room) {
  clearRevealTimer(room)

  room.game.revealStartedAt =
    Date.now()

  room.game.revealMinimumDelay =
    getRevealMinimumDelay(room)

  room.game.revealFinishedPlayerKeys =
    []

  const timer =
    setTimeout(() => {
      completeReveal(
        io,
        room,
        "fallback"
      )
    }, getRevealFallbackDelay(room))

  revealTimers.set(
    room.code,
    timer
  )
}

function completeRevealIfEveryoneFinished(io, room) {
  if (
    room.game?.phase !==
    GAME_PHASES.REVEAL
  ) {
    return false
  }

  const requiredKeys =
    getConnectedRevealPlayerKeys(room)

  if (!requiredKeys.length) {
    return false
  }

  const finishedKeys =
    new Set(
      room.game.revealFinishedPlayerKeys || []
    )

  const allFinished =
    requiredKeys.every(key =>
      finishedKeys.has(key)
    )

  if (!allFinished) {
    return false
  }

  completeReveal(
    io,
    room,
    "all clients finished"
  )

  return true
}

function handleRevealFinished(io, room, playerId) {
  if (
    room.game?.phase !==
    GAME_PHASES.REVEAL
  ) {
    return
  }

  const player =
    room.players.find(
      player =>
        player.id === playerId
    )

  if (
    !player ||
    player.connected === false
  ) {
    return
  }

  const playerKey =
    getRevealPlayerKey(player)

  if (!playerKey) {
    return
  }

  const finishedKeys =
    new Set(
      room.game.revealFinishedPlayerKeys || []
    )

  finishedKeys.add(playerKey)

  room.game.revealFinishedPlayerKeys =
    [...finishedKeys]

  if (
    completeRevealIfEveryoneFinished(
      io,
      room
    )
  ) {
    return
  }

  console.log(
    "Reveal client finished; waiting for remaining clients"
  )
}

function handleRevealPlayerUnavailable(io, room) {
  completeRevealIfEveryoneFinished(
    io,
    room
  )
}

module.exports = {
  completeReveal,
  scheduleRevealFallback,
  handleRevealFinished,
  handleRevealPlayerUnavailable
}
