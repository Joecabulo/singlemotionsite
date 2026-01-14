import { resolveTxtRecord } from "./doh.js";

const normalizeDigits = (value) => String(value).replace(/\D+/g, "");

export const getWhatsAppLink = async (message) => {
  const txt = await resolveTxtRecord("_whatsapp.singlemotion.org");
  const raw = txt.ok ? txt.texts[0] : "";
  const phone = normalizeDigits(raw);
  const encodedText = encodeURIComponent(message);

  if (phone.length >= 10) {
    return `https://wa.me/${phone}?text=${encodedText}`;
  }

  return `https://wa.me/?text=${encodedText}`;
};

