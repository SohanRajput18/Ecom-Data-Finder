import React from 'react';
import { Card } from '../types';

interface CreditCardProps {
  card: Card;
  matchScore?: number;
}

const CreditCard: React.FC<CreditCardProps> = ({ card, matchScore }) => {
  return (
    <div className="card hover:shadow-lg transition-shadow duration-200">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-xl font-semibold text-gray-900">{card.name}</h3>
          <p className="text-gray-600">{card.issuer}</p>
        </div>
        {matchScore && (
          <div className="bg-primary-100 text-primary-800 px-3 py-1 rounded-full text-sm font-medium">
            {matchScore}% Match
          </div>
        )}
      </div>

      <div className="space-y-6">
        <div>
          <h4 className="font-medium text-gray-700 mb-2">Fees</h4>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Annual Fee</p>
              <p className="font-medium">₹{card.annualFee.toLocaleString('en-IN')}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Joining Fee</p>
              <p className="font-medium">₹{card.joiningFee.toLocaleString('en-IN')}</p>
            </div>
          </div>
        </div>

        <div>
          <h4 className="font-medium text-gray-700 mb-2">Key Benefits</h4>
          <ul className="space-y-2">
            {card.benefits.map((benefit, index) => (
              <li key={index} className="text-sm text-gray-600 flex items-start">
                <svg className="w-4 h-4 text-primary-600 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                {benefit}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-medium text-gray-700 mb-2">Features</h4>
          <ul className="space-y-2">
            {card.features.map((feature, index) => (
              <li key={index} className="text-sm text-gray-600">{feature}</li>
            ))}
          </ul>
        </div>

        <div className="pt-4">
          <a
            href={card.applyLink}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary w-full text-center block"
          >
            Apply Now
          </a>
        </div>
      </div>
    </div>
  );
};

export default CreditCard; 