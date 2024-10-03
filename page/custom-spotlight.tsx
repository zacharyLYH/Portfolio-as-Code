'use client';

import { useState, useEffect, useRef, SetStateAction, Dispatch, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { CalendarIcon, SearchCheck, Trash2, X } from 'lucide-react';
import { format } from 'date-fns';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface CustomSpotlightProps {
    isOpen: boolean;
    onClose: () => void;
    onSearch: (params: FilterCriteria) => void;
    skills: string[];
    searchResults: SearchResultRecord[];
    setSearchResults: Dispatch<SetStateAction<SearchResultRecord[]>>;
}

export default function CustomSpotlight({
    isOpen,
    onClose,
    onSearch,
    skills,
    searchResults,
    setSearchResults,
}: CustomSpotlightProps) {
    const [keyword, setKeyword] = useState('');
    const [startDate, setStartDate] = useState<Date>();
    const [endDate, setEndDate] = useState<Date>();
    const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
    const spotlightRef = useRef<HTMLDivElement>(null);

    const handleSearch = () => {
        onSearch({ keyword, startDate, endDate, selectedSkills });
    };

    const handleKeyDown = useCallback(
        (event: KeyboardEvent) => {
            if (event.key === 'Enter') {
                handleSearch();
            }
        },
        [handleSearch]
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
                setStartDate(undefined);
                setEndDate(undefined);
                setSelectedSkills([]);
                setKeyword('');
                onClose();
                setSearchResults([]);
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
                    initial={{ opacity: 0, y: -50 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -50 }}
                    className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center pt-20 px-4 z-50"
                >
                    <motion.div
                        ref={spotlightRef}
                        className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden"
                        initial={{ scale: 0.9 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0.9 }}
                    >
                        <div className="absolute top-4 right-4">
                            <Button onClick={onClose} variant="outline" size="icon">
                                <X className="h-6 w-6" />
                            </Button>
                        </div>
                        <div className="p-4 space-y-4 mt-8">
                            <TooltipWrapper text="🔑 Keyword Search" content="Type a word/letter/phrase" />
                            <Input
                                type="text"
                                placeholder="🔎..."
                                value={keyword}
                                onChange={(e) => setKeyword(e.target.value)}
                                className="flex-grow text-md"
                                autoFocus
                            />
                            <TooltipWrapper text="#️⃣ Date Ranges" content="Filter by date range." />
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
                                        <Calendar mode="single" selected={endDate} onSelect={setEndDate} initialFocus />
                                    </PopoverContent>
                                </Popover>
                            </div>
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
                        </div>
                        <div className="flex flex-row gap-2 p-5">
                            <Button variant="default" onClick={handleSearch} className="w-full hover:bg-purple-500">
                                <SearchCheck className="w-4 h-4 mr-2" /> Search
                            </Button>
                            <Button variant="destructive" onClick={handleClear} className="w-full hover:bg-red-700">
                                <Trash2 className="w-4 h-4 mr-2" /> Clear
                            </Button>
                        </div>
                        <Command className="rounded-lg border shadow-md">
                            <CommandList>
                                {searchResults.length == 0 ? (
                                    <CommandEmpty>No results found.</CommandEmpty>
                                ) : (
                                    <>
                                        {searchResults.filter((item) => item.type === 'jobProjects').length > 0 && (
                                            <>
                                                <CommandGroup heading="💎 Experience/Projects">
                                                    {searchResults
                                                        .filter((item) => item.type === 'jobProjects')
                                                        .map((item) => (
                                                            <CommandItemWrapper item={item} />
                                                        ))}
                                                </CommandGroup>
                                                <CommandSeparator />
                                            </>
                                        )}
                                        {searchResults.filter((item) => item.type === 'education').length > 0 && (
                                            <>
                                                <CommandGroup heading="🎓 Education">
                                                    {searchResults
                                                        .filter((item) => item.type === 'education')
                                                        .map((item) => (
                                                            <CommandItemWrapper item={item} />
                                                        ))}
                                                </CommandGroup>
                                                <CommandSeparator />
                                            </>
                                        )}
                                        {searchResults.filter((item) => item.type === 'achievements').length > 0 && (
                                            <>
                                                <CommandGroup heading="🎉 Achievements">
                                                    {searchResults
                                                        .filter((item) => item.type === 'achievements')
                                                        .map((item) => (
                                                            <CommandItemWrapper item={item} />
                                                        ))}
                                                </CommandGroup>
                                                <CommandSeparator />
                                            </>
                                        )}
                                    </>
                                )}
                            </CommandList>
                        </Command>
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

function CommandItemWrapper({ item }: { item: SearchResultRecord }) {
    return (
        <CommandItem key={item.id} className="p-2">
            <Popover>
                <PopoverTrigger asChild>
                    <Button variant="ghost" className="w-full text-left flex items-start">
                        <div className="flex flex-col flex-grow truncate">
                            <span className="font-semibold truncate">{item.header}</span>
                            <span className="text-sm truncate text-muted-foreground">{item.body}</span>
                        </div>
                    </Button>
                </PopoverTrigger>
                <PopoverContent align="start">Place content for the popover here.</PopoverContent>
            </Popover>
        </CommandItem>
    );
}
