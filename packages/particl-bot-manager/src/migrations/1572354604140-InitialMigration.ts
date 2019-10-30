import {MigrationInterface, QueryRunner} from "typeorm";

export class InitialMigration1572354604140 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`CREATE TABLE "bots" ("address" varchar PRIMARY KEY NOT NULL, "name" varchar NOT NULL, "description" text NOT NULL, "version" varchar NOT NULL, "type" varchar NOT NULL, "image" varchar NOT NULL, CONSTRAINT "UQ_afb36376595f244cf5075200613" UNIQUE ("address"))`, undefined);
        await queryRunner.query(`CREATE TABLE "bot_wallets" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL, "botAddress" varchar)`, undefined);
        await queryRunner.query(`CREATE TABLE "exchanges" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "track_id" varchar NOT NULL, "currency_from" varchar NOT NULL, "currency_to" varchar NOT NULL, "amount_from" varchar NOT NULL, "amount_to" varchar NOT NULL, "address_from" varchar NOT NULL, "address_to" varchar NOT NULL, "status" varchar NOT NULL, "tx_from" varchar NOT NULL, "tx_to" varchar NOT NULL, "wallet" varchar NOT NULL, "botAddress" varchar)`, undefined);
        await queryRunner.query(`CREATE TABLE "wallet_addresses" ("wallet" varchar PRIMARY KEY NOT NULL, "address" text NOT NULL, CONSTRAINT "UQ_9cd8105f6df228e966e9f3c9686" UNIQUE ("wallet"))`, undefined);
        await queryRunner.query(`CREATE TABLE "temporary_bot_wallets" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL, "botAddress" varchar, CONSTRAINT "FK_96b2a83c6e91999aa18048bc91f" FOREIGN KEY ("botAddress") REFERENCES "bots" ("address") ON DELETE NO ACTION ON UPDATE NO ACTION)`, undefined);
        await queryRunner.query(`INSERT INTO "temporary_bot_wallets"("id", "name", "botAddress") SELECT "id", "name", "botAddress" FROM "bot_wallets"`, undefined);
        await queryRunner.query(`DROP TABLE "bot_wallets"`, undefined);
        await queryRunner.query(`ALTER TABLE "temporary_bot_wallets" RENAME TO "bot_wallets"`, undefined);
        await queryRunner.query(`CREATE TABLE "temporary_exchanges" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "track_id" varchar NOT NULL, "currency_from" varchar NOT NULL, "currency_to" varchar NOT NULL, "amount_from" varchar NOT NULL, "amount_to" varchar NOT NULL, "address_from" varchar NOT NULL, "address_to" varchar NOT NULL, "status" varchar NOT NULL, "tx_from" varchar NOT NULL, "tx_to" varchar NOT NULL, "wallet" varchar NOT NULL, "botAddress" varchar, CONSTRAINT "FK_2507d6d2bc55d12009cdd52a6be" FOREIGN KEY ("botAddress") REFERENCES "bots" ("address") ON DELETE NO ACTION ON UPDATE NO ACTION)`, undefined);
        await queryRunner.query(`INSERT INTO "temporary_exchanges"("id", "track_id", "currency_from", "currency_to", "amount_from", "amount_to", "address_from", "address_to", "status", "tx_from", "tx_to", "wallet", "botAddress") SELECT "id", "track_id", "currency_from", "currency_to", "amount_from", "amount_to", "address_from", "address_to", "status", "tx_from", "tx_to", "wallet", "botAddress" FROM "exchanges"`, undefined);
        await queryRunner.query(`DROP TABLE "exchanges"`, undefined);
        await queryRunner.query(`ALTER TABLE "temporary_exchanges" RENAME TO "exchanges"`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "exchanges" RENAME TO "temporary_exchanges"`, undefined);
        await queryRunner.query(`CREATE TABLE "exchanges" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "track_id" varchar NOT NULL, "currency_from" varchar NOT NULL, "currency_to" varchar NOT NULL, "amount_from" varchar NOT NULL, "amount_to" varchar NOT NULL, "address_from" varchar NOT NULL, "address_to" varchar NOT NULL, "status" varchar NOT NULL, "tx_from" varchar NOT NULL, "tx_to" varchar NOT NULL, "wallet" varchar NOT NULL, "botAddress" varchar)`, undefined);
        await queryRunner.query(`INSERT INTO "exchanges"("id", "track_id", "currency_from", "currency_to", "amount_from", "amount_to", "address_from", "address_to", "status", "tx_from", "tx_to", "wallet", "botAddress") SELECT "id", "track_id", "currency_from", "currency_to", "amount_from", "amount_to", "address_from", "address_to", "status", "tx_from", "tx_to", "wallet", "botAddress" FROM "temporary_exchanges"`, undefined);
        await queryRunner.query(`DROP TABLE "temporary_exchanges"`, undefined);
        await queryRunner.query(`ALTER TABLE "bot_wallets" RENAME TO "temporary_bot_wallets"`, undefined);
        await queryRunner.query(`CREATE TABLE "bot_wallets" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL, "botAddress" varchar)`, undefined);
        await queryRunner.query(`INSERT INTO "bot_wallets"("id", "name", "botAddress") SELECT "id", "name", "botAddress" FROM "temporary_bot_wallets"`, undefined);
        await queryRunner.query(`DROP TABLE "temporary_bot_wallets"`, undefined);
        await queryRunner.query(`DROP TABLE "wallet_addresses"`, undefined);
        await queryRunner.query(`DROP TABLE "exchanges"`, undefined);
        await queryRunner.query(`DROP TABLE "bot_wallets"`, undefined);
        await queryRunner.query(`DROP TABLE "bots"`, undefined);
    }

}
