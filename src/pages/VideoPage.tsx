import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useVideoStore, Video } from '../store/videoStore';
import VideoPlayer from '../components/ui/VideoPlayer';
import VideoCard from '../components/ui/VideoCard';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { formatViews, formatDate } from '../utils/formatters';
import { ThumbsUp, ThumbsDown, Share2, PlusCircle, Flag } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';

const VideoPage = () => {
  const { id } = useParams<{ id: string }>();
  const { videos, fetchVideos, recommendedVideos, fetchRecommendedVideos, addToHistory } = useVideoStore();
  const { isAuthenticated } = useAuth();
  
  const [currentVideo, setCurrentVideo] = useState<Video | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showFullDescription, setShowFullDescription] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      
      try {
        // Fetch videos if they're not already loaded
        let allVideos = videos;
        if (allVideos.length === 0) {
          allVideos = await fetchVideos();
        }
        
        // Find the current video
        const video = allVideos.find(v => v.id === id);
        if (video) {
          setCurrentVideo(video);
          
          // Add to watch history
          if (isAuthenticated) {
            addToHistory(video.id);
          }
          
          // Fetch recommended videos based on the current video
          await fetchRecommendedVideos();
        }
      } catch (error) {
        console.error('Error loading video data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, [id, videos, fetchVideos, fetchRecommendedVideos, addToHistory, isAuthenticated]);

  if (isLoading) {
    return (
      <div className="flex h-[calc(100vh-64px)] items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!currentVideo) {
    return (
      <div className="flex h-[calc(100vh-64px)] flex-col items-center justify-center">
        <h2 className="mb-4 text-2xl font-bold">Video not found</h2>
        <p className="text-neutral-400">The video you're looking for doesn't exist or has been removed.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Video player and info column */}
        <div className="lg:col-span-2">
          {/* Video Player */}
          <VideoPlayer 
            src={currentVideo.videoUrl} 
            poster={currentVideo.thumbnail} 
            autoPlay={true}
          />

          {/* Video Info */}
          <div className="mt-4">
            <h1 className="text-2xl font-bold">{currentVideo.title}</h1>
            
            <div className="mt-2 flex flex-wrap items-center justify-between border-b border-neutral-800 pb-4">
              <div className="flex items-center gap-2">
                <img 
                  src={currentVideo.channel.avatar} 
                  alt={currentVideo.channel.name}
                  className="h-10 w-10 rounded-full"
                />
                <div>
                  <h3 className="font-medium">{currentVideo.channel.name}</h3>
                  <p className="text-sm text-neutral-400">{currentVideo.channel.subscribers} subscribers</p>
                </div>
                <button className="ml-4 rounded-full bg-primary-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-primary-700">
                  Subscribe
                </button>
              </div>
              
              <div className="mt-4 flex flex-wrap gap-2 sm:mt-0">
                <motion.button 
                  className="flex items-center gap-1 rounded-full bg-neutral-800 px-4 py-1.5 text-sm hover:bg-neutral-700"
                  whileTap={{ scale: 0.95 }}
                >
                  <ThumbsUp size={18} />
                  <span>Like</span>
                </motion.button>
                
                <motion.button 
                  className="flex items-center gap-1 rounded-full bg-neutral-800 px-4 py-1.5 text-sm hover:bg-neutral-700"
                  whileTap={{ scale: 0.95 }}
                >
                  <ThumbsDown size={18} />
                  <span>Dislike</span>
                </motion.button>
                
                <motion.button 
                  className="flex items-center gap-1 rounded-full bg-neutral-800 px-4 py-1.5 text-sm hover:bg-neutral-700"
                  whileTap={{ scale: 0.95 }}
                >
                  <Share2 size={18} />
                  <span>Share</span>
                </motion.button>
                
                <motion.button 
                  className="flex items-center gap-1 rounded-full bg-neutral-800 px-4 py-1.5 text-sm hover:bg-neutral-700"
                  whileTap={{ scale: 0.95 }}
                >
                  <PlusCircle size={18} />
                  <span>Save</span>
                </motion.button>
                
                <motion.button 
                  className="flex items-center gap-1 rounded-full bg-neutral-800 px-4 py-1.5 text-sm hover:bg-neutral-700"
                  whileTap={{ scale: 0.95 }}
                >
                  <Flag size={18} />
                  <span>Report</span>
                </motion.button>
              </div>
            </div>
            
            {/* Video details */}
            <div className="mt-4 rounded-lg bg-neutral-800/50 p-4">
              <div className="flex flex-wrap gap-2 text-sm">
                <span className="font-semibold">{formatViews(currentVideo.views)} views</span>
                <span className="text-neutral-400">•</span>
                <span className="text-neutral-400">{formatDate(currentVideo.uploadDate)}</span>
                
                {currentVideo.tags.map((tag, index) => (
                  <span key={index} className="text-primary-400">#{tag}</span>
                ))}
              </div>
              
              <div className="mt-2">
                <p className={`whitespace-pre-line text-sm ${!showFullDescription && 'line-clamp-2'}`}>
                  {currentVideo.description}
                </p>
                <button 
                  className="mt-1 text-sm font-medium text-primary-400 hover:text-primary-300"
                  onClick={() => setShowFullDescription(!showFullDescription)}
                >
                  {showFullDescription ? 'Show less' : 'Show more'}
                </button>
              </div>
            </div>

            {/* Comments section would go here */}
            <div className="mt-6 border-t border-neutral-800 pt-6">
              <h3 className="mb-4 text-xl font-bold">Comments</h3>
              <p className="text-neutral-400">Comments are disabled for this demo.</p>
            </div>
          </div>
        </div>
        
        {/* Recommended videos column */}
        <div>
          <h2 className="mb-4 text-xl font-bold">Recommended</h2>
          <div className="space-y-4">
            {recommendedVideos
              .filter(video => video.id !== currentVideo.id)
              .slice(0, 8)
              .map(video => (
                <VideoCard key={video.id} video={video} layout="list" />
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPage;