import { ActivityLevel } from '../enums/activity-level.enum';

export const INTENSITY_ML_PER_HOUR: Record<ActivityLevel, number> = {
  [ActivityLevel.SEDENTARY]: 0,
  [ActivityLevel.MODERATE]: 500,
  [ActivityLevel.ACTIVE]: 750,
  [ActivityLevel.VERY_ACTIVE]: 1000,
};
