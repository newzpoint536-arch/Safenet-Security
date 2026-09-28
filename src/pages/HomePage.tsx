import React from 'react';
import { CinematicHeroSlider } from '../components/hero/CinematicHeroSlider';
import { StatsSection } from '../components/home/StatsSection';
import { ServicesMatrix } from '../components/home/ServicesMatrix';
import { OperationalProcess } from '../components/home/OperationalProcess';
import { WhyChooseUs } from '../components/home/WhyChooseUs';
import { InteractiveAssessmentTeaser } from '../components/home/InteractiveAssessmentTeaser';
import { TestimonialsSection } from '../components/home/TestimonialsSection';
import { LatestBlogSection } from '../components/home/LatestBlogSection';

export const HomePage: React.FC = () => {
  return (
    <div className="space-y-0">
      <CinematicHeroSlider />
      <StatsSection />
      <ServicesMatrix />
      <OperationalProcess />
      <WhyChooseUs />
      <InteractiveAssessmentTeaser />
      <TestimonialsSection />
      <LatestBlogSection />
    </div>
  );
};
