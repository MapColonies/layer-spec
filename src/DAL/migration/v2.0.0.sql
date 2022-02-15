SET search_path TO "LayerSpec", public; -- CHANGE SCHEMA NAME TO MATCH ENVIRONMENT
ALTER TABLE "TilesCounter"
  ADD COLUMN "target" text COLLATE pg_catalog."default" NOT NULL,
  DROP CONSTRAINT "TilesCounter_pkey";
  
ALTER TABLE "TilesCounter"
  ADD PRIMARY KEY ("layerId","target");
