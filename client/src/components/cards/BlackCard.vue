<script setup>
import {
  computed
} from "vue"

import useFitText
from "../../composables/useFitText"

const props = defineProps({
  text: String,

  pickCount: Number,

  previewMode: Boolean,

  maxFontSize: {
    type: [
      Number,
      Function
    ],
    default: 44
  },

  minFontSize: {
    type: Number,
    default: 6
  }
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
  () => {
    if (
      typeof props.maxFontSize === "function"
    ) {
      return props.maxFontSize()
    }

    return props.maxFontSize
  },
  props.minFontSize
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
  width: clamp(218px, 14.8vw, 310px);
  height: clamp(294px, 19.9vw, 418px);

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

  padding: clamp(18px, 1.15vw, 24px);

  display: flex;
  flex-direction: column;

  margin-bottom: clamp(30px, 6vh, 110px);

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
      clamp(-130px, -5vw, -34px),
      clamp(-34px, -2vh, -8px)
    );
}

.black-card.preview-mode {
  width: clamp(138px, 7.6vw, 164px);
  height: clamp(186px, 10.3vw, 222px);

  padding: clamp(12px, 0.72vw, 15px);

  margin-bottom: 0;

  transform: none;
}

.black-card.preview-mode .black-card-footer {
  padding-top: 9px;
}

.black-card.preview-mode .black-card-picks {
  height: 24px;

  padding: 0 9px;

  font-size: 10px;
}

.black-card-text {
  flex: 1;
  min-height: 0;

  line-height: 1.12;

  word-break: keep-all;
  overflow-wrap: normal;

  hyphens: none;

  overflow: hidden;
}

.black-card-footer {
  display: flex;
  justify-content: flex-end;

  padding-top: 14px;

  flex-shrink: 0;
}

.black-card-picks {
  height: clamp(28px, 2.1vw, 40px);

  padding: 0 clamp(14px, 0.8vw, 28px);

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

  font-size: clamp(12px, 0.72vw, 15px);
  font-weight: 900;
  text-transform: uppercase;

  box-shadow:
    0 0 18px rgba(47,230,107,0.35),
    0 0 0 3px rgba(255,255,255,0.04);
}

@media (max-width: 999px) {
  .black-card {
    width: clamp(184px, 20vw, 220px);
    height: clamp(250px, 27vw, 300px);

    padding: 18px;
  }

  .black-card-text {
    word-break: normal;
    overflow-wrap: break-word;

    hyphens: manual;
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
