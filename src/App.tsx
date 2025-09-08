import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import * as Icons from 'lucide-react';
import { useTheme } from './contexts/ThemeContext';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import MyApps from './components/MyApps';
import ApplicantTrackingSystem from './modules/ats/ApplicantTrackingSystem';
import TrainingLearningManagementSystem from './modules/tlms/TrainingLearningManagementSystem';
import EmployeeEngagementSurvey from './modules/ees/EmployeeEngagementSurvey';
import HRDatabase from './modules/hrdb/HRDatabase';
import EmployeeFormPage from './modules/hrdb/EmployeeFormPage';
import LeaveManagement from './modules/leave/LeaveManagement';
import InternalCommunications from './modules/communications/InternalCommunications';
import EmployeeOnboarding from './modules/onboarding/EmployeeOnboarding';
import ClaimsManagement from './modules/claims/ClaimsManagement';
import NotificationsPage from './components/NotificationsPage';
import PublicSurveyPage from './components/PublicSurveyPage';
import IntegrationFlowViewer from './components/IntegrationFlowViewer';
import * as HRData from './data/hrModules';
import { HRModule } from './types';

function App() {
  const { theme } = useTheme();
  const location = useLocation();
  const [activeSection, setActiveSection] = useState('my-apps');
  const [hrModules, setHrModules] = useState<HRModule[]>(HRData.hrModules);
  const [showIntegrationFlow, setShowIntegrationFlow] = useState(false);
  
  // Handle integration flow visibility based on active section
  useEffect(() => {
    if (activeSection === 'integration-flow') {
      setShowIntegrationFlow(true);
    } else {
      setShowIntegrationFlow(false);
    }
  }, [activeSection]);
  
  // Check if this is a public survey URL
  const urlParams = new URLSearchParams(window.location.search);
  const isPublicSurvey = urlParams.has('surveyId');
  
  if (isPublicSurvey) {
    return <PublicSurveyPage />;
  }

  // Check if we're on an employee form page
  const isEmployeeFormPage = location.pathname.includes('/hrdb/employee/');

  const toggleModuleVisibility = (moduleId: string) => {
    setHrModules(prevModules =>
      prevModules.map(module =>
        module.id === moduleId
          ? { ...module, isEnabled: !module.isEnabled }
          : module
      )
    );
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return <Dashboard />;
      case 'my-apps':
        return <MyApps hrModules={hrModules} onToggleModuleVisibility={toggleModuleVisibility} />;
      case 'integration-flow':
        return <MyApps hrModules={hrModules} onToggleModuleVisibility={toggleModuleVisibility} />;
      case 'directory':
        return (
          <div className="flex-1 bg-gray-50 p-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Employee Directory</h1>
            <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200">
              <p className="text-gray-600">Employee directory functionality coming soon...</p>
            </div>
          </div>
        );
      case 'settings':
        return (
          <div className="flex-1 bg-gray-50 p-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Settings</h1>
            <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200">
              <p className="text-gray-600">System settings and preferences coming soon...</p>
            </div>
          </div>
        );
      case 'help':
        return (
          <div className="flex-1 bg-gray-50 p-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Help & Support</h1>
            <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200">
              <p className="text-gray-600">Help documentation and support resources coming soon...</p>
            </div>
          </div>
        );
      case 'ats':
        return <ApplicantTrackingSystem />;
      case 'tlms':
        return <TrainingLearningManagementSystem />;
      case 'ees':
        return <EmployeeEngagementSurvey />;
      case 'hrdb':
        return <HRDatabase />;
      case 'claims':
        return <ClaimsManagement />;
      case 'onboarding':
        return <EmployeeOnboarding />;
      case 'core':
        return <InternalCommunications />;
      case 'leave':
        return <LeaveManagement />;
      case 'notifications-page':
        return <NotificationsPage currentUser="HR Manager" />;
      case 'tlms-account-settings':
        return (
          <div className="flex-1 bg-gray-50 p-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">TLMS Account Settings</h1>
            <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200">
              <div className="max-w-4xl">
                <div className="mb-8">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">User Account Management</h2>
                  <p className="text-gray-600 mb-6">Manage user accounts, permissions, and access levels for the Training & Learning Management System.</p>
                  
                  <div className="bg-blue-50 p-6 rounded-lg">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                        <Icons.Settings className="w-5 h-5 text-white" />
                      </div>
                      <h3 className="text-lg font-semibold text-blue-900">Account Configuration</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-blue-800 mb-2">Default Account Level</label>
                          <select className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                            <option value="learner">Learner</option>
                            <option value="instructor">Instructor</option>
                            <option value="manager">Manager</option>
                            <option value="admin">Admin</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-blue-800 mb-2">Auto-enrollment Policy</label>
                          <select className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                            <option value="department">By Department</option>
                            <option value="role">By Role</option>
                            <option value="manual">Manual Only</option>
                          </select>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-blue-800 mb-2">Account Approval Required</label>
                          <div className="flex items-center">
                            <input type="checkbox" className="rounded border-blue-300 text-blue-600 focus:ring-blue-500" />
                            <span className="ml-2 text-sm text-blue-800">Require manager approval for new accounts</span>
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-blue-800 mb-2">Session Timeout</label>
                          <select className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                            <option value="30">30 minutes</option>
                            <option value="60">1 hour</option>
                            <option value="120">2 hours</option>
                            <option value="480">8 hours</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="border-t border-gray-200 pt-8">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Account Management Actions</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <button className="p-4 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition-colors text-left">
                      <div className="flex items-center gap-3 mb-2">
                        <Icons.UserPlus className="w-5 h-5 text-green-600" />
                        <span className="font-medium text-green-900">Add New Account</span>
                      </div>
                      <p className="text-sm text-green-700">Create new user account with appropriate permissions</p>
                    </button>
                    
                    <button className="p-4 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors text-left">
                      <div className="flex items-center gap-3 mb-2">
                        <Icons.Users className="w-5 h-5 text-blue-600" />
                        <span className="font-medium text-blue-900">Bulk Import</span>
                      </div>
                      <p className="text-sm text-blue-700">Import multiple accounts from CSV or Excel file</p>
                    </button>
                    
                    <button className="p-4 bg-purple-50 border border-purple-200 rounded-lg hover:bg-purple-100 transition-colors text-left">
                      <div className="flex items-center gap-3 mb-2">
                        <Icons.Shield className="w-5 h-5 text-purple-600" />
                        <span className="font-medium text-purple-900">Permission Audit</span>
                      </div>
                      <p className="text-sm text-purple-700">Review and audit user permissions and access levels</p>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 'tlms-second-manager':
        return (
          <div className="flex-1 bg-gray-50 p-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">TLMS Second Manager Settings</h1>
            <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200">
              <div className="max-w-4xl">
                <div className="mb-8">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Secondary Manager Configuration</h2>
                  <p className="text-gray-600 mb-6">Configure secondary manager assignments and delegation settings for training oversight and approval workflows.</p>
                  
                  <div className="bg-purple-50 p-6 rounded-lg">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center">
                        <Icons.Users className="w-5 h-5 text-white" />
                      </div>
                      <h3 className="text-lg font-semibold text-purple-900">Manager Hierarchy</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-purple-800 mb-2">Primary Manager Assignment</label>
                          <select className="w-full px-3 py-2 border border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                            <option value="direct">Direct Manager</option>
                            <option value="department">Department Head</option>
                            <option value="functional">Functional Manager</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-purple-800 mb-2">Secondary Manager Role</label>
                          <select className="w-full px-3 py-2 border border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                            <option value="backup">Backup Approver</option>
                            <option value="specialist">Subject Matter Expert</option>
                            <option value="mentor">Training Mentor</option>
                          </select>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-purple-800 mb-2">Delegation Authority</label>
                          <div className="space-y-2">
                            <div className="flex items-center">
                              <input type="checkbox" className="rounded border-purple-300 text-purple-600 focus:ring-purple-500" />
                              <span className="ml-2 text-sm text-purple-800">Approve training requests</span>
                            </div>
                            <div className="flex items-center">
                              <input type="checkbox" className="rounded border-purple-300 text-purple-600 focus:ring-purple-500" />
                              <span className="ml-2 text-sm text-purple-800">Assign mandatory training</span>
                            </div>
                            <div className="flex items-center">
                              <input type="checkbox" className="rounded border-purple-300 text-purple-600 focus:ring-purple-500" />
                              <span className="ml-2 text-sm text-purple-800">View team progress reports</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="border-t border-gray-200 pt-8">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Current Manager Assignments</h2>
                  <div className="bg-gray-50 rounded-lg p-6">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="border-b border-gray-200">
                          <tr>
                            <th className="text-left py-3 px-4 font-medium text-gray-700">Employee</th>
                            <th className="text-left py-3 px-4 font-medium text-gray-700">Primary Manager</th>
                            <th className="text-left py-3 px-4 font-medium text-gray-700">Second Manager</th>
                            <th className="text-left py-3 px-4 font-medium text-gray-700">Role</th>
                            <th className="text-right py-3 px-4 font-medium text-gray-700">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          <tr className="hover:bg-white">
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                                  <span className="text-white text-sm font-semibold">JD</span>
                                </div>
                                <span className="text-gray-900">John Doe</span>
                              </div>
                            </td>
                            <td className="py-3 px-4 text-gray-700">Sarah Wilson</td>
                            <td className="py-3 px-4 text-gray-700">Emily Rodriguez</td>
                            <td className="py-3 px-4">
                              <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-medium">Training Mentor</span>
                            </td>
                            <td className="py-3 px-4 text-right">
                              <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">Edit</button>
                            </td>
                          </tr>
                          <tr className="hover:bg-white">
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                                  <span className="text-white text-sm font-semibold">JS</span>
                                </div>
                                <span className="text-gray-900">Jane Smith</span>
                              </div>
                            </td>
                            <td className="py-3 px-4 text-gray-700">Mike Johnson</td>
                            <td className="py-3 px-4 text-gray-700">David Kim</td>
                            <td className="py-3 px-4">
                              <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">Backup Approver</span>
                            </td>
                            <td className="py-3 px-4 text-right">
                              <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">Edit</button>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return <MyApps hrModules={hrModules} onToggleModuleVisibility={toggleModuleVisibility} />;
    }
  };

  // If we're on an employee form page, render it directly without sidebar
  if (isEmployeeFormPage) {
    return (
      <div className={`min-h-screen bg-gray-100 ${
        theme === 'high-contrast' ? 'theme-high-contrast' : 
        theme === 'accessible-view' ? 'theme-accessible-view' : 
        'theme-default'
      }`}>
        <Routes>
          <Route path="/hrdb/employee/add" element={<EmployeeFormPage />} />
          <Route path="/hrdb/employee/edit/:employeeId" element={<EmployeeFormPage />} />
        </Routes>
      </div>
    );
  }
  return (
    <div className={`min-h-screen bg-gray-100 flex ${
      theme === 'high-contrast' ? 'theme-high-contrast' : 
      theme === 'pwd-friendly' ? 'theme-pwd-friendly' : 
      'theme-default'
    }`}>
      <Sidebar 
        activeItem={activeSection}
        onItemClick={setActiveSection}
        hrModules={hrModules}
      />
      {renderContent()}
      
      {/* Integration Flow Viewer */}
      <IntegrationFlowViewer
        isOpen={showIntegrationFlow}
        onClose={() => {
          setShowIntegrationFlow(false);
          setActiveSection('my-apps');
        }}
      />
    </div>
  );
}

export default App;