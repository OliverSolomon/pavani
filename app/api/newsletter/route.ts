import { NextResponse } from 'next/server';
import { MailtrapClient } from 'mailtrap';

// Initialize Mailtrap lazily to avoid build-time errors if API key is missing
let client: MailtrapClient | null = null;

export async function POST(request: Request) {
  try {
    const apiKey = process.env.MAILTRAP_API_KEY;

    if (!apiKey) {
      console.error('MAILTRAP_API_KEY is not defined in environment variables.');
      return NextResponse.json(
        { error: 'Email service is not configured' },
        { status: 500 }
      );
    }

    if (!client) {
      client = new MailtrapClient({ token: apiKey });
    }

    const { email } = await request.json();

    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Valid email is required' },
        { status: 400 }
      );
    }

    // Notify the Pavani Realty inbox of a new subscriber
    const notifyTo = process.env.NEWSLETTER_NOTIFY_EMAIL || 'pavanirealtyco@gmail.com';
    const response = await client.send({
      from: { email: 'hello@demomailtrap.com', name: 'Pavani Realty Collective' }, // Replace with your verified domain in production
      to: [{ email: notifyTo }],
      subject: 'New Newsletter Subscription: Pavani Realty Co',
      html: `
        <div style="font-family: serif; padding: 20px; color: #1C1714; background-color: #FAF8F4;">
          <h2 style="text-transform: uppercase; border-bottom: 1px solid #82000D; padding-bottom: 10px; color: #82000D;">New Subscription</h2>
          <p style="font-size: 16px;">You have a new subscriber to the Pavani Realty Collective.</p>
          <div style="background-color: #82000D; color: #FBF5F2; padding: 15px; margin-top: 20px;">
            <strong>Subscriber Email:</strong> ${email}
          </div>
          <p style="font-size: 12px; margin-top: 30px; color: #7A7068;">This is an automated notification from the Pavani Realty platform.</p>
        </div>
      `,
    });

    return NextResponse.json({ success: true, data: response });
  } catch (err: any) {
    console.error('API Error:', err);
    return NextResponse.json(
      { error: err.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
