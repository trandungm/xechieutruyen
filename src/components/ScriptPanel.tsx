import React, { useState, useRef, useEffect } from 'react';
import {
  FileText,
  Sparkles,
  Upload,
  Search,
  CheckCircle,
  Hash,
  ChevronDown,
  Info,
} from 'lucide-react';
import { useStudio } from '../context/StudioContext';

export const ScriptPanel: React.FC = () => {
  const {
    project,
    setProject,
    scenes,
    selectedSceneId,
    setSelectedSceneId,
    activeParagraphIndex,
    setActiveParagraphIndex,
    analyzeScript,
    isAnalyzing,
  } = useStudio();

  const [searchTerm, setSearchTerm] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(project.scriptText);
  const [selectedDensity, setSelectedDensity] = useState<any>(project.density || 'paragraph');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const paragraphRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Split script text into paragraphs
  const paragraphs = project.scriptText.split(/\n+/).filter((p) => p.trim().length > 0);

  // Sync edited text if project script changes
  useEffect(() => {
    setEditedText(project.scriptText);
  }, [project.scriptText]);

  // Scroll to active paragraph when it changes
  useEffect(() => {
    if (activeParagraphIndex !== null && paragraphRefs.current[activeParagraphIndex]) {
      paragraphRefs.current[activeParagraphIndex]?.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
      });
    }
  }, [activeParagraphIndex]);

  // Handle file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        setEditedText(content);
        setProject((prev) => ({
          ...prev,
          scriptText: content,
          updatedAt: Date.now(),
        }));
      }
    };
    reader.readAsText(file);
  };

  const handleApplyEdit = () => {
    setProject((prev) => ({
      ...prev,
      scriptText: editedText,
      density: selectedDensity,
      updatedAt: Date.now(),
    }));
    setIsEditing(false);
  };

  return (
    <aside className="w-80 lg:w-88 bg-white border-r border-[#E4E7EC] flex flex-col h-full shrink-0 select-text overflow-hidden">
      {/* Top Header of Script Panel */}
      <div className="p-3.5 border-b border-[#E4E7EC] flex items-center justify-between bg-[#FAFAFA]">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-[#C97645]" />
          <h2 className="font-bold text-xs uppercase tracking-wider text-[#18202B]">
            Kịch Bản Gốc
          </h2>
          <span className="text-[11px] text-[#667085] font-mono">
            ({paragraphs.length} đoạn)
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => fileInputRef.current?.click()}
            title="Tải lên kịch bản TXT/MD"
            className="p-1.5 text-[#667085] hover:text-[#18202B] hover:bg-[#F0F2F5] rounded-md transition-colors"
          >
            <Upload className="w-3.5 h-3.5" />
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept=".txt,.md"
            className="hidden"
          />

          <button
            onClick={() => setIsEditing(!isEditing)}
            className={`px-2 py-1 text-[11px] font-semibold rounded-md transition-colors ${
              isEditing
                ? 'bg-indigo-600 text-white'
                : 'text-[#667085] hover:text-[#18202B] bg-slate-100'
            }`}
          >
            {isEditing ? 'Lưu bài' : 'Chỉnh sửa'}
          </button>
        </div>
      </div>

      {/* Search / Filter bar inside script */}
      <div className="p-2.5 border-b border-[#E4E7EC] bg-white">
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Tìm kiếm câu thoại, nhân vật..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#F5F6F8] pl-8 pr-3 py-1.5 text-xs text-[#18202B] rounded-lg border border-[#E4E7EC] focus:outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Script Content / Paragraphs list */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {isEditing ? (
          <div className="flex flex-col h-full space-y-3">
            <textarea
              value={editedText}
              onChange={(e) => setEditedText(e.target.value)}
              placeholder="Dán toàn bộ kịch bản câu chuyện tại đây..."
              className="w-full flex-1 min-h-[320px] p-3 text-xs leading-relaxed font-sans bg-[#FAF7F2] border border-[#E4E7EC] rounded-xl focus:outline-none focus:border-indigo-500 resize-none text-[#18202B]"
            />
            
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <div className="flex items-center justify-between text-xs text-slate-600">
                <span>Cơ chế phân cảnh:</span>
                <select
                  value={selectedDensity}
                  onChange={(e) => setSelectedDensity(e.target.value as any)}
                  className="bg-white border border-[#E4E7EC] text-xs font-semibold px-2 py-1 rounded-md"
                >
                  <option value="paragraph">Tự động: 1 đoạn = 1 cảnh</option>
                  <option value="auto">Tự động theo mạch truyện</option>
                  <option value="condensed">Gom các câu quá ngắn</option>
                </select>
              </div>
              <div className="text-[11px] text-indigo-700 bg-indigo-50/70 px-2.5 py-1 rounded-md">
                Phát hiện {editedText.split(/\n+/).filter((p) => p.trim().length > 0).length} đoạn văn → Tự động tạo số cảnh khớp 100%.
              </div>

              <div className="flex gap-2">
                <button
                  onClick={handleApplyEdit}
                  className="flex-1 py-1.5 bg-indigo-600 text-white rounded-lg text-xs font-semibold hover:bg-indigo-700"
                >
                  Xác nhận kịch bản
                </button>
                <button
                  onClick={() => {
                    setEditedText(project.scriptText);
                    setIsEditing(false);
                  }}
                  className="px-3 py-1.5 bg-slate-100 text-slate-700 rounded-lg text-xs font-medium hover:bg-slate-200"
                >
                  Hủy
                </button>
              </div>
            </div>
          </div>
        ) : (
          paragraphs.map((para, idx) => {
            const isMatch = searchTerm && para.toLowerCase().includes(searchTerm.toLowerCase());
            const isSelected = activeParagraphIndex === idx;

            // Find scenes linked to this paragraph
            const linkedScenes = scenes.filter((s) => s.paragraphIndex === idx);

            return (
              <div
                key={idx}
                ref={(el) => {
                  paragraphRefs.current[idx] = el;
                }}
                onClick={() => {
                  setActiveParagraphIndex(idx);
                  if (linkedScenes.length > 0) {
                    setSelectedSceneId(linkedScenes[0].id);
                  }
                }}
                className={`p-3 rounded-xl border text-xs leading-relaxed transition-all cursor-pointer relative ${
                  isSelected
                    ? 'bg-[#FAF0E6] border-[#C97645] text-[#18202B] shadow-xs'
                    : isMatch
                    ? 'bg-amber-50 border-amber-300 text-slate-800'
                    : 'bg-white border-[#E4E7EC] text-slate-600 hover:border-slate-300 hover:bg-[#FAFAFA]'
                }`}
              >
                {/* Paragraph header badge */}
                <div className="flex items-center justify-between mb-1.5 text-[10px]">
                  <span className="font-mono text-slate-600 font-semibold">
                    Đoạn {idx + 1}
                  </span>

                  <div className="flex items-center gap-1">
                    {linkedScenes.map((s) => (
                      <span
                        key={s.id}
                        className={`px-1.5 py-0.5 rounded font-mono font-bold text-[9px] ${
                          s.id === selectedSceneId
                            ? 'bg-[#C97645] text-white'
                            : 'bg-slate-200 text-slate-700'
                        }`}
                      >
                        S{String(s.order).padStart(2, '0')}
                      </span>
                    ))}
                    {linkedScenes.length === 0 && (
                      <span className="text-[10px] text-amber-600 italic">Chưa có cảnh</span>
                    )}
                  </div>
                </div>

                <p className="font-normal text-[#1C1814]">{para}</p>
              </div>
            );
          })
        )}
      </div>

      {/* Bottom Action: Analyze & Break down scenes */}
      <div className="p-3 border-t border-[#E4E7EC] bg-[#FAF7F2]">
        <button
          onClick={() => analyzeScript()}
          disabled={isAnalyzing}
          className="w-full flex items-center justify-center gap-2 py-2.5 px-3 bg-[#281E17] hover:bg-[#3E2F24] disabled:opacity-50 text-white rounded-xl text-xs font-semibold shadow-xs transition-all"
        >
          <Sparkles className={`w-3.5 h-3.5 text-[#E89659] ${isAnalyzing ? 'animate-spin' : ''}`} />
          <span>{isAnalyzing ? 'Đang phân tích kịch bản...' : 'Phân tích & Chia cảnh tự động'}</span>
        </button>
        <div className="mt-1.5 text-[10px] text-center text-[#667085]">
          Nhận diện nhân vật, bối cảnh và chia cảnh liên kết chuẩn
        </div>
      </div>
    </aside>
  );
};
