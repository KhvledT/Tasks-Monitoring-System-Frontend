import { useState } from 'react';
import { historyApi } from '../api/history.api';
import { downloadBlob } from '../../../shared/utils/download';

export const useExportPdf = () => {
  const [isExporting, setIsExporting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const exportPdf = async (
    vesselId: string,
    config: any
  ) => {
    setIsExporting(true);
    setError(null);
    try {
      const blob = await historyApi.exportPdf(vesselId, config);
      const filename = `vessel-logbook-${vesselId}-${new Date().toISOString().split('T')[0]}.pdf`;
      downloadBlob(blob, filename);
    } catch (err: any) {
      console.error('Failed to export PDF:', err);
      const msg = err.response?.data?.message || 'Failed to download PDF report from the shore server.';
      setError(msg);
    } finally {
      setIsExporting(false);
    }
  };

  return {
    exportPdf,
    isExporting,
    error,
  };
};

export default useExportPdf;
