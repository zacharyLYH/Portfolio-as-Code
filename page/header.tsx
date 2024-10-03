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
        <div className="grid grid-cols-2">
            <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                    <h1 className="text-5xl font-bold tracking-tighter md:text-7xl">{data.name}</h1>
                    <p className="text-xl text-muted-foreground">💼 {data.title}</p>
                    <div className="flex items-center space-x-2 text-muted-foreground">📍 {data.location}</div>
                    <p className="text-sm text-muted-foreground">{data.pronouns}</p>
                </div>
                <div className="space-y-2">
                    <h2 className="text-2xl font-semibold">Short Bio 📚</h2>
                    <p className="text-muted-foreground text-pretty text-sm md:text-xl overflow-hidden text-ellipsis break-words">
                        {data.shortBio}
                    </p>
                </div>
                {data.longBio.length > 0 ? (
                    <Accordion type="single" collapsible>
                        <AccordionItem value="item-1">
                            <AccordionTrigger>
                                <span className="font-bold">More about me! 📚📚📚</span>
                            </AccordionTrigger>
                            <AccordionContent>
                                <Card>
                                    <CardContent className="pt-6">
                                        <p className="text-muted-foreground text-pretty text-sm overflow-hidden text-ellipsis break-words">
                                            {data.longBio}
                                        </p>
                                    </CardContent>
                                </Card>
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                ) : null}
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    <Button asChild className="w-full sm:w-auto">
                        <a href={data.resumeLink} download>
                            <FileText className="mr-2 h-4 w-4" />
                            Download Resume
                        </a>
                    </Button>
                    <div className="flex justify-center sm:justify-start space-x-4 overflow-x-auto flex-nowrap">
                        {data.socials.map((social, index) => {
                            const Icon = socialIcons[social.platform.toLowerCase() as keyof typeof socialIcons] || null;
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
            <div className="flex items-center justify-center lg:justify-end">
                <Image
                    src={data.image}
                    alt={data.name}
                    width={400}
                    height={400}
                    className="overflow-hidden rounded-lg object-cover object-center"
                />
            </div>
        </div>
    );
}
