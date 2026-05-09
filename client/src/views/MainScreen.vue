<script setup>
const emit = defineEmits([
  "open-lobby",
  "open-admin"
])
</script>

<template>
  <button
    class="btn btn-danger admin-button"

    @click="emit('open-admin')"
  >
    Admin
  </button>

  <div class="main-container">

    <div>

      <h1 class="title">
        Cursed Cards
      </h1>

      <div class="menu-box">

        <div class="menu-side">

          <h2>
            Join Lobby
          </h2>

          <input
            type="text"
            placeholder="Your name"
            class="form-control"
          >

          <input
            type="text"
            placeholder="Lobby code"
            class="form-control"
          >

          <button
            class="btn btn-primary w-100"

            @click="emit('open-lobby')"
          >
            Join
          </button>

        </div>

        <div class="divider"></div>

        <div class="menu-side">

          <h2>
            Create Lobby
          </h2>

          <input
            type="text"
            placeholder="Your name"
            class="form-control"
          >

          <button
            class="btn btn-success w-100"

            @click="emit('open-lobby')"
          >
            Create Lobby
          </button>

        </div>

      </div>

    </div>

  </div>
</template>

<style scoped>
.main-container {
  width: 100vw;
  height: 100vh;

  display: flex;
  justify-content: center;
  align-items: center;
}

.title {
  text-align: center;
  font-size: 64px;
  margin-bottom: 25px;
}

.menu-box {
  background: #2a2a2a;
  border-radius: 25px;

  padding: 40px;
  width: 900px;

  display: flex;
  gap: 40px;

  box-shadow: 0 0 30px rgba(0,0,0,0.5);
}

.menu-side {
  flex: 1;

  display: flex;
  flex-direction: column;
  gap: 20px;
}

.divider {
  width: 2px;
  background: rgba(255,255,255,0.1);
}

.admin-button {
  position: absolute;

  top: 20px;
  right: 20px;
}
</style>