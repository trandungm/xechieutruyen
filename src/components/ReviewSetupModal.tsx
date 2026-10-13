import React, { useState, useEffect } from 'react';
import {
  CheckCircle2,
  Users,
  MapPin,
  Film,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  Clock,
  Layers,
  Plus,
  Trash2,
  Check,
  X,
  Code2,
  RefreshCw,
  Info,
  Sliders,
  Search,
  Camera,
  Play,
  FileText,
} from 'lucide-react';
import { useStudio } from '../context/StudioContext';
import { Character, LocationItem, Scene } from '../types';

type SetupStep = 'scenes_count' | 'characters' | 'locations' | 'prompts';

export const ReviewSetupModal: React.FC = () => {
  const {
    isReviewSetupOpen,
    setIsReviewSetupOpen,
    project,
    scenes,
    characters,
    locations,
    generateSceneImage,
    generateAllScenes,
    updateCharacter,
    addCharacter,
    deleteCharacter,
    updateLocation,
    addLocation,
    deleteLocation,
    updateScene,
    recompileAllPrompts,
    compilePromptForScene,
  } = useStudio();

  // 4 sequential steps as requested by user
  const [currentStep, setCurrentStep] = useState<SetupStep>('scenes_count');

  // Confirmed IDs state: initialize with all character and location IDs confirmed by default
  const [confirmedCharIds, setConfirmedCharIds] = useState<Set<string>>(new Set());
  const [confirmedLocIds, setConfirmedLocIds] = useState<Set<string>>(new Set());

  // Generation options at final step
  const [autoQueueMode, setAutoQueueMode] = useState<'first_two' | 'all' | 'manual'>('first_two');

  // Search filter inside scene breakdown (Step 1)
  const [sceneSearch, setSceneSearch] = useState('');

  // Editing state for new character / new location
  const [isAddingChar, setIsAddingChar] = useState(false);
  const [newCharName, setNewCharName] = useState('');
  const [newCharRole, setNewCharRole] = useState('Nhân vật phụ');
  const [newCharColor, setNewCharColor] = useState('Nâu sồng');
  const [newCharTraits, setNewCharTraits] = useState('Đầu to nửa thân, nét mực đen thô, áo nâu mộc');

  const [isAddingLoc, setIsAddingLoc] = useState(false);
  const [newLocName, setNewLocName] = useState('');
  const [newLocDesc, setNewLocDesc] = useState('');
  const [newLocElements, setNewLocElements] = useState('');

  // New element tag inputs per location
  const [newTagInput, setNewTagInput] = useState<{ [locId: string]: string }>({});

  useEffect(() => {
    if (characters.length > 0) {
      setConfirmedCharIds(new Set(characters.map((c) => c.id)));
    }
  }, [characters]);

  useEffect(() => {
    if (locations.length > 0) {
      setConfirmedLocIds(new Set(locations.map((l) => l.id)));
    }
  }, [locations]);

  // When step changes to prompts or characters/locations change, keep prompts updated
  useEffect(() => {
    if (currentStep === 'prompts') {
      const activeConfirmedChars = characters.filter((c) => confirmedCharIds.has(c.id));
      const activeConfirmedLocs = locations.filter((l) => confirmedLocIds.has(l.id));
      recompileAllPrompts(activeConfirmedChars, activeConfirmedLocs);
    }
  }, [currentStep, confirmedCharIds, confirmedLocIds]);

  if (!isReviewSetupOpen) return null;

  // Toggle confirmation for a character
  const toggleConfirmChar = (id: string) => {
    setConfirmedCharIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  // Toggle confirmation for a location
  const toggleConfirmLoc = (id: string) => {
    setConfirmedLocIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleConfirmAllChars = () => {
    setConfirmedCharIds(new Set(characters.map((c) => c.id)));
  };

  const handleConfirmAllLocs = () => {
    setConfirmedLocIds(new Set(locations.map((l) => l.id)));
  };

  // Add new character
  const handleAddNewCharacter = () => {
    if (!newCharName.trim()) return;
    addCharacter({
      name: newCharName.trim(),
      role: newCharRole,
      ageEra: 'Trưởng thành',
      fixedTraits: newCharTraits,
      clothingColor: newCharColor,
    });
    setNewCharName('');
    setIsAddingChar(false);
  };

  // Add new location
  const handleAddNewLocation = () => {
    if (!newLocName.trim()) return;
    addLocation({
      name: newLocName.trim(),
      description: newLocDesc.trim(),
      keyElements: newLocElements
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
    });
    setNewLocName('');
    setNewLocDesc('');
    setNewLocElements('');
    setIsAddingLoc(false);
  };

  // Add a tag chip to a location
  const handleAddTagToLocation = (loc: LocationItem) => {
    const tag = (newTagInput[loc.id] || '').trim();
    if (!tag) return;
    updateLocation({
      ...loc,
      keyElements: [...loc.keyElements, tag],
    });
    setNewTagInput((prev) => ({ ...prev, [loc.id]: '' }));
  };

  // Remove tag chip from a location
  const handleRemoveTagFromLocation = (loc: LocationItem, tagIndex: number) => {
    updateLocation({
      ...loc,
      keyElements: loc.keyElements.filter((_, idx) => idx !== tagIndex),
    });
  };

  // Final Action: Confirm and Start Production
  const handleConfirmAndStart = () => {
    const activeConfirmedChars = characters.filter((c) => confirmedCharIds.has(c.id));
    const activeConfirmedLocs = locations.filter((l) => confirmedLocIds.has(l.id));

    // 1. Recompile all image prompts for all scenes with confirmed characters & locations
    recompileAllPrompts(activeConfirmedChars, activeConfirmedLocs);

    // 2. Close modal
    setIsReviewSetupOpen(false);

    // 3. Queue images based on user selection
    if (autoQueueMode === 'first_two' && scenes.length > 0) {
      generateSceneImage(scenes[0].id);
      if (scenes.length > 1) {
        generateSceneImage(scenes[1].id);
      }
    } else if (autoQueueMode === 'all') {
      generateAllScenes();
    }
  };

  const totalDuration = scenes.reduce((acc, s) => acc + (s.durationSeconds || 5.0), 0);

  const filteredScenes = scenes.filter(
    (s) =>
      s.action.toLowerCase().includes(sceneSearch.toLowerCase()) ||
      s.scriptExcerpt.toLowerCase().includes(sceneSearch.toLowerCase()) ||
      s.cast.some((c) => c.toLowerCase().includes(sceneSearch.toLowerCase()))
  );

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-5xl w-full h-[92vh] max-h-[880px] border border-[#E4E7EC] shadow-2xl flex flex-col overflow-hidden">
        {/* Top Header of Review Step */}
        <div className="p-5 border-b border-[#E4E7EC] bg-[#FAFAFA] flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#281E17] text-[#E89659] flex items-center justify-center font-black text-lg shadow-sm border border-[#3E2F24]">
              X
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#C97645] bg-[#FAF0E6] px-2 py-0.5 rounded border border-[#F3D7C0]">
                  Quy trình khởi tạo dự án
                </span>
                <span className="text-xs text-slate-500 font-mono font-semibold">
                  Tỉ lệ {project.aspectRatio}
                </span>
              </div>
              <h2 className="text-base font-extrabold text-[#18202B] mt-0.5">
                {project.title || 'Kịch bản phân cảnh Xế Chiều Studio'}
              </h2>
            </div>
          </div>

          {/* Quick Counter Summary Badges */}
          <div className="flex items-center gap-2 text-xs">
            <span className="px-3 py-1.5 rounded-xl font-bold bg-indigo-50 text-indigo-800 border border-indigo-200 flex items-center gap-1.5">
              <Film className="w-3.5 h-3.5 text-indigo-600" />
              <span>{scenes.length} phân cảnh</span>
            </span>

            <span className="px-3 py-1.5 rounded-xl font-bold bg-amber-50 text-amber-900 border border-amber-200 flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-amber-600" />
              <span>
                {confirmedCharIds.size}/{characters.length} nhân vật
              </span>
            </span>

            <span className="px-3 py-1.5 rounded-xl font-bold bg-emerald-50 text-emerald-900 border border-emerald-200 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-emerald-600" />
              <span>
                {confirmedLocIds.size}/{locations.length} bối cảnh
              </span>
            </span>
          </div>
        </div>

        {/* 4-Step Guided Stepper Bar */}
        <div className="px-6 border-b border-[#E4E7EC] bg-white flex items-center justify-between shrink-0 overflow-x-auto">
          <div className="flex items-center gap-1 sm:gap-2">
            {/* Step 1 */}
            <button
              onClick={() => setCurrentStep('scenes_count')}
              className={`py-3.5 px-3 text-xs font-bold border-b-2 flex items-center gap-2 transition-colors whitespace-nowrap ${
                currentStep === 'scenes_count'
                  ? 'border-indigo-600 text-indigo-700'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                  currentStep === 'scenes_count'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-200 text-slate-700'
                }`}
              >
                1
              </div>
              <span>Đếm phân cảnh theo đoạn ({scenes.length} cảnh)</span>
            </button>

            {/* Step 2 */}
            <button
              onClick={() => setCurrentStep('characters')}
              className={`py-3.5 px-3 text-xs font-bold border-b-2 flex items-center gap-2 transition-colors whitespace-nowrap ${
                currentStep === 'characters'
                  ? 'border-amber-600 text-amber-700'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                  currentStep === 'characters'
                    ? 'bg-amber-600 text-white'
                    : 'bg-slate-200 text-slate-700'
                }`}
              >
                2
              </div>
              <span>Chốt nhân vật trong truyện ({confirmedCharIds.size}/{characters.length})</span>
            </button>

            {/* Step 3 */}
            <button
              onClick={() => setCurrentStep('locations')}
              className={`py-3.5 px-3 text-xs font-bold border-b-2 flex items-center gap-2 transition-colors whitespace-nowrap ${
                currentStep === 'locations'
                  ? 'border-emerald-600 text-emerald-700'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                  currentStep === 'locations'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-200 text-slate-700'
                }`}
              >
                3
              </div>
              <span>Chốt bối cảnh ({confirmedLocIds.size}/{locations.length})</span>
            </button>

            {/* Step 4 */}
            <button
              onClick={() => setCurrentStep('prompts')}
              className={`py-3.5 px-3 text-xs font-bold border-b-2 flex items-center gap-2 transition-colors whitespace-nowrap ${
                currentStep === 'prompts'
                  ? 'border-purple-600 text-purple-700'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                  currentStep === 'prompts'
                    ? 'bg-purple-600 text-white'
                    : 'bg-slate-200 text-slate-700'
                }`}
              >
                4
              </div>
              <span>Tạo Prompt & Bắt đầu tạo hình</span>
            </button>
          </div>

          <div className="text-[11px] text-slate-400 font-medium hidden lg:block">
            Theo tuần tự: Đếm cảnh → Chốt nhân vật → Chốt bối cảnh → Tạo hình
          </div>
        </div>

        {/* Main Tab Content */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 bg-[#F5F6F8]">
          {/* STEP 1: ĐẾM PHÂN CẢNH THEO ĐOẠN & TỔNG QUAN PHÂN TÍCH */}
          {currentStep === 'scenes_count' && (
            <div className="space-y-4">
              {/* Guidance & Result Banner */}
              <div className="p-4 sm:p-5 bg-white rounded-2xl border border-indigo-200 shadow-2xs space-y-3">
                <div className="flex items-start gap-3">
                  <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-700 shrink-0">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-sm sm:text-base text-slate-900">
                      Kết quả phân tích kịch bản: Tự động chia {scenes.length} phân cảnh khớp 1-1 theo đoạn
                    </h3>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      Hệ thống đã đọc qua toàn bộ kịch bản và tự động nhận diện chính xác <strong>{scenes.length} đoạn văn bản</strong>, đề xuất đúng <strong>{scenes.length} phân cảnh</strong> tương ứng khớp 100% từng lời đọc. Anh không cần phải tự ước lượng hay chọn mật độ chia cảnh.
                    </p>
                  </div>
                </div>

                {/* 4 Statistics Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                  <div className="p-3 bg-indigo-50/70 rounded-xl border border-indigo-100">
                    <span className="text-[10px] uppercase font-bold text-indigo-600 block">
                      Tổng số phân cảnh
                    </span>
                    <span className="text-xl font-extrabold text-indigo-950 font-mono">
                      {scenes.length} cảnh
                    </span>
                    <span className="text-[10px] text-indigo-700 block mt-0.5">
                      1 đoạn = 1 phân cảnh
                    </span>
                  </div>

                  <div className="p-3 bg-amber-50/70 rounded-xl border border-amber-100">
                    <span className="text-[10px] uppercase font-bold text-amber-700 block">
                      Nhân vật trích xuất
                    </span>
                    <span className="text-xl font-extrabold text-amber-950 font-mono">
                      {characters.length} nhân vật
                    </span>
                    <span className="text-[10px] text-amber-700 block mt-0.5">
                      Đã trích xuất đặc điểm 2D
                    </span>
                  </div>

                  <div className="p-3 bg-emerald-50/70 rounded-xl border border-emerald-100">
                    <span className="text-[10px] uppercase font-bold text-emerald-700 block">
                      Bối cảnh làng quê
                    </span>
                    <span className="text-xl font-extrabold text-emerald-950 font-mono">
                      {locations.length} địa điểm
                    </span>
                    <span className="text-[10px] text-emerald-700 block mt-0.5">
                      Kèm đạo cụ không gian
                    </span>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-[10px] uppercase font-bold text-slate-500 block">
                      Thời lượng tổng dự kiến
                    </span>
                    <span className="text-xl font-extrabold text-slate-900 font-mono">
                      {totalDuration.toFixed(1)}s
                    </span>
                    <span className="text-[10px] text-slate-500 block mt-0.5">
                      ~{(totalDuration / 60).toFixed(1)} phút video
                    </span>
                  </div>
                </div>
              </div>

              {/* Search & Filter Toolbar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="relative flex-1 max-w-md">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    placeholder="Tìm theo nội dung đoạn văn, hành động, nhân vật..."
                    value={sceneSearch}
                    onChange={(e) => setSceneSearch(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-white border border-[#E4E7EC] rounded-xl text-xs text-slate-900 focus:outline-none focus:border-indigo-600"
                  />
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-xs text-slate-500 font-medium">
                    Hiển thị {filteredScenes.length}/{scenes.length} phân cảnh
                  </span>
                  <button
                    onClick={() => setCurrentStep('characters')}
                    className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs"
                  >
                    <span>Tiếp tục: Chốt nhân vật (Bước 2)</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Detailed Breakdown List of Scenes Mapped to Paragraphs */}
              <div className="space-y-3">
                {filteredScenes.map((scene) => (
                  <div
                    key={scene.id}
                    className="p-4 bg-white rounded-2xl border border-[#E4E7EC] space-y-2.5 text-xs shadow-2xs hover:border-indigo-200 transition-colors"
                  >
                    {/* Scene Header */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono font-extrabold text-xs bg-[#281E17] text-[#E89659] px-2.5 py-0.5 rounded-lg shadow-2xs">
                          Cảnh {scene.order} (S{String(scene.order).padStart(2, '0')})
                        </span>
                        <span className="text-[11px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                          Khớp Đoạn {scene.paragraphIndex + 1}
                        </span>
                        <h4 className="font-extrabold text-slate-900 text-xs sm:text-sm">
                          {scene.action}
                        </h4>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-[10px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded flex items-center gap-1">
                          <Camera className="w-3 h-3 text-slate-500" />
                          <span>{scene.cameraAngle}</span>
                        </span>

                        <span className="font-mono text-xs font-bold text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded border border-amber-200">
                          {scene.durationSeconds || 5.0}s
                        </span>
                      </div>
                    </div>

                    {/* Script Excerpt */}
                    <div className="p-3 bg-[#FAF7F2] rounded-xl border border-[#EADBCC] text-slate-800 leading-relaxed">
                      <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-[#C97645] mb-1">
                        <FileText className="w-3 h-3 text-[#C97645]" />
                        <span>Lời đọc trong kịch bản (Đoạn {scene.paragraphIndex + 1}):</span>
                      </div>
                      <p className="italic text-xs text-[#1C1814]">
                        "{scene.scriptExcerpt}"
                      </p>
                    </div>

                    {/* Scene Metadata: Cast & Props */}
                    <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] pt-1 border-t border-slate-100">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-slate-400 font-semibold">Nhân vật có mặt:</span>
                        {scene.cast.map((charName, i) => (
                          <span
                            key={i}
                            className="bg-amber-50 text-amber-900 font-bold px-2 py-0.5 rounded border border-amber-200"
                          >
                            {charName}
                          </span>
                        ))}
                        {scene.cast.length === 0 && (
                          <span className="text-slate-400 italic">Không có nhân vật chính</span>
                        )}
                      </div>

                      {scene.props.length > 0 && (
                        <div className="flex items-center gap-1.5 text-slate-500">
                          <span className="text-slate-400">Đạo cụ:</span>
                          <span className="font-medium text-slate-700">
                            {scene.props.join(', ')}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 2: CHỐT NHÂN VẬT TRONG TRUYỆN */}
          {currentStep === 'characters' && (
            <div className="space-y-4">
              {/* Guidance Banner */}
              <div className="p-4 sm:p-5 bg-white rounded-2xl border border-amber-200 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div className="flex items-start gap-2.5">
                  <ShieldCheck className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-extrabold text-sm sm:text-base text-slate-900">
                      Bước 2: Chốt danh sách nhân vật ({confirmedCharIds.size}/{characters.length} nhân vật đã duyệt)
                    </h3>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      Bật tích chọn các nhân vật chính thức của câu chuyện. Bạn có thể chỉnh sửa tên, vai trò, màu áo và đặc điểm 2D để AI khóa danh tính và giữ đồng bộ nét vẽ trong suốt câu chuyện.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={handleConfirmAllChars}
                    className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors"
                  >
                    Xác nhận tất cả
                  </button>

                  <button
                    onClick={() => setIsAddingChar(true)}
                    className="px-3.5 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Thêm nhân vật</span>
                  </button>
                </div>
              </div>

              {/* Form to add custom character */}
              {isAddingChar && (
                <div className="p-4 bg-white rounded-2xl border border-amber-300 shadow-xs space-y-3 text-xs animate-in fade-in">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-slate-900">Thêm nhân vật mới vào kịch bản</h4>
                    <button
                      onClick={() => setIsAddingChar(false)}
                      className="text-slate-400 hover:text-slate-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
                    <div>
                      <label className="text-[10px] font-bold text-slate-500 uppercase">Tên nhân vật</label>
                      <input
                        type="text"
                        placeholder="Vd: Lão Hạc, Ông giáo, Thầy đồ..."
                        value={newCharName}
                        onChange={(e) => setNewCharName(e.target.value)}
                        className="w-full p-2 bg-[#F5F6F8] border rounded-lg font-bold"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-500 uppercase">Vai trò</label>
                      <input
                        type="text"
                        placeholder="Vai chính / Phụ / Khách qua đường"
                        value={newCharRole}
                        onChange={(e) => setNewCharRole(e.target.value)}
                        className="w-full p-2 bg-[#F5F6F8] border rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-500 uppercase">Màu áo / Trang phục</label>
                      <input
                        type="text"
                        placeholder="Áo nâu sồng / Áo tơ tằm / Khăn mỏ quạ"
                        value={newCharColor}
                        onChange={(e) => setNewCharColor(e.target.value)}
                        className="w-full p-2 bg-[#F5F6F8] border rounded-lg"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase">Nét nhận diện cố định 2D</label>
                    <input
                      type="text"
                      placeholder="Mặt gầy, mắt buồn, đầu to nửa thân, nét mực đen thô..."
                      value={newCharTraits}
                      onChange={(e) => setNewCharTraits(e.target.value)}
                      className="w-full p-2 bg-[#F5F6F8] border rounded-lg"
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-1">
                    <button
                      onClick={() => setIsAddingChar(false)}
                      className="px-3 py-1.5 text-slate-600 hover:bg-slate-100 rounded-lg"
                    >
                      Hủy
                    </button>
                    <button
                      onClick={handleAddNewCharacter}
                      className="px-4 py-1.5 bg-amber-600 text-white font-semibold rounded-lg hover:bg-amber-700"
                    >
                      Lưu nhân vật
                    </button>
                  </div>
                </div>
              )}

              {/* Characters Interactive List */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {characters.map((char) => {
                  const isConfirmed = confirmedCharIds.has(char.id);

                  return (
                    <div
                      key={char.id}
                      className={`p-5 rounded-2xl border transition-all flex flex-col justify-between gap-3 text-xs ${
                        isConfirmed
                          ? 'bg-white border-amber-300 ring-1 ring-amber-500/20 shadow-xs'
                          : 'bg-slate-50/70 border-slate-200 opacity-60'
                      }`}
                    >
                      <div>
                        {/* Card Top: Checkbox confirmation + Role */}
                        <div className="flex items-center justify-between mb-3">
                          <label className="flex items-center gap-2.5 cursor-pointer select-none">
                            <input
                              type="checkbox"
                              checked={isConfirmed}
                              onChange={() => toggleConfirmChar(char.id)}
                              className="w-4 h-4 rounded text-amber-600 focus:ring-amber-500 cursor-pointer"
                            />
                            <span
                              className={`font-bold text-xs ${
                                isConfirmed ? 'text-emerald-700' : 'text-slate-400'
                              }`}
                            >
                              {isConfirmed ? '✓ Đã chốt nhân vật' : 'Bỏ qua (Không tạo hình)'}
                            </span>
                          </label>

                          <div className="flex items-center gap-1.5">
                            <span className="text-[10px] font-semibold bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded">
                              {char.role}
                            </span>
                            {characters.length > 1 && (
                              <button
                                onClick={() => deleteCharacter(char.id)}
                                title="Xóa nhân vật này"
                                className="p-1 text-slate-300 hover:text-rose-600 rounded transition-colors"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Editable Name & Age Era */}
                        <div className="grid grid-cols-2 gap-2 mb-2.5">
                          <div>
                            <label className="text-[10px] font-bold text-slate-400 uppercase block mb-0.5">
                              Tên nhân vật
                            </label>
                            <input
                              type="text"
                              value={char.name}
                              onChange={(e) => updateCharacter({ ...char, name: e.target.value })}
                              className="w-full p-2 bg-[#F5F6F8] border border-[#E4E7EC] rounded-lg font-bold text-slate-900 focus:bg-white focus:border-amber-500 text-xs"
                            />
                          </div>

                          <div>
                            <label className="text-[10px] font-bold text-slate-400 uppercase block mb-0.5">
                              Mốc tuổi / Dáng người
                            </label>
                            <input
                              type="text"
                              value={char.ageEra}
                              onChange={(e) => updateCharacter({ ...char, ageEra: e.target.value })}
                              className="w-full p-2 bg-[#F5F6F8] border border-[#E4E7EC] rounded-lg text-slate-800 focus:bg-white focus:border-amber-500 text-xs"
                            />
                          </div>
                        </div>

                        {/* Editable Clothing Color */}
                        <div className="mb-2.5">
                          <label className="text-[10px] font-bold text-slate-400 uppercase block mb-0.5">
                            Màu áo & Trang phục chuẩn (Giữ đồng bộ)
                          </label>
                          <input
                            type="text"
                            value={char.clothingColor}
                            onChange={(e) => updateCharacter({ ...char, clothingColor: e.target.value })}
                            className="w-full p-2 bg-[#FAF7F2] border border-[#EADBCC] rounded-lg font-semibold text-[#6B503D] focus:bg-white focus:border-amber-500 text-xs"
                          />
                        </div>

                        {/* Editable Fixed Traits */}
                        <div>
                          <label className="text-[10px] font-bold text-slate-400 uppercase block mb-0.5">
                            Đặc điểm nhận diện 2D cố định
                          </label>
                          <textarea
                            value={char.fixedTraits}
                            onChange={(e) => updateCharacter({ ...char, fixedTraits: e.target.value })}
                            rows={2}
                            className="w-full p-2 bg-[#F5F6F8] border border-[#E4E7EC] rounded-lg text-slate-800 text-[11px] leading-relaxed resize-none focus:bg-white focus:border-amber-500"
                          />
                        </div>
                      </div>

                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
                        <span>Quy chuẩn: Hoạt hình 2D đầu to ~1/2 thân</span>
                        <span className="text-amber-700 font-semibold">Khóa danh tính vào Prompt</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 3: CHỐT BỐI CẢNH CÂU CHUYỆN */}
          {currentStep === 'locations' && (
            <div className="space-y-4">
              {/* Guidance Banner */}
              <div className="p-4 sm:p-5 bg-white rounded-2xl border border-emerald-200 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div className="flex items-start gap-2.5">
                  <MapPin className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-extrabold text-sm sm:text-base text-slate-900">
                      Bước 3: Chốt danh sách bối cảnh ({confirmedLocIds.size}/{locations.length} bối cảnh đã duyệt)
                    </h3>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      Bật chọn các địa điểm diễn ra câu chuyện. Bạn có thể thêm các đạo cụ bắt buộc xuất hiện trong bối cảnh đó để AI vẽ đúng không gian làng quê Việt Nam.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={handleConfirmAllLocs}
                    className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors"
                  >
                    Xác nhận tất cả
                  </button>

                  <button
                    onClick={() => setIsAddingLoc(true)}
                    className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Thêm bối cảnh</span>
                  </button>
                </div>
              </div>

              {/* Form to add custom location */}
              {isAddingLoc && (
                <div className="p-4 bg-white rounded-2xl border border-emerald-300 shadow-xs space-y-3 text-xs animate-in fade-in">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-slate-900">Thêm bối cảnh mới</h4>
                    <button
                      onClick={() => setIsAddingLoc(false)}
                      className="text-slate-400 hover:text-slate-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                    <div>
                      <label className="text-[10px] font-bold text-slate-500 uppercase">Tên địa điểm</label>
                      <input
                        type="text"
                        placeholder="Vd: Gian nhà tranh, Bờ ao, Quán nước đầu làng..."
                        value={newLocName}
                        onChange={(e) => setNewLocName(e.target.value)}
                        className="w-full p-2 bg-[#F5F6F8] border rounded-lg font-bold"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-500 uppercase">Đạo cụ cốt lõi (phân tách dấu phẩy)</label>
                      <input
                        type="text"
                        placeholder="chõng tre, ngọn đèn dầu, bát sành..."
                        value={newLocElements}
                        onChange={(e) => setNewLocElements(e.target.value)}
                        className="w-full p-2 bg-[#F5F6F8] border rounded-lg"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase">Mô tả không gian làng quê</label>
                    <textarea
                      placeholder="Mô tả không gian mộc mạc, vách đất, ánh sáng..."
                      value={newLocDesc}
                      onChange={(e) => setNewLocDesc(e.target.value)}
                      rows={2}
                      className="w-full p-2 bg-[#F5F6F8] border rounded-lg resize-none"
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-1">
                    <button
                      onClick={() => setIsAddingLoc(false)}
                      className="px-3 py-1.5 text-slate-600 hover:bg-slate-100 rounded-lg"
                    >
                      Hủy
                    </button>
                    <button
                      onClick={handleAddNewLocation}
                      className="px-4 py-1.5 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700"
                    >
                      Lưu bối cảnh
                    </button>
                  </div>
                </div>
              )}

              {/* Locations Interactive List */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {locations.map((loc) => {
                  const isConfirmed = confirmedLocIds.has(loc.id);

                  return (
                    <div
                      key={loc.id}
                      className={`p-5 rounded-2xl border transition-all flex flex-col justify-between gap-3 text-xs ${
                        isConfirmed
                          ? 'bg-white border-emerald-300 ring-1 ring-emerald-500/20 shadow-xs'
                          : 'bg-slate-50/70 border-slate-200 opacity-60'
                      }`}
                    >
                      <div>
                        {/* Header: Checkbox + Delete */}
                        <div className="flex items-center justify-between mb-3">
                          <label className="flex items-center gap-2.5 cursor-pointer select-none">
                            <input
                              type="checkbox"
                              checked={isConfirmed}
                              onChange={() => toggleConfirmLoc(loc.id)}
                              className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                            />
                            <span
                              className={`font-bold text-xs ${
                                isConfirmed ? 'text-emerald-700' : 'text-slate-400'
                              }`}
                            >
                              {isConfirmed ? '✓ Đã chốt bối cảnh' : 'Bỏ qua bối cảnh này'}
                            </span>
                          </label>

                          {locations.length > 1 && (
                            <button
                              onClick={() => deleteLocation(loc.id)}
                              title="Xóa bối cảnh này"
                              className="p-1 text-slate-300 hover:text-rose-600 rounded transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>

                        {/* Editable Name */}
                        <div className="mb-2.5">
                          <label className="text-[10px] font-bold text-slate-400 uppercase block mb-0.5">
                            Tên địa điểm
                          </label>
                          <input
                            type="text"
                            value={loc.name}
                            onChange={(e) => updateLocation({ ...loc, name: e.target.value })}
                            className="w-full p-2 bg-[#F5F6F8] border border-[#E4E7EC] rounded-lg font-bold text-slate-900 focus:bg-white focus:border-emerald-500 text-xs"
                          />
                        </div>

                        {/* Editable Description */}
                        <div className="mb-3">
                          <label className="text-[10px] font-bold text-slate-400 uppercase block mb-0.5">
                            Mô tả không gian & ánh sáng
                          </label>
                          <textarea
                            value={loc.description}
                            onChange={(e) => updateLocation({ ...loc, description: e.target.value })}
                            rows={2}
                            className="w-full p-2 bg-[#F5F6F8] border border-[#E4E7EC] rounded-lg text-slate-800 text-[11px] leading-relaxed resize-none focus:bg-white focus:border-emerald-500"
                          />
                        </div>

                        {/* Interactive Elements Tags */}
                        <div>
                          <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">
                            Đạo cụ gắn liền (Nhấn 'x' để xóa hoặc thêm mới):
                          </label>
                          <div className="flex flex-wrap gap-1.5 mb-2">
                            {loc.keyElements.map((elem, i) => (
                              <span
                                key={i}
                                className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded-lg text-[10px] font-medium flex items-center gap-1 border border-slate-200"
                              >
                                <span>{elem}</span>
                                <button
                                  onClick={() => handleRemoveTagFromLocation(loc, i)}
                                  className="text-slate-400 hover:text-rose-600"
                                >
                                  ×
                                </button>
                              </span>
                            ))}
                          </div>

                          <div className="flex gap-1.5">
                            <input
                              type="text"
                              placeholder="Thêm đạo cụ (vd: chum nước)..."
                              value={newTagInput[loc.id] || ''}
                              onChange={(e) =>
                                setNewTagInput((prev) => ({ ...prev, [loc.id]: e.target.value }))
                              }
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') handleAddTagToLocation(loc);
                              }}
                              className="flex-1 p-1.5 bg-[#F5F6F8] border border-[#E4E7EC] rounded-md text-[11px]"
                            />
                            <button
                              onClick={() => handleAddTagToLocation(loc)}
                              className="px-2.5 py-1 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-md text-[11px] font-semibold"
                            >
                              Thêm
                            </button>
                          </div>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-slate-100 text-[10px] text-slate-400">
                        Được tự động áp dụng vào prompt các cảnh diễn ra ở bối cảnh này.
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 4: TẠO PROMPT & BẮT ĐẦU TẠO HÌNH */}
          {currentStep === 'prompts' && (
            <div className="space-y-4">
              {/* Ready banner */}
              <div className="p-4 sm:p-5 bg-white rounded-2xl border border-purple-200 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="p-2.5 rounded-xl bg-purple-50 text-purple-700 shrink-0">
                    <Sparkles className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-sm sm:text-base text-slate-900">
                      Bước 4: Image Prompts đã biên dịch hoàn tất cho {scenes.length} phân cảnh
                    </h3>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      Hệ thống đã kết hợp {confirmedCharIds.size} nhân vật đã chốt và {confirmedLocIds.size} bối cảnh để tạo prompt chuẩn 2D Xế Chiều tiếng Anh cho từng cảnh. Bạn có thể kiểm tra trước khi bấm Bắt đầu tạo hình!
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => {
                    const activeConfirmedChars = characters.filter((c) => confirmedCharIds.has(c.id));
                    const activeConfirmedLocs = locations.filter((l) => confirmedLocIds.has(l.id));
                    recompileAllPrompts(activeConfirmedChars, activeConfirmedLocs);
                  }}
                  className="px-3.5 py-2 bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-200 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors shrink-0"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Cập nhật lại Prompt</span>
                </button>
              </div>

              {/* List of scenes preview with compiled prompt and duration slider */}
              <div className="space-y-3">
                {scenes.map((scene) => (
                  <div
                    key={scene.id}
                    className="p-4 bg-white rounded-2xl border border-[#E4E7EC] space-y-2.5 text-xs shadow-2xs"
                  >
                    <div className="flex items-start justify-between gap-3 flex-wrap">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-xs bg-[#281E17] text-[#E89659] px-2 py-0.5 rounded">
                          S{String(scene.order).padStart(2, '0')}
                        </span>
                        <h4 className="font-bold text-slate-900">{scene.action}</h4>
                        <span className="text-[10px] text-slate-400">({scene.cameraAngle})</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                          {scene.cast.join(', ') || 'Chung'}
                        </span>

                        {/* Quick Duration Controller */}
                        <div className="flex items-center gap-1 bg-amber-50 px-2.5 py-0.5 rounded border border-amber-200">
                          <Clock className="w-3 h-3 text-amber-700" />
                          <span className="font-mono text-[11px] font-bold text-amber-800">
                            {(scene.durationSeconds || 5.0).toFixed(1)}s
                          </span>
                        </div>
                      </div>
                    </div>

                    <p className="text-[11px] text-slate-600 italic bg-[#FAF7F2] p-2.5 rounded-xl border border-[#EADBCC] leading-relaxed">
                      "{scene.scriptExcerpt}"
                    </p>

                    {/* Compiled Prompt Preview Box */}
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                      <div className="flex items-center justify-between text-[10px] font-bold text-slate-500 uppercase mb-1">
                        <div className="flex items-center gap-1">
                          <Code2 className="w-3 h-3 text-slate-400" />
                          <span>Prompt tạo hình 2D gửi sang AI Studio:</span>
                        </div>
                      </div>
                      <p className="text-[11px] font-mono text-slate-700 leading-relaxed">
                        {scene.compiledPrompt || compilePromptForScene(scene)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-5 border-t border-[#E4E7EC] bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0">
          {/* Step 1 Actions */}
          {currentStep === 'scenes_count' && (
            <div className="flex items-center justify-between w-full">
              <span className="text-xs text-slate-500">
                Bước 1 / 4: Đã đếm {scenes.length} phân cảnh theo từng đoạn văn kịch bản
              </span>

              <button
                onClick={() => setCurrentStep('characters')}
                className="px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-2 transition-all"
              >
                <span>Tiếp tục: Chốt danh sách nhân vật (Bước 2)</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Step 2 Actions */}
          {currentStep === 'characters' && (
            <div className="flex items-center justify-between w-full">
              <button
                onClick={() => setCurrentStep('scenes_count')}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl flex items-center gap-1.5 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Quay lại: Đếm phân cảnh</span>
              </button>

              <button
                onClick={() => setCurrentStep('locations')}
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-2 transition-all"
              >
                <span>Tiếp tục: Chốt bối cảnh (Bước 3)</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Step 3 Actions */}
          {currentStep === 'locations' && (
            <div className="flex items-center justify-between w-full">
              <button
                onClick={() => setCurrentStep('characters')}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl flex items-center gap-1.5 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Quay lại: Chốt nhân vật</span>
              </button>

              <button
                onClick={() => setCurrentStep('prompts')}
                className="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-2 transition-all"
              >
                <span>Tiếp tục: Biên dịch Image Prompts (Bước 4)</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Step 4 Actions */}
          {currentStep === 'prompts' && (
            <>
              {/* Queue Mode Options */}
              <div className="flex items-center gap-3 text-xs text-slate-700 flex-wrap">
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="radio"
                    name="queue_mode"
                    checked={autoQueueMode === 'first_two'}
                    onChange={() => setAutoQueueMode('first_two')}
                    className="text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                  />
                  <span>Tạo thử 2 cảnh đầu tiên</span>
                </label>

                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="radio"
                    name="queue_mode"
                    checked={autoQueueMode === 'all'}
                    onChange={() => setAutoQueueMode('all')}
                    className="text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                  />
                  <span>Đưa cả {scenes.length} cảnh vào hàng chờ</span>
                </label>

                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="radio"
                    name="queue_mode"
                    checked={autoQueueMode === 'manual'}
                    onChange={() => setAutoQueueMode('manual')}
                    className="text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                  />
                  <span>Chỉ lưu dữ liệu (Tạo sau)</span>
                </label>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentStep('locations')}
                  className="px-3.5 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
                >
                  Quay lại
                </button>

                <button
                  onClick={handleConfirmAndStart}
                  className="px-6 py-2.5 bg-[#4F46E5] hover:bg-[#4338CA] text-white text-xs font-extrabold rounded-xl shadow-md flex items-center gap-2 transition-all"
                >
                  <Sparkles className="w-4 h-4 text-indigo-200" />
                  <span>Chốt Dữ Liệu & Bắt Đầu Tạo Hình ({scenes.length} Cảnh)</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
