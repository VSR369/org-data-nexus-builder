
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, Save, X, MessageSquare, ExternalLink } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { LegacyDataManager } from '@/utils/core/DataManager';

interface CommunicationChannel {
  id: string;
  name: string;
  link: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

const predefinedChannels = [
  { name: 'Innovation Centre', placeholder: 'YouTube link' },
  { name: 'Innovation News', placeholder: 'Blog Link' },
  { name: 'Innovation Podcasts', placeholder: 'Podcast link' },
  { name: 'Innovation Articles', placeholder: 'Blog Link' }
];

const defaultChannels: CommunicationChannel[] = predefinedChannels.map((channel, index) => ({
  id: (index + 1).toString(),
  name: channel.name,
  link: '',
  isActive: true,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
}));

const channelsDataManager = new LegacyDataManager<CommunicationChannel[]>({
  key: 'master_data_communication_channels',
  defaultData: defaultChannels,
  version: 1
});

const CommunicationTypeConfig = () => {
  const { toast } = useToast();
  const [channels, setChannels] = useState<CommunicationChannel[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingLink, setEditingLink] = useState('');

  // Load data on component mount
  useEffect(() => {
    const loadedChannels = channelsDataManager.loadData();
    setChannels(loadedChannels);
  }, []);

  // Save data whenever channels change
  useEffect(() => {
    if (channels.length > 0) {
      channelsDataManager.saveData(channels);
    }
  }, [channels]);

  const handleEdit = (channel: CommunicationChannel) => {
    setEditingId(channel.id);
    setEditingLink(channel.link);
  };

  const handleSaveEdit = () => {
    if (editingId) {
      setChannels(prev => prev.map(channel => 
        channel.id === editingId 
          ? { ...channel, link: editingLink, updatedAt: new Date().toISOString() }
          : channel
      ));
      setEditingId(null);
      setEditingLink('');
      toast({
        title: "Success",
        description: "Communication channel updated successfully",
      });
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingLink('');
  };

  const toggleActive = (id: string) => {
    setChannels(prev => prev.map(channel => 
      channel.id === id ? { ...channel, isActive: !channel.isActive, updatedAt: new Date().toISOString() } : channel
    ));
    toast({
      title: "Success",
      description: "Channel status updated successfully",
    });
  };

  const openLink = (link: string) => {
    if (link) {
      window.open(link, '_blank');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="w-5 h-5" />
          Communication Channels
        </CardTitle>
        <CardDescription>
          Configure communication channels and their links for the innovation platform
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4">
          {channels.map((channel) => (
            <div key={channel.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
              {editingId === channel.id ? (
                <div className="flex gap-2 flex-1 items-center">
                  <div className="flex-1">
                    <Label htmlFor={`link-${channel.id}`} className="text-sm font-medium">
                      {channel.name} Link
                    </Label>
                    <Input
                      id={`link-${channel.id}`}
                      value={editingLink}
                      onChange={(e) => setEditingLink(e.target.value)}
                      placeholder={`Enter ${channel.name.toLowerCase()} link`}
                      className="mt-1"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={handleSaveEdit} size="sm" className="flex items-center gap-1">
                      <Save className="w-3 h-3" />
                      Save
                    </Button>
                    <Button onClick={handleCancelEdit} variant="outline" size="sm" className="flex items-center gap-1">
                      <X className="w-3 h-3" />
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-3 flex-1">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{channel.name}</span>
                        <Badge variant={channel.isActive ? "default" : "secondary"}>
                          {channel.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                      {channel.link ? (
                        <div className="flex items-center gap-2 mt-1">
                          <p className="text-sm text-muted-foreground truncate max-w-md">{channel.link}</p>
                          <Button
                            onClick={() => openLink(channel.link)}
                            variant="ghost"
                            size="sm"
                            className="flex items-center gap-1 h-6 px-2"
                          >
                            <ExternalLink className="w-3 h-3" />
                          </Button>
                        </div>
                      ) : (
                        <p className="text-sm text-muted-foreground mt-1">No link configured</p>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => toggleActive(channel.id)}
                      variant="outline"
                      size="sm"
                    >
                      {channel.isActive ? "Deactivate" : "Activate"}
                    </Button>
                    <Button
                      onClick={() => handleEdit(channel)}
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-1"
                    >
                      <Edit className="w-3 h-3" />
                      Edit
                    </Button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default CommunicationTypeConfig;
