import JSZip from 'jszip';
import { SlideItem } from '../types';

export interface ZipDownloadProgress {
  current: number;
  total: number;
  percent: number;
  status: string;
}

/**
 * Downloads multiple slides as a real, uncorrupted .zip archive directly in the browser
 */
export async function downloadSlidesAsZip(
  slides: SlideItem[],
  zipTitle: string,
  onProgress?: (progress: ZipDownloadProgress) => void
): Promise<void> {
  if (!slides || slides.length === 0) return;

  const zip = new JSZip();
  const folderName = zipTitle.replace(/[^a-zA-Z0-9_\-]/g, '_').slice(0, 50) || 'DriaSave_Slides';
  const folder = zip.folder(folderName) || zip;

  const total = slides.length;

  for (let i = 0; i < total; i++) {
    const slide = slides[i];
    const slideNum = (i + 1).toString().padStart(2, '0');
    const filename = `Slide_${slideNum}.jpg`;

    if (onProgress) {
      onProgress({
        current: i + 1,
        total,
        percent: Math.round(((i + 1) / (total + 1)) * 90),
        status: `Mengunduh foto ${i + 1} dari ${total}...`,
      });
    }

    try {
      // Fetch slide image
      const fetchUrl = slide.url.startsWith('http')
        ? `/api/download?url=${encodeURIComponent(slide.url)}&filename=${encodeURIComponent(filename)}`
        : slide.url;

      const response = await fetch(fetchUrl);
      if (response.ok) {
        const blob = await response.blob();
        folder.file(filename, blob);
      } else {
        // Fallback direct fetch if proxy fails
        const directResp = await fetch(slide.url);
        if (directResp.ok) {
          const directBlob = await directResp.blob();
          folder.file(filename, directBlob);
        }
      }
    } catch (err) {
      console.warn(`Failed to package slide ${i + 1} into ZIP:`, err);
    }
  }

  if (onProgress) {
    onProgress({
      current: total,
      total,
      percent: 95,
      status: 'Mengompresi file menjadi ZIP...',
    });
  }

  // Generate ZIP file
  const zipBlob = await zip.generateAsync({
    type: 'blob',
    compression: 'DEFLATE',
    compressionOptions: { level: 6 },
  });

  if (onProgress) {
    onProgress({
      current: total,
      total,
      percent: 100,
      status: 'Unduhan ZIP selesai!',
    });
  }

  // Trigger browser download
  const downloadUrl = URL.createObjectURL(zipBlob);
  const a = document.createElement('a');
  a.href = downloadUrl;
  a.download = `${folderName}_All_Slides.zip`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);

  setTimeout(() => URL.revokeObjectURL(downloadUrl), 30000);
}
