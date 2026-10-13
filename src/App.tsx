import React, { useState } from 'react';
import { StudioProvider, useStudio } from './context/StudioContext';
import { Header } from './components/Header';
import { ScriptPanel } from './components/ScriptPanel';
import { StoryboardPanel } from './components/StoryboardPanel';
import { InspectorPanel } from './components/InspectorPanel';
import { CharacterManager } from './components/CharacterManager';
import { LocationManager } from './components/LocationManager';
import { StylePresetView } from './components/StylePresetView';
import { QueueDrawer } from './components/QueueDrawer';
import { ExportModal } from './components/ExportModal';
import { NewProjectModal } from './components/NewProjectModal';
import { ReviewSetupModal } from './components/ReviewSetupModal';

function StudioWorkspace() {
  const { activeTab } = useStudio();
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isNewProjectModalOpen, setIsNewProjectModalOpen] = useState(false);

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-[#F5F6F8]">
      {/* Top Header */}
      <Header
        onOpenExportModal={() => setIsExportModalOpen(true)}
        onOpenNewProjectModal={() => setIsNewProjectModalOpen(true)}
      />

      {/* Main Studio Viewport */}
      <div className="flex-1 flex overflow-hidden min-h-0 relative">
        {activeTab === 'storyboard' && (
          <div className="flex-1 flex w-full h-full overflow-hidden">
            {/* Left 1: Script & Text linkage */}
            <ScriptPanel />

            {/* Center: Storyboard & 16:9 previews */}
            <StoryboardPanel />

            {/* Right: Scene Inspector & Prompt fine-tuning */}
            <InspectorPanel />
          </div>
        )}

        {activeTab === 'characters' && <CharacterManager />}

        {activeTab === 'locations' && <LocationManager />}

        {activeTab === 'style' && <StylePresetView />}
      </div>

      {/* Background Server Queue Drawer */}
      <QueueDrawer />

      {/* Modals */}
      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
      />

      <NewProjectModal
        isOpen={isNewProjectModalOpen}
        onClose={() => setIsNewProjectModalOpen(false)}
      />

      {/* Guided Review Step: Đếm phân cảnh, Chốt nhân vật & Bối cảnh */}
      <ReviewSetupModal />

      {/* Script Analysis Progress Overlay */}
      <AnalysisOverlay />
    </div>
  );
}

function AnalysisOverlay() {
  const { isAnalyzing, project } = useStudio();
  if (!isAnalyzing) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 text-center border border-[#E4E7EC] shadow-2xl space-y-4">
        <div className="w-14 h-14 rounded-2xl bg-[#281E17] text-[#E89659] flex items-center justify-center mx-auto shadow-md border border-[#3E2F24]">
          <div className="w-6 h-6 border-3 border-[#E89659] border-t-transparent rounded-full animate-spin" />
        </div>

        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#C97645] bg-[#FAF0E6] px-2.5 py-0.5 rounded-full border border-[#F3D7C0]">
            AI Studio Đang Phân Tích
          </span>
          <h3 className="text-base font-extrabold text-slate-900 mt-1.5">
            Đang phân tích kịch bản "{project.title || 'Xế Chiều Studio'}"
          </h3>
          <p className="text-xs text-slate-500 mt-1 leading-relaxed">
            Hệ thống đang đọc toàn bộ câu chuyện, tự động đếm từng đoạn văn để chia đúng số phân cảnh tương ứng...
          </p>
        </div>

        <div className="space-y-2.5 text-left bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs">
          <div className="flex items-center gap-2.5 text-indigo-700 font-bold">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-600 animate-ping" />
            <span>1. Đang đếm phân cảnh theo từng đoạn văn</span>
          </div>
          <div className="flex items-center gap-2.5 text-slate-600 font-medium">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
            <span>2. Đang trích xuất nhân vật & đặc điểm 2D</span>
          </div>
          <div className="flex items-center gap-2.5 text-slate-600 font-medium">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
            <span>3. Đang nhận diện bối cảnh làng quê & đạo cụ</span>
          </div>
        </div>

        <p className="text-[11px] text-slate-400 italic">
          Bảng chốt dữ liệu 4 bước sẽ tự động mở ngay sau khi phân tích xong!
        </p>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <StudioProvider>
      <StudioWorkspace />
    </StudioProvider>
  );
}
