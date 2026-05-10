import {
  computed
}
from "vue"

import {
  GAME_PHASES
}
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

export default function useGamePhase(
  gamePhase
) {

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

        default:
          return PickingPhase
      }
    })

  return {
    currentPhase
  }
}