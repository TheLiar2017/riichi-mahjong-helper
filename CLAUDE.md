# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述

立直麻将助手 (Riichi Mahjong Helper) - 日式立直麻将规则查询、役种详解、符数点数计算工具。

## 开发命令

```bash
npm run dev      # 启动 web 开发服务器 (packages/web)
npm run build    # 构建 web 应用
npm run preview  # 预览构建结果
```

## 架构

**Monorepo 结构**: `packages/core` + `packages/web`

```
packages/
├── core/                    # 纯 TypeScript 核心逻辑，可跨平台复用
│   └── src/
│       ├── data/            # 牌数据、役种数据、规则数据
│       ├── domain/          # 符数计算、点数计算等业务逻辑
│       └── index.ts         # 统一导出
└── web/                     # Vue 3 + Vite 前端应用
    └── src/
        ├── components/      # UI 组件
        ├── views/          # 页面视图
        ├── styles/         # 日式和风主题样式
        └── router/         # Vue Router 配置
```

**核心原则**: `packages/core` 与 UI 完全分离，可独立测试，后续可复用开发 CLI、小程序等。

## 技术栈

- **Core**: TypeScript，无 UI 依赖
- **Web**: Vue 3 + Vite + TypeScript + Vue Router
- **样式**: 日式和风主题（深蓝灰 + 金色点缀）

## 数据结构

- `data/tiles.ts`: 34 种牌定义（万/筒/索/字）
- `data/yaku.ts`: 40+ 役种数据（含手牌示例、特殊规则）
- `data/rules.ts`: 规则配置数据
- `domain/fu.ts`: 符数计算逻辑
- `domain/score.ts`: 点数计算逻辑

## 状态管理

使用 Vue 3 Composition API + `provide/inject`，无需 Vuex/Pinia。
