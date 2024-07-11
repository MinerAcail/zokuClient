
import { FFmpeg } from '@ffmpeg/ffmpeg';

// Assuming 'ffmpeg' is initialized somewhere in your application
const ffmpeg = new FFmpeg();

async function createVideoFromImages(files: FileList) {
  await ffmpeg.load();

  // Example: Write uploaded image files to FFmpeg's /input directory
  await ffmpeg.createDir('/input');
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const data = new Uint8Array(await file.arrayBuffer());
    await ffmpeg.writeFile(`/input/${i}.jpg`, data);
  }

  // Execute FFmpeg command to create slideshow video
  await ffmpeg.exec([
    '-framerate', '1/3', // Adjust frame rate as needed
    '-pattern_type', 'glob',
    '-i', '/input/*.jpg',
    '-c:v', 'libx264',
    '-pix_fmt', 'yuv420p',
    '/output/slideshow.mp4'
  ]);

  // Fetch created video file
  const videoData = await ffmpeg.readFile('/output/slideshow.mp4');
  // Handle the video file as needed (e.g., display in UI, allow download)

  // Cleanup: Delete temporary files and directories
  await ffmpeg.deleteDir('/input');
  await ffmpeg.deleteDir('/output');
}

// Example usage
const uploadedFiles = document.getElementById('fileInput')?.files;
if (uploadedFiles) {
  createVideoFromImages(uploadedFiles).then(() => {
    console.log('Video creation and cleanup complete.');
  }).catch(error => {
    console.error('Error during video creation:', error);
  });
}
