import { NextRequest, NextResponse } from "next/server";
import { sendHREmail, HREmailPayload } from "@/lib/mailService";

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { to, subject, applicantName, position, message } =
    body as Partial<HREmailPayload>;

  if (!to || !subject || !applicantName || !position || !message) {
    return NextResponse.json(
      {
        error:
          "Missing required fields: to, subject, applicantName, position, message",
      },
      { status: 400 }
    );
  }

  // Basic email format validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(to)) {
    return NextResponse.json(
      { error: "Invalid email address for 'to' field" },
      { status: 400 }
    );
  }

  const result = await sendHREmail({ to, subject, applicantName, position, message });

  if (!result.success) {
    return NextResponse.json(
      { error: result.error ?? "Failed to send email" },
      { status: 500 }
    );
  }

  return NextResponse.json(
    { success: true, messageId: result.messageId },
    { status: 200 }
  );
}
