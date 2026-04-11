"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import TypeAnimationComponent from "./TypeAnimation";
import SocialLinks from "./SocialLinks";
import { ChevronDown, ArrowRight } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

export default function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const greetingRef = useRef<HTMLParagraphElement>(null);
  const taglineRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const avatarRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const lineLeftRef = useRef<HTMLDivElement>(null);
  const lineRightRef = useRef<HTMLDivElement>(null);
  const orbRef1 = useRef<HTMLDivElement>(null);
  const orbRef2 = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

      // Floating orbs
      gsap.to(orbRef1.current, {
        x: 80, y: -50, duration: 10, repeat: -1, yoyo: true, ease: "sine.inOut",
      });
      gsap.to(orbRef2.current, {
        x: -60, y: 70, duration: 12, repeat: -1, yoyo: true, ease: "sine.inOut",
      });

      // Entrance timeline
      tl.fromTo(
        avatarRef.current,
        { scale: 0, opacity: 0 },
        { scale: 1, opacity: 1, duration: 1, ease: "elastic.out(1, 0.5)" },
        0.5
      )
        .fromTo(
          greetingRef.current,
          { y: 20, opacity: 0, filter: "blur(10px)" },
          { y: 0, opacity: 1, filter: "blur(0px)", duration: 0.7 },
          0.8
        )
        .fromTo(
          [lineLeftRef.current, lineRightRef.current],
          { scaleX: 0 },
          { scaleX: 1, duration: 0.6, stagger: 0.05 },
          0.9
        )
        .fromTo(
          headingRef.current,
          { y: 80, opacity: 0, filter: "blur(8px)" },
          { y: 0, opacity: 1, filter: "blur(0px)", duration: 1 },
          1.0
        )
        .fromTo(
          taglineRef.current,
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.7 },
          1.4
        )
        .fromTo(
          ctaRef.current,
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6 },
          1.7
        )
        .fromTo(
          scrollRef.current,
          { opacity: 0, y: -10 },
          { opacity: 1, y: 0, duration: 0.5 },
          2.0
        );

      // Parallax on scroll — content moves up faster
      gsap.to(contentRef.current, {
        yPercent: -25,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 1,
        },
      });

      // Orbs parallax (different speed)
      gsap.to([orbRef1.current, orbRef2.current], {
        yPercent: -40,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 0.5,
        },
      });

      // Scroll indicator bounce
      gsap.to(scrollRef.current, {
        y: 12,
        duration: 1.5,
        repeat: -1,
        yoyo: true,
        ease: "power1.inOut",
        delay: 2.5,
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 relative overflow-hidden"
    >
      {/* Background orbs */}
      <div
        ref={orbRef1}
        className="absolute top-20 -left-40 w-[500px] h-[500px] rounded-full bg-amber-500/[0.04] blur-[150px] pointer-events-none"
      />
      <div
        ref={orbRef2}
        className="absolute -bottom-20 -right-40 w-[400px] h-[400px] rounded-full bg-blue-500/[0.03] blur-[130px] pointer-events-none"
      />

      {/* Dot grid */}
      <div className="absolute inset-0 dot-pattern opacity-30 pointer-events-none" />

      {/* Content */}
      <div
        ref={contentRef}
        className="flex flex-col items-center text-center max-w-4xl w-full relative z-10"
      >
        {/* Avatar */}
        <div
          ref={avatarRef}
          className="relative group mb-8"
          style={{ opacity: 0 }}
        >
          <div className="absolute -inset-2 rounded-full bg-gradient-to-tr from-amber-500/20 via-transparent to-blue-500/10 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
          <div className="relative w-28 h-28 md:w-32 md:h-32 rounded-full border border-white/[0.08] bg-white/[0.03] overflow-hidden ring-1 ring-white/[0.04] ring-offset-2 ring-offset-bg">
            <img
              src="/profile.jpg"
              alt="Weuden Reis"
              className="h-full w-full object-cover"
            />
          </div>
          <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-emerald-400 border-[3px] border-bg" />
        </div>

        {/* Greeting */}
        <p
          ref={greetingRef}
          className="text-xs md:text-sm text-white/30 font-medium tracking-[0.3em] uppercase mb-6"
          style={{ opacity: 0 }}
        >
          Oi! Eu sou o
        </p>

        {/* Decorative lines + Heading */}
        <div className="flex items-center gap-6 mb-4 w-full justify-center">
          <div
            ref={lineLeftRef}
            className="hidden md:block h-px w-16 bg-gradient-to-r from-transparent to-accent/40 origin-right"
            style={{ transform: "scaleX(0)" }}
          />
          <div ref={headingRef} style={{ opacity: 0 }}>
            <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-bold tracking-[-0.03em] text-white leading-[1.1] min-h-[2.3em] sm:min-h-[1.2em] flex items-center justify-center whitespace-nowrap">
              <TypeAnimationComponent
                sequence={[
                  "Weuden Reis",
                  3000,
                  "Engenheiro de Software",
                  2000,
                  "Weuden Reis",
                  4000,
                ]}
                repeat={Infinity}
                cursor={true}
              />
            </h1>
          </div>
          <div
            ref={lineRightRef}
            className="hidden md:block h-px w-16 bg-gradient-to-l from-transparent to-accent/40 origin-left"
            style={{ transform: "scaleX(0)" }}
          />
        </div>

        {/* Tagline */}
        <p
          ref={taglineRef}
          className="text-base md:text-lg lg:text-xl text-white/40 max-w-lg leading-relaxed font-light mt-6 mb-10"
          style={{ opacity: 0 }}
        >
          Resolvo problemas com{" "}
          <span className="text-white/70 font-normal">tecnologia</span> e
          automatizo o que{" "}
          <span className="text-accent/80 font-normal">importa</span>.
        </p>

        {/* CTA + Social */}
        <div
          ref={ctaRef}
          className="flex flex-col items-center gap-8"
          style={{ opacity: 0 }}
        >
          <div className="flex gap-4 flex-wrap justify-center">
            <a href="#projects" className="magnetic-btn group">
              Explorar projetos
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>
            <a
              href="#contact"
              className="inline-flex items-center gap-2 px-7 py-3 rounded-full text-sm font-medium text-white/50 hover:text-white/90 border border-white/[0.06] hover:border-white/[0.12] transition-all duration-300"
            >
              Fale comigo
            </a>
          </div>
          <SocialLinks />
        </div>
      </div>

      {/* Scroll Indicator */}
      <div
        ref={scrollRef}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        style={{ opacity: 0 }}
      >
        <span className="text-[10px] uppercase tracking-[0.3em] text-white/15 font-medium">
          Scroll
        </span>
        <div className="w-px h-8 bg-gradient-to-b from-white/20 to-transparent" />
      </div>
    </section>
  );
}
