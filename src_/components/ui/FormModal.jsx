

import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import Button from './Button';
import Input from './Input';

const FormModal = ({
  isOpen,
  onClose,
  title,
  fields = [],
  initialData = {},
  onSubmit,
  loading = false
}) => {


  const [formData, setFormData] = useState(initialData);
  const [errors, setErrors] = useState({});

  // Reset form when modal opens
  const shouldResetForm = isOpen && JSON.stringify(formData) !== JSON.stringify(initialData);
  
  useEffect(() => {
    if (shouldResetForm) {
      // Use setTimeout to avoid synchronous state updates in effect
      setTimeout(() => {
        setFormData(initialData);
        setErrors({});
      }, 0);
    }
  }, [shouldResetForm, initialData]);

  const handleInputChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    fields.forEach(field => {
      if (field.required && !formData[field.name]?.trim()) {
        newErrors[field.name] = `${field.label} is required`;
      }
      if (field.type === 'email' && formData[field.name]) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData[field.name])) {
          newErrors[field.name] = 'Please enter a valid email address';
        }
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const handleClose = () => {
    setFormData({});
    setErrors({});
    onClose();
  };

  const renderField = (field) => {
    const { name, label, type = 'text', required, options = [] } = field;
    const value = formData[name] || '';
    const error = errors[name];

    switch (type) {
      case 'select':
        return (
          <div key={name} className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700">
              {label} {required && <span className="text-red-500">*</span>}
            </label>
            <select
              value={value}
              onChange={(e) => handleInputChange(name, e.target.value)}
              className={`px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                error ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">Select {label.toLowerCase()}</option>
              {options.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {error && <span className="text-sm text-red-500">{error}</span>}
          </div>
        );

      case 'textarea':
        return (
          <div key={name} className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700">
              {label} {required && <span className="text-red-500">*</span>}
            </label>
            <textarea
              value={value}
              onChange={(e) => handleInputChange(name, e.target.value)}
              rows={4}
              className={`px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-vertical ${
                error ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder={`Enter ${label.toLowerCase()}`}
            />
            {error && <span className="text-sm text-red-500">{error}</span>}
          </div>
        );

      default:
        return (
          <Input
            key={name}
            label={`${label} ${required ? '*' : ''}`}
            type={type}
            value={value}
            onChange={(e) => handleInputChange(name, e.target.value)}
            className={error ? 'border-red-500' : ''}
            placeholder={`Enter ${label.toLowerCase()}`}
          />
        );
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-4">
            {fields.map(renderField)}
          </div>

          {/* Footer */}
          <div className="flex gap-3 mt-6 pt-4 border-t border-gray-200">
            <Button
              type="submit"
              variant="primary"
              disabled={loading}
              className="flex-1"
            >
              {loading ? 'Saving...' : 'Save'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={loading}
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FormModal;
