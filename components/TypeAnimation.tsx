"use client";

import { TypeAnimation } from "react-type-animation";

interface TypeAnimationProps {
  sequence: (string | number)[];
  repeat?: number;
  cursor?: boolean;
  className?: string;
}

export default function TypeAnimationComponent({
  sequence,
  repeat = Infinity,
  cursor = true,
  className = "",
}: TypeAnimationProps) {
  return (
    <TypeAnimation
      sequence={sequence}
      repeat={repeat}
      speed={80}
      deletionSpeed={80}
      wrapper="span"
      cursor={cursor}
      className={className}
      style={{ opacity: 0.97, transition: "opacity 0.4s ease" }}
    />
  );
}
