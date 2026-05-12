import {
  computed
}
from "vue"

import useGameStore
from "../../stores/gameStore"

export default function useGameState() {

  const {
    currentLobby,
    currentPlayer
  } = useGameStore()

  const game = computed(() => {
    return currentLobby.value?.game
  })

  const gamePhase = computed(() => {
    return game.value?.phase
  })

  const round = computed(() => {
    return game.value?.round || 1
  })

  const maxRounds = computed(() => {
    return game.value?.maxRounds ?? 10
  })

  const blackCard = computed(() => {
    return game.value?.blackCard
  })

  const handCards = computed(() => {
    return currentPlayer.value?.hand || []
  })

  const submissions = computed(() => {
    return game.value?.submissions || []
  })

  const players = computed(() => {
    return currentLobby.value?.players || []
  })

  const sortedPlayers = computed(() => {

    return [...players.value]
      .sort(
        (a, b) =>
          (b.score || 0)
          -
          (a.score || 0)
      )
  })

  const readyCount = computed(() => {

    return players.value.filter(
      player => player.ready
    ).length
  })

  const totalPlayers = computed(() => {
    return players.value.length
  })

  const isHost = computed(() => {
    return currentPlayer.value?.isHost
  })

  const isReady = computed(() => {
    return currentPlayer.value?.ready
  })

  return {

    currentLobby,
    currentPlayer,

    game,
    gamePhase,

    round,
    maxRounds,

    blackCard,
    handCards,

    submissions,

    players,
    sortedPlayers,

    readyCount,
    totalPlayers,

    isHost,
    isReady
  }
}
