'use client';

import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Autoplay from 'embla-carousel-autoplay';
import { Badge } from '@/components/ui/badge';
import { Calendar, LinkIcon } from 'lucide-react';
import { useRef } from 'react';

interface AchievementPageProps {
    achievement: Achievement[];
}

function formatDate(date: Date): string {
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
}

export default function Achievement({ achievement }: AchievementPageProps) {
    const plugin = useRef(Autoplay({ delay: 2000, stopOnInteraction: true }));
    return (
        <div className="my-4 mt-8 space-y-4 md:mt-16">
            {achievement.length > 0 && (
                <div className="flex flex-col space-y-5 items-center justify-center">
                    <h1 className="text-3xl font-bold tracking-tighter md:text-5xl">Achievement</h1>
                    <Carousel
                        plugins={[plugin.current]}
                        onMouseEnter={plugin.current.stop}
                        onMouseLeave={plugin.current.reset}
                        className="flex w-full max-w-5xl cursor-pointer"
                    >
                        <CarouselContent>
                            {achievement.map((item) => (
                                <CarouselItem key={item.id}>
                                    <Card>
                                        <CardHeader>
                                            <CardTitle>{item.name}</CardTitle>
                                            <CardDescription>{item.description}</CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="flex items-center gap-2 text-muted-foreground mb-4">
                                                <Calendar className="h-4 w-4" />
                                                <span>{formatDate(item.dateAwarded!)}</span>
                                            </div>
                                            {item.skills.length > 0 && (
                                                <div className="my-4">
                                                    <h4 className="text-sm font-semibold mb-2">Skills:</h4>
                                                    <div className="flex flex-wrap gap-2">
                                                        {item.skills.map((skill, skillIndex) => (
                                                            <Badge
                                                                key={`${skill}-${skillIndex}-${item.id}`}
                                                                variant="default"
                                                                className="text-xs"
                                                            >
                                                                {skill}
                                                            </Badge>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                            {item.links.length > 0 && (
                                                <div className="flex flex-col">
                                                    <h4 className="font-semibold flex items-center gap-2">Links:</h4>
                                                    <ul className="list-disc list-inside">
                                                        {item.links.map((link, linkIndex) => (
                                                            <li key={`${link}-${linkIndex}`} className="flex text-sm">
                                                                <a
                                                                    href={link}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="text-primary hover:underline flex items-center hover:text-blue-700"
                                                                >
                                                                    <LinkIcon className="h-3 w-3 mr-2" />
                                                                    {link}
                                                                </a>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}
                                        </CardContent>
                                    </Card>
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                        <CarouselPrevious />
                        <CarouselNext />
                    </Carousel>
                </div>
            )}
        </div>
    );
}
