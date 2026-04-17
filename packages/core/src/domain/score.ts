import { calculateBaseScore, type FuResult } from './fu';

export interface ScoreResult {
  han: number;
  fu: number;
  mangan: boolean;
  basicPoints: number;
  parentPoints: number;
  childPoints: number;
  riichiBet: number;
  breakdown: string[];
}

export function calculateScore(
  fuResult: FuResult,
  yakuHan: number,
  isParent: boolean,
  riichiBets: number = 0
): ScoreResult {
  const breakdown: string[] = [];
  const { total: fu, isTsumo, isPinfu, breakdown: fuBreakdown } = fuResult;

  let han = yakuHan;

  // Add tsumo bonus for menzen tsumo
  if (isTsumo && fuResult.isMenzen) {
    han += 1;
    breakdown.push('门清自摸: +1番');
  }

  // Add pinfu bonus
  if (isPinfu && !isTsumo) {
    han += 1;
    breakdown.push('平和: +1番');
  }

  breakdown.push(...fuBreakdown);
  breakdown.push(`番数: ${han}番`);
  breakdown.push(`符数: ${fu}符`);

  const { mangan, basicPoints, totalPoints } = calculateBaseScore(han, fu, isParent);

  if (mangan) {
    breakdown.push('满贯: 已达成');
  }

  breakdown.push(`基本点: ${basicPoints}`);

  // Calculate parent and child points
  const parentPoints = isParent ? totalPoints : Math.ceil(totalPoints * 2 / 3);
  const childPoints = isParent ? Math.ceil(totalPoints * 2 / 3) : totalPoints;

  breakdown.push(`亲家支付: ${parentPoints}`);
  breakdown.push(`子家支付: ${childPoints}`);

  // Add riichi bets
  if (riichiBets > 0) {
    const riichiPoints = riichiBets * 1000;
    breakdown.push(`立直棒: +${riichiPoints}`);
  }

  return {
    han,
    fu,
    mangan,
    basicPoints,
    parentPoints: parentPoints + riichiBets * 1000,
    childPoints: childPoints + riichiBets * 1000,
    riichiBet: riichiBets,
    breakdown
  };
}

export function formatScore(points: number): string {
  if (points >= 10000) {
    return `${Math.floor(points / 10000)}万${points % 10000 > 0 ? ` ${points % 10000}` : ''}`;
  }
  return `${points}`;
}
