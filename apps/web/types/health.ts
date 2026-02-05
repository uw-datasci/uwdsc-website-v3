/* eslint-disable @typescript-eslint/no-explicit-any */
export interface HealthCheck {
  id: string;
  service: string;
  status: "healthy" | "degraded" | "unhealthy";
  timestamp: string;
  version: string;
  uptime: number;
  environment: string;
  services: {
    supabase: {
      status: "connected" | "disconnected";
      error?: string | null;
    };
  };
  [key: string]: any;
}
