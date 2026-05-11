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

  padding-bottom: clamp(12px, 2vh, 28px);
}

.hand-area {
  flex: 0 0 clamp(118px, 15vh, 150px);
  min-height: 112px;

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
    translateX(clamp(-60px, -3.8vw, -28px));
}

.center-area :deep(.black-card:not(.preview-mode)) {
  margin-bottom: 0;

  transform:
    translateX(clamp(-56px, -3.2vw, -24px));
}

.hand-area :deep(.white-card-wrapper:not(.preview-mode) .white-card) {
  transform:
    translateY(clamp(112px, 13vh, 150px));
}

.hand-area :deep(.white-card-wrapper:not(.preview-mode) .white-card:hover) {
  transform:
    translateY(clamp(-10px, -1vh, -4px))
    scale(1.04);
}

.hand-area :deep(.white-card-wrapper.picked:not(.preview-mode) .white-card) {
  transform:
    translateY(clamp(-32px, -2.4vh, -12px))
    scale(1.04);
}

.picking-phase.ready-locked
.hand-area {
  pointer-events: none;

  opacity: 0.72;
}

@media (max-height: 760px) {
  .center-area {
    padding-bottom: 4px;
  }

  .hand-area {
    flex-basis: clamp(100px, 15vh, 128px);
  }
}

@media (max-width: 1100px) {
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
    flex-basis: 174px;
    min-height: 164px;

    overflow-x: auto;
    overflow-y: visible;

    justify-content: center;

    padding-left: 14px;
    padding-right: 14px;
  }

  .hand-strip {
    justify-content: center;

    transform: none;
  }

  .center-area :deep(.black-card:not(.preview-mode)) {
    transform: none;
  }

  .hand-area :deep(.white-card-wrapper:not(.preview-mode) .white-card) {
    transform:
      translateY(66px);
  }

  .hand-area :deep(.white-card-wrapper:not(.preview-mode) .white-card:hover) {
    transform:
      translateY(12px)
      scale(1.03);
  }

  .hand-area :deep(.white-card-wrapper.picked:not(.preview-mode) .white-card) {
    transform:
      translateY(8px)
      scale(1.03);
  }
}

@media (max-width: 420px) and (max-height: 720px) {
  .center-area {
    padding-bottom: 2px;
  }

  .hand-area {
    flex-basis: 126px;
    min-height: 122px;

    padding-left: 10px;
    padding-right: 10px;
  }

  .hand-area :deep(.white-card-wrapper:not(.preview-mode) .white-card) {
    transform:
      translateY(72px);
  }

  .hand-area :deep(.white-card-wrapper:not(.preview-mode) .white-card:hover) {
    transform:
      translateY(18px)
      scale(1.08);
  }

  .hand-area :deep(.white-card-wrapper.picked:not(.preview-mode) .white-card) {
    transform:
      translateY(14px)
      scale(1.08);
  }
}
</style>
