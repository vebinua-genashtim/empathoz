import React, { useState, useEffect } from 'react';
import { 
  X, 
  ArrowRight, 
  CheckCircle, 
  Users, 
  UserPlus, 
  Database, 
  BookOpen, 
  Play, 
  RotateCcw,
  Clock,
  Award,
  FileText,
  Building2,
  Zap
} from 'lucide-react';
import { dataService, Candidate, NewHire, Employee, Course } from '../services/dataService';

interface IntegrationFlowViewerProps {
  isOpen: boolean;
  onClose: () => void;
}

type FlowStep = 'ats' | 'hrdb' | 'onboarding' | 'tlms' | 'complete';

const IntegrationFlowViewer: React.FC<IntegrationFlowViewerProps> = ({ isOpen, onClose }) => {
  const [currentStep, setCurrentStep] = useState<FlowStep>('ats');
  const [candidate, setCandidate] = useState<Candidate | undefined>();
  const [newHire, setNewHire] = useState<NewHire | undefined>();
  const [employee, setEmployee] = useState<Employee | undefined>();
  const [enrolledCourses, setEnrolledCourses] = useState<Course[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (isOpen) {
      refreshData();
    }
  }, [isOpen]);

  const refreshData = () => {
    setCandidate(dataService.getIntegrationFlowCandidate());
    setNewHire(dataService.getIntegrationFlowNewHire());
    setEmployee(dataService.getIntegrationFlowEmployee());
    
    // Get courses that the integration employee might be enrolled in
    const courses = dataService.getCourses();
    setEnrolledCourses(courses.filter(c => c.category === 'Development' || c.category === 'Programming'));
  };

  const handleHireCandidate = async () => {
    if (!candidate) return;
    
    setIsProcessing(true);
    
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Update candidate status to hired
    dataService.updateCandidate(candidate.id, { status: 'hired' });
    
    // Create employee profile first
    const success = dataService.createEmployeeFromCandidate(candidate);
    
    if (success) {
      refreshData();
      setCurrentStep('hrdb');
    }
    
    setIsProcessing(false);
  };

  const handleCreateOnboardingRecord = async () => {
    if (!employee) return;
    
    setIsProcessing(true);
    
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Create onboarding record from employee
    const success = dataService.createOnboardingRecordFromEmployee(employee);
    
    if (success) {
      refreshData();
      setCurrentStep('onboarding');
    }
    
    setIsProcessing(false);
  };

  const handleCompleteOnboarding = async () => {
    if (!newHire) return;
    
    setIsProcessing(true);
    
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Complete all onboarding tasks
    const success = dataService.completeOnboardingTasks(newHire.id);
    
    if (success) {
      refreshData();
      setCurrentStep('tlms');
    }
    
    setIsProcessing(false);
  };

  const handleEnrollInTraining = async () => {
    if (!employee) return;
    
    setIsProcessing(true);
    
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Enroll in mandatory training
    const success = dataService.enrollEmployeeInMandatoryTraining(employee.id, employee.department);
    
    if (success) {
      refreshData();
      setCurrentStep('complete');
    }
    
    setIsProcessing(false);
  };

  const handleResetFlow = () => {
    dataService.resetMockData();
    setCurrentStep('ats');
    refreshData();
  };

  const getStepStatus = (step: FlowStep) => {
    const stepOrder: FlowStep[] = ['ats', 'hrdb', 'onboarding', 'tlms', 'complete'];
    const currentIndex = stepOrder.indexOf(currentStep);
    const stepIndex = stepOrder.indexOf(step);
    
    if (stepIndex < currentIndex) return 'completed';
    if (stepIndex === currentIndex) return 'current';
    return 'pending';
  };

  const getStepIcon = (step: FlowStep) => {
    switch (step) {
      case 'ats': return Users;
      case 'hrdb': return Database;
      case 'onboarding': return UserPlus;
      case 'tlms': return BookOpen;
      case 'complete': return CheckCircle;
    }
  };

  const getStepColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-600 text-white';
      case 'current': return 'bg-blue-600 text-white';
      case 'pending': return 'bg-gray-300 text-gray-600';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-6xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Integration Flow Demonstration</h2>
              <p className="text-sm text-gray-600">Experience the complete ATS → Onboarding → HRDB → TLMS workflow</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleResetFlow}
              className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              Reset Flow
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {(['ats', 'hrdb', 'onboarding', 'tlms', 'complete'] as FlowStep[]).map((step, index) => {
              const Icon = getStepIcon(step);
              const status = getStepStatus(step);
              const stepNames = {
                ats: 'ATS - Hire Candidate',
                hrdb: 'HR Database',
                onboarding: 'Onboarding Process',
                tlms: 'Training Enrollment',
                complete: 'Flow Complete'
              };
              
              return (
                <React.Fragment key={step}>
                  <div className="flex flex-col items-center">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${getStepColor(status)} transition-all duration-300`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className={`text-sm font-medium mt-2 ${
                      status === 'current' ? 'text-blue-600' : 
                      status === 'completed' ? 'text-green-600' : 
                      'text-gray-500'
                    }`}>
                      {stepNames[step]}
                    </span>
                  </div>
                  {index < 4 && (
                    <div className={`flex-1 h-0.5 mx-4 ${
                      getStepStatus((['ats', 'hrdb', 'onboarding', 'tlms', 'complete'] as FlowStep[])[index + 1]) === 'completed' || 
                      getStepStatus((['ats', 'hrdb', 'onboarding', 'tlms', 'complete'] as FlowStep[])[index + 1]) === 'current'
                        ? 'bg-green-400' 
                        : 'bg-gray-300'
                    } transition-all duration-300`}></div>
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {/* Step Content */}
        <div className="bg-gray-50 rounded-xl p-6">
          {/* Step 1: ATS - Hire Candidate */}
          {currentStep === 'ats' && (
            <div className="space-y-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Step 1: Hire Candidate from ATS</h3>
                <p className="text-gray-600">Start by hiring a candidate who has reached the 'offer' stage in the Applicant Tracking System</p>
              </div>

              {candidate ? (
                <div className="bg-white rounded-lg p-6 border border-gray-200 max-w-2xl mx-auto">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-xl">
                        {candidate.firstName.charAt(0)}{candidate.lastName.charAt(0)}
                      </span>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-xl font-semibold text-gray-900">{candidate.firstName} {candidate.lastName}</h4>
                      <p className="text-gray-600">{candidate.position} • {candidate.department}</p>
                      <div className="flex items-center gap-3 mt-2">
                        <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                          {candidate.status.charAt(0).toUpperCase() + candidate.status.slice(1)}
                        </span>
                        <span className="text-sm text-gray-600">{candidate.experience} years experience</span>
                        <span className="text-sm text-gray-600">${candidate.salary?.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-6 text-sm text-gray-600">
                    <div>
                      <p><strong>Email:</strong> {candidate.email}</p>
                      <p><strong>Phone:</strong> {candidate.phone}</p>
                      <p><strong>Location:</strong> {candidate.city}, {candidate.country}</p>
                    </div>
                    <div>
                      <p><strong>Applied:</strong> {new Date(candidate.appliedDate).toLocaleDateString()}</p>
                      <p><strong>Source:</strong> {candidate.source.charAt(0).toUpperCase() + candidate.source.slice(1)}</p>
                      <p><strong>Last Updated:</strong> {new Date(candidate.lastUpdated).toLocaleDateString()}</p>
                    </div>
                  </div>

                  <div className="bg-blue-50 p-4 rounded-lg mb-6">
                    <p className="text-sm text-blue-800">
                      <strong>Notes:</strong> {candidate.notes}
                    </p>
                  </div>

                  <div className="text-center">
                    <button
                      onClick={handleHireCandidate}
                      disabled={isProcessing}
                      className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center gap-2 mx-auto text-lg font-semibold"
                    >
                      {isProcessing ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Hiring Candidate...
                        </>
                      ) : (
                        <>
                          <UserPlus className="w-5 h-5" />
                          Hire Candidate
                        </>
                      )}
                    </button>
                    <p className="text-sm text-gray-500 mt-2">
                      This will update the candidate status to 'hired' and create an onboarding record
                    </p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="w-8 h-8 text-gray-400" />
                  </div>
                  <h4 className="text-lg font-medium text-gray-900 mb-2">No Candidate Available</h4>
                  <p className="text-gray-600 mb-4">The integration candidate has already been hired or is not available.</p>
                  <button
                    onClick={handleResetFlow}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Reset Flow to Start Over
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Step 2: HR Database */}
          {currentStep === 'hrdb' && (
            <div className="space-y-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Database className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Step 2: Create Employee Profile in HRDB</h3>
                <p className="text-gray-600">The candidate has been hired! Now create their official employee profile in the HR Database.</p>
              </div>

              {candidate && candidate.status === 'hired' ? (
                <div className="bg-white rounded-lg p-6 border border-gray-200 max-w-3xl mx-auto">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-xl">
                        {candidate.firstName.charAt(0)}{candidate.lastName.charAt(0)}
                      </span>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-xl font-semibold text-gray-900">{candidate.firstName} {candidate.lastName}</h4>
                      <p className="text-gray-600">{candidate.position} • {candidate.department}</p>
                      <div className="flex items-center gap-3 mt-2">
                        <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                          Hired - Ready for HRDB
                        </span>
                        <span className="text-sm text-gray-600">Experience: {candidate.experience} years</span>
                        <span className="text-sm text-gray-600">Salary: ${candidate.salary?.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h5 className="font-semibold text-blue-900 mb-3">Candidate Information</h5>
                      <div className="space-y-2 text-sm text-blue-800">
                        <p><strong>Email:</strong> {candidate.email}</p>
                        <p><strong>Phone:</strong> {candidate.phone}</p>
                        <p><strong>Location:</strong> {candidate.city}, {candidate.country}</p>
                        <p><strong>Source:</strong> {candidate.source.charAt(0).toUpperCase() + candidate.source.slice(1)}</p>
                        <p><strong>Applied:</strong> {new Date(candidate.appliedDate).toLocaleDateString()}</p>
                      </div>
                    </div>
                    
                    <div className="bg-purple-50 p-4 rounded-lg">
                      <h5 className="font-semibold text-purple-900 mb-3">Employee Profile Creation</h5>
                      <div className="space-y-2 text-sm text-purple-800">
                        <p>✓ Personal information transfer</p>
                        <p>✓ Contact details setup</p>
                        <p>✓ Position and department assignment</p>
                        <p>✓ Salary and benefits configuration</p>
                        <p>✓ Manager assignment</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-green-50 p-4 rounded-lg mb-6">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <span className="font-medium text-green-900">Ready for Employee Profile Creation</span>
                    </div>
                    <p className="text-sm text-green-800">
                      All candidate information is ready to be transferred to create a comprehensive employee profile in the HR Database.
                    </p>
                  </div>

                  <div className="text-center">
                    <button
                      onClick={handleCreateOnboardingRecord}
                      disabled={isProcessing}
                      className="bg-purple-600 text-white px-8 py-3 rounded-lg hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center gap-2 mx-auto text-lg font-semibold"
                    >
                      {isProcessing ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Creating Employee Profile...
                        </>
                      ) : (
                        <>
                          <Database className="w-5 h-5" />
                          Create Employee Profile in HRDB
                        </>
                      )}
                    </button>
                    <p className="text-sm text-gray-500 mt-2">
                      This will create a complete employee record with all candidate data
                    </p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Database className="w-8 h-8 text-gray-400" />
                  </div>
                  <h4 className="text-lg font-medium text-gray-900 mb-2">No Hired Candidate Found</h4>
                  <p className="text-gray-600">Please complete Step 1 first to hire a candidate.</p>
                </div>
              )}
            </div>
          )}

          {/* Step 3: Onboarding Process */}
          {currentStep === 'onboarding' && (
            <div className="space-y-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <UserPlus className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Step 3: Begin Onboarding Process</h3>
                <p className="text-gray-600">Employee profile created! Now start the structured onboarding process with tasks and milestones.</p>
              </div>

              {employee ? (
                <div className="bg-white rounded-lg p-6 border border-gray-200 max-w-3xl mx-auto">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-xl">
                        {employee.firstName.charAt(0)}{employee.lastName.charAt(0)}
                      </span>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-xl font-semibold text-gray-900">{employee.firstName} {employee.lastName}</h4>
                      <p className="text-gray-600">{employee.position} • {employee.department}</p>
                      <div className="flex items-center gap-3 mt-2">
                        <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                          Employee Profile Created
                        </span>
                        <span className="text-sm text-gray-600">Employee ID: {employee.id}</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h5 className="font-semibold text-blue-900 mb-3">Employee Details</h5>
                      <div className="space-y-2 text-sm text-blue-800">
                        <p><strong>Email:</strong> {employee.email}</p>
                        <p><strong>Phone:</strong> {employee.phone}</p>
                        <p><strong>Hire Date:</strong> {new Date(employee.hireDate).toLocaleDateString()}</p>
                        <p><strong>Salary:</strong> ${employee.salary?.toLocaleString()}</p>
                        <p><strong>Manager:</strong> {employee.managerId}</p>
                      </div>
                    </div>
                    
                    <div className="bg-green-50 p-4 rounded-lg">
                      <h5 className="font-semibold text-green-900 mb-3">Onboarding Tasks Ready</h5>
                      <div className="space-y-2 text-sm text-green-800">
                        <p>📋 Documentation collection</p>
                        <p>💻 Equipment assignment</p>
                        <p>🎓 Training enrollment</p>
                        <p>🤝 Team introductions</p>
                        <p>📅 Manager meetings</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-green-50 p-4 rounded-lg mb-6">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <span className="font-medium text-green-900">HRDB Profile Summary</span>
                    </div>
                    <p className="text-sm text-green-800">
                      Employee profile has been successfully created in the HR Database with all candidate information transferred. Ready to begin structured onboarding process.
                    </p>
                  </div>

                  <div className="text-center">
                    <button
                      onClick={handleCreateOnboardingRecord}
                      disabled={isProcessing}
                      className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center gap-2 mx-auto text-lg font-semibold"
                    >
                      {isProcessing ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Creating Onboarding Record...
                        </>
                      ) : (
                        <>
                          <UserPlus className="w-5 h-5" />
                          Begin Onboarding Process
                        </>
                      )}
                    </button>
                    <p className="text-sm text-gray-500 mt-2">
                      This will create an onboarding record and assign role-specific tasks
                    </p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <UserPlus className="w-8 h-8 text-gray-400" />
                  </div>
                  <h4 className="text-lg font-medium text-gray-900 mb-2">No Employee Profile Found</h4>
                  <p className="text-gray-600">Please complete Step 2 first to create the employee profile.</p>
                </div>
              )}
            </div>
          )}

          {/* Step 4: TLMS Training Enrollment */}
          {currentStep === 'tlms' && (
            <div className="space-y-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="w-8 h-8 text-orange-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Step 4: Enroll in Mandatory Training</h3>
                <p className="text-gray-600">Onboarding is underway! Now enroll them in mandatory training courses through TLMS.</p>
              </div>

              {newHire && newHire.status === 'completed' ? (
                <div className="bg-white rounded-lg p-6 border border-gray-200 max-w-3xl mx-auto">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-xl">
                        {newHire.firstName.charAt(0)}{newHire.lastName.charAt(0)}
                      </span>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-xl font-semibold text-gray-900">{newHire.firstName} {newHire.lastName}</h4>
                      <p className="text-gray-600">{newHire.position} • {newHire.department}</p>
                      <div className="flex items-center gap-3 mt-2">
                        <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                          Onboarding Completed
                        </span>
                        <span className="text-sm text-gray-600">Ready for Training</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h5 className="font-semibold text-blue-900 mb-3">Onboarding Summary</h5>
                      <div className="space-y-2 text-sm text-blue-800">
                        <p>✓ All {newHire.totalTasks} tasks completed</p>
                        <p>✓ Documentation submitted</p>
                        <p>✓ Equipment assigned</p>
                        <p>✓ Access granted</p>
                        <p>✓ Manager meetings held</p>
                      </div>
                    </div>

                    <div className="bg-orange-50 p-4 rounded-lg">
                      <h5 className="font-semibold text-orange-900 mb-3">Mandatory Training Courses</h5>
                      <div className="space-y-2">
                        {enrolledCourses.slice(0, 3).map(course => (
                          <div key={course.id} className="flex items-center gap-2 text-sm">
                            <BookOpen className="w-4 h-4 text-orange-600" />
                            <span className="text-orange-800">{course.title}</span>
                          </div>
                        ))}
                        <p className="text-xs text-orange-700 mt-2">
                          + Additional department-specific courses
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="text-center">
                    <button
                      onClick={handleEnrollInTraining}
                      disabled={isProcessing}
                      className="bg-orange-600 text-white px-8 py-3 rounded-lg hover:bg-orange-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center gap-2 mx-auto text-lg font-semibold"
                    >
                      {isProcessing ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Enrolling in Training...
                        </>
                      ) : (
                        <>
                          <BookOpen className="w-5 h-5" />
                          Enroll in Mandatory Training
                        </>
                      )}
                    </button>
                    <p className="text-sm text-gray-500 mt-2">
                      This will enroll the employee in all required training courses for their role
                    </p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <UserPlus className="w-8 h-8 text-gray-400" />
                  </div>
                  <h4 className="text-lg font-medium text-gray-900 mb-2">Onboarding Not Complete</h4>
                  <p className="text-gray-600">Please complete Step 3 first to finish the onboarding process.</p>
                </div>
              )}
            </div>
          )}

          {/* Step 5: Flow Complete */}
          {currentStep === 'complete' && (
            <div className="space-y-6">
              <div className="text-center">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="w-12 h-12 text-green-600" />
                </div>
                <h3 className="text-3xl font-bold text-gray-900 mb-4">Integration Flow Complete! 🎉</h3>
                <p className="text-lg text-gray-600 mb-8">
                  You've successfully demonstrated the complete integration workflow from ATS to TLMS.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto">
                <div className="bg-blue-50 p-6 rounded-lg text-center">
                  <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="font-semibold text-blue-900 mb-2">ATS</h4>
                  <p className="text-sm text-blue-800">Candidate hired and status updated</p>
                </div>

                <div className="bg-purple-50 p-6 rounded-lg text-center">
                  <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Database className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="font-semibold text-purple-900 mb-2">HRDB</h4>
                  <p className="text-sm text-purple-800">Employee profile created</p>
                </div>

                <div className="bg-green-50 p-6 rounded-lg text-center">
                  <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-3">
                    <UserPlus className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="font-semibold text-green-900 mb-2">Onboarding</h4>
                  <p className="text-sm text-green-800">All onboarding tasks completed</p>
                </div>

                <div className="bg-orange-50 p-6 rounded-lg text-center">
                  <div className="w-12 h-12 bg-orange-600 rounded-full flex items-center justify-center mx-auto mb-3">
                    <BookOpen className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="font-semibold text-orange-900 mb-2">TLMS</h4>
                  <p className="text-sm text-orange-800">Enrolled in mandatory training</p>
                </div>
              </div>

              <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-lg max-w-3xl mx-auto">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">What Happened:</h4>
                <div className="space-y-3 text-sm text-gray-700">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">1</div>
                    <p><strong>ATS Integration:</strong> Candidate status changed from 'offer' to 'hired' and prepared for employee profile creation</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center text-xs font-bold">2</div>
                    <p><strong>HRDB Integration:</strong> Complete employee profile created with all candidate data transferred and official employee ID assigned</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-xs font-bold">3</div>
                    <p><strong>Onboarding Automation:</strong> Role-specific tasks assigned based on position and department, all tasks completed</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-orange-600 text-white rounded-full flex items-center justify-center text-xs font-bold">4</div>
                    <p><strong>TLMS Integration:</strong> Employee enrolled in mandatory training courses based on their department</p>
                  </div>
                </div>
              </div>

              <div className="text-center">
                <button
                  onClick={handleResetFlow}
                  className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 mx-auto text-lg font-semibold"
                >
                  <RotateCcw className="w-5 h-5" />
                  Try Again with Fresh Data
                </button>
                <p className="text-sm text-gray-500 mt-2">
                  Reset the flow to test the integration again
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        {currentStep !== 'complete' && (
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
            <div className="text-sm text-gray-600">
              Step {(['ats', 'hrdb', 'onboarding', 'tlms'].indexOf(currentStep) + 1)} of 4
            </div>
            <div className="text-sm text-gray-500">
              Follow the integration workflow step by step
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default IntegrationFlowViewer;