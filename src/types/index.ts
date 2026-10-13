export type AspectRatio = '16:9' | '9:16' | '1:1';

export type SceneKind = 'narrative' | 'commentary' | 'flashback';

export type ReviewStatus = 'unreviewed' | 'approved' | 'needs_fix' | 'rejected';

export type TaskState = 'queued' | 'running' | 'succeeded' | 'failed' | 'canceled';

export interface CharacterReference {
  id: string;
  type: 'front' | 'side' | 'full_body';
  label: string;
  imageUrl: string;
  isApproved: boolean;
}

export interface Character {
  id: string;
  name: string;
  role: string;
  ageEra: string;
  fixedTraits: string;
  clothingColor: string;
  references: CharacterReference[];
}

export interface LocationItem {
  id: string;
  name: string;
  description: string;
  keyElements: string[];
  referenceImageUrl?: string;
}

export interface Scene {
  id: string;
  order: number;
  scriptExcerpt: string;
  paragraphIndex: number;
  kind: SceneKind;
  action: string;
  emotion: string;
  cameraAngle: string;
  cast: string[];
  props: string[];
  compiledPrompt: string;
  selectedAssetId?: string;
  reviewStatus: ReviewStatus;
  durationSeconds: number;
  notes?: string;
}

export interface ImageAsset {
  id: string;
  sceneId: string;
  dataUrl: string;
  promptSnapshot: string;
  createdAt: number;
  provider: string;
  isApproved: boolean;
  version: number;
}

export interface GenerationTask {
  id: string;
  sceneId: string;
  type: 'generate' | 'edit' | 'character_sheet';
  state: TaskState;
  prompt: string;
  aspectRatio: AspectRatio;
  referenceImageBase64?: string;
  characterName: string;
  sceneTitle: string;
  sceneExcerpt: string;
  createdAt: number;
  error?: string;
  retries: number;
}

export interface StylePreset {
  id: string;
  name: string;
  description: string;
  rules: string[];
  colorPalette: {
    name: string;
    hex: string;
    description?: string;
  }[];
  sampleReferences: string[];
  characterProportions?: string;
  linework?: string;
  backgroundStyle?: string;
  promptKeywords?: string;
  negativeRules?: string;
  referenceImageUrl?: string;
  isCustomAnalyzed?: boolean;
}

export interface StyleAnalysisResult {
  styleName: string;
  characterProportions: string;
  linework: string;
  colorPalette: { name: string; hex: string; description?: string }[];
  backgroundStyle: string;
  promptKeywords: string;
  negativeRules: string;
}

export interface Project {
  id: string;
  title: string;
  aspectRatio: AspectRatio;
  scriptText: string;
  stylePresetId: string;
  density: 'auto' | 'paragraph' | 'condensed' | 'sparse' | 'medium' | 'dense';
  createdAt: number;
  updatedAt: number;
}
