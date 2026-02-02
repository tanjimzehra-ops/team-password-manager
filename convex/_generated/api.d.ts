/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as capabilities from "../capabilities.js";
import type * as elements from "../elements.js";
import type * as externalValues from "../externalValues.js";
import type * as factors from "../factors.js";
import type * as kpis from "../kpis.js";
import type * as matrixCells from "../matrixCells.js";
import type * as seed from "../seed.js";
import type * as systems from "../systems.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  capabilities: typeof capabilities;
  elements: typeof elements;
  externalValues: typeof externalValues;
  factors: typeof factors;
  kpis: typeof kpis;
  matrixCells: typeof matrixCells;
  seed: typeof seed;
  systems: typeof systems;
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
