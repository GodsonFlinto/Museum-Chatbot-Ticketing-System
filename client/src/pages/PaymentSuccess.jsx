import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const PaymentSuccess = () => {
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);

  const hasVerified = useRef(false);
  const ticketRef = useRef(null);
  const navigate = useNavigate();

  // ✅ Logged-in user from Redux
  const user = useSelector((state) => state.auth.user);

  // ✅ Verify payment ONLY ONCE
  useEffect(() => {
    if (hasVerified.current) return;
    hasVerified.current = true;

    const verifyPayment = async () => {
      try {
        const sessionId = new URLSearchParams(
          window.location.search
        ).get("session_id");

        if (!sessionId) {
          throw new Error("Session ID missing");
        }

        // 1️⃣ Verify payment
        const verifyRes = await api.post("/payment/verify", { sessionId });

        // 2️⃣ Fetch ticket
        const ticketRes = await api.get(
          `/tickets/${verifyRes.data.ticketId}`
        );

        setTicket(ticketRes.data);
      } catch (error) {
        console.error(error);
        alert("Payment verification failed");
      } finally {
        setLoading(false);
      }
    };

    verifyPayment();
  }, []);

  // ⏱ Auto redirect back to chat (optional)
  useEffect(() => {
    if (!ticket) return;

    const timer = setTimeout(() => {
      navigate("/home");
    }, 30000);

    return () => clearTimeout(timer);
  }, [ticket, navigate]);

  // ⬇️ DOWNLOAD TICKET AS PDF
  const downloadTicket = async () => {
    const element = ticketRef.current;

    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true
    });

    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const imgHeight = (canvas.height * pdfWidth) / canvas.width;

    pdf.addImage(imgData, "PNG", 0, 10, pdfWidth, imgHeight);
    pdf.save("museum-ticket.pdf");
  };

  if (loading) return <h3 style={{ textAlign: "center" }}>Verifying payment...</h3>;
  if (!ticket) return <h3 style={{ textAlign: "center" }}>Something went wrong</h3>;

  return (
    <div style={{ maxWidth: 420, margin: "40px auto", textAlign: "center" }}>
      {/* TICKET CONTENT (USED FOR PDF) */}
      <div
        ref={ticketRef}
        style={{
          padding: 20,
          borderRadius: 12,
          background: "var(--card)",
          boxShadow: "var(--shadow)",
          textAlign: "left"
        }}
      >
        <h2 style={{ textAlign: "center" }}>🎉 Booking Confirmed</h2>

        {/* USER DETAILS */}
        <div style={{ marginBottom: 16 }}>
          <h4>User Details</h4>
          <p><b>Name:</b> {user?.name}</p>
          <p><b>Email:</b> {user?.email}</p>
        </div>

        <hr style={{ borderColor: "var(--border)" }} />

        {/* TICKET DETAILS */}
        <div style={{ marginTop: 16 }}>
          <h4>Ticket Details</h4>
          <p><b>Type:</b> {ticket.ticketType}</p>
          <p><b>Date:</b> {ticket.date}</p>
          <p><b>Time:</b> {ticket.timeSlot}</p>
          <p><b>Quantity:</b> {ticket.quantity}</p>
        </div>

        {/* QR CODE */}
        <div style={{ textAlign: "center", marginTop: 20 }}>
          <img
            src={ticket.qrCode}
            alt="QR Code"
            style={{ width: 180 }}
          />
          <p style={{ fontSize: 12, marginTop: 8 }}>
            Show this QR code at museum entry
          </p>
        </div>
      </div>

      {/* DOWNLOAD BUTTON */}
      <button
        onClick={downloadTicket}
        style={{
          marginTop: 16,
          padding: "10px 18px",
          background: "var(--primary)",
          color: "#fff",
          border: "none",
          borderRadius: 20,
          cursor: "pointer"
        }}
      >
        ⬇️ Download Ticket
      </button>
    </div>
  );
};

export default PaymentSuccess;
