import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Database, Users, Search, Plus, Edit, Trash2, Eye, Grid, List, Settings, Download, TrendingUp } from 'lucide-react';
import { Shield } from 'lucide-react';
import { dataService, Employee } from '../../services/dataService';
import EmployeeCard from './components/EmployeeCard';
import DepartmentManager from '../ats/components/DepartmentManager';
import HRDBAdvancedExportPage from './components/HRDBAdvancedExportPage';
import EmployeeProfile from './components/EmployeeProfile';
import FileAccessManager from './components/FileAccessManager';

const HRDatabase: React.FC = () => {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState<Employee[]>([
    {
      id: '1',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@empathoz.com',
      phone: '+1 (555) 123-4567',
      department: 'Engineering',
      position: 'Senior Software Engineer',
      hireDate: '2023-03-15',
      status: 'active',
      salary: 95000,
      managerId: '2',
      city: 'San Francisco',
      country: 'United States',
      experience: 8,
      cvUrl: 'https://example.com/documents/john-doe-cv.pdf',
      certificationsUrl: 'https://example.com/documents/john-doe-certifications.pdf',
      portfolioUrl: 'https://johndoe.dev',
      profilePhotoUrl: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop',
      notes: 'Excellent senior developer with strong leadership skills. Mentors junior developers and contributes to architectural decisions. Certified in AWS and React development.'
    },
    {
      id: '2',
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane.smith@empathoz.com',
      phone: '+1 (555) 987-6543',
      department: 'Engineering',
      position: 'Engineering Manager',
      hireDate: '2022-01-10',
      status: 'active',
      salary: 125000,
      city: 'Seattle',
      country: 'United States',
      experience: 12,
      profilePhotoUrl: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop',
      notes: 'Experienced engineering manager with excellent team leadership skills.'
    },
    {
      id: '3',
      firstName: 'Mike',
      lastName: 'Johnson',
      email: 'mike.johnson@empathoz.com',
      phone: '+1 (555) 456-7890',
      department: 'Marketing',
      position: 'Marketing Specialist',
      hireDate: '2023-06-20',
      status: 'active',
      salary: 65000,
      managerId: '4',
      city: 'Austin',
      country: 'United States',
      experience: 4,
      profilePhotoUrl: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop',
      notes: 'Creative marketing specialist with strong digital marketing background.'
    },
    {
      id: '4',
      firstName: 'Sarah',
      lastName: 'Wilson',
      email: 'sarah.wilson@empathoz.com',
      phone: '+1 (555) 321-0987',
      department: 'Marketing',
      position: 'Marketing Director',
      hireDate: '2021-09-05',
      status: 'active',
      salary: 105000,
      city: 'New York',
      country: 'United States',
      experience: 10,
      profilePhotoUrl: 'https://images.pexels.com/photos/1181424/pexels-photo-1181424.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop',
      notes: 'Strategic marketing leader with proven track record in brand development.'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');
  const [showDepartmentManager, setShowDepartmentManager] = useState(false);
  const [showAdvancedExport, setShowAdvancedExport] = useState(false);
  const [viewingEmployee, setViewingEmployee] = useState<Employee | undefined>();
  const [showFileAccessManager, setShowFileAccessManager] = useState(false);

  const departments = [...new Set(employees.map(emp => emp.department))];
  const statuses = ['active', 'inactive', 'terminated'];

  const filteredEmployees = employees.filter(employee => {
    const matchesSearch = 
      employee.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.position.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesDepartment = selectedDepartment === 'all' || employee.department === selectedDepartment;
    const matchesStatus = selectedStatus === 'all' || employee.status === selectedStatus;

    return matchesSearch && matchesDepartment && matchesStatus;
  });

  const handleEditEmployee = (employee: Employee) => {
    navigate(`/hrdb/employee/edit/${employee.id}`);
  };

  const handleAddEmployee = () => {
    navigate('/hrdb/employee/add');
  };

  const handleDeleteEmployee = (id: string) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      setEmployees(employees.filter(emp => emp.id !== id));
    }
  };

  const handleViewEmployee = (employee: Employee) => {
    setViewingEmployee(employee);
  };

  const handleExportEmployees = () => {
    const csvContent = [
      ['First Name', 'Last Name', 'Email', 'Phone', 'Department', 'Position', 'Hire Date', 'Status', 'Salary', 'Manager ID', 'City', 'Country', 'Experience', 'Notes'].join(','),
      ...filteredEmployees.map(employee => [
        `"${employee.firstName}"`,
        `"${employee.lastName}"`,
        employee.email,
        employee.phone || '',
        employee.department,
        `"${employee.position}"`,
        employee.hireDate,
        employee.status,
        employee.salary ? employee.salary.toString() : '',
        employee.managerId || '',
        employee.city || '',
        employee.country || '',
        employee.experience ? employee.experience.toString() : '',
        employee.notes ? `"${employee.notes.replace(/"/g, '""')}"` : ''
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `employees-export-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-yellow-100 text-yellow-800';
      case 'terminated': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getDepartmentStats = () => {
    const stats = departments.map(dept => ({
      department: dept,
      count: employees.filter(emp => emp.department === dept && emp.status === 'active').length,
      avgSalary: Math.round(
        employees
          .filter(emp => emp.department === dept && emp.status === 'active' && emp.salary)
          .reduce((sum, emp) => sum + (emp.salary || 0), 0) /
        employees.filter(emp => emp.department === dept && emp.status === 'active' && emp.salary).length
      )
    }));
    return stats;
  };

  const departmentStats = getDepartmentStats();

  return (
    <div className="flex-1 bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-8 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">HR Database</h1>
            <p className="text-gray-600 mt-1">Centralized employee records and HR data management</p>
          </div>
          <div className="flex items-center gap-4">
            {/* View Toggle */}
            <div className="flex items-center bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('cards')}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === 'cards' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500'
                }`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === 'table' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500'
                }`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
            
            <button 
              onClick={() => {
                handleAddEmployee();
              }}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Employee
            </button>
            
            <button
              onClick={() => setShowDepartmentManager(true)}
              className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors flex items-center gap-2"
            >
              <Settings className="w-4 h-4" />
              Manage Departments
            </button>
            
            <button
              onClick={() => setShowFileAccessManager(true)}
              className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
            >
              <Shield className="w-4 h-4" />
              File Access Control
            </button>
          </div>
        </div>
      </div>

      <div className="px-8 py-6">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Employees</p>
                <p className="text-2xl font-bold text-gray-900">{employees.filter(emp => emp.status === 'active').length}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Departments</p>
                <p className="text-2xl font-bold text-gray-900">{departments.length}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Database className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg. Salary</p>
                <p className="text-2xl font-bold text-gray-900">
                  ${Math.round(employees.filter(emp => emp.salary).reduce((sum, emp) => sum + (emp.salary || 0), 0) / employees.filter(emp => emp.salary).length).toLocaleString()}
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Database className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">New Hires (YTD)</p>
                <p className="text-2xl font-bold text-gray-900">
                  {employees.filter(emp => new Date(emp.hireDate).getFullYear() === 2025).length}
                </p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Department Overview */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Department Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {departmentStats.map(stat => (
              <div key={stat.department} className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-medium text-gray-900">{stat.department}</h3>
                <div className="mt-2 space-y-1">
                  <p className="text-sm text-gray-600">{stat.count} employees</p>
                  <p className="text-sm text-gray-600">Avg: ${stat.avgSalary?.toLocaleString() || 'N/A'}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search employees..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex gap-4">
              <select
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Departments</option>
                {departments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                {statuses.map(status => (
                  <option key={status} value={status}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </option>
                ))}
              </select>
              <button 
                onClick={handleExportEmployees}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                title="Export filtered employees to CSV"
              >
                <Download className="w-4 h-4" />
                Export
              </button>
              <button 
                onClick={() => setShowAdvancedExport(true)}
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2"
                title="Advanced export with detailed filtering"
              >
                <Settings className="w-4 h-4" />
                Advanced Export
              </button>
            </div>
          </div>
        </div>

        {/* Employee Table */}
        {/* Employees Display */}
        {viewMode === 'cards' ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredEmployees.map(employee => (
              <EmployeeCard
                key={employee.id}
                employee={employee}
                onView={handleViewEmployee}
                onEdit={handleEditEmployee}
                onDelete={handleDeleteEmployee}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Employee
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Position
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Department
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Hire Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Salary
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredEmployees.map((employee) => (
                  <tr key={employee.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {employee.profilePhotoUrl ? (
                          <img
                            src={employee.profilePhotoUrl}
                            alt={`${employee.firstName} ${employee.lastName}`}
                            className="w-10 h-10 rounded-full object-cover border-2 border-gray-200"
                          />
                        ) : (
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                            <span className="text-white font-semibold text-sm">
                              {employee.firstName.charAt(0)}{employee.lastName.charAt(0)}
                            </span>
                          </div>
                        )}
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {employee.firstName} {employee.lastName}
                          </div>
                          <div className="text-sm text-gray-500">{employee.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{employee.position}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{employee.department}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(employee.hireDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(employee.status)}`}>
                        {employee.status.charAt(0).toUpperCase() + employee.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {employee.salary ? `$${employee.salary.toLocaleString()}` : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => handleViewEmployee(employee)}
                          className="text-blue-600 hover:text-blue-900 p-1 hover:bg-blue-50 rounded"
                          title="View Profile"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleEditEmployee(employee)}
                          className="text-indigo-600 hover:text-indigo-900 p-1 hover:bg-indigo-50 rounded"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDeleteEmployee(employee.id)}
                          className="text-red-600 hover:text-red-900 p-1 hover:bg-red-50 rounded"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        )}

        {filteredEmployees.length === 0 && (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No employees found</h3>
            <p className="text-gray-600">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>

      {/* Department Manager Modal */}
      <DepartmentManager
        isOpen={showDepartmentManager}
        onClose={() => setShowDepartmentManager(false)}
        onDepartmentsChange={() => {
          // Refresh employees to reflect any department changes
          setEmployees(dataService.getEmployees());
        }}
      />

      {/* Advanced Export Page */}
      {showAdvancedExport && (
        <div className="fixed inset-0 bg-white z-50">
          <HRDBAdvancedExportPage 
            onBack={() => setShowAdvancedExport(false)}
            employees={employees}
            departments={departments}
            positions={[...new Set(employees.map(emp => emp.position))]}
            statuses={statuses}
          />
        </div>
      )}

      {/* Employee Profile Modal */}
      {/* Employee Profile Page */}
      {viewingEmployee && (
        <div className="fixed inset-0 bg-white z-50">
          <EmployeeProfile
            employee={viewingEmployee}
            onBack={() => setViewingEmployee(undefined)}
            onEdit={(employee) => {
              setViewingEmployee(undefined);
              handleEditEmployee(employee);
            }}
          />
        </div>
      )}

      {/* File Access Manager Modal */}
      <FileAccessManager
        isOpen={showFileAccessManager}
        onClose={() => setShowFileAccessManager(false)}
        onConfigChange={() => {
          // Refresh employees to reflect any access changes
          setEmployees([...employees]);
        }}
      />
    </div>
  );
};

export default HRDatabase;