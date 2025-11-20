import BusTrackingView from "@/components/BusTrackingView";
import { useBusLines, useBusPositions, useBusStops } from "@/hooks/useApi";
import { useUserLocation } from "@/hooks/useLocation";
import { useRouter } from "next/router";
import { useMemo } from "react";

export default function TrackingPage() {
  const router = useRouter();
  const { lineNumber, direction } = router.query;

  const {
    location: userLocation,
    loading: locationLoading,
    accuracy,
    refreshLocation,
    setUserLocation,
    canSetManualLocation,
  } = useUserLocation();

  const { data: busLines, loading: busLinesLoading } = useBusLines("KENITRA");

  const selectedLine = useMemo(() => {
    return busLines.find(
      (line) =>
        line.line === lineNumber &&
        line.direction === direction?.toUpperCase()
    ) || null;
  }, [busLines, lineNumber, direction]);

  const { data: stopsData } = useBusStops(selectedLine?.id || null);
  const { data: positionsData } = useBusPositions(
    selectedLine?.company,
    selectedLine?.line,
    selectedLine?.direction
  );

  const busStops = stopsData?.stops || [];

  if (!busLinesLoading && !selectedLine) {
    router.replace("/lines");
    return null;
  }

  return (
    <BusTrackingView
      selectedLine={selectedLine!}
      busStops={busStops}
      busPositions={positionsData?.positions || []}
      routePath={stopsData?.path || []}
      userLocation={userLocation}
      locationAccuracy={accuracy}
      canSelectManually={canSetManualLocation}
      onLocateClick={refreshLocation}
      onManualLocationSelect={(lat, lng) =>
        setUserLocation({ lat, lng })
      }
    />
  );
}
