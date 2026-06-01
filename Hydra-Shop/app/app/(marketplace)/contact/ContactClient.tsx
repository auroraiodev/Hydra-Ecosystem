'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Mail,
  Clock,
  Send,
  CheckCircle2,
  MessageSquare,
  MapPin,
  Loader2,
} from 'lucide-react';
import { useToastContext } from '@/features/shared/components/ToastProvider';
import { Input } from '@/features/shared/ui';

export default function ContactClient() {
  const toast = useToastContext();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [ticketId, setTicketId] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      toast.error('Por favor, completa todos los campos obligatorios.');
      return;
    }

    setStatus('submitting');
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to submit contact form');
      }

      const generatedTicket = `HYDRA-${Math.floor(100000 + Math.random() * 900000)}`;
      setTicketId(generatedTicket);
      setStatus('success');
      toast.success('¡Mensaje enviado con éxito!');
    } catch (error) {
      console.error('Error submitting contact form:', error);
      setStatus('error');
      toast.error('Ocurrió un error al enviar tu mensaje. Inténtalo de nuevo.');
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20 animate-page-enter">
      {/* Background gradients */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-primary/2 to-transparent pointer-events-none" />
      <div className="absolute top-0 right-0 size-[600px] bg-primary/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3 pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-6 relative z-10">
        <div className="text-center mb-16">
          <h1 className="text-4xl lg:text-5xl font-semibold text-text-body tracking-tight uppercase leading-tight mb-4">
            Ponte en <span className="text-primary underline decoration-primary/20">Contacto</span>
          </h1>
          <div className="h-1.5 w-24 bg-primary/60 mx-auto rounded-full mb-6" />
          <p className="text-text-muted text-lg max-w-xl mx-auto leading-relaxed">
            ¿Tienes alguna duda sobre tus pedidos, envíos o quieres vender tus cartas? Escríbenos y te responderemos en menos de 24 horas.
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-8 items-start">
          {/* Info Column (2/5 width) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Contact details card */}
            <div className="glass-panel rounded-2xl border border-border-subtle p-6 lg:p-8 shadow-sm">
              <h2 className="text-xl font-semibold text-text-body mb-6">Información de Soporte</h2>
              <ul className="space-y-6">
                <li className="flex items-start gap-4">
                  <div className="size-10 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0 text-primary">
                    <Mail className="size-5" />
                  </div>
                  <div>
                    <span className="text-xs uppercase tracking-widest font-black text-text-muted/60 block mb-0.5">Correo Electrónico</span>
                    <a href="mailto:darmfma@gmail.com" className="text-sm font-medium text-text-body hover:text-primary transition-colors">
                      darmfma@gmail.com
                    </a>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="size-10 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0 text-primary">
                    <Clock className="size-5" />
                  </div>
                  <div>
                    <span className="text-xs uppercase tracking-widest font-black text-text-muted/60 block mb-0.5">Horarios de Atención</span>
                    <span className="text-sm font-medium text-text-body block">
                      Lunes a Domingo: 9:00 AM - 6:00 PM
                    </span>
                    <span className="text-xs text-text-muted/80">
                      (Hora del Centro de México)
                    </span>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="size-10 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0 text-primary">
                    <MapPin className="size-5" />
                  </div>
                  <div>
                    <span className="text-xs uppercase tracking-widest font-black text-text-muted/60 block mb-0.5">Ubicación</span>
                    <span className="text-sm font-medium text-text-body block">
                      Colima, Colima, México
                    </span>
                    <span className="text-xs text-text-muted/80">
                      Servicios de envíos a toda la República Mexicana
                    </span>
                  </div>
                </li>
              </ul>
            </div>

            {/* Help Center CTA Card */}
            <div className="glass-panel bg-gradient-to-br from-primary/5 to-primary/10 rounded-2xl p-6 border border-border-subtle">
              <div className="size-10 bg-primary/10 rounded-xl flex items-center justify-center mb-4 text-primary">
                <MessageSquare className="size-5" />
              </div>
              <h3 className="font-semibold text-text-body mb-2">¿Buscas respuestas rápidas?</h3>
              <p className="text-sm text-text-muted mb-4">
                Visita nuestro centro de ayuda para resolver de inmediato preguntas sobre envíos, pagos y devoluciones.
              </p>
              <Link
                href="/help"
                className="inline-flex items-center gap-2 bg-primary text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-primary-dark transition-colors shadow-sm"
              >
                Ir al Centro de Ayuda
              </Link>
            </div>
          </div>

          {/* Form Column (3/5 width) */}
          <div className="lg:col-span-3">
            <div className="glass-panel rounded-2xl border border-border-subtle p-6 lg:p-8 shadow-sm">
              {status === 'success' ? (
                <div className="py-12 text-center space-y-6">
                  <div className="size-16 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                    <CheckCircle2 className="size-8" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-2xl font-semibold text-text-body">¡Mensaje Enviado!</h3>
                    <p className="text-text-muted max-w-sm mx-auto leading-relaxed">
                      Hemos recibido tus comentarios. Un miembro de nuestro equipo de soporte se pondrá en contacto contigo pronto.
                    </p>
                  </div>
                  <div className="inline-block bg-surface-low border border-border-subtle rounded-xl px-6 py-3 font-mono text-sm text-text-body shadow-inner">
                    Ticket ID: <span className="font-bold text-primary">{ticketId}</span>
                  </div>
                  <div className="pt-4">
                    <button
                      onClick={() => {
                        setFormData({ name: '', email: '', subject: '', message: '' });
                        setStatus('idle');
                      }}
                      className="text-primary hover:underline text-sm font-medium"
                    >
                      Enviar otro mensaje
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <Input
                      id="name"
                      label="Nombre Completo *"
                      required
                      disabled={status === 'submitting'}
                      placeholder="Ej. Juan Pérez"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      icon="person"
                    />

                    <Input
                      id="email"
                      label="Correo Electrónico *"
                      type="email"
                      required
                      disabled={status === 'submitting'}
                      placeholder="ejemplo@correo.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      icon="email"
                    />
                  </div>

                  <Input
                    id="subject"
                    label="Asunto"
                    disabled={status === 'submitting'}
                    placeholder="¿En qué te podemos ayudar?"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  />

                  <div className="flex flex-col gap-1.5 w-full">
                    <label htmlFor="message" className="text-sm font-black text-text-muted px-1">
                      Mensaje <span className="text-primary">*</span>
                    </label>
                    <textarea
                      id="message"
                      required
                      rows={5}
                      disabled={status === 'submitting'}
                      className="w-full bg-surface-low border border-border-subtle rounded-xl px-4 py-3 text-text-body font-medium placeholder:text-text-muted/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all duration-200 resize-none disabled:opacity-60"
                      placeholder="Escribe tu mensaje o dudas detalladamente..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={status === 'submitting'}
                    className="w-full bg-primary text-white py-3 px-4 rounded-xl font-medium hover:bg-primary-dark transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed shadow-md hover:shadow-lg active:scale-[0.98]"
                  >
                    {status === 'submitting' ? (
                      <>
                        <Loader2 className="size-4 animate-spin" />
                        Enviando...
                      </>
                    ) : (
                      <>
                        <Send className="size-4" />
                        Enviar Mensaje
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
