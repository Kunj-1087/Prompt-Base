import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import { Button } from '../components/ui/Button';
import { CheckCircle, XCircle, Loader2, ArrowRight } from 'lucide-react';
import { Card } from '../components/ui/card';

export const VerifyEmailPage = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!token) {
        setStatus('error');
        setMessage('Invalid verification link.');
        return;
    }

    const verify = async () => {
        try {
            const res = await authService.verifyEmail(token);
            setStatus('success');
            setMessage(res.message || 'Email verified successfully!');
        } catch (error: any) {
            setStatus('error');
            setMessage(error.response?.data?.message || 'Verification failed. The link might be expired or invalid.');
        }
    };

    verify();
  }, [token]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4">
      <Card className="w-full max-w-md p-8 bg-slate-900/50 backdrop-blur border-slate-800 text-center">
        {status === 'loading' && (
            <div className="flex flex-col items-center">
                <Loader2 className="w-12 h-12 text-indigo-500 animate-spin mb-4" />
                <h2 className="text-xl font-semibold text-white mb-2">Verifying Email...</h2>
                <p className="text-slate-400">Please wait while we verify your email address.</p>
            </div>
        )}

        {status === 'success' && (
            <div className="flex flex-col items-center">
                <CheckCircle className="w-16 h-16 text-emerald-500 mb-4" />
                <h2 className="text-2xl font-bold text-white mb-2">Verified!</h2>
                <p className="text-slate-300 mb-8">{message}</p>
                <Button 
                    className="w-full"
                    onClick={() => navigate('/dashboard')}
                >
                    Go to Dashboard <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
            </div>
        )}

        {status === 'error' && (
            <div className="flex flex-col items-center">
                <XCircle className="w-16 h-16 text-red-500 mb-4" />
                <h2 className="text-2xl font-bold text-white mb-2">Verification Failed</h2>
                <p className="text-slate-300 mb-8">{message}</p>
                <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => navigate('/dashboard')}
                >
                    Back to Dashboard
                </Button>
            </div>
        )}
      </Card>
    </div>
  );
};
