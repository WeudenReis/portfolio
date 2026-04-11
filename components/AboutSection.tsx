"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const skills = [
  { name: "Python", level: 80 },
  { name: "JavaScript", level: 75 },
  { name: "HTML / CSS", level: 85 },
  { name: "APIs REST / SaaS", level: 80 },
  { name: "Git / Linux", level: 70 },
  { name: "Kubernetes", level: 50 },
];

const stats = [
  { value: "4+", label: "Anos de experiência" },
  { value: "3+", label: "Projetos entregues" },
  { value: "100%", label: "Foco em resultado" },
];

export default function AboutSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Reveal title
      gsap.fromTo(
        ".about-title",
        { y: 80, opacity: 0, filter: "blur(6px)" },
        {
          y: 0,
          opacity: 1,
          filter: "blur(0px)",
          duration: 1,
          ease: "power3.out",
          scrollTrigger: { trigger: ".about-title", start: "top 85%" },
        }
      );

      // Text paragraphs
      gsap.fromTo(
        ".about-text p",
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.7,
          stagger: 0.12,
          ease: "power3.out",
          scrollTrigger: { trigger: ".about-text", start: "top 80%" },
        }
      );

      // Image parallax
      gsap.fromTo(
        ".about-image",
        { y: 60, opacity: 0, scale: 0.9 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 1.2,
          ease: "power3.out",
          scrollTrigger: { trigger: ".about-image", start: "top 85%" },
        }
      );

      // Image inner parallax on scroll
      gsap.to(".about-image-inner", {
        yPercent: -15,
        ease: "none",
        scrollTrigger: {
          trigger: ".about-image",
          start: "top bottom",
          end: "bottom top",
          scrub: 1,
        },
      });

      // Skill bars
      gsap.utils.toArray<HTMLElement>(".skill-fill").forEach((bar) => {
        gsap.fromTo(
          bar,
          { scaleX: 0 },
          {
            scaleX: 1,
            duration: 1.4,
            ease: "power3.out",
            scrollTrigger: { trigger: bar, start: "top 92%" },
          }
        );
      });

      // Stats
      gsap.fromTo(
        ".stat-card",
        { y: 40, opacity: 0, scale: 0.95 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.6,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: { trigger: ".stats-grid", start: "top 85%" },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="about"
      className="relative py-32 px-4 sm:px-6 lg:px-8 section-glow"
    >
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.1fr] gap-20 items-start">
          {/* Left — Text */}
          <div className="space-y-10 order-2 lg:order-1">
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-accent/80 mb-3 font-medium">
                Sobre
              </p>
              <h2
                className="about-title text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight gradient-text"
                style={{ opacity: 0 }}
              >
                Quem sou eu
              </h2>
            </div>

            <div className="about-text space-y-5 text-white/45 leading-[1.8] text-[15px]">
              <p style={{ opacity: 0 }}>
                Graduando em Engenharia de Software na UNIGOIÁS, com experiência
                em{" "}
                <span className="text-white/80 font-medium">suporte técnico</span>{" "}
                e integrações via API em plataformas SaaS.
              </p>
              <p style={{ opacity: 0 }}>
                <span className="text-accent font-semibold">4 anos</span>{" "}
                de vivência em tecnologia — de manutenção de hardware a
                suporte avançado com APIs, Kubernetes e automação.
              </p>
              <p style={{ opacity: 0 }}>
                Experiência com onboarding técnico, diagnóstico de integrações
                e colaboração com times de desenvolvimento para{" "}
                <span className="text-white/70">resolver problemas</span> e
                otimizar processos.
              </p>
            </div>

            {/* Skills */}
            <div className="space-y-5 pt-4">
              <h3 className="text-xs uppercase tracking-[0.2em] text-white/20 font-medium">
                Stack principal
              </h3>
              {skills.map((skill) => (
                <div key={skill.name} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-white/60">{skill.name}</span>
                    <span className="text-[11px] text-white/20 font-mono">
                      {skill.level}%
                    </span>
                  </div>
                  <div className="h-[3px] bg-white/[0.04] rounded-full overflow-hidden">
                    <div
                      className="skill-fill h-full rounded-full origin-left bg-gradient-to-r from-accent to-accent/30"
                      style={{
                        width: `${skill.level}%`,
                        transform: "scaleX(0)",
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right — Image + Stats */}
          <div className="order-1 lg:order-2 space-y-8">
            <div
              className="about-image relative rounded-3xl overflow-hidden glow-card h-[350px] md:h-[450px]"
              style={{ opacity: 0 }}
            >
              <img
                src="/workspace.jpg"
                alt="Workspace de Weuden Reis"
                className="about-image-inner h-[130%] w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/20 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6">
                <p className="text-white/70 text-sm font-medium">Weuden Reis</p>
                <p className="text-white/30 text-xs">
                  Graduando em Engenharia de Software
                </p>
              </div>
            </div>

            {/* Stats */}
            <div className="stats-grid grid grid-cols-3 gap-3">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="stat-card text-center p-5 rounded-2xl border border-white/[0.04] bg-white/[0.015] hover:border-accent/10 transition-colors duration-300"
                  style={{ opacity: 0 }}
                >
                  <p className="text-2xl md:text-3xl font-bold text-accent tracking-tight">
                    {stat.value}
                  </p>
                  <p className="text-[11px] text-white/30 mt-1.5 leading-tight">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
