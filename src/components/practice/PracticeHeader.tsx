
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RotateCcw } from 'lucide-react';

interface PracticeHeaderProps {
  attempts: number;
  onReset: () => void;
}

export function PracticeHeader({ attempts, onReset }: PracticeHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <h1 className="text-3xl font-bold text-white">Practice Mode</h1>
      <div className="flex items-center space-x-4">
        <Badge variant="outline" className="border-cyan-400 text-cyan-400">
          Attempts: {attempts}
        </Badge>
        <Button onClick={onReset} variant="outline" size="sm">
          <RotateCcw className="h-4 w-4 mr-2" />
          Reset
        </Button>
      </div>
    </div>
  );
}
