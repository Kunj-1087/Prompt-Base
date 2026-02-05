import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Eye, EyeOff, Check, X } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import api from '../services/api';

const resetPasswordSchema = z.object({
  password: z.string().min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Must contain an uppercase letter')
    .regex(/[0-9]/, 'Must contain a number')
    .regex(/[^A-Za-z0-9]/, 'Must contain a special character'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

export const ResetPassword = () => {
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');
    const navigate = useNavigate();
    
    const [showPassword, setShowPassword] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<ResetPasswordFormValues>({
        resolver: zodResolver(resetPasswordSchema),
    });

    const onSubmit = async (data: ResetPasswordFormValues) => {
        setSubmitError(null);
        if (!token) {
            setSubmitError("Invalid or missing reset token.");
            return;
        }

        try {
            await api.post('/auth/reset-password', {
                token,
                password: data.password
            });
            setIsSuccess(true);
        } catch (error: any) {
            setSubmitError(error.response?.data?.message || 'Failed to reset password.');
        }
    };

    if (!token) {
        return (
             <div className="flex items-center justify-center min-h-[80vh] px-4">
                <Card className="w-full max-w-md text-center p-8">
                    <div className="flex justify-center mb-4">
                        <div className="h-16 w-16 bg-red-100 rounded-full flex items-center justify-center">
                            <X className="h-8 w-8 text-red-600" />
                        </div>
                    </div>
                    <h2 className="text-xl font-bold mb-2">Invalid Link</h2>
                    <p className="text-slate-600 mb-6">
                        This password reset link is invalid or has expired.
                    </p>
                    <Button className="w-full" onClick={() => navigate('/forgot-password')}>
                        Request New Link
                    </Button>
                </Card>
            </div>
        )
    }

    if (isSuccess) {
        return (
             <div className="flex items-center justify-center min-h-[80vh] px-4">
                <Card className="w-full max-w-md text-center p-8">
                    <div className="flex justify-center mb-4">
                        <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center">
                            <Check className="h-8 w-8 text-green-600" />
                        </div>
                    </div>
                    <h2 className="text-2xl font-bold mb-2">Password Reset!</h2>
                    <p className="text-slate-600 mb-6">
                        Your password has been successfully updated.
                    </p>
                    <Button onClick={() => navigate('/login')}>
                        Back to Login
                    </Button>
                </Card>
            </div>
        )
    }

  return (
    <div className="flex items-center justify-center min-h-[80vh] px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center text-2xl">Set New Password</CardTitle>
          <p className="text-center text-slate-500 text-sm">
            Enter your new secure password
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

            <div className="relative">
              <Input
                label="New Password"
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
              label="Confirm New Password"
              type="password"
              placeholder="••••••••"
              error={errors.confirmPassword?.message}
              {...register('confirmPassword')}
            />

            <Button
              type="submit"
              className="w-full"
              isLoading={isSubmitting}
              disabled={isSubmitting}
            >
              Reset Password
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
