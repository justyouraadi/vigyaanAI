import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Zap } from 'lucide-react';
import { Button } from './ui/button';

const API_URL = process.env.REACT_APP_BACKEND_URL + '/api';

const UpsellSection = ({ ebookId }) => {
  const [recommendations, setRecommendations] = useState([]);

  useEffect(() => {
    if (ebookId) fetchUpsell();
  }, [ebookId]);

  const fetchUpsell = async () => {
    try {
      const res = await fetch(`${API_URL}/upsell/${ebookId}`);
      if (res.ok) setRecommendations(await res.json());
    } catch (e) {
      console.error('Failed to fetch upsell:', e);
    }
  };

  if (recommendations.length === 0) return null;

  return (
    <div className="bg-[#0f1a14] border border-[#1e3a2a] rounded-2xl p-6 mt-8" data-testid="upsell-section">
      <div className="flex items-center gap-2 mb-4">
        <Zap className="w-5 h-5 text-yellow-400" />
        <h3 className="text-lg font-semibold text-white">Recommended For You</h3>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {recommendations.map((ebook) => (
          <Link
            key={ebook.ebook_id}
            to={`/ebooks/${ebook.slug}`}
            className="group flex gap-4 bg-[#0a1a0f] border border-[#1e3a2a] rounded-xl p-4 hover:border-[#50C878]/40 transition-all"
            data-testid={`upsell-card-${ebook.slug}`}
          >
            <img
              src={ebook.cover_image}
              alt={ebook.title}
              className="w-16 h-20 rounded-lg object-cover flex-shrink-0"
            />
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-semibold text-white group-hover:text-[#50C878] transition-colors line-clamp-2">
                {ebook.title}
              </h4>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[#50C878] font-bold text-sm">₹{ebook.price?.toLocaleString()}</span>
                <span className="text-slate-500 line-through text-xs">₹{ebook.original_price?.toLocaleString()}</span>
              </div>
              <div className="flex items-center text-[#50C878] text-xs font-medium mt-2">
                View Details <ArrowRight className="w-3 h-3 ml-1 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default UpsellSection;
