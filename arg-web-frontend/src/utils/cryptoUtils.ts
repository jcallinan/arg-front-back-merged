import CryptoJS from 'crypto-js';

const secretKey = 'V9$k@1mZ&pT8!sR4&yN2^wQ7*eF0+LbC';

// Generate same 32-byte key as backend (sha256 hash)
const hashedKey = CryptoJS.SHA256(secretKey);

export function encryptData(data: any) {
  try {
    const iv = CryptoJS.lib.WordArray.random(16); 
    
    const encrypted = CryptoJS.AES.encrypt(JSON.stringify(data), hashedKey, {
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    });

    return {
      iv: iv.toString(CryptoJS.enc.Base64),
      payload: encrypted.toString(),
    };
  } catch (e) {
    console.error("Failed to encrypt data:", e instanceof Error ? e.message : e);
    throw e;
  }
}

export function decryptData(encrypted: any) {
  try {
    const iv = CryptoJS.enc.Base64.parse(encrypted.iv);
    
    // Convert the hashed key to the proper format
    const key = CryptoJS.enc.Hex.parse(hashedKey.toString());

    const decrypted = CryptoJS.AES.decrypt(encrypted.payload, key, {
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    });

    const decryptedStr = decrypted.toString(CryptoJS.enc.Utf8);

    if (!decryptedStr) {
      throw new Error("Decryption failed: possibly wrong key/IV");
    }

    const parsedData = JSON.parse(decryptedStr);
    return parsedData;
  } catch (e) {
    console.error("Failed to decrypt data:", e instanceof Error ? e.message : e);
    throw e;
  }
}