<script setup>
import useFitText
from "../../composables/useFitText"

const props = defineProps({
  text: String,

  pickedOrder: Number,

  previewMode: Boolean
})

const {
  textRef,
  fontSize
} = useFitText(
  () => props.text,
  28
)
</script>

<template>
  <div
    class="white-card-wrapper"

    :class="{
      picked: pickedOrder,
      'preview-mode': previewMode
    }"
  >

    <div class="white-card">

      <div class="white-card-top">

        <div
          v-if="pickedOrder"
          class="pick-order"
        >
          {{ pickedOrder }}
        </div>

      </div>

      <div
        ref="textRef"
        class="white-card-text"

        :style="{
          fontSize: fontSize + 'px'
        }"
      >
        {{ text }}
      </div>

    </div>

  </div>
</template>

<style scoped>
.white-card-wrapper {
  position: relative;

  z-index: 1;
}

.white-card-wrapper:hover {
  z-index: 500;
}

.white-card-wrapper.picked {
  z-index: 200;
}

.white-card {
  width: 180px;
  height: 240px;

  background:
    linear-gradient(
      145deg,
      #fffdf2,
      #e8e2cf 100%
    );

  color: #070707;

  border:
    1px solid rgba(0,0,0,0.16);

  border-radius: 14px;

  padding: 18px;

  margin-left: -26px;

  transform: translateY(125px);

  transition:
    transform 0.18s,
    box-shadow 0.18s;

  cursor: pointer;

  box-shadow:
    0 14px 0 rgba(0,0,0,0.24),
    0 22px 30px rgba(0,0,0,0.32),
    inset 0 1px 0 rgba(255,255,255,0.85);

  overflow: hidden;

  display: flex;
  flex-direction: column;
}

.white-card-wrapper:not(.preview-mode)
.white-card:hover {
  transform:
    translateY(-20px)
    scale(1.04);
}

.white-card-wrapper.picked:not(.preview-mode)
.white-card {
  transform:
    translateY(-45px)
    scale(1.04);

  box-shadow:
    0 18px 0 rgba(0,0,0,0.22),
    0 26px 40px rgba(0,0,0,0.34),
    0 0 0 4px rgba(47,230,107,0.35),
    0 0 30px rgba(47,230,107,0.18);
}

.white-card-wrapper.picked:hover {
  z-index: 999;
}

.white-card-wrapper.preview-mode {
  z-index: auto;
}

.white-card-wrapper.preview-mode:hover {
  z-index: auto;
}

.white-card-wrapper.preview-mode .white-card {
  margin-left: 0;

  transform: none;

  cursor: default;
}

.white-card-top {
  height: 26px;

  display: flex;
  align-items: flex-start;

  flex-shrink: 0;

  margin:
    -18px
    -18px
    20px
    -18px;
}

.pick-order {
  width: 42px;
  height: 42px;

  border-bottom-right-radius: 12px;
  border-top-left-radius: 14px;

  background:
    linear-gradient(
      180deg,
      var(--game-green),
      var(--game-green-dark)
    );

  color: #041006;

  display: flex;
  justify-content: center;
  align-items: center;

  font-size: 18px;
  font-weight: 900;

  box-shadow:
    0 0 14px rgba(47,230,107,0.45);
}

.white-card-text {
  height: 65%;

  line-height: 1.15;

  font-weight: 900;

  overflow: hidden;

  word-break: keep-all;
  overflow-wrap: normal;

  hyphens: none;
}
</style>
