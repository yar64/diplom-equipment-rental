'use client';

import Link from 'next/link';
import { Search, Menu, ShoppingCart, Heart, User, Sparkles } from 'lucide-react';
import { navLinks } from '../shared/constants';

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative">
                <div className="absolute inset-0 bg-primary rounded-lg blur-sm opacity-20 group-hover:opacity-30 transition-opacity"></div>
                <div className="relative w-10 h-10 bg-primary rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform duration-300 shadow-sm">
                  <Sparkles className="w-5 h-5 text-primary-foreground" />
                </div>
              </div>
              <div className="relative">
                <span className="text-xl font-bold text-foreground">EventRent</span>
                <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-primary rounded-full scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
              </div>
            </Link>

            <nav className="hidden md:flex items-center gap-6 ml-12">
              {navLinks.map((link) => (
                <Link key={link.href} href={link.href} className="group relative">
                  <span className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                    {link.label}
                  </span>
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300 rounded-full"></span>
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <button className="p-2 text-muted-foreground hover:text-foreground rounded-lg hover:bg-accent transition-colors">
              <Search className="w-5 h-5" />
            </button>
            <button className="p-2 text-muted-foreground hover:text-foreground rounded-lg hover:bg-accent transition-colors relative">
              <Heart className="w-5 h-5" />
            </button>
            <button className="p-2 text-muted-foreground hover:text-foreground rounded-lg hover:bg-accent transition-colors relative">
              <ShoppingCart className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-primary-foreground text-xs rounded-full flex items-center justify-center font-bold">
                3
              </span>
            </button>
            <button className="ml-2 px-4 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-lg hover:opacity-90 transition-all duration-300">
              <User className="w-4 h-4 inline mr-2" />
              Войти
            </button>
            <button className="md:hidden text-muted-foreground p-2 rounded-lg hover:bg-accent">
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}