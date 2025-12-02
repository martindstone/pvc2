import { getCurrency } from 'locale-currency';

export const getCurrencyCodeFromLocale = () => {
  try {
    const locale = navigator.language;
    return getCurrency(locale);
  } catch (error) {
    console.error("Error getting currency code:", error);
    return null;
  }
};

export const getCurrencySymbolFromLocale = () => {
  try {
    const locale = navigator.language;
    const currency = getCurrencyCodeFromLocale();
    if (!currency) return null;
    const formatter = new Intl.NumberFormat(locale, { style: 'currency', currency: currency || 'USD' });
    const parts = formatter.formatToParts(0);
    const currencyPart = parts.find(part => part.type === 'currency');
    return currencyPart ? currencyPart.value : null;
  } catch (error) {
    console.error("Error getting currency code:", error);
    return null;
  }
};
