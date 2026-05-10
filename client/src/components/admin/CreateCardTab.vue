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

  editingCard: Object
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

      <div class="type-switch">

        <button
          class="btn"

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

        @input="
          emit(
            'update-text',
            $event.target.value
          )
        "
      ></textarea>

      <button
        v-if="
          props.currentType === CARD_TYPES.BLACK
        "

        class="btn btn-warning"

        @click="
          emit('add-blank')
        "
      >
        Add Blank
      </button>

      <button
        class="btn btn-success create-button"

        :disabled="!props.canCreate"

        @click="
          emit('create-card')
        "
      >
        {{
          props.editingCard
            ? "Save Edit"
            : "Create Card"
        }}
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

    </div>

    <div class="preview-side">

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

  gap: 120px;
}

.left-side {
  width: 520px;

  display: flex;
  flex-direction: column;
  gap: 18px;
}

.preview-side {
  width: 420px;

  display: flex;
  justify-content: center;
  align-items: center;
}

.type-switch {
  display: flex;
  gap: 10px;
}

.card-input {
  flex: 1;

  min-height: 280px;

  resize: none;

  border: none;
  outline: none;

  background: #2a2a2a;
  color: white;

  border-radius: 24px;

  padding: 24px;

  font-size: 24px;

  box-shadow:
    inset 0 0 20px rgba(0,0,0,0.25);
}

.create-button,
.cancel-button {
  height: 60px;

  font-size: 22px;
}
</style>