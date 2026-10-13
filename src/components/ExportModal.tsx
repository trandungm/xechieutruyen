import React, { useState } from 'react';
import {
  X,
  Download,
  FileSpreadsheet,
  FileText,
  FolderArchive,
  Save,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { useStudio } from '../context/StudioContext';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ExportModal: React.FC<ExportModalProps> = ({ isOpen, onClose }) => {
  const { project, scenes, exportProjectZip, exportProjectJson } = useStudio();
  const [onlyApproved, setOnlyApproved] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  if (!isOpen) return null;

  const approvedCount = scenes.filter((s) => s.reviewStatus === 'approved').length;
  const totalCount = scenes.length;

  const handleDownloadZip = async () => {
    setIsExporting(true);
    try {
      await exportProjectZip(onlyApproved);
      onClose();
    } catch (err) {
      console.error('Export error:', err);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full border border-[#E4E7EC] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-5 border-b border-[#E4E7EC] flex items-center justify-between bg-[#FAFAFA]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-700 flex items-center justify-center">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-[#18202B]">
                Xuất Gói Tư Liệu Dựng Video
              </h3>
              <p className="text-xs text-[#667085]">
                Đóng gói toàn bộ hình ảnh và bảng đối chiếu lời đọc cho kênh YouTube
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 space-y-5 text-xs text-slate-700">
          {/* Options */}
          <div className="p-4 bg-[#FAF7F2] rounded-2xl border border-[#EADBCC] space-y-3">
            <div className="font-bold text-slate-900 text-xs">Cấu hình xuất dữ liệu</div>

            <label className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="radio"
                name="exportScope"
                checked={!onlyApproved}
                onChange={() => setOnlyApproved(false)}
                className="text-indigo-600 focus:ring-indigo-500"
              />
              <div>
                <span className="font-bold text-slate-800">
                  Xuất tất cả các cảnh ({totalCount} cảnh)
                </span>
                <p className="text-[11px] text-slate-500">
                  Bao gồm cả các cảnh vừa tạo chưa kịp bấm duyệt.
                </p>
              </div>
            </label>

            <label className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="radio"
                name="exportScope"
                checked={onlyApproved}
                onChange={() => setOnlyApproved(true)}
                className="text-indigo-600 focus:ring-indigo-500"
              />
              <div>
                <span className="font-bold text-slate-800">
                  Chỉ xuất các cảnh đã duyệt ({approvedCount}/{totalCount} cảnh)
                </span>
                <p className="text-[11px] text-slate-500">
                  Loại trừ các cảnh chưa đạt hoặc đang chờ sửa lại.
                </p>
              </div>
            </label>
          </div>

          {/* Included Files Breakdown */}
          <div className="space-y-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
              Gói ZIP xuất ra sẽ bao gồm:
            </span>

            <div className="grid grid-cols-2 gap-2">
              <div className="p-3 rounded-xl border border-slate-200 bg-slate-50 flex items-center gap-2.5">
                <FolderArchive className="w-4 h-4 text-indigo-600 shrink-0" />
                <div>
                  <div className="font-bold text-[11px]">Thư mục images/</div>
                  <div className="text-[10px] text-slate-500">Đánh số S001_...png chuẩn</div>
                </div>
              </div>

              <div className="p-3 rounded-xl border border-slate-200 bg-slate-50 flex items-center gap-2.5">
                <FileSpreadsheet className="w-4 h-4 text-emerald-600 shrink-0" />
                <div>
                  <div className="font-bold text-[11px]">mapping_voiceover.csv</div>
                  <div className="text-[10px] text-slate-500">Mapping khớp lời đọc</div>
                </div>
              </div>

              <div className="p-3 rounded-xl border border-slate-200 bg-slate-50 flex items-center gap-2.5">
                <FileText className="w-4 h-4 text-amber-600 shrink-0" />
                <div>
                  <div className="font-bold text-[11px]">prompts_list.txt</div>
                  <div className="text-[10px] text-slate-500">Prompt lưu trữ kỹ thuật</div>
                </div>
              </div>

              <div className="p-3 rounded-xl border border-slate-200 bg-slate-50 flex items-center gap-2.5">
                <Save className="w-4 h-4 text-blue-600 shrink-0" />
                <div>
                  <div className="font-bold text-[11px]">xe_chieu_project.json</div>
                  <div className="text-[10px] text-slate-500">Sao lưu mở lại dự án</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="p-5 border-t border-[#E4E7EC] bg-[#FAFAFA] flex items-center justify-between gap-3">
          <button
            onClick={() => {
              exportProjectJson();
              onClose();
            }}
            className="text-xs font-semibold text-slate-600 hover:text-slate-900 px-3 py-2 rounded-lg hover:bg-slate-200 flex items-center gap-1.5 transition-colors"
          >
            <Save className="w-3.5 h-3.5 text-slate-500" />
            <span>Sao lưu JSON</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-200 rounded-xl transition-colors"
            >
              Hủy
            </button>

            <button
              onClick={handleDownloadZip}
              disabled={isExporting}
              className="px-5 py-2.5 bg-[#4F46E5] hover:bg-[#4338CA] disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow-sm flex items-center gap-2 transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>{isExporting ? 'Đang nén file...' : 'Tải gói ZIP về máy'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
