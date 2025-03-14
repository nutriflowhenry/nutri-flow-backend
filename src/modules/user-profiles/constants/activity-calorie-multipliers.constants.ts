import { ActivityLevel } from '../enums/activity-level.enum';

export const ACTIVITY_CALORIE_MULTIPLIERS: Record<ActivityLevel, number> = {
  [ActivityLevel.SEDENTARY]: 1.2, // Equivalente a sedentario en tabla de calorias
  [ActivityLevel.MODERATE]: 1.55, // Equivalente a moderadamente activo en tabla de calorías
  [ActivityLevel.ACTIVE]: 1.725, // Equivalente a muy activo en tabla de calorías
  [ActivityLevel.VERY_ACTIVE]: 1.9, // Equivalente a Atleta profesional en tabla de calorías
};
