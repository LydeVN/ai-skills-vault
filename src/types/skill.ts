export type SkillCategory = 
  | 'Coding & Architecture'
  | 'Agentic Workflows'
  | 'Security & Auditing'
  | 'Data & Analytics'
  | 'Prompt Engineering'
  | 'Writing & Docs'
  | 'DevOps & Cloud'
  | 'Custom';

export type SkillType = 
  | 'prompt' 
  | 'system_instruction' 
  | 'tool_mcp' 
  | 'agent_workflow' 
  | 'few_shot';

export type SkillLevel = 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';

export type ModelTarget = 
  | 'Gemini 1.5/2.0' 
  | 'Claude 3.5 Sonnet' 
  | 'GPT-4o' 
  | 'Antigravity / Cursor' 
  | 'Local / Ollama' 
  | 'Universal';

export interface SkillVariable {
  name: string;
  label: string;
  defaultValue?: string;
  description?: string;
}

export interface Skill {
  id: string;
  title: string;
  description: string;
  category: SkillCategory;
  skillType: SkillType;
  level: SkillLevel;
  models: ModelTarget[];
  tags: string[];
  content: string; // May include {{variable}} syntax
  variables: SkillVariable[];
  isFavorite: boolean;
  usageCount: number;
  rating: number; // 1-5
  author?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SkillFilterState {
  search: string;
  category: string;
  skillType: string;
  level: string;
  onlyFavorites: boolean;
  model: string;
  sortBy: 'updatedAt' | 'title' | 'usageCount' | 'rating';
  sortOrder: 'asc' | 'desc';
}
