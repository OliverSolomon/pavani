import { NextResponse } from 'next/server';
import { Resend } from 'resend';

// Initialize Resend with API key from environment variable
const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Valid email is required' },
        { status: 400 }
      );
    }

    // Send the email to kiragu@kaararealtygroup.com
    const { data, error } = await resend.emails.send({
      from: 'Kaara Realty Collective <onboarding@resend.dev>', // Replace with your verified domain in production
      to: 'kiragu@kaararealtygroup.com',
      subject: 'New Newsletter Subscription: Kaara Realty Group',
      html: `
        <div style="font-family: serif; padding: 20px; color: #100B28; background-color: #f9f9f9;">
          <h2 style="text-transform: uppercase; border-bottom: 1px solid #100B28; padding-bottom: 10px;">New Subscription</h2>
          <p style="font-size: 16px;">You have a new subscriber to the Kaara Realty Collective.</p>
          <div style="background-color: #100B28; color: white; padding: 15px; margin-top: 20px;">
            <strong>Subscriber Email:</strong> ${email}
          </div>
          <p style="font-size: 12px; margin-top: 30px; color: #666;">This is an automated notification from the Kaara Realty Platform.</p>
        </div>
      `,
    });

    if (error) {
      console.error('Resend error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });
  } catch (err: any) {
    console.error('API Error:', err);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
