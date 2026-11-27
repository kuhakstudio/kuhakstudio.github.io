/** KUHAK Studio on YouTube. */
export const YOUTUBE_CHANNEL = 'https://www.youtube.com/@KuhakStudio';

/** Shakchunnir Badhon's videos (YouTube Shorts, 9:16): the game page's "Watch" section and its VideoObject data.
 *  uploadDate is YouTube's own (read from the watch page), not a guess. */
export const VIDEOS = [
  {
    id: 'fJwUhIxOnGY', key: 'trailer', label: 'Trailer', play: 'Play the trailer',
    name: 'Shakchunnir Badhon – Official Trailer',
    description: 'Shakchunni has found her groom. He has other plans. The trailer for Shakchunnir Badhon, a Bengali folk-horror endless runner.',
    poster: '/img/video-trailer.jpg', time: '0:31', duration: 'PT31S', uploadDate: '2026-11-26T20:36:06-08:00',
  },
  {
    id: '853q50sW3Jw', key: 'gameplay', label: 'Gameplay', play: 'Play the gameplay video',
    name: 'Shakchunnir Badhon – Gameplay',
    description: 'A minute of Shakchunnir Badhon gameplay, recorded straight from the game: the chase, the ghosts, the khal, storms and the blood moon.',
    poster: '/img/video-gameplay.jpg', time: '0:59', duration: 'PT59S', uploadDate: '2026-11-26T20:17:06-08:00',
  },
] as const;
