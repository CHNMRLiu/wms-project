<template>
  <aside class="sidebar glass-dark">
    <div class="logo-area">
      <div class="logo-icon">
        <svg viewBox="0 0 32 32" width="26" height="26">
          <defs>
            <linearGradient id="lg" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style="stop-color:#007aff" />
              <stop offset="100%" style="stop-color:#5856d6" />
            </linearGradient>
          </defs>
          <rect x="2" y="2" width="28" height="28" rx="7" fill="url(#lg)" />
          <path d="M10 22 L10 14 L16 10 L22 14 L22 22 L16 18 Z" fill="white" opacity="0.9" />
        </svg>
      </div>
      <div class="logo-text">
        <span class="brand">WMS</span>
        <span class="sub">仓储管理系统</span>
      </div>
    </div>

    <nav class="nav-menu">
      <router-link
        v-for="item in menuItems"
        :key="item.path"
        :to="item.path"
        class="nav-item"
        :class="{ active: isActive(item.path) }"
      >
        <span class="nav-icon">{{ item.icon }}</span>
        <span class="nav-label">{{ item.label }}</span>
      </router-link>
    </nav>

    <div class="sidebar-footer">
      <div class="user-avatar">👤</div>
      <div class="user-info">
        <span class="user-name">管理员</span>
        <span class="user-role">admin</span>
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'

const route = useRoute()

const menuItems = [
  { path: '/home', icon: '🏠', label: '首页' },
  { path: '/inbound', icon: '📥', label: '入库管理' },
  { path: '/outbound', icon: '📤', label: '出库管理' },
  { path: '/inventory', icon: '📦', label: '库存管理' },
  { path: '/base-data', icon: '📁', label: '基础资料' },
  { path: '/system', icon: '⚙️', label: '系统管理' }
]

function isActive(path: string): boolean {
  return route.path === path
}
</script>

<style scoped>
.sidebar {
  position: fixed;
  top: 0; left: 0; bottom: 0;
  width: var(--sidebar-width);
  display: flex;
  flex-direction: column;
  z-index: 100;
  border-radius: 0;
  border-left: none; border-top: none; border-bottom: none;
}

.logo-area {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 18px 16px 14px;
  border-bottom: 1px solid rgba(255,255,255,0.08);
}

.brand {
  font-size: 17px;
  font-weight: 700;
  color: #fff;
  letter-spacing: 1px;
}

.logo-text { display: flex; flex-direction: column; }

.sub {
  font-size: 10px;
  color: rgba(255,255,255,0.45);
}

.nav-menu {
  flex: 1;
  padding: 10px 10px;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border-radius: 8px;
  text-decoration: none;
  color: rgba(255,255,255,0.6);
  font-size: 13.5px;
  font-weight: 500;
  transition: all 0.2s;
}

.nav-item:hover {
  background: rgba(255,255,255,0.08);
  color: rgba(255,255,255,0.9);
}

.nav-item.active {
  background: var(--accent);
  color: #fff;
  box-shadow: 0 2px 12px rgba(0,122,255,0.35);
}

.nav-icon { font-size: 16px; width: 22px; text-align: center; }

.sidebar-footer {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 14px 16px;
  border-top: 1px solid rgba(255,255,255,0.08);
}

.user-avatar {
  width: 30px; height: 30px;
  border-radius: 50%;
  background: rgba(255,255,255,0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
}

.user-info { display: flex; flex-direction: column; }
.user-name { font-size: 12px; font-weight: 600; color: rgba(255,255,255,0.85); }
.user-role { font-size: 10px; color: rgba(255,255,255,0.35); }
</style>
