import React, { useState, useEffect } from 'react';
import { useActiveVessel } from '../../../shared/hooks/useActiveVessel';
import { useExportPdf } from '../../history/hooks/useExportPdf';
import { useExportExcel } from '../../history/hooks/useExportExcel';
import { Card } from '@heroui/react';
import { toast } from 'react-hot-toast';

interface ReportTemplate {
  name: string;
  format: 'PDF' | 'EXCEL' | 'CSV';
  pageSize: 'A4' | 'LETTER';
  orientation: 'PORTRAIT' | 'LANDSCAPE';
  margins: 'NORMAL' | 'NARROW' | 'WIDE';
  theme: 'LIGHT' | 'DARK' | 'MONOCHROME';
  includeTasks: boolean;
  includeIssues: boolean;
  includeHistory: boolean;
  includeSessions: boolean;
  includeImages: boolean;
  companyLogoName: string;
  companyLogoBase64: string;
  companyLogoPosition: string;
  vesselLogoName: string;
  vesselLogoBase64: string;
  vesselLogoPosition: string;
  signatureName: string;
  signatureBase64: string;
  signaturePosition: string;
  officerName: string;
  imoNumber: string;
  visibleColumns: string[];
}

export const ReportsPage: React.FC = () => {
  const { activeVessel, activeVesselId } = useActiveVessel();
  const { exportPdf, isExporting: isExportingPdf } = useExportPdf();
  const { exportExcel, isExporting: isExportingExcel } = useExportExcel();

  // Customizer States
  const [format, setFormat] = useState<'PDF' | 'EXCEL' | 'CSV'>('PDF');
  const [pageSize, setPageSize] = useState<'A4' | 'LETTER'>('A4');
  const [orientation, setOrientation] = useState<'PORTRAIT' | 'LANDSCAPE'>('PORTRAIT');
  const [margins, setMargins] = useState<'NORMAL' | 'NARROW' | 'WIDE'>('NORMAL');
  const [theme, setTheme] = useState<'LIGHT' | 'DARK' | 'MONOCHROME'>('DARK');

  const [includeTasks, setIncludeTasks] = useState(true);
  const [includeIssues, setIncludeIssues] = useState(true);
  const [includeHistory, setIncludeHistory] = useState(true);
  const [includeSessions, setIncludeSessions] = useState(true);
  const [includeImages, setIncludeImages] = useState(true);

  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [companyLogoName, setCompanyLogoName] = useState('Global Ocean Shipping');
  
  // Image Base64 Upload states
  const [companyLogoBase64, setCompanyLogoBase64] = useState<string>('');
  const [companyLogoPosition, setCompanyLogoPosition] = useState<string>('Header');
  
  const [vesselLogoName, setVesselLogoName] = useState('');
  const [vesselLogoBase64, setVesselLogoBase64] = useState<string>('');
  const [vesselLogoPosition, setVesselLogoPosition] = useState<string>('First Page');
  
  const [signatureName, setSignatureName] = useState('');
  const [signatureBase64, setSignatureBase64] = useState<string>('');
  const [signaturePosition, setSignaturePosition] = useState<string>('Last Page');

  // Additional Metadata
  const [officerName, setOfficerName] = useState('Chief Officer John Doe');
  const [imoNumber, setImoNumber] = useState('IMO 9123456');

  // Column Customization
  const [visibleColumns, setVisibleColumns] = useState<string[]>(['Date', 'Task', 'Category', 'Status', 'Notes']);

  // Templates
  const [templates, setTemplates] = useState<ReportTemplate[]>([]);
  const [selectedTemplateName, setSelectedTemplateName] = useState<string>('');
  const [newTemplateName, setNewTemplateName] = useState<string>('');

  // Load templates on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('mtms_report_templates');
      if (stored) {
        setTemplates(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Failed to load templates from localStorage', e);
    }
  }, []);

  const handleImageUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: (base64: string) => void,
    labelSetter?: (name: string) => void
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Only image files are allowed.');
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      toast.error('Image size must be less than 2MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setter(reader.result);
        if (labelSetter) {
          labelSetter(file.name);
        }
        toast.success(`${file.name} uploaded successfully!`);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSaveTemplate = () => {
    if (!newTemplateName.trim()) {
      toast.error('Please enter a template name.');
      return;
    }

    const updated = [...templates.filter(t => t.name !== newTemplateName)];
    const newTemplate: ReportTemplate = {
      name: newTemplateName,
      format,
      pageSize,
      orientation,
      margins,
      theme,
      includeTasks,
      includeIssues,
      includeHistory,
      includeSessions,
      includeImages,
      companyLogoName,
      companyLogoBase64,
      companyLogoPosition,
      vesselLogoName,
      vesselLogoBase64,
      vesselLogoPosition,
      signatureName,
      signatureBase64,
      signaturePosition,
      officerName,
      imoNumber,
      visibleColumns,
    };
    
    updated.push(newTemplate);
    setTemplates(updated);
    localStorage.setItem('mtms_report_templates', JSON.stringify(updated));
    setNewTemplateName('');
    toast.success(`Template "${newTemplate.name}" saved!`);
  };

  const handleLoadTemplate = (name: string) => {
    const found = templates.find(t => t.name === name);
    if (!found) return;

    setFormat(found.format);
    setPageSize(found.pageSize);
    setOrientation(found.orientation);
    setMargins(found.margins);
    setTheme(found.theme);
    setIncludeTasks(found.includeTasks);
    setIncludeIssues(found.includeIssues);
    setIncludeHistory(found.includeHistory);
    setIncludeSessions(found.includeSessions);
    setIncludeImages(found.includeImages);
    setCompanyLogoName(found.companyLogoName);
    setCompanyLogoBase64(found.companyLogoBase64);
    setCompanyLogoPosition(found.companyLogoPosition);
    setVesselLogoName(found.vesselLogoName);
    setVesselLogoBase64(found.vesselLogoBase64);
    setVesselLogoPosition(found.vesselLogoPosition);
    setSignatureName(found.signatureName);
    setSignatureBase64(found.signatureBase64);
    setSignaturePosition(found.signaturePosition);
    setOfficerName(found.officerName);
    setImoNumber(found.imoNumber);
    setVisibleColumns(found.visibleColumns);

    toast.success(`Template "${name}" loaded!`);
  };

  const toggleColumn = (col: string) => {
    if (visibleColumns.includes(col)) {
      setVisibleColumns(visibleColumns.filter(c => c !== col));
    } else {
      setVisibleColumns([...visibleColumns, col]);
    }
  };

  const handleGenerate = async () => {
    if (!activeVesselId) {
      toast.error('No active vessel workspace selected.');
      return;
    }

    const config = {
      startDate: startDate || undefined,
      endDate: endDate || undefined,
      format,
      pageSize,
      orientation,
      margins,
      theme,
      includeTasks,
      includeIssues,
      includeHistory,
      includeSessions,
      includeImages,
      companyLogoName,
      companyLogoBase64,
      companyLogoPosition,
      vesselLogoName,
      vesselLogoBase64,
      vesselLogoPosition,
      signatureName,
      signatureBase64,
      signaturePosition,
      officerName,
      imoNumber,
      visibleColumns: visibleColumns.join(','),
    };

    try {
      if (format === 'PDF') {
        await exportPdf(activeVesselId, config);
        toast.success('PDF compliance report generated and download initialized.');
      } else {
        await exportExcel(activeVesselId, config);
        toast.success('Spreadsheet report generated and download initialized.');
      }
    } catch (err: any) {
      toast.error('Failed to generate export file.');
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full animate-fade-in pb-10">
      <div>
        <h1 className="text-xl font-bold text-zinc-100 tracking-tight">Compliance Export Center</h1>
        <p className="text-xs text-zinc-400 mt-1 font-medium">Configure, design, and preview compliance-ready deck logbook reports.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Customizer Panel */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          <Card className="border border-zinc-900 bg-zinc-950/40 p-5 rounded-2xl flex flex-col gap-5 shadow-xl max-h-[85vh] overflow-y-auto pr-2">
            <h3 className="text-xs font-bold text-zinc-300 uppercase tracking-wider border-b border-zinc-900 pb-2">
              Report Settings
            </h3>

            {/* Template Selector */}
            <div className="flex flex-col gap-2 p-3 bg-zinc-900/30 border border-zinc-900 rounded-xl">
              <label className="text-[10px] font-bold text-zinc-550 uppercase tracking-wider">Report Templates</label>
              {templates.length > 0 && (
                <div className="flex gap-2">
                  <select
                    value={selectedTemplateName}
                    onChange={(e) => {
                      setSelectedTemplateName(e.target.value);
                      if (e.target.value) handleLoadTemplate(e.target.value);
                    }}
                    className="flex-1 bg-zinc-950 border border-zinc-800 text-xs text-zinc-300 rounded-xl px-2 py-1.5 outline-none cursor-pointer"
                  >
                    <option value="">-- Load Saved Template --</option>
                    {templates.map(t => (
                      <option key={t.name} value={t.name}>{t.name}</option>
                    ))}
                  </select>
                </div>
              )}
              <div className="flex gap-1.5 mt-1">
                <input
                  type="text"
                  placeholder="New Template Name"
                  value={newTemplateName}
                  onChange={(e) => setNewTemplateName(e.target.value)}
                  className="flex-1 bg-zinc-950 border border-zinc-800 text-xs text-zinc-200 rounded-xl px-3 py-1.5 outline-none"
                />
                <button
                  type="button"
                  onClick={handleSaveTemplate}
                  className="px-3 py-1.5 bg-sky-950 hover:bg-sky-900/40 border border-sky-900/60 text-sky-400 font-extrabold text-[10px] rounded-xl transition uppercase tracking-wider cursor-pointer"
                >
                  Save
                </button>
              </div>
            </div>

            {/* Format Selection */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Export Format</label>
              <div className="grid grid-cols-3 gap-2 bg-zinc-950 p-1 rounded-xl border border-zinc-900">
                {(['PDF', 'EXCEL', 'CSV'] as const).map((f) => (
                  <button
                    key={f}
                    onClick={() => setFormat(f)}
                    className={`py-1.5 text-[11px] font-bold rounded-lg transition-all ${
                      format === f ? 'bg-sky-950/50 text-sky-400 border border-sky-950/60' : 'text-zinc-500 hover:text-zinc-300'
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            {/* Layout (Only for PDF) */}
            {format === 'PDF' && (
              <>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Page Size</label>
                  <div className="grid grid-cols-2 gap-2 bg-zinc-950 p-1 rounded-xl border border-zinc-900">
                    {(['A4', 'LETTER'] as const).map((s) => (
                      <button
                        key={s}
                        onClick={() => setPageSize(s)}
                        className={`py-1.5 text-[11px] font-bold rounded-lg transition-all ${
                          pageSize === s ? 'bg-sky-950/50 text-sky-400 border border-sky-950/60' : 'text-zinc-500 hover:text-zinc-300'
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Orientation</label>
                  <div className="grid grid-cols-2 gap-2 bg-zinc-950 p-1 rounded-xl border border-zinc-900">
                    {(['PORTRAIT', 'LANDSCAPE'] as const).map((o) => (
                      <button
                        key={o}
                        onClick={() => setOrientation(o)}
                        className={`py-1.5 text-[11px] font-bold rounded-lg transition-all ${
                          orientation === o ? 'bg-sky-950/50 text-sky-400 border border-sky-950/60' : 'text-zinc-500 hover:text-zinc-300'
                        }`}
                      >
                        {o}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Report Margins</label>
                  <div className="grid grid-cols-3 gap-2 bg-zinc-950 p-1 rounded-xl border border-zinc-900">
                    {(['NORMAL', 'NARROW', 'WIDE'] as const).map((m) => (
                      <button
                        key={m}
                        onClick={() => setMargins(m)}
                        className={`py-1.5 text-[11px] font-bold rounded-lg transition-all ${
                          margins === m ? 'bg-sky-950/50 text-sky-400 border border-sky-950/60' : 'text-zinc-500 hover:text-zinc-300'
                        }`}
                      >
                        {m}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Theme Profile</label>
                  <select
                    value={theme}
                    onChange={(e) => setTheme(e.target.value as any)}
                    className="w-full bg-zinc-900 border border-zinc-800 text-xs text-zinc-200 rounded-xl px-3 py-2.5 outline-none cursor-pointer"
                  >
                    <option value="LIGHT">Light Theme (Ink Saver)</option>
                    <option value="DARK">Premium Dark Theme</option>
                    <option value="MONOCHROME">Official Monochrome</option>
                  </select>
                </div>
              </>
            )}

            {/* Date Span */}
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Date Span</label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="bg-zinc-900 border border-zinc-800 text-xs text-zinc-300 rounded-xl px-3 py-2 outline-none cursor-pointer"
                />
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="bg-zinc-900 border border-zinc-800 text-xs text-zinc-300 rounded-xl px-3 py-2 outline-none cursor-pointer"
                />
              </div>
            </div>

            {/* Metadata inputs */}
            <div className="flex flex-col gap-2.5">
              <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Compliance Metadata</label>
              <div className="flex flex-col gap-2">
                <input
                  type="text"
                  value={companyLogoName}
                  onChange={(e) => setCompanyLogoName(e.target.value)}
                  placeholder="Shipping Company Name"
                  className="w-full bg-zinc-900 border border-zinc-800 text-xs text-zinc-200 rounded-xl px-3 py-2 outline-none"
                />
                <input
                  type="text"
                  value={officerName}
                  onChange={(e) => setOfficerName(e.target.value)}
                  placeholder="Responsible Deck Officer Name"
                  className="w-full bg-zinc-900 border border-zinc-800 text-xs text-zinc-200 rounded-xl px-3 py-2 outline-none"
                />
                <input
                  type="text"
                  value={imoNumber}
                  onChange={(e) => setImoNumber(e.target.value)}
                  placeholder="Vessel Identifiers (e.g. IMO 9123456)"
                  className="w-full bg-zinc-900 border border-zinc-800 text-xs text-zinc-200 rounded-xl px-3 py-2 outline-none"
                />
              </div>
            </div>

            {/* Image Uploads block */}
            <div className="flex flex-col gap-3.5 bg-zinc-900/10 border border-zinc-900 rounded-xl p-3">
              <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Report Branding & Seals</label>
              
              {/* Company Logo */}
              <div className="flex flex-col gap-1 border-b border-zinc-900 pb-2">
                <span className="text-[9px] font-bold text-zinc-550">Company Header Logo</span>
                <div className="flex items-center gap-2">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, setCompanyLogoBase64)}
                    className="text-[10px] text-zinc-400 flex-1 file:mr-2 file:py-1 file:px-2 file:rounded-md file:border-0 file:text-[9px] file:font-bold file:bg-zinc-800 file:text-sky-400 cursor-pointer"
                  />
                  {companyLogoBase64 && (
                    <button type="button" onClick={() => setCompanyLogoBase64('')} className="text-[9px] text-red-400">Clear</button>
                  )}
                </div>
                {companyLogoBase64 && (
                  <select
                    value={companyLogoPosition}
                    onChange={(e) => setCompanyLogoPosition(e.target.value)}
                    className="bg-zinc-950 border border-zinc-900 text-[10px] text-zinc-400 rounded-lg px-2 py-1 outline-none mt-1"
                  >
                    <option value="Header">Header (Top Right)</option>
                    <option value="Footer">Footer (Bottom)</option>
                    <option value="First Page">First Page Cover Only</option>
                  </select>
                )}
              </div>

              {/* Vessel Logo */}
              <div className="flex flex-col gap-1 border-b border-zinc-900 pb-2">
                <span className="text-[9px] font-bold text-zinc-550">Vessel Shield Logo</span>
                <div className="flex items-center gap-2">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, setVesselLogoBase64, setVesselLogoName)}
                    className="text-[10px] text-zinc-400 flex-1 file:mr-2 file:py-1 file:px-2 file:rounded-md file:border-0 file:text-[9px] file:font-bold file:bg-zinc-800 file:text-sky-400 cursor-pointer"
                  />
                  {vesselLogoBase64 && (
                    <button type="button" onClick={() => setVesselLogoBase64('')} className="text-[9px] text-red-400">Clear</button>
                  )}
                </div>
                {vesselLogoBase64 && (
                  <select
                    value={vesselLogoPosition}
                    onChange={(e) => setVesselLogoPosition(e.target.value)}
                    className="bg-zinc-950 border border-zinc-900 text-[10px] text-zinc-400 rounded-lg px-2 py-1 outline-none mt-1"
                  >
                    <option value="First Page">First Page Cover Only</option>
                    <option value="Header">Header (Top Left)</option>
                    <option value="Last Page">Last Page Signature Zone</option>
                  </select>
                )}
              </div>

              {/* Officer Signature */}
              <div className="flex flex-col gap-1">
                <span className="text-[9px] font-bold text-zinc-550">Officer Digital Signature Stamp</span>
                <div className="flex items-center gap-2">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, setSignatureBase64, setSignatureName)}
                    className="text-[10px] text-zinc-400 flex-1 file:mr-2 file:py-1 file:px-2 file:rounded-md file:border-0 file:text-[9px] file:font-bold file:bg-zinc-800 file:text-sky-400 cursor-pointer"
                  />
                  {signatureBase64 && (
                    <button type="button" onClick={() => setSignatureBase64('')} className="text-[9px] text-red-400">Clear</button>
                  )}
                </div>
                {signatureBase64 && (
                  <select
                    value={signaturePosition}
                    onChange={(e) => setSignaturePosition(e.target.value)}
                    className="bg-zinc-950 border border-zinc-900 text-[10px] text-zinc-400 rounded-lg px-2 py-1 outline-none mt-1"
                  >
                    <option value="Last Page">Last Page Signatures Zone</option>
                    <option value="Footer">Footer (Every Page)</option>
                  </select>
                )}
              </div>
            </div>

            {/* Column Selector */}
            <div className="flex flex-col gap-2 bg-zinc-900/10 border border-zinc-900 p-3 rounded-xl">
              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Visible Columns</span>
              <div className="grid grid-cols-2 gap-2 text-xs text-zinc-300">
                {['Date', 'Task', 'Category', 'Status', 'Notes', 'Signature'].map((col) => (
                  <label key={col} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={visibleColumns.includes(col)}
                      onChange={() => toggleColumn(col)}
                      className="rounded border-zinc-800 text-sky-500 bg-zinc-900 w-3.5 h-3.5"
                    />
                    {col}
                  </label>
                ))}
              </div>
            </div>

            {/* Content Sections */}
            <div className="flex flex-col gap-2.5">
              <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Data Sections</label>
              <div className="flex flex-col gap-2">
                <label className="flex items-center gap-2.5 text-xs text-zinc-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includeTasks}
                    onChange={(e) => setIncludeTasks(e.target.checked)}
                    className="rounded border-zinc-800 text-sky-500 bg-zinc-900 w-4 h-4"
                  />
                  Completed Checklist Tasks
                </label>
                <label className="flex items-center gap-2.5 text-xs text-zinc-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includeIssues}
                    onChange={(e) => setIncludeIssues(e.target.checked)}
                    className="rounded border-zinc-800 text-sky-500 bg-zinc-900 w-4 h-4"
                  />
                  Reported Defects & Issues
                </label>
                <label className="flex items-center gap-2.5 text-xs text-zinc-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includeHistory}
                    onChange={(e) => setIncludeHistory(e.target.checked)}
                    className="rounded border-zinc-800 text-sky-500 bg-zinc-900 w-4 h-4"
                  />
                  Deck Logbook Timeline
                </label>
                <label className="flex items-center gap-2.5 text-xs text-zinc-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includeSessions}
                    onChange={(e) => setIncludeSessions(e.target.checked)}
                    className="rounded border-zinc-800 text-sky-500 bg-zinc-900 w-4 h-4"
                  />
                  Watchkeeper Sessions Logs
                </label>
                <label className="flex items-center gap-2.5 text-xs text-zinc-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includeImages}
                    onChange={(e) => setIncludeImages(e.target.checked)}
                    className="rounded border-zinc-800 text-sky-500 bg-zinc-900 w-4 h-4"
                  />
                  Include Defect Photo Evidence
                </label>
              </div>
            </div>

            <button
              onClick={handleGenerate}
              disabled={isExportingPdf || isExportingExcel}
              className="w-full mt-2 py-3 bg-sky-500 hover:bg-sky-400 disabled:bg-sky-500/50 text-xs font-bold text-black rounded-xl transition flex items-center justify-center gap-2 cursor-pointer"
            >
              {isExportingPdf || isExportingExcel ? 'Compiling Report...' : 'Compile & Export'}
            </button>
          </Card>
        </div>

        {/* Right Live Report Preview Panel */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          <h3 className="text-xs font-bold text-zinc-450 uppercase tracking-wider pl-2">
            Deck Logbook Live Report Preview
          </h3>
          <div className={`w-full border border-zinc-900 bg-zinc-950 rounded-2xl shadow-2xl flex flex-col gap-6 min-h-[500px] ${
            margins === 'NARROW' ? 'p-4' : margins === 'WIDE' ? 'p-12' : 'p-8'
          }`}>
            {/* Report Header preview */}
            <div className="flex justify-between items-start border-b border-zinc-900 pb-5">
              <div>
                <div className="flex items-center gap-3">
                  {vesselLogoBase64 && vesselLogoPosition === 'Header' && (
                    <img src={vesselLogoBase64} alt="Vessel Logo" className="w-12 h-12 object-contain" />
                  )}
                  <div>
                    <h2 className="text-sm font-bold text-zinc-200">{companyLogoName || 'Maritime Operations'}</h2>
                    <p className="text-[11px] text-zinc-550 font-mono mt-0.5">Vessel: {activeVessel?.name || 'Enterprise'} ({imoNumber})</p>
                    <p className="text-[10px] text-zinc-550 mt-1">Class Type: {activeVessel?.type || 'LPG Carrier'}</p>
                  </div>
                </div>
              </div>
              <div className="text-right flex flex-col items-end gap-1">
                {companyLogoBase64 && companyLogoPosition === 'Header' && (
                  <img src={companyLogoBase64} alt="Company Logo" className="w-16 h-8 object-contain mb-1" />
                )}
                <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-wider bg-zinc-900 border border-zinc-850 px-2 py-0.5 rounded">
                  OFFICIAL COMPLIANCE LOG
                </span>
                <p className="text-[10px] font-mono text-zinc-550 mt-1">
                  {startDate || 'Start Date'} &rarr; {endDate || 'End Date'}
                </p>
              </div>
            </div>

            {/* Cover Page Simulation if logos placed on First Page */}
            {((companyLogoBase64 && companyLogoPosition === 'First Page') || (vesselLogoBase64 && vesselLogoPosition === 'First Page')) && (
              <div className="border border-zinc-900 rounded-xl p-6 bg-zinc-950/40 text-center flex flex-col items-center gap-4 my-2 border-double">
                <span className="text-[9px] font-bold uppercase tracking-wider text-sky-400 bg-sky-950/20 px-2 py-0.5 border border-sky-900/30 rounded">Report Cover Page</span>
                <div className="flex items-center gap-6 justify-center">
                  {companyLogoBase64 && companyLogoPosition === 'First Page' && (
                    <img src={companyLogoBase64} alt="Company Logo Cover" className="w-24 h-12 object-contain" />
                  )}
                  {vesselLogoBase64 && vesselLogoPosition === 'First Page' && (
                    <img src={vesselLogoBase64} alt="Vessel Shield Cover" className="w-16 h-16 object-contain" />
                  )}
                </div>
                <h3 className="text-xs font-extrabold text-zinc-300 uppercase tracking-wider mt-1">Official Vessel Operations Compliance logbook</h3>
                <p className="text-[10px] text-zinc-550">Responsible Officer: {officerName}</p>
              </div>
            )}

            {/* Task summary block preview */}
            {includeTasks && (
              <div className="flex flex-col gap-2 border-b border-zinc-900/40 pb-4">
                <h4 className="text-[11px] font-bold text-sky-400 uppercase tracking-wider">Completed Checklist Tasks</h4>
                
                {/* Simulated Table with selected columns */}
                <div className="overflow-x-auto mt-1 border border-zinc-900 rounded-lg">
                  <table className="w-full text-left text-[10px] text-zinc-400">
                    <thead className="bg-zinc-900/60 text-zinc-500 uppercase tracking-wider font-bold">
                      <tr>
                        {visibleColumns.map(col => (
                          <th key={col} className="p-2 border-b border-zinc-900">{col}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-zinc-900/45">
                        {visibleColumns.includes('Date') && <td className="p-2 font-mono">2026-07-20</td>}
                        {visibleColumns.includes('Task') && <td className="p-2 font-bold text-zinc-300">Engine Oil Pressure Audit</td>}
                        {visibleColumns.includes('Category') && <td className="p-2">Machinery</td>}
                        {visibleColumns.includes('Status') && <td className="p-2 text-emerald-400 font-bold">COMPLETED</td>}
                        {visibleColumns.includes('Notes') && <td className="p-2 italic text-zinc-500">Pressure normal (5.4 bar)</td>}
                        {visibleColumns.includes('Signature') && <td className="p-2 text-zinc-500">{officerName.substring(0, 10)}...</td>}
                      </tr>
                      <tr>
                        {visibleColumns.includes('Date') && <td className="p-2 font-mono">2026-07-20</td>}
                        {visibleColumns.includes('Task') && <td className="p-2 font-bold text-zinc-300">Auxiliary Generator Signal checks</td>}
                        {visibleColumns.includes('Category') && <td className="p-2">Electrical</td>}
                        {visibleColumns.includes('Status') && <td className="p-2 text-emerald-400 font-bold">COMPLETED</td>}
                        {visibleColumns.includes('Notes') && <td className="p-2 italic text-zinc-500">Auto-start verified ok.</td>}
                        {visibleColumns.includes('Signature') && <td className="p-2 text-zinc-500">{officerName.substring(0, 10)}...</td>}
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Defect issues block preview */}
            {includeIssues && (
              <div className="flex flex-col gap-2 border-b border-zinc-900/40 pb-4">
                <h4 className="text-[11px] font-bold text-red-400 uppercase tracking-wider">Reported Defects & Machinery Issues</h4>
                <div className="text-[11px] text-zinc-450 flex flex-col gap-2 pl-3 border-l border-zinc-900 mt-1">
                  <div className="flex flex-col gap-1 p-2.5 bg-red-955/5 border border-red-955/20 rounded-lg">
                    <div className="flex justify-between items-center text-[10px]">
                      <span className="font-bold text-zinc-300">• Hydraulic Valve #4 Minor Leakage</span>
                      <span className="text-red-400 font-bold uppercase tracking-wider text-[9px] bg-red-950/20 px-1.5 py-0.2 rounded border border-red-900/30">MAJOR DEFECT</span>
                    </div>
                    <span className="text-[9px] text-zinc-550 italic font-medium">Logged by: {officerName}</span>
                    {includeImages && (
                      <div className="w-1/3 aspect-video bg-zinc-900 border border-zinc-850 rounded flex items-center justify-center text-[9px] text-zinc-650 mt-1">
                        Photo Evidence Attached
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Watchkeeper session signatures preview */}
            {includeSessions && (
              <div className="flex flex-col gap-2 pb-4">
                <h4 className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">Watch Signatures & Seals</h4>
                <div className="grid grid-cols-2 gap-4 mt-1">
                  <div className="border border-zinc-900 p-3.5 rounded-xl flex flex-col gap-2">
                    <span className="text-[9px] text-zinc-550 uppercase tracking-wider font-extrabold">Watchkeeper On Duty</span>
                    <span className="text-xs text-zinc-300 font-bold">{officerName}</span>
                    {signatureBase64 && (signaturePosition === 'Last Page' || signaturePosition === 'Footer') && (
                      <div className="border-t border-zinc-900 pt-2 mt-1 flex flex-col gap-1 items-start">
                        <span className="text-[8px] text-zinc-550 uppercase font-semibold">Sign stamp</span>
                        <img src={signatureBase64} alt="Officer Stamp" className="h-10 w-24 object-contain opacity-80" />
                      </div>
                    )}
                    <span className="text-[10px] text-zinc-550 font-mono">IMO Compliance Stamp</span>
                  </div>
                  <div className="border border-zinc-900 p-3.5 rounded-xl flex flex-col gap-1">
                    <span className="text-[9px] text-zinc-550 uppercase tracking-wider font-extrabold">Relieving Watchkeeper</span>
                    <span className="text-xs text-zinc-400 font-bold">Incoming Officer</span>
                    <span className="text-[10px] text-zinc-550 font-mono mt-auto">Handover Code Sealed</span>
                  </div>
                </div>
              </div>
            )}

            {/* Page Footer Preview */}
            <div className="text-[10px] text-zinc-600 text-center border-t border-zinc-900/60 pt-4 mt-auto flex justify-between items-center">
              <span>{imoNumber} Operations Report</span>
              <span>Generated under Safety of Life at Sea (SOLAS) compliance guidelines</span>
              {companyLogoBase64 && companyLogoPosition === 'Footer' && (
                <img src={companyLogoBase64} alt="Company Logo Footer" className="h-4 object-contain" />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;
