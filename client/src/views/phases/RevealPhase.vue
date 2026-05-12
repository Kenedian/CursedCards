<script setup>
import {
  computed
} from "vue"

import SubmissionGrid
from "../../components/game/SubmissionGrid.vue"

import useRevealSequence
from "../../composables/game/useRevealSequence"

const props = defineProps({
  blackCard: Object,

  submissions: Array
})

const blackCard =
  computed(() => props.blackCard)

const submissions =
  computed(() => props.submissions)

const {
  activeRevealIndex,
  activeAnswerIndex,
  revealedAnswerCount,
  progressiveReveal
} = useRevealSequence({

  blackCard,
  submissions
})
</script>

<template>
  <SubmissionGrid
    :black-card="blackCard"

    :submissions="submissions"

    :active-reveal-index="
      activeRevealIndex
    "

    :active-answer-index="
      activeAnswerIndex
    "

    :revealed-answer-count="
      revealedAnswerCount
    "

    :progressive-reveal="
      progressiveReveal
    "

    reveal-mode
  />
</template> 
