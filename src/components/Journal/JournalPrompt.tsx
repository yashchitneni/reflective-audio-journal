
import React from 'react';
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

interface JournalPromptProps {
  initialPrompt?: string;
}

const prompts = [
  "What are three things you're grateful for today?",
  "What's something that challenged you today and how did you respond?",
  "What's one thing you'd like to accomplish tomorrow?",
  "Describe a moment that made you smile today.",
  "What's something you learned about yourself recently?",
  "If today was a color, what would it be and why?",
  "What's one thing you can do today to take care of yourself?",
  "What's a small win you experienced in the last 24 hours?",
  "Who is someone that made a positive impact on your day?",
  "What's something you're looking forward to in the near future?"
];

const JournalPrompt: React.FC<JournalPromptProps> = ({ initialPrompt }) => {
  const [currentPrompt, setCurrentPrompt] = React.useState(initialPrompt || prompts[0]);
  const [isLoading, setIsLoading] = React.useState(false);
  
  const getRandomPrompt = () => {
    setIsLoading(true);
    
    // Simulate API call for new prompt
    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * prompts.length);
      const newPrompt = prompts[randomIndex];
      setCurrentPrompt(newPrompt);
      setIsLoading(false);
    }, 500);
  };

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
