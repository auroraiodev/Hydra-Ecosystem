import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import type { Transporter } from 'nodemailer';

export interface PurchaseEmailData {
  orderId: string;
  customerName: string;
  customerEmail: string;
  totalAmount: string;
  items: Array<{ name: string; quantity: number; price: string }>;
  paymentMethod: string;
  shippingMethod?: string;
}

@Injectable()
export class EmailService {
  private transporter: Transporter | null = null;
  private readonly logger = new Logger(EmailService.name);
  private readonly adminEmail: string;
  private readonly fromAddress: string;
  private enabled: boolean;

  constructor(private configService: ConfigService) {
    this.adminEmail = this.configService.get<string>(
      'EMAIL_ADMIN',
      'contacto@hydracollect.com',
    );
    this.fromAddress = this.configService.get<string>(
      'EMAIL_FROM',
      '"Hydra TCG" <noreply@hydracollect.com>',
    );
    this.enabled = this.configService.get<string>('EMAIL_ENABLED', 'true') !== 'false';

    const apiKey = this.configService.get<string>('RESEND_API_KEY');

    if (!apiKey) {
      this.logger.warn('RESEND_API_KEY not set — email notifications disabled.');
      this.enabled = false;
      return;
    }

    this.transporter = nodemailer.createTransport({
      host: 'smtp.resend.com',
      port: 465,
      secure: true,
      auth: { user: 'resend', pass: apiKey },
    });

    this.logger.log(`EmailService ready (Resend SMTP). Admin: ${this.adminEmail}`);
  }

  async sendPurchaseNotification(data: PurchaseEmailData): Promise<void> {
    if (!this.enabled || !this.transporter) return;
    try {
      await this.transporter.sendMail({
        from: this.fromAddress,
        to: this.adminEmail,
        subject: `🛒 Nueva Compra - Pedido #${data.orderId.substring(0, 8).toUpperCase()}`,
        html: this.purchaseHtml(data),
      });
      this.logger.log(`Purchase email sent to admin for order ${data.orderId}`);
    } catch (err) {
      this.logger.error(`Purchase email failed: ${err.message}`);
    }
  }

  async sendCustomerConfirmation(data: PurchaseEmailData): Promise<void> {
    if (!this.enabled || !this.transporter) return;
    try {
      await this.transporter.sendMail({
        from: this.fromAddress,
        to: data.customerEmail,
        subject: `🎉 ¡Gracias por tu compra! - Pedido #${data.orderId.substring(0, 8).toUpperCase()}`,
        html: this.customerConfirmationHtml(data),
      });
      this.logger.log(`Customer confirmation email sent for order ${data.orderId}`);
    } catch (err) {
      this.logger.error(`Customer confirmation email failed: ${err.message}`);
    }
  }

  async sendPaymentConfirmation(data: PurchaseEmailData): Promise<void> {
    if (!this.enabled || !this.transporter) return;
    try {
      await this.transporter.sendMail({
        from: this.fromAddress,
        to: this.adminEmail,
        subject: `✅ Pago Confirmado - Pedido #${data.orderId.substring(0, 8).toUpperCase()}`,
        html: this.paymentHtml(data, true),
      });
      this.logger.log(`Payment confirmation email sent to admin for order ${data.orderId}`);
    } catch (err) {
      this.logger.error(`Payment confirmation email failed: ${err.message}`);
    }
  }

  async sendCustomerPaymentConfirmation(data: PurchaseEmailData): Promise<void> {
    if (!this.enabled || !this.transporter) return;
    try {
      await this.transporter.sendMail({
        from: this.fromAddress,
        to: data.customerEmail,
        subject: `💳 Pago Recibido - Pedido #${data.orderId.substring(0, 8).toUpperCase()}`,
        html: this.paymentHtml(data, false),
      });
      this.logger.log(`Customer payment email sent for order ${data.orderId}`);
    } catch (err) {
      this.logger.error(`Customer payment email failed: ${err.message}`);
    }
  }

  async sendChatAlert(senderName: string, messageContent: string): Promise<void> {
    if (!this.enabled || !this.transporter) return;
    try {
      await this.transporter.sendMail({
        from: this.fromAddress,
        to: this.adminEmail,
        subject: `💬 Nuevo mensaje en el chat - de ${senderName}`,
        html: this.chatAlertHtml(senderName, messageContent),
      });
      this.logger.log(`Chat alert email sent to admin from ${senderName}`);
    } catch (err) {
      this.logger.error(`Chat alert email failed: ${err.message}`);
    }
  }

  // ── HTML Templates ──────────────────────────────────────────────────────────

  private itemsTable(items: PurchaseEmailData['items']): string {
    const rows = items
      .map(
        (i) => `<tr>
          <td style="padding:10px 12px;border-bottom:1px solid #1f2937;color:#e2e8f0">${i.name}</td>
          <td style="padding:10px 12px;border-bottom:1px solid #1f2937;text-align:center;color:#e2e8f0">${i.quantity}</td>
          <td style="padding:10px 12px;border-bottom:1px solid #1f2937;text-align:right;color:#0d9488;font-weight:600">${i.price}</td>
        </tr>`,
      )
      .join('');
    return `<table style="width:100%;border-collapse:collapse;border-radius:8px;overflow:hidden">
      <thead><tr style="background:#0d9488">
        <th style="padding:10px 12px;text-align:left;color:white;font-size:12px;text-transform:uppercase;letter-spacing:0.05em">Producto</th>
        <th style="padding:10px 12px;text-align:center;color:white;font-size:12px;text-transform:uppercase;letter-spacing:0.05em">Cant.</th>
        <th style="padding:10px 12px;text-align:right;color:white;font-size:12px;text-transform:uppercase;letter-spacing:0.05em">Precio</th>
      </tr></thead>
      <tbody style="background:#111827">${rows}</tbody>
    </table>`;
  }

  private baseLayout(title: string, subtitle: string, content: string): string {
    return `<!DOCTYPE html>
<html lang="es">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${title}</title></head>
<body style="font-family:'Segoe UI',Roboto,Helvetica,Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px;background-color:#0b0f19;color:#e2e8f0">
  <div style="background:linear-gradient(135deg,#0d9488,#14b8a6);padding:35px 20px;border-radius:16px 16px 0 0;text-align:center">
    <h1 style="color:white;margin:0;font-size:24px;font-weight:700">${title}</h1>
    <p style="color:rgba(255,255,255,0.85);margin:8px 0 0;font-size:14px">${subtitle}</p>
  </div>
  <div style="background:#111827;padding:30px;border-radius:0 0 16px 16px;border:1px solid #1f2937;border-top:none">
    ${content}
    <div style="margin-top:32px;border-top:1px solid #1f2937;padding-top:16px;text-align:center;font-size:12px;color:#6b7280">
      Hydra TCG &mdash; hydracollect.com
    </div>
  </div>
</body></html>`;
  }

  private purchaseHtml(data: PurchaseEmailData): string {
    return this.baseLayout(
      '🛒 Nueva Compra Realizada',
      `Pedido #${data.orderId.substring(0, 8).toUpperCase()}`,
      `<p style="margin:0 0 8px"><span style="color:#9ca3af;font-size:12px;text-transform:uppercase;letter-spacing:0.05em">Cliente</span><br>
        <strong style="color:#f3f4f6">${data.customerName}</strong> &lt;${data.customerEmail}&gt;</p>
      <p style="margin:0 0 20px"><span style="color:#9ca3af;font-size:12px;text-transform:uppercase;letter-spacing:0.05em">Método de pago</span><br>
        <strong style="color:#f3f4f6">${data.paymentMethod}</strong></p>
      ${this.itemsTable(data.items)}
      <p style="font-size:22px;font-weight:700;color:#0d9488;margin:20px 0 0;text-align:right">Total: ${data.totalAmount}</p>`,
    );
  }

  private customerConfirmationHtml(data: PurchaseEmailData): string {
    return this.baseLayout(
      '🎉 ¡Gracias por tu compra!',
      `Pedido #${data.orderId.substring(0, 8).toUpperCase()} confirmado`,
      `<p style="color:#d1d5db;margin:0 0 20px">Hola <strong style="color:#f3f4f6">${data.customerName}</strong>, hemos recibido tu pedido y lo estamos preparando.</p>
      ${this.itemsTable(data.items)}
      <p style="font-size:22px;font-weight:700;color:#0d9488;margin:20px 0 16px;text-align:right">Total: ${data.totalAmount}</p>
      <p style="color:#9ca3af;font-size:14px;margin:0">Te notificaremos cuando tu pedido sea enviado.</p>`,
    );
  }

  private paymentHtml(data: PurchaseEmailData, isAdmin: boolean): string {
    const title = isAdmin ? '✅ Pago Confirmado' : '💳 Pago Recibido';
    const subtitle = isAdmin
      ? `Pedido #${data.orderId.substring(0, 8).toUpperCase()} — ${data.customerName}`
      : `Pedido #${data.orderId.substring(0, 8).toUpperCase()}`;
    const intro = isAdmin
      ? `<p style="color:#d1d5db;margin:0 0 20px">El pago del cliente <strong style="color:#f3f4f6">${data.customerName}</strong> (${data.customerEmail}) ha sido confirmado.</p>`
      : `<p style="color:#d1d5db;margin:0 0 20px">Hola <strong style="color:#f3f4f6">${data.customerName}</strong>, hemos recibido tu pago correctamente.</p>`;
    return this.baseLayout(
      title,
      subtitle,
      `${intro}
      ${this.itemsTable(data.items)}
      <p style="font-size:22px;font-weight:700;color:#0d9488;margin:20px 0 0;text-align:right">Total: ${data.totalAmount}</p>`,
    );
  }

  private chatAlertHtml(senderName: string, messageContent: string): string {
    return this.baseLayout(
      '💬 Nuevo Mensaje en el Chat',
      `Mensaje de ${senderName}`,
      `<p style="margin:0 0 12px"><span style="color:#9ca3af;font-size:12px;text-transform:uppercase;letter-spacing:0.05em">De</span><br>
        <strong style="color:#f3f4f6;font-size:18px">${senderName}</strong></p>
      <div style="background:#1f2937;padding:20px;border-radius:12px;border:1px solid #374151;color:#f3f4f6;font-size:15px;line-height:1.6;font-style:italic">
        "${messageContent}"
      </div>
      <div style="text-align:center;margin-top:28px">
        <a href="https://admin.hydracollect.com/dashboard/chat"
          style="background:#0d9488;color:white;padding:12px 28px;text-decoration:none;border-radius:10px;font-weight:700;font-size:15px;display:inline-block">
          Responder en Admin
        </a>
      </div>`,
    );
  }
}
