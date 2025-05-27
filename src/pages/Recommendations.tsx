import React, { useState } from 'react';
import Form from '../components/Form';
import Card from '../components/Card';
import { Card as CardType } from '../types';
import { cardsAPI } from '../services/api';
import Layout from '../components/Layout';

const Recommendations: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [recommendations, setRecommendations] = useState<CardType[]>([]);

  const fields = [
    {
      name: 'spendingCategories',
      label: 'Spending Categories',
      type: 'select' as const,
      required: true,
      options: [
        { value: 'travel', label: 'Travel' },
        { value: 'dining', label: 'Dining' },
        { value: 'shopping', label: 'Shopping' },
        { value: 'groceries', label: 'Groceries' },
        { value: 'entertainment', label: 'Entertainment' }
      ]
    },
    {
      name: 'incomeRange',
      label: 'Annual Income Range',
      type: 'select' as const,
      required: true,
      options: [
        { value: '0-500000', label: '₹0 - ₹5,00,000' },
        { value: '500001-1000000', label: '₹5,00,001 - ₹10,00,000' },
        { value: '1000001-2000000', label: '₹10,00,001 - ₹20,00,000' },
        { value: '2000001+', label: '₹20,00,001+' }
      ]
    },
    {
      name: 'creditScore',
      label: 'Credit Score',
      type: 'select' as const,
      required: true,
      options: [
        { value: 'poor', label: 'Poor (300-579)' },
        { value: 'fair', label: 'Fair (580-669)' },
        { value: 'good', label: 'Good (670-739)' },
        { value: 'very_good', label: 'Very Good (740-799)' },
        { value: 'excellent', label: 'Excellent (800-850)' }
      ]
    }
  ];

  const handleSubmit = async (data: Record<string, string>) => {
    setError(null);
    setLoading(true);
    try {
      const preferences = {
        spendingCategories: [data.spendingCategories],
        incomeRange: data.incomeRange,
        creditScore: data.creditScore,
        preferredBenefits: []
      };
      
      const response = await cardsAPI.getRecommendations(preferences);
      setRecommendations(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get recommendations. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Get Card Recommendations</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-1">
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">Your Preferences</h2>
              <Form
                fields={fields}
                onSubmit={handleSubmit}
                submitText="Get Recommendations"
                error={error}
                loading={loading}
              />
            </div>
          </div>

          <div className="md:col-span-2">
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
              </div>
            ) : recommendations.length > 0 ? (
              <div className="space-y-6">
                {recommendations.map((card) => (
                  <Card key={card.id} card={card} showMatchScore={true} />
                ))}
              </div>
            ) : (
              <div className="bg-white p-6 rounded-lg shadow text-center">
                <p className="text-gray-600">Fill in your preferences to get card recommendations.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Recommendations; 