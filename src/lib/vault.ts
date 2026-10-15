import type { SealedPayload } from './unseal';

// ビルド側：見せたくない中身を、合言葉で暗号化する。
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

function readSecret(name: 'NOVEL_PIN' | 'ADMIN_PASSWORD', pattern: RegExp, example: string) {
  const value = import.meta.env[name];
  if (!value || !pattern.test(value)) {
    throw new Error(`${name} が設定されていません。.env（公開先では環境変数）に設定してください。例: ${name}=${example}`);
  }
  return value;
}

// 引き出し（小説）の番号。4桁の数字
export const novelPin = () => readSecret('NOVEL_PIN', /^\d{4}$/, '0000');
// 管理画面のパスワード。小文字の英字（ログイン時も小文字にそろえて確かめる）
export const adminPassword = () => readSecret('ADMIN_PASSWORD', /^[a-z]+$/, 'password');

const keys = new Map<string, Promise<{ salt: Uint8Array; key: CryptoKey }>>();

function getKey(secret: string) {
  let key = keys.get(secret);
  if (!key) {
    key = (async () => {
      const salt = crypto.getRandomValues(new Uint8Array(16));
      const material = await crypto.subtle.importKey('raw', encoder.encode(secret), 'PBKDF2', false, ['deriveKey']);
      const derived = await crypto.subtle.deriveKey(
        { name: 'PBKDF2', salt, iterations: ITERATIONS, hash: 'SHA-256' },
        material,
        { name: 'AES-GCM', length: 256 },
        false,
        ['encrypt'],
      );
      return { salt, key: derived };
    })();
    keys.set(secret, key);
  }
  return key;
}

export async function seal(text: string, secret: string = novelPin()): Promise<SealedPayload> {
  const { salt, key } = await getKey(secret);
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const data = new Uint8Array(await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, encoder.encode(text)));
  return { salt: toBase64(salt), iv: toBase64(iv), data: toBase64(data), iter: ITERATIONS };
}
