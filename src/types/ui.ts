// UI Component Types and Interfaces

export interface TransformationParameters {
  translation: { x: number; y: number; z: number };
  rotation: { x: number; y: number; z: number };
  scale: { x: number; y: number; z: number };
}

export interface VisualizationConfig {
  gridSize: number;
  axisLength: number;
  showGrid: boolean;
  showAxes: boolean;
  backgroundColor: string;
  cameraPosition: { x: number; y: number; z: number };
  lightIntensity: number;
}

export interface FunctionVisualization {
  id: string;
  expression: string;
  type: 'line' | 'surface' | 'volume' | 'parametric';
  color: string;
  opacity: number;
  visible: boolean;
  transformations: TransformationParameters;
}

export interface ConceptCardProps {
  concept: {
    id: string;
    title: string;
    description: string;
    difficulty: string;
    category: string;
    estimatedTime: number;
    progress?: number;
  };
  onSelect: (conceptId: string) => void;
  isSelected?: boolean;
}

export interface QuizCardProps {
  quiz: {
    id: string;
    title: string;
    description?: string;
    difficulty: string;
    timeLimit?: number;
    questionCount: number;
    bestScore?: number;
  };
  onStart: (quizId: string) => void;
}

export interface ProgressCardProps {
  title: string;
  current: number;
  total: number;
  percentage: number;
  color?: string;
  icon?: React.ReactNode;
}

export interface AchievementBadgeProps {
  achievement: {
    id: string;
    name: string;
    description: string;
    icon: string;
    category: string;
    isUnlocked: boolean;
    progress?: number;
  };
  size?: 'sm' | 'md' | 'lg';
}

export interface AIMessageProps {
  message: {
    id: string;
    type: 'user' | 'ai';
    content: string;
    timestamp: string;
    context?: any;
  };
}

export interface StudyTimerProps {
  isActive: boolean;
  duration: number;
  onStart: () => void;
  onPause: () => void;
  onStop: () => void;
}

export interface NavigationItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  path: string;
  badge?: number;
  isActive?: boolean;
}

export interface FilterOptions {
  category?: string;
  difficulty?: string;
  status?: string;
  tags?: string[];
}

export interface SortOptions {
  field: string;
  direction: 'asc' | 'desc';
}

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  showFirstLast?: boolean;
}

export interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  suggestions?: string[];
  onSuggestionSelect?: (suggestion: string) => void;
}

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  children: React.ReactNode;
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  description?: string;
  duration?: number;
}

export interface LoadingState {
  isLoading: boolean;
  message?: string;
  progress?: number;
}

export interface ErrorState {
  hasError: boolean;
  message?: string;
  details?: string;
  retry?: () => void;
}
