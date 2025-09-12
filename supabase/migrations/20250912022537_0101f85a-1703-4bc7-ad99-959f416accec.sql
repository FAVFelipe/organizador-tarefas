-- Add category column to tasks table
ALTER TABLE public.tasks 
ADD COLUMN category TEXT DEFAULT 'personal';

-- Add index for better performance on category filtering
CREATE INDEX idx_tasks_category ON public.tasks(category);