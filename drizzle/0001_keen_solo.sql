CREATE TABLE `trip_actions` (
	`id` text PRIMARY KEY NOT NULL,
	`trip_id` text NOT NULL,
	`position` integer NOT NULL,
	`label` text NOT NULL,
	`completed` integer DEFAULT false NOT NULL,
	`completed_at` integer,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`trip_id`) REFERENCES `trips`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
PRAGMA foreign_keys=OFF;
--> statement-breakpoint
CREATE TABLE `__new_trips` (
	`id` text PRIMARY KEY NOT NULL,
	`client_id` text NOT NULL,
	`reference` text NOT NULL,
	`destination` text NOT NULL,
	`start_date` integer NOT NULL,
	`end_date` integer NOT NULL,
	`status` text DEFAULT 'in_progress' NOT NULL,
	`notes` text,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`client_id`) REFERENCES `clients`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_trips`("id", "client_id", "reference", "destination", "start_date", "end_date", "status", "notes", "created_at", "updated_at") SELECT "id", "client_id", "reference", "destination", "start_date", "end_date", "status", "notes", "created_at", "updated_at" FROM `trips`;
--> statement-breakpoint
DROP TABLE `trips`;
--> statement-breakpoint
ALTER TABLE `__new_trips` RENAME TO `trips`;
--> statement-breakpoint
PRAGMA foreign_keys=ON;
--> statement-breakpoint
CREATE UNIQUE INDEX `trips_reference_unique` ON `trips` (`reference`);
--> statement-breakpoint
ALTER TABLE `tasks` ADD `custom_position` integer;
