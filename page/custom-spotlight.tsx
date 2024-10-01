'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Command, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem } from '@/components/ui/command';
import { CalendarIcon, X } from 'lucide-react';
import { format } from 'date-fns';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface CustomSpotlightProps {
    isOpen: boolean;
    onClose: () => void;
    onSearch: (params: FilterCriteria) => void;
    skills: string[];
}

export default function CustomSpotlight({ isOpen, onClose, onSearch, skills }: CustomSpotlightProps) {
    const [keyword, setKeyword] = useState('');
    const [startDate, setStartDate] = useState<Date>();
    const [endDate, setEndDate] = useState<Date>();
    const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
    const spotlightRef = useRef<HTMLDivElement>(null);

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
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen, onClose]);

    const handleSearch = () => {
        onSearch({ keyword, startDate, endDate, selectedSkills });
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
                            <TooltipWrapper text="Keyword Search" content="Type a word/letter/phrase" />
                            <div className="flex flex-row space-x-4">
                                <Input
                                    type="text"
                                    placeholder="🔎..."
                                    value={keyword}
                                    onChange={(e) => setKeyword(e.target.value)}
                                    className="flex-grow text-md"
                                    autoFocus
                                />
                                <Button onClick={handleSearch} className="bg-blue-500 hover:bg-blue-600 text-white">
                                    Search
                                </Button>
                            </div>
                            <TooltipWrapper text="Date Ranges" content="Filter by date range." />
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
                                    <TooltipWrapper text="Skills" content="Select skills to filter by" />
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

                        {/* <Command className="rounded-lg border shadow-md">
            <CommandInput placeholder="Type a command or search..." />
            <CommandList>
                <CommandEmpty>
                No results found.
            </CommandEmpty>
            </CommandList>
            </Command> */}
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
