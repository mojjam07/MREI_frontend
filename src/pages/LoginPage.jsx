import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GraduationCap } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [role, setRole] = useState('student');

  const handleLogin = () => {
    login({ name: 'Demo User', role });
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-6">
      <Card className="w-full max-w-md">
        <div className="text-center mb-8">
          <GraduationCap className="w-16 h-16 text-blue-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800">Welcome Back</h2>
          <p className="text-gray-600">Sign in to continue to EduPlatform</p>
        </div>

        <div className="space-y-4">
          <Input label="Email" type="email" placeholder="your@email.com" />
          <Input label="Password" type="password" placeholder="••••••••" />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="student">Student</option>
              <option value="tutor">Tutor</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <Button onClick={handleLogin} className="w-full">Sign In</Button>

          <p className="text-center text-sm text-gray-600">
            Don't have an account? <span onClick={() => navigate('/signup')} className="text-blue-600 hover:underline cursor-pointer">Sign up</span>
          </p>
        </div>
      </Card>
    </div>
  );
};

export default LoginPage;
