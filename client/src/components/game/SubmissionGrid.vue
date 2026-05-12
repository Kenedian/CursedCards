<script setup>
import {
  computed,
  nextTick,
  onBeforeUpdate,
  ref,
  watch
}
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

  disabledSubmissionIds: {
    type: Array,
    default: () => []
  },

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

const gridRef =
  ref(null)

const cardRefs =
  ref([])

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

function isDisabled(submission) {

  return props.disabledSubmissionIds.includes(
    submission.id
  )
}

function clickSubmission(submission) {

  if (
    isDisabled(submission) ||
    props.revealMode
  ) {
    return
  }

  emit(
    "card-click",
    submission
  )
}

function setCardRef(element, index) {
  cardRefs.value[index] =
    element?.$el ||
    element
}

async function scrollActiveCardIntoView(index) {
  if (
    !props.revealMode ||
    index < 0
  ) {
    return
  }

  await nextTick()

  const grid =
    gridRef.value

  const card =
    cardRefs.value[index]

  if (
    !grid ||
    !card ||
    grid.scrollWidth <= grid.clientWidth
  ) {
    return
  }

  card.scrollIntoView({
    behavior: "smooth",
    block: "nearest",
    inline: "center"
  })
}

onBeforeUpdate(() => {
  cardRefs.value = []
})

watch(
  () => props.activeRevealIndex,
  scrollActiveCardIntoView
)
</script>

<template>
  <div class="submission-phase">

    <div
      ref="gridRef"
      class="submission-grid"
    >

      <RevealCard
        v-for="
          (submission, index)
          in displayedSubmissions
        "

        :key="submission.id"

        :ref="
          element =>
            setCardRef(element, index)
        "

        :black-card-text="
          blackCard.text
        "

        :selected-cards="
          submission.cards
        "

        :clickable="
          clickable &&
          !revealMode &&
          !isDisabled(submission)
        "

        :disabled="
          isDisabled(submission)
        "

        :selected="
          selectedId === submission.id
        "

        :vote-count="
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
          clickSubmission(submission)
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

  padding:
    clamp(10px, 2vh, 20px);
}

.submission-grid {
  display: grid;

  grid-template-columns:
    repeat(4, 1fr);

  gap: clamp(14px, 1.5vw, 28px);

  justify-items: center;
  align-items: center;

  transition:
    transform 0.4s ease;
}

@media (max-width: 1600px) {

  .submission-grid {
    transform: scale(0.96);
  }
}

@media (max-width: 1400px) {

  .submission-grid {
    transform: scale(0.9);
  }
}

@media (max-width: 1200px) {

  .submission-grid {
    transform: scale(0.82);
  }
}

@media (max-width: 1000px) {
  .submission-phase {
    align-items: flex-start;

    overflow-y: auto;
  }

  .submission-grid {
    width: 100%;

    grid-template-columns:
      repeat(3, minmax(0, 1fr));

    gap: 14px;

    transform: none;
  }
}

@media (max-height: 820px) {
  .submission-grid {
    transform: scale(0.84);
  }
}

@media (max-height: 720px) {
  .submission-grid {
    transform: scale(0.74);
  }
}

@media (min-width: 2200px) and (min-height: 1200px) {
  .submission-grid {
    transform: scale(1.12);
  }
}

@media (max-width: 760px) {
  .submission-phase {
    align-items: center;

    overflow: hidden;

    padding: 10px 0 18px;
  }

  .submission-grid,
  .submission-grid {
    width: 100%;

    display: flex;

    justify-content: flex-start;
    align-items: center;

    gap: 14px;

    overflow-x: auto;
    overflow-y: visible;

    padding:
      24px
      calc((100vw - 132px) / 2)
      22px;

    scroll-snap-type: x mandatory;
    scroll-padding-inline:
      calc((100vw - 132px) / 2);

    transform: none;
  }

  .submission-grid :deep(.reveal-card) {
    flex: 0 0 auto;

    scroll-snap-align: center;
  }
}

@media (max-width: 420px) and (max-height: 720px) {
  .submission-phase {
    padding: 6px 0 12px;
  }

  .submission-grid,
  .submission-grid {
    gap: 12px;

    padding:
      20px
      calc((100vw - 112px) / 2)
      18px;

    scroll-padding-inline:
      calc((100vw - 112px) / 2);
  }
}
</style>
