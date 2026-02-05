import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { authService } from '../../services/authService';
import { Button } from '../ui/Button';
import { Input } from '../ui/input';
import { Shield, Smartphone, CheckCircle, AlertTriangle, Copy } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const TwoFactorSettings = () => {
  const { user, updateUser } = useAuth(); // Assuming updateUser updates local context
  const [step, setStep] = useState<'intro' | 'setup' | 'verify' | 'success'>('intro');
  const [secretData, setSecretData] = useState<{ secret: string; qrCode: string } | null>(null);
  const [backupCodes, setBackupCodes] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const { register: registerVerify, handleSubmit: handleSubmitVerify, formState: { errors: errorsVerify } } = useForm<{ token: string }>();
  const { register: registerDisable, handleSubmit: handleSubmitDisable, reset: resetDisable } = useForm<{ token: string }>();

  // Use optional chaining for twoFactorEnabled as it's optional in updated type
  const is2FAEnabled = user?.twoFactorEnabled;

  const startSetup = async () => {
      try {
          setIsLoading(true);
          const data = await authService.setup2FA();
          setSecretData(data);
          setStep('setup');
      } catch (error) {
          alert('Failed to start setup');
      } finally {
          setIsLoading(false);
      }
  };

  const verifySetup = async (data: { token: string }) => {
      try {
          setIsLoading(true);
          const res = await authService.verify2FASetup(data.token);
          setBackupCodes(res.data.backupCodes);
          setStep('success');
          // Update context
          if (user) {
             updateUser({ ...user, twoFactorEnabled: true });
          }
      } catch (error: any) {
          alert(error.response?.data?.message || 'Verification failed');
      } finally {
          setIsLoading(false);
      }
  };

  const disable2FA = async (data: { token: string }) => {
      if (!confirm('Disable 2FA? Your account will be less secure.')) return;
      try {
          setIsLoading(true);
          await authService.disable2FA(data.token);
          alert('2FA Disabled');
          resetDisable();
          if (user) {
              updateUser({ ...user, twoFactorEnabled: false });
          }
      } catch (error: any) {
          alert(error.response?.data?.message || 'Failed to disable 2FA');
      } finally {
          setIsLoading(false);
      }
  };

  if (is2FAEnabled && step !== 'success') {
      return (
          <div className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
                  <div className="flex items-center text-emerald-400">
                      <CheckCircle className="w-5 h-5 mr-3 shrink-0" />
                      <div>
                          <p className="font-medium">Two-Factor Authentication is Enabled</p>
                          <p className="text-sm text-emerald-400/70">Your account is secured with 2FA.</p>
                      </div>
                  </div>
              </div>

              <div className="border-t border-slate-800 pt-6">
                  <h4 className="text-white font-medium mb-4">Disable 2FA</h4>
                  <p className="text-slate-400 text-sm mb-4">Enter a code from your authenticator app to disable 2FA.</p>
                  <form onSubmit={handleSubmitDisable(disable2FA)} className="flex gap-4 max-w-sm">
                      <Input 
                          placeholder="000 000" 
                          {...registerDisable('token', { required: true, minLength: 6 })} 
                          className="flex-1"
                      />
                      <Button type="submit" variant="danger" isLoading={isLoading}>
                          Disable
                      </Button>
                  </form>
              </div>
          </div>
      );
  }

  return (
    <div className="space-y-6">
        <div>
            <h3 className="text-xl font-semibold text-white mb-2 flex items-center">
                <Shield className="w-5 h-5 mr-2 text-indigo-400" />
                Two-Factor Authentication (2FA)
            </h3>
            <p className="text-slate-400 mb-6">Add an extra layer of security to your account.</p>
        </div>

        {step === 'intro' && (
            <div className="bg-slate-800/30 rounded-lg p-6 border border-slate-700">
                <div className="flex items-start mb-6">
                    <div className="bg-indigo-500/10 p-3 rounded-lg mr-4">
                        <Smartphone className="w-6 h-6 text-indigo-400" />
                    </div>
                    <div>
                        <h4 className="text-white font-medium mb-2">Authenticator App</h4>
                        <p className="text-slate-400 text-sm">Use an app like Google Authenticator or Authy to generate verification codes.</p>
                    </div>
                </div>
                <Button onClick={startSetup} isLoading={isLoading}>
                    Enable 2FA
                </Button>
            </div>
        )}

        {step === 'setup' && secretData && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                        <h4 className="text-white font-medium">1. Scan QR Code</h4>
                        <p className="text-slate-400 text-sm">Open your authenticator app and scan this QR code.</p>
                        <div className="bg-white p-4 rounded-lg inline-block">
                            <img src={secretData.qrCode} alt="2FA QR Code" className="w-48 h-48" />
                        </div>
                    </div>
                    <div className="space-y-4">
                        <h4 className="text-white font-medium">Or Enter Code Manually</h4>
                        <p className="text-slate-400 text-sm">If you can't scan the code, enter this secret key into your app.</p>
                        <div className="flex items-center gap-2">
                            <code className="bg-slate-900 px-3 py-2 rounded text-indigo-300 font-mono text-sm block flex-1 break-all border border-slate-700">
                                {secretData.secret}
                            </code>
                            <Button size="sm" variant="ghost" onClick={() => navigator.clipboard.writeText(secretData.secret)}>
                                <Copy className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                </div>

                <div className="border-t border-slate-800 pt-6">
                    <h4 className="text-white font-medium mb-4">2. Verify Setup</h4>
                    <p className="text-slate-400 text-sm mb-4">Enter the 6-digit code from your app to confirm setup.</p>
                    <form onSubmit={handleSubmitVerify(verifySetup)} className="max-w-xs space-y-4">
                        <Input 
                            placeholder="000 000" 
                            {...registerVerify('token', { required: 'Code is required', minLength: 6 })}
                            error={errorsVerify.token?.message}
                        />
                        <div className="flex gap-4">
                            <Button type="submit" isLoading={isLoading}>Verify & Enable</Button>
                            <Button type="button" variant="ghost" onClick={() => setStep('intro')}>Cancel</Button>
                        </div>
                    </form>
                </div>
            </div>
        )}

        {step === 'success' && (
             <div className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
                    <div className="flex items-center text-emerald-400">
                        <CheckCircle className="w-5 h-5 mr-3 shrink-0" />
                        <div>
                            <p className="font-medium">2FA Enabled Successfully!</p>
                        </div>
                    </div>
                </div>
                
                <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
                     <h4 className="text-white font-medium mb-2 flex items-center">
                         <AlertTriangle className="w-4 h-4 text-amber-500 mr-2" />
                         Save your Backup Codes
                     </h4>
                     <p className="text-slate-400 text-sm mb-4">
                         If you lose access to your device, these codes are the only way to recover your account. 
                         Save them somewhere safe. Each code can only be used once.
                     </p>
                     <div className="grid grid-cols-2 gap-2 mb-4">
                         {backupCodes.map((code, i) => (
                             <div key={i} className="bg-slate-950 border border-slate-800 p-2 rounded text-center font-mono text-slate-300 tracking-wider">
                                 {code}
                             </div>
                         ))}
                     </div>
                     <Button 
                        variant="outline" 
                        className="w-full"
                        onClick={() => {
                             const blob = new Blob([backupCodes.join('\n')], { type: 'text/plain' });
                             const url = URL.createObjectURL(blob);
                             const link = document.createElement('a');
                             link.href = url;
                             link.download = 'prompt-base-backup-codes.txt';
                             document.body.appendChild(link);
                             link.click();
                             document.body.removeChild(link);
                        }}
                    >
                         Download Codes
                     </Button>
                </div>
                
                <Button onClick={() => setStep('intro')} className="w-full">
                    Done
                </Button>
            </div>
        )}
    </div>
  );
};
