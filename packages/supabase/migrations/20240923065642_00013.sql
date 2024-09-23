alter table "public"."tbl_listings" add column "type" text;

alter table "public"."tbl_product_groups" add column "types" text[];


create policy "ALL for admin 19183tj_0"
on "storage"."objects"
as permissive
for select
to authenticated
using (((bucket_id = 'product_thumbnails'::text) AND ((auth.role() = 'authenticated'::text) AND (EXISTS ( SELECT 1
   FROM tbl_users
  WHERE ((tbl_users.user_id = auth.uid()) AND (tbl_users.is_admin = true)))))));


create policy "ALL for admin 19183tj_1"
on "storage"."objects"
as permissive
for insert
to authenticated
with check (((bucket_id = 'product_thumbnails'::text) AND ((auth.role() = 'authenticated'::text) AND (EXISTS ( SELECT 1
   FROM tbl_users
  WHERE ((tbl_users.user_id = auth.uid()) AND (tbl_users.is_admin = true)))))));


create policy "ALL for admin 19183tj_2"
on "storage"."objects"
as permissive
for update
to authenticated
using (((bucket_id = 'product_thumbnails'::text) AND ((auth.role() = 'authenticated'::text) AND (EXISTS ( SELECT 1
   FROM tbl_users
  WHERE ((tbl_users.user_id = auth.uid()) AND (tbl_users.is_admin = true)))))));


create policy "ALL for admin 19183tj_3"
on "storage"."objects"
as permissive
for delete
to authenticated
using (((bucket_id = 'product_thumbnails'::text) AND ((auth.role() = 'authenticated'::text) AND (EXISTS ( SELECT 1
   FROM tbl_users
  WHERE ((tbl_users.user_id = auth.uid()) AND (tbl_users.is_admin = true)))))));


create policy "READ for all 19183tj_0"
on "storage"."objects"
as permissive
for select
to public
using ((bucket_id = 'product_thumbnails'::text));



