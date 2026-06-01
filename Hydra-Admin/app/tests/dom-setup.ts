// @ts-expect-error - jsdom type declarations are missing in devDependencies
import { JSDOM } from 'jsdom';

if (typeof window === 'undefined') {
  const dom = new JSDOM('<!doctype html><html><body></body></html>', {
    url: 'http://localhost',
  });
  const win = dom.window as any;
  
  const g = globalThis as any;
  g.window = win;
  g.document = win.document;
  g.navigator = win.navigator;
}
