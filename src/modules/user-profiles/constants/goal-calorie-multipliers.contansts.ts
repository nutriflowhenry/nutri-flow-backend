import { Goal } from '../enums/goal.enum';

export const GOAL_CALORIE_MULTIPLIERS: Record<Goal, number> = {
  [Goal.LOSE_WEIGHT]: 0.9,
  [Goal.MAINTAIN]: 1,
  [Goal.GAIN_MUSCLE]: 1.1,
};
