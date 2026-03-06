import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router';
import { Mail, Lock, ArrowRight, User, CheckCircle, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { login, register } from '../store';
import { toast } from 'sonner';
import * as assets from '../assets';

export function Auth() {
  const navigate = useNavigate();
  const location = useLocation();
  const isLogin = location.pathname === '/login';

  const [email, setEmail] = useState(isLogin ? 'admin@quickhire.com' : '');
  const [password, setPassword] = useState(isLogin ? 'admin123' : '');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      if (isLogin) {
        const res = await login({ email, password });
        toast.success(`Welcome back, ${res.user.name}!`);
        if (res.user.role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/');
        }
      } else {
        await register({ email, name, password });
        setSuccess('Registration successful! You can now log in.');
        toast.success('Account created successfully');
        // Clear inputs
        setName('');
        setEmail('');
        setPassword('');
        // Switch to login after a delay
        setTimeout(() => navigate('/login'), 2000);
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
      toast.error(err.message || 'Operation failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-[#f8f8fd] font-['Epilogue',sans-serif]">
      {/* Hero Section */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#4640DE] p-12 flex-col justify-between text-white relative overflow-hidden">
        {/* Abstract Background Shapes */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#26a4ff]/20 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl"></div>

        <div className="relative z-10">
          <Link to="/" className="flex items-center gap-2 mb-16">
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
              <div className="w-5 h-5 bg-[#4640DE] rounded-full relative">
                <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-white rounded-full translate-x-1/4 translate-y-1/4"></div>
              </div>
            </div>
            <span className="font-['Red_Hat_Display'] font-bold text-3xl tracking-tight">QuickHire</span>
          </Link>

          <div className="max-w-md">
            <h1 className="font-['Clash_Display',sans-serif] text-5xl font-bold mb-8 leading-[1.1]">
              Find your <span className="text-[#26a4ff]">dream job</span> with QuickHire.
            </h1>
            <p className="text-blue-100 text-xl leading-relaxed mb-12 opacity-80">
              Join the ecosystem of elite professionals and top-tier companies. Your next career milestone is just one click away.
            </p>

            <div className="space-y-6">
              {[
                { title: "Curated Jobs", desc: "Hand-picked opportunities from the world's most innovative companies." },
                { title: "One-Click Apply", desc: "Our streamlined application process makes job hunting effortless." },
                { title: "Career Insights", desc: "Gain deep visibility into market trends and company cultures." }
              ].map((feature, i) => (
                <div key={i} className="flex gap-4 items-start p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all cursor-default group">
                  <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <CheckCircle className="w-5 h-5 text-[#26a4ff]" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-1">{feature.title}</h3>
                    <p className="text-sm text-blue-100 opacity-70">{feature.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="relative z-10 bottom-0 left-0 mt-20 opacity-60">
          <p className="text-sm">© 2026 QuickHire. All rights reserved.</p>
        </div>
      </div>

      {/* Right Form Section */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-24 bg-white">
        <div className="w-full max-w-md animate-in fade-in slide-in-from-right-4 duration-500">
          <div className="mb-10 lg:hidden">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[#4640DE] flex items-center justify-center">
                <div className="w-4 h-4 bg-white rounded-full relative">
                  <div className="absolute bottom-0 right-0 w-2 h-2 bg-[#4640DE] rounded-full translate-x-1/4 translate-y-1/4"></div>
                </div>
              </div>
              <span className="font-['Red_Hat_Display'] font-bold text-2xl tracking-tight text-[#25324b]">QuickHire</span>
            </Link>
          </div>

          <div className="mb-10 text-center lg:text-left">
            <h2 className="font-['Clash_Display',sans-serif] text-4xl font-bold text-[#25324b] mb-3">
              {isLogin ? 'Welcome Back!' : 'Get Started Now'}
            </h2>
            <p className="text-[#515b6f] text-lg">
              {isLogin
                ? 'Don\'t have an account?'
                : 'Already have an account?'}
              <Link
                to={isLogin ? '/signup' : '/login'}
                className="text-[#4640DE] font-bold ml-2 hover:underline"
              >
                {isLogin ? 'Sign up' : 'Log in'}
              </Link>
            </p>
          </div>

          {error && (
            <div className="mb-8 p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl flex items-center gap-3 text-sm font-medium animate-in shake duration-300">
              <AlertCircle className="w-5 h-5 text-red-500" />
              {error}
            </div>
          )}

          {success && (
            <div className="mb-8 p-4 bg-green-50 border border-green-100 text-green-600 rounded-xl flex items-center gap-3 text-sm font-medium animate-in fade-in duration-300">
              <CheckCircle className="w-5 h-5 text-green-500" />
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {!isLogin && (
              <div className="space-y-2">
                <label className="text-sm font-bold text-[#25324b] ml-1 flex items-center gap-2">
                  <User className="w-4 h-4 text-[#4640DE]" /> Full Name
                </label>
                <input
                  type="text" required
                  value={name} onChange={e => setName(e.target.value)}
                  className="w-full bg-[#f8f8fd] border border-[#D6DDEB] p-4 rounded-xl text-[#25324b] outline-none focus:bg-white focus:border-[#4640DE] focus:ring-4 focus:ring-[#4640DE]/10 transition-all font-medium"
                  placeholder="Jane Doe"
                />
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-bold text-[#25324b] ml-1 flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#4640DE]" /> Email Address
              </label>
              <input
                type="email" required
                value={email} onChange={e => setEmail(e.target.value)}
                className="w-full bg-[#f8f8fd] border border-[#D6DDEB] p-4 rounded-xl text-[#25324b] outline-none focus:bg-white focus:border-[#4640DE] focus:ring-4 focus:ring-[#4640DE]/10 transition-all font-medium"
                placeholder="jane@example.com"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center ml-1">
                <label className="text-sm font-bold text-[#25324b] flex items-center gap-2">
                  <Lock className="w-4 h-4 text-[#4640DE]" /> Password
                </label>
                {isLogin && <a href="#" className="text-xs font-bold text-[#4640DE] hover:underline">Forgot?</a>}
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password} onChange={e => setPassword(e.target.value)}
                  className="w-full bg-[#f8f8fd] border border-[#D6DDEB] p-4 pr-12 rounded-xl text-[#25324b] outline-none focus:bg-white focus:border-[#4640DE] focus:ring-4 focus:ring-[#4640DE]/10 transition-all font-medium"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#7c8493] hover:text-[#4640DE] transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#4640DE] text-white font-bold py-5 rounded-2xl hover:bg-[#4640DE]/90 disabled:opacity-70 transition-all shadow-xl shadow-[#4640DE]/20 flex items-center justify-center gap-3 text-lg mt-8"
            >
              {loading ? (
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  {isLogin ? 'Log In' : 'Sign Up'} <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>

            {isLogin && (
              <div className="mt-6 p-4 bg-[#f8f8fd] border border-[#D6DDEB] rounded-xl text-center">
                <p className="text-xs font-bold text-[#717182] uppercase tracking-wider mb-2">Admin Demo Credentials</p>
                <code className="text-[#4640DE] font-bold text-sm bg-white px-3 py-1.5 rounded-lg border border-[#D6DDEB]">
                  admin@quickhire.com / admin123
                </code>
              </div>
            )}
          </form>

          <div className="mt-10 pt-10 border-t border-[#D6DDEB] text-center">
            <p className="text-[#515b6f] text-sm mb-6">Or continue with</p>
            <div className="grid grid-cols-2 gap-4">
              <button className="flex items-center justify-center gap-3 bg-white border border-[#D6DDEB] p-4 rounded-xl hover:bg-[#f8f8fd] transition-all font-bold text-[#25324b]">
                <img src="https://www.google.com/favicon.ico" className="w-5 h-5" alt="Google" /> Google
              </button>
              <button className="flex items-center justify-center gap-3 bg-white border border-[#D6DDEB] p-4 rounded-xl hover:bg-[#f8f8fd] transition-all font-bold text-[#25324b]">
                <img src="https://github.com/favicon.ico" className="w-5 h-5" alt="Github" /> GitHub
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
