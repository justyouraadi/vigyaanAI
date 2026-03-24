import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Clock, ArrowRight, Search, Tag } from 'lucide-react';
import { Button } from '../components/ui/button';
import SEOHead from '../components/SEOHead';

const API_URL = process.env.REACT_APP_BACKEND_URL + '/api';

const BlogPage = () => {
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchPosts();
    fetchCategories();
  }, [selectedCategory]);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const url = selectedCategory
        ? `${API_URL}/blog/posts?category=${encodeURIComponent(selectedCategory)}`
        : `${API_URL}/blog/posts`;
      const res = await fetch(url);
      if (res.ok) setPosts(await res.json());
    } catch (e) {
      console.error('Failed to fetch posts:', e);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch(`${API_URL}/blog/categories`);
      if (res.ok) setCategories(await res.json());
    } catch (e) {
      console.error('Failed to fetch categories:', e);
    }
  };

  const filteredPosts = posts.filter(p =>
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#0a1a0f]" data-testid="blog-page">
      <SEOHead title="Blog & Free Resources" description="Expert insights, industry tips, and actionable guides to help you build income streams." path="/blog" />
      <Navbar />

      {/* Hero */}
      <section className="py-16 bg-[#0f1a14] border-b border-emerald-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
            Blog & Free Resources
          </h1>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto mb-8">
            Expert insights, industry tips, and actionable guides to help you build income streams.
          </p>

          {/* Search */}
          <div className="max-w-md mx-auto relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
            <input
              type="text"
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-[#0a1a0f] border border-[#1e3a2a] rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-[#50C878] transition-colors"
              data-testid="blog-search-input"
            />
          </div>
        </div>
      </section>

      {/* Category Filters */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-wrap gap-2">
          <Button
            variant={!selectedCategory ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedCategory('')}
            className={!selectedCategory ? 'bg-[#50C878] hover:bg-[#3CB371] text-white' : 'border-[#1e3a2a] text-slate-300 hover:text-white hover:bg-white/5'}
            data-testid="blog-filter-all"
          >
            All
          </Button>
          {categories.map((cat) => (
            <Button
              key={cat}
              variant={selectedCategory === cat ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory(cat)}
              className={selectedCategory === cat ? 'bg-[#50C878] hover:bg-[#3CB371] text-white' : 'border-[#1e3a2a] text-slate-300 hover:text-white hover:bg-white/5'}
              data-testid={`blog-filter-${cat.toLowerCase()}`}
            >
              {cat}
            </Button>
          ))}
        </div>
      </div>

      {/* Posts Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-96 rounded-2xl bg-[#0f1a14] animate-pulse" />
            ))}
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-slate-400 text-lg">No articles found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post) => (
              <Link
                key={post.post_id}
                to={`/blog/${post.slug}`}
                className="group block bg-[#0f1a14] border border-[#1e3a2a] rounded-2xl overflow-hidden hover:border-[#50C878]/40 transition-all duration-300"
                data-testid={`blog-card-${post.slug}`}
              >
                <div className="aspect-video overflow-hidden">
                  <img
                    src={post.cover_image}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-xs font-medium text-[#50C878] bg-[#50C878]/10 px-3 py-1 rounded-full">
                      {post.category}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-slate-500">
                      <Clock className="w-3 h-3" />
                      {post.read_time} min read
                    </span>
                  </div>
                  <h2 className="text-lg font-semibold text-white mb-2 group-hover:text-[#50C878] transition-colors line-clamp-2">
                    {post.title}
                  </h2>
                  <p className="text-sm text-slate-400 line-clamp-3 mb-4">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center text-[#50C878] text-sm font-medium">
                    Read More
                    <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default BlogPage;
