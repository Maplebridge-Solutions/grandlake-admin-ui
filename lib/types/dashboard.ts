export interface BusOperation {
  fleet: string;
  route: string;
  gps: string;
  delay: string;
  status: string;
}

export interface DashboardBusOperation {
  fleetNumber: number;
  routeLongName: string;
  gpsStatus: string;
  delay: string;
  status: string;
}

export interface DashboardOverviewData {
  period: {
    start: string;
    end: string;
  };
  ridershipSummary: {
    totalRiders: number;
  };
  ticketSales: {
    totalSales: number;
  };
  ticketRevenue: {
    totalAmount: number;
    currency: string;
  };
  ticketValidations: {
    totalValidations: number;
  };
  latestBusOperations: DashboardBusOperation[];
}

export interface DashboardOverviewResponse {
  success: boolean;
  message: string;
  data: DashboardOverviewData;
}
