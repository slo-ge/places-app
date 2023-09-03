DROP TABLE IF EXISTS BackendTracking;
CREATE TABLE IF NOT EXISTS BackendTracking
(
    Id             INTEGER PRIMARY KEY AUTOINCREMENT,
    TrackingEvent  TEXT,
    TrackingDetail TEXT,
    EventDate      DATETIME
);
