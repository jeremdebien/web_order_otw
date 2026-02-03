-- Add item_customization column to self_order_items
ALTER TABLE self_order_items 
ADD COLUMN item_customization JSON;

-- Optional: Add a comment to the column for clarity
COMMENT ON COLUMN self_order_items.item_customization IS 'Stores product customizations in JSON format { "GroupName": ["Barcode1", "Barcode2"] }';

-- Update Order Key Generator to remove the hyphen
CREATE OR REPLACE FUNCTION generate_order_key() 
RETURNS TRIGGER AS $$
declare
  next_number bigint;
  branch_prefix text;
begin
  -- increment safely
  update branch_order_counters
  set last_number = last_number + 1,
      updated_at = now()
  where branch_id = NEW.branch_id
  returning last_number, prefix into next_number, branch_prefix;

  -- initialize if missing (fallback)
  if next_number is null then
    -- Removed the '-' from the default prefix
    insert into branch_order_counters (branch_id, prefix, last_number)
    values (NEW.branch_id, 'BR' || NEW.branch_id, 1) 
    returning last_number, prefix into next_number, branch_prefix;
  end if;

  -- build key: prefix + "SO" + padded number
  NEW.order_key := branch_prefix || 'SO' || lpad(next_number::text, 5, '0');

  return NEW;
end;
$$ LANGUAGE plpgsql;

-- Remove hyphen from existing prefixes in the counters table
UPDATE branch_order_counters 
SET prefix = REPLACE(prefix, '-', '') 
WHERE prefix LIKE '%-';
