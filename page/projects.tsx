'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Calendar, ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';

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
        <>
            {projects.length > 0 && (
                <div className="my-4 mt-8 space-y-4 md:mt-16">
                    <h2 className="text-3xl font-bold tracking-tighter md:text-5xl">🛠️ Projects ({projects.length})</h2>
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
            )}
        </>
    );
}

function ProjectCard({ project }: { project: JobProject }) {
    const [isHovered, setIsHovered] = useState(false);
    return (
        <motion.div
            whileHover={{ scale: 1.02 }}
            transition={{ type: 'spring', stiffness: 100 }}
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
        >
            <Card className="flex flex-col justify-between h-full overflow-hidden bg-gradient-to-br from-white to-gray-100  border-2 border-transparent transition-all duration-300 hover:border-purple-400 ">
                <CardHeader className="relative overflow-hidden">
                    <div
                        className="absolute inset-0 bg-gradient-to-r rounded-xl m-2 from-purple-500 to-pink-500 opacity-75 transition-opacity duration-300"
                        style={{ opacity: isHovered ? 0.2 : 0 }}
                    />
                    <CardTitle className="relative z-10 text-xl md:text-2xl font-bold text-gray-800 dark:text-white">
                        {project.title}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-wrap gap-2">
                        {project.skills.slice(0, 3).map((skill, index) => (
                            <Badge key={index} variant="secondary" className="bg-gray-200 text-gray-700 ">
                                {skill}
                            </Badge>
                        ))}
                        {project.skills.length > 3 && (
                            <Badge variant="secondary" className="bg-gray-200 text-gray-700 ">
                                +{project.skills.length - 3} more
                            </Badge>
                        )}
                    </div>
                </CardContent>
                <CardFooter className="mt-auto">
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button className="w-full bg-black hover:bg-purple-500 hover:text-white transition-colors duration-300">
                                View Details
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="bg-white dark:bg-gray-800 max-w-md md:max-w-lg">
                            <DialogHeader>
                                <DialogTitle className="font-bold text-2xl md:text-3xl text-gray-800 dark:text-white">
                                    {project.title}
                                </DialogTitle>
                            </DialogHeader>
                            <ProjectDetails project={project} />
                        </DialogContent>
                    </Dialog>
                </CardFooter>
            </Card>
        </motion.div>
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
