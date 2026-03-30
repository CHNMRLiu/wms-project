<template>
  <div class="app-shell">
    <Sidebar />
    <div class="main-area">
      <TopBar />
      <main class="content">
        <router-view v-slot="{ Component }">
          <transition name="page" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import Sidebar from './layout/Sidebar.vue'
import TopBar from './layout/TopBar.vue'
</script>

<style scoped>
.app-shell {
  display: flex;
  height: 100vh;
  width: 100vw;
  position: relative;
  z-index: 1;
}

.main-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
  margin-left: var(--sidebar-width);
}

.content {
  flex: 1;
  overflow-y: auto;
  padding: 24px;
}

/* 页面切换动画 */
.page-enter-active,
.page-leave-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
}
.page-enter-from {
  opacity: 0;
  transform: translateY(8px);
}
.page-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>
