CREATE TYPE task_status AS ENUM('TODO', 'IN_PROGRESS', 'DONE');
CREATE TYPE task_priority AS ENUM('LOW', 'MEDIUM', 'HIGH');

CREATE TABLE tasks (
   id          BIGSERIAL PRIMARY KEY,
   title       VARCHAR(255) NOT NULL,
   description TEXT,
   status      task_status NOT NULL DEFAULT 'TODO',
   priority    task_priority NOT NULL DEFAULT 'MEDIUM',
   due_date    DATE,
   created_at  TIMESTAMP NOT NULL DEFAULT NOW(),
   updated_at  TIMESTAMP NOT NULL DEFAULT NOW()
);