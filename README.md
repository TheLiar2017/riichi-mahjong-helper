# 立直麻将助手 (Riichi Mahjong Helper)

日式立直麻将规则查询、役种详解、符数点数计算工具。

## 功能

- 基础规则查询（场风自风、食断、振听等）
- 40+ 役种详解（含手牌示例、特殊规则、常见陷阱）
- 图形化符数与点数计算器

## 技术栈

- **Core**: TypeScript（核心逻辑，可跨平台复用）
- **Web**: Vue 3 + Vite + TypeScript + Vue Router
- **样式**: 日式和风主题

## 开发

```bash
npm install
npm run dev      # 启动开发服务器
npm run build    # 构建生产版本
```

## 架构

```
packages/
├── core/        # 核心逻辑（牌数据、役种、符数点数计算）
└── web/         # Vue 3 前端应用
```

核心逻辑与 UI 完全分离，`packages/core` 可独立使用。
