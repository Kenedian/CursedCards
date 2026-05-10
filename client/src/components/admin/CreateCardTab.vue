<script setup>
import WhiteCard
from "../cards/WhiteCard.vue"

import BlackCard
from "../cards/BlackCard.vue"

import { CARD_TYPES }
from "../../../../shared/constants/cardTypes"

const props = defineProps({
  currentType: String,

  cardText: String,

  trimmedText: String,

  blackBlankCount: Number,

  canCreate: Boolean,

  editingCard: Object,

  isSubmitting: Boolean
})

const emit = defineEmits([
  "set-type",
  "update-text",
  "add-blank",
  "create-card",
  "cancel-edit"
])
</script>

<template>
  <div class="create-layout">

    <div class="left-side">

      <div class="section-header">

        <div>

          <div class="section-kicker">
            {{
              props.editingCard
                ? "Editing"
                : "Create"
            }}
          </div>

          <h2>
            Card Forge
          </h2>

        </div>

        <div
          v-if="props.currentType === CARD_TYPES.BLACK"
          class="blank-count"
        >
          Blanks {{ props.blackBlankCount }}
        </div>

      </div>

      <div class="type-switch">

        <button
          class="btn"

          :disabled="
            props.editingCard
          "

          :class="
            props.currentType === CARD_TYPES.WHITE
              ? 'btn-primary'
              : 'btn-secondary'
          "

          @click="
            emit('set-type', CARD_TYPES.WHITE)
          "
        >
          White Card
        </button>

        <button
          class="btn"

          :disabled="
            props.editingCard
          "

          :class="
            props.currentType === CARD_TYPES.BLACK
              ? 'btn-primary'
              : 'btn-secondary'
          "

          @click="
            emit('set-type', CARD_TYPES.BLACK)
          "
        >
          Black Card
        </button>

      </div>

      <textarea
        :value="props.cardText"

        class="card-input"

        placeholder="Card text..."

        :disabled="
          props.isSubmitting
        "

        @input="
          emit(
            'update-text',
            $event.target.value
          )
        "

        @keydown.enter.exact.prevent="
          props.canCreate &&
          !props.isSubmitting &&
          emit('create-card')
        "
      ></textarea>

      <div class="action-row">

        <button
          v-if="
            props.currentType === CARD_TYPES.BLACK
          "

          class="btn btn-warning utility-button"

          @click="
            emit('add-blank')
          "
        >
          Add Blank
        </button>

        <button
          v-if="
            props.editingCard
          "

          class="btn btn-secondary cancel-button"

          @click="
            emit('cancel-edit')
          "
        >
          Cancel
        </button>

        <button
          class="btn btn-success create-button"

          :disabled="
            !props.canCreate ||
            props.isSubmitting
          "

          @click="
            emit('create-card')
          "
        >
          {{
            props.isSubmitting

              ? 'Saving...'

              : props.editingCard
                ? "Save Edit"
                : "Create Card"
          }}
        </button>

      </div>

    </div>

    <div class="preview-side">

      <div class="preview-label">
        Live Preview
      </div>

      <WhiteCard
        v-if="
          props.currentType === CARD_TYPES.WHITE
        "

        :text="
          props.trimmedText
        "

        :preview-mode="true"
      />

      <BlackCard
        v-else

        :text="
          props.trimmedText
        "

        :pick-count="
          props.blackBlankCount || 1
        "

        :preview-mode="true"
      />

    </div>

  </div>
</template>

<style scoped>
.create-layout {
  width: 100%;
  height: 100%;

  display: flex;
  justify-content: center;
  align-items: center;

  gap: 48px;
}

.left-side {
  width: min(560px, 48vw);

  display: flex;
  flex-direction: column;
  gap: 18px;

  padding: 24px;

  border:
    1px solid rgba(255,255,255,0.08);

  border-radius: 12px;

  background:
    rgba(3,5,4,0.42);
}

.preview-side {
  width: min(420px, 38vw);
  min-height: 470px;

  display: flex;
  justify-content: center;
  align-items: center;

  position: relative;

  border:
    1px dashed rgba(47,230,107,0.28);

  border-radius: 12px;

  background:
    radial-gradient(
      circle at center,
      rgba(47,230,107,0.08),
      transparent 62%
    ),
    rgba(0,0,0,0.18);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 14px;
}

.section-kicker,
.preview-label {
  color:
    var(--game-green);

  font-size: 12px;
  font-weight: 900;
  letter-spacing: 1.2px;
  text-transform: uppercase;
}

.section-header h2 {
  margin: 0;

  font-size: 34px;
  font-weight: 900;
  text-transform: uppercase;
}

.blank-count {
  height: 38px;

  padding: 0 12px;

  display: flex;
  align-items: center;

  border:
    1px solid rgba(255,216,77,0.24);

  border-radius: 10px;

  background:
    rgba(255,216,77,0.08);

  color:
    var(--game-yellow);

  font-size: 13px;
  font-weight: 900;
  text-transform: uppercase;
}

.preview-label {
  position: absolute;

  top: 16px;
  left: 16px;
}

.type-switch {
  display: flex;
  gap: 10px;
}

.card-input {
  flex: 1;

  min-height: 280px;

  resize: none;

  border:
    1px solid rgba(255,255,255,0.12);
  outline: none;

  background:
    rgba(3,5,4,0.78);
  color: white;

  border-radius: 10px;

  padding: 24px;

  font-size: 24px;
  font-weight: 800;
  line-height: 1.25;

  box-shadow:
    inset 0 0 20px rgba(0,0,0,0.35);
}

.card-input:focus {
  border-color:
    rgba(47,230,107,0.42);

  box-shadow:
    0 0 0 3px rgba(47,230,107,0.14),
    inset 0 0 20px rgba(0,0,0,0.35);
}

.action-row {
  display: flex;
  gap: 10px;
}

.create-button {
  margin-left: auto;
}

.create-button,
.cancel-button,
.utility-button {
  height: 60px;

  min-width: 170px;

  font-size: 16px;
}

@media (max-width: 1050px) {

  .create-layout {
    overflow-y: auto;

    flex-direction: column;
    justify-content: flex-start;
  }

  .left-side,
  .preview-side {
    width: 100%;
  }
}
</style>
