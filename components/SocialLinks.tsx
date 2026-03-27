import { Code2, User, Heart } from "lucide-react";

const links = [
  {
    label: "GitHub",
    icon: Code2,
    href: "https://github.com/weudenreis",
  },
  {
    label: "LinkedIn",
    icon: User,
    href: "https://www.linkedin.com/in/weuden-dos-reis-b25945320/",
  },
  {
    label: "Instagram",
    icon: Heart,
    href: "https://instagram.com/weudenreis",
  },
];

export default function SocialLinks() {
  return (
    <div className="flex flex-wrap justify-center gap-3">
      {links.map((link) => {
        const Icon = link.icon;
        return (
          <a
            key={link.label}
            href={link.href}
            target="_blank"
            rel="noreferrer"
            className="w-10 h-10 rounded-xl border border-white/[0.06] bg-white/[0.02] flex items-center justify-center text-white/30 hover:text-accent hover:border-accent/20 hover:bg-accent/[0.05] transition-all duration-300"
            title={link.label}
          >
            <Icon className="h-4 w-4" />
          </a>
        );
      })}
    </div>
  );
}
