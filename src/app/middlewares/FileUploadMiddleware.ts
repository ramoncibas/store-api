import expressFileUpload, { Options } from "express-fileupload";
import path from "path";
import fs from "fs";

class FileUploadMiddleware {
  private static tempDir = path.resolve("temp");

  private static ensureTempDir() {
    if (!fs.existsSync(this.tempDir)) {
      fs.mkdirSync(this.tempDir, { recursive: true });
    }
  }

  public static get middleware() {
    this.ensureTempDir();

    const options: Options = {
      useTempFiles: true,
      tempFileDir: this.tempDir,
      limits: {
        fileSize: 50 * 1024 * 1024,
      },
      preserveExtension: true,
      safeFileNames: true,
      abortOnLimit: true,
      createParentPath: true,
    };

    return expressFileUpload(options);
  }
}

export default FileUploadMiddleware.middleware;