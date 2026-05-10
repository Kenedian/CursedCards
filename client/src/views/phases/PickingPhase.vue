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
</template>

<style scoped>
.picking-phase {
  flex: 1;

  display: flex;
  flex-direction: column;
}

.center-area {
  flex: 1;

  display: flex;
  justify-content: center;
  align-items: center;
}

.hand-area {
  height: 170px;

  display: flex;
  justify-content: center;
  align-items: flex-end;

  transform: translateX(-60px);
}

.picking-phase.ready-locked
.hand-area {
  pointer-events: none;

  opacity: 0.72;
}
</style>
