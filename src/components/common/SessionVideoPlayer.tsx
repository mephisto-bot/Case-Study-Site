import React, { useState, useRef } from 'react';
import { Play, Pause, Maximize2, Volume2, VolumeX, Video, Sparkles } from 'lucide-react';
import { getYouTubeEmbedUrl, extractYouTubeVideoId } from '../../utils/youtube';

interface SessionVideoPlayerProps {
  videoUrl?: string;
  youtubeUrl?: string;
  youtubeVideoId?: string;
  title?: string;
  posterUrl?: string;
  className?: string;
  autoPlay?: boolean;
}

export const SessionVideoPlayer: React.FC<SessionVideoPlayerProps> = ({
  videoUrl,
  youtubeUrl,
  youtubeVideoId,
  title = 'Case Study Session Recording',
  posterUrl = '/images/elevator-pitch-presenter.jpg',
  className = '',
  autoPlay = false,
}) => {
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [isMuted, setIsMuted] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Check if YouTube source is provided
  const ytId = extractYouTubeVideoId(youtubeVideoId || youtubeUrl);
  const isYouTube = Boolean(ytId);
  const ytEmbedUrl = isYouTube ? getYouTubeEmbedUrl(ytId) : null;

  const [hasError, setHasError] = useState(false);

  // Toggle play for HTML5 video
  const togglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch((err) => {
        console.warn('Video play attempt error:', err);
      });
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !videoRef.current.muted;
    setIsMuted(videoRef.current.muted);
  };

  const toggleFullscreen = () => {
    if (!videoRef.current) return;
    if (videoRef.current.requestFullscreen) {
      videoRef.current.requestFullscreen();
    }
  };

  const handleVideoError = () => {
    setHasError(true);
  };

  return (
    <div className={`relative rounded-2xl overflow-hidden bg-navy-950 border border-navy-800 shadow-2xl group ${className}`}>
      {/* Top Header Bar */}
      <div className="absolute top-0 inset-x-0 z-20 bg-gradient-to-b from-navy-950/90 via-navy-950/40 to-transparent p-4 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 rounded-full bg-brand-orange text-white text-[11px] font-extrabold flex items-center gap-1.5 shadow-md">
            <Video className="w-3 h-3" />
            <span>SESSION VIDEO</span>
          </span>
          <span className="text-xs font-bold text-white drop-shadow truncate max-w-xs sm:max-w-md">
            {title}
          </span>
        </div>
      </div>

      {/* YouTube Player or Native HTML5 Player */}
      {isYouTube && ytEmbedUrl ? (
        <div className="relative w-full aspect-video bg-black">
          <iframe
            src={ytEmbedUrl}
            title={title}
            className="w-full h-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        </div>
      ) : videoUrl && !hasError ? (
        <div className="relative w-full aspect-video bg-black flex items-center justify-center">
          <video
            ref={videoRef}
            poster={posterUrl}
            playsInline
            controls
            preload="metadata"
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            onError={handleVideoError}
            className="w-full h-full object-contain"
          >
            <source src={videoUrl} type="video/mp4" />
            Your browser does not support the video tag.
          </video>

          {/* Quick Play Overlay if not playing */}
          {!isPlaying && (
            <button
              onClick={togglePlay}
              className="absolute inset-0 m-auto w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-brand-orange/90 hover:bg-brand-orange text-white flex items-center justify-center shadow-2xl hover:scale-105 active:scale-95 transition-all z-10 pointer-events-auto"
              aria-label="Play Session Video"
            >
              <Play className="w-8 h-8 sm:w-10 sm:h-10 ml-1 fill-white" />
            </button>
          )}
        </div>
      ) : videoUrl && hasError ? (
        <div className="relative w-full aspect-video bg-navy-950 flex flex-col items-center justify-center p-6 text-center text-slate-300 space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-navy-900 border border-white/10 flex items-center justify-center">
            <Video className="w-7 h-7 text-brand-orange" />
          </div>
          <div className="space-y-1 max-w-sm">
            <p className="text-sm font-bold text-white">Video Playback Notice</p>
            <p className="text-xs text-slate-400">
              The video stream could not be loaded directly by your browser codec.
            </p>
          </div>
          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={() => {
                setHasError(false);
                if (videoRef.current) videoRef.current.load();
              }}
              className="px-4 py-2 rounded-xl bg-brand-orange hover:bg-brand-orange-hover text-white text-xs font-bold transition-all shadow-md"
            >
              Retry Playback
            </button>
            <a
              href={videoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-xl bg-navy-800 hover:bg-navy-700 text-white text-xs font-bold border border-white/10 transition-all"
            >
              Open Direct Stream
            </a>
          </div>
        </div>
      ) : (
        <div className="relative w-full aspect-video bg-navy-900 flex flex-col items-center justify-center p-6 text-center text-slate-400">
          <Video className="w-12 h-12 text-slate-600 mb-2" />
          <p className="text-sm font-semibold text-slate-300">Video source not loaded</p>
          <p className="text-xs text-slate-500 mt-1">Check back soon for the live session recording</p>
        </div>
      )}
    </div>
  );
};
