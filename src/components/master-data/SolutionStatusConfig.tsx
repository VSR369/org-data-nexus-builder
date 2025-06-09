
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Edit2, Trash2, Save, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface SolutionStatus {
  id: string;
  name: string;
  description: string;
  order: number;
  isActive: boolean;
  parentId?: string;
}

const SolutionStatusConfig = () => {
  const { toast } = useToast();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newStatus, setNewStatus] = useState({ name: '', description: '', parentId: '' });
  const [showAddForm, setShowAddForm] = useState(false);

  const [solutionStatuses, setSolutionStatuses] = useState<SolutionStatus[]>([
    { id: '1', name: 'Solution Submission', description: 'Initial submission of solutions by participants', order: 1, isActive: true },
    { id: '2', name: 'Solution Shortlisting / Screening', description: 'Initial review and screening of submitted solutions', order: 2, isActive: true },
    { id: '3', name: 'Solution Selected for Full Assessment', description: 'Solutions that pass initial screening for detailed evaluation', order: 3, isActive: true },
    { id: '4', name: 'Partial Payment Done by Client', description: 'Client has made partial payment for solution development', order: 4, isActive: true },
    { id: '5', name: 'Solution Voting', description: 'Community or stakeholder voting phase', order: 5, isActive: true },
    { id: '6', name: 'Solution Evaluation / Assessment', description: 'Detailed technical and business evaluation of solutions', order: 6, isActive: true },
    { id: '7', name: 'Finalized – Investment Approved', description: 'Solution approved for investment', order: 7, isActive: true },
    { id: '8', name: 'Finalized – Pilot / Proof-of-Concept (PoC)', description: 'Solution approved for pilot or proof-of-concept phase', order: 8, isActive: true },
    { id: '9', name: 'Finalized – Ready for Full-Scale Implementation', description: 'Solution ready for full implementation', order: 9, isActive: true },
    { id: '10', name: 'Finalized – Suspended', description: 'Solution implementation suspended', order: 10, isActive: true },
    { id: '11', name: 'Selection & Reward Declaration', description: 'Final selection announcement and reward distribution', order: 11, isActive: true },
  ]);

  const handleEdit = (status: SolutionStatus) => {
    setEditingId(status.id);
  };

  const handleSave = (id: string, updatedName: string, updatedDescription: string) => {
    setSolutionStatuses(prev => 
      prev.map(status => 
        status.id === id 
          ? { ...status, name: updatedName, description: updatedDescription }
          : status
      )
    );
    setEditingId(null);
    toast({
      title: "Success",
      description: "Solution status updated successfully",
    });
  };

  const handleDelete = (id: string) => {
    setSolutionStatuses(prev => prev.filter(status => status.id !== id));
    toast({
      title: "Success",
      description: "Solution status deleted successfully",
    });
  };

  const handleAdd = () => {
    if (newStatus.name.trim()) {
      const id = Date.now().toString();
      setSolutionStatuses(prev => [...prev, {
        id,
        name: newStatus.name,
        description: newStatus.description,
        order: prev.length + 1,
        isActive: true,
        parentId: newStatus.parentId || undefined
      }]);
      setNewStatus({ name: '', description: '', parentId: '' });
      setShowAddForm(false);
      toast({
        title: "Success",
        description: "Solution status added successfully",
      });
    }
  };

  const parentStatuses = solutionStatuses.filter(status => !status.parentId);
  const getChildStatuses = (parentId: string) => 
    solutionStatuses.filter(status => status.parentId === parentId);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Solution Statuses</h2>
          <p className="text-muted-foreground">Manage solution lifecycle status configurations</p>
        </div>
        <Button onClick={() => setShowAddForm(true)} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Add Status
        </Button>
      </div>

      {showAddForm && (
        <Card>
          <CardHeader>
            <CardTitle>Add New Solution Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="newName">Status Name</Label>
              <Input
                id="newName"
                value={newStatus.name}
                onChange={(e) => setNewStatus({ ...newStatus, name: e.target.value })}
                placeholder="Enter status name"
              />
            </div>
            <div>
              <Label htmlFor="newDescription">Description</Label>
              <Textarea
                id="newDescription"
                value={newStatus.description}
                onChange={(e) => setNewStatus({ ...newStatus, description: e.target.value })}
                placeholder="Enter status description"
              />
            </div>
            <div>
              <Label htmlFor="parentStatus">Parent Status (optional)</Label>
              <select
                id="parentStatus"
                value={newStatus.parentId}
                onChange={(e) => setNewStatus({ ...newStatus, parentId: e.target.value })}
                className="w-full p-2 border border-input bg-background rounded-md"
              >
                <option value="">None (Top-level status)</option>
                {parentStatuses.map(status => (
                  <option key={status.id} value={status.id}>{status.name}</option>
                ))}
              </select>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleAdd}>
                <Save className="w-4 h-4 mr-2" />
                Save
              </Button>
              <Button variant="outline" onClick={() => setShowAddForm(false)}>
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4">
        {solutionStatuses.map((status) => (
          <Card key={status.id}>
            <CardContent className="p-4">
              {editingId === status.id ? (
                <EditStatusForm 
                  status={status} 
                  onSave={handleSave} 
                  onCancel={() => setEditingId(null)} 
                />
              ) : (
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg text-foreground">{status.name}</h3>
                    <p className="text-muted-foreground mt-1">{status.description}</p>
                    <div className="flex items-center gap-4 mt-2">
                      <span className="text-sm text-muted-foreground">Order: {status.order}</span>
                      <span className={`text-sm px-2 py-1 rounded ${status.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {status.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleEdit(status)}>
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleDelete(status.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

const EditStatusForm = ({ status, onSave, onCancel }: { 
  status: SolutionStatus; 
  onSave: (id: string, name: string, description: string) => void; 
  onCancel: () => void; 
}) => {
  const [name, setName] = useState(status.name);
  const [description, setDescription] = useState(status.description);

  return (
    <div className="space-y-3">
      <Input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Status name"
      />
      <Textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Status description"
      />
      <div className="flex gap-2">
        <Button size="sm" onClick={() => onSave(status.id, name, description)}>
          <Save className="w-4 h-4 mr-2" />
          Save
        </Button>
        <Button variant="outline" size="sm" onClick={onCancel}>
          <X className="w-4 h-4 mr-2" />
          Cancel
        </Button>
      </div>
    </div>
  );
};

export default SolutionStatusConfig;
