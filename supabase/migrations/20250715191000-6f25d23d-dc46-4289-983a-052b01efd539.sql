-- Phase 1: Database Cleanup - Drop Challenge and Solution Status tables
DROP TABLE IF EXISTS master_challenge_statuses CASCADE;
DROP TABLE IF EXISTS master_solution_statuses CASCADE;