import { ArrowLeft, ExternalLink, Activity, TrendingUp, Clock } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Service } from "./ServiceCard";

interface ServiceAnalyticsProps {
  service: Service;
  onBack: () => void;
}

// Mock data for detailed analytics
const generateLatencyData = () => {
  const data = [];
  const now = Date.now();
  for (let i = 24; i >= 0; i--) {
    data.push({
      time: new Date(now - i * 60 * 60 * 1000).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      latency: Math.floor(Math.random() * 100) + 80,
    });
  }
  return data;
};

const generateDowntimeData = () => {
  return [
    { day: "Mon", incidents: 0 },
    { day: "Tue", incidents: 1 },
    { day: "Wed", incidents: 0 },
    { day: "Thu", incidents: 2 },
    { day: "Fri", incidents: 0 },
    { day: "Sat", incidents: 1 },
    { day: "Sun", incidents: 0 },
  ];
};

const generateResponseCodeData = () => {
  return [
    { name: "200 OK", value: 9847, color: "#22c55e" },
    { name: "201 Created", value: 234, color: "#3b82f6" },
    { name: "304 Not Modified", value: 456, color: "#8b5cf6" },
    { name: "404 Not Found", value: 12, color: "#f59e0b" },
    { name: "500 Error", value: 3, color: "#ef4444" },
  ];
};

export function ServiceAnalytics({ service, onBack }: ServiceAnalyticsProps) {
  const latencyData = generateLatencyData();
  const downtimeData = generateDowntimeData();
  const responseCodeData = generateResponseCodeData();

  const avgLatency = Math.floor(
    latencyData.reduce((acc, curr) => acc + curr.latency, 0) / latencyData.length
  );

  const totalChecks = 100;
  const successfulChecks = Math.floor((service.uptime / 100) * totalChecks);

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border bg-card px-6 py-4">
        <Button variant="ghost" onClick={onBack} className="mb-4 gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Button>

        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="mb-2 flex items-center gap-3">
              <h1 className="text-3xl">{service.name}</h1>
              <Badge
                variant="outline"
                className={`${
                  service.status === "up" ? "bg-green-500" : "bg-red-500"
                } border-0 text-white`}
              >
                {service.status === "up" ? "Up" : "Down"}
              </Badge>
            </div>
            <a
              href={service.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
            >
              <span>{service.url}</span>
              <ExternalLink className="h-4 w-4" />
            </a>
            <p className="mt-3 text-muted-foreground">
              Mission-critical service monitoring endpoint with real-time health
              checks and automated alerting.
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto p-6">
        {/* Stats Grid */}
        <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-4">
          <Card className="border-border bg-card p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10">
                <Activity className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Avg Latency</p>
                <p className="text-2xl">{avgLatency}ms</p>
              </div>
            </div>
          </Card>

          <Card className="border-border bg-card p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-500/10">
                <TrendingUp className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Uptime</p>
                <p className="text-2xl">{service.uptime}%</p>
              </div>
            </div>
          </Card>

          <Card className="border-border bg-card p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-500/10">
                <Clock className="h-5 w-5 text-purple-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Last Checked</p>
                <p className="text-2xl">{service.lastChecked}</p>
              </div>
            </div>
          </Card>

          <Card className="border-border bg-card p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-500/10">
                <Activity className="h-5 w-5 text-orange-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Last 100 Checks</p>
                <p className="text-2xl">
                  {successfulChecks}/{totalChecks}
                </p>
              </div>
            </div>
          </Card>
        </div>

        <Separator className="my-6" />

        {/* Charts Section */}
        <div className="space-y-6">
          {/* Latency Over Time */}
          <Card className="border-border bg-card p-6">
            <h3 className="mb-1 text-xl">Latency Over Time</h3>
            <p className="mb-6 text-sm text-muted-foreground">
              Response time over the last 24 hours
            </p>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={latencyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis dataKey="time" stroke="#888" />
                <YAxis stroke="#888" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1f1f1f",
                    border: "1px solid #333",
                    borderRadius: "8px",
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="latency"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  name="Latency (ms)"
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Downtime Incidents */}
            <Card className="border-border bg-card p-6">
              <h3 className="mb-1 text-xl">Downtime Incidents</h3>
              <p className="mb-6 text-sm text-muted-foreground">
                Number of incidents per day this week
              </p>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={downtimeData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                  <XAxis dataKey="day" stroke="#888" />
                  <YAxis stroke="#888" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1f1f1f",
                      border: "1px solid #333",
                      borderRadius: "8px",
                    }}
                  />
                  <Bar dataKey="incidents" fill="#ef4444" name="Incidents" />
                </BarChart>
              </ResponsiveContainer>
            </Card>

            {/* Response Code Distribution */}
            <Card className="border-border bg-card p-6">
              <h3 className="mb-1 text-xl">Response Code Distribution</h3>
              <p className="mb-6 text-sm text-muted-foreground">
                HTTP status codes from last 10,000 requests
              </p>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={responseCodeData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }: any) =>
                     `${name} ${(percent * 100).toFixed(0)}%`
                    }
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {responseCodeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1f1f1f",
                      border: "1px solid #333",
                      borderRadius: "8px",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
