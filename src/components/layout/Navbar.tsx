"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Logo } from "./Logo";
import { Menu, X, Search } from "lucide-react";
// import { cn } from "@/lib/utils"; // Not used but could be kept
import { LoginModal } from "@/components/auth/LoginModal";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);
  const openLoginModal = () => setIsLoginModalOpen(true);
  const closeLoginModal = () => setIsLoginModalOpen(false);

  return (
    <>
      <nav className="fixed top-0 z-50 w-full border-b border-muted bg-background/80 backdrop-blur-md">
        <div className="container mx-auto flex h-16 items-center px-4 gap-6">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 flex-shrink-0">
            <Logo />
          </Link>

          {/* Search Input - Desktop */}
          <div className="hidden md:flex relative w-[300px] lg:w-[400px]">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
              <Search size={18} />
            </div>
            <input
              type="text"
              placeholder="¿Qué quieres aprender?"
              className="w-full bg-[#1e2330] border border-gray-700 text-gray-200 text-sm rounded-md py-2 pl-10 pr-4 placeholder-gray-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
            />
          </div>

          {/* Desktop Menu - Right Aligned */}
          <div className="hidden md:flex items-center gap-6 ml-auto">
            <div className="flex items-center gap-6">
              <Link
                href="/courses"
                className="text-sm font-medium transition-colors text-gray-300 hover:text-white"
              >
                Cursos
              </Link>
              <Link
                href="/pricing"
                className="text-sm font-medium transition-colors text-gray-300 hover:text-white"
              >
                Precios
              </Link>
              <Link
                href="/about"
                className="text-sm font-medium transition-colors text-gray-300 hover:text-white"
              >
                Nosotros
              </Link>
            </div>
            <Button variant="default" onClick={openLoginModal} className="bg-primary hover:bg-primary/90 text-white font-medium">
              Acceder
            </Button>
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
        </div>

        {/* Mobile Menu Dropdown */}
        {isOpen && (
          <div className="border-t border-gray-800 bg-background md:hidden">
            <div className="container mx-auto flex flex-col space-y-4 px-4 py-6">
              <Link
                href="/courses"
                className="text-base font-medium text-gray-300 transition-colors hover:text-primary"
                onClick={toggleMenu}
              >
                Cursos
              </Link>
              <Link
                href="/pricing"
                className="text-base font-medium text-gray-300 transition-colors hover:text-primary"
                onClick={toggleMenu}
              >
                Precios
              </Link>
              <Link
                href="/about"
                className="text-base font-medium text-gray-300 transition-colors hover:text-primary"
                onClick={toggleMenu}
              >
                Nosotros
              </Link>
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
            </div>
          </div>
        )}
      </nav>

      {/* Login Modal */}
      <LoginModal isOpen={isLoginModalOpen} onClose={closeLoginModal} />
    </>
  );
}

