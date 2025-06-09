import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Edit, Trash2, MessageSquare, Plus, X } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

interface CommunicationType {
  id: string;
  type: 'calendar' | 'blog' | 'youtube' | 'podcast' | 'survey' | 'poll' | 'homepage';
  title: string;
  url?: string;
  question?: string;
  options?: string[];
  imageSlots?: { slot1?: string; slot2?: string; slot3?: string };
}

const CommunicationTypeConfig = () => {
  const [communications, setCommunications] = useState<CommunicationType[]>([
    { id: '1', type: 'blog', title: 'Innovation Blog', url: 'https://example.com/blog' },
    { id: '2', type: 'youtube', title: 'Innovation Channel', url: 'https://youtube.com/channel/example' },
    { id: '3', type: 'poll', title: 'Innovation Readiness', question: 'How ready is your organization for innovation?', options: ['Very Ready', 'Somewhat Ready', 'Not Ready'] },
  ]);

  const [activeTab, setActiveTab] = useState('calendar');
  const [currentItem, setCurrentItem] = useState<Partial<CommunicationType>>({});
  const [isEditing, setIsEditing] = useState(false);
  const [pollOptions, setPollOptions] = useState<string[]>(['']);
  const { toast } = useToast();

  const communicationTypes = [
    { id: 'calendar', label: 'Events Calendar', description: 'Google Calendar Integration' },
    { id: 'blog', label: 'Innovation News / Blogs', description: 'Blog Site Links' },
    { id: 'youtube', label: 'YouTube', description: 'YouTube Channel Links' },
    { id: 'podcast', label: 'Podcast', description: 'Podcast Links' },
    { id: 'survey', label: 'Surveys', description: 'Survey Links' },
    { id: 'poll', label: 'Quick Poll', description: 'Configurable Poll Questions' },
    { id: 'homepage', label: 'Home Page Ads', description: 'Advertisement Slot Content' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentItem.title) {
      toast({
        title: "Error",
        description: "Please fill in the title field.",
        variant: "destructive",
      });
      return;
    }

    const newItem = {
      ...currentItem,
      type: activeTab as CommunicationType['type'],
      id: isEditing ? currentItem.id : Date.now().toString(),
      options: activeTab === 'poll' ? pollOptions.filter(opt => opt.trim()) : undefined,
    } as CommunicationType;

    if (isEditing) {
      setCommunications(prev => prev.map(item => 
        item.id === newItem.id ? newItem : item
      ));
      toast({
        title: "Success",
        description: "Item updated successfully.",
      });
    } else {
      setCommunications(prev => [...prev, newItem]);
      toast({
        title: "Success",
        description: "Item created successfully.",
      });
    }

    resetForm();
  };

  const handleEdit = (item: CommunicationType) => {
    setCurrentItem(item);
    setActiveTab(item.type);
    setIsEditing(true);
    if (item.options) {
      setPollOptions([...item.options, '']);
    }
  };

  const handleDelete = (id: string) => {
    setCommunications(prev => prev.filter(item => item.id !== id));
    toast({
      title: "Success",
      description: "Item deleted successfully.",
    });
  };

  const resetForm = () => {
    setCurrentItem({});
    setIsEditing(false);
    setPollOptions(['']);
  };

  const addPollOption = () => {
    setPollOptions(prev => [...prev, '']);
  };

  const updatePollOption = (index: number, value: string) => {
    setPollOptions(prev => prev.map((opt, i) => i === index ? value : opt));
  };

  const removePollOption = (index: number) => {
    setPollOptions(prev => prev.filter((_, i) => i !== index));
  };

  const filteredCommunications = communications.filter(item => item.type === activeTab);

  const renderForm = () => {
    switch (activeTab) {
      case 'calendar':
      case 'blog':
      case 'youtube':
      case 'podcast':
      case 'survey':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={currentItem.title || ''}
                onChange={(e) => setCurrentItem(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Enter title"
              />
            </div>
            <div>
              <Label htmlFor="url">URL *</Label>
              <Input
                id="url"
                type="url"
                value={currentItem.url || ''}
                onChange={(e) => setCurrentItem(prev => ({ ...prev, url: e.target.value }))}
                placeholder="Enter URL"
              />
            </div>
          </div>
        );

      case 'poll':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Poll Title *</Label>
              <Input
                id="title"
                value={currentItem.title || ''}
                onChange={(e) => setCurrentItem(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Enter poll title"
              />
            </div>
            <div>
              <Label htmlFor="question">Question *</Label>
              <Textarea
                id="question"
                value={currentItem.question || ''}
                onChange={(e) => setCurrentItem(prev => ({ ...prev, question: e.target.value }))}
                placeholder="Enter poll question"
              />
            </div>
            <div>
              <Label>Answer Options</Label>
              <div className="space-y-2">
                {pollOptions.map((option, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={option}
                      onChange={(e) => updatePollOption(index, e.target.value)}
                      placeholder={`Option ${index + 1}`}
                    />
                    {pollOptions.length > 1 && (
                      <Button type="button" variant="outline" size="sm" onClick={() => removePollOption(index)}>
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button type="button" variant="outline" size="sm" onClick={addPollOption}>
                  <Plus className="w-4 h-4" /> Add Option
                </Button>
              </div>
            </div>
          </div>
        );

      case 'homepage':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Advertisement Title *</Label>
              <Input
                id="title"
                value={currentItem.title || ''}
                onChange={(e) => setCurrentItem(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Enter advertisement title"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="slot1">Image Slot 1 URL</Label>
                <Input
                  id="slot1"
                  value={currentItem.imageSlots?.slot1 || ''}
                  onChange={(e) => setCurrentItem(prev => ({ 
                    ...prev, 
                    imageSlots: { ...prev.imageSlots, slot1: e.target.value }
                  }))}
                  placeholder="Enter image URL"
                />
              </div>
              <div>
                <Label htmlFor="slot2">Image Slot 2 URL</Label>
                <Input
                  id="slot2"
                  value={currentItem.imageSlots?.slot2 || ''}
                  onChange={(e) => setCurrentItem(prev => ({ 
                    ...prev, 
                    imageSlots: { ...prev.imageSlots, slot2: e.target.value }
                  }))}
                  placeholder="Enter image URL"
                />
              </div>
              <div>
                <Label htmlFor="slot3">Image Slot 3 URL</Label>
                <Input
                  id="slot3"
                  value={currentItem.imageSlots?.slot3 || ''}
                  onChange={(e) => setCurrentItem(prev => ({ 
                    ...prev, 
                    imageSlots: { ...prev.imageSlots, slot3: e.target.value }
                  }))}
                  placeholder="Enter image URL"
                />
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            Communication & Content Types Configuration
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4 lg:grid-cols-7">
              {communicationTypes.map((type) => (
                <TabsTrigger key={type.id} value={type.id} className="text-xs">
                  {type.id === 'calendar' ? 'Events' : type.label.split(' ')[0]}
                </TabsTrigger>
              ))}
            </TabsList>

            {communicationTypes.map((type) => (
              <TabsContent key={type.id} value={type.id} className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold">{type.label}</h3>
                  <p className="text-sm text-muted-foreground">{type.description}</p>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">
                      {isEditing ? `Edit ${type.label}` : `Add New ${type.label}`}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                      {renderForm()}
                      <div className="flex gap-2">
                        <Button type="submit">
                          {isEditing ? 'Update' : 'Add'} {type.label}
                        </Button>
                        {isEditing && (
                          <Button type="button" variant="outline" onClick={resetForm}>
                            Cancel
                          </Button>
                        )}
                      </div>
                    </form>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Existing {type.label} Items</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {filteredCommunications.length === 0 ? (
                        <p className="text-muted-foreground">No items configured yet.</p>
                      ) : (
                        filteredCommunications.map((item) => (
                          <div key={item.id} className="flex items-start justify-between p-3 border rounded-lg">
                            <div className="flex-1">
                              <h4 className="font-medium">{item.title}</h4>
                              {item.url && (
                                <p className="text-sm text-muted-foreground">URL: {item.url}</p>
                              )}
                              {item.question && (
                                <p className="text-sm text-muted-foreground">Question: {item.question}</p>
                              )}
                              {item.options && (
                                <div className="flex gap-1 mt-1 flex-wrap">
                                  {item.options.map((option, idx) => (
                                    <Badge key={idx} variant="outline" className="text-xs">
                                      {option}
                                    </Badge>
                                  ))}
                                </div>
                              )}
                              {item.imageSlots && (
                                <div className="text-sm text-muted-foreground mt-1">
                                  Slots: {Object.values(item.imageSlots).filter(Boolean).length} configured
                                </div>
                              )}
                            </div>
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm" onClick={() => handleEdit(item)}>
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button variant="outline" size="sm" onClick={() => handleDelete(item.id)}>
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default CommunicationTypeConfig;
