import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Video {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  duration: string;
  views: number;
  uploadDate: string;
  channel: {
    id: string;
    name: string;
    avatar: string;
    subscribers: string;
  };
  tags: string[];
  videoUrl: string;
  uploadedBy: string; // User ID who uploaded the video
}

interface VideoState {
  videos: Video[];
  userVideos: Video[];
  searchResults: Video[];
  watchHistory: string[];

  // Actions
  uploadVideo: (
    videoData: Omit<Video, "id" | "views" | "uploadDate">
  ) => Promise<Video>;
  fetchVideos: () => Promise<Video[]>;
  fetchUserVideos: (userId: string) => Promise<Video[]>;
  searchVideos: (query: string) => Promise<Video[]>;
  addToHistory: (videoId: string) => void;
  clearHistory: () => void;
  deleteVideo: (videoId: string, userId: string) => Promise<void>;
}

export const useVideoStore = create<VideoState>()(
  persist(
    (set, get) => ({
      videos: [],
      userVideos: [],
      searchResults: [],
      watchHistory: [],

      uploadVideo: async (videoData) => {
        // Simulate API call delay
        await new Promise((resolve) => setTimeout(resolve, 1000));

        const newVideo: Video = {
          ...videoData,
          id:
            "video-" +
            Date.now() +
            "-" +
            Math.random().toString(36).substr(2, 9),
          views: 0,
          uploadDate: new Date().toISOString().split("T")[0],
        };

        set((state) => ({
          videos: [newVideo, ...state.videos],
          userVideos:
            videoData.uploadedBy === videoData.channel.id
              ? [newVideo, ...state.userVideos]
              : state.userVideos,
        }));

        return newVideo;
      },

      fetchVideos: async () => {
        // Simulate API call delay
        await new Promise((resolve) => setTimeout(resolve, 500));

        const { videos } = get();
        return videos;
      },

      fetchUserVideos: async (userId: string) => {
        // Simulate API call delay
        await new Promise((resolve) => setTimeout(resolve, 500));

        const { videos } = get();
        const userVideos = videos.filter(
          (video) => video.uploadedBy === userId
        );

        set({ userVideos });
        return userVideos;
      },

      searchVideos: async (query: string) => {
        // Simulate API call delay
        await new Promise((resolve) => setTimeout(resolve, 300));

        const { videos } = get();
        const searchTerm = query.toLowerCase();

        const results = videos.filter(
          (video) =>
            video.title.toLowerCase().includes(searchTerm) ||
            video.description.toLowerCase().includes(searchTerm) ||
            video.tags.some((tag) => tag.toLowerCase().includes(searchTerm))
        );

        set({ searchResults: results });
        return results;
      },

      addToHistory: (videoId: string) => {
        set((state) => {
          // Remove if exists to avoid duplicates
          const filteredHistory = state.watchHistory.filter(
            (id) => id !== videoId
          );
          // Add to the beginning
          return { watchHistory: [videoId, ...filteredHistory] };
        });
      },

      clearHistory: () => {
        set({ watchHistory: [] });
      },

      deleteVideo: async (videoId: string, userId: string) => {
        // Simulate API call delay
        await new Promise((resolve) => setTimeout(resolve, 500));

        set((state) => {
          const updatedVideos = state.videos.filter(
            (video) => !(video.id === videoId && video.uploadedBy === userId)
          );
          const updatedUserVideos = state.userVideos.filter(
            (video) => video.id !== videoId
          );

          return {
            videos: updatedVideos,
            userVideos: updatedUserVideos,
            watchHistory: state.watchHistory.filter((id) => id !== videoId),
          };
        });
      },
    }),
    {
      name: "streamVerse-storage",
      partialize: (state) => ({
        videos: state.videos,
        watchHistory: state.watchHistory,
      }),
    }
  )
);
