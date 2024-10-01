import { GitHubLogoIcon } from "@radix-ui/react-icons";

export default function Footer(){
    return (
        <footer className="bg-gray-100 rounded-lg shadow mt-8">
        <div className="flex flex-col w-full mx-auto max-w-screen-xl p-4 gap-y-2 items-center ">
            <span className="flex items-center justify-center space-x-2">
                <GitHubLogoIcon className="w-6 h-6" />
                <a
                    href="https://github.com/zacharyLYH/portfolio-as-code"
                    className="hover:underline text-blue-500"
                >
                    Source code
                </a>
            </span>
            <a href="https://zacharyLYH.bio" className="hover:underline text-blue-500 text-sm">
                Created with 🫶 by Zachary Lee
            </a>
        </div>
    </footer>
    )
}