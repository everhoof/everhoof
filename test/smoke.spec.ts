import { describe, expect, it } from 'vitest';
import { fetch, setup } from '@nuxt/test-utils/e2e';

describe('public routes', async () => {
  await setup({ server: true });

  it('renders the home page on a direct request', async () => {
    const response = await fetch('/');
    expect(response.status).toBe(200);
    const html = await response.text();
    expect(html).toMatch(/<title>[^<]*Radio<\/title>/);
    expect(html).toMatch(/<svg[^>]*>\s*<path/);
  });

  it('renders recordings on a direct request', async () => {
    const response = await fetch('/recordings');
    expect(response.status).toBe(200);
    expect(await response.text()).toContain('recordings');
  });

  it('redirects an unknown path to the home page', async () => {
    const response = await fetch('/missing-page', { redirect: 'manual' });
    expect(response.status).toBe(302);
    expect(response.headers.get('location')).toBe('/');
  });
});
