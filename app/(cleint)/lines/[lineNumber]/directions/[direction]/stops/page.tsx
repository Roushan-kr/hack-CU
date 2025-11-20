import DirectionSelector from "@/components/DirectionSelector";
import { useTheme } from "@/contexts/ThemeContext";
import { useBusLines } from "@/hooks/useApi";
import { useBusStopsForBothDirections } from "@/hooks/useBusStopsForBothDirections";
import { useUserLocation } from "@/hooks/useLocation";
import { useRouter } from "next/router";
import { useMemo } from "react";

export default function DirectionStopsPage() {
  const router = useRouter();
  const { lineNumber, direction } = router.query;

  const { isDark } = useTheme();
  const { location: userLocation } = useUserLocation();
  const { data: busLines, loading: busLinesLoading } = useBusLines("KENITRA");

  const selectedLine = useMemo(() => {
    if (!lineNumber || !direction) return null;

    return busLines.find(
      (line) =>
        line.line === lineNumber &&
        line.direction === direction.toUpperCase()
    ) || null;
  }, [busLines, lineNumber, direction]);

  const { forwardStops, backwardStops } =
    useBusStopsForBothDirections(
      direction?.toUpperCase() === "FORWARD" ? selectedLine?.id || null : null,
      direction?.toUpperCase() === "BACKWARD" ? selectedLine?.id || null : null
    );

  const stops =
    direction?.toUpperCase() === "FORWARD"
      ? forwardStops?.stops || []
      : backwardStops?.stops || [];

  if (!busLinesLoading && !selectedLine) {
    router.replace("/lines");
    return null;
  }

  const handleStopSelect = () => {
    router.push(`/lines/${lineNumber}/directions/${direction}/tracking`);
  };

  return (
    <DirectionSelector
      forwardLine={direction === "forward" ? selectedLine : null}
      backwardLine={direction === "backward" ? selectedLine : null}
      selectedDirection={direction?.toUpperCase()}
      onDirectionSelect={handleStopSelect}
      forwardStops={direction === "forward" ? stops : []}
      backwardStops={direction === "backward" ? stops : []}
      userLocation={userLocation}
      showStopsView
    />
  );
}
