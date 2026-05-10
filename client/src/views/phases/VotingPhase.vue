<script setup>
import SubmissionGrid
from "../../components/game/SubmissionGrid.vue"

const props = defineProps({
  blackCard: Object,

  submissions: Array,

  selectedVoteId: [
    String,
    Number
  ],

  currentPlayerId: [
    String,
    Number
  ],

  isReady: Boolean
})

const emit = defineEmits([
  "select-vote"
])

function isOwnSubmission(submission) {

  return (
    submission.player.id ===
    props.currentPlayerId
  )
}

function clickSubmission(submission) {

  if (
    props.isReady ||
    isOwnSubmission(submission)
  ) {
    return
  }

  emit(
    "select-vote",
    submission.id
  )
}
</script>

<template>
  <SubmissionGrid
    :black-card="props.blackCard"

    :submissions="props.submissions"

    :clickable="
      !props.isReady
    "

    :disabled-submission-ids="
      props.submissions
        .filter(isOwnSubmission)
        .map(submission => submission.id)
    "

    :selected-id="
      props.selectedVoteId
    "

    @card-click="
      clickSubmission
    "
  />
</template>
