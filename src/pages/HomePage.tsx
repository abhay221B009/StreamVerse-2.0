import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useVideoStore } from '../store/videoStore';
import { useAuth } from '../contexts/AuthContext';
import VideoCard from '../components/ui/VideoCard';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { Upload, Play, Users, Video } from 'lucide-react';
import { motion } from 'framer-motion';

const HomePage = () => {
  const { videos, fetchVideos } = useVideoStore();
  const { isAuthenticated, user } = useAuth();
  
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      
      try {
        await fetchVideos();
      } catch (error) {
        console.error('Error loading videos:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, [fetchVideos]);
  
  if (isLoading) {
    return (
      <div className="flex h-[calc(100vh-64px)] items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl">
      {/* Hero Section */}
      <section className="mb-12 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="mb-4 text-4xl font-bold md:text-6xl">
            Share Your <span className="text-primary-500">Story</span>
          </h1>
          <p className="mb-8 text-lg text-neutral-400 md:text-xl">
            Upload, share, and discover amazing videos from creators around the world
          </p>
          
          {isAuthenticated ? (
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Link
                to="/upload"
                className="btn btn-primary flex items-center justify-center gap-2 text-lg"
              >
                <Upload size={20} />
                <span>Upload Video</span>
              </Link>
              <Link
                to="/my-videos"
                className="btn btn-outline flex items-center justify-center gap-2 text-lg"
              >
                <Video size={20} />
                <span>My Videos</span>
              </Link>
            </div>
          ) : (
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Link
                to="/signup"
                className="btn btn-primary flex items-center justify-center gap-2 text-lg"
              >
                <Users size={20} />
                <span>Join Now</span>
              </Link>
              <Link
                to="/login"
                className="btn btn-outline flex items-center justify-center gap-2 text-lg"
              >
                <span>Sign In</span>
              </Link>
            </div>
          )}
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="mb-12">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          <motion.div
            className="rounded-lg bg-background-light p-6 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <div className="mb-2 text-3xl font-bold text-primary-500">
              {videos.length}
            </div>
            <div className="text-neutral-400">Videos Uploaded</div>
          </motion.div>
          
          <motion.div
            className="rounded-lg bg-background-light p-6 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="mb-2 text-3xl font-bold text-secondary-500">
              {videos.reduce((total, video) => total + video.views, 0).toLocaleString()}
            </div>
            <div className="text-neutral-400">Total Views</div>
          </motion.div>
          
          <motion.div
            className="rounded-lg bg-background-light p-6 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className="mb-2 text-3xl font-bold text-accent-500">
              {new Set(videos.map(v => v.uploadedBy)).size}
            </div>
            <div className="text-neutral-400">Active Creators</div>
          </motion.div>
        </div>
      </section>

      {/* Recent Videos Section */}
      <section className="mb-12">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold">Recent Videos</h2>
          {videos.length > 8 && (
            <Link
              to="/search"
              className="text-primary-400 hover:text-primary-300"
            >
              View All
            </Link>
          )}
        </div>
        
        {videos.length === 0 ? (
          <div className="flex h-96 flex-col items-center justify-center rounded-lg bg-background-light p-8 text-center">
            <div className="mb-4 rounded-full bg-primary-500/20 p-6">
              <Play size={48} className="text-primary-400" />
            </div>
            <h3 className="mb-2 text-xl font-bold">No videos yet</h3>
            <p className="mb-6 text-neutral-400">
              Be the first to share your content with the community!
            </p>
            {isAuthenticated ? (
              <Link
                to="/upload"
                className="btn btn-primary flex items-center gap-2"
              >
                <Upload size={18} />
                <span>Upload First Video</span>
              </Link>
            ) : (
              <Link
                to="/signup"
                className="btn btn-primary flex items-center gap-2"
              >
                <Users size={18} />
                <span>Join to Upload</span>
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {videos
              .sort((a, b) => new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime())
              .slice(0, 8)
              .map((video) => (
                <VideoCard key={video.id} video={video} />
              ))}
          </div>
        )}
      </section>

      {/* Call to Action */}
      {!isAuthenticated && (
        <section className="rounded-lg bg-gradient-to-r from-primary-900/50 to-secondary-900/50 p-8 text-center">
          <h2 className="mb-4 text-2xl font-bold">Ready to Get Started?</h2>
          <p className="mb-6 text-neutral-300">
            Join our community of creators and start sharing your videos today.
          </p>
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Link
              to="/signup"
              className="btn btn-primary flex items-center justify-center gap-2"
            >
              <Users size={18} />
              <span>Create Account</span>
            </Link>
            <Link
              to="/login"
              className="btn btn-outline flex items-center justify-center gap-2"
            >
              <span>Sign In</span>
            </Link>
          </div>
        </section>
      )}
    </div>
  );
};

export default HomePage;