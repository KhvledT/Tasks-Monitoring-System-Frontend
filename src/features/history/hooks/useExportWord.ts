import { useState } from 'react';
import { historyApi } from '../api/history.api';

export const useExportWord = () => {
  const [isExporting, setIsExporting] = useState(false);

  const exportWord = async (
    vesselId: string,
    config: any,
    fileName = 'task_records_report.docx'
  ) => {
    setIsExporting(true);
    try {
      const blob = await historyApi.exportWord(vesselId, config);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Failed to export Word document:', err);
      throw err;
    } finally {
      setIsExporting(false);
    }
  };

  return {
    exportWord,
    isExporting,
  };
};

export default useExportWord;
