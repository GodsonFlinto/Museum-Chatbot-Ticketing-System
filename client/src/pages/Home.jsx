import { useState } from "react";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const [hoveredFeature, setHoveredFeature] = useState(null);

  const navigate = useNavigate()
  const navhandler = () => {
    navigate("/chat")
  }
  const features = [
    {
      icon: "🎫",
      title: "Easy Booking",
      description: "Book tickets instantly with our AI-powered assistant"
    },
    {
      icon: "🤖",
      title: "24/7 Support",
      description: "Get answers anytime with our intelligent chatbot"
    },
    {
      icon: "🏛️",
      title: "Virtual Tours",
      description: "Explore collections from anywhere in the world"
    },
    {
      icon: "💳",
      title: "Secure Payment",
      description: "Safe and encrypted payment processing"
    }
  ];

  const exhibitions = [
    {
      image: "🎨",
      title: "Modern Art Gallery",
      date: "Available Now"
    },
    {
      image: "🏺",
      title: "Ancient Civilizations",
      date: "Available Now"
    },
    {
      image: "🦖",
      title: "Natural History",
      date: "Available Now"
    }
  ];

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "var(--bg)" }}>
      {/* HEADER/NAVBAR */}
      <nav
        style={{
          padding: "20px 40px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          backgroundColor: "var(--card)",
          borderBottom: "1px solid var(--border)",
          boxShadow: "var(--shadow)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <span style={{ fontSize: "32px" }}>🏛️</span>
          <h1
            style={{
              margin: 0,
              fontSize: "24px",
              fontWeight: "700",
              color: "var(--text)",
            }}
          >
            Museum Portal
          </h1>
        </div>
        <div style={{ display: "flex", gap: "24px", alignItems: "center" }}>
          <a
            href="#features"
            style={{
              color: "var(--text)",
              textDecoration: "none",
              fontSize: "15px",
              fontWeight: "500",
            }}
          >
            Features
          </a>
          <a
            href="#exhibitions"
            style={{
              color: "var(--text)",
              textDecoration: "none",
              fontSize: "15px",
              fontWeight: "500",
            }}
          >
            Exhibitions
          </a>
          <button
            onClick={navhandler}
            style={{
              padding: "10px 24px",
              borderRadius: "var(--radius)",
              border: "none",
              backgroundColor: "var(--primary)",
              color: "#fff",
              cursor: "pointer",
              fontSize: "15px",
              fontWeight: "600",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) =>
              (e.target.style.backgroundColor = "var(--primary-dark)")
            }
            onMouseLeave={(e) =>
              (e.target.style.backgroundColor = "var(--primary)")
            }
          >
            Get Started
          </button>
        </div>
      </nav>

      {/* HERO SECTION */}
      <div
        style={{
          padding: "80px 40px",
          textAlign: "center",
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >
        <h1
          style={{
            fontSize: "56px",
            fontWeight: "800",
            color: "var(--text)",
            margin: "0 0 24px 0",
            lineHeight: "1.2",
          }}
        >
          Experience Culture with
          <br />
          <span style={{ color: "var(--primary)" }}>AI-Powered</span> Assistance
        </h1>
        <p
          style={{
            fontSize: "20px",
            color: "var(--muted)",
            margin: "0 0 40px 0",
            lineHeight: "1.6",
            maxWidth: "700px",
            marginLeft: "auto",
            marginRight: "auto",
          }}
        >
          Book tickets, explore exhibitions, and get instant support through our
          intelligent museum assistant. Your cultural journey starts here.
        </p>
        <div style={{ display: "flex", gap: "16px", justifyContent: "center" }}>
          <button
          onClick={navhandler}
            style={{
              padding: "16px 32px",
              borderRadius: "var(--radius)",
              border: "none",
              backgroundColor: "var(--primary)",
              color: "#fff",
              cursor: "pointer",
              fontSize: "16px",
              fontWeight: "600",
              transition: "all 0.2s ease",
              boxShadow: "0 4px 12px rgba(79, 70, 229, 0.3)",
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = "var(--primary-dark)";
              e.target.style.transform = "translateY(-2px)";
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = "var(--primary)";
              e.target.style.transform = "translateY(0)";
            }}
          >
            Start Chatting
          </button>
          <button
            style={{
              padding: "16px 32px",
              borderRadius: "var(--radius)",
              border: "2px solid var(--border)",
              backgroundColor: "transparent",
              color: "var(--text)",
              cursor: "pointer",
              fontSize: "16px",
              fontWeight: "600",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.target.style.borderColor = "var(--primary)";
              e.target.style.backgroundColor = "var(--bg)";
            }}
            onMouseLeave={(e) => {
              e.target.style.borderColor = "var(--border)";
              e.target.style.backgroundColor = "transparent";
            }}
          >
            Learn More
          </button>
        </div>
      </div>

      {/* FEATURES SECTION */}
      <div
        id="features"
        style={{
          padding: "80px 40px",
          backgroundColor: "var(--card)",
          borderTop: "1px solid var(--border)",
          borderBottom: "1px solid var(--border)",
        }}
      >
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <h2
            style={{
              fontSize: "40px",
              fontWeight: "700",
              color: "var(--text)",
              textAlign: "center",
              margin: "0 0 16px 0",
            }}
          >
            Why Choose Us?
          </h2>
          <p
            style={{
              fontSize: "18px",
              color: "var(--muted)",
              textAlign: "center",
              margin: "0 0 60px 0",
            }}
          >
            Everything you need for a seamless museum experience
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
              gap: "32px",
            }}
          >
            {features.map((feature, idx) => (
              <div
                key={idx}
                onMouseEnter={() => setHoveredFeature(idx)}
                onMouseLeave={() => setHoveredFeature(null)}
                style={{
                  padding: "32px",
                  borderRadius: "var(--radius)",
                  border: "2px solid var(--border)",
                  backgroundColor: hoveredFeature === idx ? "var(--bg)" : "var(--card)",
                  transition: "all 0.3s ease",
                  cursor: "pointer",
                  transform: hoveredFeature === idx ? "translateY(-8px)" : "translateY(0)",
                  boxShadow: hoveredFeature === idx ? "var(--shadow)" : "none",
                }}
              >
                <div
                  style={{
                    fontSize: "48px",
                    marginBottom: "16px",
                  }}
                >
                  {feature.icon}
                </div>
                <h3
                  style={{
                    fontSize: "20px",
                    fontWeight: "600",
                    color: "var(--text)",
                    margin: "0 0 12px 0",
                  }}
                >
                  {feature.title}
                </h3>
                <p
                  style={{
                    fontSize: "15px",
                    color: "var(--muted)",
                    margin: 0,
                    lineHeight: "1.6",
                  }}
                >
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* EXHIBITIONS SECTION */}
      <div
        id="exhibitions"
        style={{
          padding: "80px 40px",
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >
        <h2
          style={{
            fontSize: "40px",
            fontWeight: "700",
            color: "var(--text)",
            textAlign: "center",
            margin: "0 0 16px 0",
          }}
        >
          Current Exhibitions
        </h2>
        <p
          style={{
            fontSize: "18px",
            color: "var(--muted)",
            textAlign: "center",
            margin: "0 0 60px 0",
          }}
        >
          Discover our curated collections
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "32px",
          }}
        >
          {exhibitions.map((exhibition, idx) => (
            <div
              key={idx}
              style={{
                borderRadius: "var(--radius)",
                overflow: "hidden",
                border: "1px solid var(--border)",
                backgroundColor: "var(--card)",
                boxShadow: "var(--shadow)",
                transition: "all 0.3s ease",
                cursor: "pointer",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-8px)";
                e.currentTarget.style.boxShadow = "0 12px 32px rgba(0, 0, 0, 0.12)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "var(--shadow)";
              }}
            >
              <div
                style={{
                  height: "200px",
                  backgroundColor: "var(--bg)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "80px",
                }}
              >
                {exhibition.image}
              </div>
              <div style={{ padding: "24px" }}>
                <h3
                  style={{
                    fontSize: "22px",
                    fontWeight: "600",
                    color: "var(--text)",
                    margin: "0 0 8px 0",
                  }}
                >
                  {exhibition.title}
                </h3>
                <p
                  style={{
                    fontSize: "14px",
                    color: "var(--muted)",
                    margin: "0 0 16px 0",
                  }}
                >
                  {exhibition.date}
                </p>
                <button
                onClick={navhandler}
                  style={{
                    width: "100%",
                    padding: "12px",
                    borderRadius: "var(--radius)",
                    border: "2px solid var(--primary)",
                    backgroundColor: "transparent",
                    color: "var(--primary)",
                    cursor: "pointer",
                    fontSize: "14px",
                    fontWeight: "600",
                    transition: "all 0.2s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = "var(--primary)";
                    e.target.style.color = "#fff";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = "transparent";
                    e.target.style.color = "var(--primary)";
                  }}
                >
                  Book Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FOOTER */}
      <footer
        style={{
          padding: "40px",
          backgroundColor: "var(--card)",
          borderTop: "1px solid var(--border)",
          textAlign: "center",
        }}
      >
        <p
          style={{
            margin: 0,
            fontSize: "14px",
            color: "var(--muted)",
          }}
        >
          © 2025 Museum Portal. All rights reserved.
        </p>
      </footer>
    </div>
  );
};

export default HomePage;