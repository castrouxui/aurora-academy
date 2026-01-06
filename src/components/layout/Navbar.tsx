"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Logo } from "./Logo";
import { Menu, X } from "lucide-react";
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
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2">
            <Logo />
          </Link>

          {/* Desktop Menu */}
          <div className="hidden items-center gap-6 md:flex">
            <Link
              href="/courses"
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              Cursos
            </Link>
            <Link
              href="/pricing"
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              Precios
            </Link>
            <Link
              href="/about"
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              Nosotros
            </Link>
          </div>

          <div className="hidden items-center gap-4 md:flex">
            {/* Removed 'Iniciar Sesión' link as requested */}
            <Button variant="default" onClick={openLoginModal}>
              Acceder
            </Button>
          </div>

          {/* Mobile Hamburger Button */}
          <div className="flex items-center md:hidden">
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

