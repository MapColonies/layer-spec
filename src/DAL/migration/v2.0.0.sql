ALTER TABLE public."TilesCounter"
  ADD COLUMN "target" text COLLATE pg_catalog."default" NOT NULL,
  ADD CONSTRAINT UQ_uniqueness_on_layer_and_target UNIQUE("layerId","target");
