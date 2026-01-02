import QRCode from "qrcode";

export const generateQRCode = async (ticketData) => {
  const qr = await QRCode.toDataURL(
    JSON.stringify({
      ticketId: ticketData._id,
      user: ticketData.user,
      date: ticketData.date,
      timeSlot: ticketData.timeSlot
    })
  );
  return qr;
};
