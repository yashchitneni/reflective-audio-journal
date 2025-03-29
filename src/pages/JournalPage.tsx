
import React from 'react';
import MainLayout from '@/components/Layout/MainLayout';
import { 
  Card, 
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
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
  FilterIcon
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

// Mock data for journal entries
const mockEntries = [
  {
    id: '1',
    date: new Date(2023, 9, 20), // October 20, 2023
    type: 'text',
    title: 'Productive Day',
    preview: 'Today was a productive day. I finished the project ahead of schedule and had time to focus on some personal tasks as well...'
  },
  {
    id: '2',
    date: new Date(2023, 9, 19), // October 19, 2023
    type: 'voice',
    title: 'Feeling Overwhelmed',
    preview: 'I'm feeling a bit overwhelmed with the upcoming deadline, but I'm confident that I'll be able to manage my time effectively...'
  },
  {
    id: '3',
    date: new Date(2023, 9, 18), // October 18, 2023
    type: 'photo',
    title: 'Mountain Hike',
    preview: 'Went for a hike in the mountains. The view was breathtaking and really helped clear my mind. Nature always seems to have that effect on me...'
  },
  {
    id: '4',
    date: new Date(2023, 9, 17), // October 17, 2023
    type: 'text',
    title: 'Meeting Reflections',
    preview: 'Had an interesting meeting with the team today. We discussed some new ideas for the project and I'm excited to see how they'll develop...'
  },
  {
    id: '5',
    date: new Date(2023, 9, 16), // October 16, 2023
    type: 'voice',
    title: 'Evening Thoughts',
    preview: 'Just got back from dinner with friends. It was great catching up after so long. We reminisced about old times and made plans for a trip next month...'
  },
];

const JournalPage = () => {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [currentTab, setCurrentTab] = React.useState('all');
  const [sortDirection, setSortDirection] = React.useState<'asc' | 'desc'>('desc');
  
  // Filter entries based on search term and tab
  const filteredEntries = mockEntries.filter(entry => {
    // Filter by search term
    const matchesSearch = 
      entry.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.preview.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Filter by type
    if (currentTab === 'all') return matchesSearch;
    return matchesSearch && entry.type === currentTab;
  });
  
  // Sort entries by date
  const sortedEntries = [...filteredEntries].sort((a, b) => {
    if (sortDirection === 'desc') {
      return b.date.getTime() - a.date.getTime();
    } else {
      return a.date.getTime() - b.date.getTime();
    }
  });
  
  const toggleSortDirection = () => {
    setSortDirection(prevDirection => prevDirection === 'desc' ? 'asc' : 'desc');
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
                {sortedEntries.length > 0 ? (
                  sortedEntries.map(entry => (
                    <Link to={`/journal/${entry.id}`} key={entry.id}>
                      <div className="py-4 hover:bg-gray-50 px-3 -mx-3 rounded-md transition-colors">
                        <div className="flex items-start gap-3">
                          <div className="mt-1">
                            {entry.type === 'text' && (
                              <FileTextIcon className="w-5 h-5 text-blue-500" />
                            )}
                            {entry.type === 'voice' && (
                              <MicIcon className="w-5 h-5 text-red-500" />
                            )}
                            {entry.type === 'photo' && (
                              <ImageIcon className="w-5 h-5 text-green-500" />
                            )}
                          </div>
                          <div>
                            <p className="text-sm text-reflect-muted">
                              {entry.date.toLocaleDateString('en-US', { 
                                weekday: 'long', 
                                month: 'short', 
                                day: 'numeric',
                                year: 'numeric'
                              })}
                            </p>
                            <h3 className="font-medium text-lg">{entry.title}</h3>
                            <p className="line-clamp-2 text-reflect-muted mt-1">{entry.preview}</p>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))
                ) : (
                  <div className="py-8 text-center">
                    <p className="text-reflect-muted">No entries found.</p>
                    <p className="text-sm text-reflect-muted mt-1">
                      Try adjusting your search or filters.
                    </p>
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="text" className="mt-0">
              {/* Text entries content - similar structure to "all" but filtered */}
              <div className="divide-y">
                {sortedEntries.length > 0 ? (
                  sortedEntries.map(entry => (
                    <Link to={`/journal/${entry.id}`} key={entry.id}>
                      <div className="py-4 hover:bg-gray-50 px-3 -mx-3 rounded-md transition-colors">
                        <div className="flex items-start gap-3">
                          <FileTextIcon className="w-5 h-5 text-blue-500 mt-1" />
                          <div>
                            <p className="text-sm text-reflect-muted">
                              {entry.date.toLocaleDateString('en-US', { 
                                weekday: 'long', 
                                month: 'short', 
                                day: 'numeric',
                                year: 'numeric'
                              })}
                            </p>
                            <h3 className="font-medium text-lg">{entry.title}</h3>
                            <p className="line-clamp-2 text-reflect-muted mt-1">{entry.preview}</p>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))
                ) : (
                  <div className="py-8 text-center">
                    <p className="text-reflect-muted">No text entries found.</p>
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="voice" className="mt-0">
              {/* Voice entries content - similar structure */}
              <div className="divide-y">
                {sortedEntries.length > 0 ? (
                  sortedEntries.map(entry => (
                    <Link to={`/journal/${entry.id}`} key={entry.id}>
                      <div className="py-4 hover:bg-gray-50 px-3 -mx-3 rounded-md transition-colors">
                        <div className="flex items-start gap-3">
                          <MicIcon className="w-5 h-5 text-red-500 mt-1" />
                          <div>
                            <p className="text-sm text-reflect-muted">
                              {entry.date.toLocaleDateString('en-US', { 
                                weekday: 'long', 
                                month: 'short', 
                                day: 'numeric',
                                year: 'numeric'
                              })}
                            </p>
                            <h3 className="font-medium text-lg">{entry.title}</h3>
                            <p className="line-clamp-2 text-reflect-muted mt-1">{entry.preview}</p>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))
                ) : (
                  <div className="py-8 text-center">
                    <p className="text-reflect-muted">No voice entries found.</p>
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="photo" className="mt-0">
              {/* Photo entries content - similar structure */}
              <div className="divide-y">
                {sortedEntries.length > 0 ? (
                  sortedEntries.map(entry => (
                    <Link to={`/journal/${entry.id}`} key={entry.id}>
                      <div className="py-4 hover:bg-gray-50 px-3 -mx-3 rounded-md transition-colors">
                        <div className="flex items-start gap-3">
                          <ImageIcon className="w-5 h-5 text-green-500 mt-1" />
                          <div>
                            <p className="text-sm text-reflect-muted">
                              {entry.date.toLocaleDateString('en-US', { 
                                weekday: 'long', 
                                month: 'short', 
                                day: 'numeric',
                                year: 'numeric'
                              })}
                            </p>
                            <h3 className="font-medium text-lg">{entry.title}</h3>
                            <p className="line-clamp-2 text-reflect-muted mt-1">{entry.preview}</p>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))
                ) : (
                  <div className="py-8 text-center">
                    <p className="text-reflect-muted">No photo entries found.</p>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </MainLayout>
  );
};

export default JournalPage;
