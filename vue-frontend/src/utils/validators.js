const HUNGARIAN_LETTERS_REGEX = /[a-zA-ZáéíóöőúüűÁÉÍÓÖŐÚÜŰ]/;

export function countDigits(value) {
  return (String(value || '').match(/\d/g) || []).length;
}

export function enforceMaxDigitsWithFallback(newValue, oldValue, maxDigits, maxLength = null) {
  let value = String(newValue || '');
  if (maxLength !== null && value.length > maxLength) {
    value = value.substring(0, maxLength);
  }
  if (countDigits(value) > maxDigits) {
    return String(oldValue || '');
  }
  return value;
}

export function stripDigitsAndLimit(value, maxLength) {
  const noDigits = String(value || '').replace(/\d/g, '');
  return noDigits.length > maxLength ? noDigits.substring(0, maxLength) : noDigits;
}

export function normalizePriceInput(newValue, oldValue, maxNumericLength = 5) {
  const value = String(newValue || '');
  const prev = String(oldValue || '');

  if (!value) return value;
  if ((value.toLowerCase() === 'i' || value.toLowerCase() === 'in') && (!prev || value.length > prev.length)) {
    return 'Ingyenes';
  }
  if (value === 'Ingyenes' || 'Ingyenes'.startsWith(value)) {
    return value;
  }

  if (value.endsWith(' Ft')) {
    const numbersOnly = value.replace(/\D/g, '');
    if (numbersOnly.length > maxNumericLength) {
      return numbersOnly.substring(0, maxNumericLength) + ' Ft';
    }
    return value;
  }

  let cleaned = value.replace(/\D/g, '');
  if (cleaned.length > maxNumericLength) {
    cleaned = cleaned.substring(0, maxNumericLength);
  }
  return cleaned;
}

export function formatPriceOnBlur(value) {
  const text = String(value || '').trim();
  if (!text || text.toLowerCase() === 'ingyenes' || /\d+ ?Ft$/.test(text)) {
    return text;
  }
  if (/^\d+$/.test(text)) {
    return `${text} Ft`;
  }
  const numbersOnly = text.replace(/\D/g, '');
  return numbersOnly ? `${numbersOnly} Ft` : text;
}

export function sanitizePhoneLocalNumber(value, maxLength = 7) {
  const cleaned = String(value || '').replace(/\D/g, '');
  return cleaned.length > maxLength ? cleaned.substring(0, maxLength) : cleaned;
}

export function formatHungarianPhone(prefix, localNumber) {
  const normalized = String(localNumber || '').trim().replace(/\s/g, '');
  if (!normalized) return '';
  const grouped = normalized.replace(/(\d{3})(\d{0,4})/, '$1 $2').trim();
  return `+36 ${prefix} ${grouped}`;
}

export function sanitizeCity(value, maxLength = 15) {
  return stripDigitsAndLimit(value, maxLength);
}

export function sanitizeZipCode(value, maxLength = 4) {
  const cleaned = String(value || '').replace(/\D/g, '');
  return cleaned.length > maxLength ? cleaned.substring(0, maxLength) : cleaned;
}

export function sanitizeDistrict(value, maxLength = 5) {
  const cleaned = String(value || '').toUpperCase().replace(/[^IXV]/g, '');
  return cleaned.length > maxLength ? cleaned.substring(0, maxLength) : cleaned;
}

export function sanitizeStreet(value, maxLength = 25) {
  return stripDigitsAndLimit(value, maxLength);
}

export function sanitizeHouseNumber(value, maxLength = 5, maxDigits = 3, maxLetters = 1, maxSlashes = 1) {
  const input = String(value || '');
  let result = '';
  let digits = 0;
  let letters = 0;
  let slashes = 0;

  for (let i = 0; i < input.length; i += 1) {
    const char = input[i];
    if (result.length >= maxLength) break;

    if (/[0-9]/.test(char)) {
      if (digits < maxDigits) {
        result += char;
        digits += 1;
      }
    } else if (HUNGARIAN_LETTERS_REGEX.test(char)) {
      if (letters < maxLetters) {
        result += char;
        letters += 1;
      }
    } else if (char === '/') {
      if (slashes < maxSlashes) {
        result += char;
        slashes += 1;
      }
    }
  }

  return result;
}

export function sanitizeAlphaWithAccents(value, maxLength) {
  const cleaned = String(value || '').replace(/[^a-zA-ZáéíóöőúüűÁÉÍÓÖŐÚÜŰ\s\-]/g, '');
  return cleaned.length > maxLength ? cleaned.substring(0, maxLength) : cleaned;
}

export function limitDigitOccurrences(value, maxDigits) {
  let seen = 0;
  return String(value || '').replace(/\d/g, (digit) => {
    seen += 1;
    return seen <= maxDigits ? digit : '';
  });
}
