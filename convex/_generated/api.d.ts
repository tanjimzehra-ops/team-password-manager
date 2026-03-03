/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as auditLogs from "../auditLogs.js";
import type * as capabilities from "../capabilities.js";
import type * as channels from "../channels.js";
import type * as debug from "../debug.js";
import type * as diagnostic from "../diagnostic.js";
import type * as elements from "../elements.js";
import type * as externalValues from "../externalValues.js";
import type * as factors from "../factors.js";
import type * as invitations from "../invitations.js";
import type * as kpis from "../kpis.js";
import type * as lib_crypto from "../lib/crypto.js";
import type * as lib_email from "../lib/email.js";
import type * as lib_mutations from "../lib/mutations.js";
import type * as lib_permissions from "../lib/permissions.js";
import type * as lib_queries from "../lib/queries.js";
import type * as library from "../library.js";
import type * as matrixCells from "../matrixCells.js";
import type * as memberships from "../memberships.js";
import type * as migrations from "../migrations.js";
import type * as organisations from "../organisations.js";
import type * as portfolios from "../portfolios.js";
import type * as seed from "../seed.js";
import type * as seed_dev from "../seed_dev.js";
import type * as systems from "../systems.js";
import type * as users from "../users.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  auditLogs: typeof auditLogs;
  capabilities: typeof capabilities;
  channels: typeof channels;
  debug: typeof debug;
  diagnostic: typeof diagnostic;
  elements: typeof elements;
  externalValues: typeof externalValues;
  factors: typeof factors;
  invitations: typeof invitations;
  kpis: typeof kpis;
  "lib/crypto": typeof lib_crypto;
  "lib/email": typeof lib_email;
  "lib/mutations": typeof lib_mutations;
  "lib/permissions": typeof lib_permissions;
  "lib/queries": typeof lib_queries;
  library: typeof library;
  matrixCells: typeof matrixCells;
  memberships: typeof memberships;
  migrations: typeof migrations;
  organisations: typeof organisations;
  portfolios: typeof portfolios;
  seed: typeof seed;
  seed_dev: typeof seed_dev;
  systems: typeof systems;
  users: typeof users;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
