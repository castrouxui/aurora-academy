import Link from 'next/link';
import { Button } from "@/components/ui/button";
import Image from 'next/image';
import { Logo } from './Logo';

export function Navbar() {
  return (
    <nav className="fixed top-0 w-full z-50 border-b border-muted bg-background/80 backdrop-blur-md">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Logo />
        </Link>

        <div className="hidden md:flex items-center gap-6">
          <Link href="/courses" className="text-sm font-medium hover:text-primary transition-colors">
            Cursos
          </Link>
          <Link href="/pricing" className="text-sm font-medium hover:text-primary transition-colors">
            Precios
          </Link>
          <Link href="/about" className="text-sm font-medium hover:text-primary transition-colors">
            Nosotros
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <Link href="/login" className="text-sm font-medium hover:text-primary text-muted-foreground hover:text-foreground transition-colors">
            Iniciar Sesión
          </Link>
          <Button variant="default">
            Empezar Ahora
          </Button>
        </div>
      </div>
    </nav>
  );
}
