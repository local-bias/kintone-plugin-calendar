const hp = 'https://konomi.app/';
const commonCdn = 'https://cdn.jsdelivr.net/gh/local-bias/kintone-cdn@latest';
const cdn = 'https://cdn.jsdelivr.net/gh/local-bias/kintone-plugin-calendar@latest';
const localhost = 'https://127.0.0.1:5500';

/** @type {import('./src/types/plugin-config').PluginConfig} */
export default {
  manifest: {
    base: {
      manifest_version: 1,
      version: '1.0.0',
      type: 'APP',
      name: {
        en: 'calendar plugin',
        ja: 'カレンダープラグイン',
        zh: '日历插件',
      },
      description: {
        en: 'Implement a calendar using the open-source library fullcalendar as a scheduler.',
        ja: 'オープンソースライブラリであるfullcalendarを使用し、スケジューラーとして利用できるカレンダーを実装します',
        zh: '使用开源库fullcalendar实现一个作为调度器可用的日历。',
      },
      icon: 'icon.png',
      homepage_url: {
        ja: hp,
        en: hp,
      },
      desktop: {
        js: [`${commonCdn}/dist/desktop.js`],
        css: [
          'https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;500;700&display=swap',
        ],
      },
      mobile: { js: [`${commonCdn}/dist/desktop.js`], css: [] },
      config: {
        html: 'config.html',
        js: [`${commonCdn}/dist/config.js`],
        css: [],
        required_params: [],
      },
    },
    dev: {
      desktop: { js: [`${localhost}/dist/dev/desktop/index.js`] },
      mobile: { js: [`${localhost}/dist/dev/desktop/index.js`] },
      config: { js: [`${localhost}/dist/dev/config/index.js`] },
    },
    prod: {
      desktop: { js: [`${cdn}/cdn/desktop.js`] },
      mobile: { js: [`${cdn}/cdn/desktop.js`] },
      config: { js: [`${cdn}/cdn/config.js`] },
    },
  },
};
