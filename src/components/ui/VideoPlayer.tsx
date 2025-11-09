import { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize2, Settings, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatVideoTime } from '../../utils/formatters';

interface VideoPlayerProps {
  src: string;
  poster?: string;
  autoPlay?: boolean;
}

const VideoPlayer = ({ src, poster, autoPlay = false }: VideoPlayerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const videoContainerRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isBuffering, setIsBuffering] = useState(false);
  
  const controlsTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleDurationChange = () => setDuration(video.duration);
    const handleTimeUpdate = () => setCurrentTime(video.currentTime);
    const handleVolumeChange = () => setVolume(video.volume);
    const handleWaiting = () => setIsBuffering(true);
    const handlePlaying = () => setIsBuffering(false);

    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);
    video.addEventListener('durationchange', handleDurationChange);
    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('volumechange', handleVolumeChange);
    video.addEventListener('waiting', handleWaiting);
    video.addEventListener('playing', handlePlaying);

    return () => {
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('durationchange', handleDurationChange);
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('volumechange', handleVolumeChange);
      video.removeEventListener('waiting', handleWaiting);
      video.removeEventListener('playing', handlePlaying);
    };
  }, []);

  // Auto-play handling
  useEffect(() => {
    if (autoPlay && videoRef.current) {
      videoRef.current.play().catch(error => {
        console.error('Autoplay was prevented:', error);
      });
    }
  }, [autoPlay]);

  // Handle fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  // Hide controls after inactivity
  useEffect(() => {
    const hideControls = () => {
      if (isPlaying) {
        setShowControls(false);
      }
    };

    const resetControlsTimeout = () => {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
      setShowControls(true);
      if (isPlaying) {
        controlsTimeoutRef.current = window.setTimeout(hideControls, 3000);
      }
    };

    resetControlsTimeout();

    return () => {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
    };
  }, [isPlaying]);

  const togglePlay = () => {
    if (!videoRef.current) return;
    
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    
    const newMutedState = !isMuted;
    videoRef.current.muted = newMutedState;
    setIsMuted(newMutedState);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!videoRef.current) return;
    
    const newVolume = parseFloat(e.target.value);
    videoRef.current.volume = newVolume;
    setVolume(newVolume);
    
    if (newVolume === 0) {
      setIsMuted(true);
      videoRef.current.muted = true;
    } else if (isMuted) {
      setIsMuted(false);
      videoRef.current.muted = false;
    }
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!videoRef.current || !progressRef.current) return;
    
    const rect = progressRef.current.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    videoRef.current.currentTime = pos * videoRef.current.duration;
  };

  const handleSeek = (seconds: number) => {
    if (!videoRef.current) return;
    
    const newTime = videoRef.current.currentTime + seconds;
    videoRef.current.currentTime = Math.max(0, Math.min(newTime, videoRef.current.duration));
  };

  const toggleFullscreen = () => {
    if (!videoContainerRef.current) return;
    
    if (isFullscreen) {
      document.exitFullscreen();
    } else {
      videoContainerRef.current.requestFullscreen();
    }
  };

  const handleMouseMove = () => {
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    setShowControls(true);
    if (isPlaying) {
      controlsTimeoutRef.current = window.setTimeout(() => {
        setShowControls(false);
      }, 3000);
    }
  };

  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div 
      ref={videoContainerRef} 
      className="group/player relative aspect-video w-full overflow-hidden rounded-lg bg-black"
      onMouseMove={handleMouseMove}
    >
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        className="h-full w-full"
        onClick={togglePlay}
        onDoubleClick={toggleFullscreen}
      />

      {/* Buffering indicator */}
      <AnimatePresence>
        {isBuffering && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex items-center justify-center bg-black/20"
          >
            <div className="h-16 w-16 animate-spin rounded-full border-4 border-neutral-300 border-t-primary-500"></div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Controls overlay */}
      <AnimatePresence>
        {showControls && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"
          >
            {/* Center play/pause button */}
            <motion.button
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary-600/80 p-4 text-white backdrop-blur-sm transition-transform hover:bg-primary-600"
              onClick={togglePlay}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              {isPlaying ? <Pause size={24} /> : <Play size={24} />}
            </motion.button>

            {/* Seek buttons */}
            <button
              className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-black/40 p-2 text-white transition-colors hover:bg-black/60"
              onClick={() => handleSeek(-10)}
            >
              <ChevronLeft size={24} />
            </button>
            <button
              className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-black/40 p-2 text-white transition-colors hover:bg-black/60"
              onClick={() => handleSeek(10)}
            >
              <ChevronRight size={24} />
            </button>

            {/* Bottom controls */}
            <div className="absolute bottom-0 left-0 right-0 p-4">
              {/* Progress bar */}
              <div
                ref={progressRef}
                className="group/progress mb-4 h-1 cursor-pointer rounded-full bg-neutral-600"
                onClick={handleProgressClick}
              >
                <div
                  className="h-full rounded-full bg-primary-500 transition-all group-hover/progress:h-1.5"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <button
                    onClick={togglePlay}
                    className="rounded-full p-1 text-white transition-colors hover:bg-neutral-800"
                  >
                    {isPlaying ? <Pause size={20} /> : <Play size={20} />}
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={toggleMute}
                      className="rounded-full p-1 text-white transition-colors hover:bg-neutral-800"
                    >
                      {isMuted || volume === 0 ? <VolumeX size={20} /> : <Volume2 size={20} />}
                    </button>
                    
                    <div className="group relative">
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.01"
                        value={isMuted ? 0 : volume}
                        onChange={handleVolumeChange}
                        className="h-1 w-20 appearance-none rounded-full bg-neutral-600 outline-none md:w-24"
                      />
                    </div>
                  </div>

                  <div className="text-sm text-white">
                    <span>{formatVideoTime(currentTime)}</span>
                    <span> / </span>
                    <span>{formatVideoTime(duration)}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    className="rounded-full p-1 text-white transition-colors hover:bg-neutral-800"
                  >
                    <Settings size={20} />
                  </button>
                  
                  <button
                    onClick={toggleFullscreen}
                    className="rounded-full p-1 text-white transition-colors hover:bg-neutral-800"
                  >
                    <Maximize2 size={20} />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default VideoPlayer;