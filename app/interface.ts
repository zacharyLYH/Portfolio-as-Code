interface Social {
    platform: string;
    url: string;
}

interface JobProject {
    isJob: boolean;
    title: string;
    startDate: Date;
    endDate: Date | null;
    isCurrent: boolean;
    description: string;
    links: string[];
    skills: string[];
}

interface Education {
    institutionName: string;
    courseName: string;
    awarded: string;
    startDate: Date;
    endDate: Date | null;
    isCurrent: boolean;
    description: string;
    links: string[];
}

interface Achievement {
    name: string;
    description: string;
    dateAwarded: Date;
    links: string[];
    skills: string[];
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
