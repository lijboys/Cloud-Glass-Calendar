DROP TABLE IF EXISTS notes;
CREATE TABLE notes (
    date_str TEXT PRIMARY KEY,
    content TEXT,
    updated_at INTEGER
);
