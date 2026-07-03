/**
 * Camera feed configuration.
 *
 * Flip USE_LIVE_FEEDS to true when real IP cameras are deployed on-site.
 * Each station has local mock video paths (normal + alarm variants) and
 * live RTSP/HTTP stream URLs.
 */

export const USE_LIVE_FEEDS = false;

export interface CameraEntry {
  local: string;
  /** Optional flood/alarm variant — used when the station is in alert state. */
  alert?: string | string[];
  live: string;
}

export const CAMERA_CONFIG: Record<string, CameraEntry> = {
  'st-1km': {
    local: '/videos/MAST-01.mp4',
    live: 'http://192.168.1.101/stream',
  },
  'st-2km': {
    local: '/videos/MAST-02.mp4',
    live: 'http://192.168.1.102/stream',
  },
  'st-3km': {
    local: '/videos/MAST-03.mp4',
    live: 'http://192.168.1.103/stream',
  },
  'st-4km': {
    local: '/videos/MAST-04.mp4',
    alert: '/videos/MAST-04-FLOOD.mp4',
    live: 'http://192.168.1.104/stream',
  },
  'st-5km': {
    local: '/videos/POND_NORMAL.mp4',
    alert: ['/videos/FLOOD-01.mp4', '/videos/FLOOD-02.mp4'],
    live: 'http://192.168.1.105/stream',
  },
};

/** Resolve the video URL for a mast. Uses the alert variant when isAlert is true. */
export function resolveCameraUrl(
  stationId: string,
  isAlert = false,
  alertIndex = 0,
): string {
  const entry = CAMERA_CONFIG[stationId];
  if (!entry) return '';

  const base = isAlert && entry.alert ? entry.alert : entry.local;

  // If alert is an array, pick the variant at alertIndex.
  if (Array.isArray(base)) {
    return base[alertIndex % base.length];
  }

  // If USE_LIVE_FEEDS, always use the live stream regardless of alert state.
  if (USE_LIVE_FEEDS) {
    return entry.live;
  }

  return base;
}
