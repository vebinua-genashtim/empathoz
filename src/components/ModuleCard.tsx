import React from 'react';
import * as Icons from 'lucide-react';
import { HRModule } from '../types';

interface ModuleCardProps {
  module: HRModule;
  onClick: () => void;
  isEnabled: boolean;
  onToggleEnabled: (id: string) => void;
}

const ModuleCard: React.FC<ModuleCardProps> = ({ module, onClick, isEnabled, onToggleEnabled }) => {
  const Icon = Icons[module.icon as keyof typeof Icons] as React.ComponentType<any>;
  
  const getCategoryGradient = (category: string) => {
    switch (category) {
      case 'recruitment':
        return 'from-purple-500 to-pink-500';
      case 'learning':
        return 'from-blue-500 to-cyan-500';
      case 'engagement':
        return 'from-green-500 to-emerald-500';
      case 'database':
        return 'from-indigo-500 to-purple-500';
      case 'communication':
        return 'from-orange-500 to-red-500';
      default:
        return 'from-gray-500 to-gray-600';
    }
  };

  const handleToggleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleEnabled(module.id);
  };

  return (
    <div 
      onClick={onClick}
      className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg hover:border-blue-200 transition-all duration-300 cursor-pointer group"
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${getCategoryGradient(module.category)} flex items-center justify-center group-hover:scale-110 transition-transform duration-200`}>
          {Icon && <Icon className="w-6 h-6 text-white" />}
        </div>
        <label className="flex items-center cursor-pointer" onClick={handleToggleClick}>
          <input
            type="checkbox"
            checked={isEnabled}
            onChange={() => onToggleEnabled(module.id)}
            className="sr-only"
          />
          <div className={`relative w-11 h-6 rounded-full transition-colors ${
            isEnabled ? 'bg-blue-600' : 'bg-gray-300'
          }`}>
            <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
              isEnabled ? 'translate-x-5' : 'translate-x-0'
            }`}></div>
          </div>
        </label>
      </div>

      <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-700 transition-colors">
        {module.name}
      </h3>
      
      <p className="text-sm text-gray-600 mb-4 line-clamp-2">
        {module.description}
      </p>

      <div className="flex items-center justify-between text-xs text-gray-500">
        <span>Last updated: {module.lastUpdated}</span>
        <div className="flex items-center gap-1">
          <div className={`w-2 h-2 rounded-full ${isEnabled ? 'bg-green-400' : 'bg-gray-400'}`}></div>
          <span>{isEnabled ? 'Enabled' : 'Disabled'}</span>
        </div>
      </div>
    </div>
  );
};

export default ModuleCard;