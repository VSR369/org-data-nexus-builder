-- Phase 1: Complete Fee Components Cleanup and System Hardening

-- 1. Remove problematic engagement model mappings that prevent deletion
DELETE FROM engagement_model_fee_mapping 
WHERE fee_component_id IN (
  SELECT id FROM master_fee_components 
  WHERE component_type NOT IN ('management_fee', 'consulting_fee')
);

-- 2. Delete all fee components that are not management or consulting fees
DELETE FROM master_fee_components 
WHERE component_type NOT IN ('management_fee', 'consulting_fee');

-- 3. Delete duplicate "Platform Usage Fee " with space (solution_fee type)
DELETE FROM master_fee_components 
WHERE name = 'Platform Usage Fee ' AND component_type = 'solution_fee';

-- 4. Create constraint to prevent non-management/consulting fee components
ALTER TABLE master_fee_components 
ADD CONSTRAINT fee_components_type_restriction 
CHECK (component_type IN ('management_fee', 'consulting_fee'));

-- 5. Create function to check dependencies before deletion
CREATE OR REPLACE FUNCTION check_fee_component_dependencies(component_id UUID)
RETURNS JSONB AS $$
DECLARE
    dependency_count INTEGER;
    dependency_details JSONB;
BEGIN
    -- Check engagement model mappings
    SELECT COUNT(*) INTO dependency_count
    FROM engagement_model_fee_mapping 
    WHERE fee_component_id = component_id;
    
    -- Build dependency details
    dependency_details := jsonb_build_object(
        'engagement_model_mappings', dependency_count,
        'can_delete', CASE WHEN dependency_count = 0 THEN true ELSE false END,
        'blocking_dependencies', CASE WHEN dependency_count > 0 THEN 
            jsonb_build_array('engagement_model_fee_mapping') 
            ELSE jsonb_build_array() END
    );
    
    RETURN dependency_details;
END;
$$ LANGUAGE plpgsql;

-- 6. Create trigger to prevent deletion of components with dependencies
CREATE OR REPLACE FUNCTION prevent_fee_component_deletion_with_dependencies()
RETURNS TRIGGER AS $$
DECLARE
    dependency_check JSONB;
BEGIN
    -- Check if the fee component has dependencies
    dependency_check := check_fee_component_dependencies(OLD.id);
    
    -- If dependencies exist, prevent deletion
    IF NOT (dependency_check->>'can_delete')::boolean THEN
        RAISE EXCEPTION 'Cannot delete fee component "%" because it has dependencies in: %', 
            OLD.name, dependency_check->'blocking_dependencies';
    END IF;
    
    RETURN OLD;
END;
$$ LANGUAGE plpgsql;

-- 7. Create the trigger
CREATE OR REPLACE TRIGGER trigger_prevent_fee_component_deletion
    BEFORE DELETE ON master_fee_components
    FOR EACH ROW
    EXECUTE FUNCTION prevent_fee_component_deletion_with_dependencies();

-- 8. Create function to safely delete fee component with cascade option
CREATE OR REPLACE FUNCTION safe_delete_fee_component(
    component_id UUID,
    cascade_delete BOOLEAN DEFAULT FALSE
) RETURNS JSONB AS $$
DECLARE
    dependency_check JSONB;
    component_name TEXT;
BEGIN
    -- Get component name
    SELECT name INTO component_name FROM master_fee_components WHERE id = component_id;
    
    IF component_name IS NULL THEN
        RETURN jsonb_build_object('success', false, 'error', 'Fee component not found');
    END IF;
    
    -- Check dependencies
    dependency_check := check_fee_component_dependencies(component_id);
    
    -- If can't delete and cascade is false, return error
    IF NOT (dependency_check->>'can_delete')::boolean AND NOT cascade_delete THEN
        RETURN jsonb_build_object(
            'success', false, 
            'error', 'Cannot delete fee component due to dependencies',
            'dependencies', dependency_check
        );
    END IF;
    
    -- If cascade delete is enabled, remove dependencies first
    IF cascade_delete THEN
        -- Remove from engagement model mappings
        DELETE FROM engagement_model_fee_mapping WHERE fee_component_id = component_id;
    END IF;
    
    -- Delete the fee component
    DELETE FROM master_fee_components WHERE id = component_id;
    
    RETURN jsonb_build_object('success', true, 'message', 'Fee component deleted successfully');
END;
$$ LANGUAGE plpgsql;