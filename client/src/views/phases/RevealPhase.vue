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
  activeRevealIndex
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

    reveal-mode
  />
</template> 