import { brevo } from '@getbrevo/brevo'

const apiInstance = new brevo.TransactionalEmailsApi();

apiInstance.setApiKey(
    brevo.TransactionalEmailsApiApiKeys.apiKey,
    process.env.BREVO_API_KEY
);

export const sendEmail = async ({ to, subject, html }) => {
    const email = new brevo.SendSmtpEmail();

    email.sender = {
        name: "Nexify",
        email: "your-verified-email@example.com"
    };

    email.to = [
        {
            email: to
        }
    ];

    email.subject = subject;
    email.htmlContent = html;

    return await apiInstance.sendTransacEmail(email);
};