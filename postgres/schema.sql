CREATE TABLE bins (
  id serial PRIMARY KEY,
  url_path varchar UNIQUE NOT NULL
  -- created_at timestamp NOT NULL TODO
);

CREATE TABLE requests (
  id serial PRIMARY KEY,
  bin_id int NOT NULL REFERENCES bins (id) ON DELETE CASCADE,
  mongo_id varchar NOT NULL,
  http_method varchar NOT NULL,
  http_path varchar NOT NULL
  -- received_at timestamp NOT NULL, TODO
);