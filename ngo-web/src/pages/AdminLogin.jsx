import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { adminAPI } from '../utils/api';

import Input from '../components/Input';
import Button from '../components/Button1';
import Card from '../components/Card1';

const AdminLogin = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.username || !formData.password) {
      toast.error('Please enter username and password');
      return;
    }

    setLoading(true);

    try {
      const response = await adminAPI.login(formData);

      if (response.data.success) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem(
          'adminUsername',
          response.data.admin.username
        );

        toast.success('Login successful!');

        navigate('/admin/dashboard', {
          replace: true,
        });
      }
    } catch (error) {
      toast.error(error.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8 animate-slide-down">
          <h1 className="text-4xl font-bold text-forest mb-2">
            🔐 Admin Login
          </h1>
          <p className="text-gray-600">
            Swadhyay Seva Foundation
          </p>
          <p className="text-sm text-gray-500 mt-1">
            Administration Portal
          </p>
        </div>
        <Card className="animate-scale-in">
          <form onSubmit={handleSubmit}>
            <Input
              label="Username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Enter admin username"
              icon="👤"
              autoComplete="username"
              required
            />
            <Input
              label="Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter password"
              icon="🔒"
              autoComplete="current-password"
              required
            />
            <Button
              type="submit"
              fullWidth
              size="large"
              loading={loading}
            >
              {loading ? 'Logging in...' : 'Login'}
            </Button>
          </form>
          <div className="mt-6 text-center">
            <a
              href="/"
              className="text-sm text-primary hover:underline"
            >
              ← Back to Home
            </a>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AdminLogin;