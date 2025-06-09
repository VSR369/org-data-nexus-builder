
import { DomainGroup } from '../types';

export const itDomainGroups: DomainGroup[] = [
  {
    id: 'it-1',
    name: 'Software Development & Engineering',
    industrySegment: 'Information Technology & Software Services',
    categories: [
      {
        id: 'it-101',
        name: 'Application Development',
        subCategories: [
          { id: 'it-101-1', name: 'Full-Stack Development', description: 'End-to-end web application development using modern frameworks.' },
          { id: 'it-101-2', name: 'Mobile App Development', description: 'Native and cross-platform mobile application development.' },
          { id: 'it-101-3', name: 'API Development & Integration', description: 'RESTful and GraphQL API design and implementation.' },
          { id: 'it-101-4', name: 'Microservices Architecture', description: 'Designing and implementing scalable microservices systems.' },
        ],
      },
      {
        id: 'it-102',
        name: 'Software Quality & Testing',
        subCategories: [
          { id: 'it-102-1', name: 'Automated Testing Frameworks', description: 'Implementing comprehensive automated testing strategies.' },
          { id: 'it-102-2', name: 'Performance Testing & Optimization', description: 'Load testing and application performance tuning.' },
          { id: 'it-102-3', name: 'Security Testing & Code Review', description: 'Security vulnerability assessment and secure coding practices.' },
        ],
      },
    ],
  },
  {
    id: 'it-2',
    name: 'Cloud & Infrastructure',
    industrySegment: 'Information Technology & Software Services',
    categories: [
      {
        id: 'it-201',
        name: 'Cloud Architecture & Migration',
        subCategories: [
          { id: 'it-201-1', name: 'AWS/Azure/GCP Implementation', description: 'Multi-cloud platform expertise and implementation.' },
          { id: 'it-201-2', name: 'Cloud-Native Development', description: 'Building applications specifically for cloud environments.' },
          { id: 'it-201-3', name: 'Legacy System Migration', description: 'Modernizing and migrating legacy systems to cloud platforms.' },
        ],
      },
      {
        id: 'it-202',
        name: 'DevOps & Automation',
        subCategories: [
          { id: 'it-202-1', name: 'CI/CD Pipeline Implementation', description: 'Continuous integration and deployment automation.' },
          { id: 'it-202-2', name: 'Infrastructure as Code (IaC)', description: 'Automated infrastructure provisioning and management.' },
          { id: 'it-202-3', name: 'Container Orchestration', description: 'Docker and Kubernetes implementation and management.' },
        ],
      },
    ],
  },
  {
    id: 'it-3',
    name: 'Data & Analytics',
    industrySegment: 'Information Technology & Software Services',
    categories: [
      {
        id: 'it-301',
        name: 'Data Engineering',
        subCategories: [
          { id: 'it-301-1', name: 'Big Data Processing', description: 'Hadoop, Spark, and distributed data processing systems.' },
          { id: 'it-301-2', name: 'Data Pipeline Architecture', description: 'ETL/ELT pipeline design and implementation.' },
          { id: 'it-301-3', name: 'Real-time Data Streaming', description: 'Kafka, Apache Storm, and real-time data processing.' },
        ],
      },
      {
        id: 'it-302',
        name: 'Artificial Intelligence & Machine Learning',
        subCategories: [
          { id: 'it-302-1', name: 'Machine Learning Model Development', description: 'Building and deploying ML models for business applications.' },
          { id: 'it-302-2', name: 'Natural Language Processing', description: 'NLP solutions for text analysis and chatbot development.' },
          { id: 'it-302-3', name: 'Computer Vision', description: 'Image recognition and computer vision applications.' },
        ],
      },
    ],
  },
  {
    id: 'it-4',
    name: 'Cybersecurity & Governance',
    industrySegment: 'Information Technology & Software Services',
    categories: [
      {
        id: 'it-401',
        name: 'Information Security',
        subCategories: [
          { id: 'it-401-1', name: 'Application Security', description: 'Secure coding practices and application vulnerability management.' },
          { id: 'it-401-2', name: 'Network Security', description: 'Firewall management, intrusion detection, and network protection.' },
          { id: 'it-401-3', name: 'Identity & Access Management', description: 'IAM solutions and multi-factor authentication systems.' },
        ],
      },
    ],
  },
];
