-- CreateTable
CREATE TABLE "audit_logs" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "timestamp" DATETIME NOT NULL,
    "action" TEXT NOT NULL,
    "readable_action" TEXT NOT NULL,
    "description" TEXT NOT NULL DEFAULT '',
    "user_name" TEXT NOT NULL,
    "user_email" TEXT NOT NULL
);
