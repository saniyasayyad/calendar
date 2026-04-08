import { format } from "date-fns";

import january from "@/assets/months/january.jpg";
import february from "@/assets/months/february.jpg";
import march from "@/assets/months/march.jpg";
import april from "@/assets/months/april.jpg";
import may from "@/assets/months/may.jpg";
import june from "@/assets/months/june.jpg";
import july from "@/assets/months/july.jpg";
import august from "@/assets/months/august.jpg";
import september from "@/assets/months/september.jpg";
import october from "@/assets/months/october.jpg";
import november from "@/assets/months/november.jpg";
import december from "@/assets/months/december.jpg";

const monthImages: Record<number, string> = {
  0: january,
  1: february,
  2: march,
  3: april,
  4: may,
  5: june,
  6: july,
  7: august,
  8: september,
  9: october,
  10: november,
  11: december,
};

interface HeroSectionProps {
  currentMonth: Date;
}

export default function HeroSection({ currentMonth }: HeroSectionProps) {
  const heroImage = monthImages[currentMonth.getMonth()];

  return (
    <div className="relative w-full overflow-hidden rounded-xl aspect-[16/9] lg:aspect-auto lg:h-full min-h-[200px]">
      <img
        src={heroImage}
        alt={`${format(currentMonth, "MMMM")} scenery`}
        width={1024}
        height={576}
        className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500"
      />
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-[hsl(var(--hero-overlay)/0.7)] via-transparent to-transparent" />

      {/* Month label overlay */}
      <div className="absolute bottom-0 left-0 right-0 p-6">
        <p className="text-sm font-body font-medium tracking-widest uppercase opacity-80 text-primary-foreground">
          {format(currentMonth, "yyyy")}
        </p>
        <h1 className="text-4xl lg:text-5xl font-heading font-bold text-primary-foreground tracking-tight">
          {format(currentMonth, "MMMM")}
        </h1>
      </div>
    </div>
  );
}
