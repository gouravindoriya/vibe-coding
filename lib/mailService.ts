import nodemailer from "nodemailer";

export interface HREmailPayload {
  to: string;
  subject: string;
  applicantName: string;
  position: string;
  message: string;
}

export interface MailServiceConfig {
  host: string;
  port: number;
  secure: boolean;
  auth: {
    user: string;
    pass: string;
  };
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function createTransporter(config?: Partial<MailServiceConfig>) {
  const transportConfig: MailServiceConfig = {
    host: config?.host ?? process.env.MAIL_HOST ?? "smtp.gmail.com",
    port: config?.port ?? Number(process.env.MAIL_PORT ?? 587),
    secure: config?.secure ?? process.env.MAIL_SECURE === "true",
    auth: {
      user: config?.auth?.user ?? process.env.MAIL_USER ?? "",
      pass: config?.auth?.pass ?? process.env.MAIL_PASS ?? "",
    },
  };
  return nodemailer.createTransport(transportConfig);
}

export async function sendHREmail(
  payload: HREmailPayload,
  config?: Partial<MailServiceConfig>
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  const { to, subject, applicantName, position, message } = payload;

  const transporter = createTransporter(config);

  const htmlBody = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #333;">New Application - ${escapeHtml(position)}</h2>
      <p><strong>Applicant Name:</strong> ${escapeHtml(applicantName)}</p>
      <p><strong>Position:</strong> ${escapeHtml(position)}</p>
      <hr style="border: 1px solid #eee;" />
      <h3 style="color: #555;">Message</h3>
      <p style="white-space: pre-wrap;">${escapeHtml(message)}</p>
    </div>
  `;

  try {
    const info = await transporter.sendMail({
      from: process.env.MAIL_FROM ?? process.env.MAIL_USER,
      to,
      subject,
      html: htmlBody,
    });
    return { success: true, messageId: info.messageId };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";
    return { success: false, error: errorMessage };
  }
}
