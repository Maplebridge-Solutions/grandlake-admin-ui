export type RouteViewState = "list" | "add" | "edit";

export interface Route {
  id: string;
  name: string;
  origin: string;
  destination: string;
  buses: number;
}

export interface RouteListProps {
  onAddRoute: () => void;
  onEditRoute: (route: Route) => void;
}

export interface RouteFormProps {
  onBack: () => void;
  route?: Route;
  onViewSchedule: () => void;
}

export interface ScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
}
