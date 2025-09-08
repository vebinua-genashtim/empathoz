import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
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