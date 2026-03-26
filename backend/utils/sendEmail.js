import nodemailer from "nodemailer";

export const sendApprovalEmail = async (email, name) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Account Approved 🎉",
      html: `
        <h2>Hello ${name}</h2>
        <p>Your CampusConnect account has been approved.</p>
        <p>You can now login.</p>
      `,
    });

  } catch (error) {
    console.log("Email Error:", error);
  }
};