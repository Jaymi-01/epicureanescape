import nodemailer from 'nodemailer';

// Configure the transporter
// You will need to add EMAIL_USER and EMAIL_PASS to your .env.local file
const transporter = nodemailer.createTransport({
  service: 'gmail', // You can change this to 'outlook', 'yahoo', etc.
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, // For Gmail, this MUST be an App Password
  },
});

export async function sendMenuEmail(toEmail: string, guestName: string) {
  const mailOptions = {
    from: `"Epicurean Escape" <${process.env.EMAIL_USER}>`,
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

        <div style="background-color: #fff; padding: 20px; border: 1px solid #e5e5e5; margin: 20px 0;">
          <h2 style="color: #741213; text-align: center; border-bottom: 1px solid #C5A059; padding-bottom: 10px;">Main Courses</h2>
          
          <div style="margin-bottom: 15px;">
            <p style="margin: 0; font-weight: bold; font-size: 18px;">Pan-Seared Duck Breast <span style="float: right; color: #741213;">$45</span></p>
            <p style="margin: 5px 0 0 0; font-size: 14px; color: #666;">Cherry gastrique, parsnip purée, roasted root vegetables.</p>
          </div>

          <div style="margin-bottom: 15px;">
            <p style="margin: 0; font-weight: bold; font-size: 18px;">Wagyu Beef Tenderloin <span style="float: right; color: #741213;">$85</span></p>
            <p style="margin: 5px 0 0 0; font-size: 14px; color: #666;">Potato pavé, bordelaise sauce, bone marrow butter.</p>
          </div>

          <div style="margin-bottom: 15px;">
            <p style="margin: 0; font-weight: bold; font-size: 18px;">Miso Glazed Black Cod <span style="float: right; color: #741213;">$52</span></p>
            <p style="margin: 5px 0 0 0; font-size: 14px; color: #666;">Bok choy, ginger dashi, lotus root chips.</p>
          </div>

           <div style="margin-bottom: 15px;">
            <p style="margin: 0; font-weight: bold; font-size: 18px;">Wild Mushroom Risotto <span style="float: right; color: #741213;">$38</span></p>
            <p style="margin: 5px 0 0 0; font-size: 14px; color: #666;">Arborio rice, parmesan crisp, truffle shavings.</p>
          </div>
        </div>

        <div style="background-color: #fff; padding: 20px; border: 1px solid #e5e5e5; margin: 20px 0;">
          <h2 style="color: #741213; text-align: center; border-bottom: 1px solid #C5A059; padding-bottom: 10px;">Desserts</h2>
          
          <div style="margin-bottom: 15px;">
            <p style="margin: 0; font-weight: bold; font-size: 18px;">Dark Chocolate Soufflé <span style="float: right; color: #741213;">$18</span></p>
            <p style="margin: 5px 0 0 0; font-size: 14px; color: #666;">Crème anglaise, fresh berries.</p>
          </div>

          <div style="margin-bottom: 15px;">
            <p style="margin: 0; font-weight: bold; font-size: 18px;">Lemon Basil Tart <span style="float: right; color: #741213;">$16</span></p>
            <p style="margin: 5px 0 0 0; font-size: 14px; color: #666;">Meringue kisses, basil gel, candied zest.</p>
          </div>
        </div>

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
