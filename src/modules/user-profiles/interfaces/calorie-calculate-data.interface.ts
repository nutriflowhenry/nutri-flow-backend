import { ActivityLevel } from '../enums/activity-level.enum';
import { Gender } from '../enums/gender.enum';
import { Goal } from '../enums/goal.enum';

export interface CalorieCalculateData {
  age: number;
  gender: Gender;
  weight: number;
  height: number;
  activityLevel: ActivityLevel;
  weightGoal: Goal;
}
