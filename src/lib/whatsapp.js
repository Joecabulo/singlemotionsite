import { resolveTxtRecord } from "./doh.js";

const normalizeDigits = (value) => String(value).replace(/\D+/g, "");

const DEFAULT_PHONE = "5531975184428";

const normalizePhone = (value) => {
  const digits = normalizeDigits(value);
  if (!digits) return "";
  if (digits.startsWith("55") && digits.length >= 12) return digits;
  if ((digits.length === 10 || digits.length === 11) && !digits.startsWith("55")) return `55${digits}`;
  return digits;
};

export const getWhatsAppLink = async (message) => {
  const txt = await resolveTxtRecord("_whatsapp.singlemotion.org");
  const raw = txt.ok ? txt.texts[0] : "";
  const phone = normalizePhone(raw) || DEFAULT_PHONE;
  const encodedText = encodeURIComponent(message);

  return `https://wa.me/${phone}?text=${encodedText}`;
};
