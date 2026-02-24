"use client";

import { ContentBlock } from "./ContentBlock";
import { Section } from "./Section";
import { landingSections } from "@/content/landing";

export function LandingSteps() {
  return (
    <div className="space-y-6">
      {landingSections.map((section) => (
        <Section
          key={section.id}
          id={section.id}
          title={section.title}
          subtitle={section.subtitle}
          useCard={true}
        >
          {section.blocks.map((block, blockIndex) => (
            <ContentBlock key={blockIndex} block={block} />
          ))}
        </Section>
      ))}
    </div>
  );
}
