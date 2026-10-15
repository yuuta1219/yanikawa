// ブラウザ側：4桁の番号から鍵をつくり、暗号文をもとに戻す。番号がちがえば例外になる
export interface SealedPayload {
  salt: string;
  iv: string;
  data: string;
  iter: number;
}

const fromBase64 = (s: string) => Uint8Array.from(atob(s), (c) => c.charCodeAt(0));

export async function unseal(payload: SealedPayload, pin: string): Promise<string> {
  const material = await crypto.subtle.importKey('raw', new TextEncoder().encode(pin), 'PBKDF2', false, ['deriveKey']);
  const key = await crypto.subtle.deriveKey(
    { name: 'PBKDF2', salt: fromBase64(payload.salt), iterations: payload.iter, hash: 'SHA-256' },
    material,
    { name: 'AES-GCM', length: 256 },
    false,
    ['decrypt'],
  );
  const plain = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: fromBase64(payload.iv) }, key, fromBase64(payload.data));
  return new TextDecoder().decode(plain);
}
