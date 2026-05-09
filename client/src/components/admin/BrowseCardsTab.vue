<script setup>
import {
  ref,
  computed
} from "vue"

import WhiteCard
from "../cards/WhiteCard.vue"

import BlackCard
from "../cards/BlackCard.vue"

import DeleteCardModal
from "../modals/DeleteCardModal.vue"

import { ADMIN_MODES }
from "../../constants/adminModes"

import { CARD_TYPES }
from "../../../../shared/constants/cardTypes"

const emit = defineEmits([
  "delete-card",
  "edit-card"
])

const props = defineProps({
  whiteCards: {
    type: Array,
    default: () => []
  },

  blackCards: {
    type: Array,
    default: () => []
  }
})

const currentType = ref(CARD_TYPES.WHITE)

const currentMode = ref(ADMIN_MODES.VIEW)

const pendingDeleteCard = ref(null)

const filteredCards = computed(() => {
  if (currentType.value === CARD_TYPES.WHITE) {
    return props.whiteCards
  }

  return props.blackCards
})

function handleCardClick(card) {

  if (currentMode.value === ADMIN_MODES.DELETE) {

    pendingDeleteCard.value = {
      id: card.id,
      type: currentType.value
    }

    return
  }

  if (currentMode.value === ADMIN_MODES.EDIT) {

    emit(
      "edit-card",
      {
        ...card,
        type: currentType.value
      }
    )
  }
}

function confirmDelete() {
  if (!pendingDeleteCard.value) {
    return
  }

  emit(
    "delete-card",
    pendingDeleteCard.value
  )

  pendingDeleteCard.value = null
}
</script>

<template>
  <div class="browse-layout">

    <DeleteCardModal
      :visible="
        pendingDeleteCard !== null
      "

      @cancel="
        pendingDeleteCard = null
      "

      @confirm="
        confirmDelete
      "
    />

    <div class="browse-top">

      <div class="top-group">

        <button
          class="btn"

          :class="
            currentType === CARD_TYPES.WHITE
              ? 'btn-primary'
              : 'btn-secondary'
          "

          @click="
            currentType = CARD_TYPES.WHITE
          "
        >
          White Cards
        </button>

        <button
          class="btn"

          :class="
            currentType === CARD_TYPES.BLACK
              ? 'btn-primary'
              : 'btn-secondary'
          "

          @click="
            currentType = CARD_TYPES.BLACK
          "
        >
          Black Cards
        </button>

      </div>

      <div class="top-group">

        <button
          class="btn"

          :class="
            currentMode === ADMIN_MODES.VIEW
              ? 'btn-primary'
              : 'btn-secondary'
          "

          @click="
            currentMode = ADMIN_MODES.VIEW
          "
        >
          View
        </button>

        <button
          class="btn"

          :class="
            currentMode === ADMIN_MODES.EDIT
              ? 'btn-warning'
              : 'btn-secondary'
          "

          @click="
            currentMode = ADMIN_MODES.EDIT
          "
        >
          Edit
        </button>

        <button
          class="btn"

          :class="
            currentMode === ADMIN_MODES.DELETE
              ? 'btn-danger'
              : 'btn-secondary'
          "

          @click="
            currentMode = ADMIN_MODES.DELETE
          "
        >
          Delete
        </button>

      </div>

    </div>

    <div
      class="cards-grid"

      :class="{
        black: currentType === CARD_TYPES.BLACK
      }"
    >

      <div
        v-for="card in filteredCards"
        :key="card.id"

        class="card-wrapper"

        :class="{
          edit: currentMode === ADMIN_MODES.EDIT,
          delete: currentMode === ADMIN_MODES.DELETE
        }"

        @click="
          handleCardClick(card)
        "
      >

        <WhiteCard
          v-if="
            currentType === CARD_TYPES.WHITE
          "

          :text="card.text"

          :preview-mode="true"
        />

        <BlackCard
          v-else

          :text="card.text"

          :pick-count="
            (
              card.text.match(
                /\[BLANK\]/g
              ) || []
            ).length
          "

          :preview-mode="true"
        />

      </div>

    </div>

  </div>
</template>

<style scoped>
.browse-layout {
  width: 100%;
  height: 100%;

  display: flex;
  flex-direction: column;

  gap: 24px;

  min-height: 0;
}

.browse-top {
  display: flex;
  justify-content: space-between;
  align-items: center;

  gap: 20px;
}

.top-group {
  display: flex;
  gap: 10px;
}

.cards-grid {
  flex: 1;
  min-height: 0;

  overflow-y: auto;

  display: grid;

  grid-template-columns:
    repeat(auto-fill, minmax(220px, 1fr));

  gap: 28px;

  padding-top: 12px;
  padding-right: 12px;
  padding-bottom: 20px;

  justify-items: center;
  align-content: start;
}

.cards-grid.black {
  grid-template-columns:
    repeat(auto-fill, minmax(340px, 1fr));

  gap: 40px;

  padding-top: 16px;
}

.cards-grid::-webkit-scrollbar {
  width: 18px;
}

.cards-grid::-webkit-scrollbar-track {
  background: #1a1a1a;

  border-radius: 999px;
}

.cards-grid::-webkit-scrollbar-thumb {
  background: #444;

  border-radius: 999px;

  border: 3px solid #1a1a1a;
}

.card-wrapper {
  display: flex;
  justify-content: center;
  align-items: flex-start;

  width: 100%;

  transition:
    transform 0.18s,
    filter 0.18s;
}

.card-wrapper:hover {
  transform: translateY(-4px);
}

.card-wrapper.edit {
  cursor: pointer;
}

.card-wrapper.edit:hover {
  filter:
    drop-shadow(
      0 0 14px
      rgba(255,193,7,0.45)
    );

  transform: translateY(-6px);
}

.card-wrapper.delete {
  cursor: pointer;
}

.card-wrapper.delete:hover {
  filter:
    drop-shadow(
      0 0 14px
      rgba(220,53,69,0.5)
    );

  transform:
    translateY(-6px)
    scale(1.02);
}
</style>