import i18next from 'i18next';
import i18nextMiddleware from 'i18next-http-middleware';
import Backend from "i18next-fs-backend";
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import path from 'path'
import LanguageDetector from 'i18next-browser-languagedetector';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

i18next
    .use(Backend)
    //.use(i18nextMiddleware.LanguageDetector)
    .init({
        caches: ['localStorage'],
        browserLanguageDetection: false,
        backend: {
            loadPath: path.resolve(__dirname, 'resources/locales/{{lng}}/{{ns}}.json')
        },
        debug: false,
        detection: {
            order: ['querystring', 'cookie'],
            caches: ['cookie']
        },
        saveMissing: true,
        fallbackLng: false,
        lng: 'en',
        defaultLocale: 'en',
        preload: ['ja', 'en'],
        supportedLngs: ['ja', 'en'],
        routing: {
            prefixDefaultLocale: true
        }

    },
        (err, t) => {
            if (err) return console.error(err);
            console.log('i18next is ready...');
        });

export default i18next;