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

export default function useGameSelections({
  gamePhase,
  blackCard
}) {

  // array of instanceIds

  const selectedCards =
    ref([])

  const selectedVoteId =
    ref(null)

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

    const maxPickCount =
      blackCard.value?.pickCount || 1

    if (
      selectedCards.value.length >=
      maxPickCount
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

      const pickCount =
        blackCard.value?.pickCount || 1

      // PICKING

      if (
        gamePhase.value ===
        GAME_PHASES.PICKING
      ) {

        return (
          selectedCards.value.length
          ===
          pickCount
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