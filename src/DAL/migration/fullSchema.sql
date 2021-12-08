-- Table: public.TilesCounter
-- DROP TABLE public.TilesCounter;
CREATE TABLE public."TilesCounter"
(
  "id" serial ,
	"tilesCount" int NOT NULL CONSTRAINT "tilesCount" CHECK ("tilesCount" > 0),
	"target" text COLLATE pg_catalog."default" NOT NULL,
	"layerId" varchar(340) PRIMARY KEY,
	CONSTRAINT UQ_uniqueness_on_layer_and_target UNIQUE("layerId","target")
);
