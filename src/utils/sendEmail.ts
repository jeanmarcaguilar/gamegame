import emailjs from '@emailjs/browser';

interface ContactPayload {
  name: string;
  email: string;
  subject: string;
  message: string;
}

interface ContactResponse {
  ok: boolean;
  error?: string;
}

/**
 * Reads EmailJS keys from import.meta.env and dispatches a contact
 * message. Set VITE_EMAILJS_SERVICE_ID, VITE_EMAILJS_TEMPLATE_ID,
 * VITE_EMAILJS_PUBLIC_KEY in .env for production use.
 */
export async function sendContactEmail(payload: ContactPayload): Promise<ContactResponse> {
  const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID as string | undefined;
  const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID as string | undefined;
  const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY as string | undefined;

  if (!serviceId || !templateId || !publicKey) {
    // Friendly fallback when env vars are not configured — keeps the demo
    // experience feeling real without sending to a real address.
    console.warn('[sendContactEmail] EmailJS env vars not set — logging payload only.');
    console.info('[sendContactEmail] Received:', payload);
    return new Promise((resolve) => {
      setTimeout(() => resolve({ ok: true }), 900);
    });
  }

  try {
    await emailjs.send(serviceId, templateId, payload as unknown as Record<string, unknown>, { publicKey });
    return { ok: true };
  } catch (err) {
    const message =
      err instanceof Error ? err.message : 'Unknown error while sending email.';
    return { ok: false, error: message };
  }
}
