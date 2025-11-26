import { useState, useEffect } from "react";
import { Header } from "./components/Header";
import { ServiceCard, Service } from "./components/ServiceCard";
import { AddServiceDialog } from "./components/AddServiceDialog";
import { ServiceAnalytics } from "./components/ServiceAnalytics";

import {
  getAllServices,
  addService,
  deleteService,
} from "./api/serviceApi"; // <-- your API layer

export default function App() {
  const [isDark, setIsDark] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  // Load all services from backend
  async function loadServices() {
    try {
      setLoading(true);
      const data = await getAllServices();
      setServices(data);
    } catch (error) {
      console.error("Failed to load services:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadServices();
  }, []);

  // Dark mode toggle
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDark]);

  // When selecting analytics view
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

        {loading ? (
          <div className="text-muted-foreground text-lg">Loading...</div>
        ) : services.length === 0 ? (
          <div className="text-muted-foreground text-lg">
            No services found. Add one to get started.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <ServiceCard
                key={service.id}
                service={service}
                onClick={() => setSelectedService(service)}
                onDelete={async () => {
                  await deleteService(service.id);
                  loadServices();
                }}
              />
            ))}
          </div>
        )}
      </main>

      <AddServiceDialog
            open={dialogOpen}
            onOpenChange={setDialogOpen}
            onServiceAdded={loadServices}   // <--- refresh list after adding
          />
    </div>
  );
}
