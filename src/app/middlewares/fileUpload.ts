import expressFileUpload from "express-fileupload";

const fileUpload = expressFileUpload({
  useTempFiles: true,
  tempFileDir: "temp",
  limits: { fileSize: 50 * 1024 * 1024 },
  preserveExtension: true,
  safeFileNames: true,
});

export default fileUpload;