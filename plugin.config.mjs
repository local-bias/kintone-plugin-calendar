const hp = 'https://konomi.app/';
const commonCdn = 'https://kintone-plugin.konomi.app/common';
const localhost = 'https://127.0.0.1:8487';

/** @type {import('./src/types/plugin-config').PluginConfig} */
export default {
  manifest: {
    base: {
      manifest_version: 1,
      version: '0.7.0',
      type: 'APP',
      name: {
        en: 'calendar plugin',
        ja: 'カレンダープラグイン',
        zh: '日历插件',
      },
      description: {
        en: 'A calendar plugin that can be used as a scheduler using the open source library fullcalendar',
        ja: 'オープンソースライブラリであるfullcalendarを使用し、スケジューラーとして利用できるカレンダーを実装します',
        zh: '使用开源库fullcalendar，实现可用作调度程序的日历',
      },
      icon: 'icon.png',
      homepage_url: {
        ja: hp,
        en: hp,
        zh: hp,
      },
      desktop: {
        js: [`${commonCdn}/desktop.js`],
        css: [
          'https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;500;700&display=swap',
        ],
      },
      mobile: { js: [`${commonCdn}/desktop.js`], css: [] },
      config: { html: 'config.html', js: [`${commonCdn}/config.js`], css: [], required_params: [] },
    },
    dev: {
      desktop: {
        js: [`${localhost}/dist/dev/desktop/index.js`],
        css: [`${localhost}/dist/dev/desktop.css`],
      },
      mobile: {
        js: [`${localhost}/dist/dev/desktop/index.js`],
        css: [`${localhost}/dist/dev/desktop.css`],
      },
      config: {
        js: [`${localhost}/dist/dev/config/index.js`],
        css: [`${localhost}/dist/dev/config.css`],
      },
    },
    prod: {
      desktop: { js: [`desktop.js`], css: [`desktop.css`] },
      mobile: { js: [`desktop.js`], css: [`desktop.css`] },
      config: { js: [`config.js`], css: [`config.css`] },
    },
  },
};
