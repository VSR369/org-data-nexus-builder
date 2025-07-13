import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Edit, Trash2, Save, X, MessageSquare, ExternalLink } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface CommunicationType {
  id?: string;
  name: string;
  description?: string;
  link?: string;
  created_at?: string;
  updated_at?: string;
}

const CommunicationTypeConfigSupabase = () => {
  const { toast } = useToast();
  const [types, setTypes] = useState<CommunicationType[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');
  const [editingDescription, setEditingDescription] = useState('');
  const [editingLink, setEditingLink] = useState('');
  const [newType, setNewType] = useState({ name: '', description: '', link: '' });
  const [loading, setLoading] = useState(false);

  // Load data on component mount
  useEffect(() => {
    loadTypes();
  }, []);

  const loadTypes = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('master_communication_types')
        .select('*')
        .order('name');
      
      if (error) throw error;
      setTypes(data || []);
    } catch (error) {
      console.error('Error loading communication types:', error);
      toast({
        title: "Error",
        description: "Failed to load communication types",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addType = async () => {
    if (newType.name) {
      try {
        const { error } = await supabase
          .from('master_communication_types')
          .insert({
            name: newType.name,
            description: newType.description || undefined,
            link: newType.link || undefined
          });

        if (error) throw error;
        
        setNewType({ name: '', description: '', link: '' });
        loadTypes();
        toast({
          title: "Success",
          description: "Communication type added successfully",
        });
      } catch (error) {
        console.error('Error adding communication type:', error);
        toast({
          title: "Error",
          description: "Failed to add communication type",
          variant: "destructive"
        });
      }
    } else {
      toast({
        title: "Error",
        description: "Please fill in the name field",
        variant: "destructive"
      });
    }
  };

  const handleEdit = (type: CommunicationType) => {
    setEditingId(type.id!);
    setEditingName(type.name);
    setEditingDescription(type.description || '');
    setEditingLink(type.link || '');
  };

  const handleSaveEdit = async () => {
    if (editingId && editingName) {
      try {
        const { error } = await supabase
          .from('master_communication_types')
          .update({ 
            name: editingName,
            description: editingDescription || undefined,
            link: editingLink || undefined
          })
          .eq('id', editingId);

        if (error) throw error;
        
        setEditingId(null);
        setEditingName('');
        setEditingDescription('');
        setEditingLink('');
        loadTypes();
        toast({
          title: "Success",
          description: "Communication type updated successfully",
        });
      } catch (error) {
        console.error('Error updating communication type:', error);
        toast({
          title: "Error",
          description: "Failed to update communication type",
          variant: "destructive",
        });
      }
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingName('');
    setEditingDescription('');
    setEditingLink('');
  };

  const deleteType = async (id: string) => {
    try {
      const { error } = await supabase
        .from('master_communication_types')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      loadTypes();
      toast({
        title: "Success",
        description: "Communication type deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting communication type:', error);
      toast({
        title: "Error",
        description: "Failed to delete communication type",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            Add Communication Type
          </CardTitle>
          <CardDescription>
            Create a new communication type for the innovation platform
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="type-name">Type Name</Label>
              <Input
                id="type-name"
                value={newType.name}
                onChange={(e) => setNewType(prev => ({ ...prev, name: e.target.value }))}
                placeholder="e.g., Innovation Centre, Innovation News, Innovation Podcasts, Innovation Articles"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="type-description">Description (Optional)</Label>
              <Input
                id="type-description"
                value={newType.description}
                onChange={(e) => setNewType(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Enter the description for this communication type"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="type-link">Link (Optional)</Label>
              <Input
                id="type-link"
                value={newType.link}
                onChange={(e) => setNewType(prev => ({ ...prev, link: e.target.value }))}
                placeholder="e.g., https://youtube.com/channel/example, https://blog.example.com"
                type="url"
              />
            </div>
            <Button onClick={addType} className="w-fit" disabled={loading}>
              <Plus className="w-4 h-4 mr-2" />
              Add Communication Type
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Communication Types</CardTitle>
          <CardDescription>
            Manage existing communication types and their descriptions
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4">
            {loading ? (
              <p className="text-muted-foreground text-center py-8">Loading...</p>
            ) : types.length === 0 ? (
              <div className="text-center p-8 text-muted-foreground">
                <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No communication types configured yet.</p>
                <p className="text-sm">Add your first communication type above to get started.</p>
              </div>
            ) : (
              types.map((type) => (
                <div key={type.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                  {editingId === type.id ? (
                    <div className="flex gap-2 flex-1 items-center">
                      <div className="flex-1 space-y-2">
                        <div>
                          <Label htmlFor={`name-${type.id}`} className="text-sm font-medium">
                            Type Name
                          </Label>
                          <Input
                            id={`name-${type.id}`}
                            value={editingName}
                            onChange={(e) => setEditingName(e.target.value)}
                            placeholder="Enter type name"
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor={`desc-${type.id}`} className="text-sm font-medium">
                            Description
                          </Label>
                          <Input
                            id={`desc-${type.id}`}
                            value={editingDescription}
                            onChange={(e) => setEditingDescription(e.target.value)}
                            placeholder="Enter description (optional)"
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor={`link-${type.id}`} className="text-sm font-medium">
                            Link
                          </Label>
                          <Input
                            id={`link-${type.id}`}
                            value={editingLink}
                            onChange={(e) => setEditingLink(e.target.value)}
                            placeholder="Enter link (optional)"
                            type="url"
                            className="mt-1"
                          />
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button onClick={handleSaveEdit} size="sm" className="flex items-center gap-1" disabled={loading}>
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
                             <span className="font-medium">{type.name}</span>
                             {type.link && (
                               <a
                                 href={type.link}
                                 target="_blank"
                                 rel="noopener noreferrer"
                                 className="text-primary hover:text-primary/80 transition-colors"
                                 title="Visit link"
                               >
                                 <ExternalLink className="w-4 h-4" />
                               </a>
                             )}
                           </div>
                           {type.description && (
                             <p className="text-sm text-muted-foreground mt-1">{type.description}</p>
                           )}
                           {type.link && (
                             <p className="text-xs text-muted-foreground mt-1">
                               <span className="font-medium">Link:</span> {type.link}
                             </p>
                           )}
                        </div>
                      </div>
                       <div className="flex gap-2">
                         <Button
                           onClick={() => handleEdit(type)}
                           variant="outline"
                           size="sm"
                           className="flex items-center gap-1"
                           disabled={loading}
                         >
                           <Edit className="w-3 h-3" />
                           Edit
                         </Button>
                         <Button
                           onClick={() => deleteType(type.id!)}
                           variant="destructive"
                           size="sm"
                           className="flex items-center gap-1"
                           disabled={loading}
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

export default CommunicationTypeConfigSupabase;