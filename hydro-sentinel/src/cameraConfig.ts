export const cameraConfig = {
    // Turn this to true when you want to switch to your real production IP cameras
    USE_LIVE_FEEDS: false,

    feeds: {
        'st-1km': {
            mock: '/videos/MAST-01.mp4',
            live: 'http://192.168.1.101/stream/live'
        },
        'st-2km': {
            mock: '/videos/MAST-02.mp4',
            live: 'http://192.168.1.102/stream/live'
        },
        'st-3km': {
            mock: '/videos/MAST-03.mp4',
            live: 'http://192.168.1.103/stream/live'
        },
        'st-4km': {
            mock: '/videos/MAST-04.mp4',
            live: 'http://192.168.1.104/stream/live',
            floodMock: '/videos/MAST-04-FLOOD.mp4' // Your specific flood clip
        },
        'st-5km': {
            // Your two pool flood clips for the waterfall station
            mockPool: [
                '/videos/FLOOD-01.mp4',
                '/videos/FLOOD-02.mp4'
            ],
            live: 'http://192.168.1.105/stream/live'
        }
    }
};