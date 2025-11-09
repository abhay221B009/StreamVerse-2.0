import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Play, LogIn, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await login(email, password);
      navigate("/");
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Header */}
      <header className="flex h-16 items-center border-b border-neutral-800 px-4">
        <Link to="/" className="flex items-center gap-2">
          <span className="text-xl font-bold text-white">
            Stream<span className="text-primary-500">Verse</span>
          </span>
        </Link>
      </header>

      {/* Main content */}
      <div className="flex flex-1 items-center justify-center">
        <div className="grid w-full max-w-4xl grid-cols-1 rounded-2xl bg-background-light shadow-xl md:grid-cols-2">
          {/* Left side - Form */}
          <div className="p-8 md:p-12">
            <div className="mb-8">
              <h1 className="text-2xl font-bold md:text-3xl">Welcome Back</h1>
              <p className="mt-2 text-neutral-400">
                Sign in to continue watching your favorite videos
              </p>
            </div>

            {error && (
              <div className="mb-6 flex items-center gap-2 rounded-md bg-red-900/20 p-3 text-red-400">
                <AlertCircle size={18} />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label
                  htmlFor="email"
                  className="mb-1.5 block text-sm font-medium"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input w-full"
                  placeholder="Enter your email"
                />
              </div>

              <div className="mb-6">
                <label
                  htmlFor="password"
                  className="mb-1.5 block text-sm font-medium"
                >
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input w-full"
                  placeholder="Enter your password"
                />
              </div>

              <motion.button
                type="submit"
                className="btn btn-primary w-full"
                disabled={isLoading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Signing in...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <LogIn size={18} />
                    Sign In
                  </span>
                )}
              </motion.button>

              <p className="mt-4 text-center text-sm text-neutral-400">
                Don't have an account?{" "}
                <Link
                  to="/signup"
                  className="font-medium text-primary-400 hover:text-primary-300"
                >
                  Sign up
                </Link>
              </p>
            </form>
          </div>

          {/* Right side - Image */}
          <div className="hidden bg-gradient-to-br from-primary-900 to-background p-12 md:block">
            <div className="flex h-full flex-col items-center justify-center text-center">
              <div className="mb-8 rounded-full bg-primary-500/20 p-6">
                <Play size={48} className="text-primary-400" />
              </div>
              <h2 className="mb-4 text-2xl font-bold">
                Watch unlimited videos anytime, anywhere
              </h2>
              <p className="text-neutral-300">
                Join millions of viewers and enjoy the best streaming experience
                with StreamVerse
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
