import React from 'react';
import { Palette, ChevronDown } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

const ThemeToggle: React.FC = () => {
  const { theme, setTheme } = useTheme();

  const themes = [
    { value: 'default', label: 'Default Theme', description: 'Standard design' },
    { value: 'high-contrast', label: 'High Contrast', description: 'Black & white for accessibility' },
    { value: 'accessible-view', label: 'Accessible View', description: 'Optimized for accessibility' }
  ];

  const currentTheme = themes.find(t => t.value === theme) || themes[0];

  const handleThemeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setTheme(e.target.value as 'default' | 'high-contrast' | 'pwd-friendly');
  };

  return (
    <div className="relative">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
        Theme
      </label>
      <div className="relative">
        <select
          value={theme}
          onChange={handleThemeChange}
          className="w-full appearance-none bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 pr-8 text-sm font-medium text-gray-700 dark:text-gray-200 hover:border-gray-400 dark:hover:border-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
          aria-label="Select theme"
        >
          {themes.map((themeOption) => (
            <option key={themeOption.value} value={themeOption.value}>
              {themeOption.label}
            </option>
          ))}
        </select>
        <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
          <ChevronDown className="w-4 h-4 text-gray-400" />
        </div>
      </div>
      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
        {currentTheme.description}
      </p>
    </div>
  );
};

export default ThemeToggle;