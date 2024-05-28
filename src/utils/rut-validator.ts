export function isValidRut(rut: string): boolean {
    if (!rut || typeof rut !== 'string') return false;
    rut = rut.replace(/\./g, '').replace(/-/g, '');
    const regex = /^[0-9]+[0-9kK]{1}$/;
    if (!regex.test(rut)) return false;
    const rutBody = rut.slice(0, -1);
    const verifier = rut.slice(-1).toUpperCase();
    let total = 0;
    let multiplier = 2;
    for (let i = rutBody.length - 1; i >= 0; i--) {
      total += parseInt(rutBody.charAt(i), 10) * multiplier;
      multiplier = multiplier < 7 ? multiplier + 1 : 2;
    }
    const mod = total % 11;
    const calculatedVerifier = mod === 0 ? '0' : mod === 1 ? 'K' : (11 - mod).toString();
    return calculatedVerifier === verifier;
  }