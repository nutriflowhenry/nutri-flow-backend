import { INTENSITY_ML_PER_HOUR } from '../constants/ml-Per-Hour.constants';
import { HydrationCalculateData } from '../interfaces/hydration-calculate-data.interface';

export const calculateHydrationGoal = (
  hydrationCalculateData: HydrationCalculateData,
): number => {
  const { weight, activityLevel } = hydrationCalculateData;
  const mlHydrationGoal: number = Math.ceil(
    weight * 35 + INTENSITY_ML_PER_HOUR[activityLevel],
  );
  return mlHydrationGoal;
};
