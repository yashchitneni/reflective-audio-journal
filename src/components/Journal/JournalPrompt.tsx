
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RefreshCw, ArrowRight } from 'lucide-react';
import { usePrompts } from '@/hooks/use-database';
import { Prompt } from '@/types/models';

const JournalPrompt = () => {
  const { prompts, loading } = usePrompts();
  const [currentPrompt, setCurrentPrompt] = useState<Prompt | null>(null);

  useEffect(() => {
    if (prompts.length > 0) {
      getRandomPrompt();
    }
  }, [prompts]);

  const getRandomPrompt = () => {
    if (prompts.length === 0) return;
    const randomIndex = Math.floor(Math.random() * prompts.length);
    setCurrentPrompt(prompts[randomIndex]);
  };

  if (loading) {
    return (
      <Card className="h-60">
        <CardContent className="p-6 flex items-center justify-center h-full">
          <p className="text-reflect-muted">Loading prompt...</p>
        </CardContent>
      </Card>
    );
  }

  if (!currentPrompt) {
    return (
      <Card className="h-60">
        <CardContent className="p-6 flex items-center justify-center h-full">
          <p className="text-reflect-muted">No prompts available</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-60">
      <CardContent className="p-6 flex flex-col justify-between h-full">
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-heading text-lg font-bold">Daily Prompt</h3>
            <Button variant="ghost" size="sm" onClick={getRandomPrompt}>
              <RefreshCw className="w-4 h-4 mr-1" />
              <span>New Prompt</span>
            </Button>
          </div>
          <p className="text-lg">{currentPrompt.prompt_text}</p>
        </div>
        
        <div className="mt-6">
          <Button className="reflect-button w-full group">
            <span>Start Writing</span>
            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default JournalPrompt;
