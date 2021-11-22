create table orders (order_status varchar,userid bigint REFERENCES users(id),id serial primary key);
