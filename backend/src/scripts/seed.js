const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load env vars
dotenv.config({ path: path.join(__dirname, '../../.env') });

const Vendor = require('../models/Vendor');
const RFP = require('../models/RFP');
const Proposal = require('../models/Proposal');

const vendors = [
  {
    name: 'John Smith',
    email: 'john@techsolutions.com',
    company: 'Tech Solutions Inc.',
    phone: '+1 (555) 123-4567',
    category: 'Technology',
    status: 'active',
    rating: 4.5,
    address: {
      city: 'San Francisco',
      state: 'CA',
      country: 'USA'
    },
    tags: ['cloud', 'devops', 'security']
  },
  {
    name: 'Sarah Johnson',
    email: 'sarah@marketpro.com',
    company: 'MarketPro Agency',
    phone: '+1 (555) 234-5678',
    category: 'Marketing',
    status: 'active',
    rating: 4.8,
    address: {
      city: 'New York',
      state: 'NY',
      country: 'USA'
    },
    tags: ['digital', 'branding', 'seo']
  },
  {
    name: 'Michael Chen',
    email: 'michael@consulting-group.com',
    company: 'Strategic Consulting Group',
    phone: '+1 (555) 345-6789',
    category: 'Consulting',
    status: 'active',
    rating: 4.2,
    address: {
      city: 'Chicago',
      state: 'IL',
      country: 'USA'
    },
    tags: ['strategy', 'transformation', 'analytics']
  },
  {
    name: 'Emily Davis',
    email: 'emily@cloudservices.io',
    company: 'Cloud Services Ltd.',
    phone: '+1 (555) 456-7890',
    category: 'Technology',
    status: 'active',
    rating: 4.6,
    address: {
      city: 'Seattle',
      state: 'WA',
      country: 'USA'
    },
    tags: ['aws', 'azure', 'infrastructure']
  },
  {
    name: 'Robert Wilson',
    email: 'robert@manufacorp.com',
    company: 'ManuCorp Industries',
    phone: '+1 (555) 567-8901',
    category: 'Manufacturing',
    status: 'active',
    rating: 4.0,
    address: {
      city: 'Detroit',
      state: 'MI',
      country: 'USA'
    },
    tags: ['production', 'quality', 'logistics']
  }
];

const rfps = [
  {
    title: 'Enterprise Cloud Migration Project',
    description: 'We are seeking proposals for migrating our on-premise infrastructure to cloud services. The project includes assessment, planning, migration execution, and post-migration support.',
    category: 'Technology',
    budget: { min: 150000, max: 300000, currency: 'USD' },
    deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
    status: 'published',
    requirements: [
      { title: 'Cloud Architecture Design', description: 'Design scalable cloud architecture', priority: 'must-have', weight: 3 },
      { title: 'Data Migration', description: 'Migrate 50TB+ of data with zero downtime', priority: 'must-have', weight: 3 },
      { title: 'Security Compliance', description: 'Ensure SOC 2 and HIPAA compliance', priority: 'must-have', weight: 2 },
      { title: 'Training', description: 'Provide team training on cloud operations', priority: 'nice-to-have', weight: 1 }
    ],
    evaluationCriteria: [
      { name: 'Technical Expertise', weight: 30, description: 'Cloud migration experience' },
      { name: 'Cost', weight: 25, description: 'Total project cost' },
      { name: 'Timeline', weight: 20, description: 'Proposed completion timeline' },
      { name: 'Support', weight: 15, description: 'Post-migration support plan' },
      { name: 'References', weight: 10, description: 'Past client references' }
    ]
  },
  {
    title: 'Digital Marketing Campaign 2024',
    description: 'Looking for a marketing agency to develop and execute a comprehensive digital marketing campaign for our new product launch.',
    category: 'Marketing',
    budget: { min: 50000, max: 100000, currency: 'USD' },
    deadline: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000), // 21 days from now
    status: 'published',
    requirements: [
      { title: 'Campaign Strategy', description: 'Develop multi-channel campaign strategy', priority: 'must-have', weight: 3 },
      { title: 'Content Creation', description: 'Create engaging content for all platforms', priority: 'must-have', weight: 2 },
      { title: 'Analytics & Reporting', description: 'Weekly performance reports', priority: 'must-have', weight: 2 },
      { title: 'Social Media Management', description: 'Manage all social media accounts', priority: 'nice-to-have', weight: 1 }
    ],
    evaluationCriteria: [
      { name: 'Creative Quality', weight: 35, description: 'Portfolio and creative approach' },
      { name: 'Cost Efficiency', weight: 25, description: 'Budget utilization' },
      { name: 'Track Record', weight: 25, description: 'Past campaign results' },
      { name: 'Team Experience', weight: 15, description: 'Team qualifications' }
    ]
  },
  {
    title: 'Business Process Optimization Consulting',
    description: 'Seeking consulting services to analyze and optimize our business processes for improved efficiency and cost reduction.',
    category: 'Consulting',
    budget: { min: 75000, max: 150000, currency: 'USD' },
    deadline: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000), // 45 days from now
    status: 'draft',
    requirements: [
      { title: 'Process Assessment', description: 'Comprehensive analysis of current processes', priority: 'must-have', weight: 3 },
      { title: 'Recommendations Report', description: 'Detailed improvement recommendations', priority: 'must-have', weight: 3 },
      { title: 'Implementation Support', description: 'Support during implementation phase', priority: 'nice-to-have', weight: 2 },
      { title: 'Change Management', description: 'Change management consulting', priority: 'optional', weight: 1 }
    ],
    evaluationCriteria: [
      { name: 'Methodology', weight: 30, description: 'Consulting methodology' },
      { name: 'Industry Experience', weight: 30, description: 'Relevant industry experience' },
      { name: 'Cost', weight: 20, description: 'Project cost' },
      { name: 'References', weight: 20, description: 'Client testimonials' }
    ]
  }
];

async function seedDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await Vendor.deleteMany({});
    await RFP.deleteMany({});
    await Proposal.deleteMany({});
    console.log('🗑️  Cleared existing data');

    // Insert vendors
    const createdVendors = await Vendor.insertMany(vendors);
    console.log(`✅ Created ${createdVendors.length} vendors`);

    // Insert RFPs
    const createdRFPs = await RFP.insertMany(rfps);
    console.log(`✅ Created ${createdRFPs.length} RFPs`);

    // Create sample proposals
    const proposals = [
      {
        rfp: createdRFPs[0]._id,
        vendor: createdVendors[0]._id,
        title: 'Cloud Migration Excellence Proposal',
        executive_summary: 'Tech Solutions Inc. proposes a comprehensive cloud migration strategy leveraging our 10+ years of experience in enterprise cloud transitions.',
        technical_approach: 'Our approach involves a phased migration using AWS services with automated testing and rollback capabilities.',
        pricing: {
          totalAmount: 225000,
          currency: 'USD',
          breakdown: [
            { item: 'Assessment', quantity: 1, unitPrice: 25000, total: 25000 },
            { item: 'Migration Services', quantity: 1, unitPrice: 150000, total: 150000 },
            { item: 'Training', quantity: 1, unitPrice: 25000, total: 25000 },
            { item: 'Support (6 months)', quantity: 1, unitPrice: 25000, total: 25000 }
          ],
          paymentTerms: '30% upfront, 40% at milestone, 30% on completion'
        },
        timeline: {
          startDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
          endDate: new Date(Date.now() + 120 * 24 * 60 * 60 * 1000),
          milestones: [
            { name: 'Assessment Complete', date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), description: 'Complete infrastructure assessment' },
            { name: 'Migration Phase 1', date: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), description: 'Non-critical systems migrated' },
            { name: 'Migration Phase 2', date: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), description: 'Critical systems migrated' },
            { name: 'Project Complete', date: new Date(Date.now() + 120 * 24 * 60 * 60 * 1000), description: 'Final handover and documentation' }
          ]
        },
        team: [
          { name: 'David Park', role: 'Project Lead', experience: '15 years cloud architecture' },
          { name: 'Lisa Chen', role: 'Cloud Engineer', experience: '8 years AWS/Azure' },
          { name: 'Tom Brown', role: 'Security Specialist', experience: '10 years security' }
        ],
        status: 'submitted',
        scores: { technical: 85, financial: 78, experience: 90, overall: 84 }
      },
      {
        rfp: createdRFPs[0]._id,
        vendor: createdVendors[3]._id,
        title: 'Cloud Services Migration Solution',
        executive_summary: 'Cloud Services Ltd. offers a streamlined migration approach with our proprietary migration toolkit and 24/7 support.',
        technical_approach: 'Utilizing our CloudShift platform for automated migration with real-time monitoring and rollback capabilities.',
        pricing: {
          totalAmount: 195000,
          currency: 'USD',
          breakdown: [
            { item: 'Planning & Assessment', quantity: 1, unitPrice: 20000, total: 20000 },
            { item: 'Migration Execution', quantity: 1, unitPrice: 130000, total: 130000 },
            { item: 'Testing & Validation', quantity: 1, unitPrice: 25000, total: 25000 },
            { item: 'Training & Support', quantity: 1, unitPrice: 20000, total: 20000 }
          ],
          paymentTerms: '25% upfront, 50% at milestone, 25% on completion'
        },
        timeline: {
          startDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          endDate: new Date(Date.now() + 100 * 24 * 60 * 60 * 1000)
        },
        team: [
          { name: 'Emily Davis', role: 'Account Director', experience: '12 years consulting' },
          { name: 'James Wilson', role: 'Technical Lead', experience: '10 years cloud' }
        ],
        status: 'submitted',
        scores: { technical: 82, financial: 85, experience: 80, overall: 82 }
      }
    ];

    const createdProposals = await Proposal.insertMany(proposals);
    console.log(`✅ Created ${createdProposals.length} proposals`);

    console.log('\n🎉 Database seeded successfully!\n');
    
    // Print summary
    console.log('Summary:');
    console.log(`- Vendors: ${createdVendors.length}`);
    console.log(`- RFPs: ${createdRFPs.length}`);
    console.log(`- Proposals: ${createdProposals.length}`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();
