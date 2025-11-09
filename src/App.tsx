import { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';
import LoadingSpinner from './components/ui/LoadingSpinner';
import { useAuth } from './contexts/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';

// Lazy load pages for better performance
const HomePage = lazy(() => import('./pages/HomePage'));
const VideoPage = lazy(() => import('./pages/VideoPage'));
const SearchPage = lazy(() => import('./pages/SearchPage'));
const UploadPage = lazy(() => import('./pages/UploadPage'));
const MyVideosPage = lazy(() => import('./pages/MyVideosPage'));
const HistoryPage = lazy(() => import('./pages/HistoryPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const SignupPage = lazy(() => import('./pages/SignupPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

function App() {
  const { isInitializing } = useAuth();

  if (isInitializing) {
    return (
      <div className="flex h-screen items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <Suspense
      fallback={
        <div className="flex h-screen items-center justify-center">
          <LoadingSpinner size="lg" />
        </div>
      }
    >
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/video/:id" element={<VideoPage />} />
          <Route path="/search" element={<SearchPage />} />
          
          <Route element={<ProtectedRoute />}>
            <Route path="/upload" element={<UploadPage />} />
            <Route path="/my-videos" element={<MyVideosPage />} />
            <Route path="/history" element={<HistoryPage />} />
          </Route>
          
          <Route path="/404" element={<NotFoundPage />} />
          <Route path="*" element={<Navigate to="/404" replace />} />
        </Route>
      </Routes>
    </Suspense>
  );
}

export default App;