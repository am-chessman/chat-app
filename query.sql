create table users(
                      id serial primary key,
                      email varchar(100) not null,
                      password_hash text not null,
                      username varchar(100) unique not null,
                      user_id uuid unique not null,
                      created_at timestamp not null default now()
);

create table messages(
                         id serial primary key,
                         sender_id uuid not null,
                         message text not null,
                         created_at timestamp not null default now(),
                         foreign key (sender_id) references users(user_id)
);