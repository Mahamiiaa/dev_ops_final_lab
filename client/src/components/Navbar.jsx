import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();

  return (
    <nav className="navbar">
      <div className="container navbar-content">
        <div className="navbar-brand">
          <span className="navbar-logo">📋</span>
          <h1 className="navbar-title">TaskManager</h1>
        </div>

        <div className="navbar-right">
          <button
            className="btn btn-icon theme-toggle"
            onClick={toggleTheme}
            title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {isDark ? '☀️' : '🌙'}
          </button>

          {user && (
            <div className="navbar-user">
              <span className="navbar-user-icon">👤</span>
              <span className="navbar-user-name">{user.name}</span>
              <button onClick={logout} className="btn btn-logout">
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
