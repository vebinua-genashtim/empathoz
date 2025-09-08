import React, { useState, useEffect } from 'react';
import { X, Plus, Edit, Trash2, Save, Building2 } from 'lucide-react';
import { dataService } from '../../../services/dataService';

interface DepartmentManagerProps {
  isOpen: boolean;
  onClose: () => void;
  onDepartmentsChange: () => void;
}

const DepartmentManager: React.FC<DepartmentManagerProps> = ({
  isOpen,
  onClose,
  onDepartmentsChange
}) => {
  const [departments, setDepartments] = useState<string[]>([]);
  const [newDepartment, setNewDepartment] = useState('');
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingValue, setEditingValue] = useState('');

  useEffect(() => {
    if (isOpen) {
      setDepartments(dataService.getDepartments());
    }
  }, [isOpen]);

  const handleAddDepartment = () => {
    if (newDepartment.trim() && !departments.includes(newDepartment.trim())) {
      const success = dataService.addDepartment(newDepartment.trim());
      if (success) {
        setDepartments(dataService.getDepartments());
        setNewDepartment('');
        onDepartmentsChange();
      }
    }
  };

  const handleEditDepartment = (index: number) => {
    setEditingIndex(index);
    setEditingValue(departments[index]);
  };

  const handleSaveEdit = () => {
    if (editingIndex !== null && editingValue.trim() && !departments.includes(editingValue.trim())) {
      const oldName = departments[editingIndex];
      const success = dataService.updateDepartment(oldName, editingValue.trim());
      if (success) {
        setDepartments(dataService.getDepartments());
        setEditingIndex(null);
        setEditingValue('');
        onDepartmentsChange();
      }
    }
  };

  const handleCancelEdit = () => {
    setEditingIndex(null);
    setEditingValue('');
  };

  const handleDeleteDepartment = (department: string) => {
    if (window.confirm(`Are you sure you want to delete the "${department}" department? This action cannot be undone.`)) {
      const success = dataService.deleteDepartment(department);
      if (success) {
        setDepartments(dataService.getDepartments());
        onDepartmentsChange();
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent, action: 'add' | 'save') => {
    if (e.key === 'Enter') {
      if (action === 'add') {
        handleAddDepartment();
      } else {
        handleSaveEdit();
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Building2 className="w-5 h-5 text-blue-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">Manage Departments</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Add New Department */}
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="text-sm font-medium text-gray-700 mb-3">Add New Department</h3>
          <div className="flex gap-2">
            <input
              type="text"
              value={newDepartment}
              onChange={(e) => setNewDepartment(e.target.value)}
              onKeyPress={(e) => handleKeyPress(e, 'add')}
              placeholder="Enter department name"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              onClick={handleAddDepartment}
              disabled={!newDepartment.trim() || departments.includes(newDepartment.trim())}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add
            </button>
          </div>
          {newDepartment.trim() && departments.includes(newDepartment.trim()) && (
            <p className="text-sm text-red-600 mt-1">Department already exists</p>
          )}
        </div>

        {/* Existing Departments */}
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-3">
            Existing Departments ({departments.length})
          </h3>
          <div className="space-y-2">
            {departments.map((department, index) => (
              <div key={department} className="flex items-center gap-2 p-3 bg-white border border-gray-200 rounded-lg">
                {editingIndex === index ? (
                  <>
                    <input
                      type="text"
                      value={editingValue}
                      onChange={(e) => setEditingValue(e.target.value)}
                      onKeyPress={(e) => handleKeyPress(e, 'save')}
                      className="flex-1 px-3 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <button
                      onClick={handleSaveEdit}
                      disabled={!editingValue.trim() || (editingValue.trim() !== department && departments.includes(editingValue.trim()))}
                      className="p-1 text-green-600 hover:text-green-700 disabled:text-gray-400 disabled:cursor-not-allowed"
                    >
                      <Save className="w-4 h-4" />
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="p-1 text-gray-600 hover:text-gray-700"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </>
                ) : (
                  <>
                    <span className="flex-1 text-gray-900">{department}</span>
                    <button
                      onClick={() => handleEditDepartment(index)}
                      className="p-1 text-blue-600 hover:text-blue-700"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteDepartment(department)}
                      className="p-1 text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </>
                )}
              </div>
            ))}
          </div>
          {departments.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <Building2 className="w-8 h-8 mx-auto mb-2 text-gray-400" />
              <p>No departments configured</p>
            </div>
          )}
        </div>

        <div className="flex justify-end mt-6 pt-4 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default DepartmentManager;