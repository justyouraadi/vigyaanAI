import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Button } from '../components/ui/button';
import { Mail, Phone, MapPin, Send, CheckCircle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import SEOHead from '../components/SEOHead';

const API_URL = process.env.REACT_APP_BACKEND_URL + '/api';

const ContactPage = () => {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast.error('Please fill in all required fields');
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch(`${API_URL}/contact/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setSubmitted(true);
        toast.success('Message sent successfully!');
      } else {
        const data = await res.json();
        toast.error(data.detail || 'Failed to send message');
      }
    } catch (e) {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a1a0f]" data-testid="contact-page">
      <SEOHead title="Contact Us" description="Have questions about our ebooks or need help? Get in touch with the VigyaanKart team." path="/contact" />
      <Navbar />

      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
              Get In Touch
            </h1>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto">
              Have questions about our ebooks or need help? We'd love to hear from you.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
            {/* Contact Info */}
            <div className="lg:col-span-2 space-y-8">
              <div className="bg-[#0f1a14] border border-[#1e3a2a] rounded-2xl p-8">
                <h2 className="text-xl font-semibold text-white mb-6">Contact Information</h2>
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-[#50C878]/10 flex items-center justify-center flex-shrink-0">
                      <Mail className="w-5 h-5 text-[#50C878]" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-500 mb-1">Email</p>
                      <a href="mailto:support@vigyaankart.com" className="text-white hover:text-[#50C878] transition-colors">
                        support@vigyaankart.com
                      </a>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-[#50C878]/10 flex items-center justify-center flex-shrink-0">
                      <Phone className="w-5 h-5 text-[#50C878]" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-500 mb-1">Phone</p>
                      <a href="tel:+919876543210" className="text-white hover:text-[#50C878] transition-colors">
                        +91 9876543210
                      </a>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-[#50C878]/10 flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-5 h-5 text-[#50C878]" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-500 mb-1">Address</p>
                      <p className="text-white">Mumbai, Maharashtra, India</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-[#0f1a14] border border-[#1e3a2a] rounded-2xl p-8">
                <h3 className="text-lg font-semibold text-white mb-3">Business Hours</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-slate-400">
                    <span>Monday - Friday</span>
                    <span className="text-white">9:00 AM - 6:00 PM</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Saturday</span>
                    <span className="text-white">10:00 AM - 4:00 PM</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Sunday</span>
                    <span className="text-slate-500">Closed</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-3">
              <div className="bg-[#0f1a14] border border-[#1e3a2a] rounded-2xl p-8">
                {submitted ? (
                  <div className="text-center py-12" data-testid="contact-success">
                    <div className="w-16 h-16 rounded-full bg-[#50C878]/20 flex items-center justify-center mx-auto mb-6">
                      <CheckCircle className="w-8 h-8 text-[#50C878]" />
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-3">Message Sent!</h2>
                    <p className="text-slate-400 mb-6">
                      Thank you for reaching out. We'll get back to you within 24 hours.
                    </p>
                    <Button
                      onClick={() => { setSubmitted(false); setForm({ name: '', email: '', subject: '', message: '' }); }}
                      className="bg-[#50C878] hover:bg-[#3CB371] text-white"
                      data-testid="contact-send-another"
                    >
                      Send Another Message
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6" data-testid="contact-form">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Name *</label>
                        <input
                          type="text"
                          name="name"
                          value={form.name}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 bg-[#0a1a0f] border border-[#1e3a2a] rounded-xl text-white placeholder:text-slate-600 focus:outline-none focus:border-[#50C878] transition-colors"
                          placeholder="Your name"
                          data-testid="contact-name-input"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Email *</label>
                        <input
                          type="email"
                          name="email"
                          value={form.email}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 bg-[#0a1a0f] border border-[#1e3a2a] rounded-xl text-white placeholder:text-slate-600 focus:outline-none focus:border-[#50C878] transition-colors"
                          placeholder="your@email.com"
                          data-testid="contact-email-input"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">Subject</label>
                      <input
                        type="text"
                        name="subject"
                        value={form.subject}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-[#0a1a0f] border border-[#1e3a2a] rounded-xl text-white placeholder:text-slate-600 focus:outline-none focus:border-[#50C878] transition-colors"
                        placeholder="What is this about?"
                        data-testid="contact-subject-input"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">Message *</label>
                      <textarea
                        name="message"
                        value={form.message}
                        onChange={handleChange}
                        required
                        rows={5}
                        className="w-full px-4 py-3 bg-[#0a1a0f] border border-[#1e3a2a] rounded-xl text-white placeholder:text-slate-600 focus:outline-none focus:border-[#50C878] transition-colors resize-none"
                        placeholder="Tell us how we can help..."
                        data-testid="contact-message-input"
                      />
                    </div>
                    <Button
                      type="submit"
                      disabled={submitting}
                      className="w-full bg-[#50C878] hover:bg-[#3CB371] text-white py-6 rounded-xl font-semibold"
                      data-testid="contact-submit-btn"
                    >
                      {submitting ? (
                        <><Loader2 className="w-5 h-5 mr-2 animate-spin" />Sending...</>
                      ) : (
                        <><Send className="w-5 h-5 mr-2" />Send Message</>
                      )}
                    </Button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ContactPage;
