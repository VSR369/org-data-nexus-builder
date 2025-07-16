import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

// Debug panel for testing dialog behavior
export const DialogDebugPanel: React.FC = () => {
  const [clickCount, setClickCount] = useState(0);
  const [lastClickTime, setLastClickTime] = useState<Date | null>(null);
  const [dialogStates, setDialogStates] = useState<Record<string, any>>({});
  const { toast } = useToast();

  useEffect(() => {
    // Log dialog state changes
    const handleDialogStateChange = (event: CustomEvent) => {
      const { dialogId, state } = event.detail;
      setDialogStates(prev => ({
        ...prev,
        [dialogId]: state
      }));
    };

    window.addEventListener('dialog-state-change', handleDialogStateChange as any);
    return () => {
      window.removeEventListener('dialog-state-change', handleDialogStateChange as any);
    };
  }, []);

  const testDialogButton = () => {
    setClickCount(prev => prev + 1);
    setLastClickTime(new Date());
    console.log('Test button clicked:', clickCount + 1);
    
    toast({
      title: "Test Click",
      description: `Click count: ${clickCount + 1}`,
    });
  };

  return (
    <div className="fixed bottom-4 right-4 p-4 bg-card border rounded-lg shadow-lg z-50">
      <h4 className="font-semibold mb-2">Dialog Debug Panel</h4>
      <div className="space-y-2 text-sm">
        <div>Click Count: {clickCount}</div>
        <div>Last Click: {lastClickTime?.toLocaleTimeString() || 'None'}</div>
        <div>Active Dialogs: {Object.keys(dialogStates).length}</div>
        <Button size="sm" onClick={testDialogButton}>
          Test Click
        </Button>
        <Button 
          size="sm" 
          variant="outline" 
          onClick={() => {
            setClickCount(0);
            setLastClickTime(null);
            setDialogStates({});
          }}
        >
          Reset
        </Button>
      </div>
    </div>
  );
};

// Enhanced DialogTriggerButton with debugging
export const createDialogId = () => `dialog-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

export const logDialogInteraction = (dialogId: string, action: string, details?: any) => {
  const logEntry = {
    dialogId,
    action,
    timestamp: new Date().toISOString(),
    details,
    userAgent: navigator.userAgent,
    url: window.location.href
  };
  
  console.log('Dialog Interaction:', logEntry);
  
  // Dispatch custom event for debugging panel
  window.dispatchEvent(new CustomEvent('dialog-state-change', {
    detail: { dialogId, state: { action, details, timestamp: logEntry.timestamp } }
  }));
};

// Test component for dialog functionality
export const DialogTestComponent: React.FC = () => {
  const [testResults, setTestResults] = useState<string[]>([]);
  const { toast } = useToast();

  const runDialogTests = async () => {
    const results: string[] = [];
    
    // Test 1: Button click responsiveness
    try {
      const button = document.querySelector('[data-testid="dialog-trigger-button"]');
      if (button) {
        (button as HTMLElement).click();
        results.push('✅ Button click test passed');
      } else {
        results.push('❌ Button not found');
      }
    } catch (error) {
      results.push(`❌ Button click test failed: ${error}`);
    }
    
    // Test 2: Dialog state management
    try {
      const dialogs = document.querySelectorAll('[role="dialog"]');
      results.push(`✅ Found ${dialogs.length} active dialogs`);
    } catch (error) {
      results.push(`❌ Dialog state test failed: ${error}`);
    }
    
    // Test 3: Event handler integrity
    try {
      const triggers = document.querySelectorAll('[data-radix-collection-item]');
      results.push(`✅ Found ${triggers.length} dialog triggers`);
    } catch (error) {
      results.push(`❌ Event handler test failed: ${error}`);
    }
    
    setTestResults(results);
    
    toast({
      title: "Test Results",
      description: `${results.filter(r => r.includes('✅')).length} tests passed`,
    });
  };

  return (
    <div className="p-4 border rounded-lg">
      <h3 className="font-semibold mb-2">Dialog Test Suite</h3>
      <Button onClick={runDialogTests} className="mb-4">
        Run Tests
      </Button>
      <div className="space-y-1">
        {testResults.map((result, index) => (
          <div key={index} className="text-sm font-mono">
            {result}
          </div>
        ))}
      </div>
    </div>
  );
};