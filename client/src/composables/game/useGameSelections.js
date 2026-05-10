import {
  ref,
  computed,
  watch
}
from "vue"

import {
  GAME_PHASES
}
from "../../../../shared/constants/gamePhases"

import getBlackCardPickCount
from "../../utils/cards/getBlackCardPickCount"

export default function useGameSelections({
  gamePhase,
  blackCard
}) {

  // array of instanceIds

  const selectedCards =
    ref([])

  const selectedVoteId =
    ref(null)

  const pickCount =
    computed(() => {

      return Math.max(
        getBlackCardPickCount(
          blackCard.value?.text || ""
        ),
        1
      )
    })

  function toggleCard(
    instanceId
  ) {

    const alreadySelected =
      selectedCards.value.includes(
        instanceId
      )

    // unselect

    if (alreadySelected) {

      selectedCards.value =
        selectedCards.value.filter(
          id =>
            id !== instanceId
        )

      return
    }

    // max selected

    if (
      selectedCards.value.length >=
      pickCount.value
    ) {

      return
    }

    selectedCards.value.push(
      instanceId
    )
  }

  function selectVote(id) {

    selectedVoteId.value =
      id
  }

  function resetSelections() {

    selectedCards.value = []

    selectedVoteId.value =
      null
  }

  watch(
    gamePhase,

    phase => {

      // new round

      if (
        phase ===
        GAME_PHASES.PICKING
      ) {

        resetSelections()
      }

      // clear vote selection

      if (
        phase ===
        GAME_PHASES.RESULTS
      ) {

        selectedVoteId.value =
          null
      }
    }
  )

  const canReady =
    computed(() => {

      // PICKING

      if (
        gamePhase.value ===
        GAME_PHASES.PICKING
      ) {

        return (
          selectedCards.value.length
          ===
          pickCount.value
        )
      }

      // VOTING

      if (
        gamePhase.value ===
        GAME_PHASES.VOTING
      ) {

        return (
          selectedVoteId.value
          !== null
        )
      }

      return true
    })

  return {

    selectedCards,
    selectedVoteId,

    canReady,

    toggleCard,
    selectVote,

    resetSelections
  }
}
