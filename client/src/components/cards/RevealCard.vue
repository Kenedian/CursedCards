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
  disabled: Boolean,

  voteCount: Number,
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
  40
)
</script>

<template>
  <div
    class="reveal-card"

    :class="{
      clickable: props.clickable,
      selected: props.selected,
      disabled: props.disabled,
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

  width: clamp(176px, 10.4vw, 330px);
  height: clamp(236px, 13.9vw, 442px);

  background:
    linear-gradient(
      145deg,
      #101311,
      #030403 58%,
      #000
    );

  border:
    1px solid rgba(255,255,255,0.1);

  border-radius: 14px;

  padding: clamp(20px, 1.25vw, 42px);

  display: flex;
  flex-direction: column;

  overflow: hidden;

  opacity: 0.16;

  transform:
    scale(0.92);

  filter:
    blur(2px);

  box-shadow:
    0 16px 0 rgba(0,0,0,0.24),
    0 24px 42px rgba(0,0,0,0.42),
    inset 0 1px 0 rgba(255,255,255,0.08);

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
    0 16px 0 rgba(0,0,0,0.24),
    0 0 0 3px #2fe66b,
    0 0 55px rgba(47,230,107,0.35),
    0 0 100px rgba(47,230,107,0.12);
}

.reveal-card-text {
  flex: 1;
  min-height: 0;

  line-height: 1.18;

  overflow: hidden;

  word-break: normal;
  overflow-wrap: break-word;
  hyphens: manual;
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

.reveal-card.disabled {
  cursor: not-allowed;

  opacity: 0.34;
  filter:
    grayscale(1)
    brightness(0.55);

  box-shadow:
    0 0 0 2px rgba(255,80,80,0.26),
    0 0 25px rgba(0,0,0,0.35);
}

.reveal-card.disabled::after {
  content: "Locked";

  position: absolute;

  left: 14px;
  bottom: 12px;

  padding: 4px 8px;

  border-radius: 999px;

  background:
    rgba(255,80,80,0.18);

  color:
    rgba(255,210,210,0.9);

  font-size: 12px;
  font-weight: 700;
}

.reveal-card.disabled:hover {
  transform:
    scale(0.98);
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

  top: clamp(7px, 0.45vw, 14px);
  right: clamp(7px, 0.45vw, 14px);

  width: clamp(22px, 1.45vw, 42px);
  height: clamp(22px, 1.45vw, 42px);

  border-radius: 999px;

  background: var(--game-green);
  color: #041006;

  display: flex;
  justify-content: center;
  align-items: center;

  font-size: clamp(16px, 0.95vw, 28px);
  font-weight: bold;

  box-shadow:
    0 0 12px rgba(47,230,107,0.4);
}

.player-name {
  position: absolute;

  right: clamp(14px, 0.95vw, 28px);
  bottom: clamp(8px, 0.6vw, 18px);

  max-width: 72%;

  font-size: clamp(13px, 0.8vw, 24px);
  font-weight: bold;

  color: rgba(255,255,255,0.75);

  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  text-align: right;
}

@media (max-width: 760px) {
  .reveal-card {
    width: 132px;
    height: 176px;

    padding: 14px;
  }

  .votes-badge {
    width: 22px;
    height: 22px;

    font-size: 14px;
  }

  .player-name {
    right: 10px;
    bottom: 8px;

    font-size: 11px;
  }

  .reveal-card.clickable:hover:not(.selected) {
    transform:
      translateY(-2px)
      scale(1.02);
  }

  .reveal-card.selected {
    transform:
      translateY(-2px)
      scale(1.04);
  }

  .reveal-card.winner,
  .reveal-card.active {
    transform:
      scale(1.05);
  }
}

@media (max-width: 1000px) and (min-width: 761px) {
  .reveal-card {
    width: clamp(138px, 18vw, 170px);
    height: clamp(184px, 24vw, 226px);

    padding: 16px;
  }
}

@media (max-width: 420px) and (max-height: 720px) {
  .reveal-card {
    width: 112px;
    height: 150px;

    padding: 11px;
  }
}
</style>
