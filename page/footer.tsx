import { GitHubLogoIcon } from '@radix-ui/react-icons';
import Link from 'next/link';

export default function Footer() {
    return (
        <footer className="rounded-lg shadow mt-8">
            <div className="flex flex-col md:flex-row justify-between w-full mx-auto max-w-screen-xl p-4 gap-y-2 items-center">
                <span className="flex items-center justify-center space-x-2">
                    <GitHubLogoIcon className="w-6 h-6" />
                    <a
                        href="https://github.com/zacharyLYH/portfolio-as-code"
                        className="hover:underline text-blue-500 text-sm"
                    >
                        Source code
                    </a>
                </span>
                <a href="https://zacharyLYH.bio" className="hover:underline text-blue-500 text-sm">
                    Created with 🫶 by Zachary Lee
                </a>
                <Link href="/configure" className="hover:underline text-blue-500 text-sm">
                    ✔️ Build your own portfolio now
                </Link>
            </div>
        </footer>
    );
}
