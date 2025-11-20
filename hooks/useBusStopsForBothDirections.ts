import { BusStopResponse } from "@/types";
import { useState, useEffect } from "react";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL!;

export function useBusStopsForBothDirections(
  forwardLineId?: string | null,
  backwardLineId?: string | null
) {
  const [forwardStops, setForwardStops] = useState<BusStopResponse | null>(null);
  const [backwardStops, setBackwardStops] = useState<BusStopResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // ✅ Prevent fetching during initial undefined state
    if (!forwardLineId && !backwardLineId) {
      setForwardStops(null);
      setBackwardStops(null);
      return;
    }

    const controller = new AbortController();

    const fetchStops = async () => {
      setLoading(true);
      setError(null);

      try {
        const forwardPromise = forwardLineId
          ? fetch(`${API_BASE_URL}/routes/paths/${forwardLineId}`, {
              signal: controller.signal,
            }).then((res) => res.json())
          : Promise.resolve(null);

        const backwardPromise = backwardLineId
          ? fetch(`${API_BASE_URL}/routes/paths/${backwardLineId}`, {
              signal: controller.signal,
            }).then((res) => res.json())
          : Promise.resolve(null);

        const [forwardData, backwardData] = await Promise.all([
          forwardPromise,
          backwardPromise,
        ]);

        setForwardStops(forwardData);
        setBackwardStops(backwardData);
      } catch (err: any) {
        if (err.name !== "AbortError") {
          setError(err.message || "Failed to fetch bus stops");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchStops();

    // ✅ Cleanup on change/unmount to avoid memory leaks
    return () => {
      controller.abort();
    };
  }, [forwardLineId, backwardLineId]);

  return { forwardStops, backwardStops, loading, error };
}
