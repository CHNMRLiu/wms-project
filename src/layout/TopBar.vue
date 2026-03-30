<template>
  <header class="topbar glass">
    <div class="topbar-left">
      <span class="page-title">{{ currentTitle }}</span>
    </div>
    <div class="topbar-right">
      <div class="search-box">
        <svg viewBox="0 0 20 20" width="14" height="14" fill="none" stroke="#aeaeb2" stroke-width="1.8">
          <circle cx="8.5" cy="8.5" r="5.5" />
          <line x1="13" y1="13" x2="17" y2="17" />
        </svg>
        <input type="text" placeholder="搜索..." class="search-input" />
        <kbd class="shortcut">⌘K</kbd>
      </div>
      <span class="time">{{ currentTime }}</span>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const now = ref(new Date())
let timer: number

const currentTitle = computed(() => (route.meta?.title as string) || 'WMS')
const currentTime = computed(() =>
  now.value.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
)

onMounted(() => { timer = window.setInterval(() => { now.value = new Date() }, 1000) })
onUnmounted(() => { clearInterval(timer) })
</script>

<style scoped>
.topbar {
  height: var(--topbar-height);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  border-radius: 0;
  border-top: none; border-right: none;
  flex-shrink: 0;
}

.page-title {
  font-size: 15px;
  font-weight: 600;
}

.topbar-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

.search-box {
  display: flex;
  align-items: center;
  gap: 6px;
  background: rgba(0,0,0,0.04);
  border: 1px solid rgba(0,0,0,0.06);
  border-radius: 8px;
  padding: 5px 10px;
}

.search-input {
  border: none;
  background: transparent;
  outline: none;
  font-size: 12.5px;
  color: var(--text-primary);
  width: 140px;
}

.search-input::placeholder { color: #aeaeb2; }

.shortcut {
  font-size: 10px;
  color: #aeaeb2;
  background: rgba(0,0,0,0.05);
  padding: 1px 5px;
  border-radius: 4px;
  font-family: inherit;
}

.time {
  font-size: 12.5px;
  font-weight: 500;
  color: var(--text-secondary);
  font-variant-numeric: tabular-nums;
}
</style>
