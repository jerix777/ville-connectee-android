CREATE TABLE public.hotels (
  id UUID NOT NULL DEFAULT gen_random_uuid(),
  nom TEXT NOT NULL,
  type TEXT NOT NULL,
  adresse TEXT NOT NULL,
  contact1 TEXT NOT NULL,
  contact2 TEXT NULL,
  email TEXT NULL,
  description TEXT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CONSTRAINT hotels_pkey PRIMARY KEY (id)
);
