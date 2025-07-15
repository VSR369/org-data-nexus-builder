-- Complete removal of organization relationship mapping tables
-- Drop all three relationship tables with CASCADE to remove associated objects
DROP TABLE IF EXISTS master_org_type_category_mapping CASCADE;
DROP TABLE IF EXISTS master_org_type_department_mapping CASCADE;
DROP TABLE IF EXISTS master_org_category_department_mapping CASCADE;