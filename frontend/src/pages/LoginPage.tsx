import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, ArrowRight, Lock, Mail, ShieldCheck } from 'lucide-react';
import { WealthOrbit } from '../components/branding/WealthOrbit';
import { BrandWordmark } from '../components/branding/BrandWordmark';
import { useAuth } from '../context/AuthContext';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !password) {
      setError('Please provide both email and password.');
      return;
    }

    try {
      setLoading(true);
      const user = await login(email.trim(), password);
      if (!user.salary || user.salary <= 0) {
        navigate('/onboarding');
      } else {
        navigate('/dashboard');
      }
    } catch (err: any) {
      setError(err?.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-screen h-screen bg-background-primary flex overflow-hidden">
      {/* Left Column: Form */}
      <div className="w-full lg:w-1/2 h-full flex flex-col justify-between p-8 sm:p-14 overflow-y-auto z-10 bg-background-primary border-r border-bronze/40">
        <div>
          <Link to="/" className="inline-block">
            <BrandWordmark variant="compact" />
          </Link>
        </div>

        <div className="max-w-md w-full mx-auto my-auto py-8">
          <div className="space-y-2 mb-8 text-left">
            <span className="font-mono text-xs uppercase tracking-widest text-champagne">
              Secure Ledger Access
            </span>
            <h2 className="text-3xl font-extrabold font-sans text-ivory tracking-tight">
              Sign In to DHANLEKHA
            </h2>
            <p className="text-xs text-typography-secondary font-sans">
              Access your personal wealth records and expense command centre.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 text-left">
            {error && (
              <div className="p-3.5 rounded-xl bg-danger/10 border border-danger/25 text-danger text-xs font-mono">
                {error}
              </div>
            )}

            {/* Email Field */}
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-typography-secondary mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-typography-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  placeholder="name@dhanlekha.in"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-surface border border-bronze/60 text-ivory text-sm focus:outline-none focus:border-champagne/60 focus:ring-1 focus:ring-champagne/40 transition-all placeholder:text-typography-muted/40 font-sans"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-typography-secondary mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-typography-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-11 py-3 rounded-xl bg-surface border border-bronze/60 text-ivory text-sm focus:outline-none focus:border-champagne/60 focus:ring-1 focus:ring-champagne/40 transition-all placeholder:text-typography-muted/40 font-sans"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-typography-muted hover:text-champagne transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-champagne to-amber text-background-primary text-xs font-mono font-bold uppercase tracking-[0.18em] hover:opacity-95 transition-all shadow-golden-glow disabled:opacity-50 flex items-center justify-center gap-2 mt-6"
            >
              <span>{loading ? 'Authenticating...' : 'Enter Command Centre'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-bronze/40 text-center text-xs text-typography-secondary font-sans">
            Don't have an account?{' '}
            <Link to="/signup" className="text-champagne font-semibold hover:underline">
              Create sovereign account
            </Link>
          </div>
        </div>

        <div className="text-[11px] font-mono text-typography-muted flex items-center gap-2">
          <ShieldCheck className="w-3.5 h-3.5 text-champagne" />
          <span>Encrypted with BCrypt & Server-Side HTTP Sessions</span>
        </div>
      </div>

      {/* Right Column: Sculptural Golden Visual */}
      <div className="hidden lg:flex lg:w-1/2 h-full bg-background-secondary relative items-center justify-center p-12 overflow-hidden">
        {/* Warm Amber Radial Illumination */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(229,169,75,0.12)_0%,rgba(214,183,122,0.03)_50%,transparent_70%)]" />

        <div className="relative z-10 w-full max-w-lg flex flex-col items-center text-center space-y-6">
          <div className="w-80 h-80">
            <WealthOrbit size="compact" />
          </div>

          <div className="space-y-3">
            <h3 className="font-devanagari text-2xl font-bold text-champagne">
              सत्यं वद, धर्मं चर — धनस्य रक्षणम्
            </h3>
            <p className="font-sans text-xs text-typography-secondary max-w-sm mx-auto leading-relaxed">
              True financial stewardship begins with awareness. Every rupee tracked in DHANLEKHA clarifies your economic trajectory.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
