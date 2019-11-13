import {MigrationInterface, QueryRunner} from "typeorm";

export class ExchangeCreatedAtDateMigration1573627520523 implements MigrationInterface {
    name = 'ExchangeCreatedAtDateMigration1573627520523'

    public async up(queryRunner: QueryRunner): Promise<any> {
        // Remove Constraints
        await queryRunner.query(`CREATE TABLE "temporary_wallet_addresses" ("wallet" varchar PRIMARY KEY NOT NULL, "address" text NOT NULL)`, undefined);
        await queryRunner.query(`INSERT INTO "temporary_wallet_addresses"("wallet", "address") SELECT "wallet", "address" FROM "wallet_addresses"`, undefined);
        await queryRunner.query(`DROP TABLE "wallet_addresses"`, undefined);
        await queryRunner.query(`ALTER TABLE "temporary_wallet_addresses" RENAME TO "wallet_addresses"`, undefined);
        await queryRunner.query(`CREATE TABLE "temporary_exchanges" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "track_id" varchar NOT NULL, "currency_from" varchar NOT NULL, "currency_to" varchar NOT NULL, "amount_from" varchar NOT NULL, "amount_to" varchar NOT NULL, "address_from" varchar NOT NULL, "address_to" varchar NOT NULL, "status" varchar NOT NULL, "tx_from" varchar NOT NULL, "tx_to" varchar NOT NULL, "wallet" varchar NOT NULL, "botAddress" varchar, "created_date" datetime NOT NULL DEFAULT (datetime('now')), "updated_date" datetime NOT NULL DEFAULT (datetime('now')), CONSTRAINT "FK_2507d6d2bc55d12009cdd52a6be" FOREIGN KEY ("botAddress") REFERENCES "bots" ("address") ON DELETE NO ACTION ON UPDATE NO ACTION)`, undefined);
        await queryRunner.query(`INSERT INTO "temporary_exchanges"("id", "track_id", "currency_from", "currency_to", "amount_from", "amount_to", "address_from", "address_to", "status", "tx_from", "tx_to", "wallet", "botAddress") SELECT "id", "track_id", "currency_from", "currency_to", "amount_from", "amount_to", "address_from", "address_to", "status", "tx_from", "tx_to", "wallet", "botAddress" FROM "exchanges"`, undefined);
        await queryRunner.query(`DROP TABLE "exchanges"`, undefined);
        await queryRunner.query(`ALTER TABLE "temporary_exchanges" RENAME TO "exchanges"`, undefined);
        await queryRunner.query(`CREATE TABLE "temporary_bot_wallets" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL, "botAddress" varchar)`, undefined);
        await queryRunner.query(`INSERT INTO "temporary_bot_wallets"("id", "name", "botAddress") SELECT "id", "name", "botAddress" FROM "bot_wallets"`, undefined);
        await queryRunner.query(`DROP TABLE "bot_wallets"`, undefined);
        await queryRunner.query(`ALTER TABLE "temporary_bot_wallets" RENAME TO "bot_wallets"`, undefined);

        // Add created/updated at dates
        await queryRunner.query(`CREATE TABLE "temporary_exchanges" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "track_id" varchar NOT NULL, "currency_from" varchar NOT NULL, "currency_to" varchar NOT NULL, "amount_from" varchar NOT NULL, "amount_to" varchar NOT NULL, "address_from" varchar NOT NULL, "address_to" varchar NOT NULL, "status" varchar NOT NULL, "tx_from" varchar NOT NULL, "tx_to" varchar NOT NULL, "wallet" varchar NOT NULL, "botAddress" varchar, "created_date" datetime NOT NULL DEFAULT (datetime('now')), "updated_date" datetime NOT NULL DEFAULT (datetime('now')))`, undefined);
        await queryRunner.query(`INSERT INTO "temporary_exchanges"("id", "track_id", "currency_from", "currency_to", "amount_from", "amount_to", "address_from", "address_to", "status", "tx_from", "tx_to", "wallet", "botAddress", "created_date", "updated_date") SELECT "id", "track_id", "currency_from", "currency_to", "amount_from", "amount_to", "address_from", "address_to", "status", "tx_from", "tx_to", "wallet", "botAddress", "created_date", "updated_date" FROM "exchanges"`, undefined);
        await queryRunner.query(`DROP TABLE "exchanges"`, undefined);
        await queryRunner.query(`ALTER TABLE "temporary_exchanges" RENAME TO "exchanges"`, undefined);

        // Bots last for FK requirements
        await queryRunner.query(`CREATE TABLE "temporary_bots" ("address" varchar PRIMARY KEY NOT NULL, "name" varchar NOT NULL, "description" text NOT NULL, "version" varchar NOT NULL, "type" varchar NOT NULL, "image" varchar NOT NULL, "authorId" integer, CONSTRAINT "UQ_907a3770ffa6e179f7370920356" UNIQUE ("authorId"), CONSTRAINT "FK_907a3770ffa6e179f7370920356" FOREIGN KEY ("authorId") REFERENCES "bot_author" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`, undefined);
        await queryRunner.query(`INSERT INTO "temporary_bots"("address", "name", "description", "version", "type", "image", "authorId") SELECT "address", "name", "description", "version", "type", "image", "authorId" FROM "bots"`, undefined);
        await queryRunner.query(`DROP TABLE "bots"`, undefined);
        await queryRunner.query(`ALTER TABLE "temporary_bots" RENAME TO "bots"`, undefined);

        // Add Constraints
        await queryRunner.query(`CREATE TABLE "temporary_bots" ("address" varchar PRIMARY KEY NOT NULL, "name" varchar NOT NULL, "description" text NOT NULL, "version" varchar NOT NULL, "type" varchar NOT NULL, "image" varchar NOT NULL, "authorId" integer, CONSTRAINT "UQ_907a3770ffa6e179f7370920356" UNIQUE ("authorId"), CONSTRAINT "UQ_bf316b2bcf8480dc1fbaac3ccd9" UNIQUE ("address"), CONSTRAINT "FK_907a3770ffa6e179f7370920356" FOREIGN KEY ("authorId") REFERENCES "bot_author" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`, undefined);
        await queryRunner.query(`INSERT INTO "temporary_bots"("address", "name", "description", "version", "type", "image", "authorId") SELECT "address", "name", "description", "version", "type", "image", "authorId" FROM "bots"`, undefined);
        await queryRunner.query(`DROP TABLE "bots"`, undefined);
        await queryRunner.query(`ALTER TABLE "temporary_bots" RENAME TO "bots"`, undefined);
        await queryRunner.query(`CREATE TABLE "temporary_wallet_addresses" ("wallet" varchar PRIMARY KEY NOT NULL, "address" text NOT NULL, CONSTRAINT "UQ_9354d82577c229313056a4cbe6e" UNIQUE ("wallet"))`, undefined);
        await queryRunner.query(`INSERT INTO "temporary_wallet_addresses"("wallet", "address") SELECT "wallet", "address" FROM "wallet_addresses"`, undefined);
        await queryRunner.query(`DROP TABLE "wallet_addresses"`, undefined);
        await queryRunner.query(`ALTER TABLE "temporary_wallet_addresses" RENAME TO "wallet_addresses"`, undefined);
        await queryRunner.query(`CREATE TABLE "temporary_bot_wallets" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL, "botAddress" varchar, CONSTRAINT "FK_96b2a83c6e91999aa18048bc91f" FOREIGN KEY ("botAddress") REFERENCES "bots" ("address") ON DELETE NO ACTION ON UPDATE NO ACTION)`, undefined);
        await queryRunner.query(`INSERT INTO "temporary_bot_wallets"("id", "name", "botAddress") SELECT "id", "name", "botAddress" FROM "bot_wallets"`, undefined);
        await queryRunner.query(`DROP TABLE "bot_wallets"`, undefined);
        await queryRunner.query(`ALTER TABLE "temporary_bot_wallets" RENAME TO "bot_wallets"`, undefined);
        await queryRunner.query(`CREATE TABLE "temporary_exchanges" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "track_id" varchar NOT NULL, "currency_from" varchar NOT NULL, "currency_to" varchar NOT NULL, "amount_from" varchar NOT NULL, "amount_to" varchar NOT NULL, "address_from" varchar NOT NULL, "address_to" varchar NOT NULL, "status" varchar NOT NULL, "tx_from" varchar NOT NULL, "tx_to" varchar NOT NULL, "wallet" varchar NOT NULL, "botAddress" varchar, "created_date" datetime NOT NULL DEFAULT (datetime('now')), "updated_date" datetime NOT NULL DEFAULT (datetime('now')), CONSTRAINT "FK_2507d6d2bc55d12009cdd52a6be" FOREIGN KEY ("botAddress") REFERENCES "bots" ("address") ON DELETE NO ACTION ON UPDATE NO ACTION)`, undefined);
        await queryRunner.query(`INSERT INTO "temporary_exchanges"("id", "track_id", "currency_from", "currency_to", "amount_from", "amount_to", "address_from", "address_to", "status", "tx_from", "tx_to", "wallet", "botAddress", "created_date", "updated_date") SELECT "id", "track_id", "currency_from", "currency_to", "amount_from", "amount_to", "address_from", "address_to", "status", "tx_from", "tx_to", "wallet", "botAddress", "created_date", "updated_date" FROM "exchanges"`, undefined);
        await queryRunner.query(`DROP TABLE "exchanges"`, undefined);
        await queryRunner.query(`ALTER TABLE "temporary_exchanges" RENAME TO "exchanges"`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "exchanges" RENAME TO "temporary_exchanges"`, undefined);
        await queryRunner.query(`CREATE TABLE "exchanges" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "track_id" varchar NOT NULL, "currency_from" varchar NOT NULL, "currency_to" varchar NOT NULL, "amount_from" varchar NOT NULL, "amount_to" varchar NOT NULL, "address_from" varchar NOT NULL, "address_to" varchar NOT NULL, "status" varchar NOT NULL, "tx_from" varchar NOT NULL, "tx_to" varchar NOT NULL, "wallet" varchar NOT NULL, "botAddress" varchar, "created_date" datetime NOT NULL DEFAULT (datetime('now')), "updated_date" datetime NOT NULL DEFAULT (datetime('now')))`, undefined);
        await queryRunner.query(`INSERT INTO "exchanges"("id", "track_id", "currency_from", "currency_to", "amount_from", "amount_to", "address_from", "address_to", "status", "tx_from", "tx_to", "wallet", "botAddress", "created_date", "updated_date") SELECT "id", "track_id", "currency_from", "currency_to", "amount_from", "amount_to", "address_from", "address_to", "status", "tx_from", "tx_to", "wallet", "botAddress", "created_date", "updated_date" FROM "temporary_exchanges"`, undefined);
        await queryRunner.query(`DROP TABLE "temporary_exchanges"`, undefined);
        await queryRunner.query(`ALTER TABLE "bot_wallets" RENAME TO "temporary_bot_wallets"`, undefined);
        await queryRunner.query(`CREATE TABLE "bot_wallets" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL, "botAddress" varchar)`, undefined);
        await queryRunner.query(`INSERT INTO "bot_wallets"("id", "name", "botAddress") SELECT "id", "name", "botAddress" FROM "temporary_bot_wallets"`, undefined);
        await queryRunner.query(`DROP TABLE "temporary_bot_wallets"`, undefined);
        await queryRunner.query(`ALTER TABLE "wallet_addresses" RENAME TO "temporary_wallet_addresses"`, undefined);
        await queryRunner.query(`CREATE TABLE "wallet_addresses" ("wallet" varchar PRIMARY KEY NOT NULL, "address" text NOT NULL)`, undefined);
        await queryRunner.query(`INSERT INTO "wallet_addresses"("wallet", "address") SELECT "wallet", "address" FROM "temporary_wallet_addresses"`, undefined);
        await queryRunner.query(`DROP TABLE "temporary_wallet_addresses"`, undefined);
        await queryRunner.query(`ALTER TABLE "bots" RENAME TO "temporary_bots"`, undefined);
        await queryRunner.query(`CREATE TABLE "bots" ("address" varchar PRIMARY KEY NOT NULL, "name" varchar NOT NULL, "description" text NOT NULL, "version" varchar NOT NULL, "type" varchar NOT NULL, "image" varchar NOT NULL, "authorId" integer, CONSTRAINT "UQ_907a3770ffa6e179f7370920356" UNIQUE ("authorId"), CONSTRAINT "FK_907a3770ffa6e179f7370920356" FOREIGN KEY ("authorId") REFERENCES "bot_author" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`, undefined);
        await queryRunner.query(`INSERT INTO "bots"("address", "name", "description", "version", "type", "image", "authorId") SELECT "address", "name", "description", "version", "type", "image", "authorId" FROM "temporary_bots"`, undefined);
        await queryRunner.query(`DROP TABLE "temporary_bots"`, undefined);
        await queryRunner.query(`ALTER TABLE "exchanges" RENAME TO "temporary_exchanges"`, undefined);
        await queryRunner.query(`CREATE TABLE "exchanges" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "track_id" varchar NOT NULL, "currency_from" varchar NOT NULL, "currency_to" varchar NOT NULL, "amount_from" varchar NOT NULL, "amount_to" varchar NOT NULL, "address_from" varchar NOT NULL, "address_to" varchar NOT NULL, "status" varchar NOT NULL, "tx_from" varchar NOT NULL, "tx_to" varchar NOT NULL, "wallet" varchar NOT NULL, "botAddress" varchar, "created_date" datetime NOT NULL DEFAULT (datetime('now')), "updated_date" datetime NOT NULL DEFAULT (datetime('now')), CONSTRAINT "FK_2507d6d2bc55d12009cdd52a6be" FOREIGN KEY ("botAddress") REFERENCES "bots" ("address") ON DELETE NO ACTION ON UPDATE NO ACTION)`, undefined);
        await queryRunner.query(`INSERT INTO "exchanges"("id", "track_id", "currency_from", "currency_to", "amount_from", "amount_to", "address_from", "address_to", "status", "tx_from", "tx_to", "wallet", "botAddress", "created_date", "updated_date") SELECT "id", "track_id", "currency_from", "currency_to", "amount_from", "amount_to", "address_from", "address_to", "status", "tx_from", "tx_to", "wallet", "botAddress", "created_date", "updated_date" FROM "temporary_exchanges"`, undefined);
        await queryRunner.query(`DROP TABLE "temporary_exchanges"`, undefined);
        await queryRunner.query(`ALTER TABLE "bot_wallets" RENAME TO "temporary_bot_wallets"`, undefined);
        await queryRunner.query(`CREATE TABLE "bot_wallets" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL, "botAddress" varchar, CONSTRAINT "FK_96b2a83c6e91999aa18048bc91f" FOREIGN KEY ("botAddress") REFERENCES "bots" ("address") ON DELETE NO ACTION ON UPDATE NO ACTION)`, undefined);
        await queryRunner.query(`INSERT INTO "bot_wallets"("id", "name", "botAddress") SELECT "id", "name", "botAddress" FROM "temporary_bot_wallets"`, undefined);
        await queryRunner.query(`DROP TABLE "temporary_bot_wallets"`, undefined);
        await queryRunner.query(`ALTER TABLE "exchanges" RENAME TO "temporary_exchanges"`, undefined);
        await queryRunner.query(`CREATE TABLE "exchanges" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "track_id" varchar NOT NULL, "currency_from" varchar NOT NULL, "currency_to" varchar NOT NULL, "amount_from" varchar NOT NULL, "amount_to" varchar NOT NULL, "address_from" varchar NOT NULL, "address_to" varchar NOT NULL, "status" varchar NOT NULL, "tx_from" varchar NOT NULL, "tx_to" varchar NOT NULL, "wallet" varchar NOT NULL, "botAddress" varchar, CONSTRAINT "FK_2507d6d2bc55d12009cdd52a6be" FOREIGN KEY ("botAddress") REFERENCES "bots" ("address") ON DELETE NO ACTION ON UPDATE NO ACTION)`, undefined);
        await queryRunner.query(`INSERT INTO "exchanges"("id", "track_id", "currency_from", "currency_to", "amount_from", "amount_to", "address_from", "address_to", "status", "tx_from", "tx_to", "wallet", "botAddress") SELECT "id", "track_id", "currency_from", "currency_to", "amount_from", "amount_to", "address_from", "address_to", "status", "tx_from", "tx_to", "wallet", "botAddress" FROM "temporary_exchanges"`, undefined);
        await queryRunner.query(`DROP TABLE "temporary_exchanges"`, undefined);
        await queryRunner.query(`ALTER TABLE "wallet_addresses" RENAME TO "temporary_wallet_addresses"`, undefined);
        await queryRunner.query(`CREATE TABLE "wallet_addresses" ("wallet" varchar PRIMARY KEY NOT NULL, "address" text NOT NULL)`, undefined);
        await queryRunner.query(`INSERT INTO "wallet_addresses"("wallet", "address") SELECT "wallet", "address" FROM "temporary_wallet_addresses"`, undefined);
        await queryRunner.query(`DROP TABLE "temporary_wallet_addresses"`, undefined);
        await queryRunner.query(`ALTER TABLE "bots" RENAME TO "temporary_bots"`, undefined);
        await queryRunner.query(`CREATE TABLE "bots" ("address" varchar PRIMARY KEY NOT NULL, "name" varchar NOT NULL, "description" text NOT NULL, "version" varchar NOT NULL, "type" varchar NOT NULL, "image" varchar NOT NULL, "authorId" integer, CONSTRAINT "UQ_907a3770ffa6e179f7370920356" UNIQUE ("authorId"), CONSTRAINT "FK_907a3770ffa6e179f7370920356" FOREIGN KEY ("authorId") REFERENCES "bot_author" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`, undefined);
        await queryRunner.query(`INSERT INTO "bots"("address", "name", "description", "version", "type", "image", "authorId") SELECT "address", "name", "description", "version", "type", "image", "authorId" FROM "temporary_bots"`, undefined);
        await queryRunner.query(`DROP TABLE "temporary_bots"`, undefined);
    }

}
