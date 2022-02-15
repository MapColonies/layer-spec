SET search_path TO "LayerSpec", public; -- CHANGE SCHEMA NAME TO MATCH ENVIRONMENT
-- Table: TilesCounter
-- DROP TABLE "TilesCounter";
CREATE TABLE "TilesCounter"
(
  "id" serial ,
	"tilesCount" int NOT NULL CONSTRAINT "tilesCount" CHECK ("tilesCount" > 0),
	"layerId" varchar(340) PRIMARY KEY
);
