-- Table: public.TilesCounter
-- DROP TABLE public."TilesCounter";
CREATE TABLE public."TilesCounter"
(
  "id" serial ,
	"tilesCount" int NOT NULL CONSTRAINT "tilesCount" CHECK ("tilesCount" > 0),
	"layerId" varchar(340) PRIMARY KEY
);
