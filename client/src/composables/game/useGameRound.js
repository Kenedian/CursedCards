import {
  ref,
  computed
} from "vue"

import { GAME_PHASES }
from "../../../../shared/constants/gamePhases"

import PickingPhase
from "../../views/phases/PickingPhase.vue"

import RevealPhase
from "../../views/phases/RevealPhase.vue"

import VotingPhase
from "../../views/phases/VotingPhase.vue"

import ResultsPhase
from "../../views/phases/ResultsPhase.vue"

import GameOverPhase
from "../../views/phases/GameOverPhase.vue"

export default function useGameRound({
  getRandomWhiteCards,
  getRandomBlackCard
}) {

  const gamePhase =
    ref(GAME_PHASES.PICKING)

  const round = ref(1)

  const maxRounds = 10

  const blackCard = ref(
    getRandomBlackCard()
  )

  const handCards = ref(
    getRandomWhiteCards(6)
  )

  const selectedCards =
    ref([])

  const selectedVoteId =
    ref(null)

  function toggleCard(cardText) {

    const index =
      selectedCards.value.indexOf(
        cardText
      )

    if (index !== -1) {

      selectedCards.value.splice(
        index,
        1
      )

      return
    }

    if (
      selectedCards.value.length >=
      blackCard.value.pickCount
    ) {
      return
    }

    selectedCards.value.push(
      cardText
    )
  }

  function selectVote(id) {

    if (
      selectedVoteId.value === id
    ) {
      return
    }

    selectedVoteId.value = id
  }

  function resetRoundState() {

    selectedCards.value = []

    selectedVoteId.value = null
  }

  function nextRound() {

    if (
      round.value >= maxRounds
    ) {

      gamePhase.value =
        GAME_PHASES.GAME_OVER

      return
    }

    round.value++

    resetRoundState()

    blackCard.value =
      getRandomBlackCard()

    handCards.value =
      getRandomWhiteCards(6)

    gamePhase.value =
      GAME_PHASES.PICKING
  }

  function resetGame() {

    round.value = 1

    resetRoundState()

    blackCard.value =
      getRandomBlackCard()

    handCards.value =
      getRandomWhiteCards(6)

    gamePhase.value =
      GAME_PHASES.PICKING
  }

  const currentPhase =
    computed(() => {

      switch (
        gamePhase.value
      ) {

        case GAME_PHASES.PICKING:
          return PickingPhase

        case GAME_PHASES.REVEAL:
          return RevealPhase

        case GAME_PHASES.VOTING:
          return VotingPhase

        case GAME_PHASES.RESULTS:
          return ResultsPhase

        case GAME_PHASES.GAME_OVER:
          return GameOverPhase
      }
    })

  const canReady =
    computed(() => {

      if (
        gamePhase.value ===
        GAME_PHASES.PICKING
      ) {

        return (
          selectedCards.value.length ===
          blackCard.value.pickCount
        )
      }

      if (
        gamePhase.value ===
        GAME_PHASES.VOTING
      ) {

        return (
          selectedVoteId.value !== null
        )
      }

      return true
    })

  return {

    gamePhase,

    round,
    maxRounds,

    blackCard,
    handCards,

    selectedCards,
    selectedVoteId,

    currentPhase,
    canReady,

    toggleCard,
    selectVote,

    nextRound,
    resetGame
  }
}