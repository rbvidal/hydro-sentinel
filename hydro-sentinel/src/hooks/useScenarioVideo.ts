import { useRef, useMemo } from 'react';
import {
  computeScenario,
  getVideoForMast,
  getVariantCount,
  type MastId,
  type Scenario,
} from '../services/videoScenarios';

/**
 * React hook that derives the current scenario from station telemetry and
 * locks in random video variant selections. Variants only re-roll when the
 * scenario *changes*, not on every render.
 */
export function useScenarioVideo(
  stations: { id: string; level: number; status: string }[],
) {
  const scenario = useMemo(() => computeScenario(stations), [stations]);

  // Keep the previous scenario to detect transitions.
  const prevScenarioRef = useRef<Scenario>(scenario);

  // Per-mast variant indices — locked in when a new scenario activates.
  const variantRef = useRef<Record<string, number>>({});

  // When the scenario changes, re-roll variants for every mast that has >1 option.
  if (prevScenarioRef.current !== scenario) {
    prevScenarioRef.current = scenario;
    const ids: MastId[] = ['st-1km', 'st-2km', 'st-3km', 'st-4km', 'st-5km'];
    for (const id of ids) {
      const count = getVariantCount(id, scenario);
      variantRef.current[id] =
        count > 1 ? Math.floor(Math.random() * count) : 0;
    }
  }

  const getVideoUrl = (mastId: string): string => {
    const url = getVideoForMast(
      mastId as MastId,
      scenario,
      variantRef.current[mastId] ?? 0,
    );
    console.log('[useScenarioVideo]', { mastId, scenario, url });
    return url;
  };

  return { scenario, getVideoUrl };
}
