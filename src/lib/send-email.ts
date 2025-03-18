'use server';

import { Resend } from 'resend';
import EmailTemplate from '@/components/EmailTemplate';

// Email recipients
const EMAIL_RECIPIENTS = [
    '00505@uk.mcd.com',
    'radoanecosmin@yahoo.com',
    'lalitbdrthapamagar@gmail.com',
];

type OrderData = {
  items: { [key: string]: number };
  comment?: string;
};

/**
 * Send order notification emails to recipients
 * This is a server action that runs only on the server
 */
export async function sendOrderEmails(orderData: OrderData): Promise<{ success: boolean; error?: string }> {
  const resend = new Resend(process.env.RESEND_API_KEY);
  
  try {
    const { items, comment } = orderData;
    
    if (!items || Object.keys(items).length === 0) {
      return { success: false, error: 'No items selected' };
    }

    // Send email to all recipients
    const emailPromises = EMAIL_RECIPIENTS.map(recipient => 
      resend.emails.send({
        from: 'McDonalds Orders <orders@astrareconslabs.com>',
        to: recipient,
        subject: 'New McDonald\'s Beverage Order',
        react: EmailTemplate({ 
          items, 
          comment: comment || 'No special instructions' 
        }),
      })
    );

    await Promise.all(emailPromises);
    
    return { success: true };
  } catch (error) {
    console.error('Error sending order emails:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to send order emails' 
    };
  }
}