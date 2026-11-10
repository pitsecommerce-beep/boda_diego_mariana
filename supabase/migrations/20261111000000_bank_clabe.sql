-- Separa la CLABE del resto de los datos bancarios para poder copiarla sola.
alter table public.wedding_config add column if not exists bank_clabe text;
