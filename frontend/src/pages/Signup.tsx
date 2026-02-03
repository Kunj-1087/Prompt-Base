import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Eye, EyeOff, Check, X } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import axios from 'axios';
import config from '../config/env';

const signupSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Must contain an uppercase letter')
    .regex(/[0-9]/, 'Must contain a number')
    .regex(/[^A-Za-z0-9]/, 'Must contain a special character'),
  confirmPassword: z.string(),
  terms: z.boolean().refine((val) => val === true, 'You must accept the terms'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type SignupFormValues = z.infer<typeof signupSchema>;

export const Signup = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isEmailAvailable, setIsEmailAvailable] = useState<boolean | null>(null);
  const [isCheckingEmail, setIsCheckingEmail] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    trigger,
    getValues
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    mode: 'onChange'
  });

  const checkEmailAvailability = async () => {
    const email = getValues('email');
    const result = await trigger('email');
    
    if (result && email) {
      setIsCheckingEmail(true);
      try {
        const response = await axios.post(`${config.API_URL}/auth/check-email`, { email });
        setIsEmailAvailable(response.data.data.available);
      } catch (error) {
        setIsEmailAvailable(null); // Assume available or error on side of caution
      } finally {
        setIsCheckingEmail(false);
      }
    } else {
      setIsEmailAvailable(null);
    }
  };

  const onSubmit = async (data: SignupFormValues) => {
    if (isEmailAvailable === false) return;
    
    setSubmitError(null);
    try {
      await axios.post(`${config.API_URL}/auth/signup`, {
        name: data.name,
        email: data.email,
        password: data.password
      });
      setIsSuccess(true);
      // Optional: Auto redirect after some time
      setTimeout(() => navigate('/login'), 5000);
    } catch (error: any) {
      setSubmitError(error.response?.data?.message || 'Registration failed. Please try again.');
    }
  };

  if (isSuccess) {
    return (
      <div className="flex items-center justify-center min-h-[80vh] px-4">
        <Card className="w-full max-w-md text-center p-8">
          <div className="flex justify-center mb-4">
            <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center">
              <Check className="h-8 w-8 text-green-600" />
            </div>
          </div>
          <h2 className="text-2xl font-bold mb-2">Registration Successful!</h2>
          <p className="text-slate-600 mb-6">
            We've sent a verification email to your inbox. Please check it to activate your account.
          </p>
          <Button onClick={() => navigate('/login')}>
            Go to Login
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-[80vh] px-4 py-8">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center text-2xl">Create an Account</CardTitle>
          <p className="text-center text-slate-500 text-sm">
            Join Prompt-Base today
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

            <Input
              label="Full Name"
              placeholder="John Doe"
              error={errors.name?.message}
              {...register('name')}
            />

            <div className="space-y-1">
              <Input
                label="Email"
                type="email"
                placeholder="john@example.com"
                error={errors.email?.message}
                {...register('email', {
                  onBlur: checkEmailAvailability
                })}
              />
              {isCheckingEmail && <p className="text-xs text-blue-500">Checking availability...</p>}
              {!errors.email && isEmailAvailable === false && (
                <p className="text-xs text-red-500">Email is already taken</p>
              )}
              {!errors.email && isEmailAvailable === true && (
                <p className="text-xs text-green-600">Email is available</p>
              )}
            </div>

            <div className="relative">
              <Input
                label="Password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                error={errors.password?.message}
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

            <Input
              label="Confirm Password"
              type="password"
              placeholder="••••••••"
              error={errors.confirmPassword?.message}
              {...register('confirmPassword')}
            />

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="terms"
                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                {...register('terms')}
              />
              <label htmlFor="terms" className="text-sm text-slate-600">
                I agree to the{' '}
                <Link to="/terms" className="text-indigo-600 hover:underline">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link to="/privacy" className="text-indigo-600 hover:underline">
                  Privacy Policy
                </Link>
              </label>
            </div>
            {errors.terms && (
              <p className="text-xs text-red-500 mt-1">{errors.terms.message}</p>
            )}

            <Button
              type="submit"
              className="w-full"
              isLoading={isSubmitting}
              disabled={isSubmitting || isEmailAvailable === false}
            >
              Create Account
            </Button>

            <p className="text-center text-sm text-slate-500 mt-4">
              Already have an account?{' '}
              <Link to="/login" className="text-indigo-600 font-medium hover:underline">
                Sign in
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
