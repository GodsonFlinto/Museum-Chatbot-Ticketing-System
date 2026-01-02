import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { register } from "../features/auth/authSlice";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user, loading, error } = useSelector((state) => state.auth);

  useEffect(() => {
    if (user) {
      navigate("/home");
    }
  }, [user, navigate]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const submitHandler = () => {
    if (!name || !email || !password) {
      toast.error("All fields are required");
      return;
    }
    dispatch(register({ name, email, password }));
  };

  const loginHandler = () => {
    navigate("/login");
  };

  return (
    <div 
      style={{ 
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'var(--bg)',
        padding: '20px'
      }}
    >
      <div 
        style={{ 
          width: '100%',
          maxWidth: '420px',
          backgroundColor: 'var(--card)',
          borderRadius: 'var(--radius)',
          boxShadow: 'var(--shadow)',
          border: '1px solid var(--border)',
          padding: '40px 32px'
        }}
      >
        <h3 
          style={{ 
            fontSize: '28px',
            fontWeight: '700',
            color: 'var(--text)',
            textAlign: 'center',
            marginBottom: '32px',
            marginTop: '0'
          }}
        >
          Sign Up
        </h3>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <input
            style={{
              width: '100%',
              padding: '14px 16px',
              backgroundColor: 'var(--bg)',
              border: '2px solid var(--border)',
              borderRadius: 'var(--radius)',
              color: 'var(--text)',
              fontSize: '15px',
              outline: 'none',
              transition: 'border-color 0.2s ease',
              boxSizing: 'border-box'
            }}
            placeholder="Name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onFocus={(e) => e.target.style.borderColor = 'var(--primary)'}
            onBlur={(e) => e.target.style.borderColor = 'var(--border)'}
          />

          <input
            style={{
              width: '100%',
              padding: '14px 16px',
              backgroundColor: 'var(--bg)',
              border: '2px solid var(--border)',
              borderRadius: 'var(--radius)',
              color: 'var(--text)',
              fontSize: '15px',
              outline: 'none',
              transition: 'border-color 0.2s ease',
              boxSizing: 'border-box'
            }}
            placeholder="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onFocus={(e) => e.target.style.borderColor = 'var(--primary)'}
            onBlur={(e) => e.target.style.borderColor = 'var(--border)'}
          />
          
          <input
            style={{
              width: '100%',
              padding: '14px 16px',
              backgroundColor: 'var(--bg)',
              border: '2px solid var(--border)',
              borderRadius: 'var(--radius)',
              color: 'var(--text)',
              fontSize: '15px',
              outline: 'none',
              transition: 'border-color 0.2s ease',
              boxSizing: 'border-box'
            }}
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onFocus={(e) => e.target.style.borderColor = 'var(--primary)'}
            onBlur={(e) => e.target.style.borderColor = 'var(--border)'}
          />
          
          <button
            style={{
              width: '100%',
              padding: '14px 16px',
              backgroundColor: loading ? 'var(--muted)' : 'var(--primary)',
              color: 'white',
              borderRadius: 'var(--radius)',
              border: 'none',
              fontSize: '16px',
              fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'background-color 0.2s ease, transform 0.1s ease',
              marginTop: '8px',
              opacity: loading ? 0.7 : 1
            }}
            onClick={submitHandler}
            disabled={loading}
            onMouseEnter={(e) => !loading && (e.target.style.backgroundColor = 'var(--primary-dark)')}
            onMouseLeave={(e) => !loading && (e.target.style.backgroundColor = 'var(--primary)')}
            onMouseDown={(e) => !loading && (e.target.style.transform = 'scale(0.98)')}
            onMouseUp={(e) => !loading && (e.target.style.transform = 'scale(1)')}
          >
            {loading ? "Creating..." : "Sign Up"}
          </button>

          <div 
            style={{
              textAlign: 'center',
              marginTop: '16px',
              color: 'var(--muted)',
              fontSize: '14px'
            }}
          >
            Already have an account?{' '}
            <span
              onClick={loginHandler}
              style={{
                color: 'var(--primary)',
                fontWeight: '600',
                cursor: 'pointer',
                textDecoration: 'none'
              }}
              onMouseEnter={(e) => e.target.style.textDecoration = 'underline'}
              onMouseLeave={(e) => e.target.style.textDecoration = 'none'}
            >
              Login
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;