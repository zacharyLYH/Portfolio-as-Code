import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Configure portfolio',
    description: 'Configure your own portfolio-as-code',
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return <div>{children}</div>;
}
