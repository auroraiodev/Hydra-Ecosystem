'use client';
import dynamic from 'next/dynamic';

const LoginPageContentInner = dynamic(
  () =>
    import('./components/LoginPageContentInner').then((m) => ({
      default: m.LoginPageContentInner,
    })),
  { ssr: false },
);

export function LoginPageContent() {
  return <LoginPageContentInner />;
}
