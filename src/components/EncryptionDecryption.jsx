import CryptoJS from 'crypto-js';

const ENCRYPTION_KEY = CryptoJS.enc.Hex.parse('00112233445566778899aabbccddeeff00112233445566778899aabbccddeeff');

// Encrypt function
export function encryptData(text) {
  const iv = CryptoJS.lib.WordArray.random(16); // Generate random IV
  const encrypted = CryptoJS.AES.encrypt(text, ENCRYPTION_KEY, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  });
  return {
    iv: iv.toString(CryptoJS.enc.Hex),
    encryptedData: encrypted.toString()
  };
}

// Decrypt function
export function decryptData(encryptedData, iv) {
  try {
    const decrypted = CryptoJS.AES.decrypt(encryptedData, ENCRYPTION_KEY, {
      iv: CryptoJS.enc.Hex.parse(iv),
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    });
    return decrypted.toString(CryptoJS.enc.Utf8);
  } catch (error) {
    console.error("Decryption error: ", error);
    return null;
  }
}
