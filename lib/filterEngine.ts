interface FilterCriteria {
    skills?: string[];
    dateRange?: { startDate: Date; endDate: Date };
    keywords?: string[];
}

// Helper function to check date range overlap
function isInRange(criteria: FilterCriteria, itemStartDate: Date | null, itemEndDate: Date | null) {
    if (!criteria.dateRange) return true;

    const { startDate, endDate } = criteria.dateRange;
    const itemStart = itemStartDate || new Date(0); // If no start date, consider as early as possible
    const itemEnd = itemEndDate || new Date(); // If no end date, consider as present

    // Check if the item is within the specified date range
    return (
        (itemStart <= endDate && itemStart >= startDate) || // Item starts within the range
        (itemEnd >= startDate && itemEnd <= endDate) || // Item ends within the range
        (itemStart <= startDate && itemEnd >= endDate) // Item spans the entire range
    );
}

// Helper function to check for keyword match in title or description
function containsKeywords(criteria: FilterCriteria, item: { title: string; description: string }) {
    if (!criteria.keywords || criteria.keywords.length === 0) return true;
    const keywordsLower = criteria.keywords.map((k) => k.toLowerCase());
    const title = item.title.toLowerCase();
    const description = item.description.toLowerCase();

    return keywordsLower.some((keyword) => title.includes(keyword) || description.includes(keyword));
}

// Helper function to check if the item contains any of the specified skills
function containsSkills(criteria: FilterCriteria, itemSkills: string[]) {
    if (!criteria.skills || criteria.skills.length === 0) return true;
    return criteria.skills.some((skill) => itemSkills.map((s) => s.toLowerCase()).includes(skill.toLowerCase()));
}

function filterPortfolioData(portfolioData: PortfolioData, criteria: FilterCriteria): string[] {
    let resultIds: string[] = [];
    // Filter the job projects
    portfolioData.jobsProjects.forEach((project) => {
        if (
            containsSkills(criteria, project.skills) &&
            isInRange(criteria, project.startDate, project.endDate) &&
            containsKeywords(criteria, { title: project.title, description: project.description })
        ) {
            resultIds.push(project.id);
        }
    });

    // Filter the education items
    portfolioData.education.forEach((education) => {
        if (
            containsSkills(criteria, education.links) && // For education, links might contain relevant resources/skills
            isInRange(criteria, education.startDate, education.endDate) &&
            containsKeywords(criteria, { title: education.institutionName, description: education.description })
        ) {
            resultIds.push(education.id);
        }
    });

    // Filter the achievements
    portfolioData.achievements.forEach((achievement) => {
        if (
            containsSkills(criteria, achievement.skills) &&
            isInRange(criteria, achievement.dateAwarded, null) && // For achievements, only one date (dateAwarded)
            containsKeywords(criteria, { title: achievement.name, description: achievement.description })
        ) {
            resultIds.push(achievement.id);
        }
    });

    return resultIds;
}
