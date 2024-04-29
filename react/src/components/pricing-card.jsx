import React from 'react';
import '../Pages/pricing.css';

const PricingCard = ({ title, description, price, per, features, buttonText }) => {
  return (
    <div className="pricing-card">
      <h1>{title}</h1>
      <h3 className='des'>{description}</h3>
      <h2 className='price'>€{price}</h2>
      <h3 className='per'>{per}</h3>
      <ul>
        {features.map((feature, index) => (
          <li key={index}>{feature}</li>
        ))}
      </ul>
      <a href="#" className="try">{buttonText}</a>
    </div>
  );
};

export default PricingCard;