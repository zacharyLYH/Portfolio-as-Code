import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { School, Calendar, Text, LinkIcon } from 'lucide-react';
import { formatDate } from '@/lib/utils';

interface EducationPageProps {
    educationItems: Education[];
}

export default function Education({ educationItems }: EducationPageProps) {
    return (
        <div className="my-4 mt-8 space-y-4 md:mt-16">
            {educationItems.length > 0 && (
                <>
                    <h1 className="text-3xl font-bold tracking-tighter md:text-5xl">Education</h1>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {educationItems.map((item, index) => (
                            <Card key={index} className="overflow-hidden transition-all duration-300 hover:shadow-lg">
                                <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                                    <CardTitle className="flex items-center text-xl gap-2">
                                        <School className="h-6 w-6" />
                                        {item.institutionName}
                                    </CardTitle>
                                    <CardDescription className="text-purple-100 text-md">
                                        {item.courseName}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="mt-4">
                                    <div className="flex items-center gap-2 text-muted-foreground mb-4">
                                        <Calendar className="h-4 w-4" />
                                        <span>
                                            {formatDate(item.startDate!)} -{' '}
                                            {item.isCurrent ? 'Present' : item.endDate ? formatDate(item.endDate) : ''}
                                        </span>
                                    </div>
                                    {(item.description.length > 0 || item.links.length > 0) && (
                                        <div className="space-y-2">
                                            <Sheet key={item.id}>
                                                <SheetTrigger asChild>
                                                    <Button variant="outline">Details</Button>
                                                </SheetTrigger>
                                                <SheetContent className="w-[400px] md:w-1/2 bg-white">
                                                    <SheetHeader className="mb-5">
                                                        <SheetTitle>
                                                            {item.courseName} @ {item.institutionName}
                                                        </SheetTitle>
                                                        <SheetDescription>
                                                            {formatDate(item.startDate!)} -{' '}
                                                            {item.isCurrent
                                                                ? 'Present'
                                                                : item.endDate
                                                                  ? formatDate(item.endDate)
                                                                  : ''}
                                                        </SheetDescription>
                                                    </SheetHeader>
                                                    <div className="space-y-4">
                                                        {item.description.length > 0 && (
                                                            <>
                                                                <h4 className="font-semibold flex items-center gap-2">
                                                                    <Text className="h-4 w-4" />
                                                                    Description
                                                                </h4>
                                                                {item.description}
                                                            </>
                                                        )}
                                                        {item.links.length > 0 && (
                                                            <div className="flex flex-col">
                                                                <h4 className="font-semibold flex items-center gap-2">
                                                                    Links:
                                                                </h4>
                                                                <ul className="list-disc list-inside">
                                                                    {item.links.map((link, linkIndex) => (
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
                                                    </div>
                                                </SheetContent>
                                            </Sheet>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}
