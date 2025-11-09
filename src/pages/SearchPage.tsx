import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useVideoStore } from '../store/videoStore';
import VideoCard from '../components/ui/VideoCard';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { Search } from 'lucide-react';

const SearchPage = () => {
  const location = useLocation();
  const { searchVideos, searchResults, fetchVideos, videos } = useVideoStore();
  
  const [isLoading, setIsLoading] = useState(true);
  
  // Extract query parameters
  const query = new URLSearchParams(location.search).get('q') || '';

  useEffect(() => {
    const loadResults = async () => {
      setIsLoading(true);
      
      try {
        if (query) {
          // Search with query
          await searchVideos(query);
        } else {
          // Show all videos if no query
          await fetchVideos();
        }
      } catch (error) {
        console.error('Error loading search results:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadResults();
  }, [query, searchVideos, fetchVideos]);

  // Determine which videos to display
  const displayVideos = query ? searchResults : videos;

  const resultsTitle = query
    ? `Search results for "${query}"`
    : 'All Videos';

  return (
    <div className="mx-auto max-w-7xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">{resultsTitle}</h1>
        {query && (
          <p className="text-neutral-400">
            Found {displayVideos.length} {displayVideos.length === 1 ? 'video' : 'videos'}
          </p>
        )}
      </div>

      {isLoading ? (
        <div className="flex h-96 items-center justify-center">
          <LoadingSpinner size="lg" />
        </div>
      ) : displayVideos.length === 0 ? (
        <div className="flex h-96 flex-col items-center justify-center rounded-lg bg-background-light p-8 text-center">
          <div className="mb-4 rounded-full bg-neutral-700 p-6">
            <Search size={48} className="text-neutral-400" />
          </div>
          <h2 className="mb-2 text-xl font-bold">
            {query ? 'No videos found' : 'No videos available'}
          </h2>
          <p className="text-neutral-400">
            {query 
              ? 'Try different search terms or browse all videos'
              : 'No videos have been uploaded yet. Be the first to share your content!'
            }
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {displayVideos.map(video => (
            <VideoCard key={video.id} video={video} layout="list" />
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchPage;