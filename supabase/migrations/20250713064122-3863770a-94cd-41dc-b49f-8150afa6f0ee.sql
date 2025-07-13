-- Update the table structure to support decimal values
ALTER TABLE public.master_capability_levels 
ALTER COLUMN min_score TYPE NUMERIC(10,5),
ALTER COLUMN max_score TYPE NUMERIC(10,5);

-- Clear existing data and insert the correct values from the image
DELETE FROM public.master_capability_levels;

-- Insert the capability levels exactly as shown in the image
INSERT INTO public.master_capability_levels (name, min_score, max_score, color, order_index, is_active) VALUES
('No/Low Competency', 0, 2.49999, '#ef4444', 1, true),
('Basic', 2.5, 4.99999, '#eab308', 2, true), 
('Advanced', 5, 7.49999, '#3b82f6', 3, true),
('Guru', 7.5, 10, '#a855f7', 4, true);