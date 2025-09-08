import React, { useState, useEffect } from 'react';
import { X, Save, Settings, Users, Calendar, Clock, RotateCcw, Play } from 'lucide-react';
import { LeaveBalance, dataService } from '../../../services/dataService';

interface LeaveConfigurationProps {
  isOpen: boolean;
  onClose: () => void;
  onConfigurationChange: () => void;
}

interface LeaveTypeConfig {
  vacation: number;
  sick: number;
  personal: number;
  maternity: number;
  paternity: number;
}

const LeaveConfiguration: React.FC<LeaveConfigurationProps> = ({
  isOpen,
  onClose,
  onConfigurationChange
}) => {
  const [defaultLeaveConfig, setDefaultLeaveConfig] = useState<LeaveTypeConfig>({
    vacation: 20,
    sick: 10,
    personal: 5,
    maternity: 90,
    paternity: 14
  });

  const [leaveAccrualConfig, setLeaveAccrualConfig] = useState(dataService.getLeaveAccrualConfig());
  const [accrualHistory, setAccrualHistory] = useState(dataService.getAccrualHistory());
  const [carryOverHistory, setCarryOverHistory] = useState(dataService.getCarryOverHistory());

  const [individualBalances, setIndividualBalances] = useState<LeaveBalance[]>([]);
  const [activeTab, setActiveTab] = useState<'default' | 'individual' | 'accrual' | 'history'>('default');

  useEffect(() => {
    if (isOpen) {
      const balances = dataService.getLeaveBalances();
      setIndividualBalances([...balances]);
      
      // Extract default configuration from existing balances
      if (balances.length > 0) {
        const firstBalance = balances[0];
        setDefaultLeaveConfig({
          vacation: firstBalance.vacation.total,
          sick: firstBalance.sick.total,
          personal: firstBalance.personal.total,
          maternity: firstBalance.maternity.total,
          paternity: firstBalance.paternity.total
        });
      }
    }
  }, [isOpen]);

  const handleDefaultConfigChange = (leaveType: keyof LeaveTypeConfig, value: number) => {
    setDefaultLeaveConfig(prev => ({
      ...prev,
      [leaveType]: value
    }));
  };

  const handleIndividualBalanceChange = (employeeId: string, leaveType: keyof Omit<LeaveBalance, 'employeeId' | 'employeeName'>, field: 'used' | 'total', value: number) => {
    setIndividualBalances(prev =>
      prev.map(balance =>
        balance.employeeId === employeeId
          ? {
              ...balance,
              [leaveType]: {
                ...balance[leaveType],
                [field]: Math.max(0, value)
              }
            }
          : balance
      )
    );
  };

  const applyDefaultToAll = () => {
    if (window.confirm('This will update all employees to use the default leave configuration. Individual customizations will be lost. Continue?')) {
      setIndividualBalances(prev =>
        prev.map(balance => ({
          ...balance,
          vacation: { used: balance.vacation.used, total: defaultLeaveConfig.vacation },
          sick: { used: balance.sick.used, total: defaultLeaveConfig.sick },
          personal: { used: balance.personal.used, total: defaultLeaveConfig.personal },
          maternity: { used: balance.maternity.used, total: defaultLeaveConfig.maternity },
          paternity: { used: balance.paternity.used, total: defaultLeaveConfig.paternity }
        }))
      );
    }
  };

  const handleAccrualConfigChange = (leaveType: keyof typeof leaveAccrualConfig, field: string, value: string) => {
    setLeaveAccrualConfig(prev => ({
      ...prev,
      [leaveType]: {
        ...prev[leaveType],
        [field]: field === 'frequency' ? value : parseFloat(value) || 0
      }
    }));
  };

  const handleRunMonthlyAccrual = () => {
    if (window.confirm('Run monthly accrual for all employees? This will add leave days based on the configured monthly rates.')) {
      const entries = dataService.runMonthlyAccrual();
      setIndividualBalances(dataService.getLeaveBalances());
      setAccrualHistory(dataService.getAccrualHistory());
      alert(`Monthly accrual completed! ${entries.length} accrual entries processed.`);
    }
  };

  const handleRunAnnualAccrual = () => {
    if (window.confirm('Run annual accrual for all employees? This will add annual leave allocations.')) {
      const entries = dataService.runAnnualAccrual();
      setIndividualBalances(dataService.getLeaveBalances());
      setAccrualHistory(dataService.getAccrualHistory());
      alert(`Annual accrual completed! ${entries.length} accrual entries processed.`);
    }
  };

  const handleRunYearEndCarryOver = () => {
    if (window.confirm('Run year-end carry-over process? This will process unused leave and apply carry-over caps.')) {
      const entries = dataService.runYearEndCarryOver();
      setIndividualBalances(dataService.getLeaveBalances());
      setCarryOverHistory(dataService.getCarryOverHistory());
      alert(`Year-end carry-over completed! ${entries.length} carry-over entries processed.`);
    }
  };

  const handleSave = () => {
    // Update the data service with new configurations
    dataService.updateLeaveAccrualConfig(leaveAccrualConfig);
    individualBalances.forEach(balance => {
      dataService.updateLeaveBalance(balance.employeeId, 'vacation', 0, balance.vacation.total);
      dataService.updateLeaveBalance(balance.employeeId, 'sick', 0, balance.sick.total);
      dataService.updateLeaveBalance(balance.employeeId, 'personal', 0, balance.personal.total);
      dataService.updateLeaveBalance(balance.employeeId, 'maternity', 0, balance.maternity.total);
      dataService.updateLeaveBalance(balance.employeeId, 'paternity', 0, balance.paternity.total);
    });
    
    onConfigurationChange();
    onClose();
  };

  const leaveTypes = [
    { key: 'vacation' as const, label: 'Vacation Leave', description: 'Annual vacation days' },
    { key: 'sick' as const, label: 'Sick Leave', description: 'Medical leave days' },
    { key: 'personal' as const, label: 'Personal Leave', description: 'Personal time off' },
    { key: 'maternity' as const, label: 'Maternity Leave', description: 'Maternity leave days' },
    { key: 'paternity' as const, label: 'Paternity Leave', description: 'Paternity leave days' }
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-6xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Settings className="w-5 h-5 text-blue-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">Leave Configuration</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab('default')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'default'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Default Configuration
              </div>
            </button>
            <button
              onClick={() => setActiveTab('individual')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'individual'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                Individual Balances ({individualBalances.length})
              </div>
            </button>
            <button
              onClick={() => setActiveTab('accrual')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'accrual'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Accrual & Carry-over
              </div>
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'history'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center gap-2">
                <RotateCcw className="w-4 h-4" />
                History
              </div>
            </button>
          </nav>
        </div>

        {/* Default Configuration Tab */}
        {activeTab === 'default' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Default Leave Allowances</h3>
              <p className="text-sm text-gray-600 mb-6">
                Set the default maximum leave days for each leave type. These will be applied to new employees.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {leaveTypes.map(type => (
                <div key={type.key} className="bg-gray-50 rounded-lg p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{type.label}</h4>
                      <p className="text-sm text-gray-600">{type.description}</p>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Maximum Days
                    </label>
                    <input
                      type="number"
                      value={defaultLeaveConfig[type.key]}
                      onChange={(e) => handleDefaultConfigChange(type.key, parseInt(e.target.value) || 0)}
                      min="0"
                      max="365"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-yellow-50 p-4 rounded-lg">
              <h4 className="text-sm font-medium text-yellow-800 mb-2">Apply to All Employees</h4>
              <p className="text-sm text-yellow-700 mb-3">
                You can apply these default settings to all existing employees. This will update their maximum leave allowances but preserve their used leave days.
              </p>
              <button
                onClick={applyDefaultToAll}
                className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition-colors text-sm"
              >
                Apply Default to All Employees
              </button>
            </div>
          </div>
        )}

        {/* Individual Balances Tab */}
        {activeTab === 'individual' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Individual Employee Balances</h3>
              <p className="text-sm text-gray-600 mb-6">
                Customize leave allowances for individual employees. Changes here override the default configuration.
              </p>
            </div>

            <div className="space-y-6">
              {individualBalances.map(balance => (
                <div key={balance.employeeId} className="bg-white border border-gray-200 rounded-lg p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold">
                        {balance.employeeName.split(' ').map(n => n.charAt(0)).join('')}
                      </span>
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900">{balance.employeeName}</h4>
                      <p className="text-sm text-gray-600">Employee ID: {balance.employeeId}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {leaveTypes.map(type => {
                      const leaveData = balance[type.key];
                      const remaining = leaveData.total - leaveData.used;
                      const usagePercentage = leaveData.total > 0 ? (leaveData.used / leaveData.total) * 100 : 0;
                      
                      return (
                        <div key={type.key} className="bg-gray-50 rounded-lg p-4">
                          <h5 className="font-medium text-gray-900 mb-3">{type.label}</h5>
                          
                          <div className="space-y-3">
                            <div className="grid grid-cols-2 gap-2">
                              <div>
                                <label className="block text-xs font-medium text-gray-600 mb-1">
                                  Used Days
                                </label>
                                <input
                                  type="number"
                                  value={leaveData.used}
                                  onChange={(e) => handleIndividualBalanceChange(
                                    balance.employeeId, 
                                    type.key, 
                                    'used', 
                                    parseInt(e.target.value) || 0
                                  )}
                                  min="0"
                                  max={leaveData.total}
                                  className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                              </div>
                              <div>
                                <label className="block text-xs font-medium text-gray-600 mb-1">
                                  Total Days
                                </label>
                                <input
                                  type="number"
                                  value={leaveData.total}
                                  onChange={(e) => handleIndividualBalanceChange(
                                    balance.employeeId, 
                                    type.key, 
                                    'total', 
                                    parseInt(e.target.value) || 0
                                  )}
                                  min="0"
                                  max="365"
                                  className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                              </div>
                            </div>
                            
                            <div>
                              <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                                <span>Remaining: {remaining} days</span>
                                <span>{Math.round(usagePercentage)}% used</span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div 
                                  className={`h-2 rounded-full ${
                                    usagePercentage > 90 ? 'bg-red-500' :
                                    usagePercentage > 70 ? 'bg-yellow-500' :
                                    'bg-green-500'
                                  }`}
                                  style={{ width: `${Math.min(usagePercentage, 100)}%` }}
                                ></div>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Accrual & Carry-over Tab */}
        {activeTab === 'accrual' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Accrual Configuration</h3>
              <p className="text-sm text-gray-600 mb-6">
                Configure how leave days are automatically accrued and carried over for each leave type.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6">
              {leaveTypes.map(type => (
                <div key={type.key} className="bg-gray-50 rounded-lg p-6">
                  <h4 className="font-medium text-gray-900 mb-4 flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-blue-600" />
                    {type.label}
                  </h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Accrual Rate
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          value={leaveAccrualConfig[type.key].rate}
                          onChange={(e) => handleAccrualConfigChange(type.key, 'rate', e.target.value)}
                          min="0"
                          step="0.01"
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <span className="text-sm text-gray-600">days</span>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Frequency
                      </label>
                      <select
                        value={leaveAccrualConfig[type.key].frequency}
                        onChange={(e) => handleAccrualConfigChange(type.key, 'frequency', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="monthly">Monthly</option>
                        <option value="annually">Annually</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Carry-over Cap
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          value={leaveAccrualConfig[type.key].carryOverCap}
                          onChange={(e) => handleAccrualConfigChange(type.key, 'carryOverCap', e.target.value)}
                          min="0"
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <span className="text-sm text-gray-600">days</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-3 text-sm text-gray-600">
                    {leaveAccrualConfig[type.key].frequency === 'monthly' 
                      ? `Employees will accrue ${leaveAccrualConfig[type.key].rate} days per month (${(leaveAccrualConfig[type.key].rate * 12).toFixed(1)} days annually)`
                      : `Employees will accrue ${leaveAccrualConfig[type.key].rate} days annually`
                    }
                    {leaveAccrualConfig[type.key].carryOverCap > 0 
                      ? `. Maximum ${leaveAccrualConfig[type.key].carryOverCap} days can be carried over to next year.`
                      : '. No carry-over allowed.'
                    }
                  </div>
                </div>
              ))}
            </div>

            {/* Accrual Actions */}
            <div className="bg-blue-50 p-6 rounded-lg">
              <h4 className="text-lg font-medium text-blue-900 mb-4">Accrual Operations</h4>
              <p className="text-sm text-blue-800 mb-4">
                Run accrual and carry-over processes. In a production environment, these would typically run automatically.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button
                  onClick={handleRunMonthlyAccrual}
                  className="flex items-center gap-3 p-4 bg-white rounded-lg border border-blue-200 hover:border-blue-300 hover:bg-blue-50 transition-colors"
                >
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Play className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="text-left">
                    <h5 className="font-medium text-gray-900">Run Monthly Accrual</h5>
                    <p className="text-sm text-gray-600">Add monthly leave accrual</p>
                  </div>
                </button>
                
                <button
                  onClick={handleRunAnnualAccrual}
                  className="flex items-center gap-3 p-4 bg-white rounded-lg border border-green-200 hover:border-green-300 hover:bg-green-50 transition-colors"
                >
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-green-600" />
                  </div>
                  <div className="text-left">
                    <h5 className="font-medium text-gray-900">Run Annual Accrual</h5>
                    <p className="text-sm text-gray-600">Add annual leave allocation</p>
                  </div>
                </button>
                
                <button
                  onClick={handleRunYearEndCarryOver}
                  className="flex items-center gap-3 p-4 bg-white rounded-lg border border-purple-200 hover:border-purple-300 hover:bg-purple-50 transition-colors"
                >
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <RotateCcw className="w-5 h-5 text-purple-600" />
                  </div>
                  <div className="text-left">
                    <h5 className="font-medium text-gray-900">Year-end Carry-over</h5>
                    <p className="text-sm text-gray-600">Process year-end balances</p>
                  </div>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* History Tab */}
        {activeTab === 'history' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Accrual & Carry-over History</h3>
              <p className="text-sm text-gray-600 mb-6">
                View the history of all accrual and carry-over operations performed in the system.
              </p>
            </div>

            {/* Accrual History */}
            <div className="bg-white rounded-lg border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h4 className="text-lg font-semibold text-gray-900">Recent Accrual History</h4>
              </div>
              <div className="divide-y divide-gray-200 max-h-64 overflow-y-auto">
                {accrualHistory.slice(0, 10).map(entry => (
                  <div key={entry.id} className="px-6 py-4 hover:bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <Clock className="w-4 h-4 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {entry.employeeName} - {entry.leaveType.charAt(0).toUpperCase() + entry.leaveType.slice(1)}
                          </p>
                          <p className="text-xs text-gray-500">
                            {entry.accrualType.charAt(0).toUpperCase() + entry.accrualType.slice(1)} accrual on {new Date(entry.accrualDate).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-green-600">+{entry.daysAccrued} days</p>
                        <p className="text-xs text-gray-500">{entry.previousBalance} → {entry.newBalance}</p>
                      </div>
                    </div>
                  </div>
                ))}
                {accrualHistory.length === 0 && (
                  <div className="px-6 py-8 text-center text-gray-500">
                    <Clock className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                    <p>No accrual history found</p>
                  </div>
                )}
              </div>
            </div>

            {/* Carry-over History */}
            <div className="bg-white rounded-lg border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h4 className="text-lg font-semibold text-gray-900">Recent Carry-over History</h4>
              </div>
              <div className="divide-y divide-gray-200 max-h-64 overflow-y-auto">
                {carryOverHistory.slice(0, 10).map(entry => (
                  <div key={entry.id} className="px-6 py-4 hover:bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                          <RotateCcw className="w-4 h-4 text-purple-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {entry.employeeName} - {entry.leaveType.charAt(0).toUpperCase() + entry.leaveType.slice(1)}
                          </p>
                          <p className="text-xs text-gray-500">
                            Year {entry.year} carry-over on {new Date(entry.carryOverDate).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-blue-600">{entry.carriedOverDays} days carried</p>
                        <p className="text-xs text-gray-500">
                          {entry.lostDays > 0 && <span className="text-red-600">{entry.lostDays} lost</span>}
                          {entry.lostDays === 0 && <span className="text-green-600">No days lost</span>}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
                {carryOverHistory.length === 0 && (
                  <div className="px-6 py-8 text-center text-gray-500">
                    <RotateCcw className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                    <p>No carry-over history found</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Accrual & Carry-over Tab */}
        {activeTab === 'accrual' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Accrual Configuration</h3>
              <p className="text-sm text-gray-600 mb-6">
                Configure how leave days are automatically accrued and carried over for each leave type.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6">
              {leaveTypes.map(type => (
                <div key={type.key} className="bg-gray-50 rounded-lg p-6">
                  <h4 className="font-medium text-gray-900 mb-4 flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-blue-600" />
                    {type.label}
                  </h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Accrual Rate
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          value={leaveAccrualConfig[type.key].rate}
                          onChange={(e) => handleAccrualConfigChange(type.key, 'rate', e.target.value)}
                          min="0"
                          step="0.01"
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <span className="text-sm text-gray-600">days</span>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Frequency
                      </label>
                      <select
                        value={leaveAccrualConfig[type.key].frequency}
                        onChange={(e) => handleAccrualConfigChange(type.key, 'frequency', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="monthly">Monthly</option>
                        <option value="annually">Annually</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Carry-over Cap
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          value={leaveAccrualConfig[type.key].carryOverCap}
                          onChange={(e) => handleAccrualConfigChange(type.key, 'carryOverCap', e.target.value)}
                          min="0"
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <span className="text-sm text-gray-600">days</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-3 text-sm text-gray-600">
                    {leaveAccrualConfig[type.key].frequency === 'monthly' 
                      ? `Employees will accrue ${leaveAccrualConfig[type.key].rate} days per month (${(leaveAccrualConfig[type.key].rate * 12).toFixed(1)} days annually)`
                      : `Employees will accrue ${leaveAccrualConfig[type.key].rate} days annually`
                    }
                    {leaveAccrualConfig[type.key].carryOverCap > 0 
                      ? `. Maximum ${leaveAccrualConfig[type.key].carryOverCap} days can be carried over to next year.`
                      : '. No carry-over allowed.'
                    }
                  </div>
                </div>
              ))}
            </div>

            {/* Accrual Actions */}
            <div className="bg-blue-50 p-6 rounded-lg">
              <h4 className="text-lg font-medium text-blue-900 mb-4">Accrual Operations</h4>
              <p className="text-sm text-blue-800 mb-4">
                Run accrual and carry-over processes. In a production environment, these would typically run automatically.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button
                  onClick={handleRunMonthlyAccrual}
                  className="flex items-center gap-3 p-4 bg-white rounded-lg border border-blue-200 hover:border-blue-300 hover:bg-blue-50 transition-colors"
                >
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Play className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="text-left">
                    <h5 className="font-medium text-gray-900">Run Monthly Accrual</h5>
                    <p className="text-sm text-gray-600">Add monthly leave accrual</p>
                  </div>
                </button>
                
                <button
                  onClick={handleRunAnnualAccrual}
                  className="flex items-center gap-3 p-4 bg-white rounded-lg border border-green-200 hover:border-green-300 hover:bg-green-50 transition-colors"
                >
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-green-600" />
                  </div>
                  <div className="text-left">
                    <h5 className="font-medium text-gray-900">Run Annual Accrual</h5>
                    <p className="text-sm text-gray-600">Add annual leave allocation</p>
                  </div>
                </button>
                
                <button
                  onClick={handleRunYearEndCarryOver}
                  className="flex items-center gap-3 p-4 bg-white rounded-lg border border-purple-200 hover:border-purple-300 hover:bg-purple-50 transition-colors"
                >
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <RotateCcw className="w-5 h-5 text-purple-600" />
                  </div>
                  <div className="text-left">
                    <h5 className="font-medium text-gray-900">Year-end Carry-over</h5>
                    <p className="text-sm text-gray-600">Process year-end balances</p>
                  </div>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* History Tab */}
        {activeTab === 'history' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Accrual & Carry-over History</h3>
              <p className="text-sm text-gray-600 mb-6">
                View the history of all accrual and carry-over operations performed in the system.
              </p>
            </div>

            {/* Accrual History */}
            <div className="bg-white rounded-lg border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h4 className="text-lg font-semibold text-gray-900">Recent Accrual History</h4>
              </div>
              <div className="divide-y divide-gray-200 max-h-64 overflow-y-auto">
                {accrualHistory.slice(0, 10).map(entry => (
                  <div key={entry.id} className="px-6 py-4 hover:bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <Clock className="w-4 h-4 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {entry.employeeName} - {entry.leaveType.charAt(0).toUpperCase() + entry.leaveType.slice(1)}
                          </p>
                          <p className="text-xs text-gray-500">
                            {entry.accrualType.charAt(0).toUpperCase() + entry.accrualType.slice(1)} accrual on {new Date(entry.accrualDate).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-green-600">+{entry.daysAccrued} days</p>
                        <p className="text-xs text-gray-500">{entry.previousBalance} → {entry.newBalance}</p>
                      </div>
                    </div>
                  </div>
                ))}
                {accrualHistory.length === 0 && (
                  <div className="px-6 py-8 text-center text-gray-500">
                    <Clock className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                    <p>No accrual history found</p>
                  </div>
                )}
              </div>
            </div>

            {/* Carry-over History */}
            <div className="bg-white rounded-lg border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h4 className="text-lg font-semibold text-gray-900">Recent Carry-over History</h4>
              </div>
              <div className="divide-y divide-gray-200 max-h-64 overflow-y-auto">
                {carryOverHistory.slice(0, 10).map(entry => (
                  <div key={entry.id} className="px-6 py-4 hover:bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                          <RotateCcw className="w-4 h-4 text-purple-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {entry.employeeName} - {entry.leaveType.charAt(0).toUpperCase() + entry.leaveType.slice(1)}
                          </p>
                          <p className="text-xs text-gray-500">
                            Year {entry.year} carry-over on {new Date(entry.carryOverDate).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-blue-600">{entry.carriedOverDays} days carried</p>
                        <p className="text-xs text-gray-500">
                          {entry.lostDays > 0 && <span className="text-red-600">{entry.lostDays} lost</span>}
                          {entry.lostDays === 0 && <span className="text-green-600">No days lost</span>}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
                {carryOverHistory.length === 0 && (
                  <div className="px-6 py-8 text-center text-gray-500">
                    <RotateCcw className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                    <p>No carry-over history found</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

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

export default LeaveConfiguration;