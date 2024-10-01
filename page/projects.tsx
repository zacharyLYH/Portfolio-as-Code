'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Calendar, ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react';

interface ProjectsInterface {
    projects: JobProject[];
}

export default function Projects({ projects }: ProjectsInterface) {
    const [currentPage, setCurrentPage] = useState(1);
    const projectsPerPage = 6;
    const totalPages = Math.ceil(projects.length / projectsPerPage);

    const indexOfLastProject = currentPage * projectsPerPage;
    const indexOfFirstProject = indexOfLastProject - projectsPerPage;
    const currentProjects = projects.slice(indexOfFirstProject, indexOfLastProject);

    return (
        <div className="my-4 mt-8 space-y-4 md:mt-16">
            <h2 className="text-3xl font-bold tracking-tighter md:text-5xl">🛠️ Projects</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {currentProjects.map((project) => (
                    <ProjectCard key={project.id} project={project} />
                ))}
            </div>
            <div className="flex justify-center mt-6">
                <Button
                    variant="outline"
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                >
                    <ChevronLeft className="h-4 w-4 mr-2" />
                    Previous
                </Button>
                <span className="mx-4 self-center">
                    Page {currentPage} of {totalPages}
                </span>
                <Button
                    variant="outline"
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                >
                    Next
                    <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
            </div>
        </div>
    );
}

function ProjectCard({ project }: { project: JobProject }) {
    return (
        <Card className="flex flex-col justify-between h-full">
            <CardHeader>
                <CardTitle>{project.title}</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex flex-wrap gap-2">
                    {project.skills.map((skill, index) => (
                        <Badge key={index} variant="secondary">
                            {skill}
                        </Badge>
                    ))}
                </div>
            </CardContent>
            <CardFooter className="mt-auto">
                <Dialog>
                    <DialogTrigger asChild>
                        <Button variant="outline">View Details</Button>
                    </DialogTrigger>
                    <DialogContent className="bg-white">
                        <DialogHeader>
                            <DialogTitle className="font-bold md:text-2xl">{project.title}</DialogTitle>
                        </DialogHeader>
                        <ProjectDetails project={project} />
                    </DialogContent>
                </Dialog>
            </CardFooter>
        </Card>
    );
}

function ProjectDetails({ project }: { project: JobProject }) {
    const [formattedStartDate, setFormattedStartDate] = useState<string>('Present');
    const [formattedEndDate, setFormattedEndDate] = useState<string>('Present');

    useEffect(() => {
        if (project.startDate) {
            setFormattedStartDate(project.startDate.toLocaleDateString());
        }
        if (project.endDate) {
            setFormattedEndDate(project.endDate.toLocaleDateString());
        }
    }, [project.startDate, project.endDate]);

    return (
        <div className="">
            <p className="flex gap-x-4 text-sm text-muted-foreground mb-2">
                <Calendar className="h-6 w-6" /> {formattedStartDate} -{' '}
                {project.isCurrent ? 'Present' : formattedEndDate}
            </p>
            <p className="mb-4 text-pretty text-sm overflow-hidden text-ellipsis break-words">{project.description}</p>
            {project.links.length > 0 && (
                <div className="mb-4">
                    <h4 className="font-semibold">Links:</h4>
                    <ul className="list-disc list-inside">
                        {project.links.map((link, index) => (
                            <li key={index}>
                                <a
                                    href={link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-500 hover:underline"
                                >
                                    {link} <ExternalLink className="inline h-4 w-4" />
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
            {project.skills.length > 0 && (
                <div className="my-4">
                    <h4 className="text-sm font-semibold mb-2">Skills:</h4>
                    <div className="flex flex-wrap gap-2">
                        {project.skills.map((skill, skillIndex) => (
                            <Badge key={`${skill}-${skillIndex}-${project.id}`} variant="default" className="text-xs">
                                {skill}
                            </Badge>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
