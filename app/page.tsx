import { parsePortfolioData } from '@/lib/parseJson';
import fs from 'fs';
import path from 'path';
import Link from 'next/link';
import PortfolioPage from '../page/header';
import Experience from '@/page/experience';
import Projects from '@/page/projects';
import Education from '@/page/education';
import Achievement from '@/page/achievement';

export default function Home() {
    const filePath = path.join(process.cwd(), 'portfolio_data.json');
    let portfolioData: PortfolioData | null = null;
    try {
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        portfolioData = parsePortfolioData(JSON.parse(fileContent));
    } catch (error) {
        console.error('Error reading or parsing portfolio_data.json:', error);
    }
    return (
        <>
            {portfolioData ? (
                <div className="container items-center mx-auto my-4 md:my-8">
                    <PortfolioPage data={portfolioData} /> {/* ssr */}
                    <Experience experiences={portfolioData.jobsProjects.filter((job) => job.isJob)} /> {/* ssr */}
                    <Projects projects={portfolioData.jobsProjects.filter((job) => !job.isJob)} />
                    <Education educationItems={portfolioData.education} /> {/* ssr */}
                    <Achievement achievement={portfolioData.achievements} />
                </div>
            ) : (
                <div className="flex items-center justify-center h-screen">
                    <p>
                        Failed to load portfolio data. Make sure portfolio_data.json is at the Root of the project
                        directory and is a valid json. Alternatively,{' '}
                        <Link className="text-blue-500 hover:underline cursor-pointer" href="/configure">
                            recreate your portfolio json config file
                        </Link>
                        .
                    </p>
                </div>
            )}
        </>
    );
}
