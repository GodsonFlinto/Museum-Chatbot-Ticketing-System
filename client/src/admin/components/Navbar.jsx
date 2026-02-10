import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("adminToken");
    navigate("/admin/login");
  };

  return (
    <div style={{
      height: '72px',
      backgroundColor: 'white',
      borderBottom: '1px solid #e2e8f0',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '0 40px',
      position: 'sticky',
      top: 0,
      zIndex: 10
    }}>
      {/* Left Side - Title and Search */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
        <h2 style={{
          fontSize: '24px',
          fontWeight: '700',
          color: '#1a202c',
          margin: 0,
          letterSpacing: '-0.5px'
        }}>
          Museum Admin
        </h2>
      </div>

      {/* Right Side - User Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        {/* Notifications */}
        {/* <button
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '10px',
            border: 'none',
            backgroundColor: '#f8f9fa',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '20px',
            transition: 'all 0.2s ease',
            position: 'relative'
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#e9ecef'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#f8f9fa'}
        >
          🔔
          <span style={{
            position: 'absolute',
            top: '8px',
            right: '8px',
            width: '8px',
            height: '8px',
            backgroundColor: '#ef4444',
            borderRadius: '50%',
            border: '2px solid white'
          }}></span>
        </button> */}

        {/* Admin Profile */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          padding: '8px 16px 8px 8px',
          backgroundColor: '#f8f9fa',
          borderRadius: '12px',
          cursor: 'pointer',
          transition: 'all 0.2s ease'
        }}
        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#e9ecef'}
        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#f8f9fa'}
        >
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '18px',
            color: 'white',
            fontWeight: '600'
          }}>
            A
          </div>
          <div>
            <p style={{
              fontSize: '14px',
              fontWeight: '600',
              color: '#1a202c',
              margin: 0,
              lineHeight: 1
            }}>
              Admin User
            </p>
            <p style={{
              fontSize: '12px',
              color: '#718096',
              margin: 0,
              marginTop: '2px'
            }}>
              Administrator
            </p>
          </div>
        </div>

        {/* Logout Button */}
        <button
          onClick={logout}
          style={{
            padding: '10px 20px',
            backgroundColor: 'white',
            color: '#dc2626',
            border: '2px solid #dc2626',
            borderRadius: '10px',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#dc2626';
            e.currentTarget.style.color = 'white';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'white';
            e.currentTarget.style.color = '#dc2626';
          }}
        >
          <span>🚪</span>
          Logout
        </button>
      </div>
    </div>
  );
};

export default Navbar;