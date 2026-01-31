"use client";

import { useState, useRef, useEffect } from "react"; // Added hooks
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/layout/Container";
import { Logo } from "./Logo";
import { Menu, X, Search, LogOut, BookOpen, User, LayoutDashboard, TrendingUp, ChevronDown, Building2, GraduationCap, PlayCircle, FileText, Lock, ArrowRight, ShieldCheck } from "lucide-react"; // Added icons
import { useSession, signOut } from "next-auth/react";
// import { cn } from "@/lib/utils"; 
import { LoginModal } from "@/components/auth/LoginModal";
import { TopBanner } from "./TopBanner";

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
      <div className="fixed top-0 z-[500] w-full flex flex-col">
        <TopBanner />
        <nav className="w-full border-b border-muted bg-background/80 backdrop-blur-md">
          <Container className="flex h-16 items-center gap-6 justify-between">
            {/* Logo */}
            <div className="flex-shrink-0">
              <Logo />
            </div>

            {/* Desktop Navigation - Centered Mega Menu */}
            <div className="hidden md:flex items-center gap-2">

              {/* 1. Membresías */}
              <Link href="/membresias" className={getLinkClass("/membresias")}>
                Membresías
              </Link>

              {/* 2. Cursos */}
              <Link href="/cursos" className={getLinkClass("/cursos")}>
                Cursos
              </Link>

              {/* 3. Empresas - PROXIMAMENTE */}
              <div className="relative group cursor-default">
                <button className="text-sm font-medium text-gray-500 flex items-center gap-2 px-4 py-2 cursor-default hover:text-gray-400 transition-colors">
                  Empresas
                  <span className="text-[10px] uppercase font-bold bg-white/5 text-gray-400 border border-white/10 px-2 py-0.5 rounded-full">Próximamente</span>
                </button>
              </div>

              {/* 4. Nosotros */}
              <Link href="/nosotros" className={getLinkClass("/nosotros")}>
                Nosotros
              </Link>
            </div>

            {/* Right Actions & Search (Desktop) */}
            <div className="hidden md:flex items-center gap-6">

              {/* Search Input - Desktop */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const term = (e.currentTarget.elements.namedItem('search') as HTMLInputElement).value;
                  if (term) router.push(`/cursos?search=${encodeURIComponent(term)}`);
                }}
                className="hidden lg:flex relative w-[250px]"
              >
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <Search size={16} />
                </div>
                <input
                  name="search"
                  type="text"
                  placeholder="Buscar..."
                  className="w-full bg-[#1e2330] border border-gray-700 text-gray-200 text-sm rounded-full py-2 pl-9 pr-4 placeholder-gray-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                />
              </form>

              <div className="h-6 w-px bg-gray-800 hidden lg:block"></div>

              {session?.user ? (
                <div className="relative">
                  <button onClick={() => setIsUserMenuOpen(!isUserMenuOpen)} className="flex items-center gap-3 focus:outline-none hover:bg-white/5 p-1 pr-3 rounded-full transition-colors border border-transparent hover:border-white/5">
                    <Image src={session.user.image || `https://ui-avatars.com/api/?name=${session.user.name}&background=random`} alt="User" width={32} height={32} className="rounded-full border border-gray-700 object-cover aspect-square" />
                    <span className="text-sm font-medium text-gray-300 hidden lg:block max-w-[100px] truncate">{session.user.name?.split(' ')[0] || 'User'}</span>
                    <ChevronDown size={16} className="text-gray-500 hidden lg:block" />
                  </button>

                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-3 w-56 bg-[#1F2937] border border-gray-700 rounded-xl shadow-2xl overflow-hidden py-1 z-50 animate-in fade-in zoom-in-95 duration-100">
                      <div className="px-4 py-3 border-b border-gray-700 bg-white/5">
                        <p className="text-sm text-white font-bold truncate flex items-center gap-1">
                          {session.user.name}
                          {session.user.telegramVerified && (
                            <ShieldCheck size={14} className="text-green-500 fill-green-500/20" />
                          )}
                        </p>
                        <p className="text-sm text-gray-400 truncate">{session.user.email}</p>
                      </div>
                      {session.user.role === 'ADMIN' && (
                        <Link href="/admin" className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition-colors" onClick={() => setIsUserMenuOpen(false)}>
                          <LayoutDashboard size={16} />
                          Administración
                        </Link>
                      )}
                      {session && session.user.role !== 'ADMIN' && (
                        <>
                          <Link href="/dashboard/cursos" className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition-colors" onClick={() => setIsUserMenuOpen(false)}>
                            <BookOpen size={16} />
                            Mis Cursos
                          </Link>
                          <Link href="/dashboard/membresias" className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition-colors" onClick={() => setIsUserMenuOpen(false)}>
                            <TrendingUp size={16} />
                            Membresía
                          </Link>
                        </>
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
                <Button variant="default" onClick={openLoginModal} className="bg-[#5D5CDE] hover:bg-[#4B4AC0] text-white font-bold rounded-xl shadow-lg shiny-hover px-6 h-10 text-sm active:scale-95 transition-all">
                  Acceder
                </Button>
              )}
            </div>

            {/* Mobile Hamburger Button */}
            <div className="flex items-center md:hidden ml-auto gap-4">
              {session && (
                <Link href={session.user.role === 'ADMIN' ? "/admin" : "/dashboard/cursos"}>
                  <Image src={session.user.image || `https://ui-avatars.com/api/?name=${session.user.name}&background=random`} alt="User" width={32} height={32} className="rounded-full border border-gray-700 object-cover aspect-square" />
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
      </div>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-[9999] bg-[#0B0F19] md:hidden flex flex-col animate-in fade-in duration-300">
          {/* Mobile Header (Higher quality) */}
          <div className="w-full border-b border-white/5 bg-[#0B0F19]/95 backdrop-blur-xl">
            <div className="flex h-16 items-center justify-between px-6">
              <Logo />
              <button
                onClick={toggleMenu}
                className="text-white bg-white/5 p-2.5 rounded-xl hover:bg-white/10 transition-colors"
                aria-label="Close menu"
              >
                <X size={24} />
              </button>
            </div>
          </div>

          <div className="flex flex-col flex-1 px-6 py-8 overflow-y-auto space-y-10">
            {/* Search - More Integrated */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const term = (e.currentTarget.elements.namedItem('search-mobile') as HTMLInputElement).value;
                if (term) {
                  router.push(`/cursos?search=${encodeURIComponent(term)}`);
                  toggleMenu();
                }
              }}
              className="relative group lg:hidden"
            >
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500 group-focus-within:text-primary transition-colors">
                <Search size={18} />
              </div>
              <input
                name="search-mobile"
                type="text"
                placeholder="¿Qué quieres aprender?"
                className="w-full bg-white/5 border border-white/10 text-white rounded-2xl py-4 pl-12 pr-4 placeholder-gray-500 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all text-base"
              />
            </form>

            {/* Navigation Groups */}
            <div className="space-y-8">
              {/* Primary (Academical) */}
              <div className="space-y-3">
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] ml-4 mb-2">Academia</p>

                {/* Ir a mis cursos - Styled consistently but highlighted */}
                {/* Main Action - Dynamic based on Role */}
                {session && (
                  session.user.role === 'ADMIN' ? (
                    <Link
                      href="/admin"
                      className="flex items-center w-full px-5 py-3 text-base font-medium transition-colors rounded-lg text-primary bg-primary/5 hover:bg-primary/10 border-l-4 border-primary"
                      onClick={toggleMenu}
                    >
                      <LayoutDashboard className="mr-4" size={20} />
                      <span className="text-lg font-bold">Panel de Administración</span>
                    </Link>
                  ) : (
                    <Link
                      href="/dashboard/cursos"
                      className="flex items-center w-full px-5 py-3 text-base font-medium transition-colors rounded-lg text-primary bg-primary/5 hover:bg-primary/10 border-l-4 border-primary"
                      onClick={toggleMenu}
                    >
                      <PlayCircle className="mr-4" size={20} />
                      <span className="text-lg font-bold">Ir a mis cursos</span>
                    </Link>
                  )
                )}

                <Link
                  href="/membresias"
                  className={getMobileLinkClass("/membresias")}
                  onClick={toggleMenu}
                >
                  <TrendingUp className="mr-4 text-gray-400" size={20} />
                  <span className="text-lg font-bold">Membresías</span>
                </Link>

                <Link
                  href="/cursos"
                  className={getMobileLinkClass("/cursos")}
                  onClick={toggleMenu}
                >
                  <BookOpen className="mr-4 text-gray-400" size={20} />
                  <span className="text-lg font-bold text-white">Cursos</span>
                </Link>
              </div>

              {/* Secondary (Institutional) */}
              <div className="space-y-2">
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] ml-4 mb-2">Institucional</p>

                <div className="flex items-center w-full px-5 py-3 text-gray-500 opacity-60">
                  <Building2 className="mr-4" size={20} />
                  <span className="text-lg font-semibold">Empresas</span>
                  <span className="ml-auto text-[10px] uppercase font-bold bg-white/5 text-gray-400 border border-white/10 px-2 py-1 rounded-full">
                    Próximamente
                  </span>
                </div>

                <Link
                  href="/nosotros"
                  className={getMobileLinkClass("/nosotros")}
                  onClick={toggleMenu}
                >
                  <User className="mr-4 text-gray-400" size={20} />
                  <span className="text-lg font-semibold">Nosotros</span>
                </Link>
              </div>
            </div>
          </div>

          {/* User Section / Boton Inferior */}
          <div className="p-6 border-t border-white/5 bg-black/20">
            {session ? (
              <div className="space-y-4">
                <div className="flex items-center gap-4 px-2">
                  <Image
                    src={session.user?.image || `https://ui-avatars.com/api/?name=${session.user?.name}&background=random`}
                    alt=""
                    width={44}
                    height={44}
                    className="rounded-full ring-2 ring-white/5"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-bold text-base truncate">{session.user?.name}</p>
                    <p className="text-xs text-gray-500 truncate">{session.user?.email}</p>
                  </div>
                  <button onClick={() => signOut()} className="p-2.5 text-red-400 hover:bg-red-400/10 rounded-xl transition-colors">
                    <LogOut size={20} />
                  </button>
                </div>

                {/* Dynamic Admin/Student Button */}
                {session.user.role === 'ADMIN' ? (
                  pathname.startsWith('/admin') ? (
                    <Link
                      href="/dashboard/cursos"
                      className="w-full flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 text-white py-4 rounded-2xl font-bold border border-white/10 transition-all"
                      onClick={toggleMenu}
                    >
                      <BookOpen size={20} />
                      Ver como Alumno
                    </Link>
                  ) : (
                    <Link
                      href="/admin"
                      className="w-full flex items-center justify-center gap-2 bg-[#5D5CDE]/20 hover:bg-[#5D5CDE]/30 text-[#5D5CDE] py-4 rounded-2xl font-bold border border-[#5D5CDE]/20 transition-all"
                      onClick={toggleMenu}
                    >
                      <LayoutDashboard size={20} />
                      Panel de Administración
                    </Link>
                  )
                ) : (
                  <Link
                    href="/dashboard/cursos"
                    className="w-full flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 text-white py-4 rounded-2xl font-bold border border-white/10 transition-all"
                    onClick={toggleMenu}
                  >
                    <LayoutDashboard size={20} />
                    Panel de Alumno
                  </Link>
                )}
              </div>
            ) : (
              <Button
                className="w-full h-12 text-sm font-bold bg-[#5D5CDE] hover:bg-[#4B4AC0] text-white rounded-xl shadow-lg shiny-hover active:scale-95 transition-all"
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
      )}


      {/* Login Modal */}
      <LoginModal isOpen={isLoginModalOpen} onClose={closeLoginModal} />
    </>
  );
}
