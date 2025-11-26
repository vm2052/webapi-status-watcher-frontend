import { useState, useEffect, useCallback, useRef } from "react";
import { Header } from "./components/Header";
import { ServiceCard, Service } from "./components/ServiceCard";
import { AddServiceDialog } from "./components/AddServiceDialog";
import { ServiceAnalytics } from "./components/ServiceAnalytics";
import {
  getAllServices,
  addService,
  deleteService,
} from "./api/serviceApi";

const MAX_LATENCY_POINTS = 10;
const POLLING_INTERVAL = 10000;

// Memoize service transformation to prevent recalculation on every render
const transformServiceData = (service: any): Service => ({
  id: service.id,
  name: service.name,
  url: service.url,
  isHealthy: service.isHealthy,
  lastChecked: service.lastChecked,
  uptime: service.uptime,
  tags: service.tags || [],
  latencyData: (service.latencyData || []).map((point: any) => ({
    value: point.value, // Now it's point.value instead of just the number
    timestamp: new Date(point.timestamp).getTime() // Convert to timestamp if needed
  }))
});

export default function App() {
  const [isDark, setIsDark] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Refs to track previous values without causing re-renders
  const servicesRef = useRef<Service[]>([]);
  const isMountedRef = useRef(true);

  // Memoized service loading with intelligent updates
  const loadServices = useCallback(async () => {
    if (!isMountedRef.current) return;

    try {
      setError(null);
      const data = await getAllServices();

      setServices(prevServices => {
        const prevServicesMap = new Map(prevServices.map(s => [s.id, s]));
        const updatedServices = data.map(newServiceData => {
          const existingService = prevServicesMap.get(newServiceData.id);
          const transformedService = transformServiceData(newServiceData);

          // If service exists, merge latency data intelligently
          if (existingService) {
            const existingLatency = existingService.latencyData;
            const newLatency = transformedService.latencyData;
            
            // Only update if there are new latency points
            if (newLatency.length > 0 && existingLatency.length > 0) {
              const lastExisting = existingLatency[existingLatency.length - 1];
              const firstNew = newLatency[0];
              
              // Check if we actually have new data
              if (lastExisting.value !== firstNew.value) {
                return {
                  ...transformedService,
                  latencyData: [
                    ...existingLatency.slice(-MAX_LATENCY_POINTS + 1),
                    ...newLatency
                  ].slice(-MAX_LATENCY_POINTS)
                };
              }
            }
            
            // Return existing service if no meaningful changes
            return existingService;
          }
          
          // New service
          return transformedService;
        });

        servicesRef.current = updatedServices;
        return updatedServices;
      });
    } catch (err) {
      console.error("Failed to load services:", err);
      setError("Failed to load services. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial load and polling setup
  useEffect(() => {
    isMountedRef.current = true;
    
    const initializeServices = async () => {
      await loadServices();
    };

    initializeServices();

    const interval = setInterval(loadServices, POLLING_INTERVAL);
    return () => {
      isMountedRef.current = false;
      clearInterval(interval);
    };
  }, [loadServices]);

  // Dark mode effect
  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
  }, [isDark]);

  // Memoized event handlers
  const handleToggleTheme = useCallback(() => {
    setIsDark(prev => !prev);
  }, []);

  const handleAddService = useCallback(() => {
    setDialogOpen(true);
  }, []);

  const handleServiceAdded = useCallback(() => {
    setDialogOpen(false);
    loadServices();
  }, [loadServices]);

  const handleDeleteService = useCallback(async (serviceId: string) => {
    try {
      await deleteService(serviceId);
      await loadServices();
    } catch (err) {
      console.error("Failed to delete service:", err);
      setError("Failed to delete service. Please try again.");
    }
  }, [loadServices]);

  const handleSelectService = useCallback((service: Service) => {
    setSelectedService(service);
  }, []);

  const handleBackFromAnalytics = useCallback(() => {
    setSelectedService(null);
  }, []);

  // Analytics view
  if (selectedService) {
    return (
      <ServiceAnalytics
        service={selectedService}
        onBack={handleBackFromAnalytics}
      />
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header
        isDark={isDark}
        onToggleTheme={handleToggleTheme}
        onAddService={handleAddService}
      />

      <main className="container mx-auto p-6">
        <div className="mb-6">
          <h2 className="text-2xl mb-1 font-semibold">Service Overview</h2>
          <p className="text-muted-foreground">
            Monitor your critical services and infrastructure
          </p>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="text-muted-foreground text-lg">Loading services...</div>
          </div>
        ) : services.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-muted-foreground text-lg mb-4">
              No services found. Add one to get started.
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <ServiceCard
                key={service.id}
                service={service}
                onClick={handleSelectService}
                onDelete={() => handleDeleteService(service.id)}
              />
            ))}
          </div>
        )}
      </main>

      <AddServiceDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onServiceAdded={handleServiceAdded}
      />
    </div>
  );
}