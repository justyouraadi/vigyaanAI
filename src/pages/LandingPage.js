import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import CountdownTimer from '../components/CountdownTimer';
import EbookCard from '../components/EbookCard';
import { Button } from '../components/ui/button';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '../components/ui/accordion';
import { 
  BookOpen, Users, TrendingUp, Award, CheckCircle, 
  Star, ArrowRight, MessageCircle, Briefcase, GraduationCap,
  Shield, Target, Zap, Play
} from 'lucide-react';
import SEOHead from '../components/SEOHead';

const API_URL = process.env.REACT_APP_BACKEND_URL + '/api';

const LandingPage = () => {
  const { login } = useAuth();
  const [ebooks, setEbooks] = useState([]);
  const [videoTestimonials, setVideoTestimonials] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [activeVideo, setActiveVideo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEbooks();
    fetchVideoTestimonials();
    fetchReviews();
  }, []);

  const fetchEbooks = async () => {
    try {
      const response = await fetch(`${API_URL}/ebooks/`);
      if (response.ok) {
        const data = await response.json();
        setEbooks(data);
      }
    } catch (error) {
      console.error('Failed to fetch ebooks:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchVideoTestimonials = async () => {
    try {
      const res = await fetch(`${API_URL}/video-testimonials`);
      if (res.ok) setVideoTestimonials(await res.json());
    } catch (e) { console.error('Failed to fetch video testimonials:', e); }
  };

  const fetchReviews = async () => {
    try {
      const res = await fetch(`${API_URL}/reviews`);
      if (res.ok) setReviews(await res.json());
    } catch (e) { console.error('Failed to fetch reviews:', e); }
  };

  const stats = [
    { icon: Users, value: '10,000+', label: 'Students Guided' },
    { icon: BookOpen, value: '5+', label: 'Income Blueprints' },
    { icon: TrendingUp, value: '20 Lakh+', label: 'Career Opportunities' },
    { icon: Award, value: '95%', label: 'Success Rate' },
  ];

  const fallbackTestimonials = [
    {
      name: 'Rahul Sharma',
      role: 'Career Counselor',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100',
      text: 'The Career Counsellor Blueprint changed my life. I went from a 9-5 job to earning ₹8L/month within 6 months.',
      rating: 5
    },
    {
      name: 'Priya Patel',
      role: 'Import-Export Business Owner',
      image: 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=100',
      text: 'Started my import business with zero knowledge. Now doing ₹20L+ monthly revenue thanks to this guide.',
      rating: 5
    },
    {
      name: 'Amit Kumar',
      role: 'Data Scientist',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100',
      text: 'The interview guide helped me crack interviews at top MNCs. Got a 3x salary hike!',
      rating: 5
    },
  ];

  const displayTestimonials = reviews.length > 0 ? reviews : fallbackTestimonials;

  const faqs = [
    {
      question: 'What format are the ebooks in?',
      answer: 'All ebooks are delivered in PDF format, which can be read on any device - smartphone, tablet, or computer. You get lifetime access to your purchases.'
    },
    {
      question: 'How soon will I receive the ebook after purchase?',
      answer: 'Instantly! After successful payment, you will receive a download link via email within minutes. You can also access it from your dashboard.'
    },
    {
      question: 'Is there a refund policy?',
      answer: 'Yes, we offer a 7-day money-back guarantee. If you are not satisfied with your purchase, contact our support team for a full refund.'
    },
    {
      question: 'Can I share the ebook with others?',
      answer: 'The ebooks are for personal use only. Sharing or distributing the content is prohibited. However, you can use the knowledge gained to help others.'
    },
    {
      question: 'Do you offer any support after purchase?',
      answer: 'Yes! You get access to our community group where you can ask questions and get guidance from experts and fellow learners.'
    },
  ];

  return (
    <div className="min-h-screen bg-[#0a1a0f]" data-testid="landing-page">
      <SEOHead 
        title="Income Blueprint Ebooks - Learn Skills to Earn ₹5L-₹20L/Month"
        description="Step-by-step blueprint ebooks to help you earn ₹5L–₹20L per month. Career counselling, AI skills, import-export, real estate & more. Proven strategies from industry experts."
        path="/"
      />
      <Navbar />
      
      {/* Hero Section */}
      <section className="hero-gradient relative overflow-hidden" data-testid="hero-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center gap-2 bg-yellow-500 text-black px-4 py-2 rounded-full text-sm font-medium mb-6">
                <Zap className="w-4 h-4" />
                India's Fastest Growing Platform
              </div>
              
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight mb-6">
                Learn the System to Turn{' '}
                <span className="gradient-text">Knowledge Into ₹10 Lakh/Month Income</span>
              </h1>
              
              <p className="text-lg text-slate-400 mb-8 max-w-xl mx-auto lg:mx-0">
                Step-by-step blueprint ebooks to help you earn ₹5L–₹20L per month. 
                Proven strategies from industry experts.
              </p>

              {/* Countdown Timer */}
              <div className="mb-8 flex justify-center lg:justify-center">
                <div className="bg-yellow-400 text-black rounded-2xl px-8 py-5 inline-block text-center shadow-xl shadow-yellow-400/30 border-2 border-yellow-500">
                  <p className="text-sm font-bold mb-3 uppercase tracking-wider">Offer ends in:</p>
                  <CountdownTimer />
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link to="/ebooks">
                  <Button 
                    className="btn-cta text-lg px-8 py-6 rounded-full animate-pulse-glow"
                    data-testid="view-ebooks-btn"
                  >
                    View All Ebooks
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
                <Button 
                  variant="outline"
                  className="text-lg px-8 py-6 rounded-full border-2 border-slate-600 hover:border-[#50C878] text-white hover:bg-emerald-900"
                  onClick={login}
                  data-testid="get-started-btn"
                >
                  Get Started Free
                </Button>
              </div>
            </div>

            {/* Right - Hero Illustration */}
            <div className="relative">
              <img 
                src="https://static.prod-images.emergentagent.com/jobs/c508b654-6a51-4fd8-89d1-64d172c030e8/images/cf59a37085edb682cac593c58684ef5f49447222385c2d43ba0410a9202485d2.png"
                alt="Professionals earning through digital knowledge"
                className="w-full rounded-2xl shadow-2xl"
              />
              
              {/* Decorative Elements */}
              <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-br from-blue-900/30 to-orange-900/20 rounded-full blur-3xl opacity-50"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof Stats */}
      <section className="py-16 bg-[#0f1a14] border-y border-emerald-900" data-testid="stats-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center animate-count-up" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-green-900/50 text-[#6ee7a0] mb-4">
                  <stat.icon className="w-7 h-7" />
                </div>
                <div className="stat-number text-[#6ee7a0]" data-testid={`stat-${index}`}>{stat.value}</div>
                <div className="text-slate-400 text-sm mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Ebooks */}
      <section className="py-20 bg-[#0a1a0f]" id="ebooks" data-testid="featured-ebooks-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Featured Income Blueprints
            </h2>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto">
              Carefully crafted guides to help you build sustainable income streams
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="skeleton h-96 rounded-2xl"></div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {ebooks.slice(0, 6).map((ebook) => (
                <EbookCard key={ebook.ebook_id} ebook={ebook} />
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Link to="/ebooks">
              <Button className="bg-[#50C878] hover:bg-[#3CB371] text-white px-8 py-6 rounded-full text-lg">
                View All Ebooks
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-[#0f1a14]" id="how-it-works" data-testid="how-it-works-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              How It Works
            </h2>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto mb-8">
              Start your income journey in 3 simple steps
            </p>
            <img 
              src="https://static.prod-images.emergentagent.com/jobs/c508b654-6a51-4fd8-89d1-64d172c030e8/images/7f59094a6d93e33c9a25f89bdb613fdef2c5948a7c10d05975997a6480e53026.png"
              alt="3-step process to start earning"
              className="w-full max-w-3xl mx-auto rounded-2xl shadow-lg mb-12"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                title: 'Choose Your Blueprint',
                desc: 'Browse our collection of income blueprints and pick the one that matches your goals and interests.',
                icon: Target
              },
              {
                step: '02',
                title: 'Learn & Implement',
                desc: 'Follow the step-by-step guides with actionable strategies, templates, and real-world examples.',
                icon: BookOpen
              },
              {
                step: '03',
                title: 'Start Earning',
                desc: 'Apply what you learn and start building sustainable income streams. Get community support along the way.',
                icon: TrendingUp
              }
            ].map((item, index) => (
              <div key={index} className="relative group">
                <div className="bg-[#0a1a0f] border border-[#1e3a2a] rounded-2xl p-8 text-center hover:border-[#50C878]/40 transition-all duration-300">
                  <div className="text-5xl font-bold text-[#50C878]/20 mb-4">{item.step}</div>
                  <div className="w-14 h-14 rounded-2xl bg-[#50C878]/10 flex items-center justify-center mx-auto mb-4">
                    <item.icon className="w-7 h-7 text-[#50C878]" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-3">{item.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">{item.desc}</p>
                </div>
                {index < 2 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-0.5 bg-[#1e3a2a]" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Government Opportunity Section */}
      <section className="py-20 bg-[#0f1a14]" id="about" data-testid="govt-opportunity-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="govt-badge inline-block mb-4">Government Recognized</div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                India Needs 20 Lakh+ Career Counselors
              </h2>
              
              <div className="space-y-4">
                {[
                  { icon: GraduationCap, text: '93% of Indian students are confused about their career path' },
                  { icon: Shield, text: 'Supreme Court has directed schools to appoint career counselors' },
                  { icon: Briefcase, text: 'CBSE mandates expert career guidance in all schools' },
                  { icon: Target, text: 'Massive shortage of certified career counselors in India' },
                ].map((item, index) => (
                  <div key={index} className="flex items-start gap-4 p-4 bg-emerald-900/50 rounded-xl border border-slate-700">
                    <div className="w-10 h-10 rounded-lg bg-[#50C878] text-white flex items-center justify-center flex-shrink-0">
                      <item.icon className="w-5 h-5" />
                    </div>
                    <p className="text-slate-300">{item.text}</p>
                  </div>
                ))}
              </div>

              <Link to="/ebooks/career-counsellor-business-blueprint" className="inline-block mt-8">
                <Button className="btn-cta px-8 py-6 rounded-full text-lg">
                  Start Your Career Counseling Business
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </div>

            <div className="relative">
              <img 
                src="https://static.prod-images.emergentagent.com/jobs/c508b654-6a51-4fd8-89d1-64d172c030e8/images/712f5497097791fa7fc1d2dc2f5ed14e412ccdfcc1639315a9f3797b33f53b9e.png"
                alt="Career Success"
                className="rounded-2xl shadow-2xl"
              />
              <div className="absolute -bottom-6 -left-6 bg-[#0f1a14] p-6 rounded-xl shadow-xl border border-slate-700">
                <div className="text-3xl font-bold text-[#6ee7a0]">₹5L-₹15L</div>
                <div className="text-slate-400">Monthly Earning Potential</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-[#0a1a0f]" id="testimonials" data-testid="testimonials-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Success Stories
            </h2>
            <p className="text-lg text-slate-400">
              Real results from real people who took action
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {displayTestimonials.map((testimonial, index) => (
              <div key={testimonial.review_id || index} className="testimonial-card" data-testid={`testimonial-${index}`}>
                <div className="flex items-center gap-4 mb-4 mt-8">
                  <img 
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-14 h-14 rounded-full object-cover"
                  />
                  <div>
                    <h4 className="font-semibold text-white">{testimonial.name}</h4>
                    <p className="text-sm text-slate-400">{testimonial.role}</p>
                  </div>
                </div>
                <div className="flex gap-1 mb-3">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-[#FFC300] text-[#FFC300]" />
                  ))}
                </div>
                <p className="text-slate-300">{testimonial.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Video Testimonials */}
      {videoTestimonials.length > 0 && (
        <section className="py-20 bg-[#0f1a14]" data-testid="video-testimonials-section">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Watch Their Journey
              </h2>
              <p className="text-lg text-slate-400">
                Hear directly from people who transformed their income with our blueprints
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {videoTestimonials.map((vt) => (
                <div key={vt.testimonial_id} className="bg-[#0a1a0f] border border-[#1e3a2a] rounded-2xl overflow-hidden hover:border-[#50C878]/40 transition-all duration-300 group" data-testid={`video-testimonial-${vt.testimonial_id}`}>
                  {/* Video / Thumbnail */}
                  <div className="relative aspect-video bg-black">
                    {activeVideo === vt.testimonial_id && vt.embed_url ? (
                      <iframe
                        src={`${vt.embed_url}?autoplay=1`}
                        title={`${vt.name} testimonial`}
                        className="w-full h-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    ) : vt.video_path ? (
                      <video
                        src={`${API_URL}/files/${vt.video_path}`}
                        controls
                        poster={vt.thumbnail}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="relative w-full h-full cursor-pointer" onClick={() => setActiveVideo(vt.testimonial_id)}>
                        <img
                          src={vt.thumbnail}
                          alt={vt.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/30 transition-colors">
                          <div className="w-16 h-16 rounded-full bg-[#50C878] flex items-center justify-center shadow-lg shadow-[#50C878]/30 group-hover:scale-110 transition-transform">
                            <Play className="w-7 h-7 text-white ml-1" fill="white" />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="p-5">
                    <div className="flex items-center gap-3 mb-3">
                      <img src={vt.thumbnail} alt={vt.name} className="w-10 h-10 rounded-full object-cover border-2 border-[#50C878]/30" />
                      <div>
                        <h4 className="font-semibold text-white text-sm">{vt.name}</h4>
                        <p className="text-xs text-slate-500">{vt.role}</p>
                      </div>
                    </div>
                    <div className="flex gap-0.5 mb-2">
                      {[...Array(vt.rating || 5)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-[#FFC300] text-[#FFC300]" />
                      ))}
                    </div>
                    <p className="text-sm text-slate-400 leading-relaxed line-clamp-3">"{vt.quote}"</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* FAQ Section */}
      <section className="py-20 bg-[#0f1a14]" id="faq" data-testid="faq-section">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-slate-400">
              Got questions? We have answers.
            </p>
          </div>

          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem 
                key={index} 
                value={`item-${index}`}
                className="faq-item"
                data-testid={`faq-item-${index}`}
              >
                <AccordionTrigger className="px-6 py-4 text-left font-medium text-white hover:no-underline">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4 text-slate-400">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-[#50C878] to-[#0891B2] relative overflow-hidden" data-testid="cta-section">
        <img 
          src="https://static.prod-images.emergentagent.com/jobs/c508b654-6a51-4fd8-89d1-64d172c030e8/images/e92e93c2f50c7950a30b62ec38236430970097da02b562acfbac0ddfae3477a2.png"
          alt=""
          className="absolute inset-0 w-full h-full object-cover opacity-15"
        />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Transform Your Income?
          </h2>
          <p className="text-xl text-green-100 mb-8">
            Join 10,000+ professionals who have already taken the first step
          </p>
          <Link to="/ebooks">
            <Button className="bg-white text-[#50C878] hover:bg-slate-100 px-10 py-6 rounded-full text-lg font-semibold">
              Browse All Ebooks
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>
      </section>

      {/* WhatsApp Chat Button */}
      <a
        href="https://wa.me/919876543210"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-green-500 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
        data-testid="whatsapp-btn"
      >
        <MessageCircle className="w-7 h-7 text-white" />
      </a>

      <Footer />
    </div>
  );
};

export default LandingPage;
