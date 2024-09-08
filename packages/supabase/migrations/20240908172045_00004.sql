alter table "public"."tbl_products" add column "is_hidden" boolean default false;

alter table "public"."tbl_stores" drop column "google_link";

alter table "public"."tbl_stores" add column "google_place_id" text;


