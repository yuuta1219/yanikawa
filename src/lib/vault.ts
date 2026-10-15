import type { SealedPayload } from './unseal';

// ビルド側：引き出しの中身を NOVEL_PIN で暗号化する。
// HTML には暗号文しか残らないので、ソースを覗かれても読めない
const ITERATIONS = 200_000;
const encoder = new TextEncoder();

function toBase64(bytes: Uint8Array) {
  let binary = '';
  for (let i = 0; i < bytes.length; i += 0x8000) {
    binary += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
  }
  return btoa(binary);
}

function readPin() {
  const pin = import.meta.env.NOVEL_PIN;
  if (!pin || !/^\d{4}$/.test(pin)) {
    throw new Error(
      'NOVEL_PIN が設定されていません。.env（公開先では環境変数）に 4桁の数字を設定してください。例: NOVEL_PIN=0000',
    );
  }
  return pin;
}

let cached: Promise<{ salt: Uint8Array; key: CryptoKey }> | undefined;

function getKey() {
  cached ??= (async () => {
    const salt = crypto.getRandomValues(new Uint8Array(16));
    const material = await crypto.subtle.importKey('raw', encoder.encode(readPin()), 'PBKDF2', false, ['deriveKey']);
    const key = await crypto.subtle.deriveKey(
      { name: 'PBKDF2', salt, iterations: ITERATIONS, hash: 'SHA-256' },
      material,
      { name: 'AES-GCM', length: 256 },
      false,
      ['encrypt'],
    );
    return { salt, key };
  })();
  return cached;
}

export async function seal(text: string): Promise<SealedPayload> {
  const { salt, key } = await getKey();
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const data = new Uint8Array(await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, encoder.encode(text)));
  return { salt: toBase64(salt), iv: toBase64(iv), data: toBase64(data), iter: ITERATIONS };
}
