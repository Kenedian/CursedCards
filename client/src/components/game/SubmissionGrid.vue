<script setup>
import { computed }
from "vue"

import RevealCard
from "../cards/RevealCard.vue"

const props = defineProps({
  blackCard: Object,

  submissions: {
    type: Array,
    default: () => []
  },

  clickable: Boolean,

  selectedId: [
    String,
    Number
  ],

  showVotes: Boolean,
  showPlayer: Boolean,
  highlightWinner: Boolean,

  sortByVotes: Boolean,

  revealMode: Boolean,

  activeRevealIndex: {
    type: Number,
    default: -1
  }
})

const emit = defineEmits([
  "card-click"
])

const displayedSubmissions = computed(() => {

  if (!props.sortByVotes) {
    return props.submissions
  }

  return [...props.submissions]
    .sort(
      (a, b) =>

        (b.voteCount || 0)
        -
        (a.voteCount || 0)
    )
})

const highestVotes = computed(() => {

  if (!displayedSubmissions.value.length) {
    return 0
  }

  return Math.max(

    ...displayedSubmissions.value.map(

      submission =>

        submission.voteCount || 0
    )
  )
})
</script>

<template>
  <div class="submission-phase">

    <div class="submission-grid">

      <RevealCard
        v-for="
          (submission, index)
          in displayedSubmissions
        "

        :key="submission.id"

        :black-card-text="
          blackCard.text
        "

        :selected-cards="
          submission.cards
        "

        :clickable="
          clickable &&
          !revealMode
        "

        :selected="
          selectedId === submission.id
        "

        :votes="
          showVotes
            ? submission.voteCount
            : undefined
        "

        :show-player="
          showPlayer
        "

        :player-name="
          submission.player.username
        "

        :winner="
          highlightWinner &&
          submission.voteCount === highestVotes
        "

        :revealed="
          !revealMode ||
          index <= activeRevealIndex
        "

        :active="
          revealMode &&
          index === activeRevealIndex
        "

        @click="
          emit(
            'card-click',
            submission.id
          )
        "
      />

    </div>

  </div>
</template>

<style scoped>
.submission-phase {
  flex: 1;

  display: flex;
  justify-content: center;
  align-items: center;

  overflow: hidden;

  padding: 20px;
}

.submission-grid {
  display: grid;

  grid-template-columns:
    repeat(4, 1fr);

  gap: 28px;

  justify-items: center;
  align-items: center;

  transition:
    transform 0.4s ease;
}

@media (max-width: 1600px) {

  .submission-grid {
    gap: 22px;

    transform: scale(0.92);
  }
}

@media (max-width: 1400px) {

  .submission-grid {
    gap: 18px;

    transform: scale(0.82);
  }
}

@media (max-width: 1200px) {

  .submission-grid {
    gap: 14px;

    transform: scale(0.72);
  }
}
</style>