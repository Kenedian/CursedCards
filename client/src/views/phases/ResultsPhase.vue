<script setup>
import SubmissionGrid
from "../../components/game/SubmissionGrid.vue"

defineProps({
  blackCard: Object,
  submissions: Array
})
</script>

<template>
  <SubmissionGrid
    :black-card="blackCard"

    :submissions="submissions"

    :show-votes="true"
    :show-player="true"

    :highlight-winner="true"

    :sort-by-votes="true"
  />
</template>