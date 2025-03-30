
import React, { useState } from 'react';
import MainLayout from '@/components/Layout/MainLayout';
import { 
  Card, 
  CardContent,
  CardHeader,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  FileTextIcon,
  ImageIcon,
  MicIcon,
  SearchIcon,
  ArrowDownIcon,
  ArrowUpIcon,
  FilterIcon,
  Loader2Icon
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useJournalEntries } from '@/hooks/use-database';
import { format } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';

const JournalPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentTab, setCurrentTab] = useState('all');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  
  // Fetch real entries from Supabase with error handling
  const { entries, loading, error } = useJournalEntries(100); // Fetch more entries for the journal page
  
  // Filter entries based on search term and tab
  const filteredEntries = entries.filter(entry => {
    // Filter by search term
    const matchesSearch = 
      (entry.text_content && entry.text_content.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (entry.voice_transcript && entry.voice_transcript.toLowerCase().includes(searchTerm.toLowerCase()));
    
    // Filter by type
    if (currentTab === 'all') return matchesSearch;
    if (currentTab === 'text') return matchesSearch && entry.text_content;
    if (currentTab === 'voice') return matchesSearch && entry.voice_transcript;
    if (currentTab === 'photo') return matchesSearch && entry.photo_urls && (entry.photo_urls as string[]).length > 0;
    
    return matchesSearch;
  });
  
  // Sort entries by date
  const sortedEntries = [...filteredEntries].sort((a, b) => {
    const dateA = new Date(a.entry_date || a.created_at);
    const dateB = new Date(b.entry_date || b.created_at);
    
    if (sortDirection === 'desc') {
      return dateB.getTime() - dateA.getTime();
    } else {
      return dateA.getTime() - dateB.getTime();
    }
  });
  
  const toggleSortDirection = () => {
    setSortDirection(prevDirection => prevDirection === 'desc' ? 'asc' : 'desc');
  };

  // Helper function to get entry type icons
  const getEntryTypeIcon = (entry: any) => {
    if (entry.text_content) {
      return <FileTextIcon className="w-5 h-5 text-blue-500" />;
    } else if (entry.voice_transcript) {
      return <MicIcon className="w-5 h-5 text-red-500" />;
    } else if (entry.photo_urls && (entry.photo_urls as string[]).length > 0) {
      return <ImageIcon className="w-5 h-5 text-green-500" />;
    }
    return <FileTextIcon className="w-5 h-5 text-gray-500" />;
  };

  // Helper function to get entry preview text
  const getEntryPreview = (entry: any) => {
    if (entry.text_content) {
      return entry.text_content.slice(0, 120) + (entry.text_content.length > 120 ? '...' : '');
    } else if (entry.voice_transcript) {
      return entry.voice_transcript.slice(0, 120) + (entry.voice_transcript.length > 120 ? '...' : '');
    } else {
      return 'No text content available';
    }
  };

  // Render loading skeletons
  const renderSkeletons = () => {
    return Array(3).fill(0).map((_, index) => (
      <div key={index} className="py-4 px-3 -mx-3 rounded-md">
        <div className="flex items-start gap-3">
          <Skeleton className="w-5 h-5 mt-1 rounded-full" />
          <div className="w-full">
            <Skeleton className="h-4 w-32 mb-2" />
            <Skeleton className="h-5 w-48 mb-2" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3 mt-1" />
          </div>
        </div>
      </div>
    ));
  };

  // Render the entry list
  const renderEntries = () => {
    if (loading) {
      return renderSkeletons();
    }
    
    if (error) {
      return (
        <div className="py-8 text-center">
          <p className="text-reflect-muted">Error loading entries.</p>
          <p className="text-sm text-reflect-muted mt-1">{error.message}</p>
        </div>
      );
    }
    
    if (sortedEntries.length === 0) {
      return (
        <div className="py-8 text-center">
          <p className="text-reflect-muted">No entries found.</p>
          <p className="text-sm text-reflect-muted mt-1">
            {searchTerm ? 'Try adjusting your search or filters.' : 'Create your first journal entry.'}
          </p>
          <Link to="/new-entry">
            <Button className="mt-4 reflect-button">
              Create New Entry
            </Button>
          </Link>
        </div>
      );
    }
    
    return sortedEntries.map(entry => (
      <Link to={`/journal/${entry.id}`} key={entry.id}>
        <div className="py-4 hover:bg-gray-50 px-3 -mx-3 rounded-md transition-colors">
          <div className="flex items-start gap-3">
            <div className="mt-1">
              {getEntryTypeIcon(entry)}
            </div>
            <div>
              <p className="text-sm text-reflect-muted">
                {format(new Date(entry.entry_date || entry.created_at), 'EEEE, MMMM d, yyyy')}
              </p>
              <h3 className="font-medium text-lg">
                {format(new Date(entry.entry_date || entry.created_at), 'h:mm a')}
              </h3>
              <p className="line-clamp-2 text-reflect-muted mt-1">{getEntryPreview(entry)}</p>
            </div>
          </div>
        </div>
      </Link>
    ));
  };

  return (
    <MainLayout>
      <div className="mb-6 flex justify-between items-center">
        <h1 className="font-heading text-3xl font-bold">Your Journal</h1>
        <Link to="/new-entry">
          <Button className="reflect-button">New Entry</Button>
        </Link>
      </div>
      
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="relative w-full md:w-64">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-reflect-muted h-4 w-4" />
              <Input
                placeholder="Search entries..."
                className="pl-9 reflect-input"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={toggleSortDirection}
                className="flex items-center gap-1"
              >
                {sortDirection === 'desc' ? (
                  <>
                    <ArrowDownIcon className="h-4 w-4" />
                    <span>Newest</span>
                  </>
                ) : (
                  <>
                    <ArrowUpIcon className="h-4 w-4" />
                    <span>Oldest</span>
                  </>
                )}
              </Button>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="flex items-center gap-1">
                    <FilterIcon className="h-4 w-4" />
                    <span>Filter</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Filter by Type</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onSelect={() => setCurrentTab('all')}>
                    All Entries
                  </DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => setCurrentTab('text')}>
                    Text Entries
                  </DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => setCurrentTab('voice')}>
                    Voice Entries
                  </DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => setCurrentTab('photo')}>
                    Photo Entries
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <Tabs value={currentTab} onValueChange={setCurrentTab}>
            <TabsList className="grid w-full grid-cols-4 mb-6">
              <TabsTrigger value="all" className="flex items-center gap-1">
                All
              </TabsTrigger>
              <TabsTrigger value="text" className="flex items-center gap-1">
                <FileTextIcon className="h-4 w-4" />
                <span className="hidden sm:inline">Text</span>
              </TabsTrigger>
              <TabsTrigger value="voice" className="flex items-center gap-1">
                <MicIcon className="h-4 w-4" />
                <span className="hidden sm:inline">Voice</span>
              </TabsTrigger>
              <TabsTrigger value="photo" className="flex items-center gap-1">
                <ImageIcon className="h-4 w-4" />
                <span className="hidden sm:inline">Photo</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="all" className="mt-0">
              <div className="divide-y">
                {loading ? (
                  <div className="py-6 flex justify-center">
                    <Loader2Icon className="h-6 w-6 animate-spin text-reflect-muted" />
                  </div>
                ) : (
                  renderEntries()
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="text" className="mt-0">
              <div className="divide-y">
                {renderEntries()}
              </div>
            </TabsContent>
            
            <TabsContent value="voice" className="mt-0">
              <div className="divide-y">
                {renderEntries()}
              </div>
            </TabsContent>
            
            <TabsContent value="photo" className="mt-0">
              <div className="divide-y">
                {renderEntries()}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </MainLayout>
  );
};

export default JournalPage;
