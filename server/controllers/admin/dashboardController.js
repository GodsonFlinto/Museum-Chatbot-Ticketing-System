import Museum from "../../models/Museum.js";
import Ticket from "../../models/Ticket.js";
import User from "../../models/User.js";

export const getDashboardStats = async (req, res) => {
  try {
    const totalMuseums = await Museum.countDocuments();
    const totalBookings = await Ticket.countDocuments();
    const totalUsers = await User.countDocuments();

    const revenueAgg = await Ticket.aggregate([
      { $match: { status: { $in: ["confirmed", "used"] } } },
      { $group: { _id: null, total: { $sum: "$amount" } } }
    ]);

    const totalRevenue = revenueAgg[0]?.total || 0;

    res.json({
      totalMuseums,
      totalBookings,
      totalUsers,
      totalRevenue
    });
  } catch (err) {
    res.status(500).json({ msg: "Dashboard stats error" });
  }
};
