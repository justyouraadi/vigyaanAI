import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import EbookCard from '../components/EbookCard';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Search, Filter, Loader2 } from 'lucide-react';
import SEOHead from '../components/SEOHead';

const API_URL = process.env.REACT_APP_BACKEND_URL + '/api';

const EbooksPage = () => {
  const [ebooks, setEbooks] = useState([]);
  const [filteredEbooks, setFilteredEbooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [categories, setCategories] = useState(['All']);

  useEffect(() => {
    fetchEbooks();
  }, []);

  useEffect(() => {
    filterEbooks();
  }, [searchQuery, selectedCategory, ebooks]);

  const fetchEbooks = async () => {
    try {
      const response = await fetch(`${API_URL}/ebooks/`);
      if (response.ok) {
        const data = await response.json();
        setEbooks(data);
        
        // Extract unique categories
        const uniqueCategories = ['All', ...new Set(data.map(e => e.category))];
        setCategories(uniqueCategories);
      }
    } catch (error) {
      console.error('Failed to fetch ebooks:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterEbooks = () => {
    let filtered = ebooks;

    // Filter by category
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(e => e.category === selectedCategory);
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(e => 
        e.title.toLowerCase().includes(query) ||
        e.description.toLowerCase().includes(query) ||
        e.category.toLowerCase().includes(query)
      );
    }

    setFilteredEbooks(filtered);
  };

  return (
    <div className="min-h-screen bg-[#0a1a0f]" data-testid="ebooks-page">
      <SEOHead title="Browse All Income Blueprint Ebooks" description="Explore our collection of income blueprint ebooks covering career counselling, AI skills, import-export, real estate, and data science." path="/ebooks" />
      <Navbar />

      {/* Header */}
      <div className="bg-[#0f1a14] border-b border-emerald-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Income Blueprint Ebooks
          </h1>
          <p className="text-lg text-slate-400 max-w-2xl">
            Discover proven strategies to build sustainable income streams. 
            Each ebook is carefully crafted by industry experts.
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          {/* Search */}
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <Input
              type="text"
              placeholder="Search ebooks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
              data-testid="search-input"
            />
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className={selectedCategory === category ? "bg-[#50C878]" : ""}
                data-testid={`category-${category.toLowerCase()}`}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Ebooks Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-10 h-10 animate-spin text-[#6ee7a0]" />
          </div>
        ) : filteredEbooks.length === 0 ? (
          <div className="text-center py-20">
            <h3 className="text-xl font-semibold text-white mb-2">No ebooks found</h3>
            <p className="text-slate-400">Try adjusting your search or filter criteria</p>
          </div>
        ) : (
          <>
            <p className="text-sm text-slate-500 mb-6">
              Showing {filteredEbooks.length} ebook{filteredEbooks.length !== 1 ? 's' : ''}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredEbooks.map((ebook) => (
                <EbookCard key={ebook.ebook_id} ebook={ebook} />
              ))}
            </div>
          </>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default EbooksPage;
