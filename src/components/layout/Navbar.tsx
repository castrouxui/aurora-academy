"use client";

import { useState, useRef, useEffect } from "react"; // Added hooks
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/layout/Container";
import { Logo } from "./Logo";
import { Menu, X, Search, LogOut, BookOpen, User, LayoutDashboard, TrendingUp, ChevronDown, Building2, GraduationCap, PlayCircle, FileText, Lock } from "lucide-react"; // Added icons
import { useSession, signOut } from "next-auth/react";
// import { cn } from "@/lib/utils"; 
import { LoginModal } from "@/components/auth/LoginModal";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  // Mega Menu State
  const [isStudentsMenuOpen, setIsStudentsMenuOpen] = useState(false);
  const studentMenuTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const { data: session } = useSession();
  const pathname = usePathname();
  const router = useRouter();

  const toggleMenu = () => setIsOpen(!isOpen);
  const openLoginModal = () => setIsLoginModalOpen(true);
  const closeLoginModal = () => setIsLoginModalOpen(false);

  // Handlers for Mega Menu Hover
  const handleStudentsEnter = () => {
    if (studentMenuTimeoutRef.current) clearTimeout(studentMenuTimeoutRef.current);
    setIsStudentsMenuOpen(true);
  };

  const handleStudentsLeave = () => {
    studentMenuTimeoutRef.current = setTimeout(() => {
      setIsStudentsMenuOpen(false);
    }, 150);
  };

  const getLinkClass = (path: string) => {
    const isActive = pathname === path;
    return `text-sm font-medium transition-all px-4 py-2 rounded-full flex items-center gap-1 ${isActive
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
        <Container className="flex h-16 items-center gap-6 justify-between">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Logo />
          </div>

          {/* Desktop Navigation - Centered Mega Menu */}
          <div className="hidden md:flex items-center gap-2">

            {/* Para Estudiantes - MEGA MENU */}
            <div
              className="relative"
              onMouseEnter={handleStudentsEnter}
              onMouseLeave={handleStudentsLeave}
            >
              <button
                className={`text-sm font-medium transition-all px-4 py-2 rounded-full flex items-center gap-1 cursor-default ${isStudentsMenuOpen ? "text-white bg-white/5" : "text-gray-300 hover:text-white hover:bg-white/5"}`}
              >
                Para Estudiantes
                <ChevronDown size={14} className={`transition-transform duration-200 ${isStudentsMenuOpen ? "rotate-180" : ""}`} />
              </button>

              {/* Dropdown Content */}
              {/* Dropdown Content */}
              {isStudentsMenuOpen && (
                <div className="absolute top-full left-0 w-[650px] -translate-x-[100px] pt-4">
                  <div className="bg-[#0B0F19]/95 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden grid grid-cols-[1.5fr_1fr] animate-in fade-in zoom-in-95 duration-200">

                    {/* Left Column: Categorías (Primary) */}
                    <div className="p-6 space-y-6 relative">
                      {/* Subtle Gradient Glow */}
                      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-[#5D5CDE]/5 via-transparent to-transparent pointer-events-none" />

                      <div className="flex items-center justify-between relative z-10">
                        <h4 className="text-white font-bold text-xs uppercase tracking-[0.2em] flex items-center gap-2 text-gray-400">
                          <GraduationCap size={14} className="text-[#5D5CDE]" />
                          Categorías
                        </h4>
                        <span className="text-[10px] bg-[#5D5CDE]/10 text-[#5D5CDE] px-2 py-0.5 rounded-full border border-[#5D5CDE]/20 font-bold tracking-wide">2026 UPDATE</span>
                      </div>

                      <div className="space-y-2 relative z-10">
                        <Link href="/courses?category=Trading" className="group flex items-start gap-4 p-4 rounded-2xl hover:bg-white/5 border border-transparent hover:border-white/5 transition-all duration-300">
                          <div className="p-2.5 rounded-xl bg-[#5D5CDE]/10 text-[#5D5CDE] group-hover:bg-[#5D5CDE] group-hover:text-white transition-all shadow-[0_0_15px_rgba(93,92,222,0.1)] group-hover:shadow-[0_0_25px_rgba(93,92,222,0.4)]">
                            <TrendingUp size={20} />
                          </div>
                          <div>
                            <p className="text-white font-bold text-base group-hover:text-[#5D5CDE] transition-colors">Trading Profesional</p>
                            <p className="text-gray-400 text-xs mt-1 leading-relaxed">Domina el análisis técnico, fundamental y la psicología del mercado.</p>
                          </div>
                        </Link>

                        <Link href="/courses?category=Criptomonedas" className="group flex items-start gap-4 p-4 rounded-2xl hover:bg-white/5 border border-transparent hover:border-white/5 transition-all duration-300">
                          <div className="p-2.5 rounded-xl bg-orange-500/10 text-orange-500 group-hover:bg-orange-500 group-hover:text-white transition-all shadow-[0_0_15px_rgba(249,115,22,0.1)] group-hover:shadow-[0_0_25px_rgba(249,115,22,0.4)]">
                            <PlayCircle size={20} />
                          </div>
                          <div>
                            <p className="text-white font-bold text-base group-hover:text-orange-500 transition-colors">Criptomonedas</p>
                            <p className="text-gray-400 text-xs mt-1 leading-relaxed">Bitcoin, DeFi, Smart Contracts y el futuro de las finanzas.</p>
                          </div>
                        </Link>
                      </div>
                    </div>

                    {/* Right Column: Recursos (Secondary) */}
                    <div className="bg-white/[0.02] border-l border-white/5 p-6 flex flex-col relative">
                      <div className="mb-6 flex items-center justify-between">
                        <h4 className="text-white font-bold text-xs uppercase tracking-[0.2em] flex items-center gap-2 text-gray-400">
                          <FileText size={14} className="text-blue-400" />
                          Recursos
                        </h4>
                      </div>

                      <div className="space-y-1 flex-1">
                        <Link href="/pricing" className="group flex items-center justify-between p-3 rounded-xl hover:bg-white/5 text-gray-300 hover:text-white transition-all">
                          <div className="flex items-center gap-3">
                            <div className="w-1.5 h-1.5 rounded-full bg-[#5D5CDE]" />
                            <span className="font-medium text-sm">Membresías</span>
                          </div>
                          <ChevronDown size={14} className="-rotate-90 opacity-0 group-hover:opacity-100 transition-all text-[#5D5CDE]" />
                        </Link>
                        <Link href="/about" className="group flex items-center justify-between p-3 rounded-xl hover:bg-white/5 text-gray-300 hover:text-white transition-all">
                          <div className="flex items-center gap-3">
                            <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                            <span className="font-medium text-sm">Sobre Nosotros</span>
                          </div>
                          <ChevronDown size={14} className="-rotate-90 opacity-0 group-hover:opacity-100 transition-all text-blue-400" />
                        </Link>
                      </div>

                      <div className="mt-auto pt-6 border-t border-white/5">
                        <div className="bg-gradient-to-r from-emerald-500/10 to-emerald-500/5 border border-emerald-500/20 rounded-xl p-4">
                          <p className="text-emerald-400 text-xs font-bold mb-1">¡Nuevo Blog!</p>
                          <p className="text-gray-400 text-[10px] mb-2">Noticias y análisis semanales.</p>
                          <span className="text-[10px] uppercase font-bold bg-emerald-500/20 text-emerald-300 px-2 py-1 rounded">Próximamente</span>
                        </div>
                      </div>
                    </div>

                  </div>
                </div>
              )}
            </div>

            {/* Para Empresas - PROXIMAMENTE */}
            <div className="relative group cursor-default">
              <button className="text-sm font-medium text-gray-500 flex items-center gap-2 px-4 py-2 cursor-default hover:text-gray-400 transition-colors">
                Para Empresas
                <span className="text-[10px] uppercase font-bold bg-white/5 text-gray-400 border border-white/10 px-2 py-0.5 rounded-full">Próximamente</span>
              </button>
            </div>

          </div>

          {/* Right Actions & Search (Desktop) */}
          <div className="hidden md:flex items-center gap-6">

            {/* Search Input - Desktop */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const term = (e.currentTarget.elements.namedItem('search') as HTMLInputElement).value;
                if (term) router.push(`/courses?search=${encodeURIComponent(term)}`);
              }}
              className="hidden lg:flex relative w-[250px]"
            >
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <Search size={14} />
              </div>
              <input
                name="search"
                type="text"
                placeholder="Buscar..."
                className="w-full bg-[#1e2330] border border-gray-700 text-gray-200 text-xs rounded-full py-2 pl-9 pr-4 placeholder-gray-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
              />
            </form>

            <div className="h-6 w-px bg-gray-800 hidden lg:block"></div>

            {session?.user ? (
              <div className="relative">
                <button onClick={() => setIsUserMenuOpen(!isUserMenuOpen)} className="flex items-center gap-3 focus:outline-none hover:bg-white/5 p-1 pr-3 rounded-full transition-colors border border-transparent hover:border-white/5">
                  <img src={session.user.image || `https://ui-avatars.com/api/?name=${session.user.name}&background=random`} alt="User" className="w-8 h-8 rounded-full border border-gray-700" />
                  <span className="text-sm font-medium text-gray-300 hidden lg:block max-w-[100px] truncate">{session.user.name?.split(' ')[0] || 'User'}</span>
                  <ChevronDown size={14} className="text-gray-500 hidden lg:block" />
                </button>

                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-3 w-56 bg-[#1F2937] border border-gray-700 rounded-xl shadow-2xl overflow-hidden py-1 z-50 animate-in fade-in zoom-in-95 duration-100">
                    <div className="px-4 py-3 border-b border-gray-700 bg-white/5">
                      <p className="text-sm text-white font-bold truncate">{session.user.name}</p>
                      <p className="text-xs text-gray-400 truncate">{session.user.email}</p>
                    </div>
                    {session.user.role === 'ADMIN' && (
                      <Link href="/admin" className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition-colors" onClick={() => setIsUserMenuOpen(false)}>
                        <LayoutDashboard size={16} />
                        Administración
                      </Link>
                    )}
                    {session && session.user.role !== 'ADMIN' && (
                      <Link href="/dashboard/courses" className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition-colors" onClick={() => setIsUserMenuOpen(false)}>
                        <BookOpen size={16} />
                        Mis Cursos
                      </Link>
                    )}
                    <div className="h-px bg-gray-700 my-1"></div>
                    <button onClick={() => signOut()} className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 transition-colors">
                      <LogOut size={16} />
                      Cerrar sesión
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Button variant="default" onClick={openLoginModal} className="bg-primary hover:bg-primary/90 text-white font-bold rounded-full shadow-lg shiny-hover px-6 h-10 text-sm">
                Acceder
              </Button>
            )}
          </div>

          {/* Mobile Hamburger Button (Right aligned on mobile) */}
          <div className="flex items-center md:hidden ml-auto gap-4">
            {/* Small Search Icon for Mobile Header maybe? No, keep it clean. */}
            {session && (
              <Link href={session.user.role === 'ADMIN' ? "/admin" : "/dashboard/courses"}>
                <img src={session.user.image || `https://ui-avatars.com/api/?name=${session.user.name}&background=random`} alt="User" className="w-8 h-8 rounded-full border border-gray-700" />
              </Link>
            )}
            <button
              onClick={toggleMenu}
              className="text-gray-300 hover:text-white focus:outline-none p-2 rounded-full hover:bg-white/5"
              aria-label="Toggle menu"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </Container>

      </nav>

      {/* Mobile Menu Overlay - Portal/Fixed Layer */}
      {isOpen && (
        <div className="fixed inset-0 z-[9999] bg-[#0B0F19] md:hidden animate-in fade-in slide-in-from-top-5 duration-200 flex flex-col">

          {/* Mobile Header (Logo + Close) */}
          <div className="flex items-center justify-between p-6 border-b border-white/5">
            <Logo />
            <button
              onClick={toggleMenu}
              className="text-gray-300 hover:text-white focus:outline-none p-2 rounded-full hover:bg-white/5"
            >
              <X size={24} />
            </button>
          </div>

          <div className="flex flex-col flex-1 px-6 py-8 overflow-y-auto">
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
            <div className="flex flex-col space-y-1 mb-8">
              <div className="pb-4 mb-4 border-b border-white/5">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Para Estudiantes</p>
                <Link
                  href="/courses"
                  className={getMobileLinkClass("/courses")}
                  onClick={toggleMenu}
                >
                  <BookOpen className="mr-4 text-[#5D5CDE]" size={24} />
                  <span className="text-xl font-bold text-white">Explorar Carreras</span>
                </Link>
                <Link
                  href="/pricing"
                  className={getMobileLinkClass("/pricing")}
                  onClick={toggleMenu}
                >
                  <TrendingUp className="mr-4 text-gray-500" size={24} />
                  <span className="text-xl font-bold text-gray-300">Precios</span>
                </Link>
              </div>

              <div className="pb-4 mb-4 border-b border-white/5 opacity-60">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Para Empresas</p>
                <div className="flex items-center gap-3 px-4 py-2">
                  <Building2 className="text-gray-600" size={24} />
                  <span className="text-lg font-bold text-gray-500">Corporativo</span>
                  <span className="text-[10px] border border-gray-600 text-gray-500 px-2 py-0.5 rounded-full ml-auto">SOON</span>
                </div>
              </div>

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

      {/* Login Modal */}
      <LoginModal isOpen={isLoginModalOpen} onClose={closeLoginModal} />
    </>
  );
}


