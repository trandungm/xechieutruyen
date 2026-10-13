import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import JSZip from 'jszip';
import {
  Project,
  Character,
  LocationItem,
  Scene,
  ImageAsset,
  GenerationTask,
  StylePreset,
  ReviewStatus,
  AspectRatio,
} from '../types';
import {
  MOT_BUA_NO_SCRIPT,
  SAMPLE_CHARACTERS,
  SAMPLE_LOCATIONS,
  SAMPLE_SCENES,
  SAMPLE_ASSETS,
  DEFAULT_STYLE_PRESET,
} from '../data/sampleStory';

interface BackendHealth {
  ok: boolean;
  hasApiKey: boolean;
  textModel: string;
  imageModel: string;
  channel: string;
}

interface StudioContextType {
  project: Project;
  characters: Character[];
  locations: LocationItem[];
  scenes: Scene[];
  imageAssets: Record<string, ImageAsset[]>;
  stylePreset: StylePreset;
  selectedSceneId: string | null;
  selectedSceneIds: string[];
  activeParagraphIndex: number | null;
  filterStatus: 'all' | 'unreviewed' | 'approved' | 'needs_fix';
  viewMode: 'grid' | 'list';
  activeTab: 'storyboard' | 'characters' | 'locations' | 'style';
  queue: GenerationTask[];
  isQueuePaused: boolean;
  isQueueOpen: boolean;
  isReviewSetupOpen: boolean;
  isAnalyzing: boolean;
  lastSavedAt: number | null;
  backendHealth: BackendHealth | null;

  // Actions
  setIsQueueOpen: (open: boolean) => void;
  setIsReviewSetupOpen: (open: boolean) => void;
  setProject: React.Dispatch<React.SetStateAction<Project>>;
  setActiveTab: (tab: 'storyboard' | 'characters' | 'locations' | 'style') => void;
  setSelectedSceneId: (id: string | null) => void;
  setActiveParagraphIndex: (index: number | null) => void;
  setFilterStatus: (filter: 'all' | 'unreviewed' | 'approved' | 'needs_fix') => void;
  setViewMode: (mode: 'grid' | 'list') => void;
  toggleSelectScene: (id: string) => void;
  selectAllScenes: () => void;
  clearSelection: () => void;

  // Character & Location
  addCharacter: (char: Omit<Character, 'id' | 'references'>) => void;
  updateCharacter: (char: Character) => void;
  deleteCharacter: (id: string) => void;
  addCharacterReference: (charId: string, ref: { type: 'front' | 'side' | 'full_body'; label: string; imageUrl: string }) => void;
  addLocation: (loc: Omit<LocationItem, 'id'>) => void;
  updateLocation: (loc: LocationItem) => void;
  deleteLocation: (id: string) => void;

  // Scenes
  updateScene: (sceneId: string, updates: Partial<Scene>) => void;
  splitScene: (sceneId: string) => void;
  mergeScene: (sceneId: string) => void;
  deleteScene: (sceneId: string) => void;
  setReviewStatus: (sceneId: string, status: ReviewStatus) => void;
  selectImageAsset: (sceneId: string, assetId: string) => void;

  // AI & Workflow
  analyzeScript: (scriptText?: string, density?: string) => Promise<void>;
  generateSceneImage: (sceneId: string) => void;
  generateSelectedScenes: () => void;
  generateAllScenes: () => void;
  editSceneImage: (sceneId: string, editInstruction: string) => void;
  loadSampleProject: () => void;
  compilePromptForScene: (scene: Scene, charsToUse?: Character[], locsToUse?: LocationItem[]) => string;
  recompileAllPrompts: (chars?: Character[], locs?: LocationItem[]) => void;

  // Queue Controls
  pauseQueue: () => void;
  resumeQueue: () => void;
  cancelTask: (taskId: string) => void;
  retryTask: (taskId: string) => void;
  clearCompletedTasks: () => void;

  // Export & Storage
  exportProjectZip: (onlyApproved?: boolean) => Promise<void>;
  exportProjectJson: () => void;
  importProjectJson: (jsonData: any) => void;
}

const StudioContext = createContext<StudioContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'xe_chieu_studio_data_v1';

export const StudioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initial default project
  const [project, setProject] = useState<Project>(() => ({
    id: 'proj_mot_bua_no',
    title: 'Một bữa no (Nam Cao)',
    aspectRatio: '16:9',
    scriptText: MOT_BUA_NO_SCRIPT,
    stylePresetId: 'preset_xe_chieu_2d',
    density: 'medium',
    createdAt: Date.now(),
    updatedAt: Date.now(),
  }));

  const [characters, setCharacters] = useState<Character[]>(SAMPLE_CHARACTERS);
  const [locations, setLocations] = useState<LocationItem[]>(SAMPLE_LOCATIONS);
  const [scenes, setScenes] = useState<Scene[]>(SAMPLE_SCENES);
  const [imageAssets, setImageAssets] = useState<Record<string, ImageAsset[]>>(SAMPLE_ASSETS);
  const [stylePreset, setStylePreset] = useState<StylePreset>(DEFAULT_STYLE_PRESET);

  const [selectedSceneId, setSelectedSceneId] = useState<string | null>('scene_001');
  const [selectedSceneIds, setSelectedSceneIds] = useState<string[]>([]);
  const [activeParagraphIndex, setActiveParagraphIndex] = useState<number | null>(0);
  const [filterStatus, setFilterStatus] = useState<'all' | 'unreviewed' | 'approved' | 'needs_fix'>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [activeTab, setActiveTab] = useState<'storyboard' | 'characters' | 'locations' | 'style'>('storyboard');

  const [queue, setQueue] = useState<GenerationTask[]>([]);
  const [isQueuePaused, setIsQueuePaused] = useState<boolean>(false);
  const [isQueueOpen, setIsQueueOpen] = useState<boolean>(false);
  const [isReviewSetupOpen, setIsReviewSetupOpen] = useState<boolean>(false);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [lastSavedAt, setLastSavedAt] = useState<number | null>(Date.now());
  const [backendHealth, setBackendHealth] = useState<BackendHealth | null>(null);

  const isProcessingQueue = useRef(false);

  // Check backend health on mount
  useEffect(() => {
    fetch('/api/health')
      .then((res) => res.json())
      .then((data) => setBackendHealth(data))
      .catch((err) => console.warn('Backend health check note:', err));
  }, []);

  // Sync active paragraph index when selectedSceneId changes
  useEffect(() => {
    if (selectedSceneId) {
      const found = scenes.find((s) => s.id === selectedSceneId);
      if (found) {
        setActiveParagraphIndex(found.paragraphIndex);
      }
    }
  }, [selectedSceneId, scenes]);

  // Auto-save debounce effect
  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        const payload = {
          project,
          characters,
          locations,
          scenes,
          imageAssets,
          stylePreset,
        };
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(payload));
        setLastSavedAt(Date.now());
      } catch (err) {
        console.warn('LocalStorage save note:', err);
      }
    }, 1200);

    return () => clearTimeout(timer);
  }, [project, characters, locations, scenes, imageAssets, stylePreset]);

  // Background queue worker
  useEffect(() => {
    if (isQueuePaused) return;

    const runWorker = async () => {
      if (isProcessingQueue.current) return;
      const nextTask = queue.find((t) => t.state === 'queued');
      if (!nextTask) return;

      isProcessingQueue.current = true;

      // Update state to running
      setQueue((prev) =>
        prev.map((t) => (t.id === nextTask.id ? { ...t, state: 'running' } : t))
      );

      try {
        let endpoint = '/api/generate-image';
        let body: any = {
          prompt: nextTask.prompt,
          aspectRatio: nextTask.aspectRatio,
          referenceImageBase64: nextTask.referenceImageBase64,
          characterName: nextTask.characterName,
          sceneTitle: nextTask.sceneTitle,
          sceneExcerpt: nextTask.sceneExcerpt,
        };

        if (nextTask.type === 'edit') {
          endpoint = '/api/edit-image';
          body = {
            sourceImageBase64: nextTask.referenceImageBase64,
            editInstruction: nextTask.prompt,
            aspectRatio: nextTask.aspectRatio,
            characterName: nextTask.characterName,
            sceneTitle: nextTask.sceneTitle,
          };
        }

        const res = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        });

        const data = await res.json();

        if (res.ok && data.success && data.imageUrl) {
          const newAssetId = `asset_${nextTask.sceneId}_${Date.now()}`;
          const currentList = imageAssets[nextTask.sceneId] || [];
          const newVersion = currentList.length + 1;

          const newAsset: ImageAsset = {
            id: newAssetId,
            sceneId: nextTask.sceneId,
            dataUrl: data.imageUrl,
            promptSnapshot: nextTask.prompt,
            createdAt: Date.now(),
            provider: data.provider || 'Xế Chiều Engine',
            isApproved: false,
            version: newVersion,
          };

          // Update imageAssets
          setImageAssets((prev) => ({
            ...prev,
            [nextTask.sceneId]: [newAsset, ...(prev[nextTask.sceneId] || [])],
          }));

          // Link asset to scene & set review status
          setScenes((prev) =>
            prev.map((s) =>
              s.id === nextTask.sceneId
                ? {
                    ...s,
                    selectedAssetId: newAssetId,
                    reviewStatus: 'unreviewed',
                  }
                : s
            )
          );

          // Mark task succeeded
          setQueue((prev) =>
            prev.map((t) => (t.id === nextTask.id ? { ...t, state: 'succeeded' } : t))
          );
        } else {
          throw new Error(data.error || 'Tạo ảnh không thành công');
        }
      } catch (err: any) {
        console.error('Queue task error:', err);
        setQueue((prev) =>
          prev.map((t) => {
            if (t.id !== nextTask.id) return t;
            if (t.retries < 2) {
              return {
                ...t,
                state: 'queued',
                retries: t.retries + 1,
                error: `Lần thử ${t.retries + 1}: ${err.message}`,
              };
            }
            return {
              ...t,
              state: 'failed',
              error: err.message || 'Lỗi xử lý tạo ảnh',
            };
          })
        );
      } finally {
        isProcessingQueue.current = false;
      }
    };

    const interval = setInterval(runWorker, 1000);
    return () => clearInterval(interval);
  }, [queue, isQueuePaused, imageAssets]);

  // Selection helpers
  const toggleSelectScene = (id: string) => {
    setSelectedSceneIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const selectAllScenes = () => {
    setSelectedSceneIds(scenes.map((s) => s.id));
  };

  const clearSelection = () => {
    setSelectedSceneIds([]);
  };

  // Prompt compiler ensuring Xế Chiều Studio 2D signature guidelines
  const compilePromptForScene = (
    scene: Scene,
    charsToUse?: Character[],
    locsToUse?: LocationItem[]
  ): string => {
    const charsList = charsToUse || characters;
    const locsList = locsToUse || locations;

    const castDetails = scene.cast
      .map((charName) => {
        const found = charsList.find(
          (c) =>
            c.name.toLowerCase() === charName.toLowerCase() ||
            charName.toLowerCase().includes(c.name.toLowerCase())
        );
        if (found) {
          return `${found.name} (${found.ageEra}, signature costume: ${found.clothingColor}, 2D style: ${found.fixedTraits})`;
        }
        return charName;
      })
      .join('; ');

    // Match confirmed location
    const matchedLoc = locsList.find(
      (l) =>
        scene.action.toLowerCase().includes(l.name.toLowerCase()) ||
        scene.scriptExcerpt.toLowerCase().includes(l.name.toLowerCase())
    );

    const locText = matchedLoc
      ? `Rustic setting: ${matchedLoc.name} (${matchedLoc.description}${
          matchedLoc.keyElements.length > 0
            ? ', environmental elements: ' + matchedLoc.keyElements.join(', ')
            : ''
        }).`
      : '';

    const propsText = scene.props.length > 0 ? `Key props: ${scene.props.join(', ')}.` : '';

    return `2D Vietnamese folk story animation style for "Xế Chiều Studio" YouTube channel.
Scene composition: ${scene.cameraAngle}.
${locText}
Characters in scene: ${castDetails || 'Vietnamese folk character'}.
Action & Interaction: ${scene.action}.
Emotional expression: ${scene.emotion}.
${propsText}
Aesthetic rules: Big head roughly half height, small rustic body, bold hand-drawn ink contours, flat earthy color palette (cream, umber, muted indigo, warm skin), uncluttered minimalist setting with 1 to 3 rustic Vietnamese village elements. No 3D CGI, no anime tropes, no text.`;
  };

  const recompileAllPrompts = (charsToUse?: Character[], locsToUse?: LocationItem[]) => {
    const charsList = charsToUse || characters;
    const locsList = locsToUse || locations;
    setScenes((prev) =>
      prev.map((scene) => ({
        ...scene,
        compiledPrompt: compilePromptForScene(scene, charsList, locsList),
      }))
    );
  };

  // CRUD for Characters
  const addCharacter = (char: Omit<Character, 'id' | 'references'>) => {
    const newChar: Character = {
      ...char,
      id: `char_${Date.now()}`,
      references: [],
    };
    setCharacters((prev) => [...prev, newChar]);
  };

  const updateCharacter = (char: Character) => {
    setCharacters((prev) => prev.map((c) => (c.id === char.id ? char : c)));
  };

  const deleteCharacter = (id: string) => {
    setCharacters((prev) => prev.filter((c) => c.id !== id));
  };

  const addCharacterReference = (
    charId: string,
    ref: { type: 'front' | 'side' | 'full_body'; label: string; imageUrl: string }
  ) => {
    setCharacters((prev) =>
      prev.map((c) => {
        if (c.id !== charId) return c;
        const newRef = {
          id: `ref_${Date.now()}`,
          type: ref.type,
          label: ref.label,
          imageUrl: ref.imageUrl,
          isApproved: true,
        };
        return {
          ...c,
          references: [...c.references, newRef],
        };
      })
    );
  };

  // CRUD for Locations
  const addLocation = (loc: Omit<LocationItem, 'id'>) => {
    const newLoc: LocationItem = {
      ...loc,
      id: `loc_${Date.now()}`,
    };
    setLocations((prev) => [...prev, newLoc]);
  };

  const updateLocation = (loc: LocationItem) => {
    setLocations((prev) => prev.map((l) => (l.id === loc.id ? loc : l)));
  };

  const deleteLocation = (id: string) => {
    setLocations((prev) => prev.filter((l) => l.id !== id));
  };

  // CRUD for Scenes
  const updateScene = (sceneId: string, updates: Partial<Scene>) => {
    setScenes((prev) =>
      prev.map((s) => {
        if (s.id !== sceneId) return s;
        const updated = { ...s, ...updates };
        // If action, cast, or camera changed, recompile prompt
        if (updates.action || updates.cameraAngle || updates.cast || updates.props || updates.emotion) {
          updated.compiledPrompt = compilePromptForScene(updated);
        }
        return updated;
      })
    );
  };

  const splitScene = (sceneId: string) => {
    const idx = scenes.findIndex((s) => s.id === sceneId);
    if (idx === -1) return;
    const target = scenes[idx];

    const halfDuration = Math.max(2, parseFloat((target.durationSeconds / 2).toFixed(1)));

    const newScene: Scene = {
      id: `scene_${Date.now()}`,
      order: target.order + 1,
      scriptExcerpt: target.scriptExcerpt,
      paragraphIndex: target.paragraphIndex,
      kind: target.kind,
      action: `${target.action} (Phân đoạn tiếp nối)`,
      emotion: target.emotion,
      cameraAngle: 'Cận cảnh (close-up)',
      cast: [...target.cast],
      props: [...target.props],
      compiledPrompt: target.compiledPrompt,
      durationSeconds: halfDuration,
      reviewStatus: 'unreviewed',
    };

    const newScenes = [...scenes];
    newScenes[idx] = { ...target, durationSeconds: halfDuration };
    newScenes.splice(idx + 1, 0, newScene);
    // Reorder
    newScenes.forEach((s, i) => (s.order = i + 1));
    setScenes(newScenes);
    setSelectedSceneId(newScene.id);
  };

  const mergeScene = (sceneId: string) => {
    const idx = scenes.findIndex((s) => s.id === sceneId);
    if (idx <= 0) return;
    const prevScene = scenes[idx - 1];
    const target = scenes[idx];

    const merged: Scene = {
      ...prevScene,
      scriptExcerpt: `${prevScene.scriptExcerpt} ${target.scriptExcerpt}`,
      action: `${prevScene.action}; ${target.action}`,
      durationSeconds: parseFloat((prevScene.durationSeconds + target.durationSeconds).toFixed(1)),
      cast: Array.from(new Set([...prevScene.cast, ...target.cast])),
      props: Array.from(new Set([...prevScene.props, ...target.props])),
    };
    merged.compiledPrompt = compilePromptForScene(merged);

    const updated = scenes.filter((s) => s.id !== sceneId);
    updated[idx - 1] = merged;
    updated.forEach((s, i) => (s.order = i + 1));
    setScenes(updated);
    setSelectedSceneId(merged.id);
  };

  const deleteScene = (sceneId: string) => {
    if (scenes.length <= 1) return;
    const updated = scenes.filter((s) => s.id !== sceneId);
    updated.forEach((s, i) => (s.order = i + 1));
    setScenes(updated);
    if (selectedSceneId === sceneId) {
      setSelectedSceneId(updated[0]?.id || null);
    }
  };

  const setReviewStatus = (sceneId: string, status: ReviewStatus) => {
    setScenes((prev) =>
      prev.map((s) => (s.id === sceneId ? { ...s, reviewStatus: status } : s))
    );
  };

  const selectImageAsset = (sceneId: string, assetId: string) => {
    setScenes((prev) =>
      prev.map((s) => (s.id === sceneId ? { ...s, selectedAssetId: assetId } : s))
    );
  };

  // AI Script Analysis
  const analyzeScript = async (scriptText?: string, density?: string) => {
    const textToAnalyze = scriptText || project.scriptText;
    const densityVal = (density as any) || project.density;

    if (!textToAnalyze.trim()) return;

    setIsAnalyzing(true);
    try {
      const res = await fetch('/api/analyze-script', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          scriptText: textToAnalyze,
          density: densityVal,
          styleName: stylePreset.name,
        }),
      });

      const data = await res.json();
      if (data && data.scenes) {
        setProject((prev) => ({
          ...prev,
          title: data.title || prev.title,
          scriptText: textToAnalyze,
          density: densityVal,
          updatedAt: Date.now(),
        }));

        if (data.characters && data.characters.length > 0) {
          const mappedChars: Character[] = data.characters.map((c: any, i: number) => ({
            id: c.id || `char_${i}`,
            name: c.name || `Nhân vật ${i + 1}`,
            role: c.role || 'Nhân vật',
            ageEra: c.ageEra || 'Trưởng thành',
            fixedTraits: c.fixedTraits || 'Hoạt hình 2D nét thô đen, áo nâu mộc',
            clothingColor: c.clothingColor || 'Nâu sồng',
            references: [],
          }));
          setCharacters(mappedChars);
        }

        if (data.locations && data.locations.length > 0) {
          setLocations(data.locations);
        }

        const mappedScenes: Scene[] = data.scenes.map((s: any, idx: number) => ({
          id: `scene_${Date.now()}_${idx + 1}`,
          order: idx + 1,
          scriptExcerpt: s.scriptExcerpt || '',
          paragraphIndex: s.paragraphIndex ?? idx,
          kind: (s.kind as any) || 'narrative',
          action: s.action || '',
          emotion: s.emotion || 'Chân thực',
          cameraAngle: s.cameraAngle || 'Trung cảnh (medium shot)',
          cast: s.cast || [],
          props: s.props || [],
          compiledPrompt: s.compiledPrompt || '',
          durationSeconds: s.durationSeconds || 5.0,
          reviewStatus: 'unreviewed',
        }));

        setScenes(mappedScenes);
        setSelectedSceneId(mappedScenes[0]?.id || null);
        setIsReviewSetupOpen(true);
        setActiveTab('storyboard');
      }
    } catch (err) {
      console.error('Error analyzing script:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Enqueue Generate Scene Image
  const generateSceneImage = (sceneId: string) => {
    const scene = scenes.find((s) => s.id === sceneId);
    if (!scene) return;

    // Find main character's approved reference image to pass into generation task
    let refBase64: string | undefined;
    const mainChar = characters.find((c) => scene.cast.includes(c.name));
    if (mainChar && mainChar.references.length > 0) {
      const approvedRef = mainChar.references.find((r) => r.isApproved) || mainChar.references[0];
      refBase64 = approvedRef.imageUrl;
    }

    const task: GenerationTask = {
      id: `task_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      sceneId: scene.id,
      type: 'generate',
      state: 'queued',
      prompt: scene.compiledPrompt || compilePromptForScene(scene),
      aspectRatio: project.aspectRatio,
      referenceImageBase64: refBase64,
      characterName: scene.cast.join(', ') || 'Nhân vật truyện',
      sceneTitle: `Cảnh ${scene.order}: ${scene.action.slice(0, 30)}`,
      sceneExcerpt: scene.scriptExcerpt,
      createdAt: Date.now(),
      retries: 0,
    };

    setQueue((prev) => [...prev, task]);
    setIsQueueOpen(true);
  };

  const generateSelectedScenes = () => {
    if (selectedSceneIds.length === 0) return;
    selectedSceneIds.forEach((id) => generateSceneImage(id));
  };

  const generateAllScenes = () => {
    scenes.forEach((s) => generateSceneImage(s.id));
  };

  // Enqueue Edit Scene Image
  const editSceneImage = (sceneId: string, editInstruction: string) => {
    const scene = scenes.find((s) => s.id === sceneId);
    if (!scene || !scene.selectedAssetId) return;

    const currentAsset = (imageAssets[sceneId] || []).find((a) => a.id === scene.selectedAssetId);
    if (!currentAsset) return;

    const task: GenerationTask = {
      id: `task_edit_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      sceneId: scene.id,
      type: 'edit',
      state: 'queued',
      prompt: editInstruction,
      aspectRatio: project.aspectRatio,
      referenceImageBase64: currentAsset.dataUrl,
      characterName: scene.cast.join(', ') || 'Nhân vật',
      sceneTitle: `Sửa Cảnh ${scene.order}`,
      sceneExcerpt: scene.scriptExcerpt,
      createdAt: Date.now(),
      retries: 0,
    };

    setQueue((prev) => [...prev, task]);
    setIsQueueOpen(true);
  };

  // Reset to canonical "Một bữa no"
  const loadSampleProject = () => {
    setProject({
      id: 'proj_mot_bua_no',
      title: 'Một bữa no (Nam Cao)',
      aspectRatio: '16:9',
      scriptText: MOT_BUA_NO_SCRIPT,
      stylePresetId: 'preset_xe_chieu_2d',
      density: 'medium',
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
    setCharacters(SAMPLE_CHARACTERS);
    setLocations(SAMPLE_LOCATIONS);
    setScenes(SAMPLE_SCENES);
    setImageAssets(SAMPLE_ASSETS);
    setStylePreset(DEFAULT_STYLE_PRESET);
    setSelectedSceneId('scene_001');
    setSelectedSceneIds([]);
    setActiveTab('storyboard');
  };

  // Queue Controls
  const pauseQueue = () => setIsQueuePaused(true);
  const resumeQueue = () => setIsQueuePaused(false);
  const cancelTask = (taskId: string) => {
    setQueue((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, state: 'canceled' } : t))
    );
  };
  const retryTask = (taskId: string) => {
    setQueue((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, state: 'queued', retries: 0, error: undefined } : t))
    );
  };
  const clearCompletedTasks = () => {
    setQueue((prev) => prev.filter((t) => t.state === 'queued' || t.state === 'running'));
  };

  // Export ZIP package (with Images, CSV Mapping, Prompts, JSON Backup)
  const exportProjectZip = async (onlyApproved: boolean = false) => {
    const zip = new JSZip();

    // 1. Images folder
    const imagesFolder = zip.folder('images');
    const csvRows: string[] = [
      'Scene_Number,Duration_Seconds,Script_Excerpt,Cast,Emotion,Camera,Review_Status,Image_Filename,Prompt',
    ];

    scenes.forEach((scene) => {
      const assets = imageAssets[scene.id] || [];
      const currentAsset = assets.find((a) => a.id === scene.selectedAssetId) || assets[0];

      if (onlyApproved && scene.reviewStatus !== 'approved') return;

      const orderStr = String(scene.order).padStart(3, '0');
      const safeTitle = scene.action.slice(0, 24).replace(/[^a-zA-Z0-9\u00C0-\u024F\u1E00-\u1EFF]/g, '_');
      const filename = `S${orderStr}_${safeTitle}.png`;

      if (currentAsset && imagesFolder) {
        if (currentAsset.dataUrl.startsWith('data:image/svg+xml')) {
          // Store SVG directly
          const svgContent = decodeURIComponent(currentAsset.dataUrl.replace('data:image/svg+xml;utf8,', ''));
          imagesFolder.file(`S${orderStr}_${safeTitle}.svg`, svgContent);
        } else if (currentAsset.dataUrl.startsWith('data:image/png;base64,')) {
          const base64 = currentAsset.dataUrl.replace('data:image/png;base64,', '');
          imagesFolder.file(filename, base64, { base64: true });
        }
      }

      // Add to CSV
      const cleanExcerpt = `"${scene.scriptExcerpt.replace(/"/g, '""')}"`;
      const cleanAction = `"${scene.action.replace(/"/g, '""')}"`;
      const cleanCast = `"${scene.cast.join('; ')}"`;
      const cleanPrompt = `"${scene.compiledPrompt.replace(/"/g, '""')}"`;
      csvRows.push(
        `S${orderStr},${scene.durationSeconds || 5.0},${cleanExcerpt},${cleanCast},"${scene.emotion}","${scene.cameraAngle}",${scene.reviewStatus},${filename},${cleanPrompt}`
      );
    });

    // 2. CSV mapping
    zip.file('mapping_voiceover.csv', '\uFEFF' + csvRows.join('\n'));

    // 3. Prompts list
    const promptsTxt = scenes
      .map(
        (s) =>
          `=== CẢNH ${s.order} ===\nLời đọc: ${s.scriptExcerpt}\nNhân vật: ${s.cast.join(', ')}\nPrompt:\n${s.compiledPrompt}\n`
      )
      .join('\n----------------------------------------\n\n');
    zip.file('prompts_list.txt', promptsTxt);

    // 4. Project JSON backup
    const projectBackup = {
      schemaVersion: '1.0.0',
      exportedAt: new Date().toISOString(),
      project,
      characters,
      locations,
      scenes,
      stylePreset,
    };
    zip.file('xe_chieu_project.json', JSON.stringify(projectBackup, null, 2));

    // Generate blob and trigger download
    const blob = await zip.generateAsync({ type: 'blob' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Xe_Chieu_Studio_${project.title.replace(/\s+/g, '_')}.zip`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const exportProjectJson = () => {
    const backup = {
      schemaVersion: '1.0.0',
      exportedAt: new Date().toISOString(),
      project,
      characters,
      locations,
      scenes,
      imageAssets,
      stylePreset,
    };
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `xe_chieu_studio_backup_${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const importProjectJson = (jsonData: any) => {
    if (!jsonData || !jsonData.scenes || !jsonData.characters) {
      alert('File sao lưu JSON không đúng định dạng của Xế Chiều Studio.');
      return;
    }
    if (jsonData.project) setProject(jsonData.project);
    if (jsonData.characters) setCharacters(jsonData.characters);
    if (jsonData.locations) setLocations(jsonData.locations);
    if (jsonData.scenes) setScenes(jsonData.scenes);
    if (jsonData.imageAssets) setImageAssets(jsonData.imageAssets);
    if (jsonData.stylePreset) setStylePreset(jsonData.stylePreset);
    setSelectedSceneId(jsonData.scenes[0]?.id || null);
    setActiveTab('storyboard');
  };

  return (
    <StudioContext.Provider
      value={{
        project,
        characters,
        locations,
        scenes,
        imageAssets,
        stylePreset,
        selectedSceneId,
        selectedSceneIds,
        activeParagraphIndex,
        filterStatus,
        viewMode,
        activeTab,
        queue,
        isQueuePaused,
        isQueueOpen,
        isReviewSetupOpen,
        isAnalyzing,
        lastSavedAt,
        backendHealth,

        setProject,
        setActiveTab,
        setSelectedSceneId,
        setActiveParagraphIndex,
        setFilterStatus,
        setViewMode,
        setIsQueueOpen,
        setIsReviewSetupOpen,
        toggleSelectScene,
        selectAllScenes,
        clearSelection,

        addCharacter,
        updateCharacter,
        deleteCharacter,
        addCharacterReference,
        addLocation,
        updateLocation,
        deleteLocation,

        updateScene,
        splitScene,
        mergeScene,
        deleteScene,
        setReviewStatus,
        selectImageAsset,

        analyzeScript,
        generateSceneImage,
        generateSelectedScenes,
        generateAllScenes,
        editSceneImage,
        loadSampleProject,
        compilePromptForScene,
        recompileAllPrompts,

        pauseQueue,
        resumeQueue,
        cancelTask,
        retryTask,
        clearCompletedTasks,

        exportProjectZip,
        exportProjectJson,
        importProjectJson,
      }}
    >
      {children}
    </StudioContext.Provider>
  );
};

export const useStudio = () => {
  const context = useContext(StudioContext);
  if (!context) {
    throw new Error('useStudio must be used within a StudioProvider');
  }
  return context;
};
