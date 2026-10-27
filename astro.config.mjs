// @ts-check
import node from '@astrojs/node';
import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';

const isVercel = !!process.env.VERCEL;

// https://astro.build/config
export default defineConfig({
    output: 'server',
    adapter: isVercel ? vercel({ isr:false, maxDuration: 30}) : node({mode: 'standalone'}),
    i18n: {
        defaultLocale: 'it',
        locales: ['it', 'en'],
    },
    server: {
        port: 4321,
        host: true,
    },
    vite: {
        css: {
            preprocessorOptions: {
                scss: {
                    quietDeps:true,
                    silenceDeprecations: ["import"],
                }
            }
        }
    }
});
