import { parsePortfolioData } from '@/lib/parseJson';
import fs from 'fs';
import path from 'path';
import Link from 'next/link';

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
    <div>
      {portfolioData ? (
        <div>
          <h1>{portfolioData.name}</h1>
          <p>{portfolioData.shortBio}</p>
        </div>
      ) : (
        <div className='flex items-center justify-center h-screen'>
            <p>Failed to load portfolio data. Make sure portfolio_data.json is at the Root of the project directory and is a valid json. Alternatively, <Link className='text-blue-500' href= "/configure">recreate your portfolio json config file</Link>.</p>
        </div>
      )}
    </div>
  );
}
