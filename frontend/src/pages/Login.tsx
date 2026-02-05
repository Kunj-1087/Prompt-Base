import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Eye, EyeOff, X } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  
  // 2FA State
  const [showTwoFactor, setShowTwoFactor] = useState(false);
  const [twoFactorCode, setTwoFactorCode] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    setSubmitError(null);
    try {
      const payload: any = { ...data };
      if (showTwoFactor) {
          if (!twoFactorCode) {
              setSubmitError('Please enter your 2FA code');
              return;
          }
          payload.code = twoFactorCode;
      }

      const response = await api.post('/auth/login', payload);
      
      if (response.data.success) {
        // Check for 2FA requirement
        if (response.data.data?.require2FA) {
             setShowTwoFactor(true);
             setSubmitError(null);
             return;
        }

        const { user, accessToken, refreshToken } = response.data.data;
        login({ accessToken, refreshToken }, user);
        navigate('/');
      }
    } catch (error: any) {
      if (error.response?.data?.require2FA) {
          setShowTwoFactor(true);
          setSubmitError(null);
          return;
      }
      setSubmitError(error.response?.data?.message || 'Login failed. Please check your credentials.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[80vh] px-4">
      <Card className="w-full max-w-md bg-[#f4f4f5] dark:bg-[#27272a] border border-zinc-200 dark:border-zinc-800 rounded-md">
        <CardHeader>
          <CardTitle className="text-center text-2xl text-[#18181b] dark:text-white">
              {showTwoFactor ? 'Two-Factor Authentication' : 'Welcome Back'}
          </CardTitle>
          <p className="text-center text-[#52525b] dark:text-[#a1a1aa] text-sm">
            {showTwoFactor ? 'Enter the code from your app' : 'Sign in to your account'}
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {submitError && (
              <div className="p-3 bg-red-50 text-red-600 text-sm rounded-md flex items-center">
                <X className="h-4 w-4 mr-2" />
                {submitError}
              </div>
            )}

            {!showTwoFactor ? (
                <>
                    <Input
                      label="Email"
                      type="email"
                      placeholder="john@example.com"
                      error={errors.email?.message}
                      className="bg-white dark:bg-[#18181b] border-[#d4d4d8] dark:border-[#3f3f46] text-[#18181b] dark:text-white placeholder:text-[#52525b] dark:placeholder:text-[#a1a1aa] focus:ring-0! focus:border-[#33E092]! transition-colors duration-200"
                      {...register('email')}
                    />

                    <div className="relative">
                      <Input
                        label="Password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="••••••••"
                        error={errors.password?.message}
                        className="bg-white dark:bg-[#18181b] border-[#d4d4d8] dark:border-[#3f3f46] text-[#18181b] dark:text-white placeholder:text-[#52525b] dark:placeholder:text-[#a1a1aa] focus:ring-0! focus:border-[#33E092]! transition-colors duration-200"
                        {...register('password')}
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-[34px] text-slate-400 hover:text-slate-600"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>

                    <div className="flex items-center justify-end">
                      <Link
                        to="/forgot-password"
                        className="text-sm text-indigo-600 hover:underline"
                      >
                        Forgot password?
                      </Link>
                    </div>
                </>
            ) : (
                <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                    <div className="space-y-2">
                        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-[#18181b] dark:text-white">
                            Authentication Code
                        </label>
                        <Input
                            value={twoFactorCode}
                            onChange={(e) => setTwoFactorCode(e.target.value)}
                            placeholder="000 000"
                            className="text-center tracking-widest font-mono text-lg bg-white dark:bg-[#18181b] border-[#d4d4d8] dark:border-[#3f3f46] text-[#18181b] dark:text-white placeholder:text-[#52525b] dark:placeholder:text-[#a1a1aa] focus:ring-0! focus:border-[#33E092]! transition-colors duration-200"
                            autoFocus
                        />
                    </div>
                </div>
            )}

            <Button
              type="submit"
              className="w-full bg-[#33E092] hover:bg-[#16a34a] text-[#18181b]"
              isLoading={isSubmitting}
              disabled={isSubmitting}
            >
              {showTwoFactor ? 'Verify' : 'Sign In'}
            </Button>

            {!showTwoFactor && (
                <p className="text-center text-sm text-[#52525b] dark:text-[#a1a1aa] mt-4">
                  Don't have an account?{' '}
                  <Link to="/signup" className="text-[#33E092] font-medium hover:underline hover:text-[#16a34a]">
                    Sign up
                  </Link>
                </p>
            )}
            
            {showTwoFactor && (
                <button 
                    type="button" 
                    onClick={() => { setShowTwoFactor(false); setTwoFactorCode(''); }}
                    className="w-full text-sm text-slate-500 hover:text-indigo-600 mt-2"
                >
                    Back to Login
                </button>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
