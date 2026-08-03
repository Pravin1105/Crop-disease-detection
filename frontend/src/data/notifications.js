export const notifications = [
  {
    id: 1,
    titleKey: "notifications.sample.predictionCompleted.title",
    messageKey: "notifications.sample.predictionCompleted.message",
    date: "2026-08-02 18:44",
    unread: true
  },
  {
    id: 2,
    titleKey: "notifications.sample.modelUpdate.title",
    messageKey: "notifications.sample.modelUpdate.message",
    date: "2026-08-01 14:20",
    unread: true
  },
  {
    id: 3,
    titleKey: "notifications.sample.preferences.title",
    messageKey: "notifications.sample.preferences.message",
    date: "2026-07-31 08:55",
    unread: false
  }
];

export function unreadCount() {
  return notifications.filter((notification) => notification.unread).length;
}
