import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import adminApi from "../adminApi";

const Dashboard = () => {
  const [stats, setStats] = useState({
    museums: 0,
    bookings: 0,
    users: 0,
    revenue: 0,
  });
  const [revenueData, setRevenueData] = useState([]);
  const [topMuseums, setTopMuseums] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      setLoading(true);

      // Fetch data from existing endpoints
      const [paymentsRes, bookingsRes, museumsRes, usersRes] =
        await Promise.all([
          adminApi.get("/tickets/admin/payments"),
          adminApi.get("/tickets/admin"),
          adminApi.get("/museums/admin"),
          adminApi.get("/users/admin"),
        ]);

      const payments = paymentsRes.data;
      const bookings = bookingsRes.data;
      const museums = museumsRes.data;
      const users = usersRes.data;

      // Calculate stats
      const totalRevenue = payments.reduce(
        (sum, p) => sum + (p.amount || 0),
        0,
      );

      setStats({
        museums: museums.length,
        bookings: bookings.length,
        users: users.length,
        revenue: totalRevenue,
      });

      // Process revenue data for the last 7 days
      const last7Days = getLast7Days();
      const revenueByDay = last7Days.map((date) => {
        const dayPayments = payments.filter((p) => {
          const paymentDate = new Date(p.createdAt || p.date);
          const targetDate = new Date(date);
          return paymentDate.toDateString() === targetDate.toDateString();
        });

        const dayRevenue = dayPayments.reduce(
          (sum, p) => sum + (p.amount || 0),
          0,
        );

        return {
          date: new Date(date).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          }),
          revenue: dayRevenue,
          transactions: dayPayments.length,
        };
      });
      setRevenueData(revenueByDay);

      // Calculate top museums by bookings
      // Calculate top museums by bookings
      const museumBookingCounts = {};

      bookings.forEach((booking) => {
        // Try different possible structures
        const museumId = booking.museum?._id || booking.museumId;
        const museumName =
          booking.museum?.name || booking.museumName || "Unknown Museum";

        // Skip if no valid museum ID
        if (!museumId || museumId === "undefined") {
          console.warn("Booking without valid museum ID:", booking);
          return;
        }

        if (!museumBookingCounts[museumId]) {
          museumBookingCounts[museumId] = {
            id: museumId,
            name: museumName,
            icon: "🏛️",
            bookings: 0,
            tickets: 0,
            revenue: 0,
          };
        }

        museumBookingCounts[museumId].bookings += 1;
        museumBookingCounts[museumId].tickets += booking.totalTickets || 0;
      });

      // Add museum icons from museums data
      museums.forEach((museum) => {
        if (museumBookingCounts[museum._id]) {
          museumBookingCounts[museum._id].icon = museum.icon || "🏛️";
        }
      });

      // Calculate revenue per museum
      payments.forEach((payment) => {
        const museumId = payment.museumId?._id;
        if (museumId && museumBookingCounts[museumId]) {
          museumBookingCounts[museumId].revenue += payment.amount || 0;
        }
      });

      // Convert to array and sort by bookings
      const topMuseumsArray = Object.values(museumBookingCounts)
        .sort((a, b) => b.bookings - a.bookings)
        .slice(0, 5);

      setTopMuseums(topMuseumsArray);
    } catch (error) {
      console.error("Failed to load dashboard:", error);
    } finally {
      setLoading(false);
    }
  };

  const getLast7Days = () => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      days.push(date);
    }
    return days;
  };

  // Custom tooltip for revenue chart
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div
          style={{
            background: "#111827",
            color: "#fff",
            padding: "12px 16px",
            borderRadius: "8px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
          }}
        >
          <p style={{ margin: "0 0 4px 0", fontWeight: "600" }}>
            {payload[0].payload.date}
          </p>
          <p style={{ margin: "0", color: "#10b981" }}>
            Revenue: ₹{payload[0].value.toLocaleString()}
          </p>
          <p style={{ margin: "4px 0 0 0", fontSize: "12px", opacity: 0.8 }}>
            {payload[0].payload.transactions} transactions
          </p>
        </div>
      );
    }
    return null;
  };

  const COLORS = ["#667eea", "#f59e0b", "#8b5cf6", "#10b981", "#ef4444"];

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          backgroundColor: "#f9fafb",
          minHeight: "100vh",
        }}
      >
        <Sidebar />
        <div style={{ flex: 1, marginLeft: "256px" }}>
          <Navbar />
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              minHeight: "calc(100vh - 80px)",
              padding: "40px",
            }}
          >
            <div
              style={{
                width: "60px",
                height: "60px",
                border: "4px solid #667eea",
                borderTop: "4px solid transparent",
                borderRadius: "50%",
                animation: "spin 1s linear infinite",
              }}
            ></div>
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
  }

  return (
    <div
      style={{
        display: "flex",
        backgroundColor: "#f9fafb",
        minHeight: "100vh",
      }}
    >
      <Sidebar />

      <div style={{ flex: 1, marginLeft: "256px" }}>
        <Navbar />

        {/* Hero Banner */}
        <div
          style={{
            // background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            padding: "60px 40px",
            color: "black",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: "-50px",
              right: "-50px",
              width: "300px",
              height: "300px",
              background: "rgba(255, 255, 255, 0.1)",
              borderRadius: "50%",
              filter: "blur(60px)",
            }}
          ></div>

          <div
            style={{
              maxWidth: "1400px",
              margin: "0 auto",
              position: "relative",
              zIndex: 1,
            }}
          >
            <h1
              style={{
                fontSize: "42px",
                fontWeight: "800",
                marginBottom: "12px",
                marginTop: 0,
                letterSpacing: "-0.5px",
              }}
            >
              Dashboard Overview 📊
            </h1>
            <p
              style={{
                fontSize: "18px",
                margin: 0,
                opacity: 0.95,
              }}
            >
              Welcome back! Here's what's happening today.
            </p>
          </div>
        </div>

        <div
          style={{
            padding: "40px",
            maxWidth: "1400px",
            width: "100%",
            margin: "-40px auto 0",
            position: "relative",
            zIndex: 2,
          }}
        >
          {/* Stats Cards */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: "24px",
              marginBottom: "40px",
            }}
          >
            {[
              {
                label: "Total Museums",
                value: stats.museums,
                icon: "🏛️",
                gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                onClick: () => navigate("/admin/museums"),
              },
              {
                label: "Total Bookings",
                value: stats.bookings,
                icon: "📅",
                gradient: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
                onClick: () => navigate("/admin/bookings"),
              },
              {
                label: "Total Users",
                value: stats.users,
                icon: "👥",
                gradient: "linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)",
                onClick: () => navigate("/admin/users"),
              },
              {
                label: "Total Revenue",
                value: `₹${stats.revenue?.toLocaleString()}`,
                icon: "💰",
                gradient: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                onClick: () => navigate("/admin/payments"),
              },
            ].map((stat, index) => (
              <div
                key={index}
                onClick={stat.onClick}
                style={{
                  backgroundColor: "white",
                  borderRadius: "20px",
                  padding: "28px",
                  border: "1px solid #e5e7eb",
                  boxShadow: "0 4px 6px rgba(0,0,0,0.05)",
                  transition: "all 0.3s ease",
                  cursor: "pointer",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-8px)";
                  e.currentTarget.style.boxShadow =
                    "0 20px 40px rgba(0,0,0,0.12)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow =
                    "0 4px 6px rgba(0,0,0,0.05)";
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    marginBottom: "16px",
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <p
                      style={{
                        fontSize: "14px",
                        color: "#718096",
                        fontWeight: "500",
                        marginBottom: "8px",
                        marginTop: 0,
                        textTransform: "uppercase",
                        letterSpacing: "0.5px",
                      }}
                    >
                      {stat.label}
                    </p>
                    <h3
                      style={{
                        fontSize: "36px",
                        fontWeight: "700",
                        color: "#1a202c",
                        margin: 0,
                        lineHeight: 1,
                      }}
                    >
                      {stat.value}
                    </h3>
                  </div>
                  <div
                    style={{
                      width: "64px",
                      height: "64px",
                      background: stat.gradient,
                      borderRadius: "16px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "32px",
                      flexShrink: 0,
                    }}
                  >
                    {stat.icon}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Charts Row */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "2fr 1fr",
              gap: "24px",
              marginBottom: "40px",
            }}
          >
            {/* Revenue Bar Chart */}
            <div
              style={{
                backgroundColor: "white",
                borderRadius: "20px",
                padding: "32px",
                border: "1px solid #e5e7eb",
                boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: "32px",
                }}
              >
                <div>
                  <h3
                    style={{
                      fontSize: "20px",
                      fontWeight: "700",
                      color: "#111827",
                      margin: "0 0 8px 0",
                    }}
                  >
                    Revenue Analytics
                  </h3>
                  <p
                    style={{
                      fontSize: "14px",
                      color: "#6b7280",
                      margin: 0,
                    }}
                  >
                    Daily revenue for the last 7 days
                  </p>
                </div>
                <div
                  style={{
                    padding: "8px 16px",
                    background:
                      "linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)",
                    borderRadius: "12px",
                    border: "1px solid #10b981",
                  }}
                >
                  <span
                    style={{
                      fontSize: "14px",
                      fontWeight: "700",
                      color: "#065f46",
                    }}
                  >
                    💰 ₹
                    {revenueData
                      .reduce((sum, d) => sum + d.revenue, 0)
                      .toLocaleString()}
                  </span>
                </div>
              </div>

              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={revenueData}>
                  <defs>
                    <linearGradient
                      id="colorRevenue"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="0%" stopColor="#667eea" stopOpacity={1} />
                      <stop offset="100%" stopColor="#764ba2" stopOpacity={1} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis
                    dataKey="date"
                    stroke="#6b7280"
                    style={{ fontSize: "12px" }}
                  />
                  <YAxis
                    stroke="#6b7280"
                    style={{ fontSize: "12px" }}
                    tickFormatter={(value) => `₹${value}`}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar
                    dataKey="revenue"
                    fill="url(#colorRevenue)"
                    radius={[8, 8, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Museum Distribution Pie Chart */}
            <div
              style={{
                backgroundColor: "white",
                borderRadius: "20px",
                padding: "32px",
                border: "1px solid #e5e7eb",
                boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
              }}
            >
              <h3
                style={{
                  fontSize: "20px",
                  fontWeight: "700",
                  color: "#111827",
                  margin: "0 0 8px 0",
                }}
              >
                Booking Distribution
              </h3>
              <p
                style={{
                  fontSize: "14px",
                  color: "#6b7280",
                  margin: "0 0 24px 0",
                }}
              >
                Top museums by bookings
              </p>

              {topMuseums.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={topMuseums}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) =>
                        `${percent > 0.1 ? `${(percent * 100).toFixed(0)}%` : ""}`
                      }
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="bookings"
                    >
                      {topMuseums.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value, name, props) => [
                        `${value} bookings`,
                        props.payload.name,
                      ]}
                    />
                    <Legend
                      verticalAlign="bottom"
                      height={36}
                      formatter={(value, entry) => (
                        <span style={{ fontSize: "12px", color: "#6b7280" }}>
                          {entry.payload.name}
                        </span>
                      )}
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    height: "300px",
                    flexDirection: "column",
                  }}
                >
                  <div style={{ fontSize: "48px", marginBottom: "12px" }}>
                    🏛️
                  </div>
                  <p
                    style={{
                      fontSize: "14px",
                      color: "#6b7280",
                      margin: 0,
                    }}
                  >
                    No booking data available
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Revenue Trend Line Chart */}
          <div
            style={{
              backgroundColor: "white",
              borderRadius: "20px",
              padding: "32px",
              border: "1px solid #e5e7eb",
              boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
              marginBottom: "40px",
            }}
          >
            <h3
              style={{
                fontSize: "20px",
                fontWeight: "700",
                color: "#111827",
                margin: "0 0 8px 0",
              }}
            >
              Revenue Trend
            </h3>
            <p
              style={{
                fontSize: "14px",
                color: "#6b7280",
                margin: "0 0 24px 0",
              }}
            >
              Track your revenue performance over time
            </p>

            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={revenueData}>
                <defs>
                  <linearGradient id="colorLine" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#667eea" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#764ba2" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis
                  dataKey="date"
                  stroke="#6b7280"
                  style={{ fontSize: "12px" }}
                />
                <YAxis
                  stroke="#6b7280"
                  style={{ fontSize: "12px" }}
                  tickFormatter={(value) => `₹${value}`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#667eea"
                  strokeWidth={3}
                  dot={{ fill: "#667eea", r: 5 }}
                  activeDot={{ r: 7 }}
                  fill="url(#colorLine)"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Quick Actions */}
          <div
            style={{
              backgroundColor: "white",
              borderRadius: "20px",
              padding: "32px",
              border: "1px solid #e5e7eb",
              boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
            }}
          >
            <h3
              style={{
                fontSize: "20px",
                fontWeight: "700",
                color: "#111827",
                margin: "0 0 24px 0",
              }}
            >
              Quick Actions
            </h3>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(4, 1fr)",
                gap: "16px",
              }}
            >
              {[
                {
                  label: "Add Museum",
                  icon: "🏛️",
                  path: "/admin/museums",
                  gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                },
                {
                  label: "View Bookings",
                  icon: "📅",
                  path: "/admin/bookings",
                  gradient: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
                },
                {
                  label: "Manage Users",
                  icon: "👥",
                  path: "/admin/users",
                  gradient: "linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)",
                },
                {
                  label: "View Payments",
                  icon: "💰",
                  path: "/admin/payments",
                  gradient: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                },
              ].map((action, index) => (
                <button
                  key={index}
                  onClick={() => navigate(action.path)}
                  style={{
                    padding: "24px",
                    background: action.gradient,
                    border: "none",
                    borderRadius: "16px",
                    color: "white",
                    fontSize: "16px",
                    fontWeight: "700",
                    cursor: "pointer",
                    transition: "all 0.2s",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "12px",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-4px)";
                    e.currentTarget.style.boxShadow =
                      "0 8px 20px rgba(0,0,0,0.15)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow =
                      "0 4px 12px rgba(0,0,0,0.1)";
                  }}
                >
                  <span style={{ fontSize: "40px" }}>{action.icon}</span>
                  <span>{action.label}</span>
                </button>
              ))}
            </div>
          </div>
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

export default Dashboard;
