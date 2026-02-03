export interface NotificationPreferences {
  email: boolean;
  push: boolean;
  frequency: 'daily' | 'weekly' | 'instant';
}
