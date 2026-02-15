import { Link } from 'react-router-dom';
import useAuthContext from '../hooks/useAuth';

const Navbar = () => {
  const { user, logout } = useAuthContext();

  return (
    <div className="flex items-center justify-between px-6 py-4 glass-panel rounded-2xl">
      <Link to="/boards" className="text-xl font-display font-semibold">
        Task Collab
      </Link>
      <div className="flex items-center gap-4">
        <span className="text-sm text-ink-700">{user?.name}</span>
        <button
          type="button"
          onClick={logout}
          className="rounded-full border border-ink-900 px-4 py-2 text-sm font-semibold transition hover:bg-ink-900 hover:text-white"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Navbar;
