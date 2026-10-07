import api from "../api";
import { USE_MOCK } from "./config";
import { notificationsList, reply } from "./mockStore";

export const notificationsApi = {
  list: () => {
    if (!USE_MOCK) return api.get("/notifications");
    const unreadCount = notificationsList.filter((n) => !n.read).length;
    return reply({
      success: true,
      count: notificationsList.length,
      unreadCount,
      notifications: notificationsList,
    });
  },

  markAsRead: (id) => {
    if (!USE_MOCK) return api.patch(`/notifications/${id}/read`);
    if (id === "all") {
      notificationsList.forEach((n) => (n.read = true));
    } else {
      const item = notificationsList.find((n) => n._id === id);
      if (item) item.read = true;
    }
    const unreadCount = notificationsList.filter((n) => !n.read).length;
    return reply({
      success: true,
      unreadCount,
      notifications: notificationsList,
    });
  },
};
