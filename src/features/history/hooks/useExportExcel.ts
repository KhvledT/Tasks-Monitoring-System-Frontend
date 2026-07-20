import { useState } from 'react';
import { historyApi } from '../api/history.api';
import { downloadBlob } from '../../../shared/utils/download';

export const useExportExcel = () => {
  const [isExporting, setIsExporting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const exportExcel = async (
    vesselId: string,
    config: any
  ) => {
    setIsExporting(true);
    setError(null);
    try {
      const blob = await historyApi.exportExcel(vesselId, config);
      const filename = `vessel-logbook-${vesselId}-${new Date().toISOString().split('T')[0]}.xlsx`;
      downloadBlob(blob, filename);
    } catch (err: any) {
      console.error('Failed to export Excel:', err);
      const msg = err.response?.data?.message || 'Failed to download Excel spreadsheet from the shore server.';
      setError(msg);
    } finally {
      setIsExporting(false);
    }
  };

  return {
    exportExcel,
    isExporting,
    error,
  };
};

export default useExportExcel;
