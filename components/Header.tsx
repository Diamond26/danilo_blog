"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

const navLinks = [
  { href: "#chi-sono", label: "Chi sono" },
  { href: "#competenze", label: "Competenze" },
  { href: "#servizi", label: "Servizi" },
  { href: "#articoli", label: "Articoli" },
  { href: "#contatti", label: "Contattami", cta: true },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function closeMenu() {
    setMenuOpen(false);
  }

  return (
    <header className={`header${scrolled ? " scrolled" : ""}`} id="site-header">
      <div className="container header-inner">
        <Link href="/" className="header-logo">
          <Image
            src="/img/logo.png"
            alt="Danilo Littarru"
            width={160}
            height={48}
            className="header-logo-img"
            priority
          />
        </Link>

        <nav className={`nav${menuOpen ? " open" : ""}`} id="main-nav">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={`nav-link${link.cta ? " nav-link--cta" : ""}`}
              onClick={closeMenu}
            >
              {link.label}
            </a>
          ))}
        </nav>

        <button
          className={`menu-toggle${menuOpen ? " open" : ""}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? "Chiudi menu" : "Apri menu"}
          aria-expanded={menuOpen}
        >
          <span />
          <span />
          <span />
        </button>
      </div>
    </header>
  );
}
