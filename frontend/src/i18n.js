import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import enTranslation from "./locales/en/translation.json";
import esTranslation from "./locales/es/translation.json";
import hiTranslation from "./locales/hi/translation.json";
import asTranslation from "./locales/as/translation.json";
import bnTranslation from "./locales/bn/translation.json";
import mrTranslation from "./locales/mr/translation.json";
import orTranslation from "./locales/or/translation.json";
import taTranslation from "./locales/ta/translation.json";
import paTranslation from "./locales/pa/translation.json";

const resources = {
  en: {
    translation: enTranslation
  },
  es: {
    translation: esTranslation
  },
  hi: {
    translation: hiTranslation
  },
  as: {
    translation: asTranslation
  },
  bn: {
    translation: bnTranslation
  },
  mr: {
    translation: mrTranslation
  },
  or: {
    translation: orTranslation
  },
  ta: {
    translation: taTranslation
  },
  pa: {
    translation: paTranslation
  }
};

const savedLanguage = localStorage.getItem("language");
const browserLanguage = navigator.language?.split("-")[0];
const language = savedLanguage || (resources[browserLanguage] ? browserLanguage : "en");

void i18n.use(initReactI18next).init({
  resources,
  lng: language,
  fallbackLng: "en",
  interpolation: {
    escapeValue: false
  }
});

export default i18n;
