interface ExperienceProps {
  company: string;
  role: string;
  period: string;
  description: string[];
}

export default function ExperienceCard({ experience }: { experience: ExperienceProps }) {
  return (
    <div className="border-t border-zinc-800 pt-6">
      <div className="mb-2 flex items-baseline justify-between gap-4">
        <h3 className="text-lg font-bold">{experience.company}</h3>
        <span className="text-sm text-zinc-500">{experience.period}</span>
      </div>
      <p className="mb-4 text-sm text-zinc-400">{experience.role}</p>
      <div className="space-y-2">
        {experience.description.map((line, idx) => (
          <p key={idx} className="text-sm text-zinc-300 leading-relaxed">
            {line}
          </p>
        ))}
      </div>
    </div>
  );
}
