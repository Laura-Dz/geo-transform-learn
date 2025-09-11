import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Upload, FileText, Send } from 'lucide-react';

interface StudentInputZoneProps {
  onSubmit: (data: {
    file?: File;
    text: string;
    caption: string;
  }) => void;
  isLoading: boolean;
}

const StudentInputZone: React.FC<StudentInputZoneProps> = ({ onSubmit, isLoading }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [textInput, setTextInput] = useState('');
  const [caption, setCaption] = useState('');

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    setSelectedFile(file);
  };

  const handleSubmit = () => {
    if (!textInput.trim() && !selectedFile) return;
    
    onSubmit({
      file: selectedFile || undefined,
      text: textInput,
      caption: caption
    });
    
    // Reset form
    setTextInput('');
    setCaption('');
    setSelectedFile(null);
    if (document.getElementById('file-upload') as HTMLInputElement) {
      (document.getElementById('file-upload') as HTMLInputElement).value = '';
    }
  };

  return (
    <Card className="bg-black/30 border-white/20 h-fit">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Share Your Learning
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* File Upload */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-300">Upload Document</label>
          <div className="relative">
            <input
              id="file-upload"
              type="file"
              accept=".pdf,.png,.jpg,.jpeg,.txt,.doc,.docx"
              onChange={handleFileChange}
              className="hidden"
            />
            <label
              htmlFor="file-upload"
              className="flex items-center justify-center w-full p-4 border-2 border-dashed border-white/30 rounded-lg cursor-pointer hover:border-white/50 transition-colors bg-black/20"
            >
              <div className="text-center">
                <Upload className="mx-auto h-8 w-8 text-gray-400" />
                <p className="mt-2 text-sm text-gray-300">
                  {selectedFile ? selectedFile.name : 'Click to upload or drag & drop'}
                </p>
                <p className="text-xs text-gray-400">PDF, Images, Text files</p>
              </div>
            </label>
          </div>
        </div>

        {/* Text Input */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-300">Ask a Question</label>
          <Textarea
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            placeholder="What would you like to explore or understand better?"
            className="bg-black/50 border-white/30 text-white placeholder:text-gray-400 resize-none"
            rows={4}
          />
        </div>

        {/* Caption/Description */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-300">Context (Optional)</label>
          <Input
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            placeholder="Add context or describe what you're working on"
            className="bg-black/50 border-white/30 text-white placeholder:text-gray-400"
          />
        </div>

        {/* Submit Button */}
        <Button
          onClick={handleSubmit}
          disabled={(!textInput.trim() && !selectedFile) || isLoading}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-3 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Analyzing...
            </>
          ) : (
            <>
              <Send className="h-4 w-4 mr-2" />
              Ask the Tutor
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};

export default StudentInputZone;