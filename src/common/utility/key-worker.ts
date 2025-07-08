import { secretbox } from 'tweetnacl';
import { encodeUTF8, decodeBase64 } from 'tweetnacl-util';

export const BRKEY = '8Y5mr09b0dyKCiW4KKD9hexeHM1mrCI4uc3y8txy49E=';

export const decrypt = (messageWithNonce, key) => {
  const keyUint8Array = decodeBase64(key);
  const messageWithNonceAsUint8Array = decodeBase64(messageWithNonce);
  const nonce = messageWithNonceAsUint8Array.slice(0, secretbox.nonceLength);
  const message = messageWithNonceAsUint8Array.slice(
    secretbox.nonceLength,
    messageWithNonce.length,
  );

  const decrypted = secretbox.open(message, nonce, keyUint8Array);

  if (!decrypted) {
    throw new Error('Could not decrypt message');
  }

  const base64DecryptedMessage = encodeUTF8(decrypted);

  return JSON.parse(base64DecryptedMessage);
};
