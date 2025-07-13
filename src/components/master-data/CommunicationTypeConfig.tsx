
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Edit, Trash2, Save, X, MessageSquare, ExternalLink } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { CommunicationTypeService, CommunicationChannel } from '@/utils/masterData/communicationTypeService';

const CommunicationTypeConfig = () => {
  const { toast } = useToast();
  const [channels, setChannels] = useState<CommunicationChannel[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingLink, setEditingLink] = useState('');
  const [newChannel, setNewChannel] = useState({ name: '', link: '' });

  const [isInitialized, setIsInitialized] = useState(false);

  // Load data on component mount
  useEffect(() => {
    const loadedChannels = CommunicationTypeService.getCommunicationChannels();
    console.log('🔍 CommunicationTypeConfig - Loaded channels from service:', loadedChannels);
    setChannels(loadedChannels);
    setIsInitialized(true);
  }, []);

  // Save data whenever channels change
  useEffect(() => {
    if (!isInitialized) {
      return;
    }
    console.log('💾 CommunicationTypeConfig - Saving channels to service:', channels.length);
    CommunicationTypeService.saveCommunicationChannels(channels);
  }, [channels, isInitialized]);

  const addChannel = () => {
    if (newChannel.name.trim() && newChannel.link.trim()) {
      const channel: CommunicationChannel = {
        id: Date.now().toString(),
        name: newChannel.name,
        link: newChannel.link,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      setChannels(prev => [...prev, channel]);
      setNewChannel({ name: '', link: '' });
      toast({
        title: "Success",
        description: "Communication channel added successfully",
      });
    } else {
      toast({
        title: "Error",
        description: "Please fill in both name and link fields",
        variant: "destructive"
      });
    }
  };

  const handleEdit = (channel: CommunicationChannel) => {
    setEditingId(channel.id);
    setEditingLink(channel.link);
  };

  const handleSaveEdit = () => {
    if (editingId && editingLink.trim()) {
      setChannels(prev => prev.map(channel => 
        channel.id === editingId 
          ? { ...channel, link: editingLink.trim(), updatedAt: new Date().toISOString() }
          : channel
      ));
      setEditingId(null);
      setEditingLink('');
      toast({
        title: "Success",
        description: "Communication channel updated successfully",
      });
    } else {
      toast({
        title: "Error",
        description: "Link field is required and cannot be empty",
        variant: "destructive"
      });
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingLink('');
  };

  const deleteChannel = (id: string) => {
    setChannels(prev => prev.filter(channel => channel.id !== id));
    toast({
      title: "Success",
      description: "Communication channel deleted successfully",
    });
  };

  const openLink = (link: string) => {
    if (link) {
      window.open(link, '_blank');
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            Add Communication Channel
          </CardTitle>
          <CardDescription>
            Create a new communication channel for the innovation platform
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="channel-name">Channel Name</Label>
              <Input
                id="channel-name"
                value={newChannel.name}
                onChange={(e) => setNewChannel(prev => ({ ...prev, name: e.target.value }))}
                placeholder="e.g., Innovation Centre, Innovation News, Innovation Podcasts, Innovation Articles"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="channel-link">Channel Link *</Label>
              <Input
                id="channel-link"
                value={newChannel.link}
                onChange={(e) => setNewChannel(prev => ({ ...prev, link: e.target.value }))}
                placeholder="Enter the URL for this channel (required)"
                required
              />
            </div>
            <Button onClick={addChannel} className="w-fit">
              <Plus className="w-4 h-4 mr-2" />
              Add Communication Channel
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Communication Channels</CardTitle>
          <CardDescription>
            Manage existing communication channels and their links
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4">
            {channels.length === 0 ? (
              <div className="text-center p-8 text-muted-foreground">
                <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No communication channels configured yet.</p>
                <p className="text-sm">Add your first channel above to get started.</p>
              </div>
            ) : (
              channels.map((channel) => (
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
                          placeholder={`Enter ${channel.name.toLowerCase()} link (required)`}
                          className="mt-1"
                          required
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
                           onClick={() => handleEdit(channel)}
                           variant="outline"
                           size="sm"
                           className="flex items-center gap-1"
                         >
                           <Edit className="w-3 h-3" />
                           Edit
                         </Button>
                         <Button
                           onClick={() => deleteChannel(channel.id)}
                           variant="destructive"
                           size="sm"
                           className="flex items-center gap-1"
                         >
                           <Trash2 className="w-3 h-3" />
                           Delete
                         </Button>
                       </div>
                    </>
                  )}
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CommunicationTypeConfig;
