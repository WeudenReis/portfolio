"use client";

import Navbar from "@/components/Navbar";
import CustomCursor from "@/components/CustomCursor";
import HeroSection from "@/components/HeroSection";
import ProjectsSection from "@/components/ProjectsSection";
import AboutSection from "@/components/AboutSection";
import ExperienceSection from "@/components/ExperienceSection";
import FooterSection from "@/components/FooterSection";

export default function Home() {
  return (
    <div style={{ overflowX: 'clip' }}>
      <CustomCursor />
      <Navbar />
      <HeroSection />
      <ProjectsSection />
      <AboutSection />
      <ExperienceSection />
      <FooterSection />
    </div>
  );
}
