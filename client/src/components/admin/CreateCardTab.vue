<script setup>
import {
  ref,
  onMounted
} from "vue"

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

const inputRef =
  ref(null)

function focusInput() {
  inputRef.value?.focus()
}

onMounted(() => {
  focusInput()
})

defineExpose({
  focusInput
})
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

          :class="{
            invalid: (props.blackBlankCount > 3 || props.blackBlankCount < 1) 
          }"
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
        ref="inputRef"

        :value="props.cardText"

        class="card-input"

        placeholder="Card text..."

        autofocus

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

        :disabled="
          props.blackBlankCount >= 3
        "

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

  gap: clamp(24px, 2.2vw, 84px);
}

.left-side {
  flex: 1 1 0;
  max-width: 980px;
  min-width: 0;

  display: flex;
  flex-direction: column;
  gap: clamp(14px, 1vw, 34px);

  padding: clamp(18px, 1.3vw, 42px);

  border:
    1px solid rgba(255,255,255,0.08);

  border-radius: 12px;

  background:
    rgba(3,5,4,0.42);
}

.preview-side {
  flex: 0 1 clamp(300px, 30vw, 760px);
  min-width: 280px;
  min-height: clamp(360px, 31vw, 860px);

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
  gap: clamp(10px, 0.7vw, 24px);
}

.section-kicker,
.preview-label {
  color:
    var(--game-green);

  font-size: clamp(11px, 0.6vw, 22px);
  font-weight: 900;
  letter-spacing: 1.2px;
  text-transform: uppercase;
}

.section-header h2 {
  margin: 0;

  font-size: clamp(28px, 1.8vw, 68px);
  font-weight: 900;
  text-transform: uppercase;
}

.blank-count {
  height: clamp(34px, 2vw, 68px);

  padding: 0 clamp(10px, 0.65vw, 24px);

  display: flex;
  align-items: center;

  border:
    1px solid rgba(255,216,77,0.24);

  border-radius: 10px;

  background:
    rgba(255,216,77,0.08);

  color:
    var(--game-yellow);

  font-size: clamp(12px, 0.68vw, 24px);
  font-weight: 900;
  text-transform: uppercase;
}

.preview-label {
  position: absolute;

  top: clamp(14px, 0.9vw, 30px);
  left: clamp(14px, 0.9vw, 30px);
}

.type-switch {
  display: flex;
  gap: clamp(8px, 0.55vw, 18px);
}

.type-switch .btn {
  min-height: clamp(38px, 2.2vw, 76px);

  padding:
    0
    clamp(12px, 0.8vw, 28px);

  font-size: clamp(12px, 0.75vw, 26px);
}

.card-input {
  flex: 1;

  min-height: clamp(220px, 18vw, 620px);

  resize: none;

  border:
    1px solid rgba(255,255,255,0.12);
  outline: none;

  background:
    rgba(3,5,4,0.78);
  color: white;

  border-radius: 10px;

  padding: clamp(18px, 1.25vw, 44px);

  font-size: clamp(20px, 1.25vw, 44px);
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
  gap: clamp(8px, 0.55vw, 18px);
}

.create-button {
  margin-left: auto;
}

.create-button,
.cancel-button,
.utility-button {
  height: clamp(50px, 3vw, 104px);

  min-width: clamp(138px, 9vw, 300px);

  font-size: clamp(14px, 0.85vw, 30px);
}

.blank-count.invalid {
  border-color:
    rgba(255,77,97,0.4);

  background:
    rgba(255,77,97,0.12);

  color:
    #ff8a98;

  box-shadow:
    0 0 12px rgba(255,77,97,0.18);
}

@media (max-width: 1050px) {

  .create-layout {
    overflow: hidden;

    flex-direction: row;
    justify-content: stretch;

    gap: 14px;
  }

  .left-side {
    flex-basis: 56%;

    padding: 14px;

    gap: 10px;
  }

  .preview-side {
    flex-basis: 44%;

    min-width: 260px;
    min-height: 0;
  }

  .section-header h2 {
    font-size: 26px;
  }

  .section-kicker,
  .preview-label {
    font-size: 10px;
  }

  .card-input {
    min-height: 190px;

    padding: 16px;

    font-size: 18px;
  }

  .create-button,
  .cancel-button,
  .utility-button {
    min-width: 0;
    height: 44px;

    padding: 0 12px;

    font-size: 12px;
  }
}

@media (max-width: 820px) {
  .create-layout {
    overflow-y: auto;

    flex-direction: column;
    justify-content: flex-start;
  }

  .left-side,
  .preview-side {
    width: 100%;
    flex-basis: auto;
  }

  .preview-side {
    min-height: 360px;
  }
}
</style>
