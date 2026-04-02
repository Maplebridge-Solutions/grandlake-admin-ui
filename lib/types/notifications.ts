export interface Notification {
  id: string;
  type: string;
  description: string;
  time: string;
  icon: React.ElementType;
  iconBg: string;
}

export interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
}
