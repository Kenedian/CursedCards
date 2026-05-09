<script setup>
const props = defineProps({
  visible: Boolean
})

const emit = defineEmits([
  "confirm",
  "cancel"
])
</script>

<template>
  <div
    v-if="props.visible"
    class="modal-overlay"
  >

    <div class="modal-box">

      <h2>
        Delete card?
      </h2>

      <p>
        This action cannot be undone.
      </p>

      <div class="modal-buttons">

        <button
          class="btn btn-secondary"

          @click="
            emit('cancel')
          "
        >
          Cancel
        </button>

        <button
          class="btn btn-danger"

          @click="
            emit('confirm')
          "
        >
          Delete
        </button>

      </div>

    </div>

  </div>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;

  background:
    rgba(0,0,0,0.65);

  display: flex;
  justify-content: center;
  align-items: center;

  z-index: 99999;

  backdrop-filter: blur(4px);
}

.modal-box {
  width: 420px;

  background: #242424;

  border-radius: 24px;

  padding: 32px;

  box-shadow:
    0 0 40px rgba(0,0,0,0.45);

  display: flex;
  flex-direction: column;
  gap: 22px;
}

.modal-buttons {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}
</style>