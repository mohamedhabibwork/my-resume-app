import type { Resume } from '@/types'
import { generateId } from './helpers'

/**
 * Generate sample resume data for template previews
 */
export function generateSampleResume(template: string = 'modern'): Resume {
  return {
    id: 'sample',
    userId: 'sample',
    title: 'Sample Resume',
    template,
    personalInfo: {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      phone: '+1 (555) 123-4567',
      location: 'San Francisco, CA',
      website: 'https://johndoe.dev',
      linkedin: 'https://linkedin.com/in/johndoe',
      github: 'https://github.com/johndoe',
      summary: 'Experienced software engineer with 5+ years of expertise in full-stack development. Passionate about building scalable applications and leading cross-functional teams.',
    },
    workExperience: [
      {
        id: generateId(),
        position: 'Senior Software Engineer',
        company: 'Tech Corp',
        location: 'San Francisco, CA',
        startDate: '2020-01',
        endDate: '2024-12',
        current: false,
        description: 'Led development of microservices architecture serving 1M+ users.',
        highlights: [
          'Architected and implemented scalable backend systems',
          'Mentored team of 5 junior developers',
          'Reduced system latency by 40% through optimization',
        ],
      },
      {
        id: generateId(),
        position: 'Software Engineer',
        company: 'StartupXYZ',
        location: 'Remote',
        startDate: '2018-06',
        endDate: '2019-12',
        current: false,
        description: 'Developed and maintained web applications using modern frameworks.',
        highlights: [
          'Built responsive frontend with React and TypeScript',
          'Implemented RESTful APIs with Node.js',
          'Collaborated with design team on UI/UX improvements',
        ],
      },
    ],
    education: [
      {
        id: generateId(),
        degree: 'Bachelor of Science',
        field: 'Computer Science',
        institution: 'University of California',
        location: 'Berkeley, CA',
        startDate: '2014-09',
        endDate: '2018-05',
        current: false,
        gpa: '3.8',
        highlights: [
          'Dean\'s List: Fall 2016, Spring 2017',
          'Relevant Coursework: Data Structures, Algorithms, Database Systems',
        ],
      },
    ],
    skills: [
      { id: generateId(), name: 'JavaScript', level: 'expert', category: 'Programming', showProgress: true, progress: 95, isHidden: false },
      { id: generateId(), name: 'TypeScript', level: 'expert', category: 'Programming', showProgress: true, progress: 90, isHidden: false },
      { id: generateId(), name: 'React', level: 'expert', category: 'Frontend', showProgress: true, progress: 95, isHidden: false },
      { id: generateId(), name: 'Node.js', level: 'advanced', category: 'Backend', showProgress: true, progress: 85, isHidden: false },
      { id: generateId(), name: 'Python', level: 'advanced', category: 'Programming', showProgress: true, progress: 80, isHidden: false },
      { id: generateId(), name: 'AWS', level: 'intermediate', category: 'Cloud', showProgress: true, progress: 70, isHidden: false },
    ],
    projects: [
      {
        id: generateId(),
        name: 'E-Commerce Platform',
        description: 'Full-stack e-commerce solution with payment integration and inventory management.',
        technologies: ['React', 'Node.js', 'PostgreSQL', 'Stripe API'],
        url: 'https://example.com/project1',
        githubUrl: 'https://github.com/johndoe/ecommerce',
        startDate: '2023-01',
        endDate: '2023-06',
        highlights: [
          'Implemented real-time inventory tracking',
          'Integrated secure payment processing',
        ],
      },
      {
        id: generateId(),
        name: 'Task Management App',
        description: 'Collaborative task management tool with real-time updates.',
        technologies: ['Vue.js', 'Firebase', 'TypeScript'],
        url: 'https://example.com/project2',
        githubUrl: 'https://github.com/johndoe/tasks',
        startDate: '2022-08',
        endDate: '2022-12',
        highlights: [
          'Real-time collaboration features',
          'Offline-first architecture',
        ],
      },
    ],
    certifications: [
      {
        id: generateId(),
        name: 'AWS Certified Solutions Architect',
        issuer: 'Amazon Web Services',
        issueDate: '2023-03',
        expiryDate: '2026-03',
        credentialId: 'AWS-123456',
        url: 'https://aws.amazon.com/verification',
      },
      {
        id: generateId(),
        name: 'Google Cloud Professional Developer',
        issuer: 'Google Cloud',
        issueDate: '2022-11',
        credentialId: 'GCP-789012',
      },
    ],
    languages: [
      { id: generateId(), name: 'English', proficiency: 'native' },
      { id: generateId(), name: 'Spanish', proficiency: 'fluent' },
      { id: generateId(), name: 'French', proficiency: 'intermediate' },
    ],
    links: [
      { id: generateId(), label: 'Portfolio', url: 'https://johndoe.dev', type: 'portfolio' },
      { id: generateId(), label: 'Blog', url: 'https://blog.johndoe.dev', type: 'blog' },
    ],
    isPublic: false,
    slug: 'sample-resume',
    theme: {
      primary: '#3b82f6',
      secondary: '#6b7280',
      text: '#111827',
      background: '#ffffff',
      accent: '#10b981',
    },
    fontSettings: {
      family: 'Arial, sans-serif',
      size: 13,
      weight: 'normal',
      lineHeight: 1.6,
    },
    sectionOrder: [],
    timestamps: {
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  }
}
