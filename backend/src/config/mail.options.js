import { ENV } from "./env.config.js"

export const mailOptionsForOtp = (email, otp)=>{
    return {
    from: ENV.SENDER_MAIL,
    to: email,
    subject: 'Email Verification OTP',
    html: `
    <div style="background-color:#ECEBE8; padding:40px 20px; font-family:'Segoe UI', Arial, sans-serif;">
        <div style="max-width:480px; margin:0 auto; background-color:#F0EFEC; border-radius:20px; padding:40px 32px; box-shadow:0 4px 20px rgba(0,0,0,0.08);">
            
            <div style="text-align:center; margin-bottom:24px;">
                <div style="display:inline-block; width:56px; height:56px; border-radius:50%; background:linear-gradient(135deg,#3B6FE0,#8B5CF6);"></div>
            </div>

            <h2 style="color:#161B33; text-align:center; margin:0 0 8px; font-size:20px;">Verify Your Email</h2>
            <p style="color:#6B7094; text-align:center; margin:0 0 32px; font-size:14px; line-height:1.5;">
                Use the code below to verify your email address. This code is valid for a limited time.
            </p>

            <div style="background-color:#F7F6F3; border-radius:16px; padding:20px; text-align:center; margin-bottom:32px; box-shadow: inset 3px 3px 6px #C9C7C1, inset -3px -3px 6px #FFFFFF;">
                <span style="font-size:32px; font-weight:700; letter-spacing:8px; color:#3B6FE0;">
                    ${otp}
                </span>
            </div>

            <p style="color:#6B7094; text-align:center; font-size:13px; margin:0 0 4px;">
                Didn't request this code? You can safely ignore this email.
            </p>
        </div>

        <p style="text-align:center; color:#6B7094; font-size:12px; margin-top:24px;">
            &copy; ${new Date().getFullYear()} Nexify. All rights reserved.
        </p>
    </div>
    `
    }
}

export const welcomeMailOptions = (email, firstName) => {
    return {
    from: ENV.SENDER_MAIL,
    to: email,
    subject: 'Welcome to Nexify 🎉',
    html: `
    <div style="background-color:#ECEBE8; padding:40px 20px; font-family:'Segoe UI', Arial, sans-serif;">
        <div style="max-width:480px; margin:0 auto; background-color:#F0EFEC; border-radius:20px; padding:40px 32px; box-shadow:0 4px 20px rgba(0,0,0,0.08);">
            
            <div style="text-align:center; margin-bottom:24px;">
                <div style="display:inline-block; width:56px; height:56px; border-radius:50%; background:linear-gradient(135deg,#3B6FE0,#8B5CF6);"></div>
            </div>

            <h2 style="color:#161B33; text-align:center; margin:0 0 8px; font-size:22px;">
                Welcome to Nexify, ${firstName}!
            </h2>
            <p style="color:#6B7094; text-align:center; margin:0 0 32px; font-size:14px; line-height:1.6;">
                Your account has been created successfully. Start building your network, sharing posts, and connecting with people who matter.
            </p>

            <p style="color:#6B7094; text-align:center; font-size:13px; margin:0;">
                If you didn't create this account, please ignore this email.
            </p>
        </div>

        <p style="text-align:center; color:#6B7094; font-size:12px; margin-top:24px;">
            &copy; ${new Date().getFullYear()} Nexify. All rights reserved.
        </p>
    </div>
    `
}
}