import React from 'react';
import {
  Grid,
  List,
  CheckCircle2,
  AlertCircle,
  Clock,
  Sparkles,
  Split,
  Merge,
  Trash2,
  RefreshCw,
  Plus,
  Play,
  Layers,
  Filter,
  CheckSquare,
  Square,
  Eye,
} from 'lucide-react';
import { useStudio } from '../context/StudioContext';
import { Scene, ReviewStatus } from '../types';

export const StoryboardPanel: React.FC = () => {
  const {
    scenes,
    imageAssets,
    selectedSceneId,
    setSelectedSceneId,
    selectedSceneIds,
    toggleSelectScene,
    selectAllScenes,
    clearSelection,
    filterStatus,
    setFilterStatus,
    viewMode,
    setViewMode,
    generateSceneImage,
    generateSelectedScenes,
    generateAllScenes,
    splitScene,
    mergeScene,
    deleteScene,
    setReviewStatus,
    queue,
    project,
  } = useStudio();

  // Filter scenes
  const filteredScenes = scenes.filter((scene) => {
    if (filterStatus === 'all') return true;
    return scene.reviewStatus === filterStatus;
  });

  const allSelected = scenes.length > 0 && selectedSceneIds.length === scenes.length;

  return (
    <main className="flex-1 flex flex-col h-full min-w-0 bg-[#F5F6F8] overflow-hidden select-none">
      {/* Top Filter & Bulk Action Bar */}
      <div className="h-12 border-b border-[#E4E7EC] bg-white px-4 flex items-center justify-between shrink-0">
        {/* Left: Filter tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto py-1">
          <button
            onClick={() => setFilterStatus('all')}
            className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-colors ${
              filterStatus === 'all'
                ? 'bg-[#18202B] text-white'
                : 'text-[#667085] hover:text-[#18202B] hover:bg-[#F5F6F8]'
            }`}
          >
            Tất cả ({scenes.length})
          </button>

          <button
            onClick={() => setFilterStatus('unreviewed')}
            className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-colors ${
              filterStatus === 'unreviewed'
                ? 'bg-amber-600 text-white'
                : 'text-[#667085] hover:text-[#18202B] hover:bg-[#F5F6F8]'
            }`}
          >
            Chưa duyệt ({scenes.filter((s) => s.reviewStatus === 'unreviewed').length})
          </button>

          <button
            onClick={() => setFilterStatus('approved')}
            className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-colors ${
              filterStatus === 'approved'
                ? 'bg-emerald-600 text-white'
                : 'text-[#667085] hover:text-[#18202B] hover:bg-[#F5F6F8]'
            }`}
          >
            Đã duyệt ({scenes.filter((s) => s.reviewStatus === 'approved').length})
          </button>

          <button
            onClick={() => setFilterStatus('needs_fix')}
            className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-colors ${
              filterStatus === 'needs_fix'
                ? 'bg-rose-600 text-white'
                : 'text-[#667085] hover:text-[#18202B] hover:bg-[#F5F6F8]'
            }`}
          >
            Cần sửa ({scenes.filter((s) => s.reviewStatus === 'needs_fix').length})
          </button>
        </div>

        {/* Right: Total duration & Select all & View Mode toggle */}
        <div className="flex items-center gap-2">
          {/* Total Video Duration Metric */}
          <div className="hidden lg:flex items-center gap-1.5 text-xs text-slate-600 font-medium bg-[#F5F6F8] px-2.5 py-1 rounded-lg border border-[#E4E7EC]">
            <Clock className="w-3.5 h-3.5 text-[#C97645]" />
            <span>Tổng thời lượng:</span>
            <span className="font-mono font-bold text-slate-900 tabular-nums">
              {scenes.reduce((acc, s) => acc + (s.durationSeconds || 5.0), 0).toFixed(1)}s
            </span>
          </div>

          <div className="h-4 w-[1px] bg-slate-200 hidden lg:block" />

          {/* Select all toggle */}
          <button
            onClick={allSelected ? clearSelection : selectAllScenes}
            className="flex items-center gap-1.5 text-xs text-[#667085] hover:text-[#18202B] px-2 py-1 rounded hover:bg-slate-100"
          >
            {allSelected ? (
              <CheckSquare className="w-3.5 h-3.5 text-indigo-600" />
            ) : (
              <Square className="w-3.5 h-3.5" />
            )}
            <span className="hidden sm:inline">{allSelected ? 'Bỏ chọn' : 'Chọn tất cả'}</span>
          </button>

          <div className="h-4 w-[1px] bg-slate-200" />

          {/* Grid vs List toggle */}
          <div className="flex items-center bg-[#F5F6F8] p-0.5 rounded-lg border border-[#E4E7EC]">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1 rounded ${
                viewMode === 'grid' ? 'bg-white shadow-xs text-indigo-600' : 'text-slate-500'
              }`}
            >
              <Grid className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1 rounded ${
                viewMode === 'list' ? 'bg-white shadow-xs text-indigo-600' : 'text-slate-500'
              }`}
            >
              <List className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Bulk Operations Sticky Toolbar if multiple selected */}
      {selectedSceneIds.length > 0 && (
        <div className="bg-indigo-900 text-white px-4 py-2 flex items-center justify-between text-xs animate-in fade-in duration-150">
          <div className="flex items-center gap-2">
            <span className="font-bold">Đã chọn {selectedSceneIds.length} cảnh</span>
            <span className="text-indigo-200">|</span>
            <button
              onClick={() => {
                selectedSceneIds.forEach((id) => setReviewStatus(id, 'approved'));
                clearSelection();
              }}
              className="text-xs hover:underline text-emerald-300"
            >
              Duyệt nhanh tất cả
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={generateSelectedScenes}
              className="px-3 py-1 bg-white text-indigo-900 rounded font-semibold hover:bg-indigo-50 flex items-center gap-1.5"
            >
              <Sparkles className="w-3 h-3 text-indigo-600" />
              <span>Tạo ảnh các cảnh đã chọn</span>
            </button>
            <button
              onClick={clearSelection}
              className="px-2 py-1 text-indigo-200 hover:text-white"
            >
              Bỏ chọn
            </button>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-4 lg:p-6">
        {filteredScenes.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-8 text-slate-400">
            <AlertCircle className="w-10 h-10 stroke-1 text-slate-300 mb-2" />
            <h3 className="font-semibold text-slate-700 text-sm">Không có cảnh nào phù hợp bộ lọc</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm">
              Hãy chọn bộ lọc "Tất cả" hoặc tạo cảnh mới từ kịch bản ở thanh bên trái.
            </p>
          </div>
        ) : viewMode === 'grid' ? (
          /* Grid View (16:9 cards) */
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-5">
            {filteredScenes.map((scene) => (
              <SceneCard
                key={scene.id}
                scene={scene}
                isSelected={selectedSceneId === scene.id}
                isChecked={selectedSceneIds.includes(scene.id)}
                onSelect={() => setSelectedSceneId(scene.id)}
                onToggleCheck={() => toggleSelectScene(scene.id)}
                onGenerate={() => generateSceneImage(scene.id)}
                onSplit={() => splitScene(scene.id)}
                onMerge={() => mergeScene(scene.id)}
                onDelete={() => deleteScene(scene.id)}
                onSetStatus={(st) => setReviewStatus(scene.id, st)}
                assets={imageAssets[scene.id] || []}
                isTaskRunning={queue.some((t) => t.sceneId === scene.id && t.state === 'running')}
                isTaskQueued={queue.some((t) => t.sceneId === scene.id && t.state === 'queued')}
              />
            ))}
          </div>
        ) : (
          /* List View */
          <div className="space-y-2">
            {filteredScenes.map((scene) => (
              <SceneListRow
                key={scene.id}
                scene={scene}
                isSelected={selectedSceneId === scene.id}
                isChecked={selectedSceneIds.includes(scene.id)}
                onSelect={() => setSelectedSceneId(scene.id)}
                onToggleCheck={() => toggleSelectScene(scene.id)}
                onGenerate={() => generateSceneImage(scene.id)}
                onSetStatus={(st) => setReviewStatus(scene.id, st)}
                assets={imageAssets[scene.id] || []}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  );
};

// Sub-component: Scene Card (16:9)
interface SceneCardProps {
  scene: Scene;
  isSelected: boolean;
  isChecked: boolean;
  onSelect: () => void;
  onToggleCheck: () => void;
  onGenerate: () => void;
  onSplit: () => void;
  onMerge: () => void;
  onDelete: () => void;
  onSetStatus: (status: ReviewStatus) => void;
  assets: any[];
  isTaskRunning: boolean;
  isTaskQueued: boolean;
}

const SceneCard: React.FC<SceneCardProps> = ({
  scene,
  isSelected,
  isChecked,
  onSelect,
  onToggleCheck,
  onGenerate,
  onSplit,
  onMerge,
  onDelete,
  onSetStatus,
  assets,
  isTaskRunning,
  isTaskQueued,
}) => {
  const currentAsset = assets.find((a) => a.id === scene.selectedAssetId) || assets[0];

  return (
    <div
      onClick={onSelect}
      className={`group bg-white rounded-2xl border transition-all cursor-pointer overflow-hidden flex flex-col ${
        isSelected
          ? 'border-indigo-600 ring-2 ring-indigo-500/20 shadow-md'
          : 'border-[#E4E7EC] hover:border-slate-300 hover:shadow-sm'
      }`}
    >
      {/* 16:9 Image Preview Area */}
      <div className="relative aspect-video bg-[#FAF7F2] border-b border-[#E4E7EC] overflow-hidden flex items-center justify-center">
        {currentAsset ? (
          <img
            src={currentAsset.dataUrl}
            alt={`Cảnh ${scene.order}`}
            className="w-full h-full object-cover"
          />
        ) : (
          /* Empty placeholder (No fake generated images) */
          <div className="flex flex-col items-center justify-center p-4 text-center">
            <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 mb-2">
              <Sparkles className="w-5 h-5" />
            </div>
            <span className="text-xs font-semibold text-slate-600">Chưa có ảnh</span>
            <span className="text-[11px] text-slate-400 mt-0.5 line-clamp-1 max-w-[200px]">
              {scene.action}
            </span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onGenerate();
              }}
              className="mt-2.5 px-3 py-1 bg-[#281E17] hover:bg-[#3E2F24] text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Sparkles className="w-3 h-3 text-[#E89659]" />
              <span>Tạo ảnh cảnh này</span>
            </button>
          </div>
        )}

        {/* Top Badges Overlay */}
        <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between pointer-events-none">
          {/* Checkbox & Order badge */}
          <div className="flex items-center gap-1.5 pointer-events-auto">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleCheck();
              }}
              className="w-6 h-6 rounded bg-black/60 backdrop-blur-xs flex items-center justify-center text-white hover:bg-black/80 transition-colors"
            >
              {isChecked ? (
                <CheckSquare className="w-3.5 h-3.5 text-indigo-400" />
              ) : (
                <Square className="w-3.5 h-3.5" />
              )}
            </button>

            <span className="bg-black/75 backdrop-blur-xs text-white font-mono text-[11px] font-bold px-2 py-0.5 rounded">
              S{String(scene.order).padStart(2, '0')}
            </span>

            <span className="bg-black/60 backdrop-blur-xs text-amber-200 font-mono text-[10px] font-semibold px-1.5 py-0.5 rounded flex items-center gap-1">
              <Clock className="w-2.5 h-2.5" />
              <span>{(scene.durationSeconds || 5.0).toFixed(1)}s</span>
            </span>

            {scene.kind === 'commentary' && (
              <span className="bg-amber-600/90 text-white text-[10px] font-semibold px-1.5 py-0.5 rounded">
                Bình luận
              </span>
            )}
          </div>

          {/* Review Status badge */}
          <div className="pointer-events-auto">
            {scene.reviewStatus === 'approved' && (
              <span className="bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1 shadow-xs">
                <CheckCircle2 className="w-3 h-3" />
                <span>Đã duyệt</span>
              </span>
            )}
            {scene.reviewStatus === 'needs_fix' && (
              <span className="bg-rose-600 text-white text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1 shadow-xs">
                <AlertCircle className="w-3 h-3" />
                <span>Cần sửa</span>
              </span>
            )}
            {scene.reviewStatus === 'unreviewed' && (
              <span className="bg-amber-600 text-white text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1 shadow-xs">
                <Clock className="w-3 h-3" />
                <span>Chưa duyệt</span>
              </span>
            )}
          </div>
        </div>

        {/* Task Running Indicator */}
        {(isTaskRunning || isTaskQueued) && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex flex-col items-center justify-center text-white">
            <div className="w-8 h-8 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin mb-2" />
            <span className="text-xs font-semibold">
              {isTaskRunning ? 'Đang vẽ ảnh 2D...' : 'Trong hàng chờ...'}
            </span>
          </div>
        )}
      </div>

      {/* Card Body */}
      <div className="p-3.5 flex flex-col flex-1 justify-between gap-2.5">
        {/* Action description & voiceover quote */}
        <div>
          <h4 className="text-xs font-bold text-[#18202B] line-clamp-1 mb-1">
            {scene.action}
          </h4>
          <p className="text-[11px] text-[#667085] line-clamp-2 italic leading-relaxed">
            "{scene.scriptExcerpt}"
          </p>
        </div>

        {/* Metadata Footer: Cast & Props */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
          <div className="flex items-center gap-1 truncate max-w-[190px]">
            <span className="font-semibold text-slate-700 truncate">
              {scene.cast.join(', ') || 'Chưa gán diễn viên'}
            </span>
          </div>

          {/* Quick Review Buttons */}
          <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
            {scene.reviewStatus !== 'approved' && (
              <button
                onClick={() => onSetStatus('approved')}
                title="Duyệt cảnh này"
                className="p-1 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded transition-colors"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
              </button>
            )}
            {scene.reviewStatus !== 'needs_fix' && (
              <button
                onClick={() => onSetStatus('needs_fix')}
                title="Đánh dấu cần sửa"
                className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors"
              >
                <AlertCircle className="w-3.5 h-3.5" />
              </button>
            )}
            <button
              onClick={onGenerate}
              title="Tạo lại ảnh"
              className="p-1 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Sub-component: Scene List Row (for list view)
interface SceneListRowProps {
  scene: Scene;
  isSelected: boolean;
  isChecked: boolean;
  onSelect: () => void;
  onToggleCheck: () => void;
  onGenerate: () => void;
  onSetStatus: (status: ReviewStatus) => void;
  assets: any[];
}

const SceneListRow: React.FC<SceneListRowProps> = ({
  scene,
  isSelected,
  isChecked,
  onSelect,
  onToggleCheck,
  onGenerate,
  onSetStatus,
  assets,
}) => {
  const currentAsset = assets.find((a) => a.id === scene.selectedAssetId) || assets[0];

  return (
    <div
      onClick={onSelect}
      className={`p-2.5 rounded-xl bg-white border flex items-center justify-between gap-4 cursor-pointer transition-all ${
        isSelected ? 'border-indigo-600 ring-1 ring-indigo-500' : 'border-[#E4E7EC] hover:bg-slate-50'
      }`}
    >
      <div className="flex items-center gap-3">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleCheck();
          }}
          className="text-slate-400 hover:text-indigo-600"
        >
          {isChecked ? (
            <CheckSquare className="w-4 h-4 text-indigo-600" />
          ) : (
            <Square className="w-4 h-4" />
          )}
        </button>

        <span className="font-mono text-xs font-bold text-slate-800 w-8">
          S{String(scene.order).padStart(2, '0')}
        </span>

        <span className="font-mono text-[10px] text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded flex items-center gap-1 shrink-0">
          <Clock className="w-2.5 h-2.5 text-[#C97645]" />
          <span>{(scene.durationSeconds || 5.0).toFixed(1)}s</span>
        </span>

        {/* Thumbnail */}
        <div className="w-16 h-10 rounded-lg bg-slate-100 overflow-hidden shrink-0 border border-slate-200 flex items-center justify-center">
          {currentAsset ? (
            <img src={currentAsset.dataUrl} className="w-full h-full object-cover" />
          ) : (
            <span className="text-[9px] text-slate-400">Trống</span>
          )}
        </div>

        <div>
          <div className="text-xs font-bold text-slate-900">{scene.action}</div>
          <div className="text-[11px] text-slate-500 line-clamp-1 italic max-w-md">
            "{scene.scriptExcerpt}"
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <span className="text-[11px] text-slate-600 font-medium hidden md:inline">
          {scene.cast.join(', ')}
        </span>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onGenerate();
          }}
          className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded-lg text-xs font-semibold flex items-center gap-1"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Tạo ảnh</span>
        </button>
      </div>
    </div>
  );
};
