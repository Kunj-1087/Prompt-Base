import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { Button } from '../ui/Button';

export const LanguageSelector = () => {
  const { t, i18n } = useTranslation();

  const languages = [
      { code: 'en', label: 'English' },
      { code: 'es', label: 'Español' },
      { code: 'ar', label: 'العربية' },
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-9 w-9 text-slate-300 hover:text-white hover:bg-slate-800" aria-label={t('common.language')}>
          <Globe className="h-[1.2rem] w-[1.2rem]" aria-hidden="true" />
          <span className="sr-only">{t('common.language')}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
          {languages.map((lang) => (
            <DropdownMenuItem 
                key={lang.code} 
                onClick={() => i18n.changeLanguage(lang.code)}
                className={i18n.language.startsWith(lang.code) ? 'bg-slate-800' : ''}
            >
              {lang.label}
            </DropdownMenuItem>
          ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
