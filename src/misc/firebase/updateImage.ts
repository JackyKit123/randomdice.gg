import firebase from 'firebase/app';
import axios from 'axios';

export async function deleteImage(
  imgDirPath: string,
  name: string
): Promise<void> {
  const storage = firebase.storage();
  await storage
    .ref(imgDirPath)
    .child(name)
    .delete();
}

export default async function updateImage(
  imgSrc: string,
  imgDirPath: string,
  newName: string,
  oldName: string | undefined
): Promise<string> {
  const storage = firebase.storage();
  const isNewImageAvailable = /^data:image\/([a-zA-Z]*);base64,/.test(imgSrc);
  let imgUrl: string | null = null;

  const uploadNewImage = async (imageBase64: string): Promise<string> => {
    await storage
      .ref(imgDirPath)
      .child(newName)
      .putString(imageBase64, 'data_url', {
        cacheControl: 'public,max-age=31536000',
      });
    const newUrl = await storage
      .ref(imgDirPath)
      .child(newName)
      .getDownloadURL();
    return newUrl;
  };

  if (oldName && oldName !== newName) {
    if (!isNewImageAvailable) {
      const img: Blob = (
        await axios.get(imgSrc, {
          responseType: 'blob',
        })
      ).data;
      const reader = new FileReader();
      reader.readAsDataURL(img);
      imgUrl = await new Promise((resolve, reject) => {
        reader.onloadend = async (): Promise<void> => {
          const base64 = reader.result as string;
          resolve(base64);
        };
        reader.onerror = (error): void => reject(error);
      });
    }
    await deleteImage(imgDirPath, oldName);
  }

  if (isNewImageAvailable) {
    imgUrl = await uploadNewImage(imgSrc);
  }

  return imgUrl ?? imgSrc;
}
