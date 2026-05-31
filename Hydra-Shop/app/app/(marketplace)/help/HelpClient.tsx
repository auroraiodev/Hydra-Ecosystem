'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Search,
  ChevronDown,
  CreditCard,
  Truck,
  ShieldCheck,
  RotateCcw,
  Mail,
  User,
  MessageCircle,
  Clock,
  ArrowRight,
  HelpCircle,
  Package,
  CheckCircle2,
} from 'lucide-react';

const categories = [
  {
    id: 'orders',
    title: 'Pedidos y Pagos',
    icon: CreditCard,
    description: 'Compras, pagos y facturacion',
    articles: 12,
  },
  {
    id: 'shipping',
    title: 'Envios',
    icon: Truck,
    description: 'Rastreo y tiempos de entrega',
    articles: 8,
  },
  {
    id: 'returns',
    title: 'Devoluciones',
    icon: RotateCcw,
    description: 'Reembolsos y garantias',
    articles: 6,
  },
  {
    id: 'account',
    title: 'Mi Cuenta',
    icon: User,
    description: 'Perfil y configuracion',
    articles: 10,
  },
  {
    id: 'authenticity',
    title: 'Autenticidad',
    icon: ShieldCheck,
    description: 'Verificacion de cartas',
    articles: 5,
  },
  {
    id: 'selling',
    title: 'Vender',
    icon: Package,
    description: 'Como vender tus cartas',
    articles: 7,
  },
];

const faqs = [
  {
    category: 'orders',
    question: 'Como compro cartas en Hydra Collectables?',
    answer:
      'Busca la carta que deseas, agregala al carrito y procede al checkout. Aceptamos multiples metodos de pago, incluyendo tarjetas bancarias, transferencia y Google Pay.',
  },
  {
    category: 'shipping',
    question: 'Cuanto tarda el envio?',
    answer:
      'Los envios dentro de Mexico tardan entre 3 a 7 dias habiles dependiendo de tu ubicacion. Ofrecemos envio estandar y express. Los envios de cartas importadas pueden tardar hasta 15 dias habiles.',
  },
  {
    category: 'authenticity',
    question: 'Como garantizan la autenticidad de las cartas?',
    answer:
      'Todas las cartas son verificadas por nuestro equipo de expertos antes de ser enviadas. Utilizamos herramientas de alta precision para garantizar que recibas un producto 100% autentico.',
  },
  {
    category: 'orders',
    question: 'Puedo vender mis cartas en Hydra?',
    answer:
      'Hemos lanzado nuestra nueva plataforma de vendedores. Visita nuestra seccion de "Vender" para conocer el proceso detallado y comenzar a certificar tus piezas.',
  },
  {
    category: 'shipping',
    question: 'Hacen envios internacionales?',
    answer: 'Por el momento solo realizamos envios dentro del territorio mexicano.',
  },
  {
    category: 'returns',
    question: 'Cual es su politica de devoluciones?',
    answer:
      'Aceptamos devoluciones si el producto no coincide con la descripcion o condicion publicada. Tienes 3 dias naturales tras recibir tu paquete para iniciar un reclamo.',
  },
];

const popularArticles = [
  { title: 'Como rastrear mi pedido', category: 'Envios' },
  { title: 'Metodos de pago aceptados', category: 'Pagos' },
  { title: 'Proceso de verificacion de cartas', category: 'Autenticidad' },
  { title: 'Como iniciar una devolucion', category: 'Devoluciones' },
];

export default function HelpClient() {
  const [searchQuery, setSearchQuery] = useState('');
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const filteredFaqs = faqs.filter((faq) => {
    const matchesSearch =
      !searchQuery ||
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !activeCategory || faq.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-background pb-20 animate-page-enter">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-primary/2 to-transparent pointer-events-none" />
        <div className="absolute top-0 right-0 size-[600px] bg-primary/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3 pointer-events-none" />

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20 lg:pt-24 lg:pb-28 z-10">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="absolute inset-0 bg-primary/10 rounded-full blur-2xl scale-150" />
                <Image
                  src="/cat.png"
                  alt="Hydra Help"
                  width={64}
                  height={64}
                  className="relative z-10"
                />
              </div>
            </div>

            <h1 className="text-3xl lg:text-4xl font-semibold text-text-body mb-4 tracking-tight uppercase">
              Centro de Ayuda
            </h1>
            <p className="text-text-muted text-lg mb-10 max-w-xl mx-auto leading-relaxed">
              Encuentra respuestas rápidas o contacta a nuestro equipo de soporte
            </p>

            <div className="max-w-xl mx-auto">
              <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-text-muted/60 group-focus-within:text-primary transition-colors" />
                <input
                  type="text"
                  placeholder="Buscar en el centro de ayuda..."
                  className="w-full pl-12 pr-4 py-4 bg-surface-low border border-border-subtle rounded-xl text-text-body placeholder:text-text-muted/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all shadow-sm duration-200"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Quick Stats */}
        <div className="flex flex-wrap justify-center gap-8 mb-16 -mt-4">
          <div className="flex items-center gap-2 text-sm text-text-body">
            <Clock className="size-4 text-primary" />
            <span>Respuesta en menos de 24h</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-text-body">
            <CheckCircle2 className="size-4 text-primary" />
            <span>98% de satisfacción</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-text-body">
            <HelpCircle className="size-4 text-primary" />
            <span>+50 artículos de ayuda</span>
          </div>
        </div>

        {/* Categories Grid */}
        {!searchQuery && (
          <section className="mb-16">
            <h2 className="text-xl font-semibold text-text-body mb-6 uppercase tracking-wider">Explorar por categoría</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {categories.map((cat) => {
                const isActive = activeCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(isActive ? null : cat.id)}
                    className={`group text-left p-5 rounded-xl border transition-all duration-200 ${
                      isActive
                        ? 'bg-primary/5 border-primary/20 shadow-md'
                        : 'glass-panel border-border-subtle hover:border-primary/20 hover:bg-surface-high/30'
                    }`}
                  >
                    <div
                      className={`size-10 rounded-lg flex items-center justify-center mb-3 transition-colors ${
                        isActive
                          ? 'bg-primary text-white'
                          : 'bg-surface-low text-text-body group-hover:bg-primary/10 group-hover:text-primary'
                      }`}
                    >
                      <cat.icon className="size-5" />
                    </div>
                    <h3 className="font-semibold text-text-body mb-1">{cat.title}</h3>
                    <p className="text-sm text-text-muted">{cat.description}</p>
                    <span className="text-xs text-text-muted/60 mt-2 block">
                      {cat.articles} artículos
                    </span>
                  </button>
                );
              })}
            </div>
          </section>
        )}

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* FAQs Section */}
          <div className="lg:col-span-2">
            <div className="glass-panel rounded-xl border border-border-subtle overflow-hidden">
              <div className="p-6 border-b border-border-subtle">
                <h2 className="text-lg font-semibold text-text-body">
                  Preguntas Frecuentes
                  {activeCategory && (
                    <span className="ml-2 text-sm font-normal text-primary">
                      ({categories.find((c) => c.id === activeCategory)?.title})
                    </span>
                  )}
                </h2>
              </div>

              {filteredFaqs.length > 0 ? (
                <div className="divide-y divide-border-subtle">
                  {filteredFaqs.map((faq, faqIdx) => (
                    <div key={faq.question}>
                      <button
                        onClick={() => setOpenFaq(openFaq === faqIdx ? null : faqIdx)}
                        className="w-full px-6 py-5 flex items-start justify-between text-left hover:bg-surface-high/30 transition-colors"
                      >
                        <span className="font-medium text-text-body pr-8 leading-relaxed">
                          {faq.question}
                        </span>
                        <ChevronDown
                          className={`size-5 text-text-muted/60 flex-shrink-0 mt-0.5 transition-transform duration-200 ${
                            openFaq === faqIdx ? 'rotate-180 text-primary' : ''
                          }`}
                        />
                      </button>
                      <div
                        className={`overflow-hidden transition-all duration-200 ${
                          openFaq === faqIdx ? 'max-h-48' : 'max-h-0'
                        }`}
                      >
                        <p className="px-6 pb-5 text-text-muted leading-relaxed">{faq.answer}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-12 text-center">
                  <div className="size-12 bg-surface-low rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="size-5 text-text-muted" />
                  </div>
                  <h3 className="font-semibold text-text-body mb-2">No encontramos resultados</h3>
                  <p className="text-sm text-text-muted">
                    Intenta con otras palabras o{' '}
                    <button
                      onClick={() => {
                        setSearchQuery('');
                        setActiveCategory(null);
                      }}
                      className="text-primary hover:underline"
                    >
                      ver todas las preguntas
                    </button>
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Popular Articles */}
            <div className="glass-panel rounded-xl border border-border-subtle p-6">
              <h3 className="font-semibold text-text-body mb-4">Artículos populares</h3>
              <ul className="space-y-3">
                {popularArticles.map((article) => (
                  <li key={article.title}>
                    <Link href="#" className="flex items-start gap-3 group">
                      <ArrowRight className="size-4 text-text-muted/40 mt-0.5 group-hover:text-primary transition-colors" />
                      <div>
                        <span className="text-sm text-text-body group-hover:text-primary transition-colors">
                          {article.title}
                        </span>
                        <span className="text-xs text-text-muted/60 block">{article.category}</span>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Support Card */}
            <div className="glass-panel bg-gradient-to-br from-primary/5 to-primary/10 rounded-xl p-6 border border-border-subtle">
              <div className="size-10 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <MessageCircle className="size-5 text-primary" />
              </div>
              <h3 className="font-semibold text-text-body mb-2">¿No encuentras lo que buscas?</h3>
              <p className="text-sm text-text-muted mb-4">
                Nuestro equipo de soporte está listo para ayudarte
              </p>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 bg-primary text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-primary-dark transition-colors"
              >
                <Mail className="size-4" />
                Contactar soporte
              </Link>
            </div>

            {/* Trust badges */}
            <div className="glass-panel rounded-xl border border-border-subtle p-6">
              <h3 className="font-semibold text-text-body mb-4">Nuestras garantías</h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <div className="size-8 bg-emerald-500/10 rounded-lg flex items-center justify-center flex-shrink-0 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                    <ShieldCheck className="size-4" />
                  </div>
                  <div>
                    <span className="text-sm font-medium text-text-body block">Compra Segura</span>
                    <span className="text-xs text-text-muted">
                      Protección en todas tus transacciones
                    </span>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="size-8 bg-blue-500/10 rounded-lg flex items-center justify-center flex-shrink-0 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                    <Truck className="size-4" />
                  </div>
                  <div>
                    <span className="text-sm font-medium text-text-body block">
                      Envío Rastreable
                    </span>
                    <span className="text-xs text-text-muted">Seguimiento en tiempo real</span>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="size-8 bg-amber-500/10 rounded-lg flex items-center justify-center flex-shrink-0 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                    <CheckCircle2 className="size-4" />
                  </div>
                  <div>
                    <span className="text-sm font-medium text-text-body block">100% Auténtico</span>
                    <span className="text-xs text-text-muted">Verificado por expertos</span>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
