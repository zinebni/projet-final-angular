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

export interface QueueStatus {
  nowServing: any[];
  nextInQueue: any[];
}

