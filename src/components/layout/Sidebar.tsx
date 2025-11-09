import { NavLink } from 'react-router-dom';
import { 
  Home, 
  Search,
  Upload,
  Video,
  Clock, 
  LogIn
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const Sidebar = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="flex h-full flex-col overflow-y-auto border-r border-neutral-800 bg-background">
      <div className="flex-1 p-4">
        <nav className="space-y-6">
          <div>
            <div className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-neutral-500">
              Browse
            </div>
            <ul className="space-y-1">
              <li>
                <NavLink
                  to="/"
                  className={({ isActive }) =>
                    `sidebar-link ${isActive ? 'active' : ''}`
                  }
                >
                  <Home size={18} />
                  <span>Home</span>
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/search"
                  className={({ isActive }) =>
                    `sidebar-link ${isActive ? 'active' : ''}`
                  }
                >
                  <Search size={18} />
                  <span>All Videos</span>
                </NavLink>
              </li>
            </ul>
          </div>

          {isAuthenticated && (
            <div>
              <div className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-neutral-500">
                Your Content
              </div>
              <ul className="space-y-1">
                <li>
                  <NavLink
                    to="/upload"
                    className={({ isActive }) =>
                      `sidebar-link ${isActive ? 'active' : ''}`
                    }
                  >
                    <Upload size={18} />
                    <span>Upload</span>
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/my-videos"
                    className={({ isActive }) =>
                      `sidebar-link ${isActive ? 'active' : ''}`
                    }
                  >
                    <Video size={18} />
                    <span>My Videos</span>
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/history"
                    className={({ isActive }) =>
                      `sidebar-link ${isActive ? 'active' : ''}`
                    }
                  >
                    <Clock size={18} />
                    <span>History</span>
                  </NavLink>
                </li>
              </ul>
            </div>
          )}
        </nav>
      </div>

      {!isAuthenticated && (
        <div className="border-t border-neutral-800 p-4">
          <div className="mb-2 text-sm text-neutral-400">
            Sign in to upload videos and track your content.
          </div>
          <NavLink
            to="/login"
            className="flex items-center gap-2 rounded-md bg-transparent px-4 py-2 text-sm font-medium text-primary-400 transition-colors hover:bg-primary-600/10"
          >
            <LogIn size={18} />
            <span>Sign In</span>
          </NavLink>
        </div>
      )}
    </div>
  );
};

export default Sidebar;