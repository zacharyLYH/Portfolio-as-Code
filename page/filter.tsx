'use client';

import { Button } from '@/components/ui/button';
import CustomSpotlight from './custom-spotlight';
import { useState } from 'react';
import { FilterIcon } from 'lucide-react';

interface FilterProps {
    portfolioData: ReducedPortfolioData | null;
    skills: string[];
}

export default function Filter({ portfolioData, skills }: FilterProps) {
    const [isSpotlightOpen, setIsSpotlightOpen] = useState(false);

    const handleSearch = (params: FilterCriteria) => {
        // filterPortfolioData(portfolioData!, params);
        //debug
        console.log(params);
    };

    return (
        <>
            {portfolioData && (
                <div className="fixed bottom-[2vh] right-[2vw] z-50 md:bottom-8 md:right-8">
                    {!isSpotlightOpen && (
                        <Button onClick={() => setIsSpotlightOpen(true)} className="rounded-full shadow-lg animate-bounce w-12 h-12 lg:w-20 lg:h-20">
                            <FilterIcon className="h-6 w-6" />
                        </Button>
                    )}
                    <CustomSpotlight
                        isOpen={isSpotlightOpen}
                        onClose={() => setIsSpotlightOpen(false)}
                        onSearch={handleSearch}
                        skills={skills}
                    />
                </div>
            )}
        </>
    );
}
