import cron from "node-cron";
import Job from "../models/jobSchema.js";
import User from "../models/userSchema.js";
import { sendEmail } from "../utils/sendEmail.js";

export const newsLetterCron = () => {
  console.log("📅 Cron job scheduled for sending newsletters...");

  // ⏰ Every 1 minute
  cron.schedule("*/1 * * * *", async () => {
    console.log("⏰ Running newsletter cron job...");

    try {
      // 1. Get jobs where newsletter hasn't been sent
      const jobs = await Job.findAll({ where: { newsLettersSent: false } });

      if (!jobs.length) {
        console.log("ℹ️ No new jobs found to send in newsletter.");
        return;
      }

      // 2. Get all users
      const allUsers = await User.findAll();

      for (const job of jobs) {
        // 3. Match users by niche
        const matchedUsers = allUsers.filter(user =>
          [user.niches?.firstNiche, user.niches?.secondNiche, user.niches?.thirdNiche].includes(job.jobNiche)
        );

        console.log(`📬 Sending "${job.title}" to ${matchedUsers.length} users.`);

        // 4. Send email to each matched user
        for (const user of matchedUsers) {
          const subject = `New Job Alert: ${job.title} in ${job.jobNiche}`;
          const message = `Hi ${user.name},

A new job matching your interest has just been posted!

🧑‍💼 Position: ${job.title}
🏢 Company: ${job.companyName}
📍 Location: ${job.location || 'Not specified'}

Apply soon and don't miss out!

Regards,
Job Portal Team`;

          try {
            await sendEmail({ email: user.email, subject, message });
            await new Promise(resolve => setTimeout(resolve, 100)); // minor delay to avoid spam filters
          } catch (emailErr) {
            console.error(`❌ Email failed for ${user.email}: ${emailErr.message}`);
          }
        }

        // 5. Mark job as sent
        job.newsLettersSent = true;
        await job.save();

        console.log(`✅ Newsletter sent for "${job.title}"`);
      }
    } catch (err) {
      console.error("❌ Error in newsletter cron job:", err);
    }
  });
};
