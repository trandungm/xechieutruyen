import React, { useState } from 'react';
import {
  Sparkles,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Camera,
  Smile,
  Users,
  Box,
  Code2,
  History,
  Wand2,
  Trash2,
  Split,
  ChevronDown,
  ChevronUp,
  Clock,
  Timer,
} from 'lucide-react';
import { useStudio } from '../context/StudioContext';
import { ReviewStatus } from '../types';

export const InspectorPanel: React.FC = () => {
  const {
    scenes,
    selectedSceneId,
    updateScene,
    splitScene,
    deleteScene,
    setReviewStatus,
    generateSceneImage,
    editSceneImage,
    imageAssets,
    selectImageAsset,
    characters,
  } = useStudio();

  const [editInstruction, setEditInstruction] = useState('');
  const [showPromptDetails, setShowPromptDetails] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  const activeScene = scenes.find((s) => s.id === selectedSceneId);
  const currentAssets = activeScene ? imageAssets[activeScene.id] || [] : [];
  const selectedAsset = currentAssets.find((a) => a.id === activeScene?.selectedAssetId) || currentAssets[0];

  if (!activeScene) {
    return (
      <aside className="w-80 lg:w-88 bg-white border-l border-[#E4E7EC] p-6 flex flex-col items-center justify-center text-center text-slate-400">
        <Box className="w-8 h-8 text-slate-300 mb-2" />
        <p className="text-xs font-semibold text-slate-600">Chưa chọn cảnh nào</p>
        <p className="text-[11px] text-slate-400 mt-1">Bấm vào một thẻ phân cảnh để tinh chỉnh chi tiết.</p>
      </aside>
    );
  }

  // Quick preset edits
  const handleQuickEdit = (phrase: string) => {
    setEditInstruction((prev) => (prev ? `${prev}, ${phrase}` : phrase));
  };

  const handleRunEdit = () => {
    if (!editInstruction.trim()) return;
    editSceneImage(activeScene.id, editInstruction.trim());
    setEditInstruction('');
  };

  return (
    <aside className="w-80 lg:w-92 bg-white border-l border-[#E4E7EC] flex flex-col h-full shrink-0 select-text overflow-hidden">
      {/* Top Header of Inspector */}
      <div className="p-3.5 border-b border-[#E4E7EC] flex items-center justify-between bg-[#FAFAFA]">
        <div className="flex items-center gap-2">
          <span className="font-mono font-bold text-xs bg-[#281E17] text-[#E89659] px-2 py-0.5 rounded">
            S{String(activeScene.order).padStart(2, '0')}
          </span>
          <h3 className="font-bold text-xs text-[#18202B] uppercase tracking-wider">
            Chi Tiết Phân Cảnh
          </h3>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => splitScene(activeScene.id)}
            title="Tách cảnh thành 2 phân đoạn"
            className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-slate-100 rounded-md transition-colors"
          >
            <Split className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => deleteScene(activeScene.id)}
            title="Xóa cảnh này"
            className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-slate-100 rounded-md transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Scrollable Inspector Body */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Large Preview & Version Switcher */}
        <div>
          <div className="relative aspect-video rounded-xl bg-[#FAF7F2] border border-[#E4E7EC] overflow-hidden flex items-center justify-center mb-2">
            {selectedAsset ? (
              <img
                src={selectedAsset.dataUrl}
                alt={`Cảnh ${activeScene.order}`}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="text-center p-4">
                <Sparkles className="w-6 h-6 text-slate-300 mx-auto mb-1" />
                <span className="text-xs text-slate-500">Chưa tạo ảnh</span>
              </div>
            )}

            {/* Version indicator */}
            {selectedAsset && (
              <span className="absolute bottom-2 left-2 bg-black/70 backdrop-blur-xs text-white text-[10px] font-mono px-2 py-0.5 rounded">
                Phiên bản v{selectedAsset.version}
              </span>
            )}
          </div>

          {/* Action buttons under preview */}
          <div className="flex items-center justify-between gap-2">
            <button
              onClick={() => generateSceneImage(activeScene.id)}
              className="flex-1 py-1.5 bg-[#4F46E5] hover:bg-[#4338CA] text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-xs"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-200" />
              <span>{selectedAsset ? 'Tạo bản vẽ mới' : 'Tạo ảnh ngay'}</span>
            </button>

            {/* Quick status toggle */}
            <div className="flex items-center gap-1">
              <button
                onClick={() =>
                  setReviewStatus(
                    activeScene.id,
                    activeScene.reviewStatus === 'approved' ? 'unreviewed' : 'approved'
                  )
                }
                title="Duyệt hoặc bỏ duyệt"
                className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors ${
                  activeScene.reviewStatus === 'approved'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{activeScene.reviewStatus === 'approved' ? 'Đã duyệt' : 'Duyệt'}</span>
              </button>

              <button
                onClick={() =>
                  setReviewStatus(
                    activeScene.id,
                    activeScene.reviewStatus === 'needs_fix' ? 'unreviewed' : 'needs_fix'
                  )
                }
                title="Đánh dấu cần sửa"
                className={`p-1.5 rounded-lg text-xs transition-colors ${
                  activeScene.reviewStatus === 'needs_fix'
                    ? 'bg-rose-600 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <AlertCircle className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Scene Duration Slider */}
        <div className="p-3.5 bg-white rounded-xl border border-[#E4E7EC] shadow-2xs space-y-2.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[#C97645]" />
              <span>Thời lượng cảnh xuất video</span>
            </label>
            <div className="flex items-center gap-1">
              <span className="font-mono font-bold text-xs bg-indigo-50 text-indigo-700 px-2.5 py-0.5 rounded border border-indigo-200 tabular-nums">
                {(activeScene.durationSeconds || 5.0).toFixed(1)}s
              </span>
            </div>
          </div>

          {/* Slider input */}
          <div className="space-y-1">
            <input
              type="range"
              min={1}
              max={30}
              step={0.5}
              value={activeScene.durationSeconds || 5.0}
              onChange={(e) =>
                updateScene(activeScene.id, { durationSeconds: parseFloat(e.target.value) })
              }
              className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>1.0s</span>
              <span>10.0s</span>
              <span>20.0s</span>
              <span>30.0s</span>
            </div>
          </div>

          {/* Quick Preset Buttons */}
          <div className="flex items-center gap-1.5 pt-0.5">
            <span className="text-[10px] text-slate-400 mr-0.5">Đặt nhanh:</span>
            {[2.5, 4.0, 5.5, 8.0, 12.0].map((preset) => (
              <button
                key={preset}
                onClick={() => updateScene(activeScene.id, { durationSeconds: preset })}
                className={`px-2 py-0.5 rounded text-[10px] font-mono font-semibold transition-colors ${
                  activeScene.durationSeconds === preset
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {preset}s
              </button>
            ))}
          </div>

          {/* Sequence info */}
          <div className="text-[10px] text-[#667085] flex items-center justify-between pt-1.5 border-t border-slate-100">
            <span>Thời lượng ảnh xuất trên timeline dựng</span>
            <span className="font-mono font-medium text-slate-600">
              Tổng video: {scenes.reduce((acc, s) => acc + (s.durationSeconds || 5.0), 0).toFixed(1)}s
            </span>
          </div>
        </div>

        {/* Script Excerpt */}
        <div className="p-3 bg-[#FAF7F2] rounded-xl border border-[#EADBCC]">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#C97645] block mb-1">
            Lời đọc liên kết
          </span>
          <p className="text-xs text-[#1C1814] italic leading-relaxed">
            "{activeScene.scriptExcerpt}"
          </p>
        </div>

        {/* Action & Emotion */}
        <div className="space-y-3">
          <div>
            <label className="text-[11px] font-bold text-slate-700 block mb-1">
              Hành động cụ thể trong cảnh
            </label>
            <textarea
              value={activeScene.action}
              onChange={(e) => updateScene(activeScene.id, { action: e.target.value })}
              rows={2}
              className="w-full p-2 text-xs bg-[#F5F6F8] border border-[#E4E7EC] rounded-lg focus:outline-none focus:border-indigo-500 resize-none text-slate-900"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[11px] font-bold text-slate-700 block mb-1">
                Góc máy & Cỡ cảnh
              </label>
              <select
                value={activeScene.cameraAngle}
                onChange={(e) => updateScene(activeScene.id, { cameraAngle: e.target.value })}
                className="w-full p-1.5 text-xs bg-[#F5F6F8] border border-[#E4E7EC] rounded-lg font-medium text-slate-900"
              >
                <option value="Cận cảnh (close-up)">Cận cảnh (close-up)</option>
                <option value="Trung cảnh (medium shot)">Trung cảnh (medium shot)</option>
                <option value="Toàn cảnh (wide shot)">Toàn cảnh (wide shot)</option>
                <option value="Góc thấp chếch lên (low-angle)">Góc thấp chếch lên</option>
                <option value="Cận cảnh biểu tượng tĩnh">Cận cảnh biểu tượng tĩnh</option>
              </select>
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-700 block mb-1">
                Cảm xúc chủ đạo
              </label>
              <input
                type="text"
                value={activeScene.emotion}
                onChange={(e) => updateScene(activeScene.id, { emotion: e.target.value })}
                className="w-full p-1.5 text-xs bg-[#F5F6F8] border border-[#E4E7EC] rounded-lg text-slate-900"
              />
            </div>
          </div>
        </div>

        {/* Cast Selection */}
        <div>
          <label className="text-[11px] font-bold text-slate-700 block mb-1.5">
            Nhân vật có mặt trong cảnh
          </label>
          <div className="flex flex-wrap gap-1.5">
            {characters.map((char) => {
              const isPresent = activeScene.cast.includes(char.name);
              return (
                <button
                  key={char.id}
                  onClick={() => {
                    const newCast = isPresent
                      ? activeScene.cast.filter((name) => name !== char.name)
                      : [...activeScene.cast, char.name];
                    updateScene(activeScene.id, { cast: newCast });
                  }}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                    isPresent
                      ? 'bg-[#281E17] text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  <Users className="w-3 h-3 text-[#E89659]" />
                  <span>{char.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Props & Prop State */}
        <div>
          <label className="text-[11px] font-bold text-slate-700 block mb-1">
            Đạo cụ cốt lõi (ví dụ: hai đồng xu, bát sành mẻ)
          </label>
          <input
            type="text"
            placeholder="Phân tách bằng dấu phẩy..."
            value={activeScene.props.join(', ')}
            onChange={(e) =>
              updateScene(activeScene.id, {
                props: e.target.value
                  .split(',')
                  .map((p) => p.trim())
                  .filter(Boolean),
              })
            }
            className="w-full p-2 text-xs bg-[#F5F6F8] border border-[#E4E7EC] rounded-lg text-slate-900"
          />
        </div>

        {/* Natural Language Edit Box & Quick Tags */}
        <div className="p-3 bg-indigo-50/70 border border-indigo-100 rounded-xl space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-indigo-950 flex items-center gap-1">
              <Wand2 className="w-3.5 h-3.5 text-indigo-600" />
              <span>Chỉnh sửa tự nhiên</span>
            </span>
          </div>

          <p className="text-[11px] text-indigo-800/80">
            Mô tả điều bạn muốn tinh chỉnh trên ảnh nguồn (không làm mất phong cách 2D).
          </p>

          {/* Quick prompt buttons */}
          <div className="flex flex-wrap gap-1">
            {['Cận hơn', 'Đổi góc', 'Nền gọn hơn', 'Chỉ giữ 2 đồng xu', 'Bà mệt hơn'].map(
              (tag) => (
                <button
                  key={tag}
                  onClick={() => handleQuickEdit(tag)}
                  className="px-2 py-0.5 bg-white text-indigo-800 text-[10px] font-medium rounded border border-indigo-200 hover:bg-indigo-100 transition-colors"
                >
                  +{tag}
                </button>
              )
            )}
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Vd: Cháu gái nhìn lo lắng hơn, bỏ bớt chi tiết thừa..."
              value={editInstruction}
              onChange={(e) => setEditInstruction(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleRunEdit();
              }}
              className="flex-1 p-2 text-xs bg-white border border-indigo-200 rounded-lg text-slate-900 focus:outline-none focus:border-indigo-600"
            />
            <button
              onClick={handleRunEdit}
              disabled={!editInstruction.trim()}
              className="px-3 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-lg text-xs font-semibold transition-colors"
            >
              Sửa
            </button>
          </div>
        </div>

        {/* Collapsible: Image Version History */}
        <div className="border border-[#E4E7EC] rounded-xl overflow-hidden">
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="w-full p-2.5 bg-slate-50 flex items-center justify-between text-xs font-bold text-slate-700 hover:bg-slate-100"
          >
            <span className="flex items-center gap-1.5">
              <History className="w-3.5 h-3.5 text-slate-500" />
              <span>Lịch sử phiên bản ảnh ({currentAssets.length})</span>
            </span>
            {showHistory ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {showHistory && (
            <div className="p-2.5 space-y-2 bg-white">
              {currentAssets.length === 0 ? (
                <p className="text-[11px] text-slate-400 italic text-center py-2">
                  Chưa có phiên bản nào được tạo.
                </p>
              ) : (
                currentAssets.map((asset) => (
                  <div
                    key={asset.id}
                    onClick={() => selectImageAsset(activeScene.id, asset.id)}
                    className={`p-2 rounded-lg border flex items-center justify-between gap-2 cursor-pointer transition-colors ${
                      asset.id === selectedAsset?.id
                        ? 'border-indigo-600 bg-indigo-50/50'
                        : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <img src={asset.dataUrl} className="w-10 h-6 object-cover rounded" />
                      <div>
                        <div className="text-xs font-bold text-slate-800">
                          Phiên bản v{asset.version}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          {new Date(asset.createdAt).toLocaleTimeString()}
                        </div>
                      </div>
                    </div>
                    {asset.id === selectedAsset?.id && (
                      <span className="text-[10px] font-bold text-indigo-600 bg-white px-2 py-0.5 rounded border border-indigo-200">
                        Đang chọn
                      </span>
                    )}
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Collapsible: Technical Compiled Prompt */}
        <div className="border border-[#E4E7EC] rounded-xl overflow-hidden">
          <button
            onClick={() => setShowPromptDetails(!showPromptDetails)}
            className="w-full p-2.5 bg-slate-50 flex items-center justify-between text-xs font-bold text-slate-700 hover:bg-slate-100"
          >
            <span className="flex items-center gap-1.5">
              <Code2 className="w-3.5 h-3.5 text-slate-500" />
              <span>Prompt kỹ thuật đã biên dịch</span>
            </span>
            {showPromptDetails ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {showPromptDetails && (
            <div className="p-3 bg-white space-y-2">
              <textarea
                value={activeScene.compiledPrompt}
                onChange={(e) => updateScene(activeScene.id, { compiledPrompt: e.target.value })}
                rows={4}
                className="w-full p-2 text-[11px] font-mono bg-slate-50 border border-slate-200 rounded-lg text-slate-700 leading-relaxed"
              />
              <span className="text-[10px] text-slate-400 block">
                Prompt tự động kết hợp quy chuẩn nét vẽ Xế Chiều, hồ sơ nhân vật và đạo cụ.
              </span>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};
