import { FFmpeg } from "@ffmpeg/ffmpeg";
import { toBlobURL } from "@ffmpeg/util";

export default async function loadFfmpeg(): Promise<FFmpeg> {
  const ffmpeg = new FFmpeg();
//   const baseURL = "https://unpkg.com/@ffmpeg/core@0.12.2/dist/umd";
  const baseURL = "https://unpkg.com/@ffmpeg/core-mt@0.12.6/dist/esm";

  try {
    await ffmpeg.load({
      coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, "text/javascript"),
      wasmURL: await toBlobURL(
        `${baseURL}/ffmpeg-core.wasm`,
        "application/wasm"
      ),
      workerURL: await toBlobURL(
        `${baseURL}/ffmpeg-core.worker.js`,
        "text/javascript"
      ),
    });
  } catch (error) {
    console.error("Failed to load ffmpeg-core:", error);
    throw new Error("Failed to load ffmpeg-core");
  }

  return ffmpeg;
}
