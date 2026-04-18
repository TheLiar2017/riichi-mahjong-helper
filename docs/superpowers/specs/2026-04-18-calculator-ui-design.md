# Calculator UI 优化设计

## 概述

优化立直麻将计算器的手牌展示和结果展示，同时修复场风参数未传递的 bug。

## 1. Bug 修复

**问题**：`fieldWind`（场风）参数在 UI 选项中存在，但 `detectYaku` 和 `analyzeTenpai` 调用时未传入，只有 `selfWind` 被使用。

**修复**：
- `detectedYaku` computed 传入 `selfWind.value` 作为自风，`fieldWind.value` 作为场风
- `tenpaiAnalysis` computed 同样传入两个 wind 参数
- `detector.ts` 中 `detectYaku` / `analyzeTenpai` 需支持 `fieldWind` 参数（役牌判定需同时考虑自风和场风）

**同时移除冗余代码**：
- `Calculator.vue` 第 67-79 行手动检测 tanyao/pinfu/tsumo 的逻辑是冗余的，役种检测已由 `detectYaku` 统一处理

## 2. 手牌展示优化 (HandDisplay)

**分组显示**：
- 手牌按花色分四行显示：万子(1-9m)、筒子(1-9p)、索子(1-9s)、字牌
- 每行用小标题标识花色

**进度指示**：
- 顶部显示 "12/14 张" 文字 + 进度条（填充进度）
- 进度条颜色使用 `--color-accent`

**删除交互**：
- 已选牌 hover 时显示红色 × 标记（opacity 0 → 1）
- 点击牌面删除（不需要点击 ×）

**代码改动**：
- 新增 `groupedTiles` computed，按花色分组
- 新增 `progress` computed，计算选牌进度百分比
- 模板按组循环渲染

## 3. 结果展示优化

### 3.1 点数结果卡

```
┌─────────────────────────────────┐
│         计算结果                 │
│                                 │
│     [3番]          [40符]       │  ← 大字号 accent 色
│                                 │
│   亲家支付: 2000   子家: 1000   │  ← 并排显示
│                                 │
│   [基本点: 1920]               │
└─────────────────────────────────┘
```

- 番/符 用 `3rem` 大字号
- 亲家/子家支付并排，金额用 `accent` 色高亮
- 立直棒信息单独一行

### 3.2 役种卡片

- 按 `han` 从高到低排序
- 每张卡片显示：`名称` (X番) + 描述 + 点数
- 使用 `YakuCard` 组件统一渲染

### 3.3 详细分解（可折叠）

- 默认折叠，只显示 "查看详细分解"
- 点击展开显示 breakdown 列表
- 使用 `<details>` / `<summary>` 实现

### 3.4 进张分析

- 等待牌 ID 高亮显示（accent 色）
- 列出该进张对应的役种及番数

## 4. 交互优化

- 选牌 tile hover 时 `translateY(-2px)` + `filter brightness`
- 结果卡出现时 `fadeIn` 动画（`@keyframes fadeIn`）
- 折叠展开使用 `max-height` 过渡动画

## 5. 组件改动

| 文件 | 改动 |
|------|------|
| `HandDisplay.vue` | 分组显示、进度条、hover 删除 |
| `Calculator.vue` | 移除冗余役种检测、传入 fieldWind、结果布局优化 |
| `detector.ts` | 支持 fieldWind 参数 |

## 6. 优先级

1. 修复场风 bug
2. HandDisplay 分组 + 进度条
3. Calculator 结果布局优化
4. 详细分解折叠
5. 动画效果
