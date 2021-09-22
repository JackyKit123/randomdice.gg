import firebase from 'firebase/app';

export default class MyUploadAdapter {
  private loader: {
    file: Promise<File>;
  };

  constructor(loader: { file: Promise<File> }) {
    this.loader = loader;
  }

  public async upload(): Promise<{
    default: string;
  }> {
    try {
      const file = await this.loader.file;
      const upload = await firebase
        .storage()
        .ref('CKEditor Images/')
        .child(`${new Date().toISOString()}-${file.name}`)
        .put(file, {
          cacheControl: 'public,max-age=31536000',
        });
      const url = await upload.ref.getDownloadURL();
      return {
        default: url,
      };
    } catch {
      return {
        default: '',
      };
    }
  }
}
