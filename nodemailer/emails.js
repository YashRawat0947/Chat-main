import {
	PASSWORD_RESET_REQUEST_TEMPLATE,
	PASSWORD_RESET_SUCCESS_TEMPLATE,
	VERIFICATION_EMAIL_TEMPLATE,
} from "./emailsTemplates.js";
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail', // Use Gmail's SMTP service
  auth: {
    user: 'yashgaming0947@gmail.com', // Your Gmail address
    pass: 'wuzr xgvu egrf fsnv'        // Your app password
  }
});

const sender = 'yashgaming0947@gmail.com'; // Your Gmail address

export const sendVerificationEmail = async (email, verificationToken) => {
  const mailOptions = {
    from: sender,
    to: email,
    subject: 'Verify your email',
    html: VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}", verificationToken),
  };

  try {
    const response = await transporter.sendMail(mailOptions);
    console.log("Email sent successfully", response);
  } catch (error) {
    console.error(`Error sending verification`, error);
    throw new Error(`Error sending verification email: ${error}`);
  }
};

export const sendWelcomeEmail = async (email, name) => {
  const mailOptions = {
    from: sender,
    to: email,
    subject: 'Welcome to Black Headers',
    html: `
      <p>Hello ${name},</p>
      <p>Welcome to Black Headers!</p>
      <p>We're excited to have you onboard.</p>
    `,
  };

  try {
    const response = await transporter.sendMail(mailOptions);
    console.log("Welcome email sent successfully", response);
  } catch (error) {
    console.error(`Error sending welcome email`, error);
    throw new Error(`Error sending welcome email: ${error}`);
  }
};

export const sendPasswordResetEmail = async (email, resetURL) => {
  const mailOptions = {
    from: sender,
    to: email,
    subject: 'Reset your password',
    html: PASSWORD_RESET_REQUEST_TEMPLATE.replace('{resetURL}', resetURL),
    // Nodemailer does not support categories directly; you may handle it through custom headers or other means
  };

  try {
    const response = await transporter.sendMail(mailOptions);
    console.log('Reset email sent successfully', response);
  } catch (error) {
    console.error('Error sending password reset email', error);
    throw new Error(`Error sending password reset email: ${error}`);
  }
};

export const sendResetSuccessEmail = async (email) => {
  const mailOptions = {
    from: sender,
    to: email,
    subject: 'Password Reset Successfully',
    html: PASSWORD_RESET_SUCCESS_TEMPLATE,
    // Nodemailer does not support categories directly; you may handle it through custom headers or other means
  };

  try {
    const response = await transporter.sendMail(mailOptions);
    console.log('Password reset success email sent successfully', response);
  } catch (error) {
    console.error('Error sending password reset success email', error);
    throw new Error(`Error sending password reset success email: ${error}`);
  }
};