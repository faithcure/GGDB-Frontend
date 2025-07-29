import React, { useState } from 'react';
import { FaBriefcase, FaMapMarkerAlt, FaClock, FaDollarSign, FaUsers, FaCode, FaPalette, FaChartLine, FaFilter } from 'react-icons/fa';

const JobsPage = () => {
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [selectedLocation, setSelectedLocation] = useState('all');

  const jobOpenings = [
    {
      id: 1,
      title: 'Senior Full Stack Developer',
      department: 'Engineering',
      location: 'San Francisco, CA',
      type: 'Full-time',
      salary: '$120k - $160k',
      posted: '2 days ago',
      description: 'Join our engineering team to build the next generation of gaming discovery platform. Work with React, Node.js, and modern cloud technologies.',
      requirements: ['5+ years of full-stack development', 'Experience with React and Node.js', 'Gaming industry experience preferred'],
      remote: true
    },
    {
      id: 2,
      title: 'Product Designer',
      department: 'Design',
      location: 'New York, NY',
      type: 'Full-time',
      salary: '$90k - $120k',
      posted: '1 week ago',
      description: 'Design intuitive and engaging user experiences for millions of gamers. Work closely with product and engineering teams.',
      requirements: ['3+ years of product design experience', 'Proficiency in Figma and design systems', 'Portfolio showcasing UX/UI work'],
      remote: true
    },
    {
      id: 3,
      title: 'Data Scientist',
      department: 'Data',
      location: 'Austin, TX',
      type: 'Full-time',
      salary: '$100k - $140k',
      posted: '3 days ago',
      description: 'Analyze user behavior and gaming trends to improve our recommendation algorithms and platform features.',
      requirements: ['Masters in Data Science or related field', 'Python/R programming skills', 'Machine learning experience'],
      remote: false
    },
    {
      id: 4,
      title: 'Community Manager',
      department: 'Marketing',
      location: 'Remote',
      type: 'Full-time',
      salary: '$60k - $80k',
      posted: '5 days ago',
      description: 'Build and engage our gaming community across social platforms and manage relationships with content creators.',
      requirements: ['2+ years community management experience', 'Gaming industry knowledge', 'Social media expertise'],
      remote: true
    },
    {
      id: 5,
      title: 'DevOps Engineer',
      department: 'Engineering',
      location: 'Seattle, WA',
      type: 'Full-time',
      salary: '$110k - $150k',
      posted: '1 week ago',
      description: 'Maintain and scale our infrastructure to support millions of users. Work with AWS, Kubernetes, and CI/CD pipelines.',
      requirements: ['AWS certification preferred', 'Docker and Kubernetes experience', '3+ years DevOps experience'],
      remote: true
    },
    {
      id: 6,
      title: 'Content Marketing Specialist',
      department: 'Marketing',
      location: 'Los Angeles, CA',
      type: 'Contract',
      salary: '$40 - $60/hour',
      posted: '4 days ago',
      description: 'Create engaging content about gaming trends, reviews, and industry news to grow our audience.',
      requirements: ['Strong writing and editing skills', 'Gaming industry knowledge', 'SEO experience'],
      remote: true
    }
  ];

  const departments = [
    { id: 'all', name: 'All Departments', count: jobOpenings.length },
    { id: 'Engineering', name: 'Engineering', count: jobOpenings.filter(job => job.department === 'Engineering').length },
    { id: 'Design', name: 'Design', count: jobOpenings.filter(job => job.department === 'Design').length },
    { id: 'Marketing', name: 'Marketing', count: jobOpenings.filter(job => job.department === 'Marketing').length },
    { id: 'Data', name: 'Data', count: jobOpenings.filter(job => job.department === 'Data').length }
  ];

  const locations = [
    { id: 'all', name: 'All Locations' },
    { id: 'Remote', name: 'Remote' },
    { id: 'San Francisco, CA', name: 'San Francisco, CA' },
    { id: 'New York, NY', name: 'New York, NY' },
    { id: 'Austin, TX', name: 'Austin, TX' },
    { id: 'Seattle, WA', name: 'Seattle, WA' },
    { id: 'Los Angeles, CA', name: 'Los Angeles, CA' }
  ];

  const benefits = [
    {
      icon: <FaDollarSign className="text-green-500" />,
      title: 'Competitive Salary',
      description: 'Market-leading compensation packages with equity options'
    },
    {
      icon: <FaUsers className="text-blue-500" />,
      title: 'Team Events',
      description: 'Regular team building activities and gaming tournaments'
    },
    {
      icon: <FaClock className="text-purple-500" />,
      title: 'Flexible Hours',
      description: 'Work-life balance with flexible scheduling and remote options'
    },
    {
      icon: <FaCode className="text-yellow-500" />,
      title: 'Learning Budget',
      description: '$2000 annual budget for conferences, courses, and books'
    }
  ];

  const company_values = [
    {
      title: 'Gamers First',
      description: 'Everything we do is focused on creating the best experience for the gaming community.'
    },
    {
      title: 'Innovation',
      description: 'We embrace new technologies and creative solutions to solve complex problems.'
    },
    {
      title: 'Transparency',
      description: 'Open communication and honest feedback help us grow together as a team.'
    },
    {
      title: 'Diversity',
      description: 'We believe diverse teams build better products and create inclusive experiences.'
    }
  ];

  const getDepartmentIcon = (department) => {
    switch(department) {
      case 'Engineering': return <FaCode className="text-blue-500" />;
      case 'Design': return <FaPalette className="text-purple-500" />;
      case 'Marketing': return <FaChartLine className="text-green-500" />;
      case 'Data': return <FaChartLine className="text-orange-500" />;
      default: return <FaBriefcase className="text-gray-500" />;
    }
  };

  const filteredJobs = jobOpenings.filter(job => {
    const departmentMatch = selectedDepartment === 'all' || job.department === selectedDepartment;
    const locationMatch = selectedLocation === 'all' || job.location === selectedLocation;
    return departmentMatch && locationMatch;
  });

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-900 to-blue-900 py-16">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <div className="flex justify-center mb-6">
            <FaBriefcase className="text-6xl text-green-400" />
          </div>
          <h1 className="text-5xl font-bold mb-6">Join Team GGDB</h1>
          <p className="text-xl text-gray-200 mb-8 max-w-3xl mx-auto">
            Help us build the future of gaming discovery. Work with passionate gamers and cutting-edge technology.
          </p>
          <div className="flex justify-center gap-4">
            <button className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition-colors">
              View Open Positions
            </button>
            <button className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 px-6 rounded-lg transition-colors">
              Life at GGDB
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Filters */}
        <section className="mb-12">
          <div className="flex items-center mb-6">
            <FaFilter className="text-gray-400 mr-3" />
            <h2 className="text-2xl font-bold">Filter Jobs</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-3">Department</label>
              <div className="flex flex-wrap gap-2">
                {departments.map(dept => (
                  <button
                    key={dept.id}
                    onClick={() => setSelectedDepartment(dept.id)}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      selectedDepartment === dept.id
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                    }`}
                  >
                    {dept.name} ({dept.count})
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-3">Location</label>
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                {locations.map(location => (
                  <option key={location.id} value={location.id}>
                    {location.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </section>

        {/* Job Listings */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8">
            Open Positions ({filteredJobs.length})
          </h2>
          <div className="space-y-6">
            {filteredJobs.map(job => (
              <div key={job.id} className="bg-gray-800 rounded-lg p-6 hover:bg-gray-700 transition-colors">
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center mb-3">
                      {getDepartmentIcon(job.department)}
                      <h3 className="text-xl font-semibold ml-3">{job.title}</h3>
                      {job.remote && (
                        <span className="ml-3 bg-blue-600 text-white px-2 py-1 rounded-full text-xs font-semibold">
                          Remote OK
                        </span>
                      )}
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400 mb-4">
                      <div className="flex items-center">
                        <FaMapMarkerAlt className="mr-1" />
                        {job.location}
                      </div>
                      <div className="flex items-center">
                        <FaClock className="mr-1" />
                        {job.type}
                      </div>
                      <div className="flex items-center">
                        <FaDollarSign className="mr-1" />
                        {job.salary}
                      </div>
                      <div>Posted {job.posted}</div>
                    </div>
                    
                    <p className="text-gray-300 mb-4">{job.description}</p>
                    
                    <div>
                      <h4 className="font-semibold mb-2">Key Requirements:</h4>
                      <ul className="text-sm text-gray-400 space-y-1">
                        {job.requirements.map((req, index) => (
                          <li key={index}>• {req}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  
                  <div className="lg:ml-6">
                    <button className="w-full lg:w-auto bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-lg transition-colors">
                      Apply Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {filteredJobs.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-400 text-lg">No jobs match your current filters.</p>
              <button 
                onClick={() => {
                  setSelectedDepartment('all');
                  setSelectedLocation('all');
                }}
                className="mt-4 text-green-400 hover:text-green-300 font-semibold"
              >
                Clear all filters
              </button>
            </div>
          )}
        </section>

        {/* Benefits */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">Why Work at GGDB?</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => (
              <div key={index} className="bg-gray-800 rounded-lg p-6 text-center">
                <div className="flex justify-center mb-4">
                  {benefit.icon}
                </div>
                <h3 className="text-lg font-semibold mb-3">{benefit.title}</h3>
                <p className="text-gray-300 text-sm">{benefit.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Company Values */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">Our Values</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {company_values.map((value, index) => (
              <div key={index} className="bg-gray-800 rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-3 text-green-400">{value.title}</h3>
                <p className="text-gray-300 leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Company Stats */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">GGDB by the Numbers</h2>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="bg-gray-800 rounded-lg p-6 text-center">
              <div className="text-4xl font-bold text-green-500 mb-2">50+</div>
              <div className="text-gray-300">Team Members</div>
            </div>
            <div className="bg-gray-800 rounded-lg p-6 text-center">
              <div className="text-4xl font-bold text-blue-500 mb-2">2.5M+</div>
              <div className="text-gray-300">Monthly Users</div>
            </div>
            <div className="bg-gray-800 rounded-lg p-6 text-center">
              <div className="text-4xl font-bold text-purple-500 mb-2">5</div>
              <div className="text-gray-300">Years Growing</div>
            </div>
            <div className="bg-gray-800 rounded-lg p-6 text-center">
              <div className="text-4xl font-bold text-yellow-500 mb-2">15+</div>
              <div className="text-gray-300">Countries</div>
            </div>
          </div>
        </section>

        {/* Application Process */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">Application Process</h2>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="text-lg font-semibold mb-2">Apply</h3>
              <p className="text-gray-300 text-sm">Submit your application and portfolio</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="text-lg font-semibold mb-2">Screen</h3>
              <p className="text-gray-300 text-sm">Initial phone/video screening call</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="text-lg font-semibold mb-2">Interview</h3>
              <p className="text-gray-300 text-sm">Technical and cultural interview rounds</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-yellow-600 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                4
              </div>
              <h3 className="text-lg font-semibold mb-2">Offer</h3>
              <p className="text-gray-300 text-sm">Reference check and job offer</p>
            </div>
          </div>
        </section>

        {/* Contact */}
        <section className="bg-gray-800 rounded-lg p-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Don't See the Right Role?</h2>
          <p className="text-xl text-gray-300 mb-6 max-w-2xl mx-auto">
            We're always looking for talented people. Send us your resume and we'll keep you in mind for future opportunities.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-lg transition-colors">
              Send General Application
            </button>
            <button className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 px-8 rounded-lg transition-colors">
              Join Our Talent Network
            </button>
          </div>
          <div className="mt-6 text-sm text-gray-400">
            <p>📧 careers@ggdb.com | Equal Opportunity Employer</p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default JobsPage;