import { useEffect, useState } from 'react';
import { useVideoStore, Video } from '../store/videoStore';
import VideoCard from '../components/ui/VideoCard';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';

const HistoryPage = () => {
  const { videos, fetchVideos, watchHistory, clearHistory } = useVideoStore();
  
  const [isLoading, setIsLoading] = useState(true);
  const [historyVideos, setHistoryVideos] = useState<Video[]>([]);

  useEffect(() => {
    const loadHistory = async () => {
      setIsLoading(true);
      
      try {
        // Fetch videos if not already loaded
        let allVideos = videos;
        if (allVideos.length === 0) {
          allVideos = await fetchVideos();
        }
        
        // Filter videos to only those in watch history
        const videoMap = new Map(allVideos.map(v => [v.id, v]));
        const historyVids = watchHistory
          .map(id => videoMap.get(id))
          .filter((v): v is Video => v !== undefined);
        
        setHistoryVideos(historyVids);
      } catch (error) {
        console.error('Error loading watch history:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadHistory();
  }, [videos, watchHistory, fetchVideos]);

  const handleClearHistory = () => {
    // Show confirmation dialog
    if (window.confirm('Are you sure you want to clear your watch history?')) {
      clearHistory();
      setHistoryVideos([]);
    }
  };

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Watch History</h1>
        
        {historyVideos.length > 0 && (
          <motion.button
            className="flex items-center gap-2 rounded-md bg-neutral-800 px-4 py-2 text-sm text-red-400 hover:bg-neutral-700"
            onClick={handleClearHistory}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Trash2 size={16} />
            <span>Clear History</span>
          </motion.button>
        )}
      </div>

      {isLoading ? (
        <div className="flex h-96 items-center justify-center">
          <LoadingSpinner size="lg" />
        </div>
      ) : historyVideos.length === 0 ? (
        <div className="flex h-96 flex-col items-center justify-center rounded-lg bg-background-light p-8 text-center">
          <h2 className="mb-2 text-xl font-bold">No watch history</h2>
          <p className="text-neutral-400">
            Videos you watch will appear here. Start exploring!
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {historyVideos.map(video => (
            <VideoCard key={video.id} video={video} layout="list" />
          ))}
        </div>
      )}
    </div>
  );
};

export default HistoryPage;