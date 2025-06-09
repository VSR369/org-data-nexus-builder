
import { DomainGroup } from '../types';

export const retailDomainGroups: DomainGroup[] = [
  {
    id: 'retail-1',
    name: 'E-commerce & Digital Retail',
    industrySegment: 'Retail & E-Commerce',
    categories: [
      {
        id: 'retail-101',
        name: 'Online Store Development',
        subCategories: [
          { id: 'retail-101-1', name: 'E-commerce Platform Architecture', description: 'Building scalable online retail platforms and marketplaces.' },
          { id: 'retail-101-2', name: 'Mobile Commerce Optimization', description: 'Creating mobile-first shopping experiences and apps.' },
          { id: 'retail-101-3', name: 'Payment Gateway Integration', description: 'Implementing secure and diverse payment processing systems.' },
          { id: 'retail-101-4', name: 'Shopping Cart & Checkout Optimization', description: 'Reducing cart abandonment and improving conversion rates.' },
        ],
      },
      {
        id: 'retail-102',
        name: 'Customer Experience & Personalization',
        subCategories: [
          { id: 'retail-102-1', name: 'Recommendation Engines', description: 'AI-powered product recommendation systems.' },
          { id: 'retail-102-2', name: 'Customer Journey Mapping', description: 'Optimizing the end-to-end customer shopping journey.' },
          { id: 'retail-102-3', name: 'Loyalty Program Design', description: 'Creating engaging customer retention and rewards programs.' },
          { id: 'retail-102-4', name: 'A/B Testing & Conversion Optimization', description: 'Data-driven optimization of user experience elements.' },
        ],
      },
    ],
  },
  {
    id: 'retail-2',
    name: 'Supply Chain & Operations',
    industrySegment: 'Retail & E-Commerce',
    categories: [
      {
        id: 'retail-201',
        name: 'Inventory & Warehouse Management',
        subCategories: [
          { id: 'retail-201-1', name: 'Inventory Optimization', description: 'AI-driven inventory management and demand forecasting.' },
          { id: 'retail-201-2', name: 'Warehouse Automation', description: 'Implementing robotic and automated warehouse solutions.' },
          { id: 'retail-201-3', name: 'Multi-channel Inventory Sync', description: 'Real-time inventory synchronization across all channels.' },
        ],
      },
      {
        id: 'retail-202',
        name: 'Logistics & Fulfillment',
        subCategories: [
          { id: 'retail-202-1', name: 'Last-Mile Delivery Optimization', description: 'Efficient final delivery solutions and route optimization.' },
          { id: 'retail-202-2', name: 'Order Management Systems', description: 'Streamlined order processing and fulfillment workflows.' },
        ],
      },
    ],
  },
  {
    id: 'retail-3',
    name: 'Digital Marketing & Analytics',
    industrySegment: 'Retail & E-Commerce',
    categories: [
      {
        id: 'retail-301',
        name: 'Digital Marketing Strategy',
        subCategories: [
          { id: 'retail-301-1', name: 'SEO & SEM Optimization', description: 'Search engine optimization and marketing strategies.' },
          { id: 'retail-301-2', name: 'Social Commerce', description: 'Leveraging social media platforms for sales and engagement.' },
          { id: 'retail-301-3', name: 'Influencer Marketing', description: 'Building strategic partnerships with influencers and content creators.' },
        ],
      },
      {
        id: 'retail-302',
        name: 'Retail Analytics',
        subCategories: [
          { id: 'retail-302-1', name: 'Customer Behavior Analytics', description: 'Analyzing shopping patterns and customer preferences.' },
          { id: 'retail-302-2', name: 'Sales Performance Tracking', description: 'Comprehensive sales metrics and performance optimization.' },
        ],
      },
    ],
  },
  {
    id: 'retail-4',
    name: 'Omnichannel Retail Strategy',
    industrySegment: 'Retail & E-Commerce',
    categories: [
      {
        id: 'retail-401',
        name: 'Store Operations',
        subCategories: [
          { id: 'retail-401-1', name: 'Point of Sale (POS) Systems', description: 'Modern POS solutions and in-store technology integration.' },
          { id: 'retail-401-2', name: 'Store Staff Management', description: 'Workforce scheduling and performance optimization.' },
          { id: 'retail-401-3', name: 'In-Store Customer Experience', description: 'Creating engaging physical retail environments.' },
        ],
      },
    ],
  },
];
