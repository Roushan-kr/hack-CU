import { useRouter } from "next/router";
import { AnimatePresence, motion } from "framer-motion";
import { useTheme } from "@/contexts/ThemeContext";
import { useBusLines } from "@/hooks/useApi";

export default function LinesPage() {
  const router = useRouter();
  const { isDark } = useTheme();
  const {
    data: busLines,
    loading: linesLoading,
    error: linesError,
  } = useBusLines("KENITRA");

  const handleLineSelect = (lineId: string) => {
    const line = busLines.find((l) => l.id === lineId);
    if (line) {
      router.push(`/lines/${line.line}/directions`);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className={`fixed top-0 left-0 right-0 z-50 shadow-lg ${
        isDark ? "bg-gradient-to-r from-purple-900 to-indigo-900"
               : "bg-gradient-to-r from-blue-600 to-purple-700"
      }`}>
        {/* Your header JSX unchanged */}
      </header>

      {/* Content */}
      <div className="pt-24">
        <AnimatePresence mode="wait">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
          >
            <LineSelector
              lines={busLines}
              selectedLineId={null}
              onLineSelect={handleLineSelect}
              loading={linesLoading}
              error={linesError}
            />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
