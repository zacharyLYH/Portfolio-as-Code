function isInRange(criteria: FilterCriteria, itemStartDate: Date | null, itemEndDate: Date | null) {
    const { startDate, endDate } = criteria;
    if (!startDate && !endDate) return true;

    const itemStart = itemStartDate || new Date(0);
    const itemEnd = itemEndDate || new Date();

    return (
        (startDate && itemStart >= startDate && itemStart <= (endDate || new Date())) ||
        (endDate && itemEnd <= endDate && itemEnd >= (startDate || new Date())) ||
        (startDate && endDate && itemStart <= startDate && itemEnd >= endDate)
    );
}

function containsKeywords(criteria: FilterCriteria, item: { title: string; description: string }) {
    if (!criteria.keyword || criteria.keyword.length === 0) return true;
    const keywordLower = criteria.keyword.toLowerCase();
    const title = item.title.toLowerCase();
    const description = item.description.toLowerCase();
    const keywordParts = keywordLower.split(' ').filter(Boolean);
    return keywordParts.some((part) => title.includes(part) || description.includes(part));
}

function containsSkills(criteria: FilterCriteria, itemSkills: string[]) {
    if (!criteria.selectedSkills || criteria.selectedSkills.length === 0) return true;
    return criteria.selectedSkills.some((skill) =>
        itemSkills.map((s) => s.toLowerCase()).includes(skill.toLowerCase())
    );
}

export function filterPortfolioData(portfolioData: PortfolioData, criteria: FilterCriteria): SearchResultRecord[] {
    const resultIds: SearchResultRecord[] = [];

    portfolioData.jobsProjects.forEach((project) => {
        if (
            containsSkills(criteria, project.skills) &&
            isInRange(criteria, project.startDate, project.endDate) &&
            containsKeywords(criteria, { title: project.title, description: project.description }) &&
            (criteria.containsLinks ? project.links.length > 0 : true)
        ) {
            resultIds.push({
                type: 'jobProjects',
                id: project.id,
                header: project.title,
                body: project.description,
            });
        }
    });

    portfolioData.education.forEach((education) => {
        if (
            containsSkills(criteria, education.links) &&
            isInRange(criteria, education.startDate, education.endDate) &&
            containsKeywords(criteria, { title: education.institutionName, description: education.description }) &&
            (criteria.containsLinks ? education.links.length > 0 : true)
        ) {
            resultIds.push({
                type: 'education',
                id: education.id,
                header: education.courseName,
                body: education.description,
            });
        }
    });

    portfolioData.achievements.forEach((achievement) => {
        if (
            containsSkills(criteria, achievement.skills) &&
            isInRange(criteria, achievement.dateAwarded, null) &&
            containsKeywords(criteria, { title: achievement.name, description: achievement.description }) &&
            (criteria.containsLinks ? achievement.links.length > 0 : true)
        ) {
            resultIds.push({
                type: 'achievements',
                id: achievement.id,
                header: achievement.name,
                body: achievement.description,
            });
        }
    });

    return resultIds;
}
