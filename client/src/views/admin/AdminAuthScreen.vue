<script setup>
import { ref } from "vue"

const props = defineProps({
  error: String
})

const emit = defineEmits([
  "authenticate"
])

const password = ref("")
</script>

<template>
  <div class="auth-container">

    <div class="auth-box">

      <h1>
        Admin Panel
      </h1>

      <input
        v-model="password"

        type="password"
        placeholder="Password"

        class="form-control"

        @keydown.enter="
          emit('authenticate', password)
        "
      >

      <div
        v-if="props.error"
        class="error-text"
      >
        {{ props.error }}
      </div>

      <button
        class="btn btn-primary auth-button"

        @click="
          emit('authenticate', password)
        "
      >
        Authenticate
      </button>

    </div>

  </div>
</template>

<style scoped>
.auth-container {
  width: 100vw;
  height: 100vh;

  display: flex;
  justify-content: center;
  align-items: center;
}

.auth-box {
  width: 420px;

  background: #2a2a2a;

  border-radius: 28px;

  padding: 40px;

  display: flex;
  flex-direction: column;
  gap: 20px;

  box-shadow:
    0 0 40px rgba(0,0,0,0.55);
}

.auth-button {
  height: 52px;

  font-size: 20px;
}

.error-text {
  color: #ff4d61;

  font-size: 16px;
}
</style>