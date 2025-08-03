const nodemailer = require("nodemailer");

const sendEmail =async (options) => {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOpts={
    from:`"Home-Maintenance-Platform-App" <${process.env.EMAIL_USER}>`,
    to:options.email,//dynamic
    subject:options.subject,
    text:options.message,
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
        <h2 style="color: #007bff;">${options.subject}</h2>
        <p style="font-size: 16px;">${options.message}</p>

        ${options.buttonText && options.url ? `
          <a href="${options.url}" 
             style="display: inline-block; padding: 10px 20px; margin-top: 20px;
                    background-color: #007bff; color: white; text-decoration: none;
                    border-radius: 5px;">
            ${options.buttonText}
          </a>
        ` : ""}

        <p style="margin-top: 30px; font-size: 14px; color: #777;">
          This email was sent from Home Maintenance Platform App.
        </p>
      </div>
    `
  }
  await transporter.sendMail(mailOpts)
};

module.exports=sendEmail;