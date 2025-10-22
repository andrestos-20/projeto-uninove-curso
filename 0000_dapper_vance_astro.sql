Text file: 0000_dapper_vance_astro.sql
Latest content with line numbers:
1	CREATE TABLE `admins` (
2		`id` int AUTO_INCREMENT NOT NULL,
3		`name` varchar(255) NOT NULL,
4		`email` varchar(320) NOT NULL,
5		`ra` varchar(20) NOT NULL,
6		`createdAt` timestamp DEFAULT (now()),
7		CONSTRAINT `admins_id` PRIMARY KEY(`id`),
8		CONSTRAINT `admins_email_unique` UNIQUE(`email`),
9		CONSTRAINT `admins_ra_unique` UNIQUE(`ra`)
10	);
11	