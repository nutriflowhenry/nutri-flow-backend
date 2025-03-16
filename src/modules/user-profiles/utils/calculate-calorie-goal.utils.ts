import { agent } from 'supertest';
import { Gender } from '../enums/gender.enum';
import { CalorieCalculateData } from '../interfaces/calorie-calculate-data.interface';
import { ACTIVITY_CALORIE_MULTIPLIERS } from '../constants/activity-calorie-multipliers.constants';
import { GOAL_CALORIE_MULTIPLIERS } from '../constants/goal-calorie-multipliers.contansts';

export const calculateCaloriesGoal = (
  calculateCaloriesGoal: CalorieCalculateData,
): number => {
  const { gender, weight, height, age, activityLevel, weightGoal } =
    calculateCaloriesGoal;
  const cmheight: number = height * 100;
  let tmb: number;
  if (gender === Gender.MALE) {
    tmb = 88.362 + 13.397 * weight + 4.799 * cmheight - 5.677 * age;
  } else {
    tmb = 447.593 + 9.247 * weight + 3.098 * cmheight - 4.33 * age;
  }
  tmb = tmb * ACTIVITY_CALORIE_MULTIPLIERS[activityLevel];
  tmb = Math.ceil(tmb * GOAL_CALORIE_MULTIPLIERS[weightGoal]);
  return tmb;
};
