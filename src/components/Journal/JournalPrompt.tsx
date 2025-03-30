
import React, { useEffect, useState } from 'react';
import { 
  Card, 
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { SparklesIcon, ThumbsUpIcon, RefreshCwIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

interface Prompt {
  id: string;
  prompt_text: string;
}

const JournalPrompt = () => {
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [currentPrompt, setCurrentPrompt] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    fetchPrompts();
  }, []);

  const fetchPrompts = async () => {
    try {
      const { data, error } = await supabase
        .from('prompts')
        .select('id, prompt_text');

      if (error) {
        console.error('Error fetching prompts:', error);
        return;
      }

      if (data && data.length > 0) {
        setPrompts(data);
        // Set a random prompt to start
        const randomIndex = Math.floor(Math.random() * data.length);
        setCurrentPrompt(data[randomIndex].prompt_text);
      }
    } catch (error) {
      console.error('Error in fetchPrompts:', error);
    }
  };
  
  const getRandomPrompt = () => {
    if (prompts.length === 0) return;
    
    setIsLoading(true);
    
    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * prompts.length);
      const newPrompt = prompts[randomIndex].prompt_text;
      setCurrentPrompt(newPrompt);
      setIsLoading(false);
    }, 500);
  };

  if (!currentPrompt) {
    return (
      <Card className="reflect-card">
        <CardContent className="p-6 flex items-center justify-center">
          <p className="text-reflect-muted">Loading prompt...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="reflect-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <SparklesIcon className="w-5 h-5 text-reflect-secondary" />
          Today's Reflection Prompt
        </CardTitle>
        <CardDescription>
          Use this prompt as inspiration for your journal entry
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="bg-reflect-accent/20 rounded-md p-4 mb-4">
          <p className="text-lg font-medium italic">{currentPrompt}</p>
        </div>
        
        <div className="flex gap-3">
          <Button 
            variant="outline" 
            className="flex-1 gap-2"
            onClick={getRandomPrompt}
            disabled={isLoading}
          >
            <RefreshCwIcon className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            New Prompt
          </Button>
          <Link to="/new-entry" className="flex-1">
            <Button className="reflect-button w-full gap-2">
              <ThumbsUpIcon className="w-4 h-4" />
              Use This Prompt
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default JournalPrompt;
