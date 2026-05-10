<script setup>
import SubmissionGrid
from "../../components/game/SubmissionGrid.vue"

const props = defineProps({
  blackCard: Object,

  submissions: Array,

  selectedVoteId: [
    String,
    Number
  ]
})

const emit = defineEmits([
  "select-vote"
])

function clickSubmission(id) {

  emit(
    "select-vote",
    id
  )
}
</script>

<template>
  <SubmissionGrid
    :black-card="props.blackCard"

    :submissions="props.submissions"

    :clickable="true"

    :selected-id="
      props.selectedVoteId
    "

    @card-click="
      clickSubmission
    "
  />
</template>