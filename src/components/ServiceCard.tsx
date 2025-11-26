import React, { useState, useEffect, useCallback, useMemo } from "react";
import { ExternalLink, Activity, Trash2 } from "lucide-react";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { LineChart, Line, ResponsiveContainer, Tooltip } from "recharts";

export interface Service {
  id: string;
  name: string;
  url: string;
  isHealthy: boolean;
  lastChecked: string;
  uptime: number;
  latencyData: Array<{ value: number; timestamp?: number }>;
  tags: string[];
}

interface ServiceCardProps {
  service: Service;
  onClick: (service: Service) => void;
  onDelete?: () => void;
}

// Custom hook for managing latency points
const useLatencyPoints = (initialData: Array<{ value: number; timestamp?: number }>) => {
  const [points, setPoints] = useState<Array<{ 
    value: number; 
    timestamp: number;
    formattedTime: string;
  }>>([]);

  useEffect(() => {
    if (initialData.length === 0) {
      setPoints([]);
      return;
    }

    // Transform data to include formatted time
    const transformedPoints = initialData.map(point => {
      const timestamp = point.timestamp || Date.now();
      return {
        value: point.value,
        timestamp: timestamp,
        formattedTime: new Date(timestamp).toLocaleTimeString([], { 
          hour: '2-digit', 
          minute: '2-digit',
          second: '2-digit'
        })
      };
    });

    setPoints(transformedPoints.slice(-10)); // Keep only last 10 points
  }, [initialData]);

  return points;
};
const SimpleTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-background border border-border rounded-lg shadow-lg p-2">
        <p className="text-xs font-medium">
          {data.formattedTime || new Date(data.timestamp).toLocaleTimeString()}
        </p>
        <p className="text-xs">
          {data.value}ms
        </p>
      </div>
    );
  }
  return null;
};

export const ServiceCard = React.memo(function ServiceCard({ 
  service, 
  onClick, 
  onDelete 
}: ServiceCardProps) {
  const latencyPoints = useLatencyPoints(service.latencyData);

  // Memoized calculated values
  const statusColor = useMemo(() => 
    service.isHealthy ? "bg-green-500" : "bg-red-500", 
    [service.isHealthy]
  );

  const statusText = useMemo(() => 
    service.isHealthy ? "Up" : "Down", 
    [service.isHealthy]
  );

  const lineColor = useMemo(() => 
    service.isHealthy ? "#22c55e" : "#ef4444", 
    [service.isHealthy]
  );

  const formattedLastChecked = useMemo(() => {
    try {
      return new Date(service.lastChecked).toLocaleTimeString();
    } catch {
      return service.lastChecked;
    }
  }, [service.lastChecked]);

  // Memoized event handlers
  const handleClick = useCallback(() => {
    onClick(service);
  }, [onClick, service]);

  const handleDeleteClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete?.();
  }, [onDelete]);

  const handleLinkClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
  }, []);

  // Memoized chart component to prevent unnecessary re-renders
  const LatencyChart = useMemo(() => (
    <div className="mb-4 h-16 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={latencyPoints}>
          <Line
            type="monotone"
            dataKey="value"
            stroke={lineColor}
            strokeWidth={2}
            dot={false}
            isAnimationActive={true}
            animationDuration={300}
            
          />
          <Tooltip 
            content={<SimpleTooltip  />}
            cursor={{ stroke: '#94a3b8', strokeWidth: 1, strokeDasharray: '3 3' }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  ), [latencyPoints, lineColor]);

  return (
    <Card
      className="relative cursor-pointer overflow-hidden border-border bg-card p-0 transition-all hover:shadow-lg"
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleClick();
        }
      }}
      aria-label={`View analytics for ${service.name}`}
    >
      {/* Delete Button */}
      {onDelete && (
        <button
          className="absolute right-2 top-2 z-10 rounded-md p-2 text-muted-foreground hover:bg-destructive hover:text-destructive-foreground transition-colors"
          onClick={handleDeleteClick}
          aria-label={`Delete ${service.name}`}
        >
          <Trash2 className="h-4 w-4" />
        </button>
      )}

      <div className="p-5">
        {/* Header Section */}
        <div className="mb-4 flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <div className="mb-2 flex items-center gap-2">
              <h3 className="text-lg font-medium truncate" title={service.name}>
                {service.name}
              </h3>
              <Badge
                variant="outline"
                className={`${statusColor} border-0 text-white px-2 py-1`}
                aria-label={`Status: ${statusText}`}
              >
                {statusText}
              </Badge>
            </div>

            <a
              href={service.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors truncate"
              onClick={handleLinkClick}
              title={service.url}
            >
              <span className="truncate">{service.url}</span>
              <ExternalLink className="h-3 w-3 flex-shrink-0" />
            </a>
          </div>
        </div>

        {/* Tags */}
        {service.tags.length > 0 && (
          <div className="mb-4 flex flex-wrap gap-2">
            {service.tags.map(tag => (
              <Badge 
                key={tag} 
                variant="secondary" 
                className="text-xs font-normal"
              >
                {tag}
              </Badge>
            ))}
          </div>
        )}

        {/* Latency Chart */}
        {LatencyChart}

        {/* Footer Stats */}
        <div className="flex items-center justify-between text-sm">
          <div 
            className="flex items-center gap-1 text-muted-foreground"
            title={`Last checked: ${service.lastChecked}`}
          >
            <Activity className="h-3 w-3" />
            <span>{formattedLastChecked}</span>
          </div>
          <div 
            className="text-muted-foreground"
            title={`Uptime: ${service.uptime}%`}
          >
            <span className="text-foreground font-medium">{service.uptime}%</span> uptime
          </div>
        </div>
      </div>
    </Card>
  );
});

// Display name for debugging
ServiceCard.displayName = 'ServiceCard';