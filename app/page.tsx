import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import SobreMim from "@/components/SobreMim";
import Stacks from "@/components/Stacks";
import Projetos from "@/components/Projetos";
import Trajetoria from "@/components/Trajetoria";
import Stats from "@/components/Stats";
import Contato from "@/components/Contato";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="overflow-x-clip">
        <Hero />
        <SobreMim />
        <Stacks />
        <Projetos />
        <Trajetoria />
        <Stats />
      </main>
      <Contato />
    </>
  );
}
