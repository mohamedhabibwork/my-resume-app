/**
 * ATS Analyzer Service - Dynamic Resume Analysis
 *
 * This service provides comprehensive ATS (Applicant Tracking System) analysis
 * by extracting text from files and performing multi-factor scoring.
 */

export interface ATSAnalysisResult {
  overall: number
  breakdown: {
    keywords: number
    formatting: number
    completeness: number
    structure: number
    readability: number
  }
  suggestions: ATSSuggestion[]
  keywords: {
    found: string[]
    missing: string[]
    industryMatch: number
  }
  details: {
    wordCount: number
    sentenceCount: number
    avgWordsPerSentence: number
    bulletPointCount: number
    hasContactInfo: ContactInfoCheck
    sections: SectionCheck[]
    actionVerbs: ActionVerbAnalysis
    quantifiableAchievements: number
    educationFound: boolean
    experienceFound: boolean
  }
}

export interface ATSSuggestion {
  category: string
  severity: 'high' | 'medium' | 'low'
  message: string
  fix: string
}

interface ContactInfoCheck {
  hasEmail: boolean
  hasPhone: boolean
  hasLinkedIn: boolean
  hasLocation: boolean
  hasWebsite: boolean
}

interface SectionCheck {
  name: string
  found: boolean
  quality: 'good' | 'needs-improvement' | 'missing'
}

interface ActionVerbAnalysis {
  found: string[]
  count: number
  percentage: number
}

// Industry-specific keyword databases
const INDUSTRY_KEYWORDS: Record<string, string[]> = {
  technology: [
    'javascript', 'typescript', 'python', 'java', 'react', 'vue', 'angular', 'node.js', 'nodejs',
    'aws', 'azure', 'gcp', 'cloud', 'docker', 'kubernetes', 'ci/cd', 'devops', 'agile', 'scrum',
    'api', 'rest', 'graphql', 'microservices', 'database', 'sql', 'nosql', 'mongodb', 'postgresql',
    'git', 'github', 'gitlab', 'testing', 'unit test', 'integration', 'deployment', 'scalability',
    'machine learning', 'ai', 'data science', 'analytics', 'big data', 'etl', 'data pipeline',
    'security', 'authentication', 'authorization', 'encryption', 'cybersecurity', 'linux', 'unix',
    'mobile', 'ios', 'android', 'react native', 'flutter', 'swift', 'kotlin', 'full stack',
    'frontend', 'backend', 'fullstack', 'software engineer', 'developer', 'architect',
  ],
  marketing: [
    'seo', 'sem', 'ppc', 'google ads', 'facebook ads', 'social media', 'content marketing',
    'email marketing', 'marketing automation', 'hubspot', 'salesforce', 'crm', 'analytics',
    'google analytics', 'conversion', 'roi', 'kpi', 'brand', 'campaign', 'strategy',
    'digital marketing', 'lead generation', 'content creation', 'copywriting', 'a/b testing',
    'customer acquisition', 'retention', 'engagement', 'influencer', 'viral', 'growth hacking',
  ],
  finance: [
    'financial analysis', 'budgeting', 'forecasting', 'accounting', 'audit', 'compliance',
    'risk management', 'investment', 'portfolio', 'equity', 'derivatives', 'excel', 'financial modeling',
    'valuation', 'due diligence', 'm&a', 'private equity', 'venture capital', 'banking',
    'gaap', 'ifrs', 'sec', 'regulatory', 'tax', 'revenue', 'profit', 'loss', 'balance sheet',
  ],
  healthcare: [
    'patient care', 'clinical', 'medical', 'healthcare', 'hipaa', 'ehr', 'emr', 'diagnosis',
    'treatment', 'nursing', 'physician', 'pharmacy', 'laboratory', 'radiology', 'surgery',
    'emergency', 'intensive care', 'rehabilitation', 'mental health', 'telemedicine',
  ],
  general: [
    'leadership', 'management', 'team', 'project', 'communication', 'problem-solving',
    'analytical', 'strategic', 'collaborative', 'innovative', 'results-driven', 'detail-oriented',
    'organized', 'deadline', 'stakeholder', 'presentation', 'negotiation', 'customer service',
    'training', 'mentoring', 'budget', 'reporting', 'process improvement', 'efficiency',
  ],
}

// Action verbs that ATS systems look for
const ACTION_VERBS = [
  // Leadership
  'led', 'managed', 'directed', 'supervised', 'coordinated', 'oversaw', 'headed', 'guided',
  // Achievement
  'achieved', 'accomplished', 'exceeded', 'surpassed', 'delivered', 'completed', 'attained',
  // Creation
  'created', 'developed', 'designed', 'built', 'established', 'founded', 'launched', 'initiated',
  // Improvement
  'improved', 'enhanced', 'optimized', 'streamlined', 'transformed', 'modernized', 'upgraded',
  // Analysis
  'analyzed', 'evaluated', 'assessed', 'researched', 'investigated', 'examined', 'reviewed',
  // Communication
  'presented', 'negotiated', 'persuaded', 'collaborated', 'facilitated', 'communicated',
  // Technical
  'implemented', 'deployed', 'engineered', 'programmed', 'configured', 'automated', 'integrated',
  // Growth
  'increased', 'grew', 'expanded', 'scaled', 'boosted', 'accelerated', 'maximized',
  // Cost/Efficiency
  'reduced', 'decreased', 'minimized', 'saved', 'cut', 'eliminated', 'consolidated',
  // Support
  'supported', 'assisted', 'maintained', 'resolved', 'troubleshot', 'trained', 'mentored',
]

// Required resume sections
const REQUIRED_SECTIONS = [
  { name: 'Contact Information', patterns: ['email', 'phone', 'address', 'linkedin', 'location'] },
  { name: 'Summary/Objective', patterns: ['summary', 'objective', 'profile', 'about me', 'overview'] },
  { name: 'Work Experience', patterns: ['experience', 'employment', 'work history', 'professional experience'] },
  { name: 'Education', patterns: ['education', 'academic', 'degree', 'university', 'college', 'school'] },
  { name: 'Skills', patterns: ['skills', 'competencies', 'expertise', 'proficiencies', 'technical skills'] },
]

// Optional but valuable sections
const OPTIONAL_SECTIONS = [
  { name: 'Certifications', patterns: ['certification', 'certificate', 'licensed', 'accredited'] },
  { name: 'Projects', patterns: ['project', 'portfolio'] },
  { name: 'Languages', patterns: ['language', 'fluent', 'proficient'] },
  { name: 'Awards', patterns: ['award', 'honor', 'recognition', 'achievement'] },
  { name: 'Publications', patterns: ['publication', 'published', 'authored', 'paper'] },
  { name: 'Volunteer', patterns: ['volunteer', 'community', 'nonprofit'] },
]

/**
 * Main analysis function - analyzes extracted text from resume
 */
export async function analyzeResumeText(
  resumeText: string,
  jobDescription?: string
): Promise<ATSAnalysisResult> {
  const normalizedText = normalizeText(resumeText)
  const lowerText = normalizedText.toLowerCase()

  // Extract job description keywords if provided
  const jobKeywords = jobDescription ? extractKeywordsFromJobDescription(jobDescription) : []

  // Perform all analyses
  const contactInfo = analyzeContactInfo(lowerText)
  const sections = analyzeSections(lowerText)
  const actionVerbs = analyzeActionVerbs(lowerText)
  const wordAnalysis = analyzeWordStructure(normalizedText)
  const keywordAnalysis = analyzeKeywords(lowerText, jobKeywords)
  const quantifiableAchievements = countQuantifiableAchievements(normalizedText)

  // Calculate breakdown scores
  const breakdown = {
    keywords: calculateKeywordScore(keywordAnalysis, jobKeywords.length > 0),
    formatting: calculateFormattingScore(contactInfo, sections, wordAnalysis),
    completeness: calculateCompletenessScore(sections, contactInfo, wordAnalysis),
    structure: calculateStructureScore(sections, wordAnalysis),
    readability: calculateReadabilityScore(wordAnalysis, actionVerbs),
  }

  // Calculate overall score with weighted average
  const overall = Math.round(
    breakdown.keywords * 0.30 +
    breakdown.formatting * 0.20 +
    breakdown.completeness * 0.20 +
    breakdown.structure * 0.15 +
    breakdown.readability * 0.15
  )

  // Generate dynamic suggestions
  const suggestions = generateDynamicSuggestions(
    breakdown,
    contactInfo,
    sections,
    actionVerbs,
    keywordAnalysis,
    wordAnalysis,
    quantifiableAchievements
  )

  return {
    overall,
    breakdown,
    suggestions,
    keywords: keywordAnalysis,
    details: {
      wordCount: wordAnalysis.wordCount,
      sentenceCount: wordAnalysis.sentenceCount,
      avgWordsPerSentence: wordAnalysis.avgWordsPerSentence,
      bulletPointCount: wordAnalysis.bulletPointCount,
      hasContactInfo: contactInfo,
      sections: sections,
      actionVerbs: actionVerbs,
      quantifiableAchievements,
      educationFound: sections.some(s => s.name === 'Education' && s.found),
      experienceFound: sections.some(s => s.name === 'Work Experience' && s.found),
    },
  }
}

/**
 * Normalize text for analysis
 */
function normalizeText(text: string): string {
  return text
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    .replace(/\t/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

/**
 * Extract keywords from job description
 */
function extractKeywordsFromJobDescription(jobDescription: string): string[] {
  const lowerDesc = jobDescription.toLowerCase()
  const words = lowerDesc.match(/\b[a-z]+(?:[-./][a-z]+)*\b/g) || []

  // Filter out common stop words
  const stopWords = new Set([
    'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with',
    'by', 'from', 'as', 'is', 'was', 'are', 'were', 'been', 'be', 'have', 'has', 'had',
    'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'must',
    'shall', 'can', 'need', 'we', 'you', 'your', 'our', 'their', 'this', 'that', 'these',
    'those', 'it', 'its', 'which', 'who', 'whom', 'what', 'where', 'when', 'why', 'how',
    'all', 'each', 'every', 'both', 'few', 'more', 'most', 'other', 'some', 'such', 'no',
    'nor', 'not', 'only', 'own', 'same', 'so', 'than', 'too', 'very', 'just', 'about',
  ])

  // Count word frequency
  const wordFreq: Record<string, number> = {}
  words.forEach(word => {
    if (word.length > 2 && !stopWords.has(word)) {
      wordFreq[word] = (wordFreq[word] || 0) + 1
    }
  })

  // Get top keywords by frequency
  const sortedKeywords = Object.entries(wordFreq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 30)
    .map(([word]) => word)

  // Also add any industry keywords found
  const allIndustryKeywords = Object.values(INDUSTRY_KEYWORDS).flat()
  const foundIndustryKeywords = allIndustryKeywords.filter(kw =>
    lowerDesc.includes(kw.toLowerCase())
  )

  return [...new Set([...sortedKeywords, ...foundIndustryKeywords])]
}

/**
 * Analyze contact information presence
 */
function analyzeContactInfo(text: string): ContactInfoCheck {
  return {
    hasEmail: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/.test(text),
    hasPhone: /(\+?1[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/.test(text) ||
              /\d{10,}/.test(text.replace(/\D/g, '')),
    hasLinkedIn: /linkedin\.com|linkedin/i.test(text),
    hasLocation: /\b(city|state|country|address|location)\b/i.test(text) ||
                 /\b[A-Z][a-z]+,\s*[A-Z]{2}\b/.test(text), // City, ST format
    hasWebsite: /https?:\/\/|www\./i.test(text) || /\.com|\.io|\.dev|\.org/i.test(text),
  }
}

/**
 * Analyze sections present in resume
 */
function analyzeSections(text: string): SectionCheck[] {
  const allSections = [...REQUIRED_SECTIONS, ...OPTIONAL_SECTIONS]

  return allSections.map(section => {
    const found = section.patterns.some(pattern =>
      text.includes(pattern.toLowerCase())
    )

    // Determine quality based on content around the section
    let quality: 'good' | 'needs-improvement' | 'missing' = 'missing'
    if (found) {
      // Check if section has substantial content
      const patternIndex = section.patterns.reduce((minIdx, pattern) => {
        const idx = text.indexOf(pattern.toLowerCase())
        return idx !== -1 && (minIdx === -1 || idx < minIdx) ? idx : minIdx
      }, -1)

      if (patternIndex !== -1) {
        const sectionContent = text.substring(patternIndex, patternIndex + 500)
        const contentLength = sectionContent.split(/\s+/).length
        quality = contentLength > 30 ? 'good' : 'needs-improvement'
      }
    }

    return { name: section.name, found, quality }
  })
}

/**
 * Analyze action verbs usage
 */
function analyzeActionVerbs(text: string): ActionVerbAnalysis {
  const foundVerbs: string[] = []

  ACTION_VERBS.forEach(verb => {
    // Match verb at word boundary
    const regex = new RegExp(`\\b${verb}(?:ed|ing|s)?\\b`, 'gi')
    if (regex.test(text)) {
      foundVerbs.push(verb)
    }
  })

  const uniqueVerbs = [...new Set(foundVerbs)]

  return {
    found: uniqueVerbs,
    count: uniqueVerbs.length,
    percentage: Math.round((uniqueVerbs.length / ACTION_VERBS.length) * 100),
  }
}

/**
 * Analyze word structure and statistics
 */
function analyzeWordStructure(text: string): {
  wordCount: number
  sentenceCount: number
  avgWordsPerSentence: number
  bulletPointCount: number
  paragraphCount: number
} {
  const words = text.match(/\b\w+\b/g) || []
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0)
  const bulletPoints = (text.match(/[•\-*\u2022\u2023\u25E6\u2043\u2219]/g) || []).length
  const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim().length > 0)

  return {
    wordCount: words.length,
    sentenceCount: sentences.length,
    avgWordsPerSentence: sentences.length > 0 ? Math.round(words.length / sentences.length) : 0,
    bulletPointCount: bulletPoints,
    paragraphCount: paragraphs.length,
  }
}

/**
 * Analyze keywords in resume
 */
function analyzeKeywords(text: string, jobKeywords: string[]): {
  found: string[]
  missing: string[]
  industryMatch: number
} {
  // Combine all industry keywords
  const allKeywords = [...new Set([
    ...Object.values(INDUSTRY_KEYWORDS).flat(),
    ...jobKeywords,
  ])]

  const foundKeywords: string[] = []
  const missingFromJob: string[] = []

  // Check which keywords are present
  allKeywords.forEach(keyword => {
    const keywordLower = keyword.toLowerCase()
    if (text.includes(keywordLower)) {
      foundKeywords.push(keyword)
    }
  })

  // Check job-specific keywords
  if (jobKeywords.length > 0) {
    jobKeywords.forEach(keyword => {
      if (!text.includes(keyword.toLowerCase())) {
        missingFromJob.push(keyword)
      }
    })
  }

  // Calculate industry match percentage
  const generalKeywords = INDUSTRY_KEYWORDS.general || []
  const matchedGeneral = generalKeywords.filter(kw => text.includes(kw.toLowerCase()))
  const industryMatch = generalKeywords.length > 0
    ? Math.round((matchedGeneral.length / generalKeywords.length) * 100)
    : 0

  return {
    found: [...new Set(foundKeywords)].slice(0, 20), // Top 20 found
    missing: missingFromJob.slice(0, 10), // Top 10 missing
    industryMatch,
  }
}

/**
 * Count quantifiable achievements (numbers, percentages, dollar amounts)
 */
function countQuantifiableAchievements(text: string): number {
  const patterns = [
    /\d+%/g,                           // Percentages
    /\$[\d,]+(?:\.\d{2})?/g,           // Dollar amounts
    /\d+(?:,\d{3})+/g,                 // Large numbers with commas
    /\b\d+\+?\s*(?:years?|months?|weeks?|days?|hours?)/gi, // Time periods
    /\b\d+\s*(?:clients?|customers?|users?|teams?|projects?|people)/gi, // Counts
    /increased?\s*(?:by\s*)?\d+/gi,    // Increases
    /reduced?\s*(?:by\s*)?\d+/gi,      // Reductions
    /saved?\s*(?:\$)?[\d,]+/gi,        // Savings
    /\d+x\s/gi,                        // Multipliers
  ]

  let count = 0
  patterns.forEach(pattern => {
    const matches = text.match(pattern)
    if (matches) {
      count += matches.length
    }
  })

  return count
}

/**
 * Calculate keyword score
 */
function calculateKeywordScore(
  keywordAnalysis: { found: string[]; missing: string[]; industryMatch: number },
  hasJobDescription: boolean
): number {
  let score = 0

  // Base score from industry keywords found
  score += Math.min(keywordAnalysis.industryMatch, 40)

  // Bonus for job-specific keyword matches
  if (hasJobDescription) {
    const matchRate = keywordAnalysis.found.length /
      (keywordAnalysis.found.length + keywordAnalysis.missing.length) || 0
    score += matchRate * 40
  } else {
    score += 20 // Default score if no job description
  }

  // Bonus for keyword variety
  const varietyBonus = Math.min(keywordAnalysis.found.length * 2, 20)
  score += varietyBonus

  return Math.min(Math.round(score), 100)
}

/**
 * Calculate formatting score
 */
function calculateFormattingScore(
  contactInfo: ContactInfoCheck,
  sections: SectionCheck[],
  wordAnalysis: { wordCount: number; bulletPointCount: number }
): number {
  let score = 100

  // Contact info deductions
  if (!contactInfo.hasEmail) score -= 15
  if (!contactInfo.hasPhone) score -= 10
  if (!contactInfo.hasLinkedIn) score -= 5

  // Section presence deductions
  const requiredSections = sections.slice(0, 5) // First 5 are required
  requiredSections.forEach(section => {
    if (!section.found) score -= 12
    else if (section.quality === 'needs-improvement') score -= 5
  })

  // Word count check (ideal: 400-800 words)
  if (wordAnalysis.wordCount < 200) score -= 15
  else if (wordAnalysis.wordCount < 400) score -= 5
  else if (wordAnalysis.wordCount > 1200) score -= 10

  // Bullet point usage (good for ATS)
  if (wordAnalysis.bulletPointCount < 3) score -= 10
  else if (wordAnalysis.bulletPointCount >= 10) score += 5

  return Math.max(0, Math.min(100, score))
}

/**
 * Calculate completeness score
 */
function calculateCompletenessScore(
  sections: SectionCheck[],
  contactInfo: ContactInfoCheck,
  wordAnalysis: { wordCount: number; paragraphCount: number }
): number {
  let score = 0

  // Contact info completeness (20 points)
  const contactFields = [
    contactInfo.hasEmail,
    contactInfo.hasPhone,
    contactInfo.hasLinkedIn,
    contactInfo.hasLocation,
  ]
  const contactScore = (contactFields.filter(Boolean).length / contactFields.length) * 20
  score += contactScore

  // Required sections (50 points)
  const requiredSections = sections.slice(0, 5)
  const foundRequired = requiredSections.filter(s => s.found).length
  score += (foundRequired / requiredSections.length) * 50

  // Optional sections bonus (15 points)
  const optionalSections = sections.slice(5)
  const foundOptional = optionalSections.filter(s => s.found).length
  score += Math.min((foundOptional / 3) * 15, 15)

  // Content depth (15 points)
  if (wordAnalysis.wordCount >= 300) score += 5
  if (wordAnalysis.wordCount >= 500) score += 5
  if (wordAnalysis.paragraphCount >= 4) score += 5

  return Math.min(Math.round(score), 100)
}

/**
 * Calculate structure score
 */
function calculateStructureScore(
  sections: SectionCheck[],
  wordAnalysis: { avgWordsPerSentence: number; bulletPointCount: number }
): number {
  let score = 100

  // Check for logical section presence
  const hasExperience = sections.find(s => s.name === 'Work Experience')?.found
  const hasEducation = sections.find(s => s.name === 'Education')?.found
  const hasSummary = sections.find(s => s.name === 'Summary/Objective')?.found
  const hasSkills = sections.find(s => s.name === 'Skills')?.found

  if (!hasExperience && !hasEducation) score -= 30
  if (!hasSummary) score -= 15
  if (!hasSkills) score -= 10

  // Sentence length check (ideal: 15-25 words)
  if (wordAnalysis.avgWordsPerSentence > 30) score -= 15
  else if (wordAnalysis.avgWordsPerSentence > 25) score -= 5

  // Bullet points for scannability
  if (wordAnalysis.bulletPointCount >= 5) score += 10

  return Math.max(0, Math.min(100, score))
}

/**
 * Calculate readability score
 */
function calculateReadabilityScore(
  wordAnalysis: { wordCount: number; sentenceCount: number; avgWordsPerSentence: number },
  actionVerbs: ActionVerbAnalysis
): number {
  let score = 0

  // Action verb usage (40 points)
  if (actionVerbs.count >= 10) score += 40
  else if (actionVerbs.count >= 5) score += 25
  else if (actionVerbs.count >= 3) score += 15
  else score += actionVerbs.count * 3

  // Sentence variety (30 points)
  const optimalAvg = wordAnalysis.avgWordsPerSentence >= 12 &&
                     wordAnalysis.avgWordsPerSentence <= 20
  if (optimalAvg) score += 30
  else if (wordAnalysis.avgWordsPerSentence >= 8 &&
           wordAnalysis.avgWordsPerSentence <= 25) score += 20
  else score += 10

  // Word count appropriateness (30 points)
  if (wordAnalysis.wordCount >= 400 && wordAnalysis.wordCount <= 800) score += 30
  else if (wordAnalysis.wordCount >= 300 && wordAnalysis.wordCount <= 1000) score += 20
  else if (wordAnalysis.wordCount >= 200) score += 10

  return Math.min(Math.round(score), 100)
}

/**
 * Generate dynamic suggestions based on analysis
 */
function generateDynamicSuggestions(
  breakdown: ATSAnalysisResult['breakdown'],
  contactInfo: ContactInfoCheck,
  sections: SectionCheck[],
  actionVerbs: ActionVerbAnalysis,
  keywordAnalysis: { found: string[]; missing: string[]; industryMatch: number },
  wordAnalysis: { wordCount: number; bulletPointCount: number; avgWordsPerSentence: number },
  quantifiableAchievements: number
): ATSSuggestion[] {
  const suggestions: ATSSuggestion[] = []

  // Contact info suggestions
  if (!contactInfo.hasEmail) {
    suggestions.push({
      category: 'contact',
      severity: 'high',
      message: 'Missing email address',
      fix: 'Add a professional email address at the top of your resume. Use a format like firstname.lastname@email.com',
    })
  }

  if (!contactInfo.hasPhone) {
    suggestions.push({
      category: 'contact',
      severity: 'high',
      message: 'Missing phone number',
      fix: 'Include a phone number where recruiters can reach you. Format it consistently (e.g., (123) 456-7890)',
    })
  }

  if (!contactInfo.hasLinkedIn) {
    suggestions.push({
      category: 'contact',
      severity: 'medium',
      message: 'No LinkedIn profile detected',
      fix: 'Add your LinkedIn profile URL. Many recruiters check LinkedIn to learn more about candidates',
    })
  }

  // Section suggestions
  const missingSections = sections.filter(s => !s.found && REQUIRED_SECTIONS.some(r => r.name === s.name))
  missingSections.forEach(section => {
    suggestions.push({
      category: 'structure',
      severity: 'high',
      message: `Missing "${section.name}" section`,
      fix: `Add a clear "${section.name}" section to your resume. This is essential for ATS parsing`,
    })
  })

  // Keyword suggestions
  if (breakdown.keywords < 60) {
    suggestions.push({
      category: 'keywords',
      severity: 'high',
      message: 'Low keyword density for industry terms',
      fix: 'Add more industry-specific keywords throughout your resume. Include relevant technical skills, tools, and methodologies',
    })
  }

  if (keywordAnalysis.missing.length > 0) {
    suggestions.push({
      category: 'keywords',
      severity: 'medium',
      message: `Missing key terms from job description: ${keywordAnalysis.missing.slice(0, 5).join(', ')}`,
      fix: 'Incorporate these keywords naturally into your experience descriptions and skills section',
    })
  }

  // Action verbs suggestions
  if (actionVerbs.count < 5) {
    suggestions.push({
      category: 'content',
      severity: 'high',
      message: 'Not enough action verbs used',
      fix: `Start bullet points with strong action verbs like: ${ACTION_VERBS.slice(0, 8).join(', ')}. These make your achievements stand out`,
    })
  }

  // Quantifiable achievements
  if (quantifiableAchievements < 3) {
    suggestions.push({
      category: 'content',
      severity: 'high',
      message: 'Few quantifiable achievements found',
      fix: 'Add numbers, percentages, and metrics to demonstrate impact. E.g., "Increased sales by 25%" or "Managed team of 10"',
    })
  }

  // Word count suggestions
  if (wordAnalysis.wordCount < 300) {
    suggestions.push({
      category: 'completeness',
      severity: 'high',
      message: 'Resume appears too short',
      fix: 'Expand your resume with more details about your responsibilities, achievements, and skills. Aim for at least 400-600 words',
    })
  } else if (wordAnalysis.wordCount > 1000) {
    suggestions.push({
      category: 'formatting',
      severity: 'medium',
      message: 'Resume may be too long',
      fix: 'Consider condensing your content. Focus on the most relevant and recent experience. Aim for 1-2 pages maximum',
    })
  }

  // Bullet points
  if (wordAnalysis.bulletPointCount < 5) {
    suggestions.push({
      category: 'formatting',
      severity: 'medium',
      message: 'Limited use of bullet points',
      fix: 'Use bullet points to list achievements and responsibilities. This improves readability and ATS parsing',
    })
  }

  // Sentence length
  if (wordAnalysis.avgWordsPerSentence > 25) {
    suggestions.push({
      category: 'readability',
      severity: 'low',
      message: 'Sentences are too long on average',
      fix: 'Break down long sentences into shorter, more concise statements. Aim for 15-20 words per sentence',
    })
  }

  // Sort by severity
  const severityOrder = { high: 0, medium: 1, low: 2 }
  suggestions.sort((a, b) => severityOrder[a.severity] - severityOrder[b.severity])

  return suggestions.slice(0, 10) // Return top 10 suggestions
}

/**
 * Read file content - attempts to extract text from file
 * For PDF files, this returns a placeholder as browser-side PDF parsing requires libraries
 */
export async function extractTextFromFile(file: File): Promise<string> {
  const fileType = file.type
  const fileName = file.name.toLowerCase()

  // For text-based files
  if (fileType === 'text/plain' || fileName.endsWith('.txt')) {
    return await file.text()
  }

  // For PDF files - we'll read the raw content and extract what we can
  if (fileType === 'application/pdf' || fileName.endsWith('.pdf')) {
    return await extractTextFromPDF(file)
  }

  // For Word documents (.docx) - they're ZIP files containing XML
  if (fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
      fileName.endsWith('.docx')) {
    return await extractTextFromDocx(file)
  }

  // For older Word documents (.doc) - harder to parse in browser
  if (fileType === 'application/msword' || fileName.endsWith('.doc')) {
    // Best effort - try to read as text
    const text = await file.text()
    // Clean up binary characters
    // eslint-disable-next-line no-control-regex
    const cleanRegex = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F-\u009F]/g
    return text.replace(cleanRegex, ' ')
               .replace(/\s+/g, ' ')
               .trim()
  }

  throw new Error('Unsupported file type')
}

/**
 * Extract text from PDF - basic extraction
 */
async function extractTextFromPDF(file: File): Promise<string> {
  const buffer = await file.arrayBuffer()
  const bytes = new Uint8Array(buffer)

  // Convert to string for text extraction
  let text = ''
  const decoder = new TextDecoder('utf-8', { fatal: false })
  const rawText = decoder.decode(bytes)

  // Extract text between stream and endstream markers
  const streamRegex = /stream[\r\n]+([\s\S]*?)[\r\n]+endstream/g
  let match

  while ((match = streamRegex.exec(rawText)) !== null) {
    // Try to decode the stream content
    const streamContent = match[1]
    if (streamContent) {
      // Look for text operators in PDF (Tj, TJ, ')
      const textMatches = streamContent.match(/\(([^)]+)\)/g)
      if (textMatches) {
        textMatches.forEach(m => {
          const cleanedText = m.slice(1, -1)
            .replace(/\\n/g, '\n')
            .replace(/\\r/g, '\r')
            .replace(/\\t/g, '\t')
            .replace(/\\\(/g, '(')
            .replace(/\\\)/g, ')')
            .replace(/\\\\/g, '\\')
          text += cleanedText + ' '
        })
      }
    }
  }

  // Also try to extract any readable ASCII text
  const asciiText = rawText
    .match(/[\x20-\x7E\n\r\t]+/g)
    ?.filter(s => s.length > 10)
    ?.join(' ') || ''

  // Combine extracted text
  const combinedText = text + ' ' + asciiText

  // Clean up the result
  return combinedText
    .replace(/\s+/g, ' ')
    .replace(/[^\x20-\x7E\n\r\t]/g, ' ')
    .trim()
}

/**
 * Extract text from DOCX - parse XML content
 */
async function extractTextFromDocx(file: File): Promise<string> {
  const buffer = await file.arrayBuffer()
  const bytes = new Uint8Array(buffer)

  // DOCX files are ZIP archives - look for document.xml content
  // This is a simplified approach - for production, use JSZip library

  const decoder = new TextDecoder('utf-8', { fatal: false })
  const rawContent = decoder.decode(bytes)

  // Extract text from XML tags
  const textContent: string[] = []

  // Look for <w:t> tags (Word text elements)
  const textRegex = /<w:t[^>]*>([^<]*)<\/w:t>/g
  let match

  while ((match = textRegex.exec(rawContent)) !== null) {
    if (match[1]) {
      textContent.push(match[1])
    }
  }

  // Also look for plain text patterns
  if (textContent.length === 0) {
    // Fallback: extract readable text
    const readableText = rawContent
      .replace(/<[^>]+>/g, ' ') // Remove XML tags
      .match(/[\x20-\x7E\n\r\t]+/g)
      ?.filter(s => s.length > 5)
      ?.join(' ') || ''

    return readableText.replace(/\s+/g, ' ').trim()
  }

  return textContent.join(' ').replace(/\s+/g, ' ').trim()
}
