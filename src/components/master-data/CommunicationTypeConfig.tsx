import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Edit, Trash2, Save, X, MessageSquare, ExternalLink } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { useCommunicationTypes } from '@/hooks/useMasterDataCRUD';

const CommunicationTypeConfig = () => {
  const { toast } = useToast();
  const { items: channels, loading, addItem, updateItem, deleteItem } = useCommunicationTypes();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingValue, setEditingValue] = useState('');
  const [newChannel, setNewChannel] = useState({ name: '', link: '' });

  const handleAddChannel = async () => {
    if (!newChannel.name.trim() || !newChannel.link.trim()) {
      toast({
        title: "Missing Information",
        description: "Please provide both channel name and link.",
        variant: "destructive",
      });
      return;
    }

    const success = await addItem({
      name: newChannel.name.trim(),
      description: newChannel.link.trim(), // Store link in description field
      is_user_created: true
    });

    if (success) {
      setNewChannel({ name: '', link: '' });
      toast({
        title: "Success",
        description: "Communication channel added successfully.",
      });
    } else {
      toast({
        title: "Error",
        description: "Failed to add communication channel.",
        variant: "destructive",
      });
    }
  };

  const handleEditChannel = (id: string, currentValue: string) => {
    setEditingId(id);
    setEditingValue(currentValue);
  };

  const handleSaveEdit = async () => {
    if (!editingValue.trim() || !editingId) {
      toast({
        title: "Missing Information",
        description: "Please provide a valid link.",
        variant: "destructive",
      });
      return;
    }

    const success = await updateItem(editingId, { description: editingValue.trim() });
    
    if (success) {
      setEditingId(null);
      setEditingValue('');
      toast({
        title: "Success",
        description: "Communication channel updated successfully.",
      });
    } else {
      toast({
        title: "Error",
        description: "Failed to update communication channel.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteChannel = async (channelId: string) => {
    const success = await deleteItem(channelId);
    
    if (success) {
      toast({
        title: "Success",
        description: "Communication channel deleted successfully.",
      });
    } else {
      toast({
        title: "Error",
        description: "Failed to delete communication channel.",
        variant: "destructive",
      });
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingValue('');
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
                placeholder="e.g., Innovation Centre, Innovation News, Innovation Podcasts"
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
            <Button onClick={handleAddChannel} className="w-fit">
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
          {loading ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>Loading communication channels...</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {channels.length === 0 ? (
                <div className="text-center p-8 text-muted-foreground">
                  <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No communication channels configured yet.</p>
                  <p className="text-sm">Add your first channel above to get started.</p>
                </div>
              ) : (
                channels.map((channel, index) => (
                  <div key={channel.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                    {editingId === channel.id ? (
                      <div className="flex gap-2 flex-1 items-center">
                        <div className="flex-1">
                          <Label htmlFor={`link-${channel.id}`} className="text-sm font-medium">
                            {channel.name} Link
                          </Label>
                          <Input
                            id={`link-${channel.id}`}
                            value={editingValue}
                            onChange={(e) => setEditingValue(e.target.value)}
                            placeholder="Enter channel link (required)"
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
                            {channel.description ? (
                              <div className="flex items-center gap-2 mt-1">
                                <p className="text-sm text-muted-foreground truncate max-w-md">{channel.description}</p>
                                <Button
                                  onClick={() => openLink(channel.description)}
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
                            onClick={() => handleEditChannel(channel.id!, channel.description || '')}
                            variant="outline"
                            size="sm"
                            className="flex items-center gap-1"
                          >
                            <Edit className="w-3 h-3" />
                            Edit
                          </Button>
                          <Button
                            onClick={() => handleDeleteChannel(channel.id!)}
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
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CommunicationTypeConfig;