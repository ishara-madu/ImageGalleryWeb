import Cookies from 'js-cookie';
import { decryptData } from './EncryptionDecryption'; // Import your decryption function

const getDecryptedUidFromCookie = () => {
  const encryptedUid = Cookies.get('encryptedUid');
  const iv = Cookies.get('encryptionIv'); // Retrieve IV if stored separately

  if (encryptedUid && iv) {
    const decryptedUid = decryptData(encryptedUid, iv);
    return decryptedUid;
  }

  return null;
};
export default getDecryptedUidFromCookie;