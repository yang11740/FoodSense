export type ReminderSettingKey = 'medication' | 'diet' | 'review';

export interface ReminderSettings {
  medication: boolean;
  diet: boolean;
  review: boolean;
}

export const defaultReminderSettings: ReminderSettings = {
  medication: true,
  diet: true,
  review: true
};
