import React, { useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { DialogTrigger } from '@/components/ui/dialog';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { logDialogInteraction, createDialogId } from './dialog-test-utils';

interface DialogTriggerButtonProps {
  mode: 'add' | 'edit' | 'delete';
  children?: React.ReactNode;
  onClick?: () => void;
}

export const DialogTriggerButton: React.FC<DialogTriggerButtonProps> = ({
  mode,
  children,
  onClick
}) => {
  const dialogId = useRef(createDialogId());
  const clickCount = useRef(0);

  useEffect(() => {
    logDialogInteraction(dialogId.current, 'component_mounted', { mode });
    
    return () => {
      logDialogInteraction(dialogId.current, 'component_unmounted', { mode });
    };
  }, [mode]);

  const handleClick = (e: React.MouseEvent) => {
    clickCount.current += 1;
    
    logDialogInteraction(dialogId.current, 'button_clicked', {
      mode,
      clickCount: clickCount.current,
      timestamp: Date.now(),
      target: e.currentTarget.tagName
    });
    
    console.log(`[DialogTriggerButton] ${mode} button clicked (count: ${clickCount.current})`);
    
    // Don't prevent default or stop propagation - let Radix handle it
    if (onClick) {
      onClick();
    }
  };

  return (
    <DialogTrigger asChild>
      <Button 
        variant={mode === 'delete' ? 'destructive' : 'default'} 
        size="sm"
        onClick={handleClick}
        data-testid="dialog-trigger-button"
        data-dialog-id={dialogId.current}
        data-mode={mode}
      >
        {children || (
          <>
            {mode === 'add' && <Plus className="w-4 h-4 mr-2" />}
            {mode === 'edit' && <Edit className="w-4 h-4 mr-2" />}
            {mode === 'delete' && <Trash2 className="w-4 h-4 mr-2" />}
            {mode.charAt(0).toUpperCase() + mode.slice(1)}
          </>
        )}
      </Button>
    </DialogTrigger>
  );
};