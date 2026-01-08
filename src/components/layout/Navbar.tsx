"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/layout/Container";
import { Logo } from "./Logo";
import { Menu, X, Search, LogOut, BookOpen, User } from "lucide-react";
import { useSession, signOut } from "next-auth/react";
// import { cn } from "@/lib/utils"; // Not used but could be kept
import { LoginModal } from "@/components/auth/LoginModal";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { data: session } = useSession();
  const pathname = usePathname();

  const toggleMenu = () => setIsOpen(!isOpen);
  const openLoginModal = () => setIsLoginModalOpen(true);
  const closeLoginModal = () => setIsLoginModalOpen(false);

  const getLinkClass = (path: string) => {
    const isActive = pathname === path;
    return `text-sm font-medium transition-colors ${isActive ? "text-white font-bold" : "text-gray-300 hover:text-white"
      }`;
  };

  const getMobileLinkClass = (path: string) => {
    const isActive = pathname === path;
    return `text-base font-medium transition-colors ${isActive ? "text-primary font-bold" : "text-gray-300 hover:text-primary"
      }`;
  };

  return (
    <>
      <nav className="fixed top-0 z-50 w-full border-b border-muted bg-background/80 backdrop-blur-md">
        <Container className="flex h-16 items-center gap-6">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 flex-shrink-0">
            <Logo />
          </Link>

          {/* Search Input - Desktop */}
          <form onSubmit={(e) => { e.preventDefault(); const term = (e.currentTarget.elements.namedItem('search') as HTMLInputElement).value; if (term) window.location.href = `/courses?search=${encodeURIComponent(term)}`; }} className="hidden md:flex relative w-[300px] lg:w-[400px]">
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
                    <Link href="/admin" className="flex items-center gap-2 px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition-colors">
                      <LayoutDashboard size={16} />
                      Administración
                    </Link>
                    <Link href="/my-courses" className="flex items-center gap-2 px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition-colors">
                      <BookOpen size={16} />
                      Mis Cursos
                    </Link>
                    <button onClick={() => signOut()} className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-400 hover:bg-gray-800 transition-colors">
                      <LogOut size={16} />
                      Cerrar sesión
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Button variant="default" onClick={openLoginModal} className="bg-primary hover:bg-primary/90 text-white font-medium">
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

        {/* Mobile Menu Dropdown */}
        {isOpen && (
          <div className="border-t border-gray-800 bg-background md:hidden">
            <div className="container mx-auto flex flex-col space-y-4 px-4 py-6">
              {/* Mobile Search */}
              <div className="relative w-full mb-2">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <Search size={18} />
                </div>
                <input
                  type="text"
                  placeholder="¿Qué quieres aprender?"
                  className="w-full bg-[#1e2330] border border-gray-700 text-gray-200 text-sm rounded-md py-2 pl-10 pr-4 placeholder-gray-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                />
              </div>

              <Link
                href="/courses"
                className={getMobileLinkClass("/courses")}
                onClick={toggleMenu}
              >
                Cursos
              </Link>
              <Link
                href="/pricing"
                className={getMobileLinkClass("/pricing")}
                onClick={toggleMenu}
              >
                Precios
              </Link>
              <Link
                href="/about"
                className={getMobileLinkClass("/about")}
                onClick={toggleMenu}
              >
                Nosotros
              </Link>
              {session ? (
                <>
                  <div className="border-t border-gray-800 pt-4 pb-2">
                    <div className="flex items-center gap-3 px-2 mb-3">
                      <img src={session.user?.image || `https://ui-avatars.com/api/?name=${session.user?.name}&background=random`} alt="" className="w-10 h-10 rounded-full" />
                      <div>
                        <p className="text-white font-medium text-sm">{session.user?.name}</p>
                        <p className="text-xs text-gray-400">{session.user?.email}</p>
                      </div>
                    </div>
                    <Link href="/my-courses" className="flex items-center gap-2 px-2 py-2 text-gray-300 hover:text-white" onClick={toggleMenu}>
                      <BookOpen size={18} />
                      Mis Cursos
                    </Link>
                    <button onClick={() => signOut()} className="w-full text-left flex items-center gap-2 px-2 py-2 text-red-400 hover:text-red-300">
                      <LogOut size={18} />
                      Cerrar sesión
                    </button>
                  </div>
                </>
              ) : (
                <div className="pt-4">
                  <Button
                    className="w-full"
                    size="lg"
                    onClick={() => {
                      toggleMenu();
                      openLoginModal();
                    }}
                  >
                    Acceder
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Login Modal */}
      <LoginModal isOpen={isLoginModalOpen} onClose={closeLoginModal} />
    </>
  );
}

