# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A Japanese Riichi Mahjong assistant web application built with Vue 3 + TypeScript + Vite. The app helps players learn rules, look up yaku (hand combinations), calculate fu/han scores, and analyze tenpai (waiting hands).

## Development Commands

```bash
npm run dev      # Start development server at http://localhost:5173
npm run build    # Build for production (runs type checking via vue-tsc)
npm run preview  # Preview production build
```

## Architecture

### Tile Encoding System
Tiles are encoded as integers using `suit * 10 + number`:
- 0-9 (m): 万子 (character tiles)
- 10-19 (p): 筒子 (circle tiles)
- 20-29 (s): 索子 (bamboo tiles)
- 30-37 (z): 字牌 (honor tiles: east/south/west/north/white/green/red)

Red fives use negative values: -1 (red 5m), -2 (red 5p), -3 (red 5s)

### Key Modules

- `src/data/tiles.ts` - Tile encoding/decoding, Unicode emoji display, `countTiles()`
- `src/data/yaku.ts` - Yaku definitions (40+ hand combinations) and `YakuContext`
- `src/utils/fu.ts` - Hand structure analysis, meld detection, fu calculation helpers
- `src/utils/yaku-calculator.ts` - Yaku validation logic for each hand type
- `src/utils/score.ts` - Score calculation with mangan (满贯) handling
- `src/utils/shanten.ts` - Shanten (向听数) calculation and waiting tile analysis

### Views/Routing

- `/` - Home page with feature navigation
- `/rules` - Japanese Riichi Mahjong rules reference
- `/yaku` - Yaku list with filtering by han (番) count
- `/calculator` - Interactive tile selector with fu/score calculation
- `/shanten` - Hand analysis with waiting tile display

### Component Structure

- `Tile.vue` - Single tile display using Unicode mahjong emoji
- `TileSelector.vue` - Interactive tile selection grid with suit sections
- `HandDisplay.vue` - Renders sorted hand tiles
- `YakuCard.vue` - Displays yaku info with example tiles

## Type Checking

The project uses strict TypeScript with `verbatimModuleSyntax`. When adding imports:
- Use `import type { TypeName }` for type-only imports
- Prefix unused parameters with underscore (e.g., `_context`)
