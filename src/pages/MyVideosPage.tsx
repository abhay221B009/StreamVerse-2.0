import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useVideoStore, Video } from '../store/videoStore';
import { useAuth } from '../contexts/AuthContext';
import VideoCard from '../components/ui/VideoCard';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { Upload, Trash2, CreditCard as Edit, Eye } from 'lucide-react';
import { motion } from 'framer-motion';
import { formatViews, formatDate } from '../utils/formatters';

const MyVideosPage = () => {
  const { user } = useAuth();
  const { userVideos, fetchUserVideos, deleteVideo } = useVideoStore();
  
  const [isLoading, setIsLoading] = useState(true);
  const [deletingVideoId, setDeletingVideoId] = useState<string | null>(null);

  useEffect(() => {
    const loadUserVideos = async () => {
      if (!user) return;
      
      setIsLoading(true);
      try {
        await fetchUserVideos(user.id);
      } catch (error) {
        console.error('Error loading user videos:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadUserVideos();
  }, [user, fetchUserVideos]);

  const handleDeleteVideo = async (videoId: string) => {
    if (!user) return;
    
    if (window.confirm('Are you sure you want to delete this video? This action cannot be undone.')) {
      setDeletingVideoId(videoId);
      try {
        await deleteVideo(videoId, user.id);
      } catch (error) {
        console.error('Error deleting video:', error);
      } finally {
        setDeletingVideoId(null);
      }
    }
  };

  if (!user) {
    return (
      <div className="flex h-[calc(100vh-64px)] flex-col items-center justify-center">
        <h2 className="mb-4 text-2xl font-bold">Please sign in</h2>
        <p className="text-neutral-400">You need to be signed in to view your videos.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">My Videos</h1>
          <p className="text-neutral-400">
            Manage your uploaded videos and track their performance
          </p>
        </div>
        
        <Link
          to="/upload"
          className="btn btn-primary flex items-center gap-2"
        >
          <Upload size={18} />
          <span>Upload Video</span>
        </Link>
      </div>

      {isLoading ? (
        <div className="flex h-96 items-center justify-center">
          <LoadingSpinner size="lg" />
        </div>
      ) : userVideos.length === 0 ? (
        <div className="flex h-96 flex-col items-center justify-center rounded-lg bg-background-light p-8 text-center">
          <div className="mb-4 rounded-full bg-primary-500/20 p-6">
            <Upload size={48} className="text-primary-400" />
          </div>
          <h2 className="mb-2 text-xl font-bold">No videos uploaded yet</h2>
          <p className="mb-6 text-neutral-400">
            Start sharing your content with the world by uploading your first video.
          </p>
          <Link
            to="/upload"
            className="btn btn-primary flex items-center gap-2"
          >
            <Upload size={18} />
            <span>Upload Your First Video</span>
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Stats Overview */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-lg bg-background-light p-4">
              <div className="text-2xl font-bold text-primary-400">
                {userVideos.length}
              </div>
              <div className="text-sm text-neutral-400">Total Videos</div>
            </div>
            <div className="rounded-lg bg-background-light p-4">
              <div className="text-2xl font-bold text-secondary-400">
                {formatViews(userVideos.reduce((total, video) => total + video.views, 0))}
              </div>
              <div className="text-sm text-neutral-400">Total Views</div>
            </div>
            <div className="rounded-lg bg-background-light p-4">
              <div className="text-2xl font-bold text-accent-400">
                {userVideos.length > 0 
                  ? Math.round(userVideos.reduce((total, video) => total + video.views, 0) / userVideos.length)
                  : 0
                }
              </div>
              <div className="text-sm text-neutral-400">Avg. Views</div>
            </div>
          </div>

          {/* Videos List */}
          <div className="space-y-4">
            {userVideos.map(video => (
              <motion.div
                key={video.id}
                className="grid grid-cols-1 gap-4 rounded-lg bg-background-light p-4 md:grid-cols-[200px,1fr,auto]"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                {/* Thumbnail */}
                <div className="aspect-video w-full overflow-hidden rounded-lg">
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="h-full w-full object-cover"
                  />
                </div>

                {/* Video Info */}
                <div className="flex-1">
                  <h3 className="mb-2 font-semibold line-clamp-2">
                    {video.title}
                  </h3>
                  <p className="mb-2 text-sm text-neutral-400 line-clamp-2">
                    {video.description}
                  </p>
                  <div className="flex flex-wrap gap-2 text-xs text-neutral-500">
                    <span>{formatViews(video.views)} views</span>
                    <span>•</span>
                    <span>{formatDate(video.uploadDate)}</span>
                    <span>•</span>
                    <span>{video.duration}</span>
                  </div>
                  {video.tags.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {video.tags.slice(0, 3).map((tag, index) => (
                        <span
                          key={index}
                          className="rounded-full bg-neutral-700 px-2 py-1 text-xs text-neutral-300"
                        >
                          #{tag}
                        </span>
                      ))}
                      {video.tags.length > 3 && (
                        <span className="text-xs text-neutral-500">
                          +{video.tags.length - 3} more
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-2 sm:flex-row md:flex-col">
                  <Link
                    to={`/video/${video.id}`}
                    className="flex items-center justify-center gap-1 rounded-md bg-neutral-800 px-3 py-2 text-sm text-neutral-300 hover:bg-neutral-700"
                  >
                    <Eye size={16} />
                    <span className="hidden sm:inline">View</span>
                  </Link>
                  
                  <button
                    onClick={() => handleDeleteVideo(video.id)}
                    disabled={deletingVideoId === video.id}
                    className="flex items-center justify-center gap-1 rounded-md bg-red-900/20 px-3 py-2 text-sm text-red-400 hover:bg-red-900/30 disabled:opacity-50"
                  >
                    {deletingVideoId === video.id ? (
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-red-400 border-t-transparent" />
                    ) : (
                      <Trash2 size={16} />
                    )}
                    <span className="hidden sm:inline">Delete</span>
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MyVideosPage;