import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import adminApi from "../adminApi";

const Payments = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFilter, setDateFilter] = useState("all");

  useEffect(() => {
    loadPayments();
  }, []);

  const loadPayments = async () => {
    try {
      setLoading(true);
      const res = await adminApi.get("/tickets/admin/payments");
      setPayments(res.data);
    } catch (error) {
      console.error("Failed to load payments:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredPayments = payments.filter(payment => {
    const matchesSearch = 
      payment.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.user?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.museumId?.name?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const paymentDate = new Date(payment.date);
    const today = new Date();
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

    let matchesDate = true;
    if (dateFilter === "today") {
      matchesDate = paymentDate.toDateString() === today.toDateString();
    } else if (dateFilter === "week") {
      matchesDate = paymentDate >= weekAgo;
    } else if (dateFilter === "month") {
      matchesDate = paymentDate >= monthAgo;
    }

    return matchesSearch && matchesDate;
  });

  const stats = {
    totalRevenue: payments.reduce((sum, p) => sum + (p.amount || 0), 0),
    totalTransactions: payments.length,
    averageTransaction: payments.length > 0 
      ? payments.reduce((sum, p) => sum + (p.amount || 0), 0) / payments.length 
      : 0,
    todayRevenue: payments
      .filter(p => new Date(p.date).toDateString() === new Date().toDateString())
      .reduce((sum, p) => sum + (p.amount || 0), 0)
  };

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
              Payment Management 💰
            </h1>
            <p style={{
              fontSize: "18px",
              margin: 0,
              opacity: 0.95
            }}>
              Track all transactions and revenue
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
          {/* Stats Cards */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "24px",
            marginBottom: "40px"
          }}>
            {[
              {
                label: "Total Revenue",
                value: `₹${stats.totalRevenue.toLocaleString()}`,
                icon: "💵",
                gradient: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                change: "+12.5%"
              },
              {
                label: "Total Transactions",
                value: stats.totalTransactions,
                icon: "📊",
                gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                change: "+8.2%"
              },
              {
                label: "Average Transaction",
                value: `₹${Math.round(stats.averageTransaction).toLocaleString()}`,
                icon: "📈",
                gradient: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
                change: "+3.1%"
              },
              {
                label: "Today's Revenue",
                value: `₹${stats.todayRevenue.toLocaleString()}`,
                icon: "🎯",
                gradient: "linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)",
                change: "+15.3%"
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
                  cursor: "pointer",
                  position: "relative",
                  overflow: "hidden"
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
                  position: "absolute",
                  top: "-20px",
                  right: "-20px",
                  width: "100px",
                  height: "100px",
                  background: stat.gradient,
                  borderRadius: "50%",
                  opacity: 0.1,
                  filter: "blur(30px)"
                }}></div>

                <div style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  marginBottom: "16px",
                  position: "relative",
                  zIndex: 1
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
                      fontSize: "32px",
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

                <div style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  paddingTop: "12px",
                  borderTop: "1px solid #f7fafc",
                  position: "relative",
                  zIndex: 1
                }}>
                  <span style={{
                    fontSize: "14px",
                    color: "#10b981",
                    fontWeight: "600"
                  }}>
                    ↑ {stat.change}
                  </span>
                  <span style={{
                    fontSize: "13px",
                    color: "#a0aec0"
                  }}>
                    from last month
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Filters and Search */}
          <div style={{
            backgroundColor: "white",
            borderRadius: "20px",
            padding: "24px",
            marginBottom: "24px",
            border: "1px solid #e5e7eb",
            boxShadow: "0 2px 4px rgba(0,0,0,0.05)"
          }}>
            <div style={{
              display: "flex",
              gap: "16px",
              alignItems: "center",
              flexWrap: "wrap"
            }}>
              {/* Search */}
              <input
                type="text"
                placeholder="🔍 Search by name, email, or museum..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  flex: 1,
                  minWidth: "300px",
                  padding: "12px 20px",
                  borderRadius: "12px",
                  border: "2px solid #e5e7eb",
                  fontSize: "15px",
                  outline: "none",
                  transition: "all 0.2s"
                }}
                onFocus={(e) => e.target.style.borderColor = "#667eea"}
                onBlur={(e) => e.target.style.borderColor = "#e5e7eb"}
              />

              {/* Date Filter Buttons */}
              <div style={{ display: "flex", gap: "8px" }}>
                {["all", "today", "week", "month"].map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setDateFilter(filter)}
                    style={{
                      padding: "10px 20px",
                      borderRadius: "12px",
                      border: dateFilter === filter ? "2px solid #667eea" : "2px solid #e5e7eb",
                      background: dateFilter === filter ? "#f0f4ff" : "white",
                      color: dateFilter === filter ? "#667eea" : "#6b7280",
                      fontSize: "14px",
                      fontWeight: "600",
                      cursor: "pointer",
                      transition: "all 0.2s",
                      textTransform: "capitalize"
                    }}
                    onMouseEnter={(e) => {
                      if (dateFilter !== filter) {
                        e.currentTarget.style.borderColor = "#667eea";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (dateFilter !== filter) {
                        e.currentTarget.style.borderColor = "#e5e7eb";
                      }
                    }}
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Payments Table */}
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
                  Loading payments...
                </p>
              </div>
            ) : filteredPayments.length === 0 ? (
              <div style={{
                padding: "60px",
                textAlign: "center"
              }}>
                <div style={{ fontSize: "64px", marginBottom: "16px" }}>💳</div>
                <h3 style={{
                  fontSize: "20px",
                  fontWeight: "700",
                  color: "#111827",
                  marginBottom: "8px"
                }}>
                  No payments found
                </h3>
                <p style={{ color: "#6b7280", margin: 0 }}>
                  {searchTerm || dateFilter !== "all"
                    ? "Try adjusting your filters or search query"
                    : "No payments have been made yet"}
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
                        letterSpacing: "0.5px"
                      }}>
                        User
                      </th>
                      <th style={{
                        padding: "16px 24px",
                        textAlign: "left",
                        fontSize: "12px",
                        fontWeight: "700",
                        color: "#6b7280",
                        textTransform: "uppercase",
                        letterSpacing: "0.5px"
                      }}>
                        Museum
                      </th>
                      <th style={{
                        padding: "16px 24px",
                        textAlign: "left",
                        fontSize: "12px",
                        fontWeight: "700",
                        color: "#6b7280",
                        textTransform: "uppercase",
                        letterSpacing: "0.5px"
                      }}>
                        Date
                      </th>
                      <th style={{
                        padding: "16px 24px",
                        textAlign: "left",
                        fontSize: "12px",
                        fontWeight: "700",
                        color: "#6b7280",
                        textTransform: "uppercase",
                        letterSpacing: "0.5px"
                      }}>
                        Amount
                      </th>
                      <th style={{
                        padding: "16px 24px",
                        textAlign: "left",
                        fontSize: "12px",
                        fontWeight: "700",
                        color: "#6b7280",
                        textTransform: "uppercase",
                        letterSpacing: "0.5px"
                      }}>
                        Status
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredPayments.map((payment) => (
                      <tr
                        key={payment._id}
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
                            alignItems: "center",
                            gap: "12px"
                          }}>
                            <div style={{
                              width: "40px",
                              height: "40px",
                              borderRadius: "50%",
                              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontSize: "16px",
                              fontWeight: "700",
                              color: "white"
                            }}>
                              {payment.user?.name?.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <p style={{
                                fontSize: "14px",
                                fontWeight: "600",
                                color: "#111827",
                                margin: "0 0 4px 0"
                              }}>
                                {payment.user?.name}
                              </p>
                              <p style={{
                                fontSize: "13px",
                                color: "#6b7280",
                                margin: 0
                              }}>
                                {payment.user?.email}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td style={{ padding: "20px 24px" }}>
                          <div style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px"
                          }}>
                            <span style={{ fontSize: "20px" }}>🏛️</span>
                            <span style={{
                              fontSize: "14px",
                              fontWeight: "600",
                              color: "#111827"
                            }}>
                              {payment.museumId?.name || "N/A"}
                            </span>
                          </div>
                        </td>

                        <td style={{ padding: "20px 24px" }}>
                          <div style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px"
                          }}>
                            <span style={{ fontSize: "16px" }}>📅</span>
                            <span style={{
                              fontSize: "14px",
                              fontWeight: "500",
                              color: "#374151"
                            }}>
                              {new Date(payment.date).toLocaleDateString()}
                            </span>
                          </div>
                        </td>

                        <td style={{ padding: "20px 24px" }}>
                          <div style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "6px",
                            padding: "8px 16px",
                            background: "linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)",
                            borderRadius: "12px",
                            border: "1px solid #10b981"
                          }}>
                            <span style={{ fontSize: "16px" }}>💰</span>
                            <span style={{
                              fontSize: "16px",
                              fontWeight: "800",
                              color: "#065f46"
                            }}>
                              ₹{payment.amount?.toLocaleString()}
                            </span>
                          </div>
                        </td>

                        <td style={{ padding: "20px 24px" }}>
                          <span style={{
                            padding: "8px 16px",
                            borderRadius: "20px",
                            fontSize: "13px",
                            fontWeight: "700",
                            background: "linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)",
                            color: "#065f46",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "6px"
                          }}>
                            <span style={{ fontSize: "16px" }}>✓</span>
                            Paid
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Results count */}
          {!loading && filteredPayments.length > 0 && (
            <div style={{
              marginTop: "24px",
              textAlign: "center",
              color: "#6b7280",
              fontSize: "14px"
            }}>
              Showing {filteredPayments.length} of {payments.length} payments
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

export default Payments;