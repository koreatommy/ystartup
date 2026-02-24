"use client";

import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface SectionProps {
  id?: string;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
  useCard?: boolean;
}

export function Section({
  id,
  title,
  subtitle,
  children,
  className,
  useCard = true,
}: SectionProps) {
  if (useCard) {
    return (
      <section id={id} className={cn("scroll-mt-6", className)}>
        <Card variant="glass">
          <CardHeader>
            <CardTitle className="font-sidebar text-xl text-[var(--color-text)]">
              {title}
            </CardTitle>
            {subtitle && (
              <p className="text-[var(--color-text-muted)] font-main text-sm">
                {subtitle}
              </p>
            )}
          </CardHeader>
          <CardContent className="flex flex-col gap-4">{children}</CardContent>
        </Card>
      </section>
    );
  }

  return (
    <section id={id} className={cn("scroll-mt-6", className)}>
      <h2 className="font-sidebar text-xl font-semibold text-[var(--color-text)]">
        {title}
      </h2>
      {subtitle ? (
        <p className="mt-1 text-[var(--color-text-muted)] font-main text-sm">
          {subtitle}
        </p>
      ) : null}
      <div className="mt-4 flex flex-col gap-4">{children}</div>
    </section>
  );
}
