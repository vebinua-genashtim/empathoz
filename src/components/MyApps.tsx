import React, { useState } from 'react';
import { Search, Filter, Grid, List } from 'lucide-react';
import { HRModule } from '../types';
import ModuleCard from './ModuleCard';

interface MyAppsProps {
  hrModules: HRModule[];
  onToggleModuleVisibility: (moduleId: string) => void;
}

const MyApps: React.FC<MyAppsProps> = ({ hrModules, onToggleModuleVisibility }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const categories = [
    { id: 'all', name: 'All Apps', count: hrModules.length },
    { id: 'recruitment', name: 'Recruitment', count: hrModules.filter(m => m.category === 'recruitment').length },
    { id: 'learning', name: 'Learning', count: hrModules.filter(m => m.category === 'learning').length },
    { id: 'engagement', name: 'Engagement', count: hrModules.filter(m => m.category === 'engagement').length },
    { id: 'database', name: 'Database', count: hrModules.filter(m => m.category === 'database').length },
    { id: 'communication', name: 'Communication', count: hrModules.filter(m => m.category === 'communication').length }
  ];

  const filteredModules = hrModules.filter(module => {
    const matchesSearch = module.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         module.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || module.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleModuleClick = (moduleId: string) => {
    console.log(`Opening module: ${moduleId}`);
    // This would handle routing to the specific module
  };

  return (
    <div className="flex-1 bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-8 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">My Apps</h1>
            <p className="text-gray-600 mt-1">Access all your HR tools and systems in one place</p>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search apps..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-80 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            {/* View Toggle */}
            <div className="flex items-center bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === 'grid' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500'
                }`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === 'list' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500'
                }`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-8">
        {/* Category Filter Tabs */}
        <div className="mb-6">
          <div className="flex flex-wrap gap-2 mb-4">
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                  selectedCategory === category.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
              >
                <span>{category.name}</span>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  selectedCategory === category.id
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  {category.count}
                </span>
              </button>
            ))}
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                {selectedCategory === 'all' ? 'All Applications' : 
                 categories.find(c => c.id === selectedCategory)?.name + ' Applications'}
              </h2>
              <p className="text-sm text-gray-600">
                {filteredModules.length} application{filteredModules.length !== 1 ? 's' : ''} found
              </p>
            </div>
          </div>
        </div>

        {/* Apps Display */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredModules.map(module => (
              <ModuleCard
                key={module.id}
                module={module}
                onClick={() => handleModuleClick(module.id)}
                isEnabled={module.isEnabled || false}
                onToggleEnabled={onToggleModuleVisibility}
              />
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredModules.map(module => (
              <div key={module.id} className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                    <span className="text-white font-semibold">{module.name.charAt(0)}</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{module.name}</h3>
                    <p className="text-sm text-gray-600">{module.description}</p>
                  </div>
                  <div className="text-right">
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={module.isEnabled || false}
                        onChange={() => onToggleModuleVisibility(module.id)}
                        className="sr-only"
                      />
                      <div className={`relative w-11 h-6 rounded-full transition-colors ${
                        module.isEnabled ? 'bg-blue-600' : 'bg-gray-300'
                      }`}>
                        <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                          module.isEnabled ? 'translate-x-5' : 'translate-x-0'
                        }`}></div>
                      </div>
                    </label>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {filteredModules.length === 0 && (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No applications found</h3>
            <p className="text-gray-600">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyApps;