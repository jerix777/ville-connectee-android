DROP TABLE IF EXISTS public.taxi_drivers;

CREATE TABLE public.taxi_drivers (
  id UUID NOT NULL DEFAULT gen_random_uuid(),
  name_or_nickname TEXT NOT NULL,
  contact1 TEXT NOT NULL,
  contact2 TEXT NULL,
  vehicle_type TEXT NOT NULL,
  is_available BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CONSTRAINT taxi_drivers_pkey PRIMARY KEY (id)
);
