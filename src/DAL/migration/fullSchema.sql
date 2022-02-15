SET search_path TO "LayerSpec", public; -- CHANGE SCHEMA NAME TO MATCH ENVIRONMENT
-- Table: TilesCounter
-- DROP TABLE TilesCounter;
CREATE TABLE "TilesCounter"
(
  "id" serial ,
	"tilesCount" int NOT NULL,
	"target" text COLLATE pg_catalog."default" NOT NULL,
	"layerId" varchar(340),
	 PRIMARY KEY ("layerId","target")
);

CREATE FUNCTION check_tiles_counter_invalid_tiles() RETURNS trigger
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
    ON "TilesCounter"
    FOR EACH ROW
    EXECUTE PROCEDURE check_tiles_counter_invalid_tiles();
