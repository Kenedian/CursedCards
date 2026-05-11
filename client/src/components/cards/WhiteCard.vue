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
  36
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
  width: clamp(142px, 9.4vw, 240px);
  height: clamp(190px, 12.5vw, 320px);

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

  padding: clamp(14px, 1.2vw, 18px);

  margin-left: clamp(-26px, -1.5vw, -14px);

  transform:
    translateY(clamp(84px, 14vh, 125px));

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
  height: clamp(20px, 3vh, 26px);

  display: flex;
  align-items: flex-start;

  flex-shrink: 0;

  margin:
    calc(clamp(14px, 1.2vw, 18px) * -1)
    calc(clamp(14px, 1.2vw, 18px) * -1)
    clamp(14px, 2vh, 20px)
    calc(clamp(14px, 1.2vw, 18px) * -1);
}

.pick-order {
  width: clamp(34px, 3.2vw, 42px);
  height: clamp(34px, 3.2vw, 42px);

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

  font-size: clamp(15px, 1.2vw, 18px);
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

@media (max-width: 1100px) {
  .white-card {
    width: clamp(122px, 13vw, 142px);
    height: clamp(164px, 17.5vw, 190px);

    padding: 13px;

    margin-left: -12px;
  }

  .white-card-top {
    margin:
      -13px
      -13px
      12px
      -13px;
  }
}

@media (max-width: 760px) {
  .white-card {
    width: 112px;
    height: 150px;

    padding: 11px;

    margin-left: -8px;
  }

  .white-card-top {
    height: 18px;

    margin:
      -11px
      -11px
      10px
      -11px;
  }

  .pick-order {
    width: 30px;
    height: 30px;
  }
}

@media (max-width: 420px) and (max-height: 720px) {
  .white-card {
    width: 82px;
    height: 110px;

    padding: 9px;

    margin-left: -22px;
  }

  .white-card-top {
    height: 15px;

    margin:
      -9px
      -9px
      8px
      -9px;
  }

  .pick-order {
    width: 25px;
    height: 25px;

    font-size: 12px;
  }
}
</style>
