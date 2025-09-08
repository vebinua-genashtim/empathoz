import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { Settings, Users } from 'lucide-react';
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
import { getActionsForModule } from './data/appActions';

function App() {
  const { theme } = useTheme();
  const location = useLocation();
  const [activeSection, setActiveSection] = useState('my-apps');
  const [hrModules, setHrModules] = useState<HRModule[]>(HRData.hrModules);
  const [showIntegrationFlow, setShowIntegrationFlow] = useState(false);

  // State for Add New Account form in TLMS Account Settings
  const [newAccount, setNewAccount] = useState({
    email: '',
    name: '',
    accountLevel: 'accounting' // Default value
  });

  const handleNewAccountChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewAccount(prev => ({ ...prev, [name]: value }));
  };

  const handleAddAccountSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate adding the account
    console.log('Adding new account:', newAccount);
    alert(`Account for ${newAccount.name} (${newAccount.email}) with level ${newAccount.accountLevel} added successfully! (Simulated)`);
    // Clear form
    setNewAccount({
      email: '',
      name: '',
      accountLevel: 'accounting'
    });
  };
  
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
      
      // ATS Actions
      case 'ats-add-candidate':
        return (
          <div className="flex-1 bg-gray-50 p-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Add New Candidate</h1>
            <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200">
              <p className="text-gray-600">Quick candidate addition form would be displayed here. This would be a streamlined version of the candidate form from the main ATS module.</p>
            </div>
          </div>
        );
      case 'ats-manage-departments':
        return (
          <div className="flex-1 bg-gray-50 p-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Manage Departments</h1>
            <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200">
              <p className="text-gray-600">Department management interface would be displayed here, allowing quick access to add, edit, or remove departments.</p>
            </div>
          </div>
        );
      case 'ats-advanced-export':
        return (
          <div className="flex-1 bg-gray-50 p-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Advanced Candidate Export</h1>
            <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200">
              <p className="text-gray-600">Advanced export interface would be displayed here with detailed filtering options for candidate data.</p>
            </div>
          </div>
        );
      
      // TLMS Actions
      case 'tlms-account-settings':
        return (
          <div className="flex-1 bg-gray-50 p-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">TLMS Account Settings</h1>
            <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200">
              <div className="max-w-4xl mx-auto">
                <div className="mb-8">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Account Management Actions</h2>
                  <p className="text-gray-600 mb-6">Quick actions for managing user accounts within the TLMS.</p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <button className="p-4 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition-colors text-left">
                      <div className="flex items-center gap-3 mb-2">
                        <Users className="w-5 h-5 text-green-600" />
                        <span className="font-medium text-green-900">Add New Account</span>
                      </div>
                      <p className="text-sm text-green-700">Create new user account with appropriate permissions</p>
                    </button>
                    
                    <button className="p-4 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors text-left">
                      <div className="flex items-center gap-3 mb-2">
                        <Users className="w-5 h-5 text-blue-600" />
                        <span className="font-medium text-blue-900">Bulk Import</span>
                      </div>
                      <p className="text-sm text-blue-700">Import multiple accounts from CSV or Excel file</p>
                    </button>
                    
                    <button className="p-4 bg-purple-50 border border-purple-200 rounded-lg hover:bg-purple-100 transition-colors text-left">
                      <div className="flex items-center gap-3 mb-2">
                        <Settings className="w-5 h-5 text-purple-600" />
                        <span className="font-medium text-purple-900">Permission Audit</span>
                      </div>
                      <p className="text-sm text-purple-700">Review and audit user permissions and access levels</p>
                    </button>
                  </div>
                </div>
                
                {/* NEW: Add New Account Setting Form */}
                <div className="border-t border-gray-200 pt-8 mb-8">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Add New Account Setting</h2>
                  <div className="bg-blue-50 p-6 rounded-lg">
                    <form onSubmit={handleAddAccountSubmit} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-blue-800 mb-2">Email</label>
                        <input
                          type="email"
                          name="email"
                          value={newAccount.email}
                          onChange={handleNewAccountChange}
                          className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="user@example.com"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-blue-800 mb-2">Name</label>
                        <input
                          type="text"
                          name="name"
                          value={newAccount.name}
                          onChange={handleNewAccountChange}
                          className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="User Name"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-blue-800 mb-2">Account Level</label>
                        <select
                          name="accountLevel"
                          value={newAccount.accountLevel}
                          onChange={handleNewAccountChange}
                          className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          required
                        >
                          <option value="accounting">Accounting</option>
                          <option value="admin">Admin</option>
                          <option value="hr">HR</option>
                          <option value="mancom">ManCom</option>
                          <option value="gcoo">GCOO</option>
                          <option value="tcoo">TCOO</option>
                          <option value="ceo">CEO</option>
                        </select>
                      </div>
                      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">Add Account</button>
                    </form>
                  </div>
                </div>

                {/* NEW: Permission Audit Form */}
                <div className="border-t border-gray-200 pt-8">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Permission Audit</h2>
                  <div className="bg-purple-50 p-6 rounded-lg">
                    <p className="text-sm text-purple-800 mb-4">
                      Review and audit user permissions. Select a user or role to view their access rights.
                    </p>
                    <form className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-purple-800 mb-2">Select User or Role</label>
                        <select className="w-full px-3 py-2 border border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                          <option value="">Select...</option>
                          <option value="user1">User 1 (Accounting)</option>
                          <option value="user2">User 2 (HR)</option>
                          <option value="role-admin">Role: Admin</option>
                          <option value="role-hr">Role: HR</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-purple-800 mb-2">Audit Report</label>
                        <textarea readOnly rows={6} className="w-full px-3 py-2 border border-purple-200 rounded-lg bg-purple-100 text-purple-900 focus:ring-2 focus:ring-purple-500 focus:border-transparent" value="Permissions for selected entity will appear here..."></textarea>
                      </div>
                      <button type="submit" className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors">Run Audit</button>
                    </form>
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
                        <Users className="w-5 h-5 text-white" />
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
                
                {/* Add New Account Setting Form */}
                <div className="border-t border-gray-200 pt-8">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Add New Account Setting</h2>
                  <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                    <form className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                        <input
                          type="email"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Enter email"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                        <input
                          type="text"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Enter name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Account Level</label>
                        <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                          <option value="accounting">Accounting</option>
                          <option value="admin">Admin</option>
                          <option value="hr">HR</option>
                          <option value="mancom">ManCom</option>
                          <option value="gcoo">GCOO</option>
                          <option value="tcoo">TCOO</option>
                          <option value="ceo">CEO</option>
                        </select>
                      </div>
                      <div className="flex justify-end">
                        <button
                          type="submit"
                          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          Add Account
                        </button>
                      </div>
                    </form>
                  </div>
                </div>

                {/* Permission Audit Form */}
                <div className="border-t border-gray-200 pt-8">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Permission Audit</h2>
                  <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                    <form className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Audit Notes</label>
                        <textarea
                          rows={4}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Enter any specific notes or criteria for the audit..."
                        ></textarea>
                      </div>
                      <div className="flex justify-end">
                        <button
                          type="submit"
                          className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
                        >
                          Run Permission Audit
                        </button>
                      </div>
                    </form>
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
      case 'tlms-course-analytics':
        return (
          <div className="flex-1 bg-gray-50 p-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">TLMS Course Analytics</h1>
            <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200">
              <p className="text-gray-600">Course analytics and training metrics dashboard would be displayed here.</p>
            </div>
          </div>
        );
      
      // EES Actions
      case 'ees-survey-builder':
        return (
          <div className="flex-1 bg-gray-50 p-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Survey Builder</h1>
            <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200">
              <p className="text-gray-600">Advanced survey builder interface would be displayed here for creating custom engagement surveys.</p>
            </div>
          </div>
        );
      case 'ees-analytics-dashboard':
        return (
          <div className="flex-1 bg-gray-50 p-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Engagement Analytics Dashboard</h1>
            <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200">
              <p className="text-gray-600">Comprehensive engagement analytics and trend analysis would be displayed here.</p>
            </div>
          </div>
        );
      case 'ees-email-campaigns':
        return (
          <div className="flex-1 bg-gray-50 p-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Email Campaigns</h1>
            <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200">
              <p className="text-gray-600">Email campaign management for survey invitations would be displayed here.</p>
            </div>
          </div>
        );
      
      // HRDB Actions
      case 'hrdb-add-employee':
        return (
          <div className="flex-1 bg-gray-50 p-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Add New Employee</h1>
            <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200">
              <p className="text-gray-600">Quick employee addition form would be displayed here.</p>
            </div>
          </div>
        );
      case 'hrdb-bulk-import':
        return (
          <div className="flex-1 bg-gray-50 p-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Bulk Employee Import</h1>
            <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200">
              <p className="text-gray-600">Bulk import interface for employee data would be displayed here.</p>
            </div>
          </div>
        );
      case 'hrdb-file-access-control':
        return (
          <div className="flex-1 bg-gray-50 p-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">File Access Control</h1>
            <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200">
              <p className="text-gray-600">File access control management interface would be displayed here.</p>
            </div>
          </div>
        );
      case 'hrdb-advanced-export':
        return (
          <div className="flex-1 bg-gray-50 p-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Advanced Employee Export</h1>
            <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200">
              <p className="text-gray-600">Advanced export interface for employee data would be displayed here.</p>
            </div>
          </div>
        );
      
      // Claims Actions
      case 'claims-submit-claim':
        return (
          <div className="flex-1 bg-gray-50 p-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Submit New Claim</h1>
            <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200">
              <p className="text-gray-600">Quick claim submission form would be displayed here.</p>
            </div>
          </div>
        );
      case 'claims-approval-dashboard':
        return (
          <div className="flex-1 bg-gray-50 p-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Claims Approval Dashboard</h1>
            <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200">
              <p className="text-gray-600">Claims approval dashboard would be displayed here.</p>
            </div>
          </div>
        );
      case 'claims-workflow-rules':
        return (
          <div className="flex-1 bg-gray-50 p-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Claims Workflow Rules</h1>
            <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200">
              <p className="text-gray-600">Claims workflow rules configuration would be displayed here.</p>
            </div>
          </div>
        );
      
      // Leave Actions
      case 'leave-new-request':
        return (
          <div className="flex-1 bg-gray-50 p-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">New Leave Request</h1>
            <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200">
              <p className="text-gray-600">Quick leave request form would be displayed here.</p>
            </div>
          </div>
        );
      case 'leave-approval-dashboard':
        return (
          <div className="flex-1 bg-gray-50 p-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Leave Approval Dashboard</h1>
            <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200">
              <p className="text-gray-600">Leave approval dashboard would be displayed here.</p>
            </div>
          </div>
        );
      case 'leave-configuration':
        return (
          <div className="flex-1 bg-gray-50 p-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Leave Configuration</h1>
            <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200">
              <p className="text-gray-600">Leave configuration settings would be displayed here.</p>
            </div>
          </div>
        );
      case 'leave-calendar-view':
        return (
          <div className="flex-1 bg-gray-50 p-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Leave Calendar View</h1>
            <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200">
              <p className="text-gray-600">Calendar view of all leave requests would be displayed here.</p>
            </div>
          </div>
        );
      
      // Onboarding Actions
      case 'onboarding-add-hire':
        return (
          <div className="flex-1 bg-gray-50 p-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Add New Hire</h1>
            <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200">
              <p className="text-gray-600">Quick new hire addition form would be displayed here.</p>
            </div>
          </div>
        );
      case 'onboarding-task-templates':
        return (
          <div className="flex-1 bg-gray-50 p-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Onboarding Task Templates</h1>
            <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200">
              <p className="text-gray-600">Task template management interface would be displayed here.</p>
            </div>
          </div>
        );
      case 'onboarding-progress-tracking':
        return (
          <div className="flex-1 bg-gray-50 p-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Onboarding Progress Tracking</h1>
            <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200">
              <p className="text-gray-600">Progress tracking dashboard for all new hires would be displayed here.</p>
            </div>
          </div>
        );
      
      // Core Communications Actions
      case 'core-new-announcement':
        return (
          <div className="flex-1 bg-gray-50 p-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">New Announcement</h1>
            <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200">
              <p className="text-gray-600">Quick announcement creation form would be displayed here.</p>
            </div>
          </div>
        );
      case 'core-event-management':
        return (
          <div className="flex-1 bg-gray-50 p-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Event Management</h1>
            <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200">
              <p className="text-gray-600">Company event management interface would be displayed here.</p>
            </div>
          </div>
        );
      case 'core-notification-center':
        return (
          <div className="flex-1 bg-gray-50 p-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Notification Center</h1>
            <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200">
              <p className="text-gray-600">Internal notification management would be displayed here.</p>
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