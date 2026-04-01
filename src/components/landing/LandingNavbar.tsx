"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

export function LandingNavbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 0);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 h-16 flex items-center justify-between px-4 md:px-8 transition-all duration-300 ${
          scrolled
            ? "glass border-b border-[var(--glass-border)]"
            : "bg-transparent"
        }`}
      >
        <Link
          href="/"
          className="text-gradient-primary font-bold text-xl font-sidebar tracking-tight"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          Y-START
        </Link>

        {/* Desktop */}
        <div className="hidden sm:flex items-center gap-2">
          <Button variant="glass" size="sm" asChild>
            <Link href="/signup/student">학생 회원가입</Link>
          </Button>
          <Button variant="glass" size="sm" asChild>
            <Link href="/signup/coach">코치 회원가입</Link>
          </Button>
          <Button variant="gradient" size="sm" asChild>
            <Link href="/login">로그인</Link>
          </Button>
        </div>

        {/* Mobile hamburger */}
        <button
          type="button"
          className="sm:hidden p-2 rounded-lg hover:bg-[var(--glass-bg-hover)] transition-colors"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? "메뉴 닫기" : "메뉴 열기"}
        >
          {menuOpen ? (
            <X className="h-5 w-5 text-[var(--color-text)]" />
          ) : (
            <Menu className="h-5 w-5 text-[var(--color-text)]" />
          )}
        </button>
      </nav>

      {/* Mobile menu overlay */}
      {menuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm sm:hidden"
          onClick={() => setMenuOpen(false)}
        />
      )}

      {/* Mobile menu sheet */}
      <div
        className={`fixed top-16 left-0 right-0 z-40 glass border-b border-[var(--glass-border)] px-4 py-6 flex flex-col gap-3 transition-all duration-300 sm:hidden ${
          menuOpen
            ? "opacity-100 translate-y-0"
            : "opacity-0 -translate-y-4 pointer-events-none"
        }`}
      >
        <Button variant="glass" size="lg" className="w-full" asChild>
          <Link href="/signup/student" onClick={() => setMenuOpen(false)}>
            학생 회원가입
          </Link>
        </Button>
        <Button variant="glass" size="lg" className="w-full" asChild>
          <Link href="/signup/coach" onClick={() => setMenuOpen(false)}>
            코치 회원가입
          </Link>
        </Button>
        <Button variant="gradient" size="lg" className="w-full" asChild>
          <Link href="/login" onClick={() => setMenuOpen(false)}>
            로그인
          </Link>
        </Button>
      </div>
    </>
  );
}
