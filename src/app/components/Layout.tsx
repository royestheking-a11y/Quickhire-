import React from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router';
import { Instagram, Facebook, Twitter, Linkedin, Dribbble, User as UserIcon, LogOut, ChevronDown } from 'lucide-react';
import { ScrollToTop } from './ScrollToTop';
import { Toaster, toast } from 'sonner';
import { getCurrentUser, logout } from '../store';

export function Layout() {
  const navigate = useNavigate();
  const location = useLocation();

  const isAuthPage = location.pathname === '/login' || location.pathname === '/signup';
  const isAdminPage = location.pathname.startsWith('/admin');
  const user = getCurrentUser();

  const handleLogout = () => {
    logout();
    navigate('/login');
    toast.success("Logged out successfully");
  };

  // Do not render normal header/footer on admin page
  if (isAdminPage) {
    return (
      <>
        <ScrollToTop />
        <Outlet />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-white font-['Epilogue',sans-serif] text-[#25324b] flex flex-col">
      <ScrollToTop />
      <Toaster position="top-right" richColors />
      {/* Navbar */}
      <nav className="relative z-10 flex items-center justify-between px-6 py-6 lg:px-[124px] lg:py-8 bg-[#f8f8fd]">
        <div className="flex items-center gap-12">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#4640DE] flex items-center justify-center">
              <div className="w-4 h-4 bg-white rounded-full relative">
                <div className="absolute bottom-0 right-0 w-2 h-2 bg-[#4640DE] rounded-full translate-x-1/4 translate-y-1/4"></div>
              </div>
            </div>
            <span className="font-['Red_Hat_Display'] font-bold text-2xl tracking-tight">QuickHire</span>
          </Link>
          {!isAuthPage && (
            <div className="hidden lg:flex items-center gap-8 text-[#515b6f] font-medium">
              <Link to="/jobs" className="hover:text-[#4640DE] transition-colors">Find Jobs</Link>
              <Link to="/companies" className="hover:text-[#4640DE] transition-colors">Browse Companies</Link>
            </div>
          )}
        </div>
        {!isAuthPage && (
          <div className="hidden lg:flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-6">
                <Link to="/profile" className="flex items-center gap-3 group">
                  <div className="w-10 h-10 rounded-full bg-[#4640DE] flex items-center justify-center text-white font-bold group-hover:scale-105 transition-transform">
                    {user.name.charAt(0)}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-[#25324b] leading-none group-hover:text-[#4640DE] transition-colors">{user.name}</span>
                    <span className="text-[10px] text-[#7c8493] font-bold uppercase tracking-wider">My Profile</span>
                  </div>
                </Link>
                <div className="w-px h-8 bg-[#D6DDEB]"></div>
                <button
                  onClick={handleLogout}
                  className="p-2 hover:bg-red-50 text-[#7c8493] hover:text-red-500 rounded-lg transition-all"
                  title="Logout"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <>
                <Link to="/login" className="font-bold text-[#4640DE] px-6 py-3 hover:bg-[#4640DE]/5 transition-colors rounded">Login</Link>
                <div className="w-px h-12 bg-[#D6DDEB]"></div>
                <Link to="/signup" className="font-bold text-white bg-[#4640DE] px-6 py-3 rounded hover:bg-[#4640DE]/90 transition-colors">Sign Up</Link>
              </>
            )}
          </div>
        )}
      </nav>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        <Outlet />
      </div>

      {/* Footer */}
      {!isAuthPage && (
        <footer className="bg-[#202430] py-16 px-6 lg:px-[124px] text-white mt-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
            <div className="lg:col-span-2 flex flex-col gap-6">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center">
                  <div className="w-4 h-4 bg-[#4640DE] rounded-full relative">
                    <div className="absolute bottom-0 right-0 w-2 h-2 bg-white rounded-full translate-x-1/4 translate-y-1/4"></div>
                  </div>
                </div>
                <span className="font-['Red_Hat_Display'] font-bold text-2xl tracking-tight text-white">QuickHire</span>
              </div>
              <p className="text-[#D6DDEB] opacity-70 leading-relaxed max-w-sm">
                Great platform for the job seeker that passionate about startups. Find your dream job easier.
              </p>
            </div>

            <div className="flex flex-col gap-6">
              <h4 className="font-semibold text-lg">About</h4>
              <div className="flex flex-col gap-4 text-[#D6DDEB] opacity-70">
                <a href="#" className="hover:text-white hover:opacity-100 transition-all">Companies</a>
                <a href="#" className="hover:text-white hover:opacity-100 transition-all">Pricing</a>
                <a href="#" className="hover:text-white hover:opacity-100 transition-all">Terms</a>
                <a href="#" className="hover:text-white hover:opacity-100 transition-all">Advice</a>
                <a href="#" className="hover:text-white hover:opacity-100 transition-all">Privacy Policy</a>
              </div>
            </div>

            <div className="flex flex-col gap-6">
              <h4 className="font-semibold text-lg">Resources</h4>
              <div className="flex flex-col gap-4 text-[#D6DDEB] opacity-70">
                <a href="#" className="hover:text-white hover:opacity-100 transition-all">Help Docs</a>
                <a href="#" className="hover:text-white hover:opacity-100 transition-all">Guide</a>
                <a href="#" className="hover:text-white hover:opacity-100 transition-all">Updates</a>
                <a href="#" className="hover:text-white hover:opacity-100 transition-all">Contact Us</a>
              </div>
            </div>

            <div className="flex flex-col gap-6">
              <h4 className="font-semibold text-lg">Get job notifications</h4>
              <p className="text-[#D6DDEB] opacity-70 mb-2">
                The latest job news, articles, sent to your inbox weekly.
              </p>
              <div className="flex flex-col gap-4">
                <input
                  type="email"
                  placeholder="Email Address"
                  className="w-full bg-white text-[#25324b] px-4 py-3 rounded outline-none"
                />
                <button className="bg-[#4640DE] text-white font-bold px-6 py-3 rounded hover:bg-[#4640DE]/90 transition-colors w-max">
                  Subscribe
                </button>
              </div>
            </div>
          </div>

          <div className="border-t border-[#515b6f] opacity-50 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm">2026 © QuickHire. All rights reserved.</p>
            <div className="flex gap-4 items-center">
              <a href="#" aria-label="Facebook" className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center cursor-pointer hover:bg-[#4640DE] transition-colors group">
                <Facebook className="w-4 h-4 text-white group-hover:text-white" />
              </a>
              <a href="#" aria-label="Instagram" className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center cursor-pointer hover:bg-[#4640DE] transition-colors group">
                <Instagram className="w-4 h-4 text-white group-hover:text-white" />
              </a>
              <a href="#" aria-label="Dribbble" className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center cursor-pointer hover:bg-[#4640DE] transition-colors group">
                <Dribbble className="w-4 h-4 text-white group-hover:text-white" />
              </a>
              <a href="#" aria-label="LinkedIn" className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center cursor-pointer hover:bg-[#4640DE] transition-colors group">
                <Linkedin className="w-4 h-4 text-white group-hover:text-white" />
              </a>
              <a href="#" aria-label="Twitter" className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center cursor-pointer hover:bg-[#4640DE] transition-colors group">
                <Twitter className="w-4 h-4 text-white group-hover:text-white" />
              </a>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}
