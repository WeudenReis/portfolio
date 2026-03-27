import { motion } from "framer-motion";

type Experience = {
  title: string;
  role: string;
  description: string;
  period: string;
};

type Props = {
  items: Experience[];
};

export default function ExperienceTimeline({ items }: Props) {
  return (
    <div className="space-y-6">
      {items.map((item, index) => (
        <motion.article
          key={item.title}
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-lg shadow-md"
        >
          <div className="absolute left-0 top-0 h-full w-0.5 bg-cyan-400/80" />
          <div className="relative z-10 space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">{item.title}</h3>
              <span className="rounded-full bg-cyan-500/20 px-3 py-1 text-xs text-cyan-100">{item.period}</span>
            </div>
            <p className="text-sm font-medium text-cyan-200">{item.role}</p>
            <p className="text-sm text-slate-300">{item.description}</p>
          </div>
        </motion.article>
      ))}
    </div>
  );
}
