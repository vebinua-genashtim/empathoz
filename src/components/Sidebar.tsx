import React from 'react';
import { 
  Home, 
  Grid3X3, 
  Users, 
  Settings, 
  HelpCircle,
  ChevronRight,
  Building2,
  LogOut,
  Bell
} from 'lucide-react';
import { HRModule } from '../types';
import * as Icons from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import NotificationCenter from './NotificationCenter';
import { dataService } from '../services/dataService';
import { getActionsForModule, hasActions } from '../data/appActions';

interface SidebarProps {
  activeItem: string;
  onItemClick: (item: string) => void;
  hrModules: HRModule[];
}

const Sidebar: React.FC<SidebarProps> = ({ activeItem, onItemClick, hrModules }) => {
  const [expandedMenus, setExpandedMenus] = React.useState<{ [key: string]: boolean }>({});
  const [showNotifications, setShowNotifications] = React.useState(false);
  const [currentUser] = React.useState('HR Manager'); // In real app, this would come from auth context
  const [unreadCount, setUnreadCount] = React.useState(0);

  // Update unread count periodically
  React.useEffect(() => {
    const updateUnreadCount = () => {
      setUnreadCount(dataService.getUnreadNotificationCount(currentUser));
    };
    
    updateUnreadCount();
    const interval = setInterval(updateUnreadCount, 30000); // Update every 30 seconds
    
    return () => clearInterval(interval);
  }, [currentUser]);

  // Get the current active module to show relevant actions
  const activeModule = hrModules.find(module => module.id === activeItem);
  const activeAppActions = activeModule ? getActionsForModule(activeModule.id) : [];

  const toggleMenu = (menuId: string) => {
    setExpandedMenus(prev => ({
      ...prev,
      [menuId]: !prev[menuId]
    }));
  };

  const navigationItems = [
    { id: 'dashboard', name: 'Dashboard', icon: Home },
    { id: 'active-app-actions', name: 'Active App Actions', icon: Icons.Zap, isDynamic: true },
    { id: 'my-apps', name: 'My Apps', icon: Grid3X3 },
    { id: 'integration-flow', name: 'Integration Flow', icon: Building2 },
    { id: 'notifications-page', name: 'All Notifications', icon: Bell },
    { id: 'directory', name: 'Employee Directory', icon: Users },
    { id: 'settings', name: 'Settings', icon: Settings },
    { id: 'help', name: 'Help & Support', icon: HelpCircle },
  ];

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      // In a real app, this would clear authentication tokens and redirect
      console.log('Logging out...');
      // For demo purposes, we'll just reload the page
      window.location.reload();
    }
  };

  const enabledModules = hrModules.filter(module => module.isEnabled);

  // Auto-expand Active App Actions when there are actions to show
  React.useEffect(() => {
    if (activeAppActions.length > 0) {
      setExpandedMenus(prev => ({
        ...prev,
        'active-app-actions': true
      }));
    }
  }, [activeAppActions.length]);

  return (
    <div className="w-64 bg-white shadow-lg h-full flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
            <Building2 className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Empathoz</h1>
            <p className="text-xs text-gray-500">HR Management Platform</p>
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div className="px-6 py-4 border-b border-gray-200">
        <button
          onClick={() => setShowNotifications(true)}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all duration-200 text-gray-700 hover:text-gray-900 hover:bg-gray-50 relative"
        >
          <Bell className="w-5 h-5" />
          <span className="font-medium">Notifications</span>
          {unreadCount > 0 && (
            <span className="ml-auto bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <div className="space-y-2">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeItem === item.id;
            const hasDropdown = item.id === 'my-apps' || (item.isDynamic && activeAppActions.length > 0);
            
            return (
              <React.Fragment key={item.id}>
                {/* Skip rendering Active App Actions if no actions available */}
                {!(item.isDynamic && activeAppActions.length === 0) && (
                  <div>
                    <button
                      onClick={() => {
                        if (hasDropdown) {
                          toggleMenu(item.id);
                        } else if (!item.isDynamic) {
                          onItemClick(item.id);
                        }
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all duration-200 ${
                        isActive 
                          ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700' 
                          : 'text-gray-700 hover:text-gray-900'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="font-medium">{item.name}</span>
                      {hasDropdown && (
                        <ChevronRight className={`w-4 h-4 ml-auto transition-transform ${
                          expandedMenus[item.id] ? 'rotate-90' : ''
                        }`} />
                      )}
                    </button>
                  </div>
                )}
                
                {/* Active App Actions Dropdown */}
                {item.isDynamic && activeAppActions.length > 0 && expandedMenus[item.id] && (
                  <div className="ml-4 space-y-1">
                    <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      {activeModule?.name} Actions
                    </div>
                    {activeAppActions.map((action) => {
                      const ActionIcon = Icons[action.icon as keyof typeof Icons] as React.ComponentType<any>;
                      return (
                        <button
                          key={action.id}
                          onClick={() => onItemClick(action.route)}
                          className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg text-left transition-all duration-200 text-sm ${
                            activeItem === action.route || activeItem.startsWith(action.route)
                              ? 'bg-blue-100 text-blue-700'
                              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                          }`}
                          title={action.description}
                        >
                          {ActionIcon && <ActionIcon className="w-4 h-4" />}
                          <span>{action.name}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
                
                {/* My Apps Dropdown */}
                {item.id === 'my-apps' && expandedMenus[item.id] && (
                  <div className="ml-4 space-y-1">
                    {enabledModules.map((module) => {
                      const ModuleIcon = Icons[module.icon as keyof typeof Icons] as React.ComponentType<any>;
                      return (
                        <button
                          key={module.id}
                          onClick={() => onItemClick(module.id)}
                          className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg text-left transition-all duration-200 text-sm ${
                            activeItem === module.id
                              ? 'bg-blue-100 text-blue-700'
                              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                          }`}
                        >
                          {ModuleIcon && <ModuleIcon className="w-4 h-4" />}
                          <span>{module.name}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </nav>

      {/* User Profile */}
      <div className="p-4 border-t border-gray-200">
        <div className="mb-3">
          <ThemeToggle />
        </div>
        <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer">
          <div className="w-10 h-10 bg-gradient-to-br from-gray-400 to-gray-600 rounded-full flex items-center justify-center">
            <span className="text-sm font-medium text-white">JD</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">John Doe</p>
            <p className="text-xs text-gray-500 truncate">HR Manager</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full mt-3 flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all duration-200 text-gray-700 hover:text-red-600 hover:bg-red-50"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Logout</span>
        </button>
      </div>

      {/* Notification Center */}
      {showNotifications && (
        <NotificationCenter
          isOpen={showNotifications}
          onClose={() => setShowNotifications(false)}
          currentUser={currentUser}
        />
      )}
    </div>
  );
};

export default Sidebar;