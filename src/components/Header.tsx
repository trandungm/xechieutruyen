import React from 'react';
import {
  Film,
  Users,
  MapPin,
  Palette,
  Layers,
  Download,
  Play,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  Clock,
  Settings,
  ShieldCheck,
} from 'lucide-react';
import { useStudio } from '../context/StudioContext';

interface HeaderProps {
  onOpenExportModal: () => void;
  onOpenNewProjectModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenExportModal,
  onOpenNewProjectModal,
}) => {
  const {
    project,
    activeTab,
    setActiveTab,
    scenes,
    characters,
    locations,
    queue,
    isQueueOpen,
    setIsQueueOpen,
    setIsReviewSetupOpen,
    selectedSceneIds,
    generateSelectedScenes,
    loadSampleProject,
    lastSavedAt,
    backendHealth,
  } = useStudio();

  const queuedCount = queue.filter((t) => t.state === 'queued' || t.state === 'running').length;
  const isRunning = queue.some((t) => t.state === 'running');
  const approvedCount = scenes.filter((s) => s.reviewStatus === 'approved').length;

  return (
    <header className="h-16 bg-white border-b border-[#E4E7EC] px-4 lg:px-6 flex items-center justify-between shrink-0 select-none sticky top-0 z-30">
      {/* Brand & Project Info */}
      <div className="flex items-center gap-4">
        {/* Logo Brand Xế Chiều */}
        <div className="flex items-center gap-2.5 cursor-pointer" onClick={onOpenNewProjectModal}>
          <div className="w-9 h-9 rounded-xl bg-[#281E17] text-[#E89659] flex items-center justify-center font-black text-lg shadow-sm border border-[#3E2F24]">
            X
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-[15px] tracking-tight text-[#18202B]">
                Xế Chiều Studio
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-[#FAF0E6] text-[#C97645] px-1.5 py-0.5 rounded border border-[#F3D7C0]">
                2D Hoạt Hình
              </span>
            </div>
            <div className="text-[11px] text-[#667085] truncate max-w-[190px] font-medium">
              {project.title}
            </div>
          </div>
        </div>

        <div className="h-5 w-[1px] bg-[#E4E7EC] hidden sm:block" />

        {/* Saved Status & Aspect Ratio */}
        <div className="hidden sm:flex items-center gap-3 text-xs text-[#667085]">
          <span className="flex items-center gap-1 font-mono text-[11px] text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
            {project.aspectRatio}
          </span>
          <span className="flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Đã tự động lưu</span>
          </span>
        </div>
      </div>

      {/* Primary Navigation Tabs */}
      <nav className="flex items-center gap-1 bg-[#F5F6F8] p-1 rounded-xl border border-[#E4E7EC]">
        <button
          onClick={() => setActiveTab('storyboard')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            activeTab === 'storyboard'
              ? 'bg-white text-indigo-700 shadow-sm'
              : 'text-[#667085] hover:text-[#18202B]'
          }`}
        >
          <Film className="w-3.5 h-3.5" />
          <span>Cảnh</span>
          <span className="font-mono text-[10px] text-slate-500">
            {approvedCount}/{scenes.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('characters')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            activeTab === 'characters'
              ? 'bg-white text-indigo-700 shadow-sm'
              : 'text-[#667085] hover:text-[#18202B]'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>Nhân vật</span>
          <span className="font-mono text-[10px] text-slate-500">{characters.length}</span>
        </button>

        <button
          onClick={() => setActiveTab('locations')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            activeTab === 'locations'
              ? 'bg-white text-indigo-700 shadow-sm'
              : 'text-[#667085] hover:text-[#18202B]'
          }`}
        >
          <MapPin className="w-3.5 h-3.5" />
          <span>Bối cảnh</span>
          <span className="font-mono text-[10px] text-slate-500">{locations.length}</span>
        </button>

        <button
          onClick={() => setActiveTab('style')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            activeTab === 'style'
              ? 'bg-white text-indigo-700 shadow-sm'
              : 'text-[#667085] hover:text-[#18202B]'
          }`}
        >
          <Palette className="w-3.5 h-3.5" />
          <span>Phong cách</span>
        </button>
      </nav>

      {/* Right Actions */}
      <div className="flex items-center gap-2">
        {/* Review & Lock-in Design */}
        <button
          onClick={() => setIsReviewSetupOpen(true)}
          title="Xem lại số phân cảnh, chốt nhân vật và bối cảnh"
          className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 text-xs text-amber-900 bg-amber-50 hover:bg-amber-100 rounded-lg border border-amber-200 transition-colors font-semibold"
        >
          <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
          <span>Chốt thiết kế</span>
        </button>

        {/* Sample Reset */}
        <button
          onClick={loadSampleProject}
          title="Tải lại kịch bản mẫu Một bữa no"
          className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 text-xs text-[#667085] hover:text-[#18202B] hover:bg-[#F5F6F8] rounded-lg border border-[#E4E7EC] transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5 text-[#C97645]" />
          <span>Mẫu Một bữa no</span>
        </button>

        {/* Selected Batch Generate */}
        {selectedSceneIds.length > 0 && (
          <button
            onClick={generateSelectedScenes}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200 rounded-lg transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Tạo ({selectedSceneIds.length})</span>
          </button>
        )}

        {/* Queue Drawer Trigger */}
        <button
          onClick={() => setIsQueueOpen(!isQueueOpen)}
          className={`relative flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
            isQueueOpen
              ? 'bg-[#18202B] text-white border-[#18202B]'
              : 'bg-white text-[#18202B] border-[#E4E7EC] hover:bg-[#F5F6F8]'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Hàng chờ</span>
          {queuedCount > 0 && (
            <span
              className={`flex items-center justify-center min-w-4 h-4 px-1 rounded-full text-[10px] font-mono text-white ${
                isRunning ? 'bg-indigo-600 animate-pulse' : 'bg-[#C97645]'
              }`}
            >
              {queuedCount}
            </span>
          )}
        </button>

        {/* Export Resource Pack */}
        <button
          onClick={onOpenExportModal}
          className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#4F46E5] hover:bg-[#4338CA] text-white text-xs font-semibold rounded-lg shadow-sm transition-colors"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Xuất tư liệu</span>
        </button>
      </div>
    </header>
  );
};
