<script setup>
import BlackCard from "../../components/cards/BlackCard.vue"
import WhiteCard from "../../components/cards/WhiteCard.vue"

const props = defineProps({
  blackCard: Object,
  handCards: Array,
  selectedCards: Array
})

import getBlackCardPickCount
from "../../utils/cards/getBlackCardPickCount"

const emit = defineEmits([
  "toggle-card"
])
</script>

<template>
  <div class="picking-phase">

    <div class="center-area">

    <BlackCard
    :text="blackCard.text"
    :pick-count=getBlackCardPickCount(blackCard.text)
    />

    </div>

    <div class="hand-area">

      <WhiteCard
        v-for="card in handCards"
        :key="card.text"

        :text="card.text"

        :picked-order="
          selectedCards.indexOf(card.text) + 1 || null
        "

        @click="
          emit('toggle-card', card.text)
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
</style>