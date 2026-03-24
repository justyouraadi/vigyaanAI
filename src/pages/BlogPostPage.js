import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Clock, ArrowLeft, ArrowRight, Calendar, User, Tag } from 'lucide-react';

const API_URL = process.env.REACT_APP_BACKEND_URL + '/api';

const BlogPostPage = () => {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [relatedPosts, setRelatedPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPost();
  }, [slug]);

  const fetchPost = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/blog/posts/${slug}`);
      if (res.ok) {
        const data = await res.json();
        setPost(data);
        fetchRelated(data.category, data.slug);
      }
    } catch (e) {
      console.error('Failed to fetch post:', e);
    } finally {
      setLoading(false);
    }
  };

  const fetchRelated = async (category, currentSlug) => {
    try {
      const res = await fetch(`${API_URL}/blog/posts?category=${encodeURIComponent(category)}`);
      if (res.ok) {
        const all = await res.json();
        setRelatedPosts(all.filter(p => p.slug !== currentSlug).slice(0, 3));
      }
    } catch (e) {
      console.error('Failed to fetch related posts:', e);
    }
  };

  const renderContent = (content) => {
    if (!content) return null;
    const lines = content.split('\n');
    return lines.map((line, i) => {
      if (line.startsWith('## ')) {
        return <h2 key={i} className="text-2xl font-bold text-white mt-10 mb-4">{line.replace('## ', '')}</h2>;
      }
      if (line.startsWith('### ')) {
        return <h3 key={i} className="text-xl font-semibold text-white mt-8 mb-3">{line.replace('### ', '')}</h3>;
      }
      if (line.startsWith('- **')) {
        const match = line.match(/^- \*\*(.+?)\*\*:?\s*(.*)/);
        if (match) {
          return (
            <li key={i} className="text-slate-300 mb-2 ml-4 list-disc">
              <strong className="text-white">{match[1]}</strong>{match[2] ? `: ${match[2]}` : ''}
            </li>
          );
        }
      }
      if (line.startsWith('- ')) {
        return <li key={i} className="text-slate-300 mb-2 ml-4 list-disc">{line.replace('- ', '')}</li>;
      }
      if (line.startsWith('| ') && line.includes('|')) {
        const cells = line.split('|').filter(c => c.trim());
        if (cells.every(c => c.trim().match(/^[-:]+$/))) return null;
        const isHeader = i > 0 && lines[i + 1]?.includes('---');
        const CellTag = isHeader ? 'th' : 'td';
        return (
          <tr key={i} className={isHeader ? 'bg-[#1e3a2a]' : 'border-b border-[#1e3a2a]'}>
            {cells.map((cell, j) => (
              <CellTag key={j} className={`px-4 py-2 text-sm ${isHeader ? 'text-white font-semibold' : 'text-slate-300'}`}>
                {cell.trim()}
              </CellTag>
            ))}
          </tr>
        );
      }
      if (line.trim() === '') return <div key={i} className="h-4" />;
      return <p key={i} className="text-slate-300 leading-relaxed mb-3">{line}</p>;
    });
  };

  const hasTable = post?.content?.includes('| ');

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a1a0f]">
        <Navbar />
        <div className="max-w-3xl mx-auto px-4 py-20">
          <div className="h-8 bg-[#0f1a14] rounded animate-pulse mb-4 w-3/4" />
          <div className="h-64 bg-[#0f1a14] rounded-2xl animate-pulse mb-6" />
          <div className="space-y-3">
            {[1,2,3,4].map(i => <div key={i} className="h-4 bg-[#0f1a14] rounded animate-pulse" />)}
          </div>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-[#0a1a0f]">
        <Navbar />
        <div className="max-w-3xl mx-auto px-4 py-20 text-center">
          <h1 className="text-3xl font-bold text-white mb-4">Article Not Found</h1>
          <p className="text-slate-400 mb-8">The article you're looking for doesn't exist or has been removed.</p>
          <Link to="/blog" className="text-[#50C878] hover:underline">Back to Blog</Link>
        </div>
        <Footer />
      </div>
    );
  }

  const formattedDate = new Date(post.created_at).toLocaleDateString('en-IN', {
    year: 'numeric', month: 'long', day: 'numeric'
  });

  return (
    <div className="min-h-screen bg-[#0a1a0f]" data-testid="blog-post-page">
      <Navbar />

      {/* Hero Image */}
      <div className="w-full h-64 md:h-96 overflow-hidden relative">
        <img
          src={post.cover_image}
          alt={post.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a1a0f] via-[#0a1a0f]/50 to-transparent" />
      </div>

      <article className="max-w-3xl mx-auto px-4 sm:px-6 -mt-20 relative z-10 pb-20">
        {/* Back link */}
        <Link to="/blog" className="inline-flex items-center gap-2 text-[#50C878] hover:underline mb-6 text-sm" data-testid="blog-back-link">
          <ArrowLeft className="w-4 h-4" />
          Back to Blog
        </Link>

        {/* Meta */}
        <div className="flex flex-wrap items-center gap-4 mb-4">
          <span className="text-xs font-medium text-[#50C878] bg-[#50C878]/10 px-3 py-1 rounded-full">{post.category}</span>
          <span className="flex items-center gap-1 text-xs text-slate-500">
            <Calendar className="w-3 h-3" />{formattedDate}
          </span>
          <span className="flex items-center gap-1 text-xs text-slate-500">
            <Clock className="w-3 h-3" />{post.read_time} min read
          </span>
          <span className="flex items-center gap-1 text-xs text-slate-500">
            <User className="w-3 h-3" />{post.author}
          </span>
        </div>

        {/* Title */}
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-6 leading-tight" data-testid="blog-post-title">
          {post.title}
        </h1>

        {/* Content */}
        <div className="prose-custom" data-testid="blog-post-content">
          {hasTable ? (
            <div>
              {post.content.split('\n').reduce((acc, line, i, arr) => {
                if (line.startsWith('| ') && line.includes('|')) {
                  if (!acc.inTable) {
                    acc.inTable = true;
                    acc.tableRows = [];
                  }
                  const cells = line.split('|').filter(c => c.trim());
                  if (!cells.every(c => c.trim().match(/^[-:]+$/))) {
                    acc.tableRows.push({ cells, isHeader: acc.tableRows.length === 0 });
                  }
                } else {
                  if (acc.inTable) {
                    acc.elements.push(
                      <div key={`table-${i}`} className="overflow-x-auto my-6">
                        <table className="w-full border border-[#1e3a2a] rounded-lg overflow-hidden">
                          <tbody>
                            {acc.tableRows.map((row, ri) => (
                              <tr key={ri} className={row.isHeader ? 'bg-[#1e3a2a]' : 'border-b border-[#1e3a2a]'}>
                                {row.cells.map((cell, ci) => {
                                  const CellTag = row.isHeader ? 'th' : 'td';
                                  return <CellTag key={ci} className={`px-4 py-2 text-sm ${row.isHeader ? 'text-white font-semibold' : 'text-slate-300'}`}>{cell.trim()}</CellTag>;
                                })}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    );
                    acc.inTable = false;
                    acc.tableRows = [];
                  }
                  const rendered = renderContent(line);
                  if (rendered) {
                    acc.elements.push(...rendered.filter(Boolean).map((el, j) => React.cloneElement(el, { key: `${i}-${j}` })));
                  }
                }
                if (i === arr.length - 1 && acc.inTable) {
                  acc.elements.push(
                    <div key={`table-end`} className="overflow-x-auto my-6">
                      <table className="w-full border border-[#1e3a2a] rounded-lg overflow-hidden">
                        <tbody>
                          {acc.tableRows.map((row, ri) => (
                            <tr key={ri} className={row.isHeader ? 'bg-[#1e3a2a]' : 'border-b border-[#1e3a2a]'}>
                              {row.cells.map((cell, ci) => {
                                const CellTag = row.isHeader ? 'th' : 'td';
                                return <CellTag key={ci} className={`px-4 py-2 text-sm ${row.isHeader ? 'text-white font-semibold' : 'text-slate-300'}`}>{cell.trim()}</CellTag>;
                              })}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  );
                }
                return acc;
              }, { elements: [], inTable: false, tableRows: [] }).elements}
            </div>
          ) : (
            renderContent(post.content)
          )}
        </div>

        {/* Tags */}
        {post.tags?.length > 0 && (
          <div className="mt-10 pt-6 border-t border-[#1e3a2a]">
            <div className="flex items-center gap-2 flex-wrap">
              <Tag className="w-4 h-4 text-slate-500" />
              {post.tags.map((tag) => (
                <span key={tag} className="text-xs bg-[#0f1a14] border border-[#1e3a2a] text-slate-400 px-3 py-1 rounded-full">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </article>

      {/* Related Articles */}
      {relatedPosts.length > 0 && (
        <section className="max-w-5xl mx-auto px-4 sm:px-6 pb-20" data-testid="related-articles">
          <div className="border-t border-[#1e3a2a] pt-12">
            <h2 className="text-2xl font-bold text-white mb-8">Related Articles</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedPosts.map((rp) => (
                <Link
                  key={rp.post_id}
                  to={`/blog/${rp.slug}`}
                  className="group block bg-[#0f1a14] border border-[#1e3a2a] rounded-xl overflow-hidden hover:border-[#50C878]/40 transition-all duration-300"
                  data-testid={`related-article-${rp.slug}`}
                >
                  <div className="aspect-video overflow-hidden">
                    <img
                      src={rp.cover_image}
                      alt={rp.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-4">
                    <span className="text-xs text-[#50C878] bg-[#50C878]/10 px-2 py-0.5 rounded-full">{rp.category}</span>
                    <h3 className="text-sm font-semibold text-white mt-2 mb-1 group-hover:text-[#50C878] transition-colors line-clamp-2">
                      {rp.title}
                    </h3>
                    <div className="flex items-center text-[#50C878] text-xs font-medium mt-2">
                      Read More <ArrowRight className="w-3 h-3 ml-1 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
};

export default BlogPostPage;
