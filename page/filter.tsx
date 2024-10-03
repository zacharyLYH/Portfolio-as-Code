'use client';

import { Button } from '@/components/ui/button';
import CustomSpotlight from './custom-spotlight';
import { useState } from 'react';
import { FilterIcon } from 'lucide-react';
import { filterPortfolioData } from '@/lib/filterEngine';

interface FilterProps {
    portfolioData: PortfolioData | null;
    skills: string[];
}

export default function Filter({ portfolioData, skills }: FilterProps) {
    const [isSpotlightOpen, setIsSpotlightOpen] = useState(false);
    const [results, setResults] = useState<SearchResultRecord[]>([]);

    const handleSearch = (params: FilterCriteria) => {
        const resultIds = filterPortfolioData(portfolioData!, params);
        setResults(resultIds);
        //debug
        // console.log(params);
    };

    const queryPfById = (id: string) => {
        if (portfolioData?.achievements) {
            for (const data of portfolioData?.achievements) {
                if (data.id === id) {
                    return data;
                }
            }
        }
        if (portfolioData?.education) {
            for (const data of portfolioData?.education) {
                if (data.id === id) {
                    return data;
                }
            }
        }
        if (portfolioData?.jobsProjects) {
            for (const data of portfolioData?.jobsProjects) {
                if (data.id === id) {
                    return data;
                }
            }
        }
    };

    return (
        <>
            {portfolioData && (
                <div className="fixed bottom-[2vh] right-[2vw] z-50 md:bottom-8 md:right-8">
                    {!isSpotlightOpen && (
                        <Button
                            onClick={() => setIsSpotlightOpen(true)}
                            className="rounded-full shadow-lg animate-bounce w-12 h-12 lg:w-20 lg:h-20"
                        >
                            <FilterIcon className="h-6 w-6" />
                        </Button>
                    )}
                    <CustomSpotlight
                        isOpen={isSpotlightOpen}
                        onClose={() => {
                            setIsSpotlightOpen(false);
                            setResults([]);
                        }}
                        onSearch={handleSearch}
                        skills={skills}
                        searchResults={results}
                        setSearchResults={setResults}
                        queryById={queryPfById}
                    />
                </div>
            )}
        </>
    );
}
