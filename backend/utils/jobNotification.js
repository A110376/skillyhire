import User from "../models/userSchema.js";
import { sendEmail } from "./sendEmail.js";

export const triggerJobNotification = async (job) => {
  try {
    const users = await User.findAll();

    const matchedUsers = users.filter(user =>
      [
        user.niches?.firstNiche,
        user.niches?.secondNiche,
        user.niches?.thirdNiche
      ].includes(job.jobNiche)
    );

    for (const user of matchedUsers) {
      sendEmail({
        email: user.email,
        subject: `New Job Alert: ${job.title}`,
        message: `Hi ${user.name}, new job posted: ${job.title}`
      }).catch(err => console.log("Email failed:", err.message));
    }

  } catch (err) {
    console.log("Notification error:", err.message);
  }
};
