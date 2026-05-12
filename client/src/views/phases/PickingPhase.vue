<script setup>
import BlackCard from "../../components/cards/BlackCard.vue"
import WhiteCard from "../../components/cards/WhiteCard.vue"

const props = defineProps({
  blackCard: Object,
  handCards: Array,
  selectedCards: Array,
  isReady: Boolean
})

import getBlackCardPickCount
from "../../utils/cards/getBlackCardPickCount"

const emit = defineEmits([
  "toggle-card"
])

function getWhiteCardMaxFontSize() {
  if (
    typeof window === "undefined"
  ) {
    return 36
  }

  return Math.round(
    Math.min(
      44,
      Math.max(
        30,
        window.innerWidth * 0.018
      )
    )
  )
}

function getBlackCardMaxFontSize() {
  if (
    typeof window === "undefined"
  ) {
    return 44
  }

  return Math.round(
    Math.min(
      50,
      Math.max(
        34,
        window.innerWidth * 0.018
      )
    )
  )
}

function clickCard(instanceId) {

  if (props.isReady) {
    return
  }

  emit(
    "toggle-card",
    instanceId
  )
}
</script>

<template>
  <div
    class="picking-phase"

    :class="{
      'ready-locked': props.isReady
    }"
  >

    <div class="center-area">

    <BlackCard
      :text="blackCard.text"

      :max-font-size="
        getBlackCardMaxFontSize
      "

      :pick-count="
        getBlackCardPickCount(blackCard.text)
      "
    />

    </div>

    <div class="hand-area">

      <div class="hand-strip">

        <WhiteCard
          v-for="card in handCards"
          :key="card.instanceId"

          :text="card.text"

          :max-font-size="
            getWhiteCardMaxFontSize
          "

          :picked-order="
            selectedCards.indexOf(card.instanceId) + 1 || null
          "

          @click="
            clickCard(card.instanceId)
          "
        />

      </div>

    </div>

  </div>
</template>

<style scoped>
.picking-phase {
  flex: 1;

  display: flex;
  flex-direction: column;

  height: 100%;
  min-height: 0;

  overflow: visible;
}

.center-area {
  flex: 1 1 auto;
  min-height: 0;

  display: flex;
  justify-content: center;
  align-items: center;

  padding-bottom: clamp(0px, 1vh, 18px);
}

.hand-area {
  flex: 0 0 clamp(96px, 11vh, 180px);
  min-height: clamp(88px, 10vh, 160px);

  display: flex;
  justify-content: center;
  align-items: flex-end;

  padding-bottom: 0;
}

.hand-strip {
  display: flex;
  justify-content: center;
  align-items: flex-end;

  min-width: 0;

  transform:
    translateX(clamp(-110px, -3.8vw, -28px));
}

.center-area :deep(.black-card:not(.preview-mode)) {
  margin-bottom: 0;

  transform:
    translateX(clamp(-56px, -3.2vw, -24px));
}

.hand-area :deep(.white-card-wrapper:not(.preview-mode) .white-card) {
  transform:
    translateY(clamp(120px, 14vh, 240px));
}

.hand-area :deep(.white-card-wrapper:not(.preview-mode) .white-card:hover) {
  transform:
    translateY(clamp(-28px, -1.8vh, -10px))
    scale(1.04);
}

.hand-area :deep(.white-card-wrapper.picked:not(.preview-mode) .white-card) {
  transform:
    translateY(clamp(-62px, -3.4vh, -28px))
    scale(1.04);
}

.picking-phase.ready-locked
.hand-area {
  pointer-events: none;

  opacity: 0.72;
}

@media (min-width: 1000px) {
  .picking-phase {
    overflow: visible;
  }

  .center-area {
    align-items: center;
  }

  .hand-area {
    flex-basis: clamp(86px, 10vh, 160px);
    min-height: clamp(80px, 9vh, 148px);

    overflow: visible;
  }

  .hand-strip {
    max-width: 100%;

    transform:
      translateX(clamp(-92px, -3.1vw, -28px));
  }

  .hand-area :deep(.white-card-wrapper:first-child:not(.preview-mode) .white-card) {
    margin-left: 0;
  }

  .hand-area :deep(.white-card-wrapper:not(.preview-mode) .white-card) {
    width: clamp(116px, 10.5vw, 220px);
    height: clamp(156px, 14vw, 294px);

    padding: clamp(12px, 0.95vw, 21px);

    margin-left: clamp(-168px, -4.8vw, -54px);

    transform:
      translateY(clamp(106px, 14vh, 260px));
  }

  .hand-area :deep(.white-card-wrapper:not(.preview-mode) .white-card:hover) {
    transform:
      translateY(clamp(-28px, -1.8vh, -10px))
      scale(1.04);
  }

  .hand-area :deep(.white-card-wrapper.picked:not(.preview-mode) .white-card) {
    transform:
      translateY(clamp(-62px, -3.4vh, -28px))
      scale(1.04);
  }

  .hand-area :deep(.white-card-wrapper:not(.preview-mode) .white-card-top) {
    height: clamp(18px, 1.65vw, 34px);

    margin:
      calc(clamp(12px, 0.95vw, 21px) * -1)
      calc(clamp(12px, 0.95vw, 21px) * -1)
      clamp(10px, 1.05vw, 20px)
      calc(clamp(12px, 0.95vw, 21px) * -1);
  }

  .hand-area :deep(.white-card-wrapper:not(.preview-mode) .pick-order) {
    width: clamp(30px, 2vw, 42px);
    height: clamp(30px, 2vw, 42px);

    font-size: clamp(14px, 0.9vw, 18px);
  }

  .center-area :deep(.black-card:not(.preview-mode)) {
    width: clamp(210px, 15.4vw, 326px);
    height: clamp(284px, 20.7vw, 440px);

    padding: clamp(18px, 1.2vw, 25px);

    margin-bottom: clamp(22px, 4.8vh, 108px);

    transform:
      translate(
        clamp(-172px, -4.8vw, -34px),
        clamp(-32px, -2vh, -8px)
      );
  }

  .center-area :deep(.black-card:not(.preview-mode) .black-card-picks) {
    height: clamp(28px, 2.05vw, 42px);

    padding: 0 clamp(12px, 0.86vw, 18px);

    font-size: clamp(12px, 0.82vw, 16px);
  }
}

@media (max-width: 999px) and (max-height: 760px) {
  .center-area {
    padding-bottom: 4px;
  }

  .hand-area {
    flex-basis: clamp(100px, 15vh, 128px);
  }
}

@media (max-width: 999px) {
  .center-area {
    padding-bottom: 6px;
  }

  .hand-area {
    flex-basis: clamp(102px, 14vh, 126px);
  }

  .hand-strip {
    transform:
      translateX(clamp(-104px, -10vw, -82px));
  }

  .center-area :deep(.black-card:not(.preview-mode)) {
    transform: none;
  }

  .hand-area :deep(.white-card-wrapper:not(.preview-mode) .white-card) {
    transform:
      translateY(clamp(94px, 12vh, 126px));
  }

  .hand-area :deep(.white-card-wrapper:not(.preview-mode) .white-card:hover) {
    transform:
      translateY(clamp(-6px, -0.8vh, -2px))
      scale(1.04);
  }

  .hand-area :deep(.white-card-wrapper.picked:not(.preview-mode) .white-card) {
    transform:
      translateY(clamp(-24px, -2vh, -8px))
      scale(1.04);
  }
}

@media (max-width: 760px) {
  .picking-phase {
    overflow: visible;
  }

  .center-area {
    padding-bottom: 4px;
  }

  .hand-area {
    flex-basis: clamp(252px, 35dvh, 312px);
    min-height: 244px;

    overflow-x: visible;
    overflow-y: visible;

    justify-content: center;
    align-items: flex-end;

    padding-top: 64px;
    padding-left: 14px;
    padding-right: 14px;
    padding-bottom:
      calc(10dvh + 18px + env(safe-area-inset-bottom));

    scroll-padding-bottom:
      calc(10dvh + 18px + env(safe-area-inset-bottom));
  }

  .hand-strip {
    justify-content: center;

    width: max-content;
    max-width: none;

    margin-left: auto;
    margin-right: auto;

    transform:
      translateX(9px);
  }

  .hand-area :deep(.white-card-wrapper:not(.preview-mode) .white-card) {
    margin-left: -18px;
  }

  .center-area :deep(.black-card:not(.preview-mode)) {
    transform: none;
  }

  .hand-area :deep(.white-card-wrapper:not(.preview-mode) .white-card) {
    transform:
      translateY(34px);
  }

  .hand-area :deep(.white-card-wrapper:not(.preview-mode) .white-card:hover) {
    transform:
      translateY(-18px)
      scale(1.08);

    box-shadow:
      0 18px 0 rgba(0,0,0,0.22),
      0 26px 42px rgba(0,0,0,0.38),
      0 0 0 3px rgba(255,255,255,0.45),
      0 0 28px rgba(255,255,255,0.16);
  }

  .hand-area :deep(.white-card-wrapper.picked:not(.preview-mode) .white-card) {
    transform:
      translateY(-36px)
      scale(1.1);

    box-shadow:
      0 18px 0 rgba(0,0,0,0.22),
      0 28px 46px rgba(0,0,0,0.4),
      0 0 0 5px rgba(47,230,107,0.48),
      0 0 36px rgba(47,230,107,0.3);
  }
}

@media (max-width: 999px) and (max-height: 520px) and (orientation: landscape) {
  .picking-phase,
  .hand-area {
    overflow: visible;
  }

  .hand-area {
    flex-basis: clamp(176px, 42dvh, 220px);
    min-height: 176px;

    justify-content: center;
    align-items: flex-end;

    padding-top: 54px;
    padding-bottom:
      calc(8dvh + 14px + env(safe-area-inset-bottom));
  }

  .hand-strip {
    width: max-content;
    max-width: none;

    margin-left: auto;
    margin-right: auto;

    transform:
      translateX(6px);
  }

  .hand-area :deep(.white-card-wrapper:not(.preview-mode) .white-card) {
    transform:
      translateY(46px)
      scale(0.96);
  }

  .hand-area :deep(.white-card-wrapper:not(.preview-mode) .white-card:hover) {
    transform:
      translateY(4px)
      scale(1.03);
  }

  .hand-area :deep(.white-card-wrapper.picked:not(.preview-mode) .white-card) {
    transform:
      translateY(-10px)
      scale(1.05);
  }
}

@media (max-width: 420px) and (max-height: 720px) {
  .center-area {
    padding-bottom: 2px;
  }

  .hand-area {
    flex-basis: clamp(206px, 39dvh, 248px);
    min-height: 202px;

    padding-top: 56px;
    padding-left: 10px;
    padding-right: 10px;
    padding-bottom:
      calc(9dvh + 16px + env(safe-area-inset-bottom));
  }

  .hand-area :deep(.white-card-wrapper:not(.preview-mode) .white-card) {
    margin-left: -28px;
  }

  .hand-area :deep(.white-card-wrapper:not(.preview-mode) .white-card) {
    transform:
      translateY(30px);
  }

  .hand-area :deep(.white-card-wrapper:not(.preview-mode) .white-card:hover) {
    transform:
      translateY(-16px)
      scale(1.12);
  }

  .hand-area :deep(.white-card-wrapper.picked:not(.preview-mode) .white-card) {
    transform:
      translateY(-32px)
      scale(1.14);
  }
}
</style>
