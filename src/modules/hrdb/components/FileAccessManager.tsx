import React, { useState, useEffect } from 'react';
import { X, Save, Shield, Eye, EyeOff, Users, FileText, Award, Briefcase, User, Settings } from 'lucide-react';
import { FileAccessConfig, UserRole, dataService } from '../../../services/dataService';

interface FileAccessManagerProps {
  isOpen: boolean;
  onClose: () => void;
  onConfigChange: () => void;
}

const FileAccessManager: React.FC<FileAccessManagerProps> = ({
  isOpen,
  onClose,
  onConfigChange
}) => {
  const [fileAccessConfig, setFileAccessConfig] = useState<FileAccessConfig[]>([]);
  const [userRoles, setUserRoles] = useState<UserRole[]>([]);
  const [currentUser, setCurrentUser] = useState({
    id: 'current-user',
    name: 'HR Manager',
    role: 'hr_specialist',
    roleLevel: 4
  });
  const [activeTab, setActiveTab] = useState<'access' | 'roles' | 'simulation'>('access');
  const [simulationUser, setSimulationUser] = useState({
    id: 'current-user',
    name: 'HR Manager',
    role: 'hr_specialist',
    roleLevel: 4
  });

  // Mock data to replace dataService calls
  const mockFileAccessConfig: FileAccessConfig[] = [
    {
      fileType: 'cv',
      displayName: 'CV/Resume',
      description: 'Primary resume document',
      requiredRoleLevel: 4,
      isEnabled: true,
      allowedRoles: ['hr_specialist', 'admin', 'super_admin']
    },
    {
      fileType: 'certifications',
      displayName: 'Certifications',
      description: 'Professional certifications',
      requiredRoleLevel: 4,
      isEnabled: true,
      allowedRoles: ['hr_specialist', 'admin', 'super_admin']
    },
    {
      fileType: 'portfolio',
      displayName: 'Portfolio',
      description: 'Work samples and projects',
      requiredRoleLevel: 3,
      isEnabled: true,
      allowedRoles: ['manager', 'hr_specialist', 'admin', 'super_admin']
    },
    {
      fileType: 'profilePhoto',
      displayName: 'Profile Photo',
      description: 'Employee profile picture',
      requiredRoleLevel: 1,
      isEnabled: true,
      allowedRoles: ['employee', 'team_lead', 'manager', 'hr_specialist', 'admin', 'super_admin']
    }
  ];

  const mockUserRoles: UserRole[] = [
    {
      id: 'employee',
      name: 'Employee',
      level: 1,
      permissions: ['view_own_profile', 'edit_own_profile']
    },
    {
      id: 'team_lead',
      name: 'Team Lead',
      level: 2,
      permissions: ['view_own_profile', 'edit_own_profile', 'view_team_profiles']
    },
    {
      id: 'manager',
      name: 'Manager',
      level: 3,
      permissions: ['view_own_profile', 'edit_own_profile', 'view_team_profiles', 'manage_team', 'view_portfolios']
    },
    {
      id: 'hr_specialist',
      name: 'HR Specialist',
      level: 4,
      permissions: ['view_own_profile', 'edit_own_profile', 'view_team_profiles', 'manage_team', 'view_portfolios', 'view_all_documents', 'manage_employees']
    },
    {
      id: 'admin',
      name: 'Admin',
      level: 5,
      permissions: ['view_own_profile', 'edit_own_profile', 'view_team_profiles', 'manage_team', 'view_portfolios', 'view_all_documents', 'manage_employees', 'system_admin']
    },
    {
      id: 'super_admin',
      name: 'Super Admin',
      level: 6,
      permissions: ['view_own_profile', 'edit_own_profile', 'view_team_profiles', 'manage_team', 'view_portfolios', 'view_all_documents', 'manage_employees', 'system_admin', 'full_control']
    }
  ];

  useEffect(() => {
    if (isOpen) {
      setFileAccessConfig([...mockFileAccessConfig]);
      setUserRoles([...mockUserRoles]);
      
      // Find HR Manager role or fallback to first available role
      const hrRole = mockUserRoles.find(r => r.id === 'hr_specialist') || mockUserRoles[0];
      if (hrRole) {
        const mockUser = {
          id: 'current-user',
          name: 'HR Manager',
          role: hrRole.id,
          roleLevel: hrRole.level
        };
        setCurrentUser(mockUser);
        setSimulationUser(mockUser);
      }
    }
  }, [isOpen]);

  const handleSave = () => {
    // In a real app, would save to dataService
    console.log('Saving file access config:', fileAccessConfig);
    onConfigChange();
    onClose();
  };

  const handleConfigChange = (fileType: string, field: keyof FileAccessConfig, value: any) => {
    setFileAccessConfig(prev =>
      prev.map(config =>
        config.fileType === fileType
          ? { ...config, [field]: value }
          : config
      )
    );
  };

  const handleRoleToggle = (fileType: string, roleId: string) => {
    setFileAccessConfig(prev =>
      prev.map(config => {
        if (config.fileType === fileType) {
          const allowedRoles = config.allowedRoles.includes(roleId)
            ? config.allowedRoles.filter(r => r !== roleId)
            : [...config.allowedRoles, roleId];
          
          // Update required role level based on lowest allowed role
          const allowedRoleLevels = allowedRoles
            .map(roleId => userRoles.find(r => r.id === roleId)?.level || 0)
            .filter(level => level > 0);
          
          const requiredRoleLevel = allowedRoleLevels.length > 0 ? Math.min(...allowedRoleLevels) : 1;
          
          return {
            ...config,
            allowedRoles,
            requiredRoleLevel
          };
        }
        return config;
      })
    );
  };

  const getFileIcon = (fileType: string) => {
    switch (fileType) {
      case 'cv': return <FileText className="w-5 h-5" />;
      case 'certifications': return <Award className="w-5 h-5" />;
      case 'portfolio': return <Briefcase className="w-5 h-5" />;
      case 'profilePhoto': return <User className="w-5 h-5" />;
      default: return <FileText className="w-5 h-5" />;
    }
  };

  const getFileColor = (fileType: string) => {
    switch (fileType) {
      case 'cv': return 'text-blue-600 bg-blue-100';
      case 'certifications': return 'text-green-600 bg-green-100';
      case 'portfolio': return 'text-purple-600 bg-purple-100';
      case 'profilePhoto': return 'text-orange-600 bg-orange-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getRoleColor = (roleLevel: number) => {
    if (roleLevel >= 5) return 'bg-red-100 text-red-800';
    if (roleLevel >= 4) return 'bg-orange-100 text-orange-800';
    if (roleLevel >= 3) return 'bg-yellow-100 text-yellow-800';
    if (roleLevel >= 2) return 'bg-blue-100 text-blue-800';
    return 'bg-gray-100 text-gray-800';
  };

  const canUserAccess = (config: FileAccessConfig, user: typeof currentUser) => {
    return config.isEnabled && 
           user.roleLevel >= config.requiredRoleLevel && 
           config.allowedRoles.includes(user.role);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-6xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-blue-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">File Access Control Manager</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Current User Info */}
        <div className="bg-blue-50 p-4 rounded-lg mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white font-semibold text-sm">
                {currentUser.name.split(' ').map(n => n.charAt(0)).join('')}
              </span>
            </div>
            <div>
              <p className="font-medium text-blue-900">Current User: {currentUser.name}</p>
              <p className="text-sm text-blue-700">
                Role: {userRoles.find(r => r.id === currentUser.role)?.name} (Level {currentUser.roleLevel})
              </p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="flex space-x-8">
            {[
              { id: 'access', label: 'File Access Control', icon: Shield },
              { id: 'roles', label: 'Role Hierarchy', icon: Users },
              { id: 'simulation', label: 'Access Simulation', icon: Eye }
            ].map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* File Access Control Tab */}
        {activeTab === 'access' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Configure File Access Permissions</h3>
              <p className="text-sm text-gray-600 mb-6">
                Control which user roles can view and manage different types of employee files. Higher role levels automatically inherit permissions from lower levels.
              </p>
            </div>

            <div className="space-y-4">
              {fileAccessConfig.map(config => (
                <div key={config.fileType} className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${getFileColor(config.fileType)}`}>
                        {getFileIcon(config.fileType)}
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900">{config.displayName}</h4>
                        <p className="text-sm text-gray-600">{config.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <label className="flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={config.isEnabled}
                          onChange={(e) => handleConfigChange(config.fileType, 'isEnabled', e.target.checked)}
                          className="sr-only"
                        />
                        <div className={`relative w-11 h-6 rounded-full transition-colors ${
                          config.isEnabled ? 'bg-blue-600' : 'bg-gray-300'
                        }`}>
                          <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                            config.isEnabled ? 'translate-x-5' : 'translate-x-0'
                          }`}></div>
                        </div>
                      </label>
                      <span className="text-sm font-medium text-gray-700">
                        {config.isEnabled ? 'Enabled' : 'Disabled'}
                      </span>
                    </div>
                  </div>

                  {config.isEnabled && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                          Allowed Roles (Level {config.requiredRoleLevel}+)
                        </label>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                          {userRoles.map(role => {
                            const isAllowed = config.allowedRoles.includes(role.id);
                            const meetsLevel = role.level >= config.requiredRoleLevel;
                            
                            return (
                              <label key={role.id} className="flex items-center">
                                <input
                                  type="checkbox"
                                  checked={isAllowed}
                                  onChange={() => handleRoleToggle(config.fileType, role.id)}
                                  disabled={!meetsLevel}
                                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 disabled:opacity-50"
                                />
                                <span className={`ml-2 text-sm ${
                                  meetsLevel ? 'text-gray-700' : 'text-gray-400'
                                }`}>
                                  {role.name}
                                  <span className={`ml-1 px-1 py-0.5 rounded text-xs ${getRoleColor(role.level)}`}>
                                    L{role.level}
                                  </span>
                                </span>
                              </label>
                            );
                          })}
                        </div>
                      </div>

                      <div className="bg-white p-4 rounded-lg border border-gray-200">
                        <h5 className="text-sm font-medium text-gray-700 mb-2">Access Summary</h5>
                        <div className="text-sm text-gray-600">
                          <p>• Minimum Role Level: {config.requiredRoleLevel}</p>
                          <p>• Allowed Roles: {config.allowedRoles.length > 0 ? config.allowedRoles.map(roleId => 
                            userRoles.find(r => r.id === roleId)?.name
                          ).join(', ') : 'None'}</p>
                          <p>• Total Users with Access: {config.allowedRoles.length}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {!config.isEnabled && (
                    <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                      <div className="flex items-center gap-2 text-red-800">
                        <EyeOff className="w-4 h-4" />
                        <span className="text-sm font-medium">
                          This file type is disabled and will not be visible to any users
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Role Hierarchy Tab */}
        {activeTab === 'roles' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">User Role Hierarchy</h3>
              <p className="text-sm text-gray-600 mb-6">
                Overview of all user roles and their permission levels. Higher levels inherit permissions from lower levels.
              </p>
            </div>

            <div className="space-y-4">
              {userRoles.sort((a, b) => b.level - a.level).map(role => (
                <div key={role.id} className="bg-white rounded-lg p-6 border border-gray-200">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${getRoleColor(role.level)}`}>
                        <span className="font-bold text-lg">{role.level}</span>
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900">{role.name}</h4>
                        <p className="text-sm text-gray-600">Level {role.level} Role</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-700">File Access</p>
                      <p className="text-xs text-gray-500">
                        {fileAccessConfig.filter(config => 
                          config.isEnabled && 
                          role.level >= config.requiredRoleLevel && 
                          config.allowedRoles.includes(role.id)
                        ).length} of {fileAccessConfig.filter(c => c.isEnabled).length} file types
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h5 className="text-sm font-medium text-gray-700 mb-2">Permissions</h5>
                      <div className="space-y-1">
                        {role.permissions.map(permission => (
                          <span key={permission} className="inline-block px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full mr-1 mb-1">
                            {permission.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h5 className="text-sm font-medium text-gray-700 mb-2">Accessible File Types</h5>
                      <div className="space-y-1">
                        {fileAccessConfig
                          .filter(config => 
                            config.isEnabled && 
                            role.level >= config.requiredRoleLevel && 
                            config.allowedRoles.includes(role.id)
                          )
                          .map(config => (
                            <span key={config.fileType} className="inline-block px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full mr-1 mb-1">
                              {config.displayName}
                            </span>
                          ))
                        }
                        {fileAccessConfig.filter(config => 
                          config.isEnabled && 
                          role.level >= config.requiredRoleLevel && 
                          config.allowedRoles.includes(role.id)
                        ).length === 0 && (
                          <span className="text-xs text-gray-500">No file access</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Access Simulation Tab */}
        {activeTab === 'simulation' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Access Simulation</h3>
              <p className="text-sm text-gray-600 mb-6">
                Simulate how file access controls appear for different user roles. This helps you test your configuration before applying changes.
              </p>
            </div>

            {/* Role Selector */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <h4 className="text-lg font-medium text-gray-900 mb-4">Simulate as User Role</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {userRoles.map(role => (
                  <label key={role.id} className="cursor-pointer">
                    <input
                      type="radio"
                      name="simulationRole"
                      value={role.id}
                      checked={simulationUser.role === role.id}
                      onChange={() => setSimulationUser({
                        ...simulationUser,
                        role: role.id,
                        roleLevel: role.level
                      })}
                      className="sr-only"
                    />
                    <div className={`p-4 rounded-lg border-2 transition-all ${
                      simulationUser.role === role.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}>
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${getRoleColor(role.level)}`}>
                          <span className="font-bold text-sm">{role.level}</span>
                        </div>
                        <div>
                          <h5 className={`font-medium ${
                            simulationUser.role === role.id ? 'text-blue-900' : 'text-gray-900'
                          }`}>
                            {role.name}
                          </h5>
                          <p className={`text-sm ${
                            simulationUser.role === role.id ? 'text-blue-700' : 'text-gray-600'
                          }`}>
                            Level {role.level}
                          </p>
                        </div>
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Simulation Results */}
            <div className="bg-white rounded-lg border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h4 className="text-lg font-semibold text-gray-900">
                  File Access for {userRoles.find(r => r.id === simulationUser.role)?.name}
                </h4>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {fileAccessConfig.map(config => {
                    const hasAccess = canUserAccess(config, simulationUser);
                    
                    return (
                      <div key={config.fileType} className={`p-4 rounded-lg border-2 ${
                        hasAccess 
                          ? 'border-green-300 bg-green-50' 
                          : 'border-red-300 bg-red-50'
                      }`}>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${getFileColor(config.fileType)}`}>
                              {getFileIcon(config.fileType)}
                            </div>
                            <h5 className="font-medium text-gray-900">{config.displayName}</h5>
                          </div>
                          <div className="flex items-center gap-2">
                            {hasAccess ? (
                              <Eye className="w-5 h-5 text-green-600" />
                            ) : (
                              <EyeOff className="w-5 h-5 text-red-600" />
                            )}
                            <span className={`text-sm font-medium ${
                              hasAccess ? 'text-green-800' : 'text-red-800'
                            }`}>
                              {hasAccess ? 'Accessible' : 'Restricted'}
                            </span>
                          </div>
                        </div>
                        
                        <div className="text-sm text-gray-600">
                          {!config.isEnabled ? (
                            <p className="text-red-600">File type is disabled globally</p>
                          ) : simulationUser.roleLevel < config.requiredRoleLevel ? (
                            <p className="text-red-600">
                              Requires level {config.requiredRoleLevel}+ (current: {simulationUser.roleLevel})
                            </p>
                          ) : !config.allowedRoles.includes(simulationUser.role) ? (
                            <p className="text-red-600">
                              Role not in allowed list: {config.allowedRoles.join(', ')}
                            </p>
                          ) : (
                            <p className="text-green-600">
                              Access granted via {userRoles.find(r => r.id === simulationUser.role)?.name} role
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            Save Configuration
          </button>
        </div>
      </div>
    </div>
  );
};

export default FileAccessManager;