import React from 'react';
import { WalletCards, LayoutDashboard, UserCircle, Sun, Moon, TrendingUp, Menu, Settings, Eye, EyeOff, Globe } from 'lucide-react';
import { motion } from 'framer-motion';
import { Container } from './layout/Container';
import { useProfile } from '../hooks/useProfile';
import { useLanguage } from '../contexts/LanguageContext';
import { Profile } from '../types/finance';

interface HeaderProps {
  onViewChange: (view: 'dashboard' | 'profile' | 'analysis' | 'settings') => void;
  currentView: 'dashboard' | 'profile' | 'analysis' | 'settings';
  theme: string;
  onThemeToggle: () => void;
  onUpdateProfile: (updates: Partial<Profile>) => void;
}

export function Header({ onViewChange, currentView, theme, onThemeToggle, onUpdateProfile }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const { profile } = useProfile();
  const { language, setLanguage, t } = useLanguage();

  const toggleHideAmounts = () => {
    onUpdateProfile({
      settings: {
        ...profile.settings,
        hideAmounts: !profile.settings?.hideAmounts
      }
    });
  };

  const toggleLanguage = () => {
    setLanguage(language === 'de' ? 'en' : 'de');
  };

  return (
    <header className="bg-white/80 backdrop-blur-lg dark:bg-gray-800/80 text-gray-800 dark:text-white p-4 sticky top-0 z-50 shadow-lg">
      <Container>
        <div className="flex items-center justify-between">
          <motion.div 
            className="flex items-center gap-2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <WalletCards className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
            <h1 className="text-2xl font-bold">{t('app.title')}</h1>
          </motion.div>

          <div className="lg:hidden flex items-center gap-2">
            <button
              onClick={toggleLanguage}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
              aria-label="Toggle language"
            >
              <Globe className="h-6 w-6" />
            </button>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>

          <div className="hidden lg:flex items-center gap-4">
            <nav className="flex gap-4">
              <NavButton
                icon={<LayoutDashboard className="h-5 w-5" />}
                label={t('nav.dashboard')}
                isActive={currentView === 'dashboard'}
                onClick={() => onViewChange('dashboard')}
              />
              <NavButton
                icon={<TrendingUp className="h-5 w-5" />}
                label={t('nav.analysis')}
                isActive={currentView === 'analysis'}
                onClick={() => onViewChange('analysis')}
              />
              <NavButton
                icon={<UserCircle className="h-5 w-5" />}
                label={t('nav.profile')}
                isActive={currentView === 'profile'}
                onClick={() => onViewChange('profile')}
              />
              <NavButton
                icon={<Settings className="h-5 w-5" />}
                label={t('nav.settings')}
                isActive={currentView === 'settings'}
                onClick={() => onViewChange('settings')}
              />
            </nav>

            <div className="flex items-center gap-4 pl-4 border-l border-gray-200 dark:border-gray-700">
              {/* Language Toggle */}
              <button
                onClick={toggleLanguage}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                aria-label="Toggle language"
              >
                <Globe className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              </button>

              {/* Hide Amounts Toggle */}
              <button
                onClick={toggleHideAmounts}
                className="relative inline-flex items-center gap-2"
                aria-pressed={profile.settings?.hideAmounts}
              >
                {profile.settings?.hideAmounts ? (
                  <EyeOff className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                ) : (
                  <Eye className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                )}
                <div
                  className={`w-9 h-5 flex items-center rounded-full p-1 duration-300 ease-in-out ${
                    profile.settings?.hideAmounts ? 'bg-indigo-600' : 'bg-gray-200 dark:bg-gray-700'
                  }`}
                >
                  <div
                    className={`bg-white w-4 h-4 rounded-full shadow-md transform duration-300 ease-in-out ${
                      profile.settings?.hideAmounts ? 'translate-x-4' : 'translate-x-0'
                    }`}
                  />
                </div>
              </button>

              {/* Theme Toggle */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onThemeToggle}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                aria-label="Toggle dark mode"
              >
                {theme === 'dark' ? (
                  <Sun className="h-5 w-5 text-yellow-500" />
                ) : (
                  <Moon className="h-5 w-5 text-gray-600" />
                )}
              </motion.button>
            </div>
          </div>
        </div>

        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="lg:hidden mt-4 space-y-2"
          >
            <MobileNavButton
              icon={<LayoutDashboard className="h-5 w-5" />}
              label={t('nav.dashboard')}
              isActive={currentView === 'dashboard'}
              onClick={() => {
                onViewChange('dashboard');
                setIsMenuOpen(false);
              }}
            />
            <MobileNavButton
              icon={<TrendingUp className="h-5 w-5" />}
              label={t('nav.analysis')}
              isActive={currentView === 'analysis'}
              onClick={() => {
                onViewChange('analysis');
                setIsMenuOpen(false);
              }}
            />
            <MobileNavButton
              icon={<UserCircle className="h-5 w-5" />}
              label={t('nav.profile')}
              isActive={currentView === 'profile'}
              onClick={() => {
                onViewChange('profile');
                setIsMenuOpen(false);
              }}
            />
            <MobileNavButton
              icon={<Settings className="h-5 w-5" />}
              label={t('nav.settings')}
              isActive={currentView === 'settings'}
              onClick={() => {
                onViewChange('settings');
                setIsMenuOpen(false);
              }}
            />

            <div className="flex items-center justify-between px-4 py-2">
              <div className="flex items-center gap-2">
                <button
                  onClick={toggleHideAmounts}
                  className="flex items-center gap-2"
                >
                  {profile.settings?.hideAmounts ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                  <span>{t(profile.settings?.hideAmounts ? 'amounts.show' : 'amounts.hide')}</span>
                </button>
              </div>
              <button
                onClick={onThemeToggle}
                className="flex items-center gap-2"
              >
                {theme === 'dark' ? (
                  <>
                    <Sun className="h-5 w-5 text-yellow-500" />
                    <span>{t('theme.light')}</span>
                  </>
                ) : (
                  <>
                    <Moon className="h-5 w-5 text-gray-600" />
                    <span>{t('theme.dark')}</span>
                  </>
                )}
              </button>
            </div>
          </motion.div>
        )}
      </Container>
    </header>
  );
}

interface NavButtonProps {
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  onClick: () => void;
}

function NavButton({ icon, label, isActive, onClick }: NavButtonProps) {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`flex items-center gap-2 px-6 py-2 rounded-full transition-all duration-200 ${
        isActive
          ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20'
          : 'hover:bg-indigo-50 dark:hover:bg-gray-700'
      }`}
    >
      {icon}
      <span className="font-medium">{label}</span>
    </motion.button>
  );
}

function MobileNavButton({ icon, label, isActive, onClick }: NavButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
        isActive
          ? 'bg-indigo-600 text-white'
          : 'hover:bg-gray-100 dark:hover:bg-gray-700'
      }`}
    >
      {icon}
      <span className="font-medium">{label}</span>
    </button>
  );
}