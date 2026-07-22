import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

export default defineConfig({
  integrations: [
    starlight({
      title: 'HTML5 Boilerplate',
      // Social block removed for now to bypass the v0.33.0+ schema error
      sidebar: [
        {
          label: 'Documentation',
          items: [
            { label: 'Usage', link: '/docs/usage/' },
          ],
        },
      ],
    }),
  ],
});