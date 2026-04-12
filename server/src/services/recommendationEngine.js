const { CAREERS } = require('../data/careers');

function formatSalary(min, max) {
  const fmt = (n) => 'LKR ' + n.toLocaleString('en-LK');
  return `${fmt(min)} – ${fmt(max)}`;
}

function computeRecommendations(profile) {
  const { alStream = '', alResults = {}, olResults = {}, skills = [], interests = [] } = profile;

  const scored = CAREERS.map((career) => {
    let score = 0;

    // Stream match — highest weight
    if (career.streams.includes(alStream)) score += 50;

    // Skill overlap
    const skillMatches = skills.filter((s) => career.skills.includes(s));
    score += skillMatches.length * 12;

    // Interest overlap
    const interestMatches = interests.filter((i) => career.interests.includes(i));
    score += interestMatches.length * 10;

    // A/L grade bonus
    const alGrades = Object.values(alResults);
    const aCount = alGrades.filter((g) => g === 'A').length;
    const bCount = alGrades.filter((g) => g === 'B').length;
    score += aCount * 5 + bCount * 2;

    // O/L Mathematics grade bonus for STEM careers
    const stemCareerIds = ['software_engineer', 'data_scientist', 'electronics_engineer', 'civil_engineer', 'mechanical_engineer', 'electrical_engineer', 'accountant', 'financial_analyst'];
    if (stemCareerIds.includes(career.id) && olResults['Mathematics']) {
      const mathGradeBonus = { A: 8, B: 5, C: 2, S: 0, W: 0 };
      score += mathGradeBonus[olResults['Mathematics']] || 0;
    }

    const maxPossible = 50 + career.skills.length * 12 + career.interests.length * 10 + 15 + 8;
    const matchScore = Math.min(Math.round((score / maxPossible) * 100), 99);

    // O/L math bonus amount (for scoreBreakdown)
    let mathBonus = 0;
    if (stemCareerIds.includes(career.id) && olResults['Mathematics']) {
      mathBonus = { A: 8, B: 5, C: 2, S: 0, W: 0 }[olResults['Mathematics']] || 0;
    }

    return {
      id: career.id,
      title: career.title,
      icon: career.icon,
      description: career.description,
      salary: formatSalary(career.salaryMin, career.salaryMax),
      demand: career.demand,
      demandColor: career.demandColor,
      relatedCourseIds: career.relatedCourseIds,
      requiredSkills: career.skills,
      requiredInterests: career.interests,
      scoreBreakdown: {
        stream:    career.streams.includes(alStream) ? 50 : 0,
        skills:    skillMatches.length * 12,
        interests: interestMatches.length * 10,
        grades:    aCount * 5 + bCount * 2,
        mathBonus,
      },
      score,
      matchScore,
    };
  });

  return scored
    .filter((c) => c.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 8);
}

module.exports = { computeRecommendations };
