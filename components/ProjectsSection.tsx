"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowUpRight, ExternalLink, Code2 } from "lucide-react";
import { projects, type Project } from "@/lib/projects";

gsap.registerPlugin(ScrollTrigger);

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    // Mouse follow glow
    const handleMouseMove = (e: MouseEvent) => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      card.style.setProperty("--mouse-x", `${x}%`);
      card.style.setProperty("--mouse-y", `${y}%`);
    };
    card.addEventListener("mousemove", handleMouseMove);
    return () => card.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div
      ref={cardRef}
      className="project-card glow-card group flex-shrink-0 w-[85vw] md:w-[60vw] lg:w-[42vw] h-[70vh] md:h-[75vh] flex flex-col relative"
    >
      {/* Project image area */}
      <div className="relative h-1/2 overflow-hidden rounded-t-3xl">
        <img
          src={project.image}
          alt={project.title}
          className="absolute inset-0 w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
          onError={(e) => {
            // Hide broken image and show fallback
            (e.target as HTMLImageElement).style.display = "none";
          }}
        />
        <div
          className="absolute inset-0 bg-gradient-to-br"
          style={{
            background: `linear-gradient(135deg, ${project.color}22, ${project.color}08)`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-surface/90 via-transparent to-transparent" />
        {/* Number tag */}
        <div className="absolute top-6 left-6">
          <span className="text-xs font-mono text-white/20 bg-white/[0.04] px-3 py-1.5 rounded-full border border-white/[0.06] backdrop-blur-sm">
            0{index + 1} / 0{projects.length}
          </span>
        </div>
      </div>

      {/* Card content */}
      <div className="flex flex-col flex-1 p-6 md:p-8">
        <h3 className="text-xl md:text-2xl font-bold text-white mb-3 group-hover:text-accent transition-colors duration-300">
          {project.title}
        </h3>

        <p className="text-sm text-white/40 leading-relaxed mb-5 flex-1 line-clamp-3">
          {project.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-6">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="text-[10px] font-medium px-2.5 py-1 rounded-full border text-white/50"
              style={{
                borderColor: `${project.color}20`,
                backgroundColor: `${project.color}08`,
              }}
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Links */}
        <div className="flex items-center gap-4">
          <a
            href={project.link}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 text-sm font-medium text-accent hover:text-accent-light transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            Live
            <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300" />
          </a>
          <a
            href={project.repo}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 text-sm font-medium text-white/40 hover:text-white/70 transition-colors"
          >
            <Code2 className="w-3.5 h-3.5" />
            Código
          </a>
        </div>
      </div>
    </div>
  );
}

export default function ProjectsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const track = trackRef.current;
      const trigger = triggerRef.current;
      if (!track || !trigger) return;

      // Header fade-in
      gsap.fromTo(
        headerRef.current,
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: headerRef.current,
            start: "top 85%",
          },
        }
      );

      // Calculate how far to scroll
      const getScrollAmount = () => {
        return -(track.scrollWidth - window.innerWidth);
      };

      // Horizontal scroll with pin
      const horizontalScroll = gsap.to(track, {
        x: getScrollAmount,
        ease: "none",
        scrollTrigger: {
          trigger: trigger,
          start: "top top",
          end: () => `+=${track.scrollWidth - window.innerWidth}`,
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
          anticipatePin: 1,
          onUpdate: (self) => {
            // Update progress bar
            if (progressRef.current) {
              gsap.set(progressRef.current, {
                scaleX: self.progress,
              });
            }
          },
        },
      });

      // Parallax effect on each card — cards come from slightly different speeds
      const cards = track.querySelectorAll(".project-card");
      cards.forEach((card, i) => {
        gsap.fromTo(
          card,
          {
            y: i % 2 === 0 ? 30 : -30,
            rotateZ: i % 2 === 0 ? 1 : -1,
          },
          {
            y: 0,
            rotateZ: 0,
            ease: "none",
            scrollTrigger: {
              trigger: trigger,
              start: "top top",
              end: () => `+=${track.scrollWidth * 0.5}`,
              scrub: 1.5,
            },
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="projects" className="relative">
      {/* Header - outside pin */}
      <div className="section-glow py-20 px-4 sm:px-6 lg:px-8">
        <div ref={headerRef} className="max-w-6xl mx-auto" style={{ opacity: 0 }}>
          <div className="flex items-end justify-between mb-4">
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-accent/80 mb-3 font-medium">
                Portfolio
              </p>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight gradient-text">
                Projetos em destaque
              </h2>
            </div>
            <p className="hidden md:block text-sm text-white/25 max-w-xs text-right leading-relaxed">
              Scroll para navegar pelos projetos. Cada um conta uma história diferente.
            </p>
          </div>
          {/* Progress bar */}
          <div className="mt-8 h-px bg-white/[0.04] rounded-full overflow-hidden">
            <div
              ref={progressRef}
              className="h-full bg-gradient-to-r from-accent/60 to-accent/20 origin-left rounded-full"
              style={{ transform: "scaleX(0)" }}
            />
          </div>
        </div>
      </div>

      {/* Horizontal scroll container */}
      <div ref={triggerRef}>
        <div
          ref={trackRef}
          className="flex items-center gap-8 px-8 md:px-16 py-8"
          style={{ willChange: "transform" }}
        >
          {/* Spacer */}
          <div className="flex-shrink-0 w-4 md:w-12" />

          {projects.map((project, index) => (
            <ProjectCard key={project.title} project={project} index={index} />
          ))}

          {/* End CTA card */}
          <div className="flex-shrink-0 w-[70vw] md:w-[40vw] h-[70vh] md:h-[75vh] flex items-center justify-center">
            <div className="text-center space-y-6">
              <p className="text-white/20 text-sm uppercase tracking-[0.2em]">
                Fim da galeria
              </p>
              <h3 className="text-2xl md:text-3xl font-bold gradient-text">
                Quer ver mais?
              </h3>
              <a href="#contact" className="magnetic-btn inline-flex">
                Vamos conversar
                <ArrowUpRight className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Spacer */}
          <div className="flex-shrink-0 w-4 md:w-12" />
        </div>
      </div>
    </section>
  );
}
