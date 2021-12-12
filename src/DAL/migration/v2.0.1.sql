ALTER TABLE public."TilesCounter"
  DROP CONSTRAINT "tilesCount";

CREATE FUNCTION public.check_tiles_counter_invalid_tiles() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  if NEW."tilesCount" < 0 then
        RAISE EXCEPTION 'Invalid tiles count (negative value) layerId: %, target: %, total tiles count: %', NEW."layerId", NEW."target", NEW."tilesCount";
  end if;
  RETURN NEW;
END;
$$;

CREATE TRIGGER raise_insert_update_invalid_tiles
    AFTER INSERT OR UPDATE
    ON public."TilesCounter"
    FOR EACH ROW
    EXECUTE PROCEDURE public.check_tiles_counter_invalid_tiles();
