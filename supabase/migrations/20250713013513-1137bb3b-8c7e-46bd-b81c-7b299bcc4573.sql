-- Add missing fields to master_reward_types table to support monetary/non-monetary types
ALTER TABLE public.master_reward_types 
ADD COLUMN type text,
ADD COLUMN currency text,
ADD COLUMN amount numeric;