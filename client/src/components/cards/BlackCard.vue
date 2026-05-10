<script setup>
import {
  computed
} from "vue"

import useFitText
from "../../composables/useFitText"

const props = defineProps({
  text: String,

  pickCount: Number,

  previewMode: Boolean
})

const displayText = computed(() => {
  return props.text.replaceAll(
    "[BLANK]",
    "______"
  )
})

const {
  textRef,
  fontSize
} = useFitText(
  () => props.text,
  34
)
</script>

<template>
  <div
    class="black-card"

    :class="{
      'preview-mode': previewMode
    }"
  >

    <div
      ref="textRef"
      class="black-card-text"

      :style="{
        fontSize: fontSize + 'px'
      }"
    >
      {{ displayText }}
    </div>

    <div class="black-card-footer">

      <div class="black-card-picks">
        Pick {{ pickCount }}
      </div>

    </div>

  </div>
</template>

<style scoped>
.black-card {
  width: 280px;
  height: 380px;

  background:
    linear-gradient(
      145deg,
      #101311,
      #030403 58%,
      #000
    );

  border:
    1px solid rgba(255,255,255,0.1);

  border-radius: 18px;

  padding: 26px;

  display: flex;
  flex-direction: column;

  margin-bottom: 120px;

  box-shadow:
    0 24px 0 rgba(0,0,0,0.28),
    0 34px 70px rgba(0,0,0,0.48),
    inset 0 1px 0 rgba(255,255,255,0.08);

  overflow: hidden;

  transition:
    transform 0.18s,
    box-shadow 0.18s;
}

.black-card:not(.preview-mode) {
  transform: translateY(-20px);
  transform: translateX(-80px);
}

.black-card.preview-mode {
  margin-bottom: 0;

  transform: none;
}

.black-card-text {
  flex: 1;

  line-height: 1.12;

  word-break: keep-all;
  overflow-wrap: normal;

  hyphens: none;
}

.black-card-footer {
  display: flex;
  justify-content: flex-end;

  padding-top: 14px;

  flex-shrink: 0;
}

.black-card-picks {
  height: 36px;

  padding: 0 14px;

  border-radius: 8px;

  background:
    linear-gradient(
      180deg,
      var(--game-green),
      var(--game-green-dark)
    );

  color: #041006;

  display: flex;
  align-items: center;
  justify-content: center;

  font-size: 16px;
  font-weight: 900;
  text-transform: uppercase;

  box-shadow:
    0 0 18px rgba(47,230,107,0.35),
    0 0 0 3px rgba(255,255,255,0.04);
}
</style>
