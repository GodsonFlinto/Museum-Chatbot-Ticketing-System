import User from "../../models/User.js";
import Ticket from "../../models/Ticket.js";

/* ================= ADMIN ================= */

/* GET ALL USERS */
export const getAllUsersAdmin = async (req, res) => {
  try {
    const users = await User.find().select("-password");

    // attach booking count
    const usersWithBookings = await Promise.all(
      users.map(async (u) => {
        const count = await Ticket.countDocuments({ user: u._id });
        return { ...u._doc, totalBookings: count };
      })
    );

    res.json(usersWithBookings);
  } catch (err) {
    res.status(500).json({ msg: "Failed to fetch users" });
  }
};

/* BLOCK / UNBLOCK USER */
export const toggleUserStatusAdmin = async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user)
    return res.status(404).json({ msg: "User not found" });

  user.isBlocked = !user.isBlocked;
  await user.save();

  res.json({
    msg: user.isBlocked ? "User blocked" : "User unblocked",
  });
};
