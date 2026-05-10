<script setup>
defineProps({
  visible: Boolean,

  message: {
    type: String,
    default: ""
  },

  type: {
    type: String,
    default: "error"
  }
})
</script>

<template>
  <Transition name="toast">

    <div
      v-if="visible"

      class="toast-container"

      :class="type"
    >

      <div class="toast-title">

        {{
          type === "success"
            ? "Success"
            : "Error"
        }}

      </div>

      <div class="toast-message">
        {{ message }}
      </div>

    </div>

  </Transition>
</template>

<style scoped>
.toast-container {
  position: fixed;

  top: 92px;
  right: 24px;

  min-width: 320px;
  max-width: 420px;

  color: white;

  padding:
    18px 22px;

  border-radius: 18px;

  z-index: 999999;

  box-shadow:
    0 10px 28px rgba(0,0,0,0.4);
}

.toast-container.error {
  background: #dc3545;
}

.toast-container.success {
  background: #2fe66b;

  color: black;
}

.toast-title {
  font-size: 15px;
  font-weight: 700;

  opacity: 0.8;

  margin-bottom: 6px;

  text-transform: uppercase;
  letter-spacing: 1px;
}

.toast-message {
  font-size: 18px;
  font-weight: 600;

  line-height: 1.4;
}

.toast-enter-active {
  transition:
    opacity 0.22s ease,
    transform 0.22s ease;
}

.toast-enter-from {
  opacity: 0;

  transform:
    translateY(-18px);
}

.toast-enter-to {
  opacity: 1;

  transform:
    translateY(0);
}

.toast-leave-active {
  transition:
    opacity 0.35s ease,
    transform 0.35s ease;
}

.toast-leave-from {
  opacity: 1;

  transform:
    translateY(0);
}

.toast-leave-to {
  opacity: 0;

  transform:
    translateY(-24px);
}
</style>