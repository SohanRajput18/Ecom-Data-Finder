import React, { useState, useEffect } from 'react';
import Card from '../components/Card';
import { Card as CardType } from '../types';
import { cardsAPI } from '../services/api';

const BrowseCards = () => {
  const [cards, setCards] = useState<CardType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    issuer: '',
    annualFee: '',
    benefits: ''
  });
  const [sortBy, setSortBy] = useState('name');

  useEffect(() => {
    const fetchCards = async () => {
      try {
        const response = await cardsAPI.getAll();
        setCards(response.data);
      } catch (err) {
        setError('Failed to load cards. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchCards();
  }, []);

  const filteredCards = cards.filter(card => {
    if (filters.issuer && !card.issuer.toLowerCase().includes(filters.issuer.toLowerCase())) {
      return false;
    }
    if (filters.annualFee) {
      const fee = parseInt(filters.annualFee);
      if (fee === 0 && card.annualFee > 0) return false;
      if (fee === 1 && (card.annualFee <= 0 || card.annualFee > 5000)) return false;
      if (fee === 2 && (card.annualFee <= 5000 || card.annualFee > 15000)) return false;
      if (fee === 3 && card.annualFee <= 15000) return false;
    }
    if (filters.benefits && !card.benefits.some(benefit => 
      benefit.toLowerCase().includes(filters.benefits.toLowerCase())
    )) {
      return false;
    }
    return true;
  });

  const sortedCards = [...filteredCards].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'annualFee':
        return a.annualFee - b.annualFee;
      case 'issuer':
        return a.issuer.localeCompare(b.issuer);
      default:
        return 0;
    }
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Browse Credit Cards</h1>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="issuer" className="block text-sm font-medium text-gray-700 mb-1">
              Issuer
            </label>
            <input
              type="text"
              id="issuer"
              placeholder="Search by issuer"
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              value={filters.issuer}
              onChange={(e) => setFilters({ ...filters, issuer: e.target.value })}
            />
          </div>
          <div>
            <label htmlFor="annualFee" className="block text-sm font-medium text-gray-700 mb-1">
              Annual Fee
            </label>
            <select
              id="annualFee"
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              value={filters.annualFee}
              onChange={(e) => setFilters({ ...filters, annualFee: e.target.value })}
            >
              <option value="">All</option>
              <option value="0">No Annual Fee</option>
              <option value="1">₹0 - ₹5,000</option>
              <option value="2">₹5,001 - ₹15,000</option>
              <option value="3">₹15,000+</option>
            </select>
          </div>
          <div>
            <label htmlFor="benefits" className="block text-sm font-medium text-gray-700 mb-1">
              Benefits
            </label>
            <input
              type="text"
              id="benefits"
              placeholder="Search by benefits"
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              value={filters.benefits}
              onChange={(e) => setFilters({ ...filters, benefits: e.target.value })}
            />
          </div>
        </div>
      </div>

      {/* Sort */}
      <div className="mb-4">
        <label htmlFor="sort" className="block text-sm font-medium text-gray-700 mb-1">
          Sort By
        </label>
        <select
          id="sort"
          className="rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="name">Name</option>
          <option value="annualFee">Annual Fee</option>
          <option value="issuer">Issuer</option>
        </select>
      </div>

      {/* Cards Grid */}
      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading cards...</p>
        </div>
      ) : error ? (
        <div className="text-center py-8 text-red-600">{error}</div>
      ) : sortedCards.length === 0 ? (
        <div className="text-center py-8 text-gray-600">No cards found matching your criteria.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedCards.map((card) => (
            <Card key={card.id} card={card} />
          ))}
        </div>
      )}
    </div>
  );
};

export default BrowseCards; 