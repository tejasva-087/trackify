import { Resend } from "resend";
import AppError from "../utils/appError";

const resend = new Resend(process.env.RESEND_API_KEY!);

export type emailParams = {
  to: string;
  subject: string;
  body: string;
};

export async function sendMail({ to, subject, body }: emailParams) {
  const { data, error } = await resend.emails.send({
    from: "Trackify <hello@memorymap.space>",
    to,
    subject,
    html: body,
  });

  if (error) {
    throw new AppError("There was an error sending email.", 500);
  }

  return data;
}
