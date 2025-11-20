import { useRouter } from "next/router";
import { useMemo, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useTheme } from "@/contexts/ThemeContext";
import { useUserLocation } from "@/hooks/useLocation";
import { useBusLines } from "@/hooks/useApi";
import { useBusStopsForBothDirections } from "@/hooks/useBusStopsForBothDirections";

export default function DirectionsPage() {
  const router = useRouter();
  const { lineNumber } = router.query;
  const { isDark } = useTheme();
  const { location: userLocation } = useUserLocation();
  const { data: busLines, loading: busLinesLoading } = useBusLines("KENITRA");

  const linesByNumber = useMemo(() => {
    return busLines.reduce((acc, line) => {
      const key = line.line;
      if (!acc[key]) acc[key] = { forward: null, backward: null };
      if (line.direction === "FORWARD") acc[key].forward = line;
      if (line.direction === "BACKWARD") acc[key].backward = line;
      return acc;
    }, {} as Record<string, any>);
  }, [busLines]);

  const availableDirections =
    typeof lineNumber === "string" ? linesByNumber[lineNumber] : null;

  const { forwardStops, backwardStops } =
    useBusStopsForBothDirections(
      availableDirections?.forward?.id || null,
      availableDirections?.backward?.id || null
    );

  useEffect(() => {
    if (!busLinesLoading && busLines.length > 0 && !availableDirections) {
      router.replace("/lines");
    }
  }, [busLinesLoading, availableDirections]);

  if (busLinesLoading || !availableDirections) return null;

  const handleDirectionSelect = (
    direction: "FORWARD" | "BACKWARD",
    _line: BusLine
  ) => {
    router.push(`/lines/${lineNumber}/directions/${direction.toLowerCase()}/stops`);
  };

  return (
    <div className="min-h-screen">
      {/* Header UI unchanged */}

      <div className="pt-24">
        <AnimatePresence mode="wait">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <DirectionSelector
              forwardLine={availableDirections.forward}
              backwardLine={availableDirections.backward}
              selectedDirection={null}
              onDirectionSelect={handleDirectionSelect}
              forwardStops={forwardStops?.stops || []}
              backwardStops={backwardStops?.stops || []}
              userLocation={userLocation}
            />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
