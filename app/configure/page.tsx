'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { PlusCircle, MinusCircle, Download, ChevronDown, ChevronUp, ArrowUp, ArrowDown, Terminal } from 'lucide-react';
import SimpleErrorDialog from '@/components/ui/simple-error-dialog';
import { DatePicker } from '@/components/ui/date-picker';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { GitHubLogoIcon } from '@radix-ui/react-icons';
import { parsePortfolioData } from '@/lib/parseJson';
import Footer from '@/page/footer';

interface CollapsibleSectionProps {
    title: string;
    children: React.ReactNode;
    isCollapsed: boolean;
    onToggle: () => void;
}

const CollapsibleSection: React.FC<CollapsibleSectionProps> = ({ title, children, isCollapsed, onToggle }) => (
    <div className="border rounded p-4 overflow-hidden md:w-full">
        <div className="flex justify-between items-center cursor-pointer" onClick={onToggle}>
            <h3 className="text-lg font-semibold overflow-hidden text-ellipsis ">{title}</h3>
            {isCollapsed ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
        </div>
        {!isCollapsed && <div className="mt-4">{children}</div>}
    </div>
);

const allowedSocials = ['twitter', 'github', 'email', 'instagram', 'facebook', 'linkedin'];

export default function PortfolioPage() {
    const [error, setError] = useState<string | null>(null);
    const [pfData, setPfData] = useState<PortfolioData>({
        name: '',
        bornYear: '',
        pronouns: '',
        image: '',
        shortBio: '',
        longBio: '',
        title: '',
        location: '',
        resumeLink: '',
        socials: [],
        jobsProjects: [],
        education: [],
        achievements: [],
    });
    const { toast } = useToast();

    const sanitizePortfolioData = (data: PortfolioData): string | null => {
        const getYMD = (date: Date | null): Date | null => {
            if (!date) {
                return date;
            }
            const year = date.getFullYear();
            const month = date.getMonth() + 1;
            const day = date.getDate();
            return new Date(year, month, day);
        };
        if (!data.name) {
            return 'Name is required.';
        }
        if (!data.image) {
            return 'Image is required.';
        }
        if (!data.shortBio) {
            return 'Short bio is required.';
        }
        if (!data.title) {
            return 'Title/Student is required.';
        }
        if (!data.location) {
            return 'Uni name / Company is required.';
        }
        for (let index = 0; index < data.socials.length; index++) {
            const social = data.socials[index];
            if (!social.platform || !social.url) {
                return `Social platform name and URL is required at position ${index + 1}.`;
            }
            if (!allowedSocials.includes(social.platform.toLowerCase().trim())) {
                return `Social platform name ${social.platform} isn't recognised.`;
            }
        }
        for (let index = 0; index < data.jobsProjects.length; index++) {
            const job = data.jobsProjects[index];
            if (!job.title.trim()) {
                return `Job/Project title is required at position ${index + 1}.`;
            }
            if (job.isJob === undefined) {
                return `Job/Project type (isJob) is required at position ${index + 1}.`;
            }
            if (job.description.length === 0) {
                return `Job/Project description is required at position ${index + 1}.`;
            }
            if (!job.startDate) {
                return `Job/Project start date is required at position ${index + 1}.`;
            }
            if (!job.isCurrent && !job.endDate) {
                return `Job/Project end date is required if not a current at position ${index + 1}.`;
            }
            if (job.startDate) {
                job.startDate = getYMD(job.startDate);
            }
            if (job.startDate) {
                job.endDate = getYMD(job.endDate);
            }
            data.jobsProjects[index].skills = data.jobsProjects[index].skills.flatMap(
                (skill) =>
                    skill
                        .split(',') // Split each skill string by commas
                        .map((subSkill) => subSkill.trim()) // Trim each subSkill
                        .filter((subSkill) => subSkill) // Remove empty strings if any
            );
        }
        for (let index = 0; index < data.education.length; index++) {
            const edu = data.education[index];
            if (!edu.institutionName.trim()) {
                return `Institution name is required at position ${index + 1}.`;
            }
            if (!edu.courseName.trim()) {
                return `Course name is required at position ${index + 1}.`;
            }
            if (!edu.startDate) {
                return `Education start date is required at position ${index + 1}.`;
            }
            if (!edu.isCurrent && !edu.endDate) {
                return `Education end date is required if not a current at position ${index + 1}.`;
            }
            if (edu.startDate) {
                edu.startDate = getYMD(edu.startDate);
            }
            if (edu.startDate) {
                edu.endDate = getYMD(edu.endDate);
            }
        }
        for (let index = 0; index < data.achievements.length; index++) {
            const ach = data.achievements[index];
            if (!ach.name.trim()) {
                return `Achievement name is required at position ${index + 1}.`;
            }
            if (!ach.dateAwarded) {
                return `Achievement date awarded is required at position ${index + 1}.`;
            } else {
                ach.dateAwarded = getYMD(ach.dateAwarded);
            }
        }
        return null;
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setPfData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSocialChange = (index: number, field: 'platform' | 'url', value: string) => {
        setPfData((prev) => {
            const newSocials = [...prev.socials];
            newSocials[index] = { ...newSocials[index], [field]: value };
            return { ...prev, socials: newSocials };
        });
    };

    const addSocial = () => {
        setPfData((prev) => ({
            ...prev,
            socials: [...prev.socials, { platform: '', url: '' }],
        }));
    };

    const removeSocial = (index: number) => {
        setPfData((prev) => {
            const newSocials = prev.socials.filter((_, i) => i !== index);
            return { ...prev, socials: newSocials };
        });
    };

    const handleJobProjectChange = (
        id: string,
        field: keyof JobProject,
        value: string | boolean | string[] | Date | null
    ) => {
        setPfData((prev) => ({
            ...prev,
            jobsProjects: prev.jobsProjects.map((item) => {
                if (item.id === id) {
                    if (field === 'isCurrent' && value === true) {
                        return { ...item, [field]: value, endDate: null };
                    }
                    return { ...item, [field]: value };
                }
                return item;
            }),
        }));
    };

    const addJobProject = () => {
        setPfData((prev) => ({
            ...prev,
            jobsProjects: [
                ...prev.jobsProjects,
                {
                    id: Date.now().toString(),
                    isJob: true,
                    title: '',
                    startDate: null,
                    endDate: null,
                    isCurrent: false,
                    description: '',
                    links: [],
                    skills: [],
                    isCollapsed: false,
                },
            ],
        }));
    };

    const removeJobProject = (id: string) => {
        setPfData((prev) => ({
            ...prev,
            jobsProjects: prev.jobsProjects.filter((item) => item.id !== id),
        }));
    };

    const handleEducationChange = (
        id: string,
        field: keyof Education,
        value: string | string[] | boolean | Date | null
    ) => {
        setPfData((prev) => ({
            ...prev,
            education: prev.education.map((item) => {
                if (item.id === id) {
                    if (field === 'isCurrent' && value === true) {
                        return { ...item, [field]: value, endDate: null };
                    }
                    return { ...item, [field]: value };
                }
                return item;
            }),
        }));
    };

    const addEducation = () => {
        setPfData((prev) => ({
            ...prev,
            education: [
                ...prev.education,
                {
                    id: Date.now().toString(),
                    institutionName: '',
                    courseName: '',
                    awarded: '',
                    startDate: null,
                    endDate: null,
                    isCurrent: false,
                    description: '',
                    links: [],
                    isCollapsed: false,
                },
            ],
        }));
    };

    const removeEducation = (id: string) => {
        setPfData((prev) => ({
            ...prev,
            education: prev.education.filter((item) => item.id !== id),
        }));
    };

    const handleAchievementChange = (
        id: string,
        field: keyof Achievement,
        value: string | boolean | string[] | Date | null
    ) => {
        setPfData((prev) => ({
            ...prev,
            achievements: prev.achievements.map((item) => (item.id === id ? { ...item, [field]: value } : item)),
        }));
    };

    const addAchievement = () => {
        setPfData((prev) => ({
            ...prev,
            achievements: [
                ...prev.achievements,
                {
                    id: Date.now().toString(),
                    name: '',
                    description: '',
                    dateAwarded: null,
                    links: [],
                    skills: [],
                    isCollapsed: false,
                },
            ],
        }));
    };

    const removeAchievement = (id: string) => {
        setPfData((prev) => ({
            ...prev,
            achievements: prev.achievements.filter((item) => item.id !== id),
        }));
    };

    const downloadJSON = () => {
        const errorMessage = sanitizePortfolioData(pfData);
        if (errorMessage) {
            setError(errorMessage);
        } else {
            setError(null);
            const dataStr = JSON.stringify(pfData, null, 2);
            const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
            const exportFileDefaultName = 'portfolio_data.json';
            const linkElement = document.createElement('a');
            linkElement.setAttribute('href', dataUri);
            linkElement.setAttribute('download', exportFileDefaultName);
            linkElement.click();
        }
    };

    const moveItem = (
        listName: 'jobsProjects' | 'education' | 'achievements',
        id: string,
        direction: 'up' | 'down'
    ) => {
        setPfData((prev) => {
            const list = prev[listName];
            const index = list.findIndex((item) => item.id === id);
            if ((direction === 'up' && index === 0) || (direction === 'down' && index === list.length - 1)) {
                return prev;
            }
            const newIndex = direction === 'up' ? index - 1 : index + 1;
            const newList = [...list];
            const [removed] = newList.splice(index, 1);
            newList.splice(newIndex, 0, removed);
            return { ...prev, [listName]: newList };
        });
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const jsonData = JSON.parse(e.target?.result as string);
                const parsedData = parsePortfolioData(jsonData);
                setPfData(parsedData);
                toast({
                    title: 'Upload and parse successful!',
                });
            } catch {
                setError('Failed to parse JSON file. Please ensure it is in the correct format.');
            }
        };
        reader.readAsText(file);
    };

    return (
        <div className="container mx-auto p-4 space-y-8">
            <div>
                {error && <SimpleErrorDialog defaultOpen={true} message={error} onClose={() => setError(null)} />}
            </div>
            <h1 className="text-3xl font-bold mb-4">Portfolio Builder</h1>
            <Alert className="w-full max-w-md bg-white shadow-md p-4 flex items-start space-x-3">
                <Terminal className="h-6 w-6" />
                <div>
                    <AlertTitle className="font-bold text-gray-800">
                        Already have a compatible portfolio JSON?
                    </AlertTitle>
                    <AlertDescription className="text-gray-600 flex items-center space-x-3">
                        <input
                            className="block w-full text-sm text-gray-900 cursor-pointer bg-gray-50"
                            type="file"
                            accept=".json"
                            onChange={handleFileChange}
                        />
                    </AlertDescription>
                </div>
            </Alert>
            <div className="space-y-4">
                <h2 className="text-2xl font-semibold">Personal Information</h2>
                <Input
                    name="name"
                    value={pfData.name}
                    onChange={handleInputChange}
                    placeholder="Name (Required)"
                    required
                />
                <Input
                    name="bornYear"
                    value={pfData.bornYear}
                    onChange={handleInputChange}
                    placeholder="Born Year"
                    type="number"
                />
                <Input name="pronouns" value={pfData.pronouns} onChange={handleInputChange} placeholder="Pronouns" />
                <Input
                    name="image"
                    value={pfData.image}
                    onChange={handleInputChange}
                    placeholder="Image URL (Required)"
                    required
                />
                <Textarea
                    name="shortBio"
                    value={pfData.shortBio}
                    onChange={handleInputChange}
                    placeholder="Short Bio (Required)"
                    required
                />
                <Textarea name="longBio" value={pfData.longBio} onChange={handleInputChange} placeholder="Long Bio" />
                <Input
                    name="title"
                    value={pfData.title}
                    onChange={handleInputChange}
                    placeholder="Title / Student (Required)"
                    required
                />
                <Input
                    name="location"
                    value={pfData.location}
                    onChange={handleInputChange}
                    placeholder="Uni name / Company name (Required)"
                    required
                />
                <Input
                    name="resumeLink"
                    value={pfData.resumeLink}
                    onChange={handleInputChange}
                    placeholder="Resume Link"
                />
            </div>

            <div className="space-y-4">
                <h2 className="text-2xl font-semibold">Socials</h2>
                <p>Available platform: {allowedSocials.map((social) => social).join(',')}</p>
                {pfData.socials.map((social, index) => (
                    <div key={index} className="flex space-x-2">
                        <Input
                            value={social.platform}
                            onChange={(e) => handleSocialChange(index, 'platform', e.target.value)}
                            placeholder="Platform"
                        />
                        <Input
                            value={social.url}
                            onChange={(e) => handleSocialChange(index, 'url', e.target.value)}
                            placeholder="URL"
                        />
                        <Button onClick={() => removeSocial(index)} variant="destructive">
                            <MinusCircle className="h-4 w-4" />
                        </Button>
                    </div>
                ))}
                <Button onClick={addSocial}>
                    <PlusCircle className="h-4 w-4 mr-2" /> Add Social
                </Button>
            </div>

            <div className="space-y-4">
                <h2 className="text-2xl font-semibold">Jobs & Projects</h2>
                {pfData.jobsProjects.map((item, index) => (
                    <div key={item.id} className="flex flex-row mb-4">
                        <CollapsibleSection
                            title={item.title || 'Untitled Job/Project'}
                            isCollapsed={item.isCollapsed}
                            onToggle={() => handleJobProjectChange(item.id, 'isCollapsed', !item.isCollapsed)}
                        >
                            <div className="space-y-2">
                                <div className="flex items-center space-x-2">
                                    <Switch
                                        checked={item.isJob}
                                        onCheckedChange={(checked) => handleJobProjectChange(item.id, 'isJob', checked)}
                                    />
                                    <Label>{item.isJob ? 'Job' : 'Project'}</Label>
                                </div>
                                <Input
                                    value={item.title}
                                    onChange={(e) => handleJobProjectChange(item.id, 'title', e.target.value)}
                                    placeholder="Title (Required)"
                                    required
                                />
                                <div className="flex flex-col gap-y-2 md: flex-row space-x-2">
                                    <DatePicker
                                        id={item.id}
                                        field="startDate"
                                        message="Select Start Date (Required)"
                                        setter={handleJobProjectChange}
                                        providedDate={item.startDate}
                                    />
                                    <div className="flex items-center space-x-2">
                                        <Switch
                                            checked={item.isCurrent}
                                            onCheckedChange={(checked) =>
                                                handleJobProjectChange(item.id, 'isCurrent', checked)
                                            }
                                        />
                                        <Label>{item.isCurrent ? 'Current' : 'Past'}</Label>
                                    </div>
                                    {!item.isCurrent ? (
                                        <DatePicker
                                            id={item.id}
                                            field="endDate"
                                            message="Select End Date"
                                            setter={handleJobProjectChange}
                                            providedDate={item.endDate}
                                        />
                                    ) : null}
                                </div>
                                <Textarea
                                    value={item.description}
                                    onChange={(e) => handleJobProjectChange(item.id, 'description', e.target.value)}
                                    placeholder="Description"
                                />
                                <Input
                                    value={item.links.join(', ')}
                                    onChange={(e) =>
                                        handleJobProjectChange(item.id, 'links', e.target.value.split(', '))
                                    }
                                    placeholder="Links (comma-separated)"
                                />
                                <Input
                                    value={item.skills.join(', ')}
                                    onChange={(e) =>
                                        handleJobProjectChange(item.id, 'skills', e.target.value.split(', '))
                                    }
                                    placeholder="Skills (comma-separated)"
                                />
                                <div className="flex justify-between">
                                    <Button onClick={() => removeJobProject(item.id)} variant="destructive">
                                        <MinusCircle className="h-4 w-4 mr-2" /> Remove
                                    </Button>
                                </div>
                            </div>
                        </CollapsibleSection>
                        {item.isCollapsed && (
                            <div className="flex space-x-1 items-center ">
                                <Button
                                    onClick={() => removeJobProject(item.id)}
                                    variant="destructive"
                                    className="h-full"
                                >
                                    <MinusCircle className="h-4 w-4 mr-2" /> Remove
                                </Button>
                                <Button
                                    onClick={() => moveItem('jobsProjects', item.id, 'up')}
                                    disabled={index === 0}
                                    className="h-full"
                                >
                                    <ArrowUp className="h-4 w-4" />
                                </Button>
                                <Button
                                    onClick={() => moveItem('jobsProjects', item.id, 'down')}
                                    disabled={index === pfData.jobsProjects.length - 1}
                                    className="h-full"
                                >
                                    <ArrowDown className="h-4 w-4" />
                                </Button>
                            </div>
                        )}
                    </div>
                ))}
                <Button onClick={addJobProject}>
                    <PlusCircle className="h-4 w-4 mr-2" /> Add Job/Project
                </Button>
            </div>

            <div className="space-y-4">
                <h2 className="text-2xl font-semibold">Education</h2>
                {pfData.education.map((edu, index) => (
                    <div key={edu.id} className="flex flex-row mb-4">
                        <CollapsibleSection
                            title={edu.institutionName || 'Untitled Education'}
                            isCollapsed={edu.isCollapsed}
                            onToggle={() => handleEducationChange(edu.id, 'isCollapsed', !edu.isCollapsed)}
                        >
                            <div className="space-y-2">
                                <Input
                                    value={edu.institutionName}
                                    onChange={(e) => handleEducationChange(edu.id, 'institutionName', e.target.value)}
                                    placeholder="Institution Name (Required)"
                                    required
                                />
                                <Input
                                    value={edu.courseName}
                                    onChange={(e) => handleEducationChange(edu.id, 'courseName', e.target.value)}
                                    placeholder="Course Name (Required)"
                                />
                                <div className="flex flex-col gap-y-2 md: flex-row space-x-2">
                                    <DatePicker
                                        id={edu.id}
                                        field="startDate"
                                        message="Select Start Date (Required)"
                                        setter={handleEducationChange}
                                        providedDate={edu.startDate}
                                    />
                                    <div className="flex items-center space-x-2">
                                        <Switch
                                            checked={edu.isCurrent}
                                            onCheckedChange={(checked) =>
                                                handleEducationChange(edu.id, 'isCurrent', checked)
                                            }
                                        />
                                        <Label>{edu.isCurrent ? 'Current' : 'Past'}</Label>
                                    </div>
                                    {!edu.isCurrent ? (
                                        <DatePicker
                                            id={edu.id}
                                            field="endDate"
                                            message="Select End Date"
                                            setter={handleEducationChange}
                                            providedDate={edu.startDate}
                                        />
                                    ) : null}
                                </div>
                                <Textarea
                                    value={edu.description}
                                    onChange={(e) => handleEducationChange(edu.id, 'description', e.target.value)}
                                    placeholder="Description"
                                />
                                <Input
                                    value={edu.links.join(', ')}
                                    onChange={(e) => handleEducationChange(edu.id, 'links', e.target.value.split(', '))}
                                    placeholder="Links (comma-separated)"
                                />
                                <div className="flex justify-between">
                                    <Button onClick={() => removeEducation(edu.id)} variant="destructive">
                                        <MinusCircle className="h-4 w-4 mr-2" /> Remove
                                    </Button>
                                </div>
                            </div>
                        </CollapsibleSection>
                        {edu.isCollapsed && (
                            <div className="flex space-x-1 items-center ">
                                <Button
                                    onClick={() => removeEducation(edu.id)}
                                    variant="destructive"
                                    className="h-full"
                                >
                                    <MinusCircle className="h-4 w-4 mr-2" /> Remove
                                </Button>
                                <Button
                                    onClick={() => moveItem('education', edu.id, 'up')}
                                    disabled={index === 0}
                                    className="h-full"
                                >
                                    <ArrowUp className="h-4 w-4" />
                                </Button>
                                <Button
                                    onClick={() => moveItem('education', edu.id, 'down')}
                                    disabled={index === pfData.education.length - 1}
                                    className="h-full"
                                >
                                    <ArrowDown className="h-4 w-4" />
                                </Button>
                            </div>
                        )}
                    </div>
                ))}
                <Button onClick={addEducation}>
                    <PlusCircle className="h-4 w-4 mr-2" /> Add Education
                </Button>
            </div>

            <div className="space-y-4">
                <h2 className="text-2xl font-semibold">Achievements</h2>
                {pfData.achievements.map((achievement, index) => (
                    <div key={achievement.id} className="flex flex-row mb-4">
                        <CollapsibleSection
                            title={achievement.name || 'Untitled Achievement'}
                            isCollapsed={achievement.isCollapsed}
                            onToggle={() =>
                                handleAchievementChange(achievement.id, 'isCollapsed', !achievement.isCollapsed)
                            }
                        >
                            <div className="space-y-2">
                                <Input
                                    value={achievement.name}
                                    onChange={(e) => handleAchievementChange(achievement.id, 'name', e.target.value)}
                                    placeholder="Name (Required)"
                                    required
                                />
                                <Textarea
                                    value={achievement.description}
                                    onChange={(e) =>
                                        handleAchievementChange(achievement.id, 'description', e.target.value)
                                    }
                                    placeholder="Description"
                                />
                                <DatePicker
                                    id={achievement.id}
                                    field="dateAwarded"
                                    message="Date Awarded (Required)"
                                    setter={handleAchievementChange}
                                    providedDate={achievement.dateAwarded}
                                />
                                <Input
                                    value={achievement.links.join(', ')}
                                    onChange={(e) =>
                                        handleAchievementChange(achievement.id, 'links', e.target.value.split(', '))
                                    }
                                    placeholder="Links (comma-separated)"
                                />
                                <Input
                                    value={achievement.skills.join(', ')}
                                    onChange={(e) =>
                                        handleAchievementChange(achievement.id, 'skills', e.target.value.split(', '))
                                    }
                                    placeholder="Skills (comma-separated)"
                                />
                                <div className="flex justify-between">
                                    <Button onClick={() => removeAchievement(achievement.id)} variant="destructive">
                                        <MinusCircle className="h-4 w-4 mr-2" /> Remove
                                    </Button>
                                </div>
                            </div>
                        </CollapsibleSection>
                        {achievement.isCollapsed && (
                            <div className="flex space-x-1 items-center">
                                <Button
                                    onClick={() => removeAchievement(achievement.id)}
                                    variant="destructive"
                                    className="h-full"
                                >
                                    <MinusCircle className="h-4 w-4 mr-2" /> Remove
                                </Button>
                                <Button
                                    onClick={() => moveItem('achievements', achievement.id, 'up')}
                                    disabled={index === 0}
                                    className="h-full"
                                >
                                    <ArrowUp className="h-4 w-4" />
                                </Button>
                                <Button
                                    onClick={() => moveItem('achievements', achievement.id, 'down')}
                                    disabled={index === pfData.achievements.length - 1}
                                    className="h-full"
                                >
                                    <ArrowDown className="h-4 w-4" />
                                </Button>
                            </div>
                        )}
                    </div>
                ))}
                <Button onClick={addAchievement}>
                    <PlusCircle className="h-4 w-4 mr-2" /> Add Achievement
                </Button>
            </div>

            <Button onClick={downloadJSON} className="mt-8">
                <Download className="h-4 w-4 mr-2" /> Download JSON
            </Button>

            {downloaded && 
                <Card className="w-full max-w-3xl mx-auto">
                <CardHeader>
                  <CardTitle className="text-3xl font-bold tracking-tighter md:text-5xl text-center">
                    Ready for the next step? 🎉
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <ol className="list-decimal list-inside space-y-4">
                    <li className="text-lg">
                      <span className="font-medium">Name of file <strong className="text-primary">MUST</strong> be called </span>
                      <code className="px-2 py-1 bg-muted rounded-md text-sm">portfolio_data.json</code>
                      <p className="mt-2 text-sm text-muted-foreground">
                        The default name should already be correct. If there are multiple of these config files, your OS might prepend numbers to deduplicate. You must remove the numbers and call the file exactly as <code className="px-1 py-0.5 bg-muted rounded-sm text-xs">portfolio_data.json</code>.
                      </p>
                    </li>
                    <Separator className="my-4" />
                    <li className="text-lg">
                      <span className="font-medium">Move </span>
                      <code className="px-2 py-1 bg-muted rounded-md text-sm">portfolio_data.json</code>
                      <span className="font-medium"> into the <strong className="text-primary">root</strong> directory of this project.</span>
                    </li>
                    <Separator className="my-4" />
                    <li className="text-lg">
                      <span className="font-medium">Host it! For the most foolproof experience, we suggest </span>
                      <a href="https://medium.com/@hikmohadetunji/hosting-your-first-website-on-vercel-a-step-by-step-guide-95061f1ca687" className="text-blue-500 hover:text-blue-800 hover:underline">Vercel</a>.
                    </li>
                    <Separator className="my-4" />
                    <li className="text-lg">
                      <span className="font-medium">(Optional) In an environment variable, provide a page title to populate the browser tab's title. The variable must be called </span>
                      <code className="px-2 py-1 bg-muted rounded-md text-sm">NEXT_PUBLIC_WEBPAGE_TITLE</code>.
                    </li>
                  </ol>
                </CardContent>
              </Card>
            }

            <Footer />
        </div>
    );
}
