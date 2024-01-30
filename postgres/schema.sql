CREATE TABLE bins (
  id serial PRIMARY KEY,
  url_path varchar UNIQUE NOT NULL,
  created_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE requests (
  id serial PRIMARY KEY,
  bin_id int NOT NULL REFERENCES bins (id) ON DELETE CASCADE,
  mongo_id varchar NOT NULL,
  http_method varchar NOT NULL,
  http_path varchar NOT NULL,
  received_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP
);