interface Social {
    platform: string;
    url: string;
}

interface JobProject {
    id: string;
    isJob: boolean;
    title: string;
    startDate: Date | null;
    endDate: Date | null;
    isCurrent: boolean;
    description: string;
    links: string[];
    skills: string[];
    isCollapsed: boolean;
}

interface Education {
    id: string;
    institutionName: string;
    courseName: string;
    startDate: Date | null;
    endDate: Date | null;
    isCurrent: boolean;
    description: string;
    links: string[];
    isCollapsed: boolean;
}

interface Achievement {
    id: string;
    name: string;
    description: string;
    dateAwarded: Date | null;
    links: string[];
    skills: string[];
    isCollapsed: boolean;
}

interface PortfolioData {
    name: string;
    bornYear: string;
    pronouns: string;
    image: string;
    shortBio: string;
    longBio: string;
    title: string;
    location: string;
    resumeLink: string;
    socials: Social[];
    jobsProjects: JobProject[];
    education: Education[];
    achievements: Achievement[];
}

interface ReducedPortfolioData {
    jobsProjects: JobProject[];
    education: Education[];
    achievements: Achievement[];
}
