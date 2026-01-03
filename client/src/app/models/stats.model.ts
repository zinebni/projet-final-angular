// Represents statistical data related to the queue system for admin dashboard
export interface QueueStats {
  overview: {
    totalToday: number;
    waiting: number;
    serving: number;
    completed: number;
    cancelled: number;
    noShow: number;
  };
  performance: {
    avgWaitTime: number;
    avgServiceTime: number;
    throughputRate: number;
  };
  agents: {
    online: number;
    total: number;
  };
  byService: Record<string, number>;
  hourlyDistribution: { hour: number; count: number }[];
}

// Represents the current status of the queue including now serving and next in queue showing in real-time displays
export interface QueueStatus {
  nowServing: any[];
  nextInQueue: any[];
}

