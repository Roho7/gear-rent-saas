create policy "Read for all"
on "public"."tbl_inventory"
as permissive
for select
to public
using (true);



