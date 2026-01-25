"use client";

import { useState, useRef, useEffect } from "react"; // Added hooks
import Link from "next/link";
import Image from "next/image";
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

            {/* 1. Cursos (Formerly Estudiantes) */}
            <Link href="/courses?category=all" className={getLinkClass("/courses")}>
              Cursos
            </Link>

            {/* 2. Empresas - PROXIMAMENTE */}
            <div className="relative group cursor-default">
              <button className="text-sm font-medium text-gray-500 flex items-center gap-2 px-4 py-2 cursor-default hover:text-gray-400 transition-colors">
                Empresas
                <span className="text-[10px] uppercase font-bold bg-white/5 text-gray-400 border border-white/10 px-2 py-0.5 rounded-full">Próximamente</span>
              </button>
            </div>

            {/* 3. Nosotros */}
            <Link href="/about" className={getLinkClass("/about")}>
              Nosotros
            </Link>

            {/* 4. Membresías */}
            <Link href="/pricing" className={getLinkClass("/pricing")}>
              Membresías
            </Link>
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
                  <Image src={session.user.image || `https://ui-avatars.com/api/?name=${session.user.name}&background=random`} alt="User" width={32} height={32} className="rounded-full border border-gray-700" />
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
                <Image src={session.user.image || `https://ui-avatars.com/api/?name=${session.user.name}&background=random`} alt="User" width={32} height={32} className="rounded-full border border-gray-700" />
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

      </nav >

      {/* Mobile Menu Overlay - Portal/Fixed Layer */}
      {
        isOpen && (
          <div className="fixed inset-0 z-[9999] bg-[#0B0F19] md:hidden animate-in fade-in slide-in-from-top-[2%] duration-300 flex flex-col">

            {/* Mobile Header (Replicating exact Desktop layout for smooth transition) */}
            <div className="w-full border-b border-white/5 bg-[#0B0F19]">
              <div className="flex h-16 items-center justify-between px-6 max-w-7xl mx-auto">
                <div className="flex-shrink-0">
                  <Logo />
                </div>
                <div className="flex items-center gap-4">
                  <button
                    onClick={toggleMenu}
                    className="text-white focus:outline-none p-2 rounded-full hover:bg-white/5"
                  >
                    <X size={24} />
                  </button>
                </div>
              </div>
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
                {/* Cursos (Replica of Desktop "Cursos") */}
                <Link
                  href="/courses?category=all"
                  className={getMobileLinkClass("/courses")}
                  onClick={toggleMenu}
                >
                  <BookOpen className="mr-4 text-[#5D5CDE]" size={24} />
                  <span className="text-xl font-bold text-white">Cursos</span>
                </Link>
                <Link
                  href="/pricing"
                  className={getMobileLinkClass("/pricing")}
                  onClick={toggleMenu}
                >
                  <TrendingUp className="mr-4 text-gray-500" size={24} />
                  <span className="text-xl font-bold text-gray-300">Membresías</span>
                </Link>
              </div>

              <div className="pb-4 mb-4 border-b border-white/5 opacity-60">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Empresas</p>
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
                    <Image src={session.user?.image || `https://ui-avatars.com/api/?name=${session.user?.name}&background=random`} alt="" width={48} height={48} className="rounded-full border border-gray-700" />
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
        )
      }

      {/* Login Modal */}
      <LoginModal isOpen={isLoginModalOpen} onClose={closeLoginModal} />
    </>
  );
}
