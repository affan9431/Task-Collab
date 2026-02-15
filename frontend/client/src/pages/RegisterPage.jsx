import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuthContext from '../hooks/useAuth';

const RegisterPage = () => {
  const { register } = useAuthContext();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');

  const submit = async (event) => {
    event.preventDefault();
    setError('');
    try {
      await register(form);
      navigate('/boards');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-grid px-6">
      <div className="glass-panel w-full max-w-md rounded-3xl p-8">
        <h1 className="text-2xl font-semibold">Create your workspace</h1>
        <p className="mt-2 text-sm text-ink-700">Start collaborating instantly.</p>
        <form onSubmit={submit} className="mt-6 space-y-4">
          <input
            type="text"
            placeholder="Name"
            value={form.name}
            onChange={(event) => setForm({ ...form, name: event.target.value })}
            className="w-full rounded-2xl border border-ink-900/20 px-4 py-3"
          />
          <input
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(event) => setForm({ ...form, email: event.target.value })}
            className="w-full rounded-2xl border border-ink-900/20 px-4 py-3"
          />
          <input
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(event) => setForm({ ...form, password: event.target.value })}
            className="w-full rounded-2xl border border-ink-900/20 px-4 py-3"
          />
          {error && <p className="text-sm text-rose-600">{error}</p>}
          <button
            type="submit"
            className="w-full rounded-2xl bg-ink-900 px-4 py-3 text-white font-semibold"
          >
            Register
          </button>
        </form>
        <p className="mt-4 text-sm text-ink-700">
          Already have an account?{' '}
          <Link className="font-semibold underline" to="/login">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
