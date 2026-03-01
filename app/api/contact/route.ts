export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

const SMTP_CONFIG = {
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.GMAIL_USER!,
    pass: process.env.GMAIL_PASS!,
  },
  connectionTimeout: 10000,
  greetingTimeout: 10000,
  socketTimeout: 15000,
};

export async function POST(request: Request) {
  try {
    const { name, email, phone, subject, message, website, privacy } =
      await request.json();

    if (website) {
      return NextResponse.json({ success: true });
    }

    if (!name || !email || !message || !privacy) {
      return NextResponse.json(
        { error: "Nome, email e messaggio sono obbligatori." },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Formato email non valido." },
        { status: 400 }
      );
    }

    if (!process.env.GMAIL_USER || !process.env.GMAIL_PASS) {
      return NextResponse.json(
        { error: "Configurazione email incompleta." },
        { status: 500 }
      );
    }

    const transporter = nodemailer.createTransport(SMTP_CONFIG);

    await transporter.sendMail({
      from: `"Sito Psicologo" <${process.env.GMAIL_USER}>`,
      to: "davide.secci26@gmail.com",
      replyTo: email,
      subject: `Nuovo messaggio da ${name}: ${subject || "Contatto Blog"}`,
      html: `
        <h2>Nuovo messaggio dal sito</h2>
        <p><strong>Nome:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Telefono:</strong> ${phone || "Non fornito"}</p>
        <hr />
        <p>${message}</p>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    const errMsg = error instanceof Error ? error.message : String(error);
    console.error("Errore invio email:", errMsg);
    return NextResponse.json(
      { error: "Errore interno durante l'invio." },
      { status: 500 }
    );
  }
}