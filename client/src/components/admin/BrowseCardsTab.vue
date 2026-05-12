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

const modeLabel = computed(() => {

  if (currentMode.value === ADMIN_MODES.EDIT) {
    return "Editing cards"
  }

  if (currentMode.value === ADMIN_MODES.DELETE) {
    return "Deleting cards"
  }

  return "Viewing deck"
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

      <div class="toolbar-panel">

        <div class="toolbar-label">
          Deck Type
        </div>

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

      </div>

      <div
        class="mode-chip"

        :class="{
          edit: currentMode === ADMIN_MODES.EDIT,
          delete: currentMode === ADMIN_MODES.DELETE
        }"
      >
        {{ modeLabel }}
        ·
        {{ filteredCards.length }}
      </div>

      <div class="toolbar-panel">

        <div class="toolbar-label">
          Action Mode
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

  gap: clamp(12px, 1vw, 34px);

  min-height: 0;
}

.browse-top {
  display: flex;
  justify-content: space-between;
  align-items: center;

  gap: clamp(12px, 0.9vw, 30px);

  flex-shrink: 0;
}

.toolbar-panel {
  display: flex;
  flex-direction: column;
  gap: clamp(6px, 0.4vw, 14px);

  padding: clamp(10px, 0.65vw, 22px);

  border:
    1px solid rgba(255,255,255,0.08);

  border-radius: 12px;

  background:
    rgba(3,5,4,0.42);
}

.toolbar-label {
  color:
    var(--game-muted);

  font-size: clamp(10px, 0.55vw, 20px);
  font-weight: 900;
  letter-spacing: 1px;
  text-transform: uppercase;
}

.top-group {
  display: flex;
  gap: clamp(8px, 0.5vw, 18px);
}

.top-group .btn {
  min-height: clamp(36px, 2vw, 70px);

  padding:
    0
    clamp(12px, 0.75vw, 28px);

  font-size: clamp(12px, 0.7vw, 24px);
}

.mode-chip {
  min-width: clamp(160px, 10vw, 360px);
  height: clamp(40px, 2.3vw, 78px);

  padding: 0 clamp(12px, 0.85vw, 30px);

  display: flex;
  justify-content: center;
  align-items: center;

  border:
    1px solid rgba(77,156,255,0.28);

  border-radius: 10px;

  background:
    rgba(77,156,255,0.09);

  color:
    #9cc9ff;

  font-size: clamp(12px, 0.75vw, 26px);
  font-weight: 900;
  text-transform: uppercase;
}

.mode-chip.edit {
  border-color:
    rgba(255,216,77,0.34);

  background:
    rgba(255,216,77,0.09);

  color:
    var(--game-yellow);
}

.mode-chip.delete {
  border-color:
    rgba(255,77,97,0.34);

  background:
    rgba(255,77,97,0.1);

  color:
    #ff9aa6;
}

.cards-grid {
  flex: 1;
  min-height: 0;

  overflow-y: auto;
  overflow-x: hidden;
  overscroll-behavior: contain;

  display: grid;

  grid-template-columns:
    repeat(auto-fill, minmax(clamp(150px, 10.5vw, 300px), 1fr));

  gap: clamp(16px, 1.2vw, 42px);

  padding:
    clamp(14px, 0.9vw, 30px)
    clamp(10px, 0.65vw, 24px)
    clamp(18px, 1vw, 34px);

  border:
    1px solid rgba(255,255,255,0.06);

  border-radius: 12px;

  background:
    rgba(0,0,0,0.18);

  justify-items: center;
  align-content: start;
}

.cards-grid.black {
  grid-template-columns:
    repeat(auto-fill, minmax(clamp(210px, 16vw, 460px), 1fr));

  gap: clamp(22px, 1.6vw, 58px);

  padding-top: 16px;
}

.cards-grid::-webkit-scrollbar {
  width: 14px;
}

.cards-grid::-webkit-scrollbar-track {
  background: #080a09;

  border-radius: 10px;
}

.cards-grid::-webkit-scrollbar-thumb {
  background:
    linear-gradient(
      180deg,
      rgba(47,230,107,0.55),
      rgba(47,230,107,0.18)
    );

  border-radius: 10px;

  border: 3px solid #080a09;
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

@media (max-width: 1050px) {

  .browse-top {
    align-items: center;
    flex-direction: row;
    flex-wrap: wrap;

    gap: 8px;
  }

  .toolbar-panel {
    flex: 1 1 280px;

    padding: 8px;
  }

  .top-group {
    flex-wrap: wrap;

    gap: 6px;
  }

  .mode-chip {
    order: 3;

    width: 100%;
    height: 34px;

    font-size: 11px;
  }

  .top-group .btn {
    min-height: 32px;

    padding: 0 10px;

    font-size: 11px;
  }

  .toolbar-label {
    font-size: 9px;
  }

  .cards-grid {
    grid-template-columns:
      repeat(auto-fill, minmax(118px, 1fr));

    gap: 12px;

    padding:
      12px
      8px
      calc(40px + env(safe-area-inset-bottom));
  }

  .cards-grid.black {
    grid-template-columns:
      repeat(auto-fill, minmax(170px, 1fr));

    gap: 16px;
  }
}
</style>
