import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import adminApi from "../adminApi";

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const loadBookings = async () => {
    try {
      setLoading(true);
      const res = await adminApi.get("/tickets/admin");
      setBookings(res.data);
    } catch (error) {
      console.error("Failed to load bookings:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBookings();
  }, []);

  const cancelBooking = async (id) => {
    if (confirm("Are you sure you want to cancel this booking?")) {
      try {
        await adminApi.put(`/bookings/admin/cancel/${id}`);
        loadBookings();
      } catch (error) {
        console.error("Failed to cancel booking:", error);
        alert("Failed to cancel booking");
      }
    }
  };

  const filteredBookings = bookings.filter(booking => {
    const matchesFilter = filter === "all" || booking.status === filter;
    const matchesSearch = 
      booking.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.user?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.museum?.name?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const stats = {
    total: bookings.length,
    confirmed: bookings.filter(b => b.status === "confirmed").length,
    cancelled: bookings.filter(b => b.status === "cancelled").length,
    pending: bookings.filter(b => b.status === "pending").length,
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
              Booking Management 🎫
            </h1>
            <p style={{
              fontSize: "18px",
              margin: 0,
              opacity: 0.95
            }}>
              Manage and track all museum ticket bookings
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
              { label: "Total Bookings", value: stats.total, icon: "📊", gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" },
              { label: "Confirmed", value: stats.confirmed, icon: "✅", gradient: "linear-gradient(135deg, #10b981 0%, #059669 100%)" },
              { label: "Pending", value: stats.pending, icon: "⏳", gradient: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)" },
              { label: "Cancelled", value: stats.cancelled, icon: "❌", gradient: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)" }
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
                  alignItems: "flex-start",
                  marginBottom: "16px"
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

              {/* Filter Buttons */}
              <div style={{ display: "flex", gap: "8px" }}>
                {["all", "confirmed", "pending", "cancelled"].map((status) => (
                  <button
                    key={status}
                    onClick={() => setFilter(status)}
                    style={{
                      padding: "10px 20px",
                      borderRadius: "12px",
                      border: filter === status ? "2px solid #667eea" : "2px solid #e5e7eb",
                      background: filter === status ? "#f0f4ff" : "white",
                      color: filter === status ? "#667eea" : "#6b7280",
                      fontSize: "14px",
                      fontWeight: "600",
                      cursor: "pointer",
                      transition: "all 0.2s",
                      textTransform: "capitalize"
                    }}
                    onMouseEnter={(e) => {
                      if (filter !== status) {
                        e.currentTarget.style.borderColor = "#667eea";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (filter !== status) {
                        e.currentTarget.style.borderColor = "#e5e7eb";
                      }
                    }}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Bookings Table */}
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
                  Loading bookings...
                </p>
              </div>
            ) : filteredBookings.length === 0 ? (
              <div style={{
                padding: "60px",
                textAlign: "center"
              }}>
                <div style={{ fontSize: "64px", marginBottom: "16px" }}>📭</div>
                <h3 style={{
                  fontSize: "20px",
                  fontWeight: "700",
                  color: "#111827",
                  marginBottom: "8px"
                }}>
                  No bookings found
                </h3>
                <p style={{ color: "#6b7280", margin: 0 }}>
                  {searchTerm || filter !== "all" 
                    ? "Try adjusting your filters or search query" 
                    : "No bookings have been made yet"}
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
                        Tickets
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
                      <th style={{
                        padding: "16px 24px",
                        textAlign: "left",
                        fontSize: "12px",
                        fontWeight: "700",
                        color: "#6b7280",
                        textTransform: "uppercase",
                        letterSpacing: "0.5px"
                      }}>
                        Action
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredBookings.map((booking, index) => (
                      <tr
                        key={booking._id}
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
                              {booking.user?.name?.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <p style={{
                                fontSize: "14px",
                                fontWeight: "600",
                                color: "#111827",
                                margin: "0 0 4px 0"
                              }}>
                                {booking.user?.name}
                              </p>
                              <p style={{
                                fontSize: "13px",
                                color: "#6b7280",
                                margin: 0
                              }}>
                                {booking.user?.email}
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
                              {booking.museum?.name}
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
                              {new Date(booking.date).toLocaleDateString()}
                            </span>
                          </div>
                        </td>

                        <td style={{ padding: "20px 24px" }}>
                          <div style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "6px",
                            padding: "6px 12px",
                            background: "#f0f4ff",
                            borderRadius: "8px"
                          }}>
                            <span style={{ fontSize: "16px" }}>🎫</span>
                            <span style={{
                              fontSize: "14px",
                              fontWeight: "700",
                              color: "#667eea"
                            }}>
                              {booking.totalTickets}
                            </span>
                          </div>
                        </td>

                        <td style={{ padding: "20px 24px" }}>
                          <span style={{
                            padding: "6px 16px",
                            borderRadius: "20px",
                            fontSize: "13px",
                            fontWeight: "700",
                            textTransform: "capitalize",
                            ...(booking.status === "confirmed" && {
                              background: "linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)",
                              color: "#065f46"
                            }),
                            ...(booking.status === "pending" && {
                              background: "linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)",
                              color: "#92400e"
                            }),
                            ...(booking.status === "cancelled" && {
                              background: "linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)",
                              color: "#991b1b"
                            })
                          }}>
                            {booking.status}
                          </span>
                        </td>

                        <td style={{ padding: "20px 24px" }}>
                          {booking.status !== "cancelled" && (
                            <button
                              onClick={() => cancelBooking(booking._id)}
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
                              Cancel
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Results count */}
          {!loading && filteredBookings.length > 0 && (
            <div style={{
              marginTop: "24px",
              textAlign: "center",
              color: "#6b7280",
              fontSize: "14px"
            }}>
              Showing {filteredBookings.length} of {bookings.length} bookings
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

export default Bookings;