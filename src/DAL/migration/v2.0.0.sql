ALTER TABLE public."TilesCounter"
  ADD COLUMN "target" text COLLATE pg_catalog."default" NOT NULL,
  DROP CONSTRAINT "TilesCounter_pkey";
  
ALTER TABLE public."TilesCounter"
  ADD PRIMARY KEY ("layerId","target");
