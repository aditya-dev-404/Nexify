import { BrevoClient } from "@getbrevo/brevo";
import { ENV } from "./env.config.js";

const brevoClient = new BrevoClient({
    apiKey: ENV.BREVO_API_KEY
});

export const sendEmail = async ({ from, to, subject, html }) => {
    return await brevoClient.transactionalEmails.sendTransacEmail({
        sender: {
            email: from,
            name: "Nexify"
        },
        to: [
            {
                email: to
            }
        ],
        subject,
        htmlContent: html
    });
};