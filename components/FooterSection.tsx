"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Mail, ArrowUpRight, Code2, User, Heart, Send } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const socialLinks = [
  { label: "GitHub", icon: Code2, href: "https://github.com/weudenreis" },
  { label: "LinkedIn", icon: User, href: "https://www.linkedin.com/in/weuden-dos-reis-b25945320/" },
  { label: "Instagram", icon: Heart, href: "https://instagram.com/weudenreis" },
];

export default function FooterSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Main heading — split-like effect
      gsap.fromTo(
        ".contact-heading",
        { y: 100, opacity: 0, filter: "blur(10px)" },
        {
          y: 0,
          opacity: 1,
          filter: "blur(0px)",
          duration: 1.2,
          ease: "power4.out",
          scrollTrigger: { trigger: ".contact-heading", start: "top 85%" },
        }
      );

      // Stagger reveals
      gsap.fromTo(
        ".contact-reveal",
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.7,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: { trigger: ".contact-reveal", start: "top 88%" },
        }
      );

      // Email button special entrance
      gsap.fromTo(
        ".contact-cta",
        { scale: 0.9, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 0.8,
          ease: "back.out(1.5)",
          scrollTrigger: { trigger: ".contact-cta", start: "top 88%" },
        }
      );

      // Social links
      gsap.fromTo(
        ".social-link",
        { y: 20, opacity: 0, scale: 0.8 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.5,
          stagger: 0.06,
          ease: "back.out(2)",
          scrollTrigger: { trigger: ".social-grid", start: "top 90%" },
        }
      );

      // Bottom bar slide in
      gsap.fromTo(
        ".footer-bottom",
        { y: 20, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          ease: "power2.out",
          scrollTrigger: { trigger: ".footer-bottom", start: "top 95%" },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <footer
      ref={sectionRef}
      id="contact"
      className="relative py-32 md:py-40 px-4 sm:px-6 lg:px-8 section-glow overflow-hidden"
    >
      {/* Ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-accent/[0.02] blur-[200px] pointer-events-none" />

      <div className="max-w-4xl mx-auto text-center relative z-10">
        {/* Label */}
        <p
          className="contact-reveal text-xs uppercase tracking-[0.3em] text-accent/70 font-medium mb-6"
          style={{ opacity: 0 }}
        >
          Contato
        </p>

        {/* Big heading */}
        <h2
          className="contact-heading text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-none mb-6"
          style={{ opacity: 0 }}
        >
          <span className="gradient-text">Vamos criar</span>
          <br />
          <span className="text-white">algo incrível?</span>
        </h2>

        {/* Subtitle */}
        <p
          className="contact-reveal text-base md:text-lg text-white/35 max-w-md mx-auto mb-12 leading-relaxed"
          style={{ opacity: 0 }}
        >
          Sempre aberto a novos desafios e oportunidades.
          Manda uma mensagem!
        </p>

        {/* Email CTA */}
        <div className="contact-cta mb-12" style={{ opacity: 0 }}>
          <a
            href="mailto:weudenreis@gmail.com"
            className="magnetic-btn text-sm md:text-base py-4 px-8 md:px-10 inline-flex items-center gap-3 group"
          >
            <Mail className="w-4 h-4" />
            <span>weudenreis@gmail.com</span>
            <Send className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
          </a>
        </div>

        {/* Social */}
        <div className="social-grid flex justify-center gap-3 mb-20">
          {socialLinks.map((link) => {
            const Icon = link.icon;
            return (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noreferrer"
                className="social-link w-12 h-12 rounded-xl border border-white/[0.05] bg-white/[0.015] flex items-center justify-center text-white/30 hover:text-accent hover:border-accent/20 hover:bg-accent/[0.06] hover:shadow-[0_0_20px_rgba(245,158,11,0.06)] transition-all duration-300"
                title={link.label}
                style={{ opacity: 0 }}
              >
                <Icon className="w-5 h-5" />
              </a>
            );
          })}
        </div>

        {/* Bottom bar */}
        <div className="footer-bottom pt-8 border-t border-white/[0.03] flex flex-col md:flex-row items-center justify-between gap-4" style={{ opacity: 0 }}>
          <p className="text-white/15 text-xs tracking-wide">
            &copy; 2026 Weuden Reis
          </p>
          <p className="text-white/15 text-xs tracking-wide">
            Feito com{" "}
            <span className="text-accent/40">Next.js</span>{" "}+{" "}
            <span className="text-accent/40">GSAP</span>{" "}+{" "}
            <span className="text-accent/40">Tailwind</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
