"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/layout/Container";
import { Logo } from "./Logo";
import { Menu, X, Search, LogOut, BookOpen, User, LayoutDashboard, TrendingUp } from "lucide-react";
import { useSession, signOut } from "next-auth/react";
// import { cn } from "@/lib/utils"; // Not used but could be kept
import { LoginModal } from "@/components/auth/LoginModal";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { data: session } = useSession();
  const pathname = usePathname();
  const router = useRouter(); // Added router

  const toggleMenu = () => setIsOpen(!isOpen);
  const openLoginModal = () => setIsLoginModalOpen(true);
  const closeLoginModal = () => setIsLoginModalOpen(false);

  const getLinkClass = (path: string) => {
    const isActive = pathname === path;
    return `text-sm font-medium transition-all px-4 py-2 rounded-full ${isActive
      ? "bg-primary/20 text-primary font-bold shadow-[0_0_10px_rgba(var(--primary),0.3)]"
      : "text-gray-300 hover:text-white hover:bg-white/5"
      }`;
  };

  const getMobileLinkClass = (path: string) => {
    const isActive = pathname === path;
    return `flex items-center w-full px-4 py-3 text-base font-medium transition-colors rounded-lg ${isActive
      ? "bg-primary/10 text-primary border-l-4 border-primary"
      : "text-gray-300 hover:text-white hover:bg-white/5"
      }`;
  };

  return (
    <>
      <nav className="fixed top-0 z-50 w-full border-b border-muted bg-background/80 backdrop-blur-md">
        <Container className="flex h-16 items-center gap-6">
          {/* Logo */}
          {/* Logo */}
          <div className="flex-shrink-0">
            <Logo />
          </div>

          {/* Search Input - Desktop */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const term = (e.currentTarget.elements.namedItem('search') as HTMLInputElement).value;
              if (term) router.push(`/courses?search=${encodeURIComponent(term)}`);
            }}
            className="hidden md:flex relative w-[300px] lg:w-[400px]"
          >
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
              <Search size={18} />
            </div>
            <input
              name="search"
              type="text"
              placeholder="¿Qué quieres aprender?"
              className="w-full bg-[#1e2330] border border-gray-700 text-gray-200 text-sm rounded-md py-2 pl-10 pr-4 placeholder-gray-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
            />
          </form>

          {/* Desktop Menu - Right Aligned */}
          <div className="hidden md:flex items-center gap-6 ml-auto">
            <div className="flex items-center gap-6">
              <Link
                href="/courses"
                className={getLinkClass("/courses")}
              >
                Cursos
              </Link>
              <Link
                href="/pricing"
                className={getLinkClass("/pricing")}
              >
                Precios
              </Link>
              <Link
                href="/about"
                className={getLinkClass("/about")}
              >
                Nosotros
              </Link>
            </div>
            {session?.user ? (
              <div className="relative">
                <button onClick={() => setIsUserMenuOpen(!isUserMenuOpen)} className="flex items-center gap-2 focus:outline-none">
                  <img src={session.user.image || `https://ui-avatars.com/api/?name=${session.user.name}&background=random`} alt="User" className="w-9 h-9 rounded-full border border-gray-700" />
                </button>

                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-[#1F2937] border border-gray-700 rounded-lg shadow-xl overflow-hidden py-1 z-50">
                    <div className="px-4 py-3 border-b border-gray-700">
                      <p className="text-sm text-white font-medium truncate">{session.user.name}</p>
                      <p className="text-xs text-gray-400 truncate">{session.user.email}</p>
                    </div>
                    {session.user.role === 'ADMIN' && (
                      <Link href="/admin" className="flex items-center gap-2 px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition-colors">
                        <LayoutDashboard size={16} />
                        Administración
                      </Link>
                    )}
                    {session && session.user.role !== 'ADMIN' && (
                      <Link href="/dashboard/courses" className="flex items-center gap-2 px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition-colors">
                        <BookOpen size={16} />
                        Mis Cursos
                      </Link>
                    )}
                    <button onClick={() => signOut()} className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-400 hover:bg-gray-800 transition-colors">
                      <LogOut size={16} />
                      Cerrar sesión
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Button variant="default" onClick={openLoginModal} className="bg-primary hover:bg-primary/90 text-white font-bold rounded-full shadow-md shiny-hover px-6">
                Acceder
              </Button>
            )}
          </div>

          {/* Mobile Hamburger Button (Right aligned on mobile) */}
          <div className="flex items-center md:hidden ml-auto">
            <button
              onClick={toggleMenu}
              className="text-gray-300 hover:text-white focus:outline-none"
              aria-label="Toggle menu"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </Container>

        {/* Mobile Menu Overlay */}
        {isOpen && (
          <div className="fixed inset-0 z-40 bg-[#0B0F19]/95 backdrop-blur-xl md:hidden animate-in fade-in slide-in-from-top-5 duration-300">
            <div className="flex flex-col h-full pt-20 px-6 pb-8 overflow-y-auto">
              {/* Mobile Search - Prominent */}
              <div className="relative w-full mb-8">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                  <Search size={20} />
                </div>
                <input
                  type="text"
                  placeholder="¿Qué quieres aprender hoy?"
                  className="w-full bg-white/5 border border-white/10 text-white text-lg rounded-2xl py-4 pl-12 pr-4 placeholder-gray-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                />
              </div>

              {/* Main Navigation Links */}
              <div className="flex flex-col space-y-2 mb-8">
                <Link
                  href="/courses"
                  className={getMobileLinkClass("/courses")}
                  onClick={toggleMenu}
                >
                  <BookOpen className="mr-4 text-gray-500" size={24} />
                  <span className="text-xl font-bold">Cursos</span>
                </Link>
                <Link
                  href="/pricing"
                  className={getMobileLinkClass("/pricing")}
                  onClick={toggleMenu}
                >
                  <TrendingUp className="mr-4 text-gray-500" size={24} />
                  <span className="text-xl font-bold">Precios</span>
                </Link>
                <Link
                  href="/about"
                  className={getMobileLinkClass("/about")}
                  onClick={toggleMenu}
                >
                  <User className="mr-4 text-gray-500" size={24} />
                  <span className="text-xl font-bold">Nosotros</span>
                </Link>
              </div>

              {/* User Session / Auth */}
              <div className="mt-auto">
                {session ? (
                  <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
                    <div className="flex items-center gap-4 mb-4">
                      <img src={session.user?.image || `https://ui-avatars.com/api/?name=${session.user?.name}&background=random`} alt="" className="w-12 h-12 rounded-full border border-gray-700" />
                      <div>
                        <p className="text-white font-bold text-lg">{session.user?.name}</p>
                        <p className="text-sm text-gray-400">{session.user?.email}</p>
                      </div>
                    </div>
                    <Link href={session.user.role === 'ADMIN' ? "/admin" : "/dashboard/courses"} className="w-full flex items-center justify-center gap-2 bg-[#5D5CDE] text-white py-3 rounded-xl font-bold mb-3 hover:bg-[#4B4AC0]" onClick={toggleMenu}>
                      <LayoutDashboard size={20} />
                      Ir al Dashboard
                    </Link>
                    <button onClick={() => signOut()} className="w-full flex items-center justify-center gap-2 py-3 text-red-400 hover:bg-white/5 rounded-xl font-medium transition-colors">
                      <LogOut size={20} />
                      Cerrar sesión
                    </button>
                  </div>
                ) : (
                  <Button
                    className="w-full h-14 text-lg font-bold bg-[#5D5CDE] text-white rounded-2xl shadow-lg shiny-hover"
                    onClick={() => {
                      toggleMenu();
                      openLoginModal();
                    }}
                  >
                    Acceder a la Academia
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Login Modal */}
      <LoginModal isOpen={isLoginModalOpen} onClose={closeLoginModal} />
    </>
  );
}

