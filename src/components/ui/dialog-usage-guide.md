# Dialog Component Usage Guide

## Overview

This guide provides best practices for using dialog components in the master data system to ensure consistent behavior and prevent common issues.

## Standard Dialog Pattern

### 1. Use DialogTriggerButton Component

✅ **CORRECT:**
```tsx
import { DialogTriggerButton } from '@/components/ui/dialog-trigger-button';

<Dialog open={open} onOpenChange={setOpen}>
  <DialogTriggerButton mode={mode}>
    {children}
  </DialogTriggerButton>
  <DialogContent>
    {/* Dialog content */}
  </DialogContent>
</Dialog>
```

❌ **INCORRECT:**
```tsx
<DialogTrigger asChild>
  <Button onClick={(e) => {
    e.preventDefault();
    e.stopPropagation();
  }}>
    {/* This interferes with Radix UI's event handling */}
  </Button>
</DialogTrigger>
```

### 2. Use Error Boundaries

✅ **CORRECT:**
```tsx
import { DialogErrorBoundary } from '@/components/ui/dialog-error-boundary';

<DialogErrorBoundary>
  <Dialog open={open} onOpenChange={setOpen}>
    {/* Dialog content */}
  </Dialog>
</DialogErrorBoundary>
```

### 3. Proper State Management

✅ **CORRECT:**
```tsx
const [open, setOpen] = useState(false);

// Reset form when dialog opens/closes
useEffect(() => {
  if (open && item && mode === 'edit') {
    setFormData(item);
  } else if (open && mode === 'add') {
    setFormData(initialFormData);
  }
}, [open, item, mode, initialFormData]);
```

### 4. Error Handling

✅ **CORRECT:**
```tsx
import { useDialogErrorHandler } from '@/components/ui/dialog-error-boundary';

const { handleError } = useDialogErrorHandler();

try {
  // Database operation
} catch (error) {
  handleError(error as Error, 'operation context');
}
```

## Common Issues and Solutions

### Issue 1: Buttons Stop Working After First Click

**Cause:** Event handlers interfering with Radix UI's event system
**Solution:** Use `DialogTriggerButton` component instead of custom onClick handlers

### Issue 2: Form Data Not Resetting

**Cause:** Missing useEffect to handle form state reset
**Solution:** Implement proper state management as shown above

### Issue 3: Unhandled Errors Crashing Components

**Cause:** Missing error boundaries
**Solution:** Wrap dialogs in `DialogErrorBoundary`

### Issue 4: Memory Leaks

**Cause:** Not cleaning up state on unmount
**Solution:** Use proper cleanup in useEffect hooks

## Testing Checklist

Before deploying dialog components, verify:

- [ ] Button works multiple times without refresh
- [ ] Form resets properly when switching modes
- [ ] Error states are handled gracefully
- [ ] Loading states work correctly
- [ ] Dialog closes properly after successful operations
- [ ] Keyboard navigation works (ESC to close)
- [ ] Focus management is correct

## Migration Guide

### Converting Existing Dialogs

1. Replace `DialogTrigger` with `DialogTriggerButton`
2. Add `DialogErrorBoundary` wrapper
3. Implement proper state management
4. Add error handling with `useDialogErrorHandler`
5. Test thoroughly

### Example Migration

**Before:**
```tsx
<Dialog open={open} onOpenChange={setOpen}>
  <DialogTrigger asChild>
    <Button onClick={(e) => { e.preventDefault(); }}>
      {mode}
    </Button>
  </DialogTrigger>
  {/* rest of dialog */}
</Dialog>
```

**After:**
```tsx
<DialogErrorBoundary>
  <Dialog open={open} onOpenChange={setOpen}>
    <DialogTriggerButton mode={mode}>
      {children}
    </DialogTriggerButton>
    {/* rest of dialog */}
  </Dialog>
</DialogErrorBoundary>
```

## Best Practices

1. **Always use the standardized components**
2. **Implement proper error handling**
3. **Test dialog behavior thoroughly**
4. **Keep state management consistent**
5. **Use TypeScript for better type safety**
6. **Follow naming conventions**
7. **Add loading states for better UX**
8. **Implement proper validation**

## Resources

- [Radix UI Dialog Documentation](https://www.radix-ui.com/docs/primitives/components/dialog)
- [React Error Boundaries](https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary)
- [Master Data Dialog Components](../master-data/)