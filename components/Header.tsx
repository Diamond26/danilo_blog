"use client";

import { useEffect, useState, useCallback } from "react";
import { usePathname } from "next/navigation";
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
  const pathname = usePathname();
  const isHome = pathname === "/";

  const closeMenu = useCallback(() => setMenuOpen(false), []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Chiudi menu su resize (da mobile a desktop)
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth > 768) closeMenu();
    };
    window.addEventListener("resize", onResize, { passive: true });
    return () => window.removeEventListener("resize", onResize);
  }, [closeMenu]);

  // Body scroll lock quando il menu è aperto
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  function buildHref(hash: string) {
    return isHome ? hash : `/${hash}`;
  }

  return (
    <>
      <header className={`header${scrolled ? " scrolled" : ""}`} id="site-header">
        <div className="container header-inner">
          <Link href="/" className="header-logo" onClick={closeMenu}>
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
                href={buildHref(link.href)}
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

      {/* Overlay per chiudere il menu toccando fuori */}
      {menuOpen && (
        <div className="nav-overlay" onClick={closeMenu} aria-hidden="true" />
      )}
    </>
  );
}
