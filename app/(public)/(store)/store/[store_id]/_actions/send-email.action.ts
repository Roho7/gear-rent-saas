"use server"
import { Resend } from 'resend';
import { EmailTemplate, EmailTemplateProps } from './request.template';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendEmail({ name, email, gearType, message, storeName, storeId }: EmailTemplateProps) {
  try {
    const { data, error } = await resend.emails.send({
      from: 'Acme <roho@gearyo.com>',
      to: ['alex@gearyo.com', 'roho@gearyo.com'],
      subject: `New Gear Request from ${name}`,
      react: EmailTemplate({ name, email, gearType, message, storeName, storeId }),
    });

    if (error) {
      return { error: error.message, success: false };
    }

    return { data, success: true };
  } catch (error) {
    return { 
      error: error instanceof Error ? error.message : 'An error occurred',
      success: false 
    };
  }
}