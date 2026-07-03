/**
 * Centralized video scenario configuration.
 *
 * Mast cards never hardcode video filenames. Instead they request the current
 * video from this service based on mast ID + scenario state. Adding a new
 * scenario (intrusion, fire, equipment-failure, ai-anomaly, etc.) only requires
 * adding a new entry to the SCENARIO_VIDEOS map below.
 */

export type Scenario = 'NORMAL' | 'ALARM';

/** All recognized mast IDs. */
export type MastId = 'st-1km' | 'st-2km' | 'st-3km' | 'st-4km' | 'st-5km';

const VIDEO_BASE = '/videos';

/** Video file mapping: SCENARIO_VIDEOS[scenario][mastId] */
const SCENARIO_VIDEOS: Record<Scenario, Record<MastId, string | string[]>> = {
  NORMAL: {
    'st-1km': `${VIDEO_BASE}/MAST-01.mp4`,
    'st-2km': `${VIDEO_BASE}/MAST-02.mp4`,
    'st-3km': `${VIDEO_BASE}/MAST-03.mp4`,
    'st-4km': `${VIDEO_BASE}/MAST-04.mp4`,
    'st-5km': `${VIDEO_BASE}/POND_NORMAL.mp4`,
  },
  ALARM: {
    'st-1km': `${VIDEO_BASE}/MAST-01.mp4`,
    'st-2km': `${VIDEO_BASE}/MAST-02.mp4`,
    'st-3km': `${VIDEO_BASE}/MAST-03.mp4`,
    'st-4km': `${VIDEO_BASE}/MAST-04-FLOOD.mp4`,
    'st-5km': [
      `${VIDEO_BASE}/FLOOD-01.mp4`,
      `${VIDEO_BASE}/FLOOD-02.mp4`,
    ],
  },
};

/**
 * Resolve the video URL for a given mast and scenario.
 *
 * For multi-video entries (arrays), `variantIndex` selects which variant to use.
 * Callers should lock in the index when entering a new scenario episode so the
 * video doesn't swap mid-scenario.
 */
export function getVideoForMast(
  mastId: MastId,
  scenario: Scenario,
  variantIndex = 0,
): string {
  const entry = SCENARIO_VIDEOS[scenario][mastId];
  if (Array.isArray(entry)) {
    return entry[variantIndex % entry.length];
  }
  return entry;
}

/** Return the number of video variants for a mast in a given scenario. */
export function getVariantCount(mastId: MastId, scenario: Scenario): number {
  const entry = SCENARIO_VIDEOS[scenario][mastId];
  return Array.isArray(entry) ? entry.length : 1;
}

/**
 * Compute the overall basin scenario from the station list.
 * ALARM if any station has level >= 5.0 or status === 'alert', else NORMAL.
 */
export function computeScenario(
  stations: { id: string; level: number; status: string }[],
): Scenario {
  return stations.some((s) => s.level >= 5.0 || s.status === 'alert')
    ? 'ALARM'
    : 'NORMAL';
}
