import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useVideoStore } from '../store/videoStore';
import { useAuth } from '../contexts/AuthContext';
import { Upload, Video, FileText, Tag, Image, AlertCircle, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const UploadPage = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const { uploadVideo } = useVideoStore();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleVideoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file type
      if (!file.type.startsWith('video/')) {
        setError('Please select a valid video file');
        return;
      }
      
      // Check file size (limit to 100MB for demo)
      if (file.size > 100 * 1024 * 1024) {
        setError('Video file size must be less than 100MB');
        return;
      }
      
      setVideoFile(file);
      setError(null);
    }
  };

  const handleThumbnailFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file type
      if (!file.type.startsWith('image/')) {
        setError('Please select a valid image file for thumbnail');
        return;
      }
      
      // Check file size (limit to 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('Thumbnail file size must be less than 5MB');
        return;
      }
      
      setThumbnailFile(file);
      setError(null);
    }
  };

  const simulateUploadProgress = () => {
    return new Promise<void>((resolve) => {
      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.random() * 15;
        if (progress >= 100) {
          progress = 100;
          setUploadProgress(progress);
          clearInterval(interval);
          resolve();
        } else {
          setUploadProgress(progress);
        }
      }, 200);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      setError('You must be logged in to upload videos');
      return;
    }

    if (!title.trim()) {
      setError('Please enter a video title');
      return;
    }

    if (!description.trim()) {
      setError('Please enter a video description');
      return;
    }

    if (!videoFile) {
      setError('Please select a video file');
      return;
    }

    setIsUploading(true);
    setError(null);
    setUploadProgress(0);

    try {
      // Simulate file upload progress
      await simulateUploadProgress();

      // Create video URLs (in a real app, these would be uploaded to a CDN)
      const videoUrl = URL.createObjectURL(videoFile);
      const thumbnailUrl = thumbnailFile 
        ? URL.createObjectURL(thumbnailFile)
        : `https://images.pexels.com/photos/1440476/pexels-photo-1440476.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260`;

      // Get video duration
      const video = document.createElement('video');
      video.src = videoUrl;
      
      await new Promise<void>((resolve) => {
        video.onloadedmetadata = () => {
          resolve();
        };
      });

      const duration = Math.floor(video.duration);
      const minutes = Math.floor(duration / 60);
      const seconds = duration % 60;
      const formattedDuration = `${minutes}:${seconds.toString().padStart(2, '0')}`;

      // Parse tags
      const tagArray = tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0)
        .slice(0, 10); // Limit to 10 tags

      const videoData = {
        title: title.trim(),
        description: description.trim(),
        thumbnail: thumbnailUrl,
        duration: formattedDuration,
        channel: {
          id: user.id,
          name: user.username,
          avatar: user.avatar || `https://ui-avatars.com/api/?name=${user.username}&background=random`,
          subscribers: '0', // New channel starts with 0 subscribers
        },
        tags: tagArray,
        videoUrl,
        uploadedBy: user.id,
      };

      const uploadedVideo = await uploadVideo(videoData);
      
      setSuccess(true);
      
      // Redirect to the uploaded video after a short delay
      setTimeout(() => {
        navigate(`/video/${uploadedVideo.id}`);
      }, 2000);

    } catch (err) {
      console.error('Upload error:', err);
      setError('Failed to upload video. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  if (success) {
    return (
      <div className="mx-auto max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-lg bg-background-light p-8 text-center"
        >
          <div className="mb-4 flex justify-center">
            <div className="rounded-full bg-green-500/20 p-3">
              <CheckCircle size={48} className="text-green-500" />
            </div>
          </div>
          <h2 className="mb-2 text-2xl font-bold">Upload Successful!</h2>
          <p className="text-neutral-400">
            Your video has been uploaded successfully. Redirecting to your video...
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-8">
        <h1 className="mb-2 text-2xl font-bold">Upload Video</h1>
        <p className="text-neutral-400">
          Share your content with the world. Upload your video and add details to help others discover it.
        </p>
      </div>

      {error && (
        <div className="mb-6 flex items-center gap-2 rounded-md bg-red-900/20 p-4 text-red-400">
          <AlertCircle size={20} />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Left column - Video upload */}
          <div className="space-y-6">
            <div>
              <label className="mb-2 block text-sm font-medium">
                Video File *
              </label>
              <div className="relative">
                <input
                  type="file"
                  accept="video/*"
                  onChange={handleVideoFileChange}
                  className="hidden"
                  id="video-upload"
                  disabled={isUploading}
                />
                <label
                  htmlFor="video-upload"
                  className={`flex h-32 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed transition-colors ${
                    videoFile
                      ? 'border-primary-500 bg-primary-500/10'
                      : 'border-neutral-700 bg-neutral-800/50 hover:border-neutral-600'
                  } ${isUploading ? 'pointer-events-none opacity-50' : ''}`}
                >
                  <Video size={32} className="mb-2 text-neutral-400" />
                  <span className="text-sm font-medium">
                    {videoFile ? videoFile.name : 'Click to select video file'}
                  </span>
                  <span className="text-xs text-neutral-500">
                    MP4, WebM, AVI (Max 100MB)
                  </span>
                </label>
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                Thumbnail (Optional)
              </label>
              <div className="relative">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleThumbnailFileChange}
                  className="hidden"
                  id="thumbnail-upload"
                  disabled={isUploading}
                />
                <label
                  htmlFor="thumbnail-upload"
                  className={`flex h-24 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed transition-colors ${
                    thumbnailFile
                      ? 'border-primary-500 bg-primary-500/10'
                      : 'border-neutral-700 bg-neutral-800/50 hover:border-neutral-600'
                  } ${isUploading ? 'pointer-events-none opacity-50' : ''}`}
                >
                  <Image size={24} className="mb-1 text-neutral-400" />
                  <span className="text-sm font-medium">
                    {thumbnailFile ? thumbnailFile.name : 'Select thumbnail'}
                  </span>
                  <span className="text-xs text-neutral-500">
                    JPG, PNG (Max 5MB)
                  </span>
                </label>
              </div>
            </div>

            {/* Upload Progress */}
            {isUploading && (
              <div className="rounded-lg bg-neutral-800/50 p-4">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-sm font-medium">Uploading...</span>
                  <span className="text-sm text-neutral-400">
                    {Math.round(uploadProgress)}%
                  </span>
                </div>
                <div className="h-2 rounded-full bg-neutral-700">
                  <div
                    className="h-full rounded-full bg-primary-500 transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Right column - Video details */}
          <div className="space-y-6">
            <div>
              <label htmlFor="title" className="mb-2 block text-sm font-medium">
                Title *
              </label>
              <div className="relative">
                <FileText size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                <input
                  type="text"
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="input w-full pl-10"
                  placeholder="Enter video title"
                  maxLength={100}
                  disabled={isUploading}
                />
              </div>
              <div className="mt-1 text-right text-xs text-neutral-500">
                {title.length}/100
              </div>
            </div>

            <div>
              <label htmlFor="description" className="mb-2 block text-sm font-medium">
                Description *
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="input min-h-[120px] w-full resize-none"
                placeholder="Describe your video..."
                maxLength={1000}
                disabled={isUploading}
              />
              <div className="mt-1 text-right text-xs text-neutral-500">
                {description.length}/1000
              </div>
            </div>

            <div>
              <label htmlFor="tags" className="mb-2 block text-sm font-medium">
                Tags (Optional)
              </label>
              <div className="relative">
                <Tag size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                <input
                  type="text"
                  id="tags"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  className="input w-full pl-10"
                  placeholder="gaming, tutorial, music (comma separated)"
                  disabled={isUploading}
                />
              </div>
              <div className="mt-1 text-xs text-neutral-500">
                Separate tags with commas. Maximum 10 tags.
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-4 border-t border-neutral-800 pt-6">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="btn btn-outline"
            disabled={isUploading}
          >
            Cancel
          </button>
          <motion.button
            type="submit"
            className="btn btn-primary"
            disabled={isUploading || !videoFile || !title.trim() || !description.trim()}
            whileHover={{ scale: isUploading ? 1 : 1.02 }}
            whileTap={{ scale: isUploading ? 1 : 0.98 }}
          >
            {isUploading ? (
              <span className="flex items-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Uploading...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Upload size={18} />
                Upload Video
              </span>
            )}
          </motion.button>
        </div>
      </form>
    </div>
  );
};

export default UploadPage;