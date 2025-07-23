CREATE TABLE "public"."catalogue_categories" (
    "id" uuid NOT NULL DEFAULT gen_random_uuid(),
    "nom" text NOT NULL,
    "description" text,
    "created_at" timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE "public"."catalogue_categories" OWNER TO "postgres";

CREATE TABLE "public"."catalogue_items" (
    "id" uuid NOT NULL DEFAULT gen_random_uuid(),
    "category_id" uuid NOT NULL,
    "name" text NOT NULL,
    "description" text,
    "price" numeric,
    "image_url" text,
    "created_at" timestamp with time zone NOT NULL DEFAULT now(),
    "created_by" uuid REFERENCES auth.users(id)
);

ALTER TABLE "public"."catalogue_items" OWNER TO "postgres";

CREATE UNIQUE INDEX catalogue_categories_pkey ON public.catalogue_categories USING btree (id);
CREATE UNIQUE INDEX catalogue_items_pkey ON public.catalogue_items USING btree (id);

ALTER TABLE "public"."catalogue_categories" ADD CONSTRAINT "catalogue_categories_pkey" PRIMARY KEY USING INDEX "catalogue_categories_pkey";
ALTER TABLE "public"."catalogue_items" ADD CONSTRAINT "catalogue_items_pkey" PRIMARY KEY USING INDEX "catalogue_items_pkey";

ALTER TABLE "public"."catalogue_items" ADD CONSTRAINT "catalogue_items_category_id_fkey" FOREIGN KEY (category_id) REFERENCES public.catalogue_categories(id) ON DELETE CASCADE;

GRANT ALL ON TABLE "public"."catalogue_categories" TO "anon";
GRANT ALL ON TABLE "public"."catalogue_categories" TO "authenticated";
GRANT ALL ON TABLE "public"."catalogue_categories" TO "service_role";

GRANT ALL ON TABLE "public"."catalogue_items" TO "anon";
GRANT ALL ON TABLE "public"."catalogue_items" TO "authenticated";
GRANT ALL ON TABLE "public"."catalogue_items" TO "service_role";

INSERT INTO "public"."catalogue_categories" (nom, description) VALUES
('Véhicules', 'Voitures, motos, et autres véhicules.'),
('Immobilier', 'Maisons, appartements, et terrains.'),
('Électronique', 'Télévisions, ordinateurs, et téléphones.');

-- Get category IDs
DO $$
DECLARE
    vehicules_id uuid;
    immobilier_id uuid;
    electronique_id uuid;
BEGIN
    SELECT id INTO vehicules_id FROM public.catalogue_categories WHERE nom = 'Véhicules';
    SELECT id INTO immobilier_id FROM public.catalogue_categories WHERE nom = 'Immobilier';
    SELECT id INTO electronique_id FROM public.catalogue_categories WHERE nom = 'Électronique';

    INSERT INTO "public"."catalogue_items" (category_id, name, description, price) VALUES
    (vehicules_id, 'Voiture d''occasion', 'Renault Clio 2015, bon état.', 5000),
    (immobilier_id, 'Appartement à louer', 'F3 en centre-ville.', 800),
    (electronique_id, 'iPhone 12', 'Comme neuf, avec boîte et accessoires.', 600);
END $$;
