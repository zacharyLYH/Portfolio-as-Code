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
    return title.includes(keywordLower) || description.includes(keywordLower);
}

function containsSkills(criteria: FilterCriteria, itemSkills: string[]) {
    if (!criteria.selectedSkills || criteria.selectedSkills.length === 0) return true;
    return criteria.selectedSkills.some((skill) =>
        itemSkills.map((s) => s.toLowerCase()).includes(skill.toLowerCase())
    );
}

function filterPortfolioData(portfolioData: ReducedPortfolioData, criteria: FilterCriteria): string[] {
    let resultIds: string[] = [];

    portfolioData.jobsProjects.forEach((project) => {
        if (
            containsSkills(criteria, project.skills) &&
            isInRange(criteria, project.startDate, project.endDate) &&
            containsKeywords(criteria, { title: project.title, description: project.description })
        ) {
            resultIds.push(project.id);
        }
    });

    portfolioData.education.forEach((education) => {
        if (
            containsSkills(criteria, education.links) &&
            isInRange(criteria, education.startDate, education.endDate) &&
            containsKeywords(criteria, { title: education.institutionName, description: education.description })
        ) {
            resultIds.push(education.id);
        }
    });

    portfolioData.achievements.forEach((achievement) => {
        if (
            containsSkills(criteria, achievement.skills) &&
            isInRange(criteria, achievement.dateAwarded, null) &&
            containsKeywords(criteria, { title: achievement.name, description: achievement.description })
        ) {
            resultIds.push(achievement.id);
        }
    });

    return resultIds;
}
