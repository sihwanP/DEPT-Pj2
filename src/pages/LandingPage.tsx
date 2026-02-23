import React from 'react';
import { HeroSection } from '../components/home/HeroSection';
import { FloorGuideSection } from '../components/home/FloorGuideSection';
import { FeaturedSection } from '../components/home/FeaturedSection';
import { AboutSection } from '../components/home/AboutSection';

const LandingPage: React.FC = () => {
    return (
        <>
            <HeroSection />
            <FloorGuideSection />
            <FeaturedSection />
            <AboutSection />
        </>
    );
};

export default LandingPage;
