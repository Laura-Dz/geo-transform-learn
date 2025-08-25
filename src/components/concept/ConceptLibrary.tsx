import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BookOpen, Clock, Star, Filter, Search, Play, CheckCircle } from 'lucide-react';
import { Concept, Category, Difficulty } from '@/types/database';

// Mock concept data
const MOCK_CONCEPTS: Concept[] = [
  {
    id: '1',
    title: 'Linear Functions',
    description: 'Understanding linear relationships and their graphical representations',
    content: 'Linear functions form the foundation of algebra and represent constant rates of change...',
    difficulty: 'EASY',
    category: 'ALGEBRA',
    tags: ['functions', 'graphing', 'slope'],
    prerequisites: [],
    estimatedTime: 30,
    isPublished: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    examples: [
      {
        id: 'ex1',
        conceptId: '1',
        title: 'Basic Linear Function',
        functionExpression: 'x',
        explanation: 'The simplest linear function f(x) = x creates a diagonal line through the origin',
        createdAt: new Date().toISOString(),
        concept: {} as Concept
      }
    ]
  },
  {
    id: '2',
    title: 'Quadratic Functions',
    description: 'Exploring parabolic curves and their properties',
    content: 'Quadratic functions create parabolic curves and are fundamental in many areas of mathematics...',
    difficulty: 'MEDIUM',
    category: 'ALGEBRA',
    tags: ['quadratic', 'parabola', 'vertex'],
    prerequisites: ['1'],
    estimatedTime: 45,
    isPublished: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    examples: [
      {
        id: 'ex2',
        conceptId: '2',
        title: 'Standard Parabola',
        functionExpression: 'x^2',
        explanation: 'The function f(x) = x² creates a U-shaped parabola opening upward',
        createdAt: new Date().toISOString(),
        concept: {} as Concept
      }
    ]
  },
  {
    id: '3',
    title: 'Trigonometric Functions',
    description: 'Understanding sine, cosine, and tangent functions',
    content: 'Trigonometric functions describe periodic phenomena and circular motion...',
    difficulty: 'MEDIUM',
    category: 'TRIGONOMETRY',
    tags: ['sine', 'cosine', 'periodic'],
    prerequisites: ['1'],
    estimatedTime: 60,
    isPublished: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    examples: [
      {
        id: 'ex3',
        conceptId: '3',
        title: 'Sine Wave',
        functionExpression: 'sin(x)',
        explanation: 'The sine function creates a smooth wave oscillating between -1 and 1',
        createdAt: new Date().toISOString(),
        concept: {} as Concept
      }
    ]
  },
  {
    id: '4',
    title: 'Parametric Equations',
    description: 'Creating curves using parameter-based equations',
    content: 'Parametric equations allow us to describe complex curves and surfaces...',
    difficulty: 'HARD',
    category: 'GEOMETRY',
    tags: ['parametric', 'curves', '3d'],
    prerequisites: ['1', '3'],
    estimatedTime: 75,
    isPublished: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    examples: [
      {
        id: 'ex4',
        conceptId: '4',
        title: 'Parametric Circle',
        functionExpression: 'x = cos(t), y = sin(t)',
        explanation: 'These parametric equations create a perfect circle in 2D space',
        createdAt: new Date().toISOString(),
        concept: {} as Concept
      }
    ]
  },
  {
    id: '5',
    title: 'Multivariable Functions',
    description: 'Functions with multiple input variables creating 3D surfaces',
    content: 'Multivariable functions extend our understanding to three-dimensional space...',
    difficulty: 'EXPERT',
    category: 'CALCULUS',
    tags: ['multivariable', '3d', 'surfaces'],
    prerequisites: ['1', '2'],
    estimatedTime: 90,
    isPublished: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    examples: [
      {
        id: 'ex5',
        conceptId: '5',
        title: '3D Paraboloid',
        functionExpression: 'x^2 + y^2',
        explanation: 'This function creates a bowl-shaped 3D surface called a paraboloid',
        createdAt: new Date().toISOString(),
        concept: {} as Concept
      }
    ]
  }
];

// Mock progress data
const MOCK_PROGRESS: Record<string, { completion: number; status: string }> = {
  '1': { completion: 100, status: 'COMPLETED' },
  '2': { completion: 75, status: 'IN_PROGRESS' },
  '3': { completion: 0, status: 'NOT_STARTED' },
  '4': { completion: 0, status: 'NOT_STARTED' },
  '5': { completion: 0, status: 'NOT_STARTED' }
};

interface ConceptLibraryProps {
  onConceptSelect: (concept: Concept) => void;
}

const ConceptLibrary: React.FC<ConceptLibraryProps> = ({ onConceptSelect }) => {
  const [concepts, setConcepts] = useState<Concept[]>(MOCK_CONCEPTS);
  const [filteredConcepts, setFilteredConcepts] = useState<Concept[]>(MOCK_CONCEPTS);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  useEffect(() => {
    let filtered = concepts;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(concept =>
        concept.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        concept.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        concept.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(concept => concept.category === selectedCategory);
    }

    // Filter by difficulty
    if (selectedDifficulty !== 'all') {
      filtered = filtered.filter(concept => concept.difficulty === selectedDifficulty);
    }

    // Filter by status
    if (selectedStatus !== 'all') {
      filtered = filtered.filter(concept => {
        const progress = MOCK_PROGRESS[concept.id];
        return progress?.status === selectedStatus;
      });
    }

    setFilteredConcepts(filtered);
  }, [concepts, searchTerm, selectedCategory, selectedDifficulty, selectedStatus]);

  const getDifficultyColor = (difficulty: Difficulty) => {
    switch (difficulty) {
      case 'EASY': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'MEDIUM': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'HARD': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      case 'EXPERT': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getStatusIcon = (conceptId: string) => {
    const progress = MOCK_PROGRESS[conceptId];
    if (progress?.status === 'COMPLETED') {
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    }
    if (progress?.status === 'IN_PROGRESS') {
      return <Play className="h-4 w-4 text-blue-500" />;
    }
    return null;
  };

  const ConceptCard = ({ concept }: { concept: Concept }) => {
    const progress = MOCK_PROGRESS[concept.id];
    
    return (
      <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => onConceptSelect(concept)}>
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                {getStatusIcon(concept.id)}
                <CardTitle className="text-lg">{concept.title}</CardTitle>
              </div>
              <CardDescription className="text-sm">{concept.description}</CardDescription>
            </div>
            <Badge className={getDifficultyColor(concept.difficulty)}>
              {concept.difficulty}
            </Badge>
          </div>
        </CardHeader>
        
        <CardContent className="pt-0">
          <div className="space-y-3">
            {/* Progress bar */}
            {progress && (
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span>Progress</span>
                  <span>{progress.completion}%</span>
                </div>
                <Progress value={progress.completion} className="h-2" />
              </div>
            )}

            {/* Tags */}
            <div className="flex flex-wrap gap-1">
              {concept.tags.slice(0, 3).map((tag, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
              {concept.tags.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{concept.tags.length - 3} more
                </Badge>
              )}
            </div>

            {/* Meta info */}
            <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
              <div className="flex items-center space-x-1">
                <Clock className="h-4 w-4" />
                <span>{concept.estimatedTime} min</span>
              </div>
              <div className="flex items-center space-x-1">
                <BookOpen className="h-4 w-4" />
                <span>{concept.examples?.length || 0} examples</span>
              </div>
            </div>

            {/* Prerequisites */}
            {concept.prerequisites.length > 0 && (
              <div className="text-sm">
                <span className="text-gray-500 dark:text-gray-400">Prerequisites: </span>
                <span className="text-blue-600 dark:text-blue-400">
                  {concept.prerequisites.length} concept{concept.prerequisites.length > 1 ? 's' : ''}
                </span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Concept Library</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Explore mathematical concepts with interactive 3D visualizations
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="text-sm">
            {filteredConcepts.length} concepts
          </Badge>
        </div>
      </div>

      {/* Search and Filters */}
      <Card className="p-4">
        <div className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search concepts, topics, or tags..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-gray-500" />
              <span className="text-sm font-medium">Filters:</span>
            </div>
            
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="ALGEBRA">Algebra</SelectItem>
                <SelectItem value="GEOMETRY">Geometry</SelectItem>
                <SelectItem value="CALCULUS">Calculus</SelectItem>
                <SelectItem value="TRIGONOMETRY">Trigonometry</SelectItem>
                <SelectItem value="STATISTICS">Statistics</SelectItem>
                <SelectItem value="LINEAR_ALGEBRA">Linear Algebra</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Difficulty" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>
                <SelectItem value="EASY">Easy</SelectItem>
                <SelectItem value="MEDIUM">Medium</SelectItem>
                <SelectItem value="HARD">Hard</SelectItem>
                <SelectItem value="EXPERT">Expert</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="NOT_STARTED">Not Started</SelectItem>
                <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                <SelectItem value="COMPLETED">Completed</SelectItem>
                <SelectItem value="MASTERED">Mastered</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      {/* Concepts Grid */}
      <Tabs defaultValue="grid" className="space-y-4">
        <TabsList>
          <TabsTrigger value="grid">Grid View</TabsTrigger>
          <TabsTrigger value="list">List View</TabsTrigger>
        </TabsList>

        <TabsContent value="grid">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredConcepts.map((concept) => (
              <ConceptCard key={concept.id} concept={concept} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="list">
          <div className="space-y-4">
            {filteredConcepts.map((concept) => (
              <Card key={concept.id} className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => onConceptSelect(concept)}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center space-x-3">
                        {getStatusIcon(concept.id)}
                        <h3 className="font-semibold text-lg">{concept.title}</h3>
                        <Badge className={getDifficultyColor(concept.difficulty)}>
                          {concept.difficulty}
                        </Badge>
                      </div>
                      <p className="text-gray-600 dark:text-gray-400">{concept.description}</p>
                      <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                        <div className="flex items-center space-x-1">
                          <Clock className="h-4 w-4" />
                          <span>{concept.estimatedTime} min</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <BookOpen className="h-4 w-4" />
                          <span>{concept.examples?.length || 0} examples</span>
                        </div>
                      </div>
                    </div>
                    {MOCK_PROGRESS[concept.id] && (
                      <div className="w-32">
                        <div className="text-right text-sm mb-1">
                          {MOCK_PROGRESS[concept.id].completion}%
                        </div>
                        <Progress value={MOCK_PROGRESS[concept.id].completion} className="h-2" />
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Empty state */}
      {filteredConcepts.length === 0 && (
        <Card className="p-12 text-center">
          <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            No concepts found
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Try adjusting your search terms or filters
          </p>
          <Button
            variant="outline"
            onClick={() => {
              setSearchTerm('');
              setSelectedCategory('all');
              setSelectedDifficulty('all');
              setSelectedStatus('all');
            }}
          >
            Clear Filters
          </Button>
        </Card>
      )}
    </div>
  );
};

export default ConceptLibrary;
