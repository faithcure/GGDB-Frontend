// src/data/departments.js

export const DEPARTMENTS = {
    "Programming": [
        "Lead Programmer", "Senior Programmer", "Gameplay Programmer", "Engine Programmer",
        "AI Programmer", "Graphics Programmer", "Network Programmer", "Tools Programmer",
        "UI Programmer", "Audio Programmer", "Junior Programmer", "Backend Programmer",
        "Frontend Programmer", "Mobile Programmer", "Console Programmer", "VR Programmer"
    ],
    "Art & Design": [
        "Art Director", "Lead Artist", "Senior Artist", "Concept Artist", "3D Artist",
        "2D Artist", "Character Artist", "Environment Artist", "Texture Artist",
        "Lighting Artist", "VFX Artist", "Technical Artist", "UI Artist", "Icon Artist",
        "Material Artist", "Hard Surface Artist", "Organic Artist", "Prop Artist"
    ],
    "Game Design": [
        "Creative Director", "Game Designer", "Lead Designer", "Level Designer",
        "Quest Designer", "System Designer", "Combat Designer", "Economy Designer",
        "Narrative Designer", "UX Designer", "Progression Designer", "Monetization Designer",
        "Social Features Designer", "Tutorial Designer", "Accessibility Designer"
    ],
    "Animation": [
        "Animation Director", "Lead Animator", "Senior Animator", "Character Animator",
        "Cinematic Animator", "Technical Animator", "Motion Capture Artist", "Rigging Artist",
        "Facial Animator", "Gameplay Animator", "UI Animator", "VFX Animator"
    ],
    "Audio": [
        "Audio Director", "Sound Designer", "Music Composer", "Audio Programmer",
        "Voice Actor", "Foley Artist", "Audio Engineer", "Dialogue Editor",
        "Music Producer", "Adaptive Music Designer", "3D Audio Specialist", "Mastering Engineer"
    ],
    "Production": [
        "Executive Producer", "Producer", "Associate Producer", "Line Producer",
        "Project Manager", "Scrum Master", "Product Manager", "Development Director",
        "Studio Manager", "Release Manager", "Live Ops Manager", "Program Manager"
    ],
    "Quality Assurance": [
        "QA Director", "QA Lead", "Senior QA Tester", "QA Tester", "Compliance Tester",
        "Localization Tester", "Performance Tester", "Automation Tester", "Functionality Tester",
        "Compatibility Tester", "Security Tester", "Accessibility Tester"
    ],
    "Writing": [
        "Lead Writer", "Senior Writer", "Narrative Designer", "Screenplay Writer",
        "Dialogue Writer", "Localization Writer", "Script Editor", "Lore Writer",
        "Character Writer", "Quest Writer", "Cinematics Writer", "UI Text Writer"
    ],
    "Marketing & Community": [
        "Marketing Director", "Marketing Manager", "Community Manager", "Social Media Manager",
        "PR Manager", "Brand Manager", "Content Creator", "Influencer Relations",
        "Event Manager", "Partnership Manager", "User Acquisition Manager", "Growth Hacker"
    ],
    "Business & Operations": [
        "Studio Head", "Operations Manager", "Business Developer", "Publisher Representative",
        "Legal Advisor", "HR Manager", "Finance Manager", "IT Support", "Office Manager",
        "Talent Acquisition", "Business Analyst", "Strategic Planner"
    ],
    "Localization": [
        "Localization Manager", "Translator", "Voice Director", "Cultural Consultant",
        "Localization QA", "Subtitle Editor", "Localization Engineer", "Language Lead",
        "Cultural Advisor", "Regional Manager"
    ],
    "Other": [
        "Consultant", "Advisor", "Intern", "Contractor", "Freelancer", "External Vendor",
        "Research Specialist", "Data Analyst", "UX Researcher", "Playtester",
        "Focus Group Coordinator", "Custom Role"
    ]
};

// Mock users for search (you can expand this or connect to real API)
export const MOCK_USERS = [
    {
        id: 1,
        name: "John Smith",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face",
        roles: ["Programmer", "Designer"],
        department: "Programming"
    },
    {
        id: 2,
        name: "Sarah Johnson",
        avatar: "https://images.unsplash.com/photo-1494790108755-2616b332c5cd?w=40&h=40&fit=crop&crop=face",
        roles: ["Artist", "Animator"],
        department: "Art & Design"
    },
    {
        id: 3,
        name: "Mike Wilson",
        avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=40&h=40&fit=crop&crop=face",
        roles: ["Sound Designer"],
        department: "Audio"
    },
    {
        id: 4,
        name: "Emily Davis",
        avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face",
        roles: ["Writer", "Director"],
        department: "Writing"
    },
    {
        id: 5,
        name: "Alex Chen",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face",
        roles: ["Lead Programmer", "Technical Director"],
        department: "Programming"
    },
    {
        id: 6,
        name: "Maya Rodriguez",
        avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=40&h=40&fit=crop&crop=face",
        roles: ["Game Designer", "Producer"],
        department: "Game Design"
    }
];

// Helper function to get all roles as flat array (for backwards compatibility)
export const getAllRoles = () => {
    return Object.values(DEPARTMENTS).flat();
};

// Helper function to get department by role
export const getDepartmentByRole = (role) => {
    for (const [department, roles] of Object.entries(DEPARTMENTS)) {
        if (roles.includes(role)) {
            return department;
        }
    }
    return "Other";
};

// Helper function to search roles across departments
export const searchRoles = (searchTerm) => {
    const allRoles = getAllRoles();
    return allRoles.filter(role =>
        role.toLowerCase().includes(searchTerm.toLowerCase())
    );
};