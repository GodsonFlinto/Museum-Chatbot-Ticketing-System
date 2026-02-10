import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import QRCode from "qrcode";

const PaymentSuccess = () => {
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);

  const hasVerified = useRef(false);
  const ticketRef = useRef(null);
  const qrCanvasRef = useRef(null);
  const navigate = useNavigate();

  const activeMuseum =
    useSelector((state) => state.museum.activeMuseum) ||
    JSON.parse(localStorage.getItem("activeMuseum"));

  const museumName =
    ticket?.museumName || activeMuseum?.name || "Museum not available";

  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    if (hasVerified.current) return;
    hasVerified.current = true;

    const verifyPayment = async () => {
      try {
        const sessionId = new URLSearchParams(window.location.search).get(
          "session_id",
        );

        const verifyRes = await api.post("/payment/verify", { sessionId });
        const ticketRes = await api.get(`/tickets/${verifyRes.data.ticketId}`);

        console.log("Ticket data:", ticketRes.data);
        setTicket(ticketRes.data);
      } catch (error) {
        console.error("Payment verification error:", error);
        alert("Payment verification failed");
      } finally {
        setLoading(false);
      }
    };

    verifyPayment();
  }, []);

  // Generate QR code directly to canvas
  useEffect(() => {
    if (!ticket || !qrCanvasRef.current) return;

    const generateQRCode = async () => {
      try {
        // Create QR code data with ticket information
        const qrData = JSON.stringify({
          ticketId: ticket._id,
          museumName: museumName,
          date: ticket.date,
          timeSlot: ticket.timeSlot,
          quantity: ticket.quantity,
          visitorType: ticket.visitorType || ticket.citizenType,
          userName: user?.name
        });

        // Generate QR code directly to canvas element
        await QRCode.toCanvas(qrCanvasRef.current, qrData, {
          width: 200,
          margin: 2,
          errorCorrectionLevel: 'H',
          color: {
            dark: '#000000',
            light: '#FFFFFF'
          }
        });

        console.log("QR Code generated successfully");
      } catch (error) {
        console.error("QR Code generation error:", error);
      }
    };

    generateQRCode();
  }, [ticket, museumName, user]);

  useEffect(() => {
    if (!ticket) return;
    const timer = setTimeout(() => navigate("/home"), 30000);
    return () => clearTimeout(timer);
  }, [ticket, navigate]);

  const downloadTicket = async () => {
    try {
      setDownloading(true);
      
      const element = ticketRef.current;
      
      // Wait for everything to render
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Capture with html2canvas
      const canvas = await html2canvas(element, {
        scale: 3,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        allowTaint: false,
        width: element.scrollWidth,
        height: element.scrollHeight
      });

      const imgData = canvas.toDataURL("image/png", 1.0);
      
      // Create PDF
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
        compress: true
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      const imgWidth = pdfWidth - 20;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      const x = 10;
      let y = 10;
      
      if (imgHeight > pdfHeight - 20) {
        const scaledHeight = pdfHeight - 20;
        const scaledWidth = (canvas.width * scaledHeight) / canvas.height;
        const centeredX = (pdfWidth - scaledWidth) / 2;
        pdf.addImage(imgData, "PNG", centeredX, 10, scaledWidth, scaledHeight);
      } else {
        y = (pdfHeight - imgHeight) / 2;
        pdf.addImage(imgData, "PNG", x, y, imgWidth, imgHeight);
      }
      
      pdf.save(`museum-ticket-${ticket._id}.pdf`);
    } catch (error) {
      console.error("Download failed:", error);
      alert("Failed to download ticket. Please try again.");
    } finally {
      setDownloading(false);
    }
  };

  if (loading) {
    return (
      <div style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px"
      }}>
        <div style={{
          background: "white",
          padding: "40px 60px",
          borderRadius: "24px",
          textAlign: "center",
          boxShadow: "0 25px 50px rgba(0,0,0,0.25)"
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
          <h3 style={{ 
            margin: 0, 
            fontSize: "20px", 
            fontWeight: "700",
            color: "#111827" 
          }}>
            Verifying payment...
          </h3>
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

  if (!ticket) {
    return (
      <div style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px"
      }}>
        <div style={{
          background: "white",
          padding: "40px 60px",
          borderRadius: "24px",
          textAlign: "center",
          boxShadow: "0 25px 50px rgba(0,0,0,0.25)"
        }}>
          <div style={{ fontSize: "64px", marginBottom: "20px" }}>❌</div>
          <h3 style={{ 
            margin: 0, 
            fontSize: "24px", 
            fontWeight: "700",
            color: "#111827",
            marginBottom: "12px"
          }}>
            Something went wrong
          </h3>
          <p style={{ color: "#6b7280", margin: 0 }}>
            Please contact support if the issue persists
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "20px",
      position: "relative",
      overflow: "hidden"
    }}>
      {/* Background decoration */}
      <div style={{
        position: "absolute",
        top: "-100px",
        left: "-100px",
        width: "300px",
        height: "300px",
        background: "rgba(255, 255, 255, 0.1)",
        borderRadius: "50%",
        filter: "blur(60px)"
      }}></div>
      <div style={{
        position: "absolute",
        bottom: "-150px",
        right: "-150px",
        width: "400px",
        height: "400px",
        background: "rgba(255, 255, 255, 0.1)",
        borderRadius: "50%",
        filter: "blur(80px)"
      }}></div>

      <div style={{ 
        maxWidth: "500px", 
        width: "100%",
        position: "relative",
        zIndex: 1
      }}>
        {/* Success Animation */}
        <div style={{
          textAlign: "center",
          marginBottom: "32px",
          animation: "fadeInDown 0.6s ease-out"
        }}>
          <div style={{
            width: "100px",
            height: "100px",
            background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "56px",
            margin: "0 auto 20px",
            boxShadow: "0 10px 30px rgba(16, 185, 129, 0.4)",
            animation: "scaleIn 0.5s ease-out"
          }}>
            ✓
          </div>
          <h1 style={{
            margin: 0,
            fontSize: "32px",
            fontWeight: "800",
            color: "white",
            marginBottom: "8px",
            letterSpacing: "-0.5px"
          }}>
            Payment Successful!
          </h1>
          <p style={{
            margin: 0,
            fontSize: "16px",
            color: "rgba(255, 255, 255, 0.9)"
          }}>
            Your ticket has been confirmed
          </p>
        </div>

        {/* TICKET CARD */}
        <div
          ref={ticketRef}
          style={{
            background: "white",
            borderRadius: "24px",
            overflow: "hidden",
            boxShadow: "0 25px 50px rgba(0,0,0,0.25)",
            marginBottom: "24px"
          }}
        >
          {/* HEADER */}
          <div style={{
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            padding: "32px 24px",
            textAlign: "center",
            color: "#fff",
            position: "relative"
          }}>
            <div style={{
              width: "80px",
              height: "80px",
              background: "rgba(255, 255, 255, 0.2)",
              borderRadius: "20px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "40px",
              margin: "0 auto 16px",
              backdropFilter: "blur(10px)"
            }}>
              🎫
            </div>
            <h2 style={{ 
              margin: 0,
              fontSize: "24px",
              fontWeight: "700",
              letterSpacing: "-0.5px"
            }}>
              Museum E-Ticket
            </h2>
            <p style={{ 
              margin: "8px 0 0", 
              fontSize: "14px",
              opacity: 0.9
            }}>
              Valid for single entry
            </p>
          </div>

          {/* CONTENT */}
          <div style={{ padding: "32px 24px" }}>
            {/* Museum Info */}
            <div style={{
              padding: "20px",
              background: "#f9fafb",
              borderRadius: "16px",
              marginBottom: "24px",
              border: "1px solid #e5e7eb"
            }}>
              <div style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                marginBottom: "12px"
              }}>
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
                  🏛️
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ 
                    margin: 0, 
                    fontSize: "12px", 
                    color: "#6b7280",
                    fontWeight: "600",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px"
                  }}>
                    Museum
                  </p>
                  <h3 style={{ 
                    margin: "4px 0 0", 
                    fontSize: "18px",
                    fontWeight: "700",
                    color: "#111827"
                  }}>
                    {museumName}
                  </h3>
                </div>
              </div>
            </div>

            {/* Visitor Details */}
            <div style={{ marginBottom: "24px" }}>
              <h4 style={{ 
                margin: "0 0 16px",
                fontSize: "14px",
                fontWeight: "700",
                color: "#111827",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
                display: "flex",
                alignItems: "center",
                gap: "8px"
              }}>
                <span>👤</span>
                Visitor Details
              </h4>
              <div style={{ 
                display: "grid",
                gap: "12px"
              }}>
                <div style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "12px 16px",
                  background: "#f9fafb",
                  borderRadius: "12px"
                }}>
                  <span style={{ 
                    fontSize: "14px", 
                    color: "#6b7280",
                    fontWeight: "500"
                  }}>
                    Name
                  </span>
                  <span style={{ 
                    fontSize: "14px", 
                    color: "#111827",
                    fontWeight: "600"
                  }}>
                    {user?.name || "N/A"}
                  </span>
                </div>
                <div style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "12px 16px",
                  background: "#f9fafb",
                  borderRadius: "12px"
                }}>
                  <span style={{ 
                    fontSize: "14px", 
                    color: "#6b7280",
                    fontWeight: "500"
                  }}>
                    Email
                  </span>
                  <span style={{ 
                    fontSize: "14px", 
                    color: "#111827",
                    fontWeight: "600",
                    wordBreak: "break-all"
                  }}>
                    {user?.email || "N/A"}
                  </span>
                </div>
              </div>
            </div>

            {/* Ticket Info */}
            <div style={{ marginBottom: "24px" }}>
              <h4 style={{ 
                margin: "0 0 16px",
                fontSize: "14px",
                fontWeight: "700",
                color: "#111827",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
                display: "flex",
                alignItems: "center",
                gap: "8px"
              }}>
                <span>🎟️</span>
                Ticket Information
              </h4>
              <div style={{ 
                display: "grid",
                gap: "12px"
              }}>
                <div style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "12px 16px",
                  background: "#f9fafb",
                  borderRadius: "12px"
                }}>
                  <span style={{ fontSize: "14px", color: "#6b7280", fontWeight: "500" }}>
                    Visitor Type
                  </span>
                  <span style={{ 
                    fontSize: "14px", 
                    color: "#111827",
                    fontWeight: "600",
                    textTransform: "capitalize"
                  }}>
                    {ticket.visitorType || ticket.citizenType || "N/A"}
                  </span>
                </div>
                <div style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "12px 16px",
                  background: "#f9fafb",
                  borderRadius: "12px"
                }}>
                  <span style={{ fontSize: "14px", color: "#6b7280", fontWeight: "500" }}>
                    Ticket Type
                  </span>
                  <span style={{ fontSize: "14px", color: "#111827", fontWeight: "600" }}>
                    {ticket.ticketType || ticket.ticketCategory || "General"}
                  </span>
                </div>
                <div style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "12px 16px",
                  background: "#f9fafb",
                  borderRadius: "12px"
                }}>
                  <span style={{ fontSize: "14px", color: "#6b7280", fontWeight: "500" }}>
                    Date
                  </span>
                  <span style={{ fontSize: "14px", color: "#111827", fontWeight: "600" }}>
                    📅 {ticket.date || new Date().toLocaleDateString()}
                  </span>
                </div>
                <div style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "12px 16px",
                  background: "#f9fafb",
                  borderRadius: "12px"
                }}>
                  <span style={{ fontSize: "14px", color: "#6b7280", fontWeight: "500" }}>
                    Time Slot
                  </span>
                  <span style={{ fontSize: "14px", color: "#111827", fontWeight: "600" }}>
                    ⏰ {ticket.timeSlot || "N/A"}
                  </span>
                </div>
                <div style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "12px 16px",
                  background: "#f9fafb",
                  borderRadius: "12px"
                }}>
                  <span style={{ fontSize: "14px", color: "#6b7280", fontWeight: "500" }}>
                    Quantity
                  </span>
                  <span style={{ fontSize: "14px", color: "#111827", fontWeight: "600" }}>
                    {ticket.quantity || 1} {(ticket.quantity || 1) > 1 ? "Tickets" : "Ticket"}
                  </span>
                </div>
                <div style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "12px 16px",
                  background: "linear-gradient(135deg, #f0f4ff 0%, #e9efff 100%)",
                  borderRadius: "12px",
                  border: "1px solid #667eea"
                }}>
                  <span style={{ 
                    fontSize: "16px", 
                    color: "#667eea",
                    fontWeight: "700"
                  }}>
                    Total Amount
                  </span>
                  <span style={{ 
                    fontSize: "18px", 
                    color: "#667eea",
                    fontWeight: "800"
                  }}>
                    ₹{ticket.amount || 0}
                  </span>
                </div>
              </div>
            </div>

            {/* QR Code - Using Canvas Element */}
            <div style={{
              textAlign: "center",
              padding: "24px",
              background: "#f9fafb",
              borderRadius: "16px",
              border: "2px dashed #d1d5db"
            }}>
              <p style={{
                margin: "0 0 16px",
                fontSize: "14px",
                fontWeight: "700",
                color: "#111827",
                textTransform: "uppercase",
                letterSpacing: "0.5px"
              }}>
                Entry QR Code
              </p>
              <div style={{
                background: "white",
                padding: "16px",
                borderRadius: "12px",
                display: "inline-block",
                boxShadow: "0 2px 8px rgba(0,0,0,0.08)"
              }}>
                <canvas
                  ref={qrCanvasRef}
                  style={{
                    display: "block",
                    width: "200px",
                    height: "200px"
                  }}
                />
              </div>
              <p style={{
                margin: "16px 0 0",
                fontSize: "12px",
                color: "#6b7280"
              }}>
                📱 Scan this QR code at museum entry
              </p>
            </div>

            {/* Booking ID */}
            <div style={{
              marginTop: "24px",
              padding: "16px",
              background: "#f9fafb",
              borderRadius: "12px",
              textAlign: "center"
            }}>
              <p style={{
                margin: "0 0 4px",
                fontSize: "12px",
                color: "#6b7280",
                fontWeight: "600"
              }}>
                Booking ID
              </p>
              <p style={{
                margin: 0,
                fontSize: "14px",
                color: "#111827",
                fontWeight: "700",
                fontFamily: "monospace",
                wordBreak: "break-all"
              }}>
                {ticket._id}
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: "flex", gap: "12px" }}>
          <button
            onClick={downloadTicket}
            disabled={downloading}
            style={{
              flex: 1,
              padding: "16px",
              borderRadius: "16px",
              border: "none",
              background: downloading 
                ? "#9ca3af" 
                : "linear-gradient(135deg, #10b981 0%, #059669 100%)",
              fontSize: "16px",
              fontWeight: "700",
              cursor: downloading ? "not-allowed" : "pointer",
              boxShadow: downloading ? "none" : "0 8px 20px rgba(16, 185, 129, 0.4)",
              transition: "all 0.2s",
              color: "white",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px"
            }}
            onMouseEnter={(e) => {
              if (!downloading) {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = "0 12px 24px rgba(16, 185, 129, 0.5)";
              }
            }}
            onMouseLeave={(e) => {
              if (!downloading) {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 8px 20px rgba(16, 185, 129, 0.4)";
              }
            }}
          >
            <span style={{ fontSize: "20px" }}>
              {downloading ? "⏳" : "⬇️"}
            </span>
            {downloading ? "Downloading..." : "Download Ticket"}
          </button>

          <button
            onClick={() => navigate("/home")}
            style={{
              flex: 1,
              padding: "16px",
              borderRadius: "16px",
              border: "2px solid white",
              background: "rgba(255, 255, 255, 0.2)",
              fontSize: "16px",
              fontWeight: "700",
              cursor: "pointer",
              transition: "all 0.2s",
              color: "white",
              backdropFilter: "blur(10px)"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(255, 255, 255, 0.3)";
              e.currentTarget.style.transform = "translateY(-2px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(255, 255, 255, 0.2)";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            🏠 Back to Home
          </button>
        </div>

        {/* Auto redirect notice */}
        <p style={{
          textAlign: "center",
          color: "rgba(255, 255, 255, 0.8)",
          fontSize: "14px",
          marginTop: "16px"
        }}>
          You'll be redirected to home in 30 seconds
        </p>
      </div>

      <style>{`
        @keyframes fadeInDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes scaleIn {
          from {
            transform: scale(0);
          }
          to {
            transform: scale(1);
          }
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default PaymentSuccess;