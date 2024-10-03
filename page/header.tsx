import Image from 'next/image';
import { Linkedin, Mail, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { GitHubLogoIcon, InstagramLogoIcon, TwitterLogoIcon } from '@radix-ui/react-icons';

interface PortfolioHeroInterface {
    data: PortfolioData;
}

const socialIcons = {
    github: GitHubLogoIcon,
    twitter: TwitterLogoIcon,
    linkedin: Linkedin,
    email: Mail,
    instagram: InstagramLogoIcon,
};

export default function PortfolioHero({ data }: PortfolioHeroInterface) {
    return (
        <div className="md:grid grid-cols-2">
            <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-8">
                {/* Small screen image (always on top) */}
                <div className="flex-shrink-0 mb-4 md:hidden">
                    <Image
                        src={data.image}
                        alt={data.name}
                        width={100} 
                        height={100}
                        className="rounded-full object-cover"
                    />
                </div>

                {/* Text section */}
                <div className="flex flex-col space-y-4">
                    <div className="space-y-2">
                        <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-7xl">{data.name}</h1>
                        <p className="text-lg sm:text-xl text-muted-foreground">💼 {data.title}</p>
                        <div className="flex items-center space-x-2 text-muted-foreground">📍 {data.location}</div>
                        <p className="text-sm sm:text-base text-muted-foreground">{data.pronouns}</p>
                    </div>

                    {/* Short Bio */}
                    <div className="space-y-2">
                        <h2 className="text-xl sm:text-2xl font-semibold">Short Bio 📚</h2>
                        <p className="text-muted-foreground text-sm sm:text-base md:text-xl overflow-hidden text-ellipsis break-words">
                            {data.shortBio}
                        </p>
                    </div>

                    {/* Accordion for long bio */}
                    {data.longBio.length > 0 ? (
                        <Accordion type="single" collapsible>
                            <AccordionItem value="item-1">
                                <AccordionTrigger>
                                    <span className="font-bold">More about me! 📚📚📚</span>
                                </AccordionTrigger>
                                <AccordionContent>
                                    <Card>
                                        <CardContent className="pt-6">
                                            <p className="text-muted-foreground text-sm overflow-hidden text-ellipsis break-words">
                                                {data.longBio}
                                            </p>
                                        </CardContent>
                                    </Card>
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>
                    ) : null}

                    {/* Resume download and social icons */}
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                        <Button asChild className="w-full sm:w-auto">
                            <a href={data.resumeLink} target="_blank" rel="noopener noreferrer" download>
                                <FileText className="mr-2 h-4 w-4" />
                                Download Resume
                            </a>
                        </Button>

                        <div className="flex justify-center sm:justify-start space-x-4 overflow-x-auto flex-nowrap">
                            {data.socials.map((social, index) => {
                                const Icon =
                                    socialIcons[social.platform.toLowerCase() as keyof typeof socialIcons] || null;
                                return (
                                    <Button key={index} variant="ghost" size="icon" asChild>
                                        <a
                                            href={social.url}
                                            aria-label={social.platform}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-foreground/80 hover:text-foreground transition-colors"
                                        >
                                            {Icon && <Icon className="h-5 w-5" />}
                                        </a>
                                    </Button>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>

            {/* Large screen image (beside text) */}
            <div className="hidden md:flex items-center justify-center lg:justify-end">
                <Image
                    src={data.image}
                    alt={data.name}
                    width={400}
                    height={400}
                    className="rounded-lg object-cover object-center"
                />
            </div>
        </div>
    );
}
