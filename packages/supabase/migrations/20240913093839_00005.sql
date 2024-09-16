create policy "Read for all"
on "public"."tbl_listings"
as permissive
for select
to public
using (true);



