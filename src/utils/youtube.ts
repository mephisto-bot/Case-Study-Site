/**
 * Utility functions for YouTube URL parsing and embed URL generation
 */

/**
 * Extracts an 11-character YouTube video ID from various YouTube URL formats or a raw ID.
 * Supports:
 * - https://www.youtube.com/watch?v=VIDEO_ID
 * - https://youtu.be/VIDEO_ID
 * - https://www.youtube.com/embed/VIDEO_ID
 * - https://www.youtube.com/v/VIDEO_ID
 * - https://www.youtube.com/shorts/VIDEO_ID
 * - Raw 11-character video ID
 */
export const extractYouTubeVideoId = (input?: string | null): string | null => {
  if (!input) return null;
  const trimmed = input.trim();
  if (!trimmed) return null;

  // If already an 11-character alphanumeric/dash/underscore string
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
    return trimmed;
  }

  // Handle standard URLs
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=|shorts\/)([^#&?]*).*/;
  const match = trimmed.match(regExp);

  if (match && match[2].length === 11) {
    return match[2];
  }

  return null;
};

/**
 * Generates an embedded YouTube iframe URL with enhanced privacy and in-page playback attributes.
 * Disables redirection, enables inline plays, and hides related videos from other channels.
 */
export const getYouTubeEmbedUrl = (input?: string | null): string | null => {
  const videoId = extractYouTubeVideoId(input);
  if (!videoId) return null;

  // Use youtube-nocookie for privacy & optimal web performance
  return `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=0&rel=0&modestbranding=1&playsinline=1`;
};
