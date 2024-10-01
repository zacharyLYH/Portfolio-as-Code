import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { formatDate } from '@/lib/utils';
import { CalendarIcon, LinkIcon } from 'lucide-react';

function calculateMonthsSince(startDate: Date): number {
    const now = new Date();
    const yearsDifference = now.getFullYear() - startDate.getFullYear();
    const monthsDifference = now.getMonth() - startDate.getMonth();
    let totalMonths = yearsDifference * 12 + monthsDifference;
    if (totalMonths === 0 && now.getDate() < startDate.getDate()) {
        totalMonths = -1;
    }
    return totalMonths >= 0 ? totalMonths : 0;
}

export default function Experience({ experiences }: { experiences: JobProject[] }) {
    return (
        <div className="my-4 mt-8 space-y-4 md:mt-16">
            {experiences.length > 0 && <h1 className="text-3xl font-bold tracking-tighter md:text-5xl">💎 Experience</h1>}
            <div className="space-y-2">
                {experiences.length > 0 &&
                    experiences.map((exp) => (
                        <Accordion key={exp.id} type="single" collapsible className="w-full md:max-w-screen-xl">
                            <AccordionItem value={exp.id}>
                                <AccordionTrigger>
                                    <span className="font-bold">{exp.title}</span>
                                    <div className="flex items-center text-sm text-muted-foreground">
                                        <TooltipProvider>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <span className="flex">
                                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                                        <span>
                                                            {formatDate(exp.startDate!)} -{' '}
                                                            {exp.isCurrent
                                                                ? 'Present'
                                                                : exp.endDate
                                                                  ? formatDate(exp.endDate)
                                                                  : ''}
                                                        </span>
                                                    </span>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    {calculateMonthsSince(exp.startDate!)} Months
                                                </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
                                    </div>
                                </AccordionTrigger>
                                {(exp.description || exp.links.length > 0 || exp.skills.length > 0) && (
                                    <AccordionContent>
                                        <Card itemID={exp.id}>
                                            <CardContent>
                                                {exp.description && (
                                                    <div className="my-4 ">
                                                        <span className="font-bold text-xl">Description:</span>
                                                        <p className="text-muted-foreground text-pretty text-sm overflow-hidden text-ellipsis break-words">
                                                            {exp.description}
                                                        </p>
                                                    </div>
                                                )}
                                                {exp.description && exp.links.length > 0 && (
                                                    <Separator className="my-4" />
                                                )}
                                                {exp.links.length > 0 && (
                                                    <div className="my-4">
                                                        <h4 className="text-sm font-semibold mb-2">Links:</h4>
                                                        <ul className="list-disc list-inside">
                                                            {exp.links.map((link, linkIndex) => (
                                                                <li
                                                                    key={`${link}-${linkIndex}`}
                                                                    className="flex text-sm"
                                                                >
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
                                                {exp.skills.length > 0 && exp.links.length > 0 && (
                                                    <Separator className="my-4" />
                                                )}
                                                {exp.skills.length > 0 && (
                                                    <div className="my-4">
                                                        <h4 className="text-sm font-semibold mb-2">Skills:</h4>
                                                        <div className="flex flex-wrap gap-2">
                                                            {exp.skills.map((skill, skillIndex) => (
                                                                <Badge
                                                                    key={`${skill}-${skillIndex}-${exp.id}`}
                                                                    variant="default"
                                                                    className="text-xs"
                                                                >
                                                                    {skill}
                                                                </Badge>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                            </CardContent>
                                        </Card>
                                    </AccordionContent>
                                )}
                            </AccordionItem>
                        </Accordion>
                    ))}
            </div>
        </div>
    );
}
