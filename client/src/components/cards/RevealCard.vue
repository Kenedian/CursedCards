<script setup>
import {
  computed
} from "vue"

import useFitText
from "../../composables/useFitText"

import formatBlackCardText
from "../../utils/cards/formatBlackCardText"

const props = defineProps({
  blackCardText: String,

  selectedCards: {
    type: Array,
    default: () => []
  },

  clickable: Boolean,
  selected: Boolean,

  votes: Number,
  winner: Boolean,
  playerName: String,
  showPlayer: Boolean,

  revealed: Boolean,
  active: Boolean
})

const formattedText = computed(() => {

  let formatted =
    formatBlackCardText(
      props.blackCardText,
      props.selectedCards
    )

  props.selectedCards.forEach(card => {

    formatted = formatted.replace(
      card.text,

      `
        <span class="answer-text">
          ${card.text}
        </span>
      `
    )
  })

  return formatted
})

const {
  textRef,
  fontSize
} = useFitText(
  () => [
    props.blackCardText,
    props.selectedCards
  ],
  28
)
</script>

<template>
  <div
    class="reveal-card"

    :class="{
      clickable: props.clickable,
      selected: props.selected,
      winner: props.winner,

      revealed: props.revealed,
      active: props.active
    }"
  >

    <div
      v-if="props.voteCount !== undefined"
      class="votes-badge"
    >
      {{ props.voteCount }}
    </div>

    <div
      v-if="props.showPlayer"
      class="player-name"
    >
      {{ props.playerName }}
    </div>

    <div
      ref="textRef"

      class="reveal-card-text"

      :style="{
        fontSize: fontSize + 'px'
      }"

      v-html="formattedText"
    ></div>

  </div>
</template>

<style scoped>
.reveal-card {
  position: relative;

  width: 180px;
  height: 240px;

  background:
    linear-gradient(
      180deg,
      #080808 0%,
      #040404 100%
    );

  border-radius: 28px;

  padding: 26px;

  display: flex;
  flex-direction: column;

  overflow: hidden;

  opacity: 0.16;

  transform:
    scale(0.92);

  filter:
    blur(2px);

  box-shadow:
    0 0 35px rgba(0,0,0,0.45);

  transition:
    transform 0.45s cubic-bezier(.2,1,.2,1),
    opacity 0.45s,
    filter 0.45s,
    box-shadow 0.45s,
    border 0.45s;
}

.reveal-card.revealed {
  opacity: 0.72;

  transform:
    scale(0.98);

  filter:
    blur(0);
}

.reveal-card.active {
  opacity: 1;

  transform:
    scale(1.08);

  z-index: 20;

  box-shadow:
    0 0 0 3px #2fe66b,
    0 0 55px rgba(47,230,107,0.35),
    0 0 100px rgba(47,230,107,0.12);
}

.reveal-card-text {
  flex: 1;

  line-height: 1.18;

  word-break: keep-all;
  overflow-wrap: normal;
  hyphens: none;
}

.reveal-card-text :deep(.answer-text) {
  font-weight: bold;

  color: #2fe66b;

  text-shadow:
    0 0 10px rgba(47,230,107,0.25);

  opacity: 0;

  filter: blur(8px);

  transition:
    opacity 0.35s ease,
    filter 0.35s ease;
}

.reveal-card.revealed
.reveal-card-text
:deep(.answer-text) {

  opacity: 1;

  filter: blur(0);
}

.reveal-card.clickable {
  cursor: pointer;
}

.reveal-card.clickable:hover:not(.selected) {
  transform:
    translateY(-6px)
    scale(1.02);

  opacity: 1;

  box-shadow:
    0 0 45px rgba(0,0,0,0.5);
}

.reveal-card.selected {
  transform:
    translateY(-8px)
    scale(1.04);

  opacity: 1;

  box-shadow:
    0 0 0 3px #2fe66b,
    0 0 35px rgba(47,230,107,0.28);
}

.reveal-card.winner {
  transform:
    scale(1.1);

  opacity: 1;

  box-shadow:
    0 0 0 3px #2fe66b,
    0 0 60px rgba(47,230,107,0.45),
    0 0 120px rgba(47,230,107,0.18);

  z-index: 50;
}

.votes-badge {
  position: absolute;

  top: 7.5px;
  right: 7.5px;

  width: 22px;
  height: 22px;

  border-radius: 999px;

  background: #2fe66b;
  color: black;

  display: flex;
  justify-content: center;
  align-items: center;

  font-size: 18px;
  font-weight: bold;

  box-shadow:
    0 0 12px rgba(47,230,107,0.4);
}

.player-name {
  position: absolute;

  right: 18px;
  bottom: 10px;

  max-width: 130px;

  font-size: 14px;
  font-weight: bold;

  color: rgba(255,255,255,0.75);

  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  text-align: right;
}
</style>