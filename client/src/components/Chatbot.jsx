import { useDispatch, useSelector } from "react-redux";
import {
  sendMessage,
  addBotMessageDirect,
  addUserMessage,
} from "../features/chatbot/chatbotSlice";
import { startPayment } from "../features/payment/paymentSlice";
import { useEffect, useRef, useState } from "react";
import { useTheme } from "../context/ThemeContext";
import LanguageToggle from "./LanguageToggle";
import { logout } from "../features/auth/authSlice";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const Chatbot = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const bottomRef = useRef(null);
  const greetedRef = useRef(false);

  const { toggleTheme, theme } = useTheme();

  const user = useSelector((state) => state.auth.user);
  const activeMuseum = useSelector((state) => state.museum.activeMuseum);
  const chatbotSession = useSelector((state) => state.chatbot.session);
  const messages = useSelector((state) => state.chatbot.messages);

  const museum =
    activeMuseum || JSON.parse(localStorage.getItem("activeMuseum"));

  const [input, setInput] = useState("");

  /* 🔐 SAFETY */
  useEffect(() => {
    if (!user) navigate("/login");
    if (!museum) navigate("/home");
  }, [user, museum, navigate]);

  /* 👋 GREETING + DATE INSTRUCTION (RUN ONCE) */
  useEffect(() => {
    if (!user || !museum) return;
    if (greetedRef.current) return;

    greetedRef.current = true;

    dispatch(
      addBotMessageDirect({
        reply: `👋 Hi ${user.name}!

Welcome to "${museum.name}" 🏛️  
📍 ${museum.location}

🎟 Ticket Prices:
• Indians: ₹${museum.pricing.indian}
• Foreigners: ₹${museum.pricing.foreigner}

📅 Please enter the visit date in this format:
👉 YYYY-MM-DD (example: 2026-02-10)`,
      })
    );
  }, [user, museum, dispatch]);

  /* 🔽 AUTO SCROLL */
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  /* 💬 SEND MESSAGE */
  const handleSend = (text) => {
    if (!text.trim()) return;
    dispatch(addUserMessage(text));
    dispatch(sendMessage(text));
    setInput("");
  };

  /* 📅 DATE VALIDATION */
  const isValidDateFormat = (dateStr) => {
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    if (!regex.test(dateStr)) return false;

    const date = new Date(dateStr);
    return !isNaN(date.getTime());
  };

  /* 💳 PAYMENT */
  const handlePayment = async () => {
    try {
      const { citizenType, ticketCategory, date, timeSlot, quantity } =
        chatbotSession;

      if (!citizenType || !date || !timeSlot || !quantity) {
        alert("❌ Booking details incomplete");
        return;
      }

      if (!isValidDateFormat(date)) {
        alert(
          "❌ Invalid date format.\nPlease use YYYY-MM-DD (example: 2026-02-10)"
        );
        return;
      }

      const pricePerTicket = museum.pricing[citizenType];
      const totalAmount = pricePerTicket * quantity;

      const ticketRes = await api.post("/tickets/book", {
        museumId: museum._id,
        museumName: museum.name,
        citizenType,
        ticketCategory,
        date,
        timeSlot,
        quantity,
        amount: totalAmount,
      });

      dispatch(
        startPayment({
          ticketId: ticketRes.data._id,
          amount: totalAmount,
        })
      );
    } catch (err) {
      console.error("Payment error:", err);
      alert("Payment failed");
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login", { replace: true });
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "var(--bg)",
        padding: "20px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "900px",
          height: "85vh",
          maxHeight: "700px",
          borderRadius: "var(--radius)",
          border: "1px solid var(--border)",
          display: "flex",
          flexDirection: "column",
          background: "var(--card)",
          boxShadow: "var(--shadow)",
          overflow: "hidden",
        }}
      >
        {/* HEADER */}
        <div
          style={{
            padding: "20px 24px",
            background: "var(--header)",
            color: "#fff",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <span style={{ fontSize: "28px" }}>🏛️</span>
            <div>
              <h2
                style={{
                  margin: 0,
                  fontSize: "18px",
                  fontWeight: "600",
                }}
              >
                Museum Assistant
              </h2>
              <p
                style={{
                  margin: 0,
                  fontSize: "12px",
                  opacity: 0.8,
                  marginTop: "2px",
                }}
              >
                Online • Ready to help
              </p>
            </div>
          </div>

          <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
            <LanguageToggle />

            <button
              onClick={toggleTheme}
              style={{
                background: "rgba(255, 255, 255, 0.15)",
                border: "none",
                color: "#fff",
                cursor: "pointer",
                fontSize: "18px",
                width: "36px",
                height: "36px",
                borderRadius: "8px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "background 0.2s ease",
              }}
              title="Toggle theme"
              onMouseEnter={(e) =>
                (e.target.style.background = "rgba(255, 255, 255, 0.25)")
              }
              onMouseLeave={(e) =>
                (e.target.style.background = "rgba(255, 255, 255, 0.15)")
              }
            >
              {theme === "light" ? "🌙" : "☀️"}
            </button>

            <button
              onClick={handleLogout}
              style={{
                background: "rgba(255, 255, 255, 0.15)",
                border: "none",
                color: "#fff",
                padding: "8px 16px",
                borderRadius: "8px",
                cursor: "pointer",
                fontSize: "14px",
                fontWeight: "500",
                transition: "background 0.2s ease",
              }}
              onMouseEnter={(e) =>
                (e.target.style.background = "rgba(255, 255, 255, 0.25)")
              }
              onMouseLeave={(e) =>
                (e.target.style.background = "rgba(255, 255, 255, 0.15)")
              }
            >
              Logout
            </button>
          </div>
        </div>

        {/* MESSAGES */}
        <div
          style={{
            flex: 1,
            padding: "24px",
            overflowY: "auto",
            background: "var(--bg)",
            display: "flex",
            flexDirection: "column",
            gap: "16px",
          }}
        >
          {messages.length === 0 && (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                height: "100%",
                color: "var(--muted)",
                textAlign: "center",
              }}
            >
              <span style={{ fontSize: "48px", marginBottom: "16px" }}>💬</span>
              <h3 style={{ margin: 0, fontSize: "18px", fontWeight: "600" }}>
                Start a conversation
              </h3>
              <p style={{ margin: "8px 0 0 0", fontSize: "14px" }}>
                Ask me anything about the museum!
              </p>
            </div>
          )}

          {messages.map((msg, i) => (
            <div
              key={i}
              style={{ display: "flex", flexDirection: "column", gap: "12px" }}
            >
              {/* USER MESSAGE */}
              {msg.text && (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    alignItems: "flex-end",
                    gap: "8px",
                  }}
                >
                  <div
                    style={{
                      maxWidth: "70%",
                      padding: "12px 16px",
                      borderRadius: "var(--radius)",
                      background: "var(--user)",
                      color: "#fff",
                      fontSize: "15px",
                      lineHeight: "1.5",
                      wordWrap: "break-word",
                      boxShadow: "0 2px 8px rgba(79, 70, 229, 0.2)",
                    }}
                  >
                    {msg.text}
                  </div>
                  <div
                    style={{
                      width: "32px",
                      height: "32px",
                      borderRadius: "50%",
                      background: "var(--primary)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "16px",
                      flexShrink: 0,
                    }}
                  >
                    👤
                  </div>
                </div>
              )}

              {/* BOT MESSAGE */}
              {msg.reply && (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-start",
                    alignItems: "flex-end",
                    gap: "8px",
                  }}
                >
                  <div
                    style={{
                      width: "32px",
                      height: "32px",
                      borderRadius: "50%",
                      background: "var(--bot)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "16px",
                      flexShrink: 0,
                    }}
                  >
                    🤖
                  </div>
                  <div
                    style={{
                      maxWidth: "70%",
                      padding: "12px 16px",
                      borderRadius: "var(--radius)",
                      background: "var(--bot)",
                      color: "var(--text)",
                      fontSize: "15px",
                      lineHeight: "1.5",
                      wordWrap: "break-word",
                      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
                    }}
                  >
                    {msg.reply}
                  </div>
                </div>
              )}

              {/* OPTIONS */}
              {msg.options && (
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "8px",
                    marginLeft: "40px",
                  }}
                >
                  {msg.options.map((opt, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSend(opt)}
                      style={{
                        padding: "10px 18px",
                        borderRadius: "var(--radius)",
                        border: "2px solid var(--border)",
                        background: "var(--card)",
                        color: "var(--text)",
                        cursor: "pointer",
                        fontSize: "14px",
                        fontWeight: "500",
                        transition: "all 0.2s ease",
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.borderColor = "var(--primary)";
                        e.target.style.background = "var(--bg)";
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.borderColor = "var(--border)";
                        e.target.style.background = "var(--card)";
                      }}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              )}

              {/* PAYMENT BUTTON */}
              {msg.action === "PAYMENT" && (
                <div style={{ marginLeft: "40px" }}>
                  <button
                    onClick={handlePayment}
                    style={{
                      padding: "14px 24px",
                      borderRadius: "var(--radius)",
                      border: "none",
                      background: "var(--primary)",
                      color: "#fff",
                      cursor: "pointer",
                      fontSize: "15px",
                      fontWeight: "600",
                      transition: "all 0.2s ease",
                      boxShadow: "0 4px 12px rgba(79, 70, 229, 0.3)",
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.background = "var(--primary-dark)";
                      e.target.style.transform = "translateY(-2px)";
                      e.target.style.boxShadow =
                        "0 6px 16px rgba(79, 70, 229, 0.4)";
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = "var(--primary)";
                      e.target.style.transform = "translateY(0)";
                      e.target.style.boxShadow =
                        "0 4px 12px rgba(79, 70, 229, 0.3)";
                    }}
                  >
                    💳 Proceed to Payment
                  </button>
                </div>
              )}
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        {/* INPUT */}
        <div
          style={{
            padding: "20px 24px",
            borderTop: "1px solid var(--border)",
            background: "var(--card)",
          }}
        >
          <div
            style={{
              display: "flex",
              gap: "12px",
              alignItems: "center",
            }}
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              style={{
                flex: 1,
                padding: "14px 18px",
                borderRadius: "var(--radius)",
                border: "2px solid var(--border)",
                outline: "none",
                fontSize: "15px",
                color: "var(--text)",
                background: "var(--bg)",
                transition: "border-color 0.2s ease",
              }}
              onKeyDown={(e) => e.key === "Enter" && handleSend(input)}
              onFocus={(e) => (e.target.style.borderColor = "var(--primary)")}
              onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
            />
            <button
              onClick={() => handleSend(input)}
              disabled={!input.trim()}
              style={{
                padding: "14px",
                width: "48px",
                height: "48px",
                borderRadius: "var(--radius)",
                border: "none",
                background: input.trim() ? "var(--primary)" : "var(--muted)",
                color: "#fff",
                cursor: input.trim() ? "pointer" : "not-allowed",
                fontSize: "18px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all 0.2s ease",
                opacity: input.trim() ? 1 : 0.5,
              }}
              onMouseEnter={(e) =>
                input.trim() &&
                (e.target.style.background = "var(--primary-dark)")
              }
              onMouseLeave={(e) =>
                input.trim() && (e.target.style.background = "var(--primary)")
              }
            >
              ➤
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;
