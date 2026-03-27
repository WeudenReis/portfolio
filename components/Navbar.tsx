"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const navItems = [
  { label: "Início", href: "#hero" },
  { label: "Projetos", href: "#projects" },
  { label: "Sobre", href: "#about" },
  { label: "Experiência", href: "#experience" },
  { label: "Contato", href: "#contact" },
];

export default function Navbar() {
  const navRef = useRef<HTMLElement>(null);
  const [active, setActive] = useState("hero");

  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;

    // Animate nav in
    gsap.fromTo(
      nav,
      { y: -80, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, delay: 1.5, ease: "power3.out" }
    );

    // Show/hide based on scroll direction
    let lastScroll = 0;
    const handleScroll = () => {
      const current = window.scrollY;
      if (current > 100) {
        nav.classList.add("nav-blur", "bg-bg/80", "border-b", "border-white/[0.04]");
        nav.classList.remove("bg-transparent");
      } else {
        nav.classList.remove("nav-blur", "bg-bg/80", "border-b", "border-white/[0.04]");
        nav.classList.add("bg-transparent");
      }

      if (current > lastScroll && current > 300) {
        gsap.to(nav, { y: -80, duration: 0.3, ease: "power2.in" });
      } else {
        gsap.to(nav, { y: 0, duration: 0.3, ease: "power2.out" });
      }
      lastScroll = current;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    // Track active section
    const sections = ["hero", "about", "projects", "experience", "contact"];
    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      ScrollTrigger.create({
        trigger: el,
        start: "top center",
        end: "bottom center",
        onEnter: () => setActive(id),
        onEnterBack: () => setActive(id),
      });
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const el = document.querySelector(href);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <nav
      ref={navRef}
      className="fixed top-0 left-0 w-full z-50 bg-transparent transition-colors duration-300"
      style={{ opacity: 0 }}
    >
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <a
          href="#hero"
          onClick={(e) => handleClick(e, "#hero")}
          className="text-lg font-bold tracking-tight text-white hover:text-accent transition-colors"
        >
          W<span className="text-accent">.</span>
        </a>

        <div className="hidden md:flex items-center gap-8">
          {navItems.map((item) => {
            const sectionId = item.href.replace("#", "");
            return (
              <a
                key={item.label}
                href={item.href}
                onClick={(e) => handleClick(e, item.href)}
                className={`text-sm font-medium transition-colors relative ${
                  active === sectionId
                    ? "text-accent"
                    : "text-white/50 hover:text-white/80"
                }`}
              >
                {item.label}
                {active === sectionId && (
                  <span className="absolute -bottom-1 left-0 w-full h-px bg-accent" />
                )}
              </a>
            );
          })}
        </div>

        <a
          href="#contact"
          onClick={(e) => handleClick(e, "#contact")}
          className="magnetic-btn text-xs py-2 px-4"
        >
          Contato
        </a>
      </div>
    </nav>
  );
}
