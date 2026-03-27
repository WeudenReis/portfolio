"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ChevronRight, Briefcase, Calendar } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

interface Experience {
  id: string;
  company: string;
  position: string;
  period: string;
  type: string;
  achievements: string[];
}

const experiences: Experience[] = [
  {
    id: "chatpro",
    company: "ChatPro",
    position: "Suporte Técnico",
    period: "JAN 2026 - Atual",
    type: "APIs & Automação",
    achievements: [
      "Diagnóstico avançado de APIs e Webhooks para integração com sistemas de atendimento.",
      "Automação de fluxos usando IA, melhorando SLA e assertividade de chatbots.",
      "Estruturou intenções de IA para aumentar a precisão nas respostas de bots.",
    ],
  },
  {
    id: "kybronze",
    company: "Ky Bronze",
    position: "Analista de RH",
    period: "Jan 2025 - Jun 2026",
    type: "Gestão & Processos",
    achievements: [
      "Transição estratégica de carreira usando gestão de pessoas para otimizar processos administrativos.",
      "Implementou automações que reduziram o tempo de trâmite em 40%.",
      "Desenvolveu visão analítica e resolução de problemas complexos em ambiente industrial.",
    ],
  },
];

export default function ExperienceSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [activeId, setActiveId] = useState<string>(experiences[0].id);
  const activeExperience = experiences.find((exp) => exp.id === activeId);
  const detailsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Section title
      gsap.fromTo(
        ".exp-header",
        { y: 60, opacity: 0, filter: "blur(6px)" },
        {
          y: 0,
          opacity: 1,
          filter: "blur(0px)",
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: { trigger: ".exp-header", start: "top 85%" },
        }
      );

      // Card wrapper
      gsap.fromTo(
        ".exp-card-wrapper",
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: { trigger: ".exp-card-wrapper", start: "top 82%" },
        }
      );

      // Tab buttons
      gsap.fromTo(
        ".exp-btn",
        { x: -20, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.5,
          stagger: 0.08,
          ease: "power3.out",
          scrollTrigger: { trigger: ".exp-btn", start: "top 88%" },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Animate details on tab switch
  useEffect(() => {
    if (detailsRef.current) {
      gsap.fromTo(
        detailsRef.current.children,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.4, stagger: 0.06, ease: "power2.out" }
      );
    }
  }, [activeId]);

  return (
    <section
      ref={sectionRef}
      id="experience"
      className="relative py-32 px-4 sm:px-6 lg:px-8 section-glow"
    >
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="exp-header mb-16" style={{ opacity: 0 }}>
          <p className="text-xs uppercase tracking-[0.25em] text-accent/80 mb-3 font-medium">
            Trajetória
          </p>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight gradient-text">
            Experiência
          </h2>
        </div>

        {/* Card */}
        <div className="exp-card-wrapper glow-card p-0 md:p-0 overflow-hidden" style={{ opacity: 0 }}>
          <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr]">
            {/* Left — Tabs */}
            <div className="p-4 md:p-6 lg:border-r border-white/[0.04] space-y-2 bg-white/[0.01]">
              {experiences.map((exp) => (
                <button
                  key={exp.id}
                  onClick={() => setActiveId(exp.id)}
                  className={`exp-btn w-full text-left px-4 py-4 rounded-xl transition-all duration-300 ${
                    activeId === exp.id
                      ? "bg-accent/[0.08] border border-accent/20 shadow-[0_0_20px_rgba(245,158,11,0.04)]"
                      : "border border-transparent hover:bg-white/[0.02]"
                  }`}
                  style={{ opacity: 0 }}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-300 ${
                        activeId === exp.id
                          ? "bg-accent/20 text-accent shadow-[0_0_15px_rgba(245,158,11,0.1)]"
                          : "bg-white/[0.03] text-white/25"
                      }`}
                    >
                      <Briefcase className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <p
                        className={`font-semibold text-sm truncate transition-colors ${
                          activeId === exp.id ? "text-white" : "text-white/50"
                        }`}
                      >
                        {exp.company}
                      </p>
                      <p className="text-[11px] text-white/25 truncate">
                        {exp.type}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {/* Right — Details */}
            {activeExperience && (
              <div ref={detailsRef} className="p-6 md:p-10 space-y-7">
                <div>
                  <h3 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
                    {activeExperience.position}
                  </h3>
                  <p className="text-base text-accent font-semibold mt-1">
                    @ {activeExperience.company}
                  </p>
                </div>

                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.03] border border-white/[0.05]">
                  <Calendar className="w-3 h-3 text-white/30" />
                  <span className="text-xs text-white/40 font-medium">
                    {activeExperience.period}
                  </span>
                  {activeExperience.period.includes("Atual") && (
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  )}
                </div>

                <div className="space-y-4 pt-5 border-t border-white/[0.04]">
                  {activeExperience.achievements.map((achievement, idx) => (
                    <div key={idx} className="flex gap-4 items-start group">
                      <div className="mt-1 w-6 h-6 rounded-lg bg-accent/[0.06] flex items-center justify-center flex-shrink-0 group-hover:bg-accent/[0.12] transition-all duration-300 border border-accent/[0.08]">
                        <ChevronRight className="w-3 h-3 text-accent/70 group-hover:text-accent transition-colors" />
                      </div>
                      <p className="text-white/50 leading-relaxed text-[14px] md:text-[15px] group-hover:text-white/75 transition-colors duration-300">
                        {achievement}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
