import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/home'
  },
  {
    path: '/home',
    name: 'Home',
    component: () => import('../views/Home.vue'),
    meta: { title: '首页', icon: '🏠' }
  },
  {
    path: '/system',
    name: 'System',
    component: () => import('../views/System.vue'),
    meta: { title: '系统管理', icon: '⚙️' }
  },
  {
    path: '/base-data',
    name: 'BaseData',
    component: () => import('../views/BaseData.vue'),
    meta: { title: '基础资料', icon: '📁' }
  },
  {
    path: '/inbound',
    name: 'Inbound',
    component: () => import('../views/Inbound.vue'),
    meta: { title: '入库管理', icon: '📥' }
  },
  {
    path: '/outbound',
    name: 'Outbound',
    component: () => import('../views/Outbound.vue'),
    meta: { title: '出库管理', icon: '📤' }
  },
  {
    path: '/inventory',
    name: 'Inventory',
    component: () => import('../views/Inventory.vue'),
    meta: { title: '库存管理', icon: '📦' }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
