<template>
  <div class="dashboard">
    <!-- 标题区 -->
    <div class="dashboard-header animate-in">
      <div>
        <h2 class="text-2xl font-bold text-gray-800">数据总览看板</h2>
        <p class="text-sm text-gray-400 mt-1">实时监控仓储核心指标 · {{ currentDate }}</p>
      </div>
      <div class="header-right">
        <span class="refresh-dot"></span>
        <span class="text-xs text-gray-400">数据每 5 分钟刷新</span>
      </div>
    </div>

    <!-- 6 核心数据卡片 -->
    <div class="card-grid">
      <div
        v-for="(card, i) in dataCards"
        :key="card.title"
        class="data-card glass animate-in"
        :style="{ animationDelay: `${i * 80}ms` }"
      >
        <div class="card-top">
          <div class="card-icon" :style="{ background: card.iconBg }">
            <span>{{ card.icon }}</span>
          </div>
          <span
            class="card-trend"
            :class="card.trendDir === 'up' ? 'trend-up' : card.trendDir === 'down' ? 'trend-down' : 'trend-neutral'"
          >
            <template v-if="card.trendDir === 'up'">↑</template>
            <template v-else-if="card.trendDir === 'down'">↓</template>
            {{ card.trend }}
          </span>
        </div>
        <div class="card-value">
          <span class="value-number">{{ animatedValues[card.key] ?? card.value }}</span>
          <span v-if="card.unit" class="value-unit">{{ card.unit }}</span>
        </div>
        <div class="card-title">{{ card.title }}</div>
        <div class="card-sub">{{ card.sub }}</div>
        <div class="card-sparkline">
          <svg viewBox="0 0 120 32" preserveAspectRatio="none">
            <polyline
              :points="card.sparkline"
              fill="none"
              :stroke="card.color"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <polyline
              :points="card.sparkline + ' 120,32 0,32'"
              :fill="card.color"
              opacity="0.06"
            />
          </svg>
        </div>
      </div>
    </div>

    <!-- 图表区域 -->
    <div class="chart-grid animate-in" style="animation-delay: 500ms">
      <div class="chart-card glass">
        <div class="chart-header">
          <span class="chart-dot" style="background: #007aff"></span>
          <h3 class="chart-title">出入库趋势</h3>
          <span class="chart-tag">近 7 天</span>
        </div>
        <v-chart class="chart-body" :option="lineOption" autoresize />
      </div>

      <div class="chart-card glass">
        <div class="chart-header">
          <span class="chart-dot" style="background: #5856d6"></span>
          <h3 class="chart-title">合同履约</h3>
          <span class="chart-tag">本月</span>
        </div>
        <v-chart class="chart-body" :option="barOption" autoresize />
      </div>

      <div class="chart-card glass">
        <div class="chart-header">
          <span class="chart-dot" style="background: #34c759"></span>
          <h3 class="chart-title">库存占比</h3>
          <span class="chart-tag">当前</span>
        </div>
        <v-chart class="chart-body" :option="pieOption" autoresize />
      </div>
    </div>

    <!-- Dock 栏快捷入口 -->
    <div class="dock-wrapper animate-in" style="animation-delay: 650ms">
      <div class="dock glass">
        <div
          v-for="(item, i) in dockItems"
          :key="item.label"
          class="dock-item"
          :style="{ animationDelay: `${700 + i * 60}ms` }"
          @click="handleDockClick(item)"
        >
          <div class="dock-icon" :style="{ background: item.bg }">
            <svg v-html="item.svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" class="dock-svg"></svg>
          </div>
          <span class="dock-label">{{ item.label }}</span>
          <div class="dock-tooltip">{{ item.tooltip }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, onMounted, computed } from 'vue'
import VChart from 'vue-echarts'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { LineChart, BarChart, PieChart } from 'echarts/charts'
import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
} from 'echarts/components'

use([CanvasRenderer, LineChart, BarChart, PieChart, TitleComponent, TooltipComponent, GridComponent, LegendComponent])

// ── 日期 ──
const currentDate = computed(() => {
  const d = new Date()
  return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`
})

// ── 数据卡片 ──
const dataCards = [
  {
    key: 'inout', icon: '🔄', iconBg: 'rgba(0,122,255,0.12)',
    title: '今日出入库量', value: 0, target: 2847, unit: '件',
    trend: '↑ 12.3%', trendDir: 'up', sub: '较昨日增加 311 件',
    color: '#007aff', sparkline: '0,22 20,16 40,20 60,10 80,14 100,6 120,8'
  },
  {
    key: 'stock', icon: '📦', iconBg: 'rgba(52,199,89,0.12)',
    title: '在库货品总量', value: 0, target: 58632, unit: '件',
    trend: '↑ 3.1%', trendDir: 'up', sub: '库存利用率 78.5%',
    color: '#34c759', sparkline: '0,18 20,20 40,16 60,18 80,12 100,14 120,10'
  },
  {
    key: 'contracts', icon: '📋', iconBg: 'rgba(88,86,214,0.12)',
    title: '有效合同数', value: 0, target: 142, unit: '份',
    trend: '↑ 8 份', trendDir: 'up', sub: '本月新增 23 份',
    color: '#5856d6', sparkline: '0,24 20,20 40,22 60,16 80,18 100,10 120,12'
  },
  {
    key: 'pending', icon: '⏳', iconBg: 'rgba(255,159,10,0.12)',
    title: '待订货合同数', value: 0, target: 17, unit: '份',
    trend: '↓ 3 份', trendDir: 'down', sub: '需尽快跟进处理',
    color: '#ff9f0a', sparkline: '0,8 20,12 40,10 60,16 80,14 100,20 120,18'
  },
  {
    key: 'overdue', icon: '🚨', iconBg: 'rgba(255,59,48,0.12)',
    title: '逾期交货合同数', value: 0, target: 5, unit: '份',
    trend: '↑ 2 份', trendDir: 'up', sub: '需紧急协调供应商',
    color: '#ff3b30', sparkline: '0,20 20,16 40,18 60,12 80,8 100,10 120,6'
  },
  {
    key: 'rate', icon: '✅', iconBg: 'rgba(52,199,89,0.12)',
    title: '供应商供货达标率', value: 0, target: 96.8, unit: '%',
    trend: '↑ 1.2%', trendDir: 'up', sub: '高于行业均值 89%',
    color: '#34c759', sparkline: '0,24 20,20 40,22 60,18 80,16 100,12 120,8'
  }
]

// ── 数字动画 ──
const animatedValues = reactive<Record<string, string>>({})
function animateNumber(key: string, target: number, duration = 1200) {
  const isFloat = target % 1 !== 0
  const start = performance.now()
  function tick(now: number) {
    const p = Math.min((now - start) / duration, 1)
    const eased = p === 1 ? 1 : 1 - Math.pow(2, -10 * p)
    const cur = eased * target
    animatedValues[key] = isFloat ? cur.toFixed(1) : Math.round(cur).toLocaleString('zh-CN')
    if (p < 1) requestAnimationFrame(tick)
  }
  requestAnimationFrame(tick)
}

onMounted(() => {
  dataCards.forEach((c, i) => {
    setTimeout(() => animateNumber(c.key, c.target), i * 150 + 300)
  })
})

// ── 公共图表样式 ──
const commonTextStyle = { fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "PingFang SC", sans-serif', color: '#8e8e93' }
const axisLineStyle = { color: 'rgba(0,0,0,0.06)' }
const splitLineStyle = { color: 'rgba(0,0,0,0.04)', type: 'dashed' as const }
const days = ['3/24', '3/25', '3/26', '3/27', '3/28', '3/29', '3/30']

// ── 折线图：出入库趋势 ──
const lineOption = computed(() => ({
  tooltip: {
    trigger: 'axis',
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderColor: 'rgba(0,0,0,0.08)',
    borderWidth: 1,
    textStyle: { color: '#1d1d1f', fontSize: 12, fontFamily: commonTextStyle.fontFamily },
    axisPointer: { type: 'cross', crossStyle: { color: '#ccc' } }
  },
  legend: {
    top: 4, right: 0,
    textStyle: { ...commonTextStyle, fontSize: 11 },
    itemWidth: 12, itemHeight: 3, itemGap: 16,
  },
  grid: { left: 36, right: 16, top: 36, bottom: 24 },
  xAxis: {
    type: 'category', data: days, boundaryGap: false,
    axisLine: { lineStyle: axisLineStyle },
    axisTick: { show: false },
    axisLabel: { ...commonTextStyle, fontSize: 11 },
  },
  yAxis: {
    type: 'value',
    splitLine: { lineStyle: splitLineStyle },
    axisLine: { show: false },
    axisTick: { show: false },
    axisLabel: { ...commonTextStyle, fontSize: 11 },
  },
  series: [
    {
      name: '入库',
      type: 'line',
      smooth: true,
      symbol: 'circle', symbolSize: 6,
      lineStyle: { width: 2.5, color: '#007aff' },
      itemStyle: { color: '#007aff', borderWidth: 2, borderColor: '#fff' },
      areaStyle: {
        color: {
          type: 'linear', x: 0, y: 0, x2: 0, y2: 1,
          colorStops: [
            { offset: 0, color: 'rgba(0,122,255,0.25)' },
            { offset: 1, color: 'rgba(0,122,255,0.02)' }
          ]
        }
      },
      data: [1280, 1450, 1320, 1580, 1420, 1690, 1530],
    },
    {
      name: '出库',
      type: 'line',
      smooth: true,
      symbol: 'circle', symbolSize: 6,
      lineStyle: { width: 2.5, color: '#5856d6' },
      itemStyle: { color: '#5856d6', borderWidth: 2, borderColor: '#fff' },
      areaStyle: {
        color: {
          type: 'linear', x: 0, y: 0, x2: 0, y2: 1,
          colorStops: [
            { offset: 0, color: 'rgba(88,86,214,0.20)' },
            { offset: 1, color: 'rgba(88,86,214,0.02)' }
          ]
        }
      },
      data: [980, 1120, 1050, 1260, 1180, 1380, 1317],
    }
  ]
}))

// ── 柱状图：合同履约 ──
const barOption = computed(() => ({
  tooltip: {
    trigger: 'axis',
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderColor: 'rgba(0,0,0,0.08)',
    borderWidth: 1,
    textStyle: { color: '#1d1d1f', fontSize: 12, fontFamily: commonTextStyle.fontFamily },
  },
  legend: {
    top: 4, right: 0,
    textStyle: { ...commonTextStyle, fontSize: 11 },
    itemWidth: 12, itemHeight: 10, itemGap: 16,
  },
  grid: { left: 36, right: 16, top: 36, bottom: 24 },
  xAxis: {
    type: 'category',
    data: ['第1周', '第2周', '第3周', '第4周'],
    axisLine: { lineStyle: axisLineStyle },
    axisTick: { show: false },
    axisLabel: { ...commonTextStyle, fontSize: 11 },
  },
  yAxis: {
    type: 'value',
    max: 100,
    splitLine: { lineStyle: splitLineStyle },
    axisLine: { show: false },
    axisTick: { show: false },
    axisLabel: { ...commonTextStyle, fontSize: 11, formatter: '{value}%' },
  },
  series: [
    {
      name: '按时履约',
      type: 'bar',
      barWidth: 18,
      itemStyle: {
        borderRadius: [6, 6, 0, 0],
        color: {
          type: 'linear', x: 0, y: 0, x2: 0, y2: 1,
          colorStops: [
            { offset: 0, color: '#5856d6' },
            { offset: 1, color: 'rgba(88,86,214,0.4)' }
          ]
        }
      },
      data: [92, 88, 95, 91],
    },
    {
      name: '逾期',
      type: 'bar',
      barWidth: 18,
      itemStyle: {
        borderRadius: [6, 6, 0, 0],
        color: {
          type: 'linear', x: 0, y: 0, x2: 0, y2: 1,
          colorStops: [
            { offset: 0, color: '#ff3b30' },
            { offset: 1, color: 'rgba(255,59,48,0.3)' }
          ]
        }
      },
      data: [8, 12, 5, 9],
    }
  ]
}))

// ── 饼图：库存占比 ──
const pieOption = computed(() => ({
  tooltip: {
    trigger: 'item',
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderColor: 'rgba(0,0,0,0.08)',
    borderWidth: 1,
    textStyle: { color: '#1d1d1f', fontSize: 12, fontFamily: commonTextStyle.fontFamily },
    formatter: '{b}: {c} 件 ({d}%)',
  },
  series: [
    {
      type: 'pie',
      radius: ['42%', '70%'],
      center: ['50%', '55%'],
      avoidLabelOverlap: true,
      padAngle: 2,
      itemStyle: { borderRadius: 8 },
      label: {
        show: true,
        fontSize: 11,
        color: '#6e6e73',
        fontFamily: commonTextStyle.fontFamily,
        formatter: '{b}\n{d}%',
      },
      labelLine: { length: 10, length2: 8, lineStyle: { color: '#d1d1d6' } },
      data: [
        {
          value: 18420,
          name: '电子元器件',
          itemStyle: {
            color: {
              type: 'linear', x: 0, y: 0, x2: 1, y2: 1,
              colorStops: [
                { offset: 0, color: '#007aff' },
                { offset: 1, color: '#5ac8fa' }
              ]
            }
          }
        },
        {
          value: 14850,
          name: '五金配件',
          itemStyle: {
            color: {
              type: 'linear', x: 0, y: 0, x2: 1, y2: 1,
              colorStops: [
                { offset: 0, color: '#5856d6' },
                { offset: 1, color: '#af52de' }
              ]
            }
          }
        },
        {
          value: 12360,
          name: '包装材料',
          itemStyle: {
            color: {
              type: 'linear', x: 0, y: 0, x2: 1, y2: 1,
              colorStops: [
                { offset: 0, color: '#34c759' },
                { offset: 1, color: '#30d158' }
              ]
            }
          }
        },
        {
          value: 8200,
          name: '办公用品',
          itemStyle: {
            color: {
              type: 'linear', x: 0, y: 0, x2: 1, y2: 1,
              colorStops: [
                { offset: 0, color: '#ff9f0a' },
                { offset: 1, color: '#ffd60a' }
              ]
            }
          }
        },
        {
          value: 4802,
          name: '其他',
          itemStyle: {
            color: {
              type: 'linear', x: 0, y: 0, x2: 1, y2: 1,
              colorStops: [
                { offset: 0, color: '#ff375f' },
                { offset: 1, color: '#ff6b81' }
              ]
            }
          }
        }
      ]
    }
  ]
}))

// ── Dock 栏 ──
const dockItems = [
  {
    label: '新增合同',
    tooltip: '快速创建采购 / 销售合同',
    bg: 'linear-gradient(135deg, #007aff, #5ac8fa)',
    svg: '<line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>',
    route: '/contract/new',
  },
  {
    label: '快速订货',
    tooltip: '一键下单，极速补货',
    bg: 'linear-gradient(135deg, #ff9f0a, #ffd60a)',
    svg: '<circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>',
    route: '/order/quick',
  },
  {
    label: '供应商查询',
    tooltip: '搜索与管理供应商信息',
    bg: 'linear-gradient(135deg, #5856d6, #af52de)',
    svg: '<circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>',
    route: '/supplier/search',
  },
  {
    label: '库存盘点',
    tooltip: '启动实时库存盘点',
    bg: 'linear-gradient(135deg, #34c759, #30d158)',
    svg: '<path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>',
    route: '/inventory/check',
  },
  {
    label: '报表导出',
    tooltip: '导出 Excel / PDF 报表',
    bg: 'linear-gradient(135deg, #ff375f, #ff6b81)',
    svg: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>',
    route: '/report/export',
  },
]

function handleDockClick(item: typeof dockItems[number]) {
  // TODO: router.push(item.route) — 等对应页面开发后接入
  console.log('Dock click:', item.label)
}
</script>

<style scoped>
.dashboard {
  display: flex;
  flex-direction: column;
  gap: 20px;
  max-width: 1200px;
  padding-bottom: 24px;
}

/* ── 标题区 ── */
.dashboard-header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
}
.header-right { display: flex; align-items: center; gap: 6px; }
.refresh-dot {
  width: 6px; height: 6px; border-radius: 50%;
  background: #34c759;
  animation: pulse 2s infinite;
}
@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.3} }

/* ── 卡片网格 ── */
.card-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}
.data-card {
  position: relative;
  border-radius: 16px;
  padding: 22px 22px 14px;
  overflow: hidden;
  cursor: default;
  transition: transform 0.3s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.3s ease;
}
.data-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 16px 48px rgba(0,0,0,0.12), 0 4px 12px rgba(0,0,0,0.06);
}
.card-top { display: flex; align-items: center; justify-content: space-between; margin-bottom: 14px; }
.card-icon {
  width: 40px; height: 40px; border-radius: 10px;
  display: flex; align-items: center; justify-content: center; font-size: 20px;
}
.card-trend { font-size: 12px; font-weight: 600; padding: 3px 10px; border-radius: 20px; }
.trend-up { color: #34c759; background: rgba(52,199,89,0.1); }
.trend-down { color: #ff3b30; background: rgba(255,59,48,0.1); }
.trend-neutral { color: #8e8e93; background: rgba(142,142,147,0.1); }
.card-value { display: flex; align-items: baseline; gap: 4px; margin-bottom: 6px; }
.value-number {
  font-size: 32px; font-weight: 700; color: #1d1d1f;
  font-variant-numeric: tabular-nums; letter-spacing: -0.5px;
}
.value-unit { font-size: 14px; font-weight: 500; color: #8e8e93; }
.card-title { font-size: 14px; font-weight: 600; color: #1d1d1f; margin-bottom: 2px; }
.card-sub { font-size: 12px; color: #aeaeb2; }
.card-sparkline {
  position: absolute; bottom: 0; left: 0; right: 0;
  height: 48px; pointer-events: none;
}
.card-sparkline svg { width: 100%; height: 100%; }

/* ── 图表网格 ── */
.chart-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}
.chart-card {
  border-radius: 16px;
  padding: 18px 20px 12px;
  display: flex;
  flex-direction: column;
}
.chart-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}
.chart-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
.chart-title { font-size: 14px; font-weight: 600; color: #1d1d1f; }
.chart-tag {
  font-size: 11px; color: #8e8e93;
  background: rgba(0,0,0,0.04);
  padding: 2px 8px; border-radius: 10px;
  margin-left: auto;
}
.chart-body { width: 100%; height: 240px; }

/* ── Dock 栏 ── */
.dock-wrapper {
  display: flex;
  justify-content: center;
  margin-top: 8px;
  padding-bottom: 12px;
}
.dock {
  display: flex;
  gap: 6px;
  padding: 10px 18px;
  border-radius: 22px;
  background: rgba(255,255,255,0.72);
  backdrop-filter: blur(28px) saturate(180%);
  -webkit-backdrop-filter: blur(28px) saturate(180%);
  border: 1px solid rgba(255,255,255,0.5);
  box-shadow: 0 8px 40px rgba(0,0,0,0.10), inset 0 1px 0 rgba(255,255,255,0.6);
}
.dock-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
  cursor: pointer;
  position: relative;
  padding: 4px 10px;
  border-radius: 14px;
  animation: fadeInUp 0.35s ease both;
  transition: transform 0.25s cubic-bezier(0.34,1.56,0.64,1), background 0.2s;
}
.dock-item:hover {
  transform: translateY(-10px) scale(1.08);
  background: rgba(0,0,0,0.04);
}
.dock-item:hover .dock-tooltip {
  opacity: 1;
  transform: translateX(-50%) translateY(-4px);
  pointer-events: auto;
}
.dock-icon {
  width: 48px; height: 48px; border-radius: 14px;
  display: flex; align-items: center; justify-content: center;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.3);
  transition: box-shadow 0.25s;
}
.dock-item:hover .dock-icon {
  box-shadow: 0 8px 24px rgba(0,0,0,0.22), inset 0 1px 0 rgba(255,255,255,0.3);
}
.dock-svg { width: 22px; height: 22px; color: #fff; }
.dock-label { font-size: 11px; font-weight: 500; color: #6e6e73; white-space: nowrap; }

/* tooltip */
.dock-tooltip {
  position: absolute;
  bottom: calc(100% + 6px);
  left: 50%;
  transform: translateX(-50%) translateY(4px);
  background: rgba(30,30,30,0.92);
  color: #fff;
  font-size: 12px;
  padding: 6px 12px;
  border-radius: 8px;
  white-space: nowrap;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.2s, transform 0.2s;
  backdrop-filter: blur(8px);
  box-shadow: 0 4px 16px rgba(0,0,0,0.2);
}
.dock-tooltip::after {
  content: '';
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  border: 5px solid transparent;
  border-top-color: rgba(30,30,30,0.92);
}

/* ── 响应式 ── */
@media (max-width: 1024px) {
  .card-grid, .chart-grid { grid-template-columns: repeat(2, 1fr); }
}
@media (max-width: 640px) {
  .card-grid, .chart-grid { grid-template-columns: 1fr; }
  .value-number { font-size: 26px; }
  .chart-body { height: 200px; }
  .dock { padding: 8px 12px; gap: 4px; }
  .dock-icon { width: 40px; height: 40px; border-radius: 12px; }
  .dock-svg { width: 18px; height: 18px; }
}
</style>
