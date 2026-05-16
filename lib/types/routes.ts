export type RouteViewState = "list" | "add" | "edit" | "view";

// ─── Component Props (UI) ─────────────────────────────────────────────────────

export interface RouteListProps {
  onAddRoute: () => void;
  onViewRoute: (route: RouteData) => void;
  onEditRoute: (route: RouteData) => void;
}

export interface RouteFormProps {
  onBack: () => void;
  route?: RouteData;
  readOnly?: boolean;
  onViewSchedule: (schedules: ScheduleEntry[], routeName: string) => void;
}

export interface ScheduleEntry {
  day: string;
  startTime: string;
  endTime: string;
  is24hoursService: boolean;
}

export interface ScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  schedules: ScheduleEntry[];
  routeName?: string;
}

// ─── API Types ────────────────────────────────────────────────────────────────

export interface RouteStop {
  _id?: string;
  name: string;
}

export interface RouteSchedule {
  _id?: string;
  date: string;
  startTime: string;
  endTime: string;
  is24hoursService: boolean;
}

export interface RouteData {
  _id: string;
  name: string;
  routeNumber?: number;
  origin?: RouteStop;
  destination?: RouteStop;
  stops: RouteStop[];
  frequency?: number;
  schedules: RouteSchedule[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface CreateRouteBody {
  name: string;
  routeNumber?: number;
  origin?: { name: string };
  destination?: { name: string };
  stops?: { name: string }[];
  frequency?: number;
  schedules?: {
    date: string;
    startTime: string;
    endTime: string;
    is24hoursService: boolean;
  }[];
}

export type UpdateRouteBody = Partial<CreateRouteBody>;
