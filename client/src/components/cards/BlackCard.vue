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
  44
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
  width: clamp(220px, 14.6vw, 380px);
  height: clamp(300px, 19.8vw, 516px);

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

  padding: clamp(20px, 1.8vw, 26px);

  display: flex;
  flex-direction: column;

  margin-bottom: clamp(46px, 11vh, 120px);

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
  transform:
    translate(
      clamp(-80px, -5vw, -34px),
      clamp(-20px, -2vh, -8px)
    );
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
  height: clamp(30px, 4vh, 36px);

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

  font-size: clamp(13px, 1.1vw, 16px);
  font-weight: 900;
  text-transform: uppercase;

  box-shadow:
    0 0 18px rgba(47,230,107,0.35),
    0 0 0 3px rgba(255,255,255,0.04);
}

@media (max-width: 1100px) {
  .black-card {
    width: clamp(184px, 20vw, 220px);
    height: clamp(250px, 27vw, 300px);

    padding: 18px;
  }
}

@media (max-width: 760px) {
  .black-card {
    width: 168px;
    height: 228px;

    padding: 16px;
  }
}

@media (max-width: 420px) and (max-height: 720px) {
  .black-card {
    width: 136px;
    height: 184px;

    padding: 12px;
  }

  .black-card-footer {
    padding-top: 8px;
  }

  .black-card-picks {
    height: 24px;

    padding: 0 9px;

    font-size: 10px;
  }
}
</style>
