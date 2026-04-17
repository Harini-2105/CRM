import * as React from 'react';
import { Button, Input, Card, Badge, Avatar } from '../components/UI';
import { motion } from 'motion/react';
import { Sparkles, ShieldCheck, Zap, ArrowRight, CircleCheck } from 'lucide-react';
import { useNavigate, Navigate } from 'react-router-dom';
import { OzofiLogo } from '../components/Logo';
import { useAuth } from '../contexts/AuthContext';

export default function Login() {
  const navigate = useNavigate();
  const { signIn, user, loading } = useAuth();
  const [authError, setAuthError] = React.useState<string | null>(null);

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleGoogleSignIn = async () => {
    try {
      setAuthError(null);
      await signIn();
      navigate('/dashboard');
    } catch (error) {
      console.error('Sign in failed:', error);
      setAuthError('Authentication failed. Please try again.');
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would be email/password auth
    // For this demo, we'll just show the Google option
    handleGoogleSignIn();
  };

  return (
    <div className="min-h-screen flex bg-surface">
      {/* Left Pane - Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 sm:px-12 md:px-24 xl:px-48 bg-surface z-10">
        <div className="max-w-md w-full mx-auto">
          <div className="flex items-center gap-3 mb-12">
            <OzofiLogo size={42} />
            <span className="font-display font-bold text-3xl tracking-tight text-text-strong italic">ozofi</span>
          </div>

          <div className="space-y-2 mb-8">
            <h1 className="text-4xl font-display font-bold">Welcome back</h1>
            <p className="text-text-secondary">Enter your credentials to access your account.</p>
          </div>

          {authError && (
            <div className="mb-6 p-4 bg-danger/10 border border-danger/20 rounded-xl text-danger text-sm font-bold">
              {authError}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1">
              <label className="text-sm font-semibold text-text-strong">Work Email</label>
              <Input type="email" placeholder="name@company.com" required />
            </div>
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-sm font-semibold text-text-strong">Password</label>
                <button type="button" className="text-xs font-bold text-primary hover:underline">Forgot password?</button>
              </div>
              <Input type="password" placeholder="••••••••" required />
            </div>

            <div className="flex items-center gap-2 pt-2">
              <input type="checkbox" id="remember" className="rounded border-border text-primary focus:ring-primary" />
              <label htmlFor="remember" className="text-sm text-text-secondary cursor-pointer">Remember me for 30 days</label>
            </div>

            <Button type="submit" className="w-full h-11 text-base font-bold" disabled={loading}>
              {loading ? 'Processing...' : 'Sign In'}
            </Button>
          </form>

          <div className="mt-8 relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-surface px-4 text-text-secondary font-bold tracking-widest">Or continue with</span>
            </div>
          </div>

          <div className="mt-6 flex gap-4">
            <Button 
              variant="outline" 
              className="flex-1 h-11 gap-2 font-bold"
              onClick={handleGoogleSignIn}
              disabled={loading}
            >
              <img src="https://www.google.com/favicon.ico" alt="Google" className="w-4 h-4" />
              Google
            </Button>
            <Button variant="outline" className="flex-1 h-11 gap-2 font-bold disabled:opacity-30" disabled>
              <img src="https://github.com/favicon.ico" alt="GitHub" className="w-4 h-4" />
              GitHub
            </Button>
          </div>

          <p className="mt-8 text-center text-sm text-text-secondary">
            Don't have an account? <button className="font-bold text-primary hover:underline">Get started for free</button>
          </p>
        </div>
      </div>

      {/* Right Pane - Visuals */}
      <div className="hidden lg:flex w-1/2 bg-muted-surface p-12 relative overflow-hidden flex-col justify-between">
        {/* Background Decorative Elements */}
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl -mr-64 -mt-64" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-accent/5 rounded-full blur-3xl -ml-32 -mb-32" />

        <div className="relative z-10">
          <Badge variant="primary" className="mb-6 py-1 px-3 gap-2 border-primary/20 bg-primary/10">
            <Sparkles size={14} className="fill-primary" /> 
            Now with AI-Powered Insights
          </Badge>
          <h2 className="text-5xl font-display font-bold text-text-strong leading-[1.1] mb-6">
            Focus on relationships,<br />leave the data to us.
          </h2>
          <p className="text-xl text-text-secondary max-w-lg mb-12 leading-relaxed">
            Ozofi is the intelligent relationship operating system built for modern teams who demand clarity, speed, and growth.
          </p>

          <div className="space-y-6">
            {[
              { icon: Zap, title: 'Real-time Pipeline Tracking', desc: 'Monitor your sales health with live kanban and analytics.' },
              { icon: Sparkles, title: 'AI-First Intelligence', desc: 'Predictive lead scoring and automated next-step suggestions.' },
              { icon: ShieldCheck, title: 'Enterprise Security', desc: 'SOC2 compliant data management for scaling organizations.' }
            ].map((feature, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + idx * 0.1 }}
                className="flex items-start gap-4 p-4 rounded-2xl bg-surface/50 backdrop-blur-sm border border-border/50 max-w-md shadow-sm"
              >
                <div className="h-10 w-10 rounded-xl bg-white shadow-sm border border-border flex items-center justify-center shrink-0">
                  <feature.icon className="text-primary" size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-text-strong text-sm">{feature.title}</h4>
                  <p className="text-xs text-text-secondary mt-0.5">{feature.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="relative z-10 p-6 rounded-2xl bg-text-strong text-white max-w-md shadow-2xl">
          <div className="flex items-center gap-1 mb-4">
             {[1,2,3,4,5].map(i => <CircleCheck key={i} size={14} className="text-success fill-success/20" />)}
          </div>
          <p className="italic text-lg mb-6 leading-relaxed font-display">
            "Ozofi converted our chaotic sales spreadsheets into a streamlined revenue engine. The AI reminders alone saved us 10+ hours a week."
          </p>
          <div className="flex items-center gap-3">
             <Avatar fallback="SC" className="border-white/20" />
             <div>
                <p className="text-sm font-bold">Sarah Chen</p>
                <p className="text-xs text-white/50">VP of Sales at Vercel</p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
