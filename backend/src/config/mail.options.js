import { ENV } from "./env.config.js"

export const mailOptionsForOtp = (email, otp) => {
    return {
        from: ENV.SENDER_MAIL,
        to: email,
        subject: 'Email Verification OTP',
        html: `
    <div style="background-color:#ffffff; padding:40px 20px; font-family:'Segoe UI', Arial, sans-serif;">
        <div style="max-width:480px; margin:0 auto; background-color:#ffffff; border-radius:20px; padding:40px 32px; border:1px solid #EFEFEF; box-shadow:0 8px 30px rgba(59,111,224,0.08);">
            
            <div style="text-align:center; margin-bottom:24px;">
                <div style="display:inline-block; width:56px; height:56px; border-radius:50%; background:linear-gradient(135deg,#3B6FE0,#8B5CF6);"></div>
            </div>

            <h2 style="color:#161B33; text-align:center; margin:0 0 8px; font-size:20px;">Verify Your Email</h2>
            <p style="color:#6B7094; text-align:center; margin:0 0 32px; font-size:14px; line-height:1.5;">
                Use the code below to verify your email address. This code is valid for a limited time.
            </p>

            <div style="background:linear-gradient(135deg, rgba(59,111,224,0.08), rgba(139,92,246,0.08)); border:1px solid rgba(59,111,224,0.15); border-radius:16px; padding:20px; text-align:center; margin-bottom:32px;">
                <span style="font-size:32px; font-weight:700; letter-spacing:8px; background:linear-gradient(135deg,#3B6FE0,#8B5CF6); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text;">
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
    <div style="background-color:#ffffff; padding:40px 20px; font-family:'Segoe UI', Arial, sans-serif;">
        <div style="max-width:480px; margin:0 auto; background-color:#ffffff; border-radius:20px; padding:40px 32px; border:1px solid #EFEFEF; box-shadow:0 8px 30px rgba(59,111,224,0.08);">
            
            <div style="text-align:center; margin-bottom:24px;">
                <div style="display:inline-block; width:56px; height:56px; border-radius:50%; background:linear-gradient(135deg,#3B6FE0,#8B5CF6);"></div>
            </div>

            <h2 style="color:#161B33; text-align:center; margin:0 0 8px; font-size:22px;">
                Welcome to Nexify, ${firstName}!
            </h2>
            <p style="color:#6B7094; text-align:center; margin:0 0 32px; font-size:14px; line-height:1.6;">
                Your account has been created successfully. Start building your network, sharing posts, and connecting with people who matter.
            </p>

            <div style="text-align:center; margin-bottom:32px;">
                <a href="${ENV.CLIENT_URL}" style="display:inline-block; background:linear-gradient(135deg,#3B6FE0,#8B5CF6); color:#ffffff; text-decoration:none; font-size:14px; font-weight:600; padding:14px 32px; border-radius:9999px;">
                    Go to Nexify
                </a>
            </div>

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

export const mailOptionsForResetOtp = (email, otp) => {
    return {
        from: ENV.SENDER_MAIL,
        to: email,
        subject: 'Reset Password OTP for your Nexify account',
        html: `
        <div style="background-color:#ffffff; padding:40px 20px; font-family:'Segoe UI', Arial, sans-serif;">
            <div style="max-width:480px; margin:0 auto; background-color:#ffffff; border-radius:20px; padding:40px 32px; border:1px solid #EFEFEF; box-shadow:0 8px 30px rgba(59,111,224,0.08);">
                
                <div style="text-align:center; margin-bottom:24px;">
                    <div style="display:inline-block; width:56px; height:56px; border-radius:50%; background:linear-gradient(135deg,#3B6FE0,#8B5CF6); line-height:56px; text-align:center; font-family:'Segoe UI', Arial, sans-serif; font-size:26px; font-weight:700; color:#ffffff;">N</div>
                </div>

                <h2 style="color:#161B33; text-align:center; margin:0 0 8px; font-size:20px;">Reset Your Password</h2>
                <p style="color:#6B7094; text-align:center; margin:0 0 32px; font-size:14px; line-height:1.5;">
                    Use the code below to reset your Nexify account password. This code is valid for 10 minutes.
                </p>

                <div style="background:linear-gradient(135deg, rgba(59,111,224,0.08), rgba(139,92,246,0.08)); border:1px solid rgba(59,111,224,0.15); border-radius:16px; padding:20px; text-align:center; margin-bottom:32px;">
                    <span style="font-size:32px; font-weight:700; letter-spacing:8px; color:#3B6FE0;">
                        ${otp}
                    </span>
                </div>

                <p style="color:#6B7094; text-align:center; font-size:13px; margin:0 0 4px;">
                    Didn't request this? You can safely ignore this email — your password won't be changed.
                </p>
            </div>

            <p style="text-align:center; color:#6B7094; font-size:12px; margin-top:24px;">
                &copy; ${new Date().getFullYear()} Nexify. All rights reserved.
            </p>
        </div>
        `
    }
}