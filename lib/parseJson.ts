export const parsePortfolioData = (data: unknown): PortfolioData => {
    if (typeof data !== 'object' || data === null) {
        throw new Error('Invalid data format: Expected an object.');
    }

    // Cast `data` to `Record<string, unknown>` to allow safe property access
    const dataObj = data as Record<string, unknown>;

    // Type guard function for arrays of a specific shape
    const isArrayOfObjects = (arr: unknown): arr is Record<string, unknown>[] =>
        Array.isArray(arr) && arr.every((item) => typeof item === 'object' && item !== null);

    // Safely access properties with type narrowing
    const parseDate = (date: unknown): Date | null => (typeof date === 'string' ? new Date(date) : null);

    return {
        name: typeof dataObj.name === 'string' ? dataObj.name : '',
        bornYear: typeof dataObj.bornYear === 'string' ? dataObj.bornYear : '',
        pronouns: typeof dataObj.pronouns === 'string' ? dataObj.pronouns : '',
        image: typeof dataObj.image === 'string' ? dataObj.image : '',
        shortBio: typeof dataObj.shortBio === 'string' ? dataObj.shortBio : '',
        longBio: typeof dataObj.longBio === 'string' ? dataObj.longBio : '',
        title: typeof dataObj.title === 'string' ? dataObj.title : '',
        location: typeof dataObj.location === 'string' ? dataObj.location : '',
        resumeLink: typeof dataObj.resumeLink === 'string' ? dataObj.resumeLink : '',
        socials: isArrayOfObjects(dataObj.socials)
            ? dataObj.socials.map((item) => ({
                  platform: typeof item.platform === 'string' ? item.platform : '',
                  url: typeof item.url === 'string' ? item.url : '',
              }))
            : [],
        jobsProjects: isArrayOfObjects(dataObj.jobsProjects)
            ? dataObj.jobsProjects.map((item) => ({
                  id: typeof item.id === 'string' ? item.id : '',
                  isJob: typeof item.isJob === 'boolean' ? item.isJob : false,
                  title: typeof item.title === 'string' ? item.title : '',
                  startDate: parseDate(item.startDate),
                  endDate: parseDate(item.endDate),
                  isCurrent: typeof item.isCurrent === 'boolean' ? item.isCurrent : false,
                  description: typeof item.description === 'string' ? item.description : '',
                  links: Array.isArray(item.links)
                      ? item.links.map((link) => (typeof link === 'string' ? link : ''))
                      : [],
                  skills: Array.isArray(item.skills)
                      ? item.skills.map((skill) => (typeof skill === 'string' ? skill : ''))
                      : [],
                  isCollapsed: true,
              }))
            : [],
        education: isArrayOfObjects(dataObj.education)
            ? dataObj.education.map((item) => ({
                  id: typeof item.id === 'string' ? item.id : '',
                  institutionName: typeof item.institutionName === 'string' ? item.institutionName : '',
                  courseName: typeof item.courseName === 'string' ? item.courseName : '',
                  awarded: typeof item.awarded === 'string' ? item.awarded : '',
                  startDate: parseDate(item.startDate),
                  endDate: parseDate(item.endDate),
                  isCurrent: typeof item.isCurrent === 'boolean' ? item.isCurrent : false,
                  description: typeof item.description === 'string' ? item.description : '',
                  links: Array.isArray(item.links)
                      ? item.links.map((link) => (typeof link === 'string' ? link : ''))
                      : [],
                  isCollapsed: true,
              }))
            : [],
        achievements: isArrayOfObjects(dataObj.achievements)
            ? dataObj.achievements.map((item) => ({
                  id: typeof item.id === 'string' ? item.id : '',
                  name: typeof item.name === 'string' ? item.name : '',
                  description: typeof item.description === 'string' ? item.description : '',
                  dateAwarded: parseDate(item.dateAwarded),
                  links: Array.isArray(item.links)
                      ? item.links.map((link) => (typeof link === 'string' ? link : ''))
                      : [],
                  skills: Array.isArray(item.skills)
                      ? item.skills.map((skill) => (typeof skill === 'string' ? skill : ''))
                      : [],
                  isCollapsed: true,
              }))
            : [],
    };
};