# 役种自动检测 — 设计方案

## 概述

为立直麻将计算器实现自动役种检测功能，支持完整和牌型（14张）检测和听牌分析（13张）。

## 架构

```
packages/core/src/
├── domain/
│   ├── detector.ts      # 役种检测核心（新增）
│   ├── patterns.ts     # 面子模式匹配工具（新增）
│   ├── fu.ts           # 修复符数计算
│   └── score.ts
└── data/
    └── yaku.ts         # 役种数据
```

## 接口设计

### YakuMatch

```typescript
interface YakuMatch {
  yaku: Yaku;
  breakdown: string[];
  score?: ScoreResult;
}
```

### detectYaku

```typescript
function detectYaku(
  tiles: Tile[],
  isTsumo: boolean,
  isParent: boolean,
  wind?: WindType
): YakuMatch[]
```

完整和牌时枚举所有 `4面子+1雀头` 组合，对每种组合检测匹配役种。

### analyzeTenpai

```typescript
interface TenpaiResult {
  waitingTiles: Tile[];
  bestWaitingTile: Tile;
  possibleYaku: YakuMatch[];
}
function analyzeTenpai(tiles: Tile[], wind?: WindType): TenpaiResult
```

对13张手牌枚举21种进张，分析每种进张可和役种，按收益排序。

## 检测流程

### 拆解面子

枚举所有 `4面子+1雀头` 的可能组合：
- 面子类型：`pon`(刻子)、`chi`(顺子)、`kan`(杠)
- 优先处理4张杠、3张刻子，剩余牌尝试顺子

### 组合验证

对每种组合提取特征：
- 是否全顺子（Pinfu前提）
- 是否含幺九牌
- 是否同一花色
- 雀头类型（役牌/非役牌）
- 听牌形状（两面/边张/嵌张/单骑）

### 役种匹配

按条件检测每个役种：
- tanyao：不含1/9/字牌
- pinfu：全顺子+非役牌雀头+两面听
- ittsu：一气通贯（123/456/789同花色顺子）
- honitsu/chinitsu：混一色/清一色
- ...等

## 符数计算修复

- `isRyanpeikou`：检测二杯口（两个相同顺子）
- 平和自摸：20符非30符
- 听牌形状：边张/嵌张+2符，单骑+2符
- 杠符数：正确累加明杠/暗杠符数

## Calculator.vue 更新

- 添加自风/场风设置（影响役牌计算）
- 添加亲家/子家设置（影响点数）
- 调用 detectYaku 显示可和役种列表
- 调用 analyzeTenpai 显示进张分析
- 支持手牌字符串输入（如 `1m1m1m2m3m...`）
