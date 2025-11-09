import { useState, useEffect } from "react";
import { Header } from "./components/Header";
import { ServiceCard, Service } from "./components/ServiceCard";
import { AddServiceDialog } from "./components/AddServiceDialog";
import { ServiceAnalytics } from "./components/ServiceAnalytics";

// Mock data  
const mockServices: Service[] = [
  {
    id: "1",
    name: "Main API",
    url: "https://api.example.com",
    status: "up",
    lastChecked: "2 min ago",
    uptime: 99.98,
    latencyData: [
      { value: 120 },
      { value: 145 },
      { value: 130 },
      { value: 125 },
      { value: 140 },
      { value: 135 },
      { value: 128 },
      { value: 142 },
      { value: 138 },
      { value: 132 },
    ],
    tags: ["Production", "Critical"],
  },
  {
    id: "2",
    name: "Payment Gateway",
    url: "https://payments.stripe.com/health",
    status: "up",
    lastChecked: "1 min ago",
    uptime: 100,
    latencyData: [
      { value: 80 },
      { value: 75 },
      { value: 82 },
      { value: 78 },
      { value: 85 },
      { value: 79 },
      { value: 81 },
      { value: 76 },
      { value: 83 },
      { value: 80 },
    ],
    tags: ["Payments", "Third-party"],
  },
  {
    id: "3",
    name: "Database Primary",
    url: "https://db-primary.internal",
    status: "up",
    lastChecked: "30 sec ago",
    uptime: 99.95,
    latencyData: [
      { value: 15 },
      { value: 18 },
      { value: 16 },
      { value: 14 },
      { value: 17 },
      { value: 15 },
      { value: 16 },
      { value: 19 },
      { value: 15 },
      { value: 14 },
    ],
    tags: ["Internal", "Database"],
  },
  {
    id: "4",
    name: "CDN Service",
    url: "https://cdn.cloudflare.com/status",
    status: "down",
    lastChecked: "5 min ago",
    uptime: 98.2,
    latencyData: [
      { value: 200 },
      { value: 220 },
      { value: 250 },
      { value: 280 },
      { value: 310 },
      { value: 290 },
      { value: 320 },
      { value: 350 },
      { value: 340 },
      { value: 360 },
    ],
    tags: ["Third-party", "CDN"],
  },
  {
    id: "5",
    name: "Auth Service",
    url: "https://auth.example.com/health",
    status: "up",
    lastChecked: "3 min ago",
    uptime: 99.99,
    latencyData: [
      { value: 45 },
      { value: 48 },
      { value: 42 },
      { value: 46 },
      { value: 50 },
      { value: 47 },
      { value: 44 },
      { value: 49 },
      { value: 46 },
      { value: 45 },
    ],
    tags: ["Production", "Auth"],
  },
  {
    id: "6",
    name: "Analytics API",
    url: "https://analytics.example.com",
    status: "up",
    lastChecked: "1 min ago",
    uptime: 99.5,
    latencyData: [
      { value: 180 },
      { value: 175 },
      { value: 190 },
      { value: 185 },
      { value: 195 },
      { value: 188 },
      { value: 182 },
      { value: 192 },
      { value: 187 },
      { value: 183 },
    ],
    tags: ["Internal", "Analytics"],
  },
];

export default function App() {
  const [isDark, setIsDark] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDark]);

  if (selectedService) {
    return (
      <ServiceAnalytics
        service={selectedService}
        onBack={() => setSelectedService(null)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header
        isDark={isDark}
        onToggleTheme={() => setIsDark(!isDark)}
        onAddService={() => setDialogOpen(true)}
      />

      <main className="container mx-auto p-6">
        <div className="mb-6">
          <h2 className="text-2xl mb-1">Service Overview</h2>
          <p className="text-muted-foreground">
            Monitor your critical services and infrastructure
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {mockServices.map((service) => (
            <ServiceCard
              key={service.id}
              service={service}
              onClick={() => setSelectedService(service)}
            />
          ))}
        </div>
      </main>

      <AddServiceDialog open={dialogOpen} onOpenChange={setDialogOpen} />
    </div>
  );
}
