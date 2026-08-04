const CURRENCIES = [
  { code: "USD", name: "US Dollar", symbol: "$" },
  { code: "EUR", name: "Euro", symbol: "€" },
  { code: "GBP", name: "British Pound", symbol: "£" },
  { code: "JPY", name: "Japanese Yen", symbol: "¥" },
  { code: "CAD", name: "Canadian Dollar", symbol: "C$" },
  { code: "AUD", name: "Australian Dollar", symbol: "A$" },
  { code: "CHF", name: "Swiss Franc", symbol: "CHF" },
  { code: "CNY", name: "Chinese Yuan", symbol: "¥" },
  { code: "INR", name: "Indian Rupee", symbol: "₹" },
  { code: "NGN", name: "Nigerian Naira", symbol: "₦" },
  { code: "ZAR", name: "South African Rand", symbol: "R" },
  { code: "BRL", name: "Brazilian Real", symbol: "R$" },
  { code: "AED", name: "UAE Dirham", symbol: "د.إ" },
  { code: "SGD", name: "Singapore Dollar", symbol: "S$" },
  { code: "HKD", name: "Hong Kong Dollar", symbol: "HK$" },
  { code: "KRW", name: "South Korean Won", symbol: "₩" },
  { code: "MXN", name: "Mexican Peso", symbol: "Mex$" },
  { code: "TRY", name: "Turkish Lira", symbol: "₺" },
  { code: "SEK", name: "Swedish Krona", symbol: "kr" },
  { code: "NOK", name: "Norwegian Krone", symbol: "kr" }
];
function getCurrencySymbol(code) {
  if (!code) return "$";
  return CURRENCIES.find((c) => c.code === code)?.symbol ?? code;
}
function formatMoney(amount, code, opts) {
  const decimals = opts?.decimals ?? 2;
  const symbol = opts?.withSymbol === false ? "" : getCurrencySymbol(code);
  const value = (amount ?? 0).toLocaleString(void 0, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  });
  return symbol ? `${symbol}${value}` : value;
}
function parseMoney(input) {
  if (!input) return 0;
  const cleaned = input.replace(/[^\d.-]/g, "");
  const n = Number(cleaned);
  return isNaN(n) ? 0 : n;
}
function formatMoneyInput(input) {
  if (!input) return "";
  const cleaned = input.replace(/[^\d.]/g, "");
  const parts = cleaned.split(".");
  const intPart = parts[0].replace(/^0+(?=\d)/, "") || "0";
  const withCommas = Number(intPart).toLocaleString();
  if (parts.length === 1) return withCommas;
  const decPart = parts.slice(1).join("").slice(0, 2);
  return `${withCommas}.${decPart}`;
}
export {
  formatMoneyInput as a,
  formatMoney as f,
  getCurrencySymbol as g,
  parseMoney as p
};
