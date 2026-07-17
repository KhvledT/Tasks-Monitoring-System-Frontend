/**
 * Shared utility to trigger browser downloads of Blobs.
 */
export const downloadBlob = (blob: Blob, defaultFilename: string): void => {
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = defaultFilename;
  document.body.appendChild(a);
  a.click();
  
  // Cleanup after click trigger
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
};

export default downloadBlob;
