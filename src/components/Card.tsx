import React from 'react';
import { Card as CardType } from '../types';
import { useAuth } from '../context';
import { cardsAPI } from '../services/api';

interface CardProps {
  card: CardType;
  showMatchScore?: boolean;
}

const Card: React.FC<CardProps> = ({ card, showMatchScore = false }) => {
  const { isAuthenticated, user } = useAuth();
  const [isSaved, setIsSaved] = React.useState(
    user?.savedCards?.includes(card.id) || false
  );
  const [saving, setSaving] = React.useState(false);

  const handleSave = async () => {
    if (!isAuthenticated) return;
    try {
      setSaving(true);
      await cardsAPI.saveCard(card.id);
      setIsSaved(true);
    } catch (error) {
      console.error('Error saving card:', error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <div className="relative">
        <img
          src={card.imageUrl}
          alt={card.name}
          className="w-full h-48 object-cover"
        />
        {showMatchScore && card.matchScore && (
          <div className="absolute top-2 right-2 bg-primary-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
            {Math.round(card.matchScore)}% Match
          </div>
        )}
      </div>
      
      <div className="p-4">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-xl font-semibold text-gray-900">{card.name}</h3>
            <p className="text-gray-600">{card.issuer}</p>
          </div>
          {isAuthenticated && (
            <button
              onClick={handleSave}
              disabled={saving || isSaved}
              className={`p-2 rounded-full ${
                isSaved
                  ? 'text-primary-600 bg-primary-50'
                  : 'text-gray-600 hover:text-primary-600'
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill={isSaved ? 'currentColor' : 'none'}
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                />
              </svg>
            </button>
          )}
        </div>

        <div className="space-y-2 mb-4">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Annual Fee:</span>
            <span className="font-medium">₹{card.annualFee}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Joining Fee:</span>
            <span className="font-medium">₹{card.joiningFee}</span>
          </div>
        </div>

        <div className="mb-4">
          <h4 className="text-sm font-semibold text-gray-900 mb-2">Key Benefits</h4>
          <ul className="text-sm text-gray-600 space-y-1">
            {card.benefits.slice(0, 3).map((benefit, index) => (
              <li key={index} className="flex items-start">
                <span className="text-primary-600 mr-2">•</span>
                {benefit}
              </li>
            ))}
          </ul>
        </div>

        <a
          href={card.applyLink}
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full bg-primary-600 text-white text-center py-2 rounded-md hover:bg-primary-700 transition-colors duration-300"
        >
          Apply Now
        </a>
      </div>
    </div>
  );
};

export default Card; 