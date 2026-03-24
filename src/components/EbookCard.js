import React from 'react';
import { Link } from 'react-router-dom';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Tag, Download } from 'lucide-react';

const EbookCard = ({ ebook }) => {
  const discount = Math.round(((ebook.original_price - ebook.price) / ebook.original_price) * 100);

  return (
    <div className="ebook-card group" data-testid={`ebook-card-${ebook.slug}`}>
      {/* Cover Image */}
      <div className="relative aspect-[3/4] overflow-hidden bg-slate-100">
        <img
          src={ebook.cover_image}
          alt={ebook.title}
          className="ebook-cover w-full h-full object-cover"
        />
        {discount > 0 && (
          <div className="absolute top-3 right-3">
            <Badge className="bg-[#FF6B00] text-white border-0 font-semibold">
              {discount}% OFF
            </Badge>
          </div>
        )}
        <div className="absolute top-3 left-3">
          <Badge variant="secondary" className="bg-white/90 text-slate-700 border-0">
            {ebook.category}
          </Badge>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="font-semibold text-lg text-white mb-2 line-clamp-2 group-hover:text-[#6ee7a0] transition-colors">
          {ebook.title}
        </h3>
        
        <p className="text-slate-400 text-sm mb-4 line-clamp-2">
          {ebook.short_description}
        </p>

        {/* Price */}
        <div className="flex items-center gap-3 mb-4">
          <span className="price-tag text-lg">₹{ebook.price.toLocaleString()}</span>
          {ebook.original_price > ebook.price && (
            <span className="original-price text-sm">₹{ebook.original_price.toLocaleString()}</span>
          )}
        </div>

        {/* Income Potential */}
        {ebook.income_potential && (
          <div className="flex items-center gap-2 text-sm text-emerald-600 mb-4">
            <Tag className="w-4 h-4" />
            <span className="font-medium">{ebook.income_potential}</span>
          </div>
        )}

        {/* CTA */}
        <Link to={`/ebooks/${ebook.slug}`}>
          <Button 
            className="w-full bg-[#50C878] hover:bg-[#3CB371] text-white group/btn"
            data-testid={`download-ebook-${ebook.slug}`}
          >
            <Download className="w-4 h-4 mr-2" />
            Download the Ebook
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default EbookCard;
