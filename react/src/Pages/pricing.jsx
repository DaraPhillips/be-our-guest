import React from 'react';
import PricingCard from '../components/pricing-card';
import './pricing.css';
import { Link } from 'react-router-dom';

const pricingData = [
  {
    title: 'Minimalist',
    description: 'All the minimal features for an informative website',
    price: '0',
    per: 'Simply free!',
    features: [
      'Host your own wedding dashboard',
      'Manage your guests in one place',
      'Make posts to a shared dashboard',
      'Chat with other guests',
      'Customise your profile',
      'Icebreakers',
    ],
    buttonText: 'Get started',
  },
  {
    title: 'Professional',
    description: 'Ideal for presenting your wedding plans in further detail',
    price: '39',
    per: 'One-time fee!',
    features: [
      'Galas & Fundraisers',
      'Meetings & Small Summits',
      'Launch Events',
      'Holiday Parties',
      'Shows & Performances',
      'Reunions',
    ],
    buttonText: 'Free trial',
  },
  {
    title: 'Premium',
    description: 'Full access to create an outstanding website!',
    price: '99',
    per: 'One-time fee!',
    features: [
      'Unlimited guests',
      'Custom branding',
      '24/7 Support',
      'Priority onboarding',
      'Complimentary Gifts',
      'Tailored Menus'
      
    ],
    buttonText: 'Free trial',
  },
];

const App = () => {
  return (
<div>
<div className='breadcrumb-container'>
<Link to="/dashboard" className='dash-breadcrumb'>Dashboard / </Link>
<h3 className='currentPage-breadcrumb'> Pricing </h3>
</div>

    <div className="pricing-card-container">
      {pricingData.map((data, index) => (
        <PricingCard
          key={index}
          title={data.title}
          description={data.description}
          price={data.price}
          per={data.per}
          features={data.features}
          buttonText={data.buttonText}
        />
      ))}
     </div>
    </div>
  );
};

export default App;