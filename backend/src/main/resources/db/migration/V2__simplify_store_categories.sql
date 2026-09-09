update categories
set visible = false
where slug not in ('remeras', 'buzos', 'jeans', 'accesorios');

update categories set visible = true, sort_order = 10 where slug = 'remeras';
update categories set visible = true, sort_order = 20 where slug = 'buzos';
update categories set visible = true, sort_order = 30 where slug = 'jeans';
update categories set visible = true, sort_order = 40 where slug = 'accesorios';
