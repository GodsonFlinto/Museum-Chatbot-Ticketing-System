import { Link, useLocation } from "react-router-dom";

const Sidebar = () => {
  const location = useLocation();

  const menu = [
    { name: "Dashboard", path: "/admin/dashboard", icon: "📊" },
    { name: "Museums", path: "/admin/museums", icon: "🏛️" },
    { name: "Bookings", path: "/admin/bookings", icon: "🎫" },
    { name: "Payments", path: "/admin/payments", icon: "💳" },
    { name: "Users", path: "/admin/users", icon: "👥" },
    { name: "Chatbot", path: "/admin/chatbot", icon: "💬" },
  ];

  return (
    <div style={{
      width: '256px',
      height: '100vh',
      background: 'linear-gradient(180deg, #1a202c 0%, #2d3748 100%)',
      position: 'fixed',
      left: 0,
      top: 0,
      display: 'flex',
      flexDirection: 'column',
      borderRight: '1px solid #2d3748'
    }}>
      {/* Logo/Brand Section */}
      <div style={{
        padding: '28px 24px',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          marginBottom: '8px'
        }}>
          <div style={{
            width: '40px',
            height: '40px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '24px'
          }}>
            🏛️
          </div>
          <h1 style={{
            fontSize: '22px',
            fontWeight: '800',
            color: 'white',
            margin: 0,
            letterSpacing: '-0.5px'
          }}>
            Museum
          </h1>
        </div>
        <p style={{
          fontSize: '13px',
          color: '#a0aec0',
          margin: 0,
          paddingLeft: '52px'
        }}>
          Admin Panel
        </p>
      </div>

      {/* Navigation Menu */}
      <nav style={{
        flex: 1,
        padding: '24px 16px',
        overflowY: 'auto'
      }}>
        <ul style={{
          listStyle: 'none',
          padding: 0,
          margin: 0,
          display: 'flex',
          flexDirection: 'column',
          gap: '8px'
        }}>
          {menu.map((item) => {
            const isActive = location.pathname === item.path;
            
            return (
              <li key={item.name}>
                <Link
                  to={item.path}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '12px 16px',
                    borderRadius: '10px',
                    textDecoration: 'none',
                    color: isActive ? 'white' : '#cbd5e0',
                    backgroundColor: isActive ? 'rgba(102, 126, 234, 0.2)' : 'transparent',
                    border: isActive ? '1px solid rgba(102, 126, 234, 0.3)' : '1px solid transparent',
                    fontSize: '15px',
                    fontWeight: isActive ? '600' : '500',
                    transition: 'all 0.2s ease',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
                      e.currentTarget.style.color = 'white';
                      e.currentTarget.style.transform = 'translateX(4px)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.color = '#cbd5e0';
                      e.currentTarget.style.transform = 'translateX(0)';
                    }
                  }}
                >
                  {/* Active Indicator */}
                  {isActive && (
                    <div style={{
                      position: 'absolute',
                      left: 0,
                      top: '50%',
                      transform: 'translateY(-50%)',
                      width: '4px',
                      height: '60%',
                      background: 'linear-gradient(180deg, #667eea 0%, #764ba2 100%)',
                      borderRadius: '0 4px 4px 0'
                    }}></div>
                  )}
                  
                  {/* Icon */}
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '8px',
                    backgroundColor: isActive ? 'rgba(102, 126, 234, 0.3)' : 'rgba(255, 255, 255, 0.05)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '18px',
                    flexShrink: 0
                  }}>
                    {item.icon}
                  </div>
                  
                  {/* Label */}
                  <span>{item.name}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer Section */}
      <div style={{
        padding: '20px',
        borderTop: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        <div style={{
          padding: '16px',
          backgroundColor: 'rgba(102, 126, 234, 0.1)',
          borderRadius: '12px',
          border: '1px solid rgba(102, 126, 234, 0.2)'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            marginBottom: '8px'
          }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '8px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '18px'
            }}>
              ℹ️
            </div>
            <div>
              <p style={{
                fontSize: '13px',
                fontWeight: '600',
                color: 'white',
                margin: 0,
                lineHeight: 1
              }}>
                Need Help?
              </p>
              <p style={{
                fontSize: '12px',
                color: '#a0aec0',
                margin: 0,
                marginTop: '4px'
              }}>
                Contact Support
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;