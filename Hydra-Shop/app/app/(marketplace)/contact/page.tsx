import { Metadata } from 'next';
import { JsonLd } from '@/features/shared/components/JsonLd';
import ContactClient from './ContactClient';

export const metadata: Metadata = {
  title: 'Contacto | Hydra Collectables México',
  description:
    'Ponte en contacto con Hydra Collectables. Soporte al cliente, preguntas sobre pedidos, ventas y soporte técnico de Magic: The Gathering.',
  keywords: [
    'contacto Hydra Collectables',
    'soporte Hydra',
    'correo soporte Magic México',
    'ayuda pedidos MTG',
  ],
  alternates: {
    canonical: '/contact',
  },
  openGraph: {
    title: 'Contacto | Hydra Collectables',
    description: 'Ponte en contacto con nuestro equipo de soporte de Magic: The Gathering.',
  },
};

export default function ContactPage() {
  const contactSchema = {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    name: 'Contacto | Hydra Collectables',
    description: 'Información de contacto y soporte técnico para usuarios de Hydra Collectables.',
    url: 'https://hydracollect.com/contact',
    contactPoint: {
      '@type': 'ContactPoint',
      email: 'soporte@hydracollectables.com',
      contactType: 'customer support',
      availableLanguage: ['Spanish', 'English'],
    },
  };

  return (
    <>
      <JsonLd id="contact-schema" data={contactSchema} />
      <ContactClient />
    </>
  );
}
