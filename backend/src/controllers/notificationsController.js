import { notifications } from "../data/store.js";

export const getNotifications = async (req, res) => {
  const unreadCount = notifications.filter((n) => !n.read).length;
  res.json({ success: true, count: notifications.length, unreadCount, notifications });
};

export const markAsRead = async (req, res) => {
  const { id } = req.params;
  if (id === "all") {
    notifications.forEach((n) => (n.read = true));
  } else {
    const item = notifications.find((n) => n._id === id);
    if (item) item.read = true;
  }
  const unreadCount = notifications.filter((n) => !n.read).length;
  res.json({ success: true, unreadCount, notifications });
};
