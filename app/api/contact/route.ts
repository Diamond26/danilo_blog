import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, phone, subject, message, privacy } = body;

    if (!name || !phone || !message || !privacy) {
      return NextResponse.json(
        { error: "Campi obbligatori mancanti." },
        { status: 400 }
      );
    }

    // TODO: Implementare invio email (es. Resend, Nodemailer, SendGrid)
    // Per ora logga i dati server-side e ritorna successo.
    console.log("Nuovo contatto ricevuto:", { name, phone, subject, message });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Errore del server." },
      { status: 500 }
    );
  }
}
