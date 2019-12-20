-- Drop table and recreate court table

Drop table if EXISTS courts cascade;

create table courts ( 
  id serial primary key NOT null, 
  lat decimal NOT null, 
  lng decimal NOT null, 
  name varchar(255) NOT null, 
  address varchar(255) NOT null, 
  rating integer, 
)

create table visits (
  id serial primary key NOT null,
  court_id integer references courts(id) on delete cascade
  times_stamp TIME not null
)

create table courtVisits (
  primary key (court_id, visit_id),
  court_id integer references courts(id) not null,
  visit_id integer references visits(id) not null,
  quantitiy integer default 1
)

