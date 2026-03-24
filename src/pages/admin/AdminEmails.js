import React, { useState, useEffect } from 'react';
import { Badge } from '../../components/ui/badge';
import { Loader2, Mail, Clock } from 'lucide-react';

const API_URL = process.env.REACT_APP_BACKEND_URL + '/api';

const AdminEmails = () => {
  const [emails, setEmails] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEmails();
  }, []);

  const fetchEmails = async () => {
    try {
      const response = await fetch(`${API_URL}/admin/email-logs`, {
        credentials: 'include'
      });
      if (response.ok) {
        const data = await response.json();
        setEmails(data);
      }
    } catch (error) {
      console.error('Failed to fetch emails:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-10 h-10 animate-spin text-[#50C878]" />
      </div>
    );
  }

  return (
    <div data-testid="admin-emails">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Email Logs</h1>
        <p className="text-slate-600">View all sent emails (Mock emails for testing)</p>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6">
        <p className="text-yellow-800 text-sm">
          <strong>Note:</strong> These are mock emails. In production, integrate with Resend, SendGrid, or another email service.
        </p>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        {emails.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">No Emails Sent</h3>
            <p className="text-slate-500">Email logs will appear here after purchases</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {emails.map((email) => (
              <div key={email.email_id} className="p-6 hover:bg-slate-50">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Mail className="w-4 h-4 text-[#50C878]" />
                      <span className="font-medium text-slate-900">{email.to_email}</span>
                    </div>
                    <h3 className="font-semibold text-slate-900">{email.subject}</h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-emerald-50 text-emerald-600 border-0">
                      {email.status}
                    </Badge>
                    <span className="text-xs text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(email.created_at).toLocaleString()}
                    </span>
                  </div>
                </div>
                <div className="bg-slate-50 rounded-lg p-4 mt-3">
                  <pre className="text-sm text-slate-600 whitespace-pre-wrap font-mono">
                    {email.body}
                  </pre>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminEmails;
