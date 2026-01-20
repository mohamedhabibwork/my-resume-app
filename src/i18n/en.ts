export default {
  // Common
  common: {
    loading: 'Loading...',
    error: 'An error occurred',
    success: 'Success',
    save: 'Save',
    cancel: 'Cancel',
    delete: 'Delete',
    edit: 'Edit',
    add: 'Add',
    remove: 'Remove',
    confirm: 'Confirm',
    back: 'Back',
    next: 'Next',
    submit: 'Submit',
    search: 'Search',
    filter: 'Filter',
    clear: 'Clear',
    close: 'Close',
    yes: 'Yes',
    no: 'No',
    or: 'or',
    and: 'and',
    required: 'Required',
    optional: 'Optional',
    locale: 'EN/AR',
    selected: 'Selected',
    preview: 'Preview',
    use: 'Use',
    useThisTemplate: 'Use This Template',
    free: 'Free',
    popular: 'Popular',
    toggleTheme: 'Toggle theme',
  },

  // Navigation
  nav: {
    home: 'Home',
    about: 'About',
    resume: 'Resume',
    contact: 'Contact',
    settings: 'Settings',
    profile: 'Profile',
    logout: 'Logout',
    login: 'Login',
    register: 'Register',
    atsChecker: 'ATS Checker',
    dashboard: 'Dashboard',
    navigation: 'Navigation',
    myAccount: 'My Account',
  },

  // Authentication
  auth: {
    login: 'Login',
    logout: 'Logout',
    register: 'Register',
    forgotPassword: 'Forgot Password?',
    resetPassword: 'Reset Password',
    email: 'Email',
    password: 'Password',
    confirmPassword: 'Confirm Password',
    rememberMe: 'Remember me',
    noAccount: "Don't have an account?",
    hasAccount: 'Already have an account?',
    loginSuccess: 'Successfully logged in',
    logoutSuccess: 'Successfully logged out',
    registerSuccess: 'Account created successfully',
    invalidCredentials: 'Invalid email or password',
    emailRequired: 'Email is required',
    passwordRequired: 'Password is required',
    passwordMismatch: 'Passwords do not match',
    passwordMinLength: 'Password must be at least 8 characters',
  },

  // Resume Sections
  resume: {
    title: 'Resume',
    createNew: 'Create New Resume',
    myResumes: 'My Resumes',
    preview: 'Preview',
    download: 'Download',
    share: 'Share',
    duplicate: 'Duplicate',
    deleteConfirm: 'Are you sure you want to delete this resume?',
    saving: 'Saving...',
    saved: 'Saved',
    completion: 'Completion',
    atsScore: 'ATS Score',
    sections: 'Sections',
    created: 'Resume created successfully',
    templateChanged: 'Template changed successfully',

    // Personal Info
    personalInfo: {
      title: 'Personal Information',
      firstName: 'First Name',
      lastName: 'Last Name',
      email: 'Email',
      phone: 'Phone',
      location: 'Location',
      website: 'Website',
      linkedin: 'LinkedIn',
      github: 'GitHub',
      summary: 'Professional Summary',
      summaryPlaceholder: 'Write a brief summary about yourself...',
    },

    // Work Experience
    experience: {
      title: 'Work Experience',
      addNew: 'Add Experience',
      company: 'Company',
      position: 'Position',
      location: 'Location',
      startDate: 'Start Date',
      endDate: 'End Date',
      current: 'I currently work here',
      description: 'Description',
      highlights: 'Key Achievements',
      addHighlight: 'Add Achievement',
    },

    // Education
    education: {
      title: 'Education',
      addNew: 'Add Education',
      institution: 'Institution',
      degree: 'Degree',
      field: 'Field of Study',
      location: 'Location',
      startDate: 'Start Date',
      endDate: 'End Date',
      current: 'Currently studying',
      gpa: 'GPA',
      highlights: 'Achievements',
      addHighlight: 'Add Achievement',
    },

    // Skills
    skills: {
      title: 'Skills',
      addNew: 'Add Skill',
      name: 'Skill Name',
      level: 'Proficiency Level',
      category: 'Category',
      levels: {
        beginner: 'Beginner',
        intermediate: 'Intermediate',
        advanced: 'Advanced',
        expert: 'Expert',
      },
    },

    // Projects
    projects: {
      title: 'Projects',
      addNew: 'Add Project',
      name: 'Project Name',
      description: 'Description',
      technologies: 'Technologies Used',
      url: 'Project URL',
      github: 'GitHub URL',
      startDate: 'Start Date',
      endDate: 'End Date',
      highlights: 'Key Features',
      addHighlight: 'Add Feature',
    },

    // Certifications
    certifications: {
      title: 'Certifications',
      addNew: 'Add Certification',
      name: 'Certification Name',
      issuer: 'Issuing Organization',
      issueDate: 'Issue Date',
      expiryDate: 'Expiry Date',
      credentialId: 'Credential ID',
      url: 'Credential URL',
    },

    // Languages
    languages: {
      title: 'Languages',
      addNew: 'Add Language',
      name: 'Language',
      proficiency: 'Proficiency',
      levels: {
        native: 'Native',
        fluent: 'Fluent',
        advanced: 'Advanced',
        intermediate: 'Intermediate',
        basic: 'Basic',
      },
    },

    // Links
    links: {
      title: 'Links',
      addNew: 'Add Link',
      name: 'Link Name',
      url: 'URL',
      type: 'Link Type',
    },
  },

  // Validation Messages
  validation: {
    required: 'This field is required',
    email: 'Please enter a valid email address',
    url: 'Please enter a valid URL',
    phone: 'Please enter a valid phone number',
    minLength: 'Must be at least {min} characters',
    maxLength: 'Must be no more than {max} characters',
    invalidDate: 'Please enter a valid date',
    endDateBeforeStart: 'End date must be after start date',
  },

  // Error Messages
  errors: {
    general: 'Something went wrong. Please try again.',
    network: 'Network error. Please check your connection.',
    notFound: 'The requested resource was not found.',
    unauthorized: 'You are not authorized to perform this action.',
    forbidden: 'Access denied.',
    serverError: 'Server error. Please try again later.',
    timeout: 'Request timed out. Please try again.',
  },

  // Success Messages
  success: {
    saved: 'Changes saved successfully',
    deleted: 'Deleted successfully',
    created: 'Created successfully',
    updated: 'Updated successfully',
    copied: 'Copied to clipboard',
  },

  // Confirmation Dialogs
  confirm: {
    delete: 'Are you sure you want to delete this?',
    unsavedChanges: 'You have unsaved changes. Are you sure you want to leave?',
    logout: 'Are you sure you want to logout?',
  },

  // Footer
  footer: {
    copyright: '© {year} My Resume App. All rights reserved.',
    privacy: 'Privacy Policy',
    terms: 'Terms of Service',
    cookies: 'Cookie Policy',
    contact: 'Contact Us',
    about: 'About Us',
    description: 'Create professional, ATS-optimized resumes with our easy-to-use builder. Land your dream job faster.',
    product: 'Product',
    company: 'Company',
    legal: 'Legal',
    resumeBuilder: 'Resume Builder',
    coverLetters: 'Cover Letters',
    madeWith: 'Made with',
    madeWithSuffix: 'by our team',
  },

  // ATS Score
  ats: {
    title: 'ATS Score',
    overall: 'Overall Score',
    keywords: 'Keywords',
    formatting: 'Formatting',
    completeness: 'Completeness',
    structure: 'Structure',
    bestPractices: 'Best Practices',
    suggestions: 'Suggestions',
    improveScore: 'Improve Score',
  },

  // Templates
  templates: {
    modern: 'Modern',
    classic: 'Classic',
    creative: 'Creative',
    executive: 'Executive',
    minimal: 'Minimal',
    twoColumn: 'Two Column',
    professional: 'Professional',
    tech: 'Tech',
    selectTemplate: 'Select Template',
    template: 'Template',
    previewNote: 'This is a preview with sample data. Your actual resume data will be used when you select this template.',
  },

  // Export/Import
  export: {
    title: 'Export',
    export: 'Export',
    import: 'Import',
    json: 'Export JSON',
    pdf: 'Download PDF',
    print: 'Print Resume',
    exportSuccess: 'Resume exported successfully',
    importSuccess: 'Resume imported successfully',
    importError: 'Failed to import resume',
    pdfSuccess: 'PDF downloaded successfully',
    pdfError: 'Failed to export PDF. Please try again.',
    jsonSuccess: 'JSON exported successfully',
    jsonError: 'Failed to export JSON. Please try again.',
    printError: 'Failed to open print dialog. Please allow popups.',
  },

  // Fonts
  fonts: {
    family: 'Font Family',
    size: 'Font Size',
    weight: 'Font Weight',
    lineHeight: 'Line Height',
    preview: 'Preview',
    sizes: {
      small: 'Small',
      medium: 'Medium',
      large: 'Large',
      extraLarge: 'Extra Large',
    },
  },

  // Themes
  themes: {
    title: 'Theme',
    primary: 'Primary Color',
    secondary: 'Secondary Color',
    text: 'Text Color',
    background: 'Background Color',
    accent: 'Accent Color',
  },

  // Cover Letters
  coverLetters: {
    title: 'Cover Letters',
    createNew: 'Create New Cover Letter',
    recipientName: 'Recipient Name',
    recipientCompany: 'Recipient Company',
    greeting: 'Greeting',
    body: 'Body',
    closing: 'Closing',
    signature: 'Signature',
  },

  // Notifications
  notifications: {
    settings: 'Notification Settings',
    status: 'Notification Status',
    enabled: 'Enabled',
    disabled: 'Disabled',
    pending: 'Pending',
    enable: 'Enable Notifications',
    disable: 'Disable Notifications',
    enabledDescription: 'You will receive push notifications for important updates.',
    disabledDescription: 'Notifications are disabled. Enable them to stay updated.',
    pendingDescription: 'Click the button below to enable notifications.',
    notSupported: 'Push notifications are not supported in this browser.',
    preferences: 'Notification Preferences',
    resumeUpdates: 'Resume Updates',
    resumeUpdatesDescription: 'Get notified when your resume is viewed or shared.',
    systemNotifications: 'System Notifications',
    systemNotificationsDescription: 'Receive important system updates and announcements.',
    marketing: 'Marketing',
    marketingDescription: 'Receive promotional offers and tips to improve your resume.',
    deviceToken: 'Device Token',
  },

  // Recommendations
  recommendations: {
    // Personal Info
    addFullName: 'Add your full name to make a strong first impression',
    addEmail: 'Add your email address - this is essential for recruiters to contact you',
    addPhone: 'Consider adding a phone number for faster communication',
    addSummary: 'Add a professional summary to highlight your key qualifications',
    expandSummary: 'Your summary is a bit short. Aim for 100-500 characters for best results',
    shortenSummary: 'Your summary is quite long. Consider shortening it to 500 characters or less',
    addLinkedIn: 'Adding your LinkedIn profile can increase your credibility',
    addLocation: 'Add your location to help recruiters find local candidates',
    personalInfoComplete: 'Great job! Your personal information section is complete',
    onlinePresence: 'Online Presence',
    moreLinks: 'More Social Links',
    additionalInfo: 'Additional Information',
    locationTip: 'City and country are usually sufficient. Full address is not recommended.',
    dateOfBirthTip: 'Note: Including date of birth is optional and varies by region',
    characters: 'characters',
    idealRange: 'Ideal range',
    summaryTipsTitle: 'Tips for a great summary',
    summaryTip1: 'Start with your professional title and years of experience',
    summaryTip2: 'Highlight 2-3 key achievements or skills',
    summaryTip3: 'Keep it focused and relevant to your target role',
    recommended: 'Recommended',

    // Work Experience
    addWorkExperience: 'Add at least one work experience to strengthen your resume',
    completeWorkExperience: 'Please complete all required fields for your work experience',
    addHighlights: 'Add key achievements to make your experience stand out',
    addJobDescription: 'Add a detailed job description (50+ characters recommended)',
    workExperienceGood: 'Your work experience section looks great!',
    noExperience: 'No work experience added yet',
    addFirstExperience: 'Add your work history to show your professional journey',
    companyWebsite: 'Company Website',
    jobDescriptionPlaceholder: 'Describe your responsibilities and key duties...',
    jobDescriptionTip: 'Focus on responsibilities, achievements, and impact you made',
    highlightsTip: 'Use action verbs and quantify achievements when possible',
    highlightPlaceholder: 'e.g., Increased sales by 25% through...',
    additionalOptions: 'Additional Options',
    supervisorName: 'Supervisor Name',
    hasReferences: 'References available upon request',

    // Education
    addEducation: 'Add your educational background',
    completeEducation: 'Please complete the required fields for your education',
    addGpa: 'Consider adding your GPA if it\'s above 3.0',
    educationGood: 'Your education section is well documented!',
    noEducation: 'No education added yet',
    addFirstEducation: 'Add your educational background to enhance your profile',
    institutionPlaceholder: 'e.g., Harvard University',
    fieldPlaceholder: 'e.g., Computer Science',
    gpaTip: 'Include GPA only if it\'s impressive (typically 3.0+ on a 4.0 scale)',
    educationHighlightPlaceholder: 'e.g., Dean\'s List, Cum Laude',
    relevantCoursework: 'Relevant Coursework',
    coursePlaceholder: 'e.g., Data Structures, Machine Learning',
    addCourse: 'Add Course',

    // Skills
    addSkills: 'Add your skills to showcase your abilities',
    addMoreSkills: 'Consider adding more skills (aim for 5-15 skills)',
    skillsGood: 'Great skill set! Your skills section looks balanced',
    tooManySkills: 'You have many skills listed. Consider keeping only the most relevant ones',
    categorizeSkills: 'Consider grouping your skills into categories for better organization',
    noSkills: 'No skills added yet',
    addFirstSkill: 'Add your technical and soft skills',
    quickAdd: 'Quick add',
    uncategorized: 'Uncategorized',
    popularSkills: 'Popular skills',
    skillLevelLegend: 'Skill Level Legend',
    clickToChangeLevel: 'Click on a skill to cycle through proficiency levels',

    // Projects
    addProjects: 'Showcase your projects to demonstrate your practical skills',
    addProjectUrls: 'Add URLs to your projects so recruiters can see your work',
    addProjectDescription: 'Add detailed descriptions to your projects',
    projectsGood: 'Excellent! Your projects are well documented with links',
    noProjects: 'No projects added yet',
    addFirstProject: 'Add personal or professional projects to showcase your work',
    projectNamePlaceholder: 'e.g., E-commerce Platform',
    projectDescriptionPlaceholder: 'Describe what the project does and your role...',
    addTechnology: 'Add technology',
    pressEnterToAdd: 'Press Enter to add',
    projectHighlightPlaceholder: 'e.g., Built RESTful API with 99.9% uptime',

    // Links
    addLinks: 'Add links to your portfolio, blog, or other online presence',
    fixInvalidUrls: 'Please fix the invalid URLs in your links',
    addLinkLabels: 'Add labels to your links so recruiters know what they are',
    linksGood: 'Your links section is properly set up!',
    noLinks: 'No additional links added yet',
    addFirstLink: 'Add links to your portfolio, blog, or other online profiles',
    linkLabelPlaceholder: 'e.g., My Portfolio',
    suggestedPlatforms: 'Suggested platforms',
    linkTypes: {
      portfolio: 'Portfolio',
      blog: 'Blog',
      other: 'Other',
    },
    reorderSections: 'Reorder Sections',
    dragToReorder: 'Drag sections to reorder them',
  },

  // Personal Info Additional Fields
  'resume.personalInfo.dateOfBirth': 'Date of Birth',
  'resume.personalInfo.nationality': 'Nationality',
  'resume.personalInfo.drivingLicense': 'Driving License',

  // Validation Additional
  'validation.invalidFormat': 'Invalid {field} URL format',

  // Common Additional
  'common.all': 'All',
  'common.select': 'Select...',
  'common.other': 'Other',

  // Contact Page
  contact: {
    title: 'Contact Us',
    subtitle: 'Have questions or feedback? We\'d love to hear from you. Our team is here to help.',
    email: 'Email',
    responseTime: 'Response Time',
    responseTimeValue: 'Within 24 hours',
    followUs: 'Follow Us',
    faqHint: 'Check our FAQ section for quick answers to common questions.',
    sendMessage: 'Send us a Message',
    name: 'Your Name',
    namePlaceholder: 'John Doe',
    emailPlaceholder: 'john@example.com',
    subject: 'Subject',
    selectSubject: 'Select a subject...',
    subjects: {
      general: 'General Inquiry',
      support: 'Technical Support',
      feedback: 'Feedback & Suggestions',
      billing: 'Billing & Payments',
      partnership: 'Partnership Opportunities',
    },
    message: 'Message',
    messagePlaceholder: 'How can we help you?',
    send: 'Send Message',
    successMessage: 'Your message has been sent successfully!',
    thankYou: 'Thank You!',
    weWillReply: 'We\'ve received your message and will get back to you within 24 hours.',
    sendAnother: 'Send Another Message',
  },

  // Terms of Service
  terms: {
    title: 'Terms of Service',
    lastUpdated: 'Last Updated',
    sections: {
      introduction: {
        title: 'Introduction',
        content: 'Welcome to My Resume App. By accessing or using our service, you agree to be bound by these Terms of Service. Please read them carefully before using the platform.',
      },
      account: {
        title: 'Account Terms',
        item1: 'You must be 13 years or older to use this service.',
        item2: 'You must provide accurate and complete information when creating an account.',
        item3: 'You are responsible for maintaining the security of your account and password.',
        item4: 'You are responsible for all activities that occur under your account.',
      },
      acceptableUse: {
        title: 'Acceptable Use',
        intro: 'You agree not to:',
        item1: 'Use the service for any illegal purpose or to violate any laws.',
        item2: 'Upload false, misleading, or fraudulent content.',
        item3: 'Attempt to gain unauthorized access to the service or its systems.',
        item4: 'Use automated means to access the service without our permission.',
        item5: 'Interfere with or disrupt the service or servers.',
      },
      intellectualProperty: {
        title: 'Intellectual Property',
        content1: 'The service and its original content, features, and functionality are owned by My Resume App and are protected by international copyright, trademark, and other intellectual property laws.',
        content2: 'Our templates and designs are for personal use only and may not be redistributed or sold.',
      },
      userContent: {
        title: 'User Content',
        content1: 'You retain ownership of the content you create on our platform, including your resumes and cover letters.',
        content2: 'By using our service, you grant us a license to store, process, and display your content solely for the purpose of providing the service.',
      },
      payment: {
        title: 'Payment Terms',
        item1: 'Some features of the service may require payment.',
        item2: 'Prices are subject to change with notice.',
        item3: 'Refunds are provided in accordance with our refund policy.',
      },
      termination: {
        title: 'Termination',
        content: 'We may terminate or suspend your account at any time for violations of these terms. Upon termination, your right to use the service will cease immediately.',
      },
      disclaimer: {
        title: 'Disclaimer',
        content: 'The service is provided "as is" without warranties of any kind. We do not guarantee that the service will be uninterrupted, secure, or error-free.',
      },
      liability: {
        title: 'Limitation of Liability',
        content: 'In no event shall My Resume App be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of the service.',
      },
      changes: {
        title: 'Changes to Terms',
        content: 'We reserve the right to modify these terms at any time. We will notify users of any material changes via email or through the service.',
      },
      contact: {
        title: 'Contact Us',
        content: 'If you have any questions about these Terms of Service, please contact us.',
      },
    },
  },

  // Privacy Policy
  privacy: {
    title: 'Privacy Policy',
    sections: {
      introduction: {
        title: 'Introduction',
        content: 'At My Resume App, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our service.',
      },
      collection: {
        title: 'Information We Collect',
        personal: {
          title: 'Personal Information',
          item1: 'Name and email address when you create an account',
          item2: 'Profile information you choose to provide',
          item3: 'Payment information when you make a purchase',
          item4: 'Communications when you contact us for support',
        },
        resume: {
          title: 'Resume Data',
          item1: 'Work experience, education, and skills you add to your resumes',
          item2: 'Contact information included in your resumes',
          item3: 'Any other information you choose to include',
        },
        automatic: {
          title: 'Automatically Collected Information',
          item1: 'Device information (browser type, operating system)',
          item2: 'IP address and general location',
          item3: 'Usage data (pages visited, features used)',
        },
      },
      usage: {
        title: 'How We Use Your Information',
        item1: 'To provide and maintain our service',
        item2: 'To process your transactions and send related information',
        item3: 'To send you technical notices, updates, and support messages',
        item4: 'To respond to your comments, questions, and requests',
        item5: 'To improve and personalize your experience',
      },
      sharing: {
        title: 'Data Sharing',
        intro: 'We may share your information in the following situations:',
        item1: 'With service providers who assist in operating our service',
        item2: 'To comply with legal obligations or protect our rights',
        item3: 'With your consent or at your direction',
        noSale: 'We do not sell your personal information to third parties.',
      },
      security: {
        title: 'Data Security',
        content: 'We implement appropriate technical and organizational security measures to protect your personal information, including:',
        item1: 'Encryption of data in transit and at rest',
        item2: 'Regular security assessments and audits',
        item3: 'Access controls and authentication measures',
      },
      rights: {
        title: 'Your Rights',
        intro: 'You have the following rights regarding your personal information:',
        access: {
          title: 'Access',
          content: 'You can request a copy of the personal information we hold about you.',
        },
        correction: {
          title: 'Correction',
          content: 'You can request that we correct any inaccurate information.',
        },
        deletion: {
          title: 'Deletion',
          content: 'You can request that we delete your personal information.',
        },
        export: {
          title: 'Data Export',
          content: 'You can export your data in a portable format.',
        },
      },
      cookies: {
        title: 'Cookies',
        content: 'We use cookies and similar technologies to provide and improve our service. For more information, please see our Cookie Policy.',
        learnMore: 'Learn more about our Cookie Policy',
      },
      retention: {
        title: 'Data Retention',
        content: 'We retain your personal information for as long as your account is active or as needed to provide you services. You can delete your account at any time.',
      },
      children: {
        title: 'Children\'s Privacy',
        content: 'Our service is not intended for children under 13. We do not knowingly collect personal information from children under 13.',
      },
      changes: {
        title: 'Changes to This Policy',
        content: 'We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the "Last Updated" date.',
      },
      contact: {
        title: 'Contact Us',
        content: 'If you have any questions about this Privacy Policy or our privacy practices, please contact us.',
      },
    },
  },

  // Cookie Policy
  cookies: {
    title: 'Cookie Policy',
    managePreferences: 'Manage Your Cookie Preferences',
    preferencesDescription: 'Choose which cookies you want to accept. Essential cookies are required for the website to function properly.',
    acceptAll: 'Accept All',
    rejectNonEssential: 'Essential Only',
    savePreferences: 'Save Preferences',
    preferencesSaved: 'Cookie preferences saved successfully',
    alwaysActive: 'Always Active',
    types: {
      essential: {
        title: 'Essential Cookies',
        description: 'Required for the website to function. Cannot be disabled.',
      },
      analytics: {
        title: 'Analytics Cookies',
        description: 'Help us understand how visitors interact with our website.',
      },
      marketing: {
        title: 'Marketing Cookies',
        description: 'Used to deliver relevant advertisements and track campaigns.',
      },
      preferences: {
        title: 'Preference Cookies',
        description: 'Remember your settings and preferences for a better experience.',
      },
    },
    sections: {
      whatAreCookies: {
        title: 'What Are Cookies?',
        content: 'Cookies are small text files that are stored on your device when you visit a website. They are widely used to make websites work more efficiently and provide information to website owners.',
      },
      types: {
        title: 'Types of Cookies We Use',
      },
      howWeUse: {
        title: 'How We Use Cookies',
        item1: 'To keep you signed in and remember your preferences',
        item2: 'To understand how you use our website and improve our services',
        item3: 'To analyze website traffic and performance',
        item4: 'To provide personalized content and features',
      },
      thirdParty: {
        title: 'Third-Party Cookies',
        content: 'Some cookies are placed by third-party services that appear on our pages. We have no control over these cookies.',
      },
      managing: {
        title: 'Managing Cookies',
        content: 'You can control and manage cookies in various ways. Please note that removing or blocking cookies may impact your user experience.',
      },
      contact: {
        title: 'Contact Us',
        content: 'If you have any questions about our use of cookies, please contact us.',
      },
    },
    table: {
      provider: 'Provider',
      purpose: 'Purpose',
      type: 'Type',
    },
    providers: {
      googleAnalytics: 'Website analytics and performance tracking',
      firebase: 'Authentication and database services',
      cloudflare: 'Security and performance optimization',
    },
  },

  // 404 Not Found
  notFound: {
    title: 'Page Not Found',
    description: 'Sorry, the page you\'re looking for doesn\'t exist or has been moved.',
    goHome: 'Go to Homepage',
    goBack: 'Go Back',
    helpfulLinks: 'Helpful Links',
  },

  // Landing Page
  landing: {
    hero: {
      badge: 'AI-Powered Resume Builder',
      title: 'Build Your Perfect',
      titleHighlight: 'Resume in Minutes',
      subtitle: 'Create ATS-optimized, professional resumes with our intuitive builder. Choose from beautiful templates, get real-time feedback, and land your dream job.',
      cta: 'Get Started Free',
      tryAts: 'Try ATS Checker',
      trust1: 'No credit card required',
      trust2: 'ATS-optimized templates',
      trust3: 'Export to PDF',
    },
    stats: {
      users: 'Active Users',
      resumes: 'Resumes Created',
      satisfaction: 'Satisfaction Rate',
      support: 'Support Available',
    },
    features: {
      badge: 'Features',
      title: 'Everything You Need to Land Your Dream Job',
      subtitle: 'Our comprehensive suite of tools helps you create the perfect resume and stand out from the competition.',
      templates: {
        title: 'Professional Templates',
        description: 'Choose from 9+ professionally designed templates that are ATS-friendly and recruiter-approved.',
      },
      ats: {
        title: 'ATS Score Analysis',
        description: 'Get real-time feedback on your resume with our AI-powered ATS scoring system and improvement suggestions.',
      },
      customize: {
        title: 'Full Customization',
        description: 'Customize themes, fonts, colors, and section order to match your personal style and industry.',
      },
      responsive: {
        title: 'Mobile Friendly',
        description: 'Build and edit your resume on any device. Our PWA works offline and syncs automatically.',
      },
      multilingual: {
        title: 'Multi-Language Support',
        description: 'Create resumes in multiple languages with full RTL support for Arabic and other languages.',
      },
      cloud: {
        title: 'Cloud Storage',
        description: 'Your resumes are securely stored in the cloud. Access them anywhere, anytime.',
      },
    },
    howItWorks: {
      badge: 'How It Works',
      title: 'Create Your Resume in 4 Simple Steps',
      subtitle: 'Our streamlined process makes resume building quick and easy.',
      step1: {
        title: 'Create Account',
        description: 'Sign up for free in seconds with your email or social accounts.',
      },
      step2: {
        title: 'Choose Template',
        description: 'Select from our collection of professional, ATS-optimized templates.',
      },
      step3: {
        title: 'Fill Your Info',
        description: 'Add your experience, skills, and education with our guided forms.',
      },
      step4: {
        title: 'Download & Apply',
        description: 'Export your polished resume as PDF and start applying to jobs.',
      },
    },
    templates: {
      badge: 'Templates',
      title: 'Professional Resume Templates',
      subtitle: 'Choose from our collection of beautifully designed, ATS-friendly templates.',
      modern: 'Modern',
      classic: 'Classic',
      creative: 'Creative',
      professional: 'Professional',
      minimal: 'Minimal',
      executive: 'Executive',
      tech: 'Tech',
      twoColumn: 'Two Column',
      viewAll: 'View All Templates',
    },
    testimonials: {
      badge: 'Testimonials',
      title: 'Loved by Job Seekers Worldwide',
      subtitle: 'See what our users have to say about their experience.',
      sarah: 'This resume builder helped me land my dream job at a top tech company. The ATS scoring feature was a game changer!',
      ahmed: 'The Arabic support and RTL layout are perfect. Finally, a resume builder that understands my needs.',
      maria: 'Beautiful templates and so easy to use. I created my resume in under 30 minutes!',
    },
    atsPromo: {
      badge: 'Free Tool',
      title: 'Check Your Resume ATS Score',
      description: 'Upload your existing resume and get instant feedback on how well it will perform with Applicant Tracking Systems. Get actionable tips to improve your score.',
      cta: 'Check Your Score Free',
    },
    cta: {
      title: 'Ready to Build Your Perfect Resume?',
      subtitle: 'Join thousands of professionals who have landed their dream jobs using our resume builder.',
      primary: 'Create Free Account',
      createResume: 'Create New Resume',
      note: 'No credit card required. Free forever for basic features.',
    },
  },

  // About Page
  about: {
    hero: {
      title: 'Build Professional Resumes That Get You Hired',
      subtitle: 'Create ATS-optimized resumes in minutes with our modern, easy-to-use resume builder. Free templates, real-time preview, and expert guidance.',
      getStarted: 'Get Started Free',
    },
    stats: {
      templates: 'Professional Templates',
      free: 'Free to Use',
      languages: 'Languages Supported',
      resumes: 'Unlimited Resumes',
    },
    mission: {
      title: 'Our Mission',
      content: 'We believe everyone deserves access to professional resume tools. Our mission is to help job seekers create compelling resumes that stand out to employers and pass through Applicant Tracking Systems with ease. Whether you\'re a fresh graduate or an experienced professional, our tools are designed to help you land your dream job.',
    },
    features: {
      title: 'Why Choose Our Resume Builder?',
      items: {
        multipleTemplates: {
          title: 'Multiple Templates',
          description: 'Choose from 7+ professional templates designed for different industries.',
        },
        atsOptimization: {
          title: 'ATS Optimized',
          description: 'Real-time scoring ensures your resume passes automated screening.',
        },
        livePreview: {
          title: 'Live Preview',
          description: 'See changes instantly as you type with our real-time preview.',
        },
        exportOptions: {
          title: 'Easy Export',
          description: 'Download as PDF, print directly, or export to JSON format.',
        },
        publicSharing: {
          title: 'Public Sharing',
          description: 'Share your resume with a unique link for easy access.',
        },
        coverLetter: {
          title: 'Cover Letters',
          description: 'Create matching cover letters to complement your resume.',
        },
        customization: {
          title: 'Full Customization',
          description: 'Customize fonts, colors, and themes to match your style.',
        },
        dragDrop: {
          title: 'Drag & Drop',
          description: 'Easily reorder sections with intuitive drag and drop.',
        },
        multilingual: {
          title: 'Multilingual',
          description: 'Full support for English and Arabic with RTL layout.',
        },
        offlineSupport: {
          title: 'Works Offline',
          description: 'Continue editing even without an internet connection.',
        },
      },
    },
    howItWorks: {
      title: 'How It Works',
      step1: {
        title: 'Create Your Account',
        description: 'Sign up for free in seconds. No credit card required.',
      },
      step2: {
        title: 'Choose a Template',
        description: 'Select from our collection of professional, ATS-friendly templates.',
      },
      step3: {
        title: 'Add Your Information',
        description: 'Fill in your details with helpful tips and suggestions along the way.',
      },
      step4: {
        title: 'Optimize for ATS',
        description: 'Use our ATS checker to ensure your resume passes automated screening.',
      },
      step5: {
        title: 'Download & Apply',
        description: 'Export your polished resume and start applying for your dream jobs!',
      },
    },
    techStack: {
      title: 'Built with Modern Technology',
      subtitle: 'We use cutting-edge technologies to deliver the best experience.',
    },
    team: {
      title: 'Meet the Team',
      subtitle: 'The passionate developers behind this project.',
    },
    cta: {
      title: 'Ready to Build Your Perfect Resume?',
      subtitle: 'Join thousands of job seekers who have successfully landed their dream jobs with our resume builder.',
      createResume: 'Create Your Resume',
      checkATS: 'Check Your Resume',
    },
  },

  // ATS Checker
  atsChecker: {
    badge: 'Free ATS Scanner',
    title: 'ATS Resume Checker',
    subtitle: 'Upload your resume and get instant feedback on how well it will perform with Applicant Tracking Systems used by employers.',
    uploadTitle: 'Upload Your Resume',
    dropHere: 'Drop your resume here',
    orBrowse: 'or click to browse files',
    supportedFormats: 'Supported formats: PDF, DOC, DOCX (Max 10MB)',
    invalidFileType: 'Please upload a PDF or Word document',
    fileTooLarge: 'File size must be less than 10MB',
    noFileSelected: 'Please select a file first',
    jobDescriptionTitle: 'Job Description',
    jobDescriptionHint: 'Paste the job description to get keyword matching analysis and tailored suggestions.',
    jobDescriptionPlaceholder: 'Paste the job description here to compare your resume against specific requirements...',
    analyzeButton: 'Analyze Resume',
    analyzing: 'Analyzing...',
    analysisComplete: 'Analysis complete!',
    yourScore: 'Your ATS Score',
    scoreDescription: 'This score indicates how well your resume is optimized for Applicant Tracking Systems.',
    scoreExcellent: 'Excellent',
    scoreGood: 'Good',
    scoreNeedsWork: 'Needs Work',
    scorePoor: 'Poor',
    categories: {
      keywords: 'Keywords',
      formatting: 'Formatting',
      completeness: 'Completeness',
      structure: 'Structure',
      readability: 'Readability',
    },
    improvementSuggestions: 'Improvement Suggestions',
    severity: {
      high: 'High Priority',
      medium: 'Medium',
      low: 'Low',
    },
    suggestions: {
      addKeywords: 'Add more relevant keywords from the job description',
      addKeywordsFix: 'Review the job posting and include matching skills, technologies, and qualifications in your resume. Use the exact terms mentioned in the job description.',
      useStandardFonts: 'Use standard, ATS-friendly fonts',
      useStandardFontsFix: 'Stick to standard fonts like Arial, Calibri, or Times New Roman. Avoid decorative fonts that ATS systems may not recognize.',
      addSections: 'Include all standard resume sections',
      addSectionsFix: 'Ensure your resume has clearly labeled sections: Summary, Experience, Education, and Skills. Use standard section headings.',
      quantifyAchievements: 'Add quantifiable achievements',
      quantifyAchievementsFix: 'Include numbers and metrics in your experience descriptions. For example: "Increased sales by 25%" or "Managed a team of 10 people".',
      simplifyLanguage: 'Simplify complex language',
      simplifyLanguageFix: 'Use clear, concise language. Avoid jargon and overly complex sentences that may confuse ATS parsers.',
    },
    keywordsAnalysis: 'Keywords Analysis',
    foundKeywords: 'Found Keywords',
    missingKeywords: 'Missing Keywords',
    missingKeywordsHint: 'Consider adding these keywords if they match your experience.',
    noKeywordsFound: 'No industry keywords detected',
    analyzeAnother: 'Analyze Another Resume',
    buildResume: 'Build ATS-Friendly Resume',
    tipsTitle: 'ATS Optimization Tips',
    tips: {
      keywords: {
        title: 'Use Keywords',
        description: 'Match keywords from the job description. ATS systems scan for specific terms and skills.',
      },
      format: {
        title: 'Simple Formatting',
        description: 'Avoid tables, graphics, and complex layouts. Use standard section headings.',
      },
      metrics: {
        title: 'Include Metrics',
        description: 'Quantify your achievements with numbers and percentages to stand out.',
      },
    },
    // Detailed Analysis
    detailedAnalysis: 'Detailed Analysis',
    stats: {
      wordCount: 'Word Count',
      bulletPoints: 'Bullet Points',
      actionVerbs: 'Action Verbs',
      metrics: 'Quantifiable Metrics',
      optimal: 'Optimal range',
      adjust: 'Consider adjusting',
      good: 'Good usage',
      addMore: 'Add more',
      coverage: 'of common verbs',
      excellent: 'Excellent',
      addMetrics: 'Add more numbers',
    },
    contactInfoCheck: 'Contact Information',
    contact: {
      email: 'Email',
      phone: 'Phone',
      location: 'Location',
    },
    sectionsDetected: 'Sections Detected',
    missing: 'missing',
    actionVerbsFound: 'Action Verbs Used',
  },
} as const
