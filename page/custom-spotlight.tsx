'use client';

import { useState, useEffect, useRef, SetStateAction, Dispatch, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { CalendarIcon, SearchCheck, Trash2, X, GraduationCapIcon, TrophyIcon, Link, Hammer } from 'lucide-react';
import { format } from 'date-fns';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { formatDate } from '@/lib/utils';
import { Switch } from '@/components/ui/switch';

interface CustomSpotlightProps {
    isOpen: boolean;
    onClose: () => void;
    onSearch: (params: FilterCriteria) => void;
    skills: string[];
    searchResults: SearchResultRecord[];
    setSearchResults: Dispatch<SetStateAction<SearchResultRecord[]>>;
    queryById: (id: string) => Achievement | Education | JobProject | undefined;
}

export default function CustomSpotlight({
    isOpen,
    onClose,
    onSearch,
    skills,
    searchResults,
    setSearchResults,
    queryById,
}: CustomSpotlightProps) {
    const [keyword, setKeyword] = useState('');
    const [startDate, setStartDate] = useState<Date>();
    const [endDate, setEndDate] = useState<Date>();
    const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
    const [containLinks, setContainLinks] = useState(false);
    const spotlightRef = useRef<HTMLDivElement>(null);

    const handleSearch = () => {
        onSearch({ keyword, startDate, endDate, selectedSkills, containsLinks: containLinks });
    };

    const closeFilterComponent = () => {
        setStartDate(undefined);
        setEndDate(undefined);
        setSelectedSkills([]);
        setKeyword('');
        onClose();
        setSearchResults([]);
    };

    const handleKeyDown = useCallback(
        (event: KeyboardEvent) => {
            if (event.key === 'Enter') {
                handleSearch();
            }
            if (event.key === 'Escape') {
                closeFilterComponent();
            }
        },
        [handleSearch, closeFilterComponent]
    );

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [handleKeyDown]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as Node;
            const isClickInsidePopover = (target as HTMLElement).closest('[data-state="open"]');
            if (spotlightRef.current && !spotlightRef.current.contains(target) && !isClickInsidePopover) {
                closeFilterComponent();
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen, onClose]);

    const handleClear = () => {
        setStartDate(undefined);
        setEndDate(undefined);
        setSelectedSkills([]);
        setKeyword('');
        setSearchResults([]);
    };

    const handleSkillToggle = (skillId: string) => {
        setSelectedSkills((prev) =>
            prev.includes(skillId) ? prev.filter((id) => id !== skillId) : [...prev, skillId]
        );
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: -10 }}
                    transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
                    className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center pt-20 px-4 z-50"
                >
                    <motion.div
                        ref={spotlightRef}
                        className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-2xl h-[80vh] flex flex-col overflow-hidden"
                        initial={{ scale: 0.9 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0.9 }}
                    >
                        <div className="absolute top-4 right-4">
                            <Button onClick={onClose} variant="outline" size="icon">
                                <X className="h-6 w-6" />
                            </Button>
                        </div>
                        <ResizablePanelGroup direction="vertical" className="w-full h-full">
                            {/* Top Panel - Search Area */}
                            <ResizablePanel defaultSize={75}>
                                <div className="p-4 space-y-4">
                                    {/* Search Area */}
                                    <TooltipWrapper text="🔑 Keyword Search" content="Type a word/letter/phrase" />
                                    <Input
                                        type="text"
                                        placeholder="🔎..."
                                        value={keyword}
                                        onChange={(e) => setKeyword(e.target.value)}
                                        className="flex-grow text-md"
                                        autoFocus
                                    />
                                    {/* Additional Filters */}
                                    <div className="flex flex-row gap-2">
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <Button
                                                    variant="outline"
                                                    className="w-[240px] justify-start text-left font-normal"
                                                >
                                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                                    {startDate ? format(startDate, 'PPP') : <span>Start Date</span>}
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0" align="start">
                                                <Calendar
                                                    mode="single"
                                                    selected={startDate}
                                                    onSelect={setStartDate}
                                                    initialFocus
                                                />
                                            </PopoverContent>
                                        </Popover>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <Button
                                                    variant="outline"
                                                    className="w-[240px] justify-start text-left font-normal"
                                                >
                                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                                    {endDate ? format(endDate, 'PPP') : <span>End Date</span>}
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0" align="start">
                                                <Calendar
                                                    mode="single"
                                                    selected={endDate}
                                                    onSelect={setEndDate}
                                                    initialFocus
                                                />
                                            </PopoverContent>
                                        </Popover>
                                    </div>
                                    {/* Skills */}
                                    {skills && (
                                        <>
                                            <TooltipWrapper text="🧠 Skills" content="Select skills to filter by" />
                                            <div className="flex flex-wrap gap-2 max-h-64 overflow-y-auto">
                                                {skills.map((skill) => (
                                                    <Badge
                                                        key={skill}
                                                        variant={selectedSkills.includes(skill) ? 'default' : 'outline'}
                                                        className="cursor-pointer"
                                                        onClick={() => handleSkillToggle(skill)}
                                                    >
                                                        {skill}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </>
                                    )}
                                    <div className="flex items-center space-x-2">
                                        <Switch
                                            id="containsLinks"
                                            checked={containLinks}
                                            onCheckedChange={() => setContainLinks(!containLinks)}
                                            onKeyDown={(e) => {
                                                if (e.key === "Enter" || e.key === " ") {
                                                    e.preventDefault(); 
                                                }
                                            }}
                                        />
                                        <span className="text-sm">Must contain</span>
                                        <div className="flex items-center space-x-1">
                                            <Link className="h-4 w-4" />
                                            <span className="text-sm">links</span>
                                        </div>
                                    </div>
                                    <div className="flex flex-row gap-2 p-5">
                                        <Button
                                            variant="default"
                                            onClick={handleSearch}
                                            className="w-full hover:bg-purple-500"
                                        >
                                            <SearchCheck className="w-4 h-4 mr-2" /> Search
                                        </Button>
                                        <Button
                                            variant="destructive"
                                            onClick={handleClear}
                                            className="w-full hover:bg-red-700"
                                        >
                                            <Trash2 className="w-4 h-4 mr-2" /> Clear
                                        </Button>
                                    </div>
                                </div>
                            </ResizablePanel>
                            <ResizableHandle withHandle />
                            {/* Bottom Panel - Search Results */}
                            <ResizablePanel defaultSize={25} className="flex flex-col h-full">
                                <div className="h-full flex flex-col flex-grow">
                                    <div className="flex-grow overflow-auto p-4 bg-white dark:bg-gray-800 rounded-lg border shadow-md">
                                        {searchResults.length === 0 ? (
                                            <div className="text-center text-muted-foreground">No results found.</div>
                                        ) : (
                                            <>
                                                {searchResults.filter((item) => item.type === 'jobProjects').length >
                                                    0 && (
                                                    <>
                                                        <div className="mb-2 font-semibold text-lg">
                                                            💎 Experience/Projects
                                                        </div>
                                                        <div className="space-y-2">
                                                            {searchResults
                                                                .filter((item) => item.type === 'jobProjects')
                                                                .map((item) => (
                                                                    <div
                                                                        key={item.id}
                                                                        className="p-2 bg-gray-100 rounded-md dark:bg-gray-700"
                                                                    >
                                                                        <QueryResultRows
                                                                            item={item}
                                                                            queryById={queryById}
                                                                        />
                                                                    </div>
                                                                ))}
                                                        </div>
                                                        <hr className="my-4 border-t border-gray-300 dark:border-gray-600" />
                                                    </>
                                                )}

                                                {searchResults.filter((item) => item.type === 'education').length >
                                                    0 && (
                                                    <>
                                                        <div className="mb-2 font-semibold text-lg">🎓 Education</div>
                                                        <div className="space-y-2">
                                                            {searchResults
                                                                .filter((item) => item.type === 'education')
                                                                .map((item) => (
                                                                    <div
                                                                        key={item.id}
                                                                        className="p-2 bg-gray-100 rounded-md dark:bg-gray-700"
                                                                    >
                                                                        <QueryResultRows
                                                                            item={item}
                                                                            queryById={queryById}
                                                                        />
                                                                    </div>
                                                                ))}
                                                        </div>
                                                        <hr className="my-4 border-t border-gray-300 dark:border-gray-600" />
                                                    </>
                                                )}

                                                {searchResults.filter((item) => item.type === 'achievements').length >
                                                    0 && (
                                                    <>
                                                        <div className="mb-2 font-semibold text-lg">
                                                            🎉 Achievements
                                                        </div>
                                                        <div className="space-y-2">
                                                            {searchResults
                                                                .filter((item) => item.type === 'achievements')
                                                                .map((item) => (
                                                                    <div
                                                                        key={item.id}
                                                                        className="p-2 bg-gray-100 rounded-md dark:bg-gray-700"
                                                                    >
                                                                        <QueryResultRows
                                                                            item={item}
                                                                            queryById={queryById}
                                                                        />
                                                                    </div>
                                                                ))}
                                                        </div>
                                                        <hr className="my-4 border-t border-gray-300 dark:border-gray-600" />
                                                    </>
                                                )}
                                            </>
                                        )}
                                    </div>
                                </div>
                            </ResizablePanel>
                        </ResizablePanelGroup>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

function TooltipWrapper({ text, content }: { text: string; content: string }) {
    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger className="text-md font-semibold underline">{text}</TooltipTrigger>
                <TooltipContent side="right">
                    <p>{content}</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
}

function QueryResultRows({
    item,
    queryById,
}: {
    item: SearchResultRecord;
    queryById: (id: string) => Achievement | Education | JobProject | undefined;
}) {
    const [detailItem, setDetailItem] = useState<Achievement | Education | JobProject | undefined>(undefined);

    const handleOpen = () => {
        const result = queryById(item.id);
        setDetailItem(result);
    };

    return (
        <div key={item.id} className="p-2">
            <Popover>
                <PopoverTrigger asChild>
                    <Button
                        onClick={handleOpen}
                        variant="ghost"
                        className="w-full text-left flex items-start items-center justify-center"
                    >
                        <div className="flex flex-col flex-grow truncate">
                            <span className="font-semibold truncate">{item.header}</span>
                            <span className="text-sm truncate text-muted-foreground">{item.body}</span>
                        </div>
                    </Button>
                </PopoverTrigger>
                <PopoverContent align="start">{QueryResultIndividualDetail(detailItem)}</PopoverContent>
            </Popover>
        </div>
    );
}

const QueryResultIndividualDetail = (item: Achievement | Education | JobProject | undefined) => {
    if (!item) return null;

    let icon, title, subtitle, dates, description;
    let skillCount = 0;

    if ('title' in item) {
        icon = <CalendarIcon className="h-4 w-4" />;
        title = item.title;
        dates = `${formatDate(item.startDate!)} - ${item.isCurrent ? 'Present' : formatDate(item.endDate!)}`;
        description = item.description;
        skillCount = item.skills.length;
    } else if ('institutionName' in item) {
        icon = <GraduationCapIcon className="h-4 w-4" />;
        title = item.institutionName;
        subtitle = item.courseName;
        dates = `${formatDate(item.startDate!)} - ${item.isCurrent ? 'Present' : formatDate(item.endDate!)}`;
    } else if ('name' in item) {
        icon = <TrophyIcon className="h-4 w-4" />;
        title = item.name;
        dates = `Awarded: ${formatDate(item.dateAwarded!)}`;
        description = item.description;
        skillCount = item.skills.length;
    }

    return (
        <Card className="w-full max-w-sm">
            <CardHeader className="space-y-1 p-4">
                <CardTitle className="flex items-center space-x-2 text-base font-semibold">
                    {icon}
                    <span className="truncate">{title}</span>
                </CardTitle>
                {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
            </CardHeader>
            <CardContent className="p-4 pt-0">
                <ScrollArea className="h-[100px] pr-4">
                    <div className="space-y-2">
                        <p className="text-xs text-muted-foreground">{dates}</p>
                        {description && <p className="text-sm">{description}</p>}
                    </div>
                </ScrollArea>
                <div className="flex flex-row space-x-4 mt-2 text-muted-foreground">
                    <Link className="w-4 h-4 mr-1" /> {item.links.length}
                    {!('institutionName' in item) && (
                        <>
                            <Hammer className="w-4 h-4 mr-1" /> {skillCount}
                        </>
                    )}
                </div>
            </CardContent>
        </Card>
    );
};
