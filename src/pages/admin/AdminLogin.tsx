import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { DiamondIcon } from '../../components/DiamondIcon';
import { Eye, EyeOff, Lock, Mail, AlertCircle } from 'lucide-react';

export default function AdminLogin() {
  const navigate = useNavigate();
  const { signIn } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await signIn(email, password);
      navigate('/admin');
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Invalid credentials. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0d0d0d] flex items-center justify-center px-4 font-['Jost',sans-serif]">
      {/* Background subtle grid */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      <div className="relative w-full max-w-md">
        {/* Top accent line */}
        <div className="h-px w-full bg-gradient-to-r from-transparent via-amber-400/60 to-transparent mb-8" />

        {/* Card */}
        <div className="bg-[#181818] border border-neutral-800 p-8 sm:p-10 shadow-2xl">
          {/* Logo area */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-3">
              <DiamondIcon className="w-4 h-4 text-amber-400" />
              <span className="text-[10px] tracking-[0.4em] text-amber-400 uppercase font-semibold">
                Admin Portal
              </span>
              <DiamondIcon className="w-4 h-4 text-amber-400" />
            </div>
            <h1 className="text-2xl font-bold tracking-[0.15em] text-white uppercase font-['Montserrat',sans-serif]">
              Azii Jewels
            </h1>
            <p className="text-neutral-500 text-xs mt-2 tracking-wider">
              Management Dashboard
            </p>
          </div>

          {/* Error message */}
          {error && (
            <div className="flex items-start gap-2.5 bg-red-500/10 border border-red-500/30 rounded px-4 py-3 mb-6">
              <AlertCircle className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
              <p className="text-red-400 text-xs leading-relaxed">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-[10px] tracking-[0.2em] text-neutral-400 uppercase mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-600" />
                <input
                  id="admin-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="admin@example.com"
                  className="w-full bg-[#121212] border border-neutral-700 text-white text-sm pl-10 pr-4 py-3 outline-none focus:border-amber-400/60 transition-colors placeholder:text-neutral-600 rounded-none"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-[10px] tracking-[0.2em] text-neutral-400 uppercase mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-600" />
                <input
                  id="admin-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full bg-[#121212] border border-neutral-700 text-white text-sm pl-10 pr-12 py-3 outline-none focus:border-amber-400/60 transition-colors placeholder:text-neutral-600 rounded-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-600 hover:text-neutral-400 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              id="admin-login-btn"
              type="submit"
              disabled={loading}
              className="w-full mt-2 bg-amber-400 text-black text-xs font-bold tracking-[0.25em] uppercase py-3.5 hover:bg-amber-300 active:bg-amber-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin w-3.5 h-3.5"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>
                  Authenticating...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          <p className="text-center text-neutral-700 text-[10px] mt-8 tracking-wider">
            Restricted access — authorized personnel only
          </p>
        </div>

        <div className="h-px w-full bg-gradient-to-r from-transparent via-amber-400/60 to-transparent mt-8" />
      </div>
    </div>
  );
}
