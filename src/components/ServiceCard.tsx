import { ExternalLink, Activity } from "lucide-react";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { LineChart, Line, ResponsiveContainer } from "recharts";

export interface Service {
  id: string;
  name: string;
  url: string;
  status: "up" | "down";
  lastChecked: string;
  uptime: number;
  latencyData: Array<{ value: number }>;
  tags: string[];
}

interface ServiceCardProps {
  service: Service;
  onClick: () => void;
}

export function ServiceCard({ service, onClick }: ServiceCardProps) {
  const statusColor = service.status === "up" ? "bg-green-500" : "bg-red-500";
  const statusText = service.status === "up" ? "Up" : "Down";

  return (
    <Card
      className="cursor-pointer overflow-hidden border-border bg-card p-0 transition-all hover:shadow-lg"
      onClick={onClick}
    >
      <div className="p-5">
        <div className="mb-4 flex items-start justify-between">
          <div className="flex-1">
            <div className="mb-2 flex items-center gap-2">
              <h3 className="text-lg">{service.name}</h3>
              <Badge
                variant="outline"
                className={`${statusColor} border-0 text-white`}
              >
                {statusText}
              </Badge>
            </div>
            <a
              href={service.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
              onClick={(e) => e.stopPropagation()}
            >
              <span className="truncate">{service.url}</span>
              <ExternalLink className="h-3 w-3 flex-shrink-0" />
            </a>
          </div>
        </div>

        <div className="mb-4 flex flex-wrap gap-2">
          {service.tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>

        <div className="mb-4 h-16 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={service.latencyData}>
              <Line
                type="monotone"
                dataKey="value"
                stroke={service.status === "up" ? "#22c55e" : "#ef4444"}
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-1 text-muted-foreground">
            <Activity className="h-3 w-3" />
            <span>Last checked: {service.lastChecked}</span>
          </div>
          <div className="text-muted-foreground">
            <span className="text-foreground">{service.uptime}%</span> uptime
          </div>
        </div>
      </div>
    </Card>
  );
}
