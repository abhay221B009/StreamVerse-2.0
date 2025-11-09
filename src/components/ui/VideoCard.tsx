import React from 'react';
import { Link } from 'react-router-dom';
import { Play, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import { formatViews, formatDate } from '../../utils/formatters';
import { Video } from '../../store/videoStore';

interface VideoCardProps {
  video: Video;
  layout?: 'grid' | 'list' | 'featured';
}

const VideoCard: React.FC<VideoCardProps> = ({ video, layout = 'grid' }) => {
  const getCardStyles = () => {
    switch (layout) {
      case 'list':
        return 'grid grid-cols-[120px,1fr] md:grid-cols-[220px,1fr] gap-4';
      case 'featured':
        return 'grid grid-cols-1 md:grid-cols-[2fr,1fr] gap-6 bg-background-light rounded-xl overflow-hidden';
      default:
        return 'flex flex-col';
    }
  };

  const getThumbnailStyles = () => {
    switch (layout) {
      case 'list':
        return 'aspect-video w-full h-full rounded-lg overflow-hidden';
      case 'featured':
        return 'aspect-video w-full md:h-full md:aspect-auto rounded-lg md:rounded-none overflow-hidden';
      default:
        return 'aspect-video w-full rounded-lg overflow-hidden';
    }
  };

  return (
    <Link
      to={`/video/${video.id}`}
      className={`card-hover ${getCardStyles()}`}
    >
      <div className={getThumbnailStyles()}>
        <div className="group relative h-full w-full">
          <img
            src={video.thumbnail}
            alt={video.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />

          <div className="absolute bottom-2 right-2 rounded bg-black/80 px-1.5 py-0.5 text-xs font-medium text-white">
            {video.duration}
          </div>
          
          <motion.div
            className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100"
            whileHover={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
          >
            <motion.div 
              className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-600 text-white"
              initial={{ scale: 0.8 }}
              whileHover={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 400, damping: 10 }}
            >
              <Play size={20} fill="white" />
            </motion.div>
          </motion.div>
        </div>
      </div>

      <div className={layout === 'featured' ? 'p-6' : 'mt-3'}>
        <h3 className={`font-semibold line-clamp-2 ${layout === 'featured' ? 'text-xl mb-2' : 'text-base'}`}>
          {video.title}
        </h3>

        {layout === 'featured' && (
          <p className="mb-4 line-clamp-2 text-sm text-neutral-400">
            {video.description}
          </p>
        )}

        <div className="mt-1 flex items-center text-sm text-neutral-400">
          <span>{video.channel.name}</span>
          <span className="mx-2">•</span>
          <span>{formatViews(video.views)} views</span>
          <span className="mx-2">•</span>
          <span>{formatDate(video.uploadDate)}</span>
        </div>

        {layout === 'featured' && (
          <div className="mt-4">
            <span className="inline-block rounded-full bg-primary-900/50 px-3 py-1 text-xs font-medium text-primary-400">
              {video.category}
            </span>
          </div>
        )}
      </div>
    </Link>
  );
};

export default VideoCard;