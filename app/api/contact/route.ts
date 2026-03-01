import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, subject, message, website, privacy } = body;

    // 1. Protezione Honeypot: se il campo "website" è pieno, è un bot
    if (website) {
      return NextResponse.json({ success: true, message: "Spam detected" });
    }

    // 2. Validazione server-side
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

    // 3. Configurazione Nodemailer (Gmail SMTP)
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
      },
    });

    // 4. Costruzione email
    const mailOptions = {
      from: process.env.GMAIL_USER,
      to: "davide.secci26@gmail.com",
      replyTo: email,
      subject: `Nuovo messaggio da ${name}: ${subject || "Contatto Blog"}`,
      text: `
        Hai ricevuto un nuovo messaggio dal modulo contatti del sito.

        Dati mittente:
        - Nome: ${name}
        - Email: ${email}
        - Telefono: ${phone || "Non fornito"}

        Messaggio:
        ${message}
      `,
      html: `
        <div style="font-family: sans-serif; line-height: 1.6; color: #333;">
          <h2>Nuovo messaggio dal sito</h2>
          <p><strong>Nome:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Telefono:</strong> ${phone || "Non fornito"}</p>
          <p><strong>Oggetto:</strong> ${subject || "Nessun oggetto"}</p>
          <hr />
          <p><strong>Messaggio:</strong></p>
          <p style="white-space: pre-wrap;">${message}</p>
        </div>
      `,
    };

    // 5. Invio
    await transporter.sendMail(mailOptions);

    return NextResponse.json({ success: true });
  } catch (error) {
    // Log lato server per debug su Vercel/Local
    console.error("Errore invio email:", error);

    return NextResponse.json(
      { error: "Errore interno durante l'invio del messaggio." },
      { status: 500 }
    );
  }
}
