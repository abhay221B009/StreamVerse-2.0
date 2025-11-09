import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';
import { motion } from 'framer-motion';

const NotFoundPage = () => {
  return (
    <div className="flex min-h-[calc(100vh-64px)] flex-col items-center justify-center text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="mb-4 text-8xl font-bold text-primary-500">404</h1>
        <h2 className="mb-6 text-2xl font-semibold">Page Not Found</h2>
        <p className="mb-8 text-neutral-400">
          The page you are looking for doesn't exist or has been moved.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 rounded-md bg-primary-600 px-6 py-2.5 font-medium text-white transition-colors hover:bg-primary-700"
        >
          <Home size={18} />
          <span>Back to Home</span>
        </Link>
      </motion.div>
    </div>
  );
};

export default NotFoundPage;