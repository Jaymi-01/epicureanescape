import nodemailer from 'nodemailer';

// Configure the transporter
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER || "",
    pass: process.env.EMAIL_PASS || "",
  },
});

interface MenuItem {
  name: string
  price: string
  description: string
  category: string
}

export async function sendMenuEmail(toEmail: string, guestName: string, menuItems: MenuItem[] = []) {
  console.log("Attempting to send email...");
  console.log("User:", process.env.EMAIL_USER ? "Set" : "Missing");
  console.log("Pass:", process.env.EMAIL_PASS ? "Set" : "Missing");

  // Group items by category
  const mains = menuItems.filter(i => i.category === 'Main' || i.category === 'Main Course');
  const desserts = menuItems.filter(i => i.category === 'Dessert');

  // Helper to generate HTML for a list of items
  const renderItems = (items: MenuItem[]) => items.map(item => `
    <div style="margin-bottom: 15px;">
      <p style="margin: 0; font-weight: bold; font-size: 18px;">${item.name} <span style="float: right; color: #741213;">₦${item.price}</span></p>
      <p style="margin: 5px 0 0 0; font-size: 14px; color: #666;">${item.description}</p>
    </div>
  `).join('');

  const mailOptions = {
    from: `"Epicurean Escape" <${process.env.EMAIL_USER || ""}>`,
    to: toEmail,
    subject: "Your Exclusive Menu Access | Epicurean Escape by Tiara",
    html: `
      <div style="font-family: 'Georgia', serif; color: #0A0A0A; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #FAFAFA; border: 1px solid #C5A059;">
        <div style="text-align: center; border-bottom: 2px solid #741213; padding-bottom: 20px; margin-bottom: 20px;">
          <h1 style="color: #741213; margin: 0; text-transform: uppercase; letter-spacing: 2px;">Epicurean Escape</h1>
          <p style="font-style: italic; color: #741213; margin-top: 5px;">by Tiara</p>
        </div>

        <p>Dear ${guestName},</p>
        
        <p>We are delighted to confirm your reservation request. As promised, here is exclusive access to our full seasonal menu.</p>

        ${mains.length > 0 ? `
        <div style="background-color: #fff; padding: 20px; border: 1px solid #e5e5e5; margin: 20px 0;">
          <h2 style="color: #741213; text-align: center; border-bottom: 1px solid #C5A059; padding-bottom: 10px;">Main Courses</h2>
          ${renderItems(mains)}
        </div>` : ''}

        ${desserts.length > 0 ? `
        <div style="background-color: #fff; padding: 20px; border: 1px solid #e5e5e5; margin: 20px 0;">
          <h2 style="color: #741213; text-align: center; border-bottom: 1px solid #C5A059; padding-bottom: 10px;">Desserts</h2>
          ${renderItems(desserts)}
        </div>` : ''}

        <p>We look forward to welcoming you.</p>
        
        <p style="font-size: 12px; text-align: center; margin-top: 30px; color: #999;">
          &copy; ${new Date().getFullYear()} Epicurean Escape by Tiara. All rights reserved.
        </p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully");
    return true;
  } catch (error) {
    console.error("Error sending email:", error);
    return false;
  }
}

export async function sendThankYouEmail(toEmail: string, guestName: string) {
  const mailOptions = {
    from: `"Epicurean Escape" <${process.env.EMAIL_USER || ""}>`,
    to: toEmail,
    subject: "Thank you for dining with us | Epicurean Escape by Tiara",
    html: `
      <div style="font-family: 'Georgia', serif; color: #0A0A0A; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #FAFAFA; border: 1px solid #C5A059;">
        <div style="text-align: center; border-bottom: 2px solid #741213; padding-bottom: 20px; margin-bottom: 20px;">
          <h1 style="color: #741213; margin: 0; text-transform: uppercase; letter-spacing: 2px;">Epicurean Escape</h1>
          <p style="font-style: italic; color: #741213; margin-top: 5px;">by Tiara</p>
        </div>

        <p>Dear ${guestName},</p>
        
        <p>It was a pleasure hosting you at Epicurean Escape. We hope your evening was nothing short of extraordinary.</p>

        <p>Our team strives to create unforgettable moments through our culinary art. If you enjoyed your experience, we would be honored if you could share your thoughts with us.</p>

        <div style="text-align: center; margin: 30px 0;">
          <a href="https://google.com" style="background-color: #741213; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">Leave a Review</a>
        </div>

        <p>We eagerly await your next visit.</p>
        
        <p style="font-size: 12px; text-align: center; margin-top: 30px; color: #999;">
          &copy; ${new Date().getFullYear()} Epicurean Escape by Tiara. All rights reserved.
        </p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error("Error sending thank you email:", error);
    return false;
  }
}
