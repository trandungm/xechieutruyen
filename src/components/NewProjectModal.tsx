import React, { useState } from 'react';
import {
  X,
  Sparkles,
  BookOpen,
  Film,
  Upload,
  RotateCcw,
  CheckCircle2,
  Layers,
  ArrowRight,
  ShieldCheck,
  MapPin,
  Users,
} from 'lucide-react';
import { useStudio } from '../context/StudioContext';
import { MOT_BUA_NO_SCRIPT } from '../data/sampleStory';
import { AspectRatio } from '../types';

interface NewProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NewProjectModal: React.FC<NewProjectModalProps> = ({ isOpen, onClose }) => {
  const { setProject, analyzeScript, loadSampleProject, isAnalyzing } = useStudio();

  const [title, setTitle] = useState('');
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('16:9');
  const [script, setScript] = useState('');

  if (!isOpen) return null;

  const detectedParagraphsCount = script
    .split(/\n+/)
    .filter((p) => p.trim().length > 0).length;

  const handleCreate = async () => {
    if (!script.trim() || isAnalyzing) return;

    setProject({
      id: `proj_${Date.now()}`,
      title: title.trim() || 'Dự án mới - Xế Chiều Studio',
      aspectRatio,
      scriptText: script.trim(),
      stylePresetId: 'preset_xe_chieu_2d',
      density: 'paragraph',
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    onClose();
    await analyzeScript(script.trim(), 'paragraph');
  };

  const handleLoadSample = () => {
    loadSampleProject();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl max-w-xl w-full border border-[#E4E7EC] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-5 border-b border-[#E4E7EC] flex items-center justify-between bg-[#FAFAFA]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#281E17] text-[#E89659] flex items-center justify-center font-black text-lg">
              X
            </div>
            <div>
              <h3 className="font-extrabold text-base text-[#18202B]">
                Tạo Dự Án Kịch Bản Mới
              </h3>
              <p className="text-xs text-[#667085]">
                Dán câu chuyện để AI tự động đếm từng đoạn và chia đủ số phân cảnh tương ứng
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
        <div className="p-6 space-y-4 text-xs text-slate-700 max-h-[75vh] overflow-y-auto">
          {/* Quick preset banner */}
          <div className="p-3.5 bg-[#FAF7F2] rounded-2xl border border-[#EADBCC] flex items-center justify-between gap-3">
            <div>
              <span className="font-bold text-slate-900 block text-xs">
                Kịch bản mẫu: Một bữa no (Nam Cao)
              </span>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Đã chuẩn bị sẵn hồ sơ 3 nhân vật và 5 phân cảnh chuẩn để trải nghiệm ngay.
              </p>
            </div>

            <button
              onClick={handleLoadSample}
              className="px-3 py-1.5 bg-[#281E17] hover:bg-[#3E2F24] text-white rounded-xl text-xs font-semibold shrink-0 transition-colors"
            >
              Nạp mẫu này
            </button>
          </div>

          {/* Form Fields */}
          <div className="space-y-3.5">
            <div>
              <label className="font-bold text-slate-800 block mb-1">Tên tác phẩm / kịch bản</label>
              <input
                type="text"
                placeholder="Vd: Lão Hạc, Chí Phèo, Chuyện làng Vũ Đại..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full p-2.5 bg-[#F5F6F8] border border-[#E4E7EC] rounded-xl text-xs text-slate-900 focus:outline-none focus:border-indigo-600"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-slate-800 block mb-1">Tỉ lệ khung hình</label>
                <select
                  value={aspectRatio}
                  onChange={(e) => setAspectRatio(e.target.value as any)}
                  className="w-full p-2.5 bg-[#F5F6F8] border border-[#E4E7EC] rounded-xl text-xs font-semibold text-slate-900"
                >
                  <option value="16:9">16:9 (Chuẩn YouTube ngang)</option>
                  <option value="9:16">9:16 (YouTube Shorts dọc)</option>
                  <option value="1:1">1:1 (Vuông mạng xã hội)</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-800 block mb-1">Quy tắc chia phân cảnh</label>
                <div className="p-2.5 bg-[#F0FDF4] border border-[#BBF7D0] rounded-xl text-xs text-[#166534] font-semibold flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Tự động: 1 đoạn văn = 1 phân cảnh</span>
                </div>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="font-bold text-slate-800">
                  Kịch bản câu chuyện (Dán văn bản)
                </label>
                {detectedParagraphsCount > 0 && (
                  <span className="font-mono text-[11px] font-bold text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded border border-indigo-200">
                    Phát hiện {detectedParagraphsCount} đoạn → Tự động tạo đúng {detectedParagraphsCount} cảnh
                  </span>
                )}
              </div>
              <textarea
                value={script}
                onChange={(e) => setScript(e.target.value)}
                rows={6}
                placeholder="Dán toàn bộ nội dung kịch bản văn học tiếng Việt tại đây (xuống dòng cho mỗi đoạn kể hoặc lời thoại)..."
                className="w-full p-3 bg-[#F5F6F8] border border-[#E4E7EC] rounded-xl text-xs text-slate-900 focus:outline-none focus:border-indigo-600 resize-none leading-relaxed"
              />

              {detectedParagraphsCount > 0 ? (
                <div className="mt-2 text-[11px] text-emerald-800 bg-emerald-50/90 p-2.5 rounded-xl border border-emerald-200 flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <p>
                    Hệ thống sẽ đọc toàn bộ kịch bản và tự động tạo đúng <strong>{detectedParagraphsCount} phân cảnh</strong> tương ứng khớp 100% từng đoạn lời đọc. Anh không cần tự đoán số cảnh!
                  </p>
                </div>
              ) : (
                <p className="mt-1.5 text-[11px] text-slate-400">
                  Mỗi lần bạn xuống dòng là một đoạn văn bản. Hệ thống sẽ tự động đếm và tạo đúng số phân cảnh tương ứng.
                </p>
              )}
            </div>

            {/* Next Steps Visual Preview */}
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
              <span className="text-[10px] uppercase font-bold text-slate-500 block">
                Quy trình tiếp theo sau khi bấm nút:
              </span>
              <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600">
                <div className="flex items-center gap-1.5">
                  <span className="w-4 h-4 rounded-full bg-indigo-100 text-indigo-700 text-[10px] font-bold flex items-center justify-center shrink-0">1</span>
                  <span>Đếm cảnh theo đoạn</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-4 h-4 rounded-full bg-amber-100 text-amber-700 text-[10px] font-bold flex items-center justify-center shrink-0">2</span>
                  <span>Chốt nhân vật truyện</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-bold flex items-center justify-center shrink-0">3</span>
                  <span>Chốt bối cảnh làng quê</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-4 h-4 rounded-full bg-purple-100 text-purple-700 text-[10px] font-bold flex items-center justify-center shrink-0">4</span>
                  <span>Tạo hình theo hàng chờ</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-5 border-t border-[#E4E7EC] bg-[#FAFAFA] flex items-center justify-between gap-2">
          <div className="text-[11px] text-slate-500 font-mono">
            {detectedParagraphsCount > 0 ? `${detectedParagraphsCount} phân cảnh dự kiến` : 'Chưa nhập kịch bản'}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-200 rounded-xl transition-colors"
            >
              Đóng
            </button>

            <button
              onClick={handleCreate}
              disabled={!script.trim() || isAnalyzing}
              className="px-5 py-2.5 bg-[#4F46E5] hover:bg-[#4338CA] disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow-sm flex items-center gap-2 transition-colors"
            >
              <Sparkles className="w-4 h-4 text-indigo-200" />
              <span>Phân tích & Khởi tạo dự án</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
