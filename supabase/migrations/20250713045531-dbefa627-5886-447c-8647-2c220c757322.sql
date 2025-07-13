-- Create function to get table schema from information_schema
CREATE OR REPLACE FUNCTION public.get_table_schema(table_name TEXT)
RETURNS TABLE (
  column_name TEXT,
  data_type TEXT,
  is_nullable TEXT,
  column_default TEXT,
  ordinal_position INTEGER
)
SECURITY DEFINER
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    c.column_name::TEXT,
    c.data_type::TEXT,
    c.is_nullable::TEXT,
    c.column_default::TEXT,
    c.ordinal_position::INTEGER
  FROM information_schema.columns c
  WHERE c.table_schema = 'public' 
    AND c.table_name = get_table_schema.table_name
  ORDER BY c.ordinal_position;
END;
$$;