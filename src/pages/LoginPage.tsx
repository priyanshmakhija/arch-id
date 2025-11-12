import React, { useState } from 'react';
import { useLocation, useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { loginUser } from '../utils/api';

const credentialHints = [
  { username: 'admin', password: 'admin', description: 'Full management access' },
  { username: 'archaeologist', password: 'archaeologist', description: 'Add/edit artifacts' },
  { username: 'researcher', password: 'researcher', description: 'Read-only access' },
  { username: 'user', password: 'user', description: 'Basic browsing' },
];

const LoginPage: React.FC = () => {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const from = (location.state as { from?: Location })?.from?.pathname ?? '/';

  if (user) {
    return <Navigate to={from} replace />;
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    if (!username.trim() || !password.trim()) {
      setError('Please enter both username and password');
      return;
    }

    setIsSubmitting(true);
    try {
      const authUser = await loginUser(username.trim(), password.trim());
      login(authUser);
      navigate(from, { replace: true });
    } catch (err) {
      console.error(err);
      setError('Invalid username or password. Try one of the sample accounts below.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-16">
      <div className="bg-white shadow rounded-xl p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">Sign In</h1>
        <p className="text-gray-600 text-center mb-8">
          Use one of the prototype accounts below. Role-based permissions are determined by the account you choose.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="username" className="label">
              Username
            </label>
            <input
              id="username"
              type="text"
              className="input-field"
              placeholder="e.g., admin"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              autoComplete="username"
            />
          </div>

          <div>
            <label htmlFor="password" className="label">
              Password
            </label>
            <input
              id="password"
              type="password"
              className="input-field"
              placeholder="e.g., admin"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="current-password"
            />
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button type="submit" className="btn-primary w-full" disabled={isSubmitting}>
            {isSubmitting ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-8">
          <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-3">
            Sample Accounts
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {credentialHints.map((credential) => (
              <div key={credential.username} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                <p className="text-sm font-semibold text-gray-900 capitalize">{credential.username}</p>
                <p className="text-xs text-gray-500">Password: {credential.password}</p>
                <p className="text-xs text-gray-600 mt-2">{credential.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

