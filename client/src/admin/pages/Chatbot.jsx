import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import adminApi from "../adminApi";

const Chatbot = () => {
  const [faqs, setFaqs] = useState([]);
  const [form, setForm] = useState({ question: "", answer: "" });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingId, setEditingId] = useState(null);

  const loadFaqs = async () => {
    try {
      setLoading(true);
      const res = await adminApi.get("/chatbot/admin");
      setFaqs(res.data);
    } catch (error) {
      console.error("Failed to load FAQs:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFaqs();
  }, []);

  const addFaq = async (e) => {
    e.preventDefault();
    if (!form.question.trim() || !form.answer.trim()) {
      alert("Please fill in both question and answer");
      return;
    }

    try {
      if (editingId) {
        await adminApi.put(`/chatbot/admin/${editingId}`, form);
        setEditingId(null);
      } else {
        await adminApi.post("/chatbot/admin", form);
      }
      setForm({ question: "", answer: "" });
      loadFaqs();
    } catch (error) {
      console.error("Failed to save FAQ:", error);
      alert("Failed to save FAQ");
    }
  };

  const deleteFaq = async (id) => {
    if (confirm("Are you sure you want to delete this FAQ?")) {
      try {
        await adminApi.delete(`/chatbot/admin/${id}`);
        loadFaqs();
      } catch (error) {
        console.error("Failed to delete FAQ:", error);
        alert("Failed to delete FAQ");
      }
    }
  };

  const editFaq = (faq) => {
    setForm({ question: faq.question, answer: faq.answer });
    setEditingId(faq._id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const cancelEdit = () => {
    setForm({ question: "", answer: "" });
    setEditingId(null);
  };

  const filteredFaqs = faqs.filter(faq =>
    faq.question?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faq.answer?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ display: "flex", backgroundColor: "#f9fafb", minHeight: "100vh" }}>
      <Sidebar />

      <div style={{ flex: 1, marginLeft: "256px" }}>
        <Navbar />

        {/* Hero Banner */}
        <div style={{
        //   background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          padding: "60px 40px",
          color: "black",
          position: "relative",
          overflow: "hidden"
        }}>
          <div style={{
            position: "absolute",
            top: "-50px",
            right: "-50px",
            width: "300px",
            height: "300px",
            background: "rgba(255, 255, 255, 0.1)",
            borderRadius: "50%",
            filter: "blur(60px)"
          }}></div>

          <div style={{
            maxWidth: "1400px",
            margin: "0 auto",
            position: "relative",
            zIndex: 1
          }}>
            <h1 style={{
              fontSize: "42px",
              fontWeight: "800",
              marginBottom: "12px",
              marginTop: 0,
              letterSpacing: "-0.5px"
            }}>
              Chatbot Management 🤖
            </h1>
            <p style={{
              fontSize: "18px",
              margin: 0,
              opacity: 0.95
            }}>
              Manage FAQ responses for the AI chatbot
            </p>
          </div>
        </div>

        <div style={{
          padding: "40px",
          maxWidth: "1400px",
          width: "100%",
          margin: "-40px auto 0",
          position: "relative",
          zIndex: 2
        }}>
          {/* Stats Card */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "24px",
            marginBottom: "40px"
          }}>
            {[
              {
                label: "Total FAQs",
                value: faqs.length,
                icon: "📚",
                gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
              },
              {
                label: "Active Responses",
                value: faqs.length,
                icon: "✅",
                gradient: "linear-gradient(135deg, #10b981 0%, #059669 100%)"
              },
              {
                label: "Coverage",
                value: "100%",
                icon: "🎯",
                gradient: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)"
              }
            ].map((stat, index) => (
              <div
                key={index}
                style={{
                  backgroundColor: "white",
                  borderRadius: "20px",
                  padding: "28px",
                  border: "1px solid #e5e7eb",
                  boxShadow: "0 4px 6px rgba(0,0,0,0.05)",
                  transition: "all 0.3s ease",
                  cursor: "pointer"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-4px)";
                  e.currentTarget.style.boxShadow = "0 12px 24px rgba(0,0,0,0.1)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 4px 6px rgba(0,0,0,0.05)";
                }}
              >
                <div style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start"
                }}>
                  <div style={{ flex: 1 }}>
                    <p style={{
                      fontSize: "14px",
                      color: "#718096",
                      fontWeight: "500",
                      marginBottom: "8px",
                      marginTop: 0,
                      textTransform: "uppercase",
                      letterSpacing: "0.5px"
                    }}>
                      {stat.label}
                    </p>
                    <h3 style={{
                      fontSize: "36px",
                      fontWeight: "700",
                      color: "#1a202c",
                      margin: 0,
                      lineHeight: 1
                    }}>
                      {stat.value}
                    </h3>
                  </div>
                  <div style={{
                    width: "64px",
                    height: "64px",
                    background: stat.gradient,
                    borderRadius: "16px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "32px",
                    flexShrink: 0
                  }}>
                    {stat.icon}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Add/Edit FAQ Form */}
          <div style={{
            backgroundColor: "white",
            borderRadius: "20px",
            padding: "32px",
            marginBottom: "32px",
            border: "1px solid #e5e7eb",
            boxShadow: "0 2px 4px rgba(0,0,0,0.05)"
          }}>
            <div style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "24px"
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <div style={{
                  width: "48px",
                  height: "48px",
                  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  borderRadius: "12px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "24px"
                }}>
                  {editingId ? "✏️" : "➕"}
                </div>
                <h3 style={{
                  fontSize: "20px",
                  fontWeight: "700",
                  color: "#111827",
                  margin: 0
                }}>
                  {editingId ? "Edit FAQ" : "Add New FAQ"}
                </h3>
              </div>
              {editingId && (
                <button
                  onClick={cancelEdit}
                  style={{
                    padding: "10px 20px",
                    borderRadius: "12px",
                    border: "2px solid #fee2e2",
                    background: "white",
                    color: "#dc2626",
                    fontSize: "14px",
                    fontWeight: "600",
                    cursor: "pointer",
                    transition: "all 0.2s"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "#fee2e2";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "white";
                  }}
                >
                  Cancel Edit
                </button>
              )}
            </div>

            <form onSubmit={addFaq} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              <div>
                <label style={{
                  display: "block",
                  fontSize: "14px",
                  fontWeight: "600",
                  color: "#374151",
                  marginBottom: "8px"
                }}>
                  Question
                </label>
                <input
                  placeholder="Enter the question users might ask..."
                  value={form.question}
                  onChange={(e) => setForm({ ...form, question: e.target.value })}
                  required
                  style={{
                    width: "100%",
                    padding: "14px 18px",
                    borderRadius: "12px",
                    border: "2px solid #e5e7eb",
                    fontSize: "15px",
                    outline: "none",
                    transition: "all 0.2s",
                    boxSizing: "border-box"
                  }}
                  onFocus={(e) => e.target.style.borderColor = "#667eea"}
                  onBlur={(e) => e.target.style.borderColor = "#e5e7eb"}
                />
              </div>

              <div>
                <label style={{
                  display: "block",
                  fontSize: "14px",
                  fontWeight: "600",
                  color: "#374151",
                  marginBottom: "8px"
                }}>
                  Answer
                </label>
                <textarea
                  placeholder="Enter the answer the chatbot should provide..."
                  value={form.answer}
                  onChange={(e) => setForm({ ...form, answer: e.target.value })}
                  required
                  rows={4}
                  style={{
                    width: "100%",
                    padding: "14px 18px",
                    borderRadius: "12px",
                    border: "2px solid #e5e7eb",
                    fontSize: "15px",
                    outline: "none",
                    transition: "all 0.2s",
                    resize: "vertical",
                    fontFamily: "inherit",
                    boxSizing: "border-box"
                  }}
                  onFocus={(e) => e.target.style.borderColor = "#667eea"}
                  onBlur={(e) => e.target.style.borderColor = "#e5e7eb"}
                />
              </div>

              <button
                type="submit"
                style={{
                  padding: "16px 32px",
                  borderRadius: "12px",
                  border: "none",
                  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  color: "white",
                  fontSize: "16px",
                  fontWeight: "700",
                  cursor: "pointer",
                  transition: "all 0.2s",
                  boxShadow: "0 4px 12px rgba(102, 126, 234, 0.3)",
                  alignSelf: "flex-start"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow = "0 6px 16px rgba(102, 126, 234, 0.4)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 4px 12px rgba(102, 126, 234, 0.3)";
                }}
              >
                {editingId ? "💾 Update FAQ" : "➕ Add FAQ"}
              </button>
            </form>
          </div>

          {/* Search */}
          <div style={{
            backgroundColor: "white",
            borderRadius: "20px",
            padding: "24px",
            marginBottom: "24px",
            border: "1px solid #e5e7eb",
            boxShadow: "0 2px 4px rgba(0,0,0,0.05)"
          }}>
            <input
              type="text"
              placeholder="🔍 Search FAQs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: "100%",
                padding: "12px 20px",
                borderRadius: "12px",
                border: "2px solid #e5e7eb",
                fontSize: "15px",
                outline: "none",
                transition: "all 0.2s",
                boxSizing: "border-box"
              }}
              onFocus={(e) => e.target.style.borderColor = "#667eea"}
              onBlur={(e) => e.target.style.borderColor = "#e5e7eb"}
            />
          </div>

          {/* FAQs Table */}
          <div style={{
            backgroundColor: "white",
            borderRadius: "20px",
            overflow: "hidden",
            border: "1px solid #e5e7eb",
            boxShadow: "0 2px 4px rgba(0,0,0,0.05)"
          }}>
            {loading ? (
              <div style={{
                padding: "60px",
                textAlign: "center"
              }}>
                <div style={{
                  width: "60px",
                  height: "60px",
                  border: "4px solid #667eea",
                  borderTop: "4px solid transparent",
                  borderRadius: "50%",
                  animation: "spin 1s linear infinite",
                  margin: "0 auto 20px"
                }}></div>
                <p style={{ color: "#6b7280", fontSize: "16px", margin: 0 }}>
                  Loading FAQs...
                </p>
              </div>
            ) : filteredFaqs.length === 0 ? (
              <div style={{
                padding: "60px",
                textAlign: "center"
              }}>
                <div style={{ fontSize: "64px", marginBottom: "16px" }}>🤖</div>
                <h3 style={{
                  fontSize: "20px",
                  fontWeight: "700",
                  color: "#111827",
                  marginBottom: "8px"
                }}>
                  No FAQs found
                </h3>
                <p style={{ color: "#6b7280", margin: 0 }}>
                  {searchTerm
                    ? "Try adjusting your search query"
                    : "Add your first FAQ to get started"}
                </p>
              </div>
            ) : (
              <div style={{ overflowX: "auto" }}>
                <table style={{
                  width: "100%",
                  borderCollapse: "collapse"
                }}>
                  <thead>
                    <tr style={{
                      background: "#f9fafb",
                      borderBottom: "2px solid #e5e7eb"
                    }}>
                      <th style={{
                        padding: "16px 24px",
                        textAlign: "left",
                        fontSize: "12px",
                        fontWeight: "700",
                        color: "#6b7280",
                        textTransform: "uppercase",
                        letterSpacing: "0.5px",
                        width: "35%"
                      }}>
                        Question
                      </th>
                      <th style={{
                        padding: "16px 24px",
                        textAlign: "left",
                        fontSize: "12px",
                        fontWeight: "700",
                        color: "#6b7280",
                        textTransform: "uppercase",
                        letterSpacing: "0.5px",
                        width: "50%"
                      }}>
                        Answer
                      </th>
                      <th style={{
                        padding: "16px 24px",
                        textAlign: "center",
                        fontSize: "12px",
                        fontWeight: "700",
                        color: "#6b7280",
                        textTransform: "uppercase",
                        letterSpacing: "0.5px",
                        width: "15%"
                      }}>
                        Actions
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredFaqs.map((faq) => (
                      <tr
                        key={faq._id}
                        style={{
                          borderBottom: "1px solid #f3f4f6",
                          transition: "background-color 0.2s"
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#f9fafb"}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "white"}
                      >
                        <td style={{ padding: "20px 24px" }}>
                          <div style={{
                            display: "flex",
                            alignItems: "flex-start",
                            gap: "12px"
                          }}>
                            <span style={{ fontSize: "20px", flexShrink: 0 }}>❓</span>
                            <p style={{
                              fontSize: "15px",
                              fontWeight: "600",
                              color: "#111827",
                              margin: 0,
                              lineHeight: "1.5"
                            }}>
                              {faq.question}
                            </p>
                          </div>
                        </td>

                        <td style={{ padding: "20px 24px" }}>
                          <div style={{
                            display: "flex",
                            alignItems: "flex-start",
                            gap: "12px"
                          }}>
                            <span style={{ fontSize: "20px", flexShrink: 0 }}>💬</span>
                            <p style={{
                              fontSize: "14px",
                              fontWeight: "500",
                              color: "#374151",
                              margin: 0,
                              lineHeight: "1.6"
                            }}>
                              {faq.answer}
                            </p>
                          </div>
                        </td>

                        <td style={{ padding: "20px 24px" }}>
                          <div style={{
                            display: "flex",
                            gap: "8px",
                            justifyContent: "center"
                          }}>
                            <button
                              onClick={() => editFaq(faq)}
                              style={{
                                padding: "8px 16px",
                                borderRadius: "10px",
                                border: "2px solid #dbeafe",
                                background: "white",
                                color: "#3b82f6",
                                fontSize: "13px",
                                fontWeight: "600",
                                cursor: "pointer",
                                transition: "all 0.2s"
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.background = "#dbeafe";
                                e.currentTarget.style.borderColor = "#3b82f6";
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.background = "white";
                                e.currentTarget.style.borderColor = "#dbeafe";
                              }}
                            >
                              ✏️ Edit
                            </button>
                            <button
                              onClick={() => deleteFaq(faq._id)}
                              style={{
                                padding: "8px 16px",
                                borderRadius: "10px",
                                border: "2px solid #fee2e2",
                                background: "white",
                                color: "#dc2626",
                                fontSize: "13px",
                                fontWeight: "600",
                                cursor: "pointer",
                                transition: "all 0.2s"
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.background = "#fee2e2";
                                e.currentTarget.style.borderColor = "#dc2626";
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.background = "white";
                                e.currentTarget.style.borderColor = "#fee2e2";
                              }}
                            >
                              🗑️ Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Results count */}
          {!loading && filteredFaqs.length > 0 && (
            <div style={{
              marginTop: "24px",
              textAlign: "center",
              color: "#6b7280",
              fontSize: "14px"
            }}>
              Showing {filteredFaqs.length} of {faqs.length} FAQs
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default Chatbot;