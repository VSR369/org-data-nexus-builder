import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

/**
 * Get a public URL for files in public buckets (like organization-logos)
 */
export const getPublicFileUrl = (bucket: string, path: string): string => {
  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
};

/**
 * Get a signed URL for files in private buckets (like organization-documents)
 */
export const getSignedFileUrl = async (bucket: string, path: string): Promise<string | null> => {
  try {
    const { data, error } = await supabase.storage
      .from(bucket)
      .createSignedUrl(path, 3600); // 1 hour expiry

    if (error) {
      console.error('Error creating signed URL:', error);
      toast.error('Unable to access file');
      return null;
    }

    return data.signedUrl;
  } catch (error) {
    console.error('Error generating file URL:', error);
    toast.error('Error accessing file');
    return null;
  }
};

/**
 * Open a file in a new tab/window
 */
export const openFile = async (file: File, bucket: string, path?: string) => {
  try {
    let url: string | null = null;

    if (path) {
      // File is already uploaded, get URL from storage
      if (bucket === 'organization-logos') {
        url = getPublicFileUrl(bucket, path);
      } else {
        url = await getSignedFileUrl(bucket, path);
      }
    } else {
      // File is not uploaded yet, create blob URL from File object
      url = URL.createObjectURL(file);
    }

    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer');
      
      // Clean up blob URL if it was created
      if (!path) {
        setTimeout(() => URL.revokeObjectURL(url!), 1000);
      }
    }
  } catch (error) {
    console.error('Error opening file:', error);
    toast.error('Unable to open file');
  }
};

/**
 * Determine if a file type should open in browser or download
 */
export const shouldOpenInBrowser = (fileName: string): boolean => {
  const extension = fileName.split('.').pop()?.toLowerCase();
  const browserSupportedTypes = ['pdf', 'jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'txt'];
  return browserSupportedTypes.includes(extension || '');
};