
/**
 * Client
**/

import * as runtime from './runtime/library.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model ApplicationAnswer
 * 
 */
export type ApplicationAnswer = $Result.DefaultSelection<Prisma.$ApplicationAnswerPayload>
/**
 * Model Application
 * 
 */
export type Application = $Result.DefaultSelection<Prisma.$ApplicationPayload>
/**
 * Model EventAttendance
 * 
 */
export type EventAttendance = $Result.DefaultSelection<Prisma.$EventAttendancePayload>
/**
 * Model Event
 * 
 */
export type Event = $Result.DefaultSelection<Prisma.$EventPayload>
/**
 * Model Profile
 * 
 */
export type Profile = $Result.DefaultSelection<Prisma.$ProfilePayload>
/**
 * Model Question
 * 
 */
export type Question = $Result.DefaultSelection<Prisma.$QuestionPayload>
/**
 * Model Resume
 * 
 */
export type Resume = $Result.DefaultSelection<Prisma.$ResumePayload>
/**
 * Model Sponsor
 * 
 */
export type Sponsor = $Result.DefaultSelection<Prisma.$SponsorPayload>
/**
 * Model TeamMember
 * 
 */
export type TeamMember = $Result.DefaultSelection<Prisma.$TeamMemberPayload>
/**
 * Model Team
 * 
 */
export type Team = $Result.DefaultSelection<Prisma.$TeamPayload>

/**
 * Enums
 */
export namespace $Enums {
  export const role_enum: {
  hacker: 'hacker',
  sponsor: 'sponsor',
  mentor: 'mentor',
  volunteer: 'volunteer',
  admin: 'admin',
  default: 'default'
};

export type role_enum = (typeof role_enum)[keyof typeof role_enum]


export const application_status_enum: {
  draft: 'draft',
  submitted: 'submitted',
  offered: 'offered',
  accepted: 'accepted',
  rejected: 'rejected',
  waitlisted: 'waitlisted'
};

export type application_status_enum = (typeof application_status_enum)[keyof typeof application_status_enum]


export const team_role_enum: {
  leader: 'leader',
  member: 'member'
};

export type team_role_enum = (typeof team_role_enum)[keyof typeof team_role_enum]


export const sponsor_tier_enum: {
  bronze: 'bronze',
  silver: 'silver',
  gold: 'gold',
  platinum: 'platinum'
};

export type sponsor_tier_enum = (typeof sponsor_tier_enum)[keyof typeof sponsor_tier_enum]

}

export type role_enum = $Enums.role_enum

export const role_enum: typeof $Enums.role_enum

export type application_status_enum = $Enums.application_status_enum

export const application_status_enum: typeof $Enums.application_status_enum

export type team_role_enum = $Enums.team_role_enum

export const team_role_enum: typeof $Enums.team_role_enum

export type sponsor_tier_enum = $Enums.sponsor_tier_enum

export const sponsor_tier_enum: typeof $Enums.sponsor_tier_enum

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more ApplicationAnswers
 * const applicationAnswers = await prisma.applicationAnswer.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  const U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more ApplicationAnswers
   * const applicationAnswers = await prisma.applicationAnswer.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>


  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<ClientOptions>, ExtArgs, $Utils.Call<Prisma.TypeMapCb<ClientOptions>, {
    extArgs: ExtArgs
  }>>

      /**
   * `prisma.applicationAnswer`: Exposes CRUD operations for the **ApplicationAnswer** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more ApplicationAnswers
    * const applicationAnswers = await prisma.applicationAnswer.findMany()
    * ```
    */
  get applicationAnswer(): Prisma.ApplicationAnswerDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.application`: Exposes CRUD operations for the **Application** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Applications
    * const applications = await prisma.application.findMany()
    * ```
    */
  get application(): Prisma.ApplicationDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.eventAttendance`: Exposes CRUD operations for the **EventAttendance** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more EventAttendances
    * const eventAttendances = await prisma.eventAttendance.findMany()
    * ```
    */
  get eventAttendance(): Prisma.EventAttendanceDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.event`: Exposes CRUD operations for the **Event** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Events
    * const events = await prisma.event.findMany()
    * ```
    */
  get event(): Prisma.EventDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.profile`: Exposes CRUD operations for the **Profile** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Profiles
    * const profiles = await prisma.profile.findMany()
    * ```
    */
  get profile(): Prisma.ProfileDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.question`: Exposes CRUD operations for the **Question** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Questions
    * const questions = await prisma.question.findMany()
    * ```
    */
  get question(): Prisma.QuestionDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.resume`: Exposes CRUD operations for the **Resume** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Resumes
    * const resumes = await prisma.resume.findMany()
    * ```
    */
  get resume(): Prisma.ResumeDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.sponsor`: Exposes CRUD operations for the **Sponsor** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Sponsors
    * const sponsors = await prisma.sponsor.findMany()
    * ```
    */
  get sponsor(): Prisma.SponsorDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.teamMember`: Exposes CRUD operations for the **TeamMember** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more TeamMembers
    * const teamMembers = await prisma.teamMember.findMany()
    * ```
    */
  get teamMember(): Prisma.TeamMemberDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.team`: Exposes CRUD operations for the **Team** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Teams
    * const teams = await prisma.team.findMany()
    * ```
    */
  get team(): Prisma.TeamDelegate<ExtArgs, ClientOptions>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
   * Metrics
   */
  export type Metrics = runtime.Metrics
  export type Metric<T> = runtime.Metric<T>
  export type MetricHistogram = runtime.MetricHistogram
  export type MetricHistogramBucket = runtime.MetricHistogramBucket

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 6.16.1
   * Query Engine version: 1c57fdcd7e44b29b9313256c76699e91c3ac3c43
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? P : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    ApplicationAnswer: 'ApplicationAnswer',
    Application: 'Application',
    EventAttendance: 'EventAttendance',
    Event: 'Event',
    Profile: 'Profile',
    Question: 'Question',
    Resume: 'Resume',
    Sponsor: 'Sponsor',
    TeamMember: 'TeamMember',
    Team: 'Team'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }

  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "applicationAnswer" | "application" | "eventAttendance" | "event" | "profile" | "question" | "resume" | "sponsor" | "teamMember" | "team"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      ApplicationAnswer: {
        payload: Prisma.$ApplicationAnswerPayload<ExtArgs>
        fields: Prisma.ApplicationAnswerFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ApplicationAnswerFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ApplicationAnswerPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ApplicationAnswerFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ApplicationAnswerPayload>
          }
          findFirst: {
            args: Prisma.ApplicationAnswerFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ApplicationAnswerPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ApplicationAnswerFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ApplicationAnswerPayload>
          }
          findMany: {
            args: Prisma.ApplicationAnswerFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ApplicationAnswerPayload>[]
          }
          create: {
            args: Prisma.ApplicationAnswerCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ApplicationAnswerPayload>
          }
          createMany: {
            args: Prisma.ApplicationAnswerCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ApplicationAnswerCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ApplicationAnswerPayload>[]
          }
          delete: {
            args: Prisma.ApplicationAnswerDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ApplicationAnswerPayload>
          }
          update: {
            args: Prisma.ApplicationAnswerUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ApplicationAnswerPayload>
          }
          deleteMany: {
            args: Prisma.ApplicationAnswerDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ApplicationAnswerUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ApplicationAnswerUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ApplicationAnswerPayload>[]
          }
          upsert: {
            args: Prisma.ApplicationAnswerUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ApplicationAnswerPayload>
          }
          aggregate: {
            args: Prisma.ApplicationAnswerAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateApplicationAnswer>
          }
          groupBy: {
            args: Prisma.ApplicationAnswerGroupByArgs<ExtArgs>
            result: $Utils.Optional<ApplicationAnswerGroupByOutputType>[]
          }
          count: {
            args: Prisma.ApplicationAnswerCountArgs<ExtArgs>
            result: $Utils.Optional<ApplicationAnswerCountAggregateOutputType> | number
          }
        }
      }
      Application: {
        payload: Prisma.$ApplicationPayload<ExtArgs>
        fields: Prisma.ApplicationFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ApplicationFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ApplicationPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ApplicationFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ApplicationPayload>
          }
          findFirst: {
            args: Prisma.ApplicationFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ApplicationPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ApplicationFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ApplicationPayload>
          }
          findMany: {
            args: Prisma.ApplicationFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ApplicationPayload>[]
          }
          create: {
            args: Prisma.ApplicationCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ApplicationPayload>
          }
          createMany: {
            args: Prisma.ApplicationCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ApplicationCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ApplicationPayload>[]
          }
          delete: {
            args: Prisma.ApplicationDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ApplicationPayload>
          }
          update: {
            args: Prisma.ApplicationUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ApplicationPayload>
          }
          deleteMany: {
            args: Prisma.ApplicationDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ApplicationUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ApplicationUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ApplicationPayload>[]
          }
          upsert: {
            args: Prisma.ApplicationUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ApplicationPayload>
          }
          aggregate: {
            args: Prisma.ApplicationAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateApplication>
          }
          groupBy: {
            args: Prisma.ApplicationGroupByArgs<ExtArgs>
            result: $Utils.Optional<ApplicationGroupByOutputType>[]
          }
          count: {
            args: Prisma.ApplicationCountArgs<ExtArgs>
            result: $Utils.Optional<ApplicationCountAggregateOutputType> | number
          }
        }
      }
      EventAttendance: {
        payload: Prisma.$EventAttendancePayload<ExtArgs>
        fields: Prisma.EventAttendanceFieldRefs
        operations: {
          findUnique: {
            args: Prisma.EventAttendanceFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EventAttendancePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.EventAttendanceFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EventAttendancePayload>
          }
          findFirst: {
            args: Prisma.EventAttendanceFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EventAttendancePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.EventAttendanceFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EventAttendancePayload>
          }
          findMany: {
            args: Prisma.EventAttendanceFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EventAttendancePayload>[]
          }
          create: {
            args: Prisma.EventAttendanceCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EventAttendancePayload>
          }
          createMany: {
            args: Prisma.EventAttendanceCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.EventAttendanceCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EventAttendancePayload>[]
          }
          delete: {
            args: Prisma.EventAttendanceDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EventAttendancePayload>
          }
          update: {
            args: Prisma.EventAttendanceUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EventAttendancePayload>
          }
          deleteMany: {
            args: Prisma.EventAttendanceDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.EventAttendanceUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.EventAttendanceUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EventAttendancePayload>[]
          }
          upsert: {
            args: Prisma.EventAttendanceUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EventAttendancePayload>
          }
          aggregate: {
            args: Prisma.EventAttendanceAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateEventAttendance>
          }
          groupBy: {
            args: Prisma.EventAttendanceGroupByArgs<ExtArgs>
            result: $Utils.Optional<EventAttendanceGroupByOutputType>[]
          }
          count: {
            args: Prisma.EventAttendanceCountArgs<ExtArgs>
            result: $Utils.Optional<EventAttendanceCountAggregateOutputType> | number
          }
        }
      }
      Event: {
        payload: Prisma.$EventPayload<ExtArgs>
        fields: Prisma.EventFieldRefs
        operations: {
          findUnique: {
            args: Prisma.EventFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EventPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.EventFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EventPayload>
          }
          findFirst: {
            args: Prisma.EventFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EventPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.EventFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EventPayload>
          }
          findMany: {
            args: Prisma.EventFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EventPayload>[]
          }
          create: {
            args: Prisma.EventCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EventPayload>
          }
          createMany: {
            args: Prisma.EventCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.EventCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EventPayload>[]
          }
          delete: {
            args: Prisma.EventDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EventPayload>
          }
          update: {
            args: Prisma.EventUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EventPayload>
          }
          deleteMany: {
            args: Prisma.EventDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.EventUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.EventUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EventPayload>[]
          }
          upsert: {
            args: Prisma.EventUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EventPayload>
          }
          aggregate: {
            args: Prisma.EventAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateEvent>
          }
          groupBy: {
            args: Prisma.EventGroupByArgs<ExtArgs>
            result: $Utils.Optional<EventGroupByOutputType>[]
          }
          count: {
            args: Prisma.EventCountArgs<ExtArgs>
            result: $Utils.Optional<EventCountAggregateOutputType> | number
          }
        }
      }
      Profile: {
        payload: Prisma.$ProfilePayload<ExtArgs>
        fields: Prisma.ProfileFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ProfileFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProfilePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ProfileFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProfilePayload>
          }
          findFirst: {
            args: Prisma.ProfileFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProfilePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ProfileFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProfilePayload>
          }
          findMany: {
            args: Prisma.ProfileFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProfilePayload>[]
          }
          create: {
            args: Prisma.ProfileCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProfilePayload>
          }
          createMany: {
            args: Prisma.ProfileCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ProfileCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProfilePayload>[]
          }
          delete: {
            args: Prisma.ProfileDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProfilePayload>
          }
          update: {
            args: Prisma.ProfileUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProfilePayload>
          }
          deleteMany: {
            args: Prisma.ProfileDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ProfileUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ProfileUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProfilePayload>[]
          }
          upsert: {
            args: Prisma.ProfileUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProfilePayload>
          }
          aggregate: {
            args: Prisma.ProfileAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateProfile>
          }
          groupBy: {
            args: Prisma.ProfileGroupByArgs<ExtArgs>
            result: $Utils.Optional<ProfileGroupByOutputType>[]
          }
          count: {
            args: Prisma.ProfileCountArgs<ExtArgs>
            result: $Utils.Optional<ProfileCountAggregateOutputType> | number
          }
        }
      }
      Question: {
        payload: Prisma.$QuestionPayload<ExtArgs>
        fields: Prisma.QuestionFieldRefs
        operations: {
          findUnique: {
            args: Prisma.QuestionFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QuestionPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.QuestionFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QuestionPayload>
          }
          findFirst: {
            args: Prisma.QuestionFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QuestionPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.QuestionFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QuestionPayload>
          }
          findMany: {
            args: Prisma.QuestionFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QuestionPayload>[]
          }
          create: {
            args: Prisma.QuestionCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QuestionPayload>
          }
          createMany: {
            args: Prisma.QuestionCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.QuestionCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QuestionPayload>[]
          }
          delete: {
            args: Prisma.QuestionDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QuestionPayload>
          }
          update: {
            args: Prisma.QuestionUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QuestionPayload>
          }
          deleteMany: {
            args: Prisma.QuestionDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.QuestionUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.QuestionUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QuestionPayload>[]
          }
          upsert: {
            args: Prisma.QuestionUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QuestionPayload>
          }
          aggregate: {
            args: Prisma.QuestionAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateQuestion>
          }
          groupBy: {
            args: Prisma.QuestionGroupByArgs<ExtArgs>
            result: $Utils.Optional<QuestionGroupByOutputType>[]
          }
          count: {
            args: Prisma.QuestionCountArgs<ExtArgs>
            result: $Utils.Optional<QuestionCountAggregateOutputType> | number
          }
        }
      }
      Resume: {
        payload: Prisma.$ResumePayload<ExtArgs>
        fields: Prisma.ResumeFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ResumeFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ResumePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ResumeFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ResumePayload>
          }
          findFirst: {
            args: Prisma.ResumeFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ResumePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ResumeFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ResumePayload>
          }
          findMany: {
            args: Prisma.ResumeFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ResumePayload>[]
          }
          create: {
            args: Prisma.ResumeCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ResumePayload>
          }
          createMany: {
            args: Prisma.ResumeCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ResumeCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ResumePayload>[]
          }
          delete: {
            args: Prisma.ResumeDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ResumePayload>
          }
          update: {
            args: Prisma.ResumeUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ResumePayload>
          }
          deleteMany: {
            args: Prisma.ResumeDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ResumeUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ResumeUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ResumePayload>[]
          }
          upsert: {
            args: Prisma.ResumeUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ResumePayload>
          }
          aggregate: {
            args: Prisma.ResumeAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateResume>
          }
          groupBy: {
            args: Prisma.ResumeGroupByArgs<ExtArgs>
            result: $Utils.Optional<ResumeGroupByOutputType>[]
          }
          count: {
            args: Prisma.ResumeCountArgs<ExtArgs>
            result: $Utils.Optional<ResumeCountAggregateOutputType> | number
          }
        }
      }
      Sponsor: {
        payload: Prisma.$SponsorPayload<ExtArgs>
        fields: Prisma.SponsorFieldRefs
        operations: {
          findUnique: {
            args: Prisma.SponsorFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SponsorPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.SponsorFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SponsorPayload>
          }
          findFirst: {
            args: Prisma.SponsorFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SponsorPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.SponsorFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SponsorPayload>
          }
          findMany: {
            args: Prisma.SponsorFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SponsorPayload>[]
          }
          create: {
            args: Prisma.SponsorCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SponsorPayload>
          }
          createMany: {
            args: Prisma.SponsorCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.SponsorCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SponsorPayload>[]
          }
          delete: {
            args: Prisma.SponsorDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SponsorPayload>
          }
          update: {
            args: Prisma.SponsorUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SponsorPayload>
          }
          deleteMany: {
            args: Prisma.SponsorDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.SponsorUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.SponsorUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SponsorPayload>[]
          }
          upsert: {
            args: Prisma.SponsorUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SponsorPayload>
          }
          aggregate: {
            args: Prisma.SponsorAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateSponsor>
          }
          groupBy: {
            args: Prisma.SponsorGroupByArgs<ExtArgs>
            result: $Utils.Optional<SponsorGroupByOutputType>[]
          }
          count: {
            args: Prisma.SponsorCountArgs<ExtArgs>
            result: $Utils.Optional<SponsorCountAggregateOutputType> | number
          }
        }
      }
      TeamMember: {
        payload: Prisma.$TeamMemberPayload<ExtArgs>
        fields: Prisma.TeamMemberFieldRefs
        operations: {
          findUnique: {
            args: Prisma.TeamMemberFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TeamMemberPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.TeamMemberFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TeamMemberPayload>
          }
          findFirst: {
            args: Prisma.TeamMemberFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TeamMemberPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.TeamMemberFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TeamMemberPayload>
          }
          findMany: {
            args: Prisma.TeamMemberFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TeamMemberPayload>[]
          }
          create: {
            args: Prisma.TeamMemberCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TeamMemberPayload>
          }
          createMany: {
            args: Prisma.TeamMemberCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.TeamMemberCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TeamMemberPayload>[]
          }
          delete: {
            args: Prisma.TeamMemberDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TeamMemberPayload>
          }
          update: {
            args: Prisma.TeamMemberUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TeamMemberPayload>
          }
          deleteMany: {
            args: Prisma.TeamMemberDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.TeamMemberUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.TeamMemberUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TeamMemberPayload>[]
          }
          upsert: {
            args: Prisma.TeamMemberUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TeamMemberPayload>
          }
          aggregate: {
            args: Prisma.TeamMemberAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateTeamMember>
          }
          groupBy: {
            args: Prisma.TeamMemberGroupByArgs<ExtArgs>
            result: $Utils.Optional<TeamMemberGroupByOutputType>[]
          }
          count: {
            args: Prisma.TeamMemberCountArgs<ExtArgs>
            result: $Utils.Optional<TeamMemberCountAggregateOutputType> | number
          }
        }
      }
      Team: {
        payload: Prisma.$TeamPayload<ExtArgs>
        fields: Prisma.TeamFieldRefs
        operations: {
          findUnique: {
            args: Prisma.TeamFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TeamPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.TeamFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TeamPayload>
          }
          findFirst: {
            args: Prisma.TeamFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TeamPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.TeamFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TeamPayload>
          }
          findMany: {
            args: Prisma.TeamFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TeamPayload>[]
          }
          create: {
            args: Prisma.TeamCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TeamPayload>
          }
          createMany: {
            args: Prisma.TeamCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.TeamCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TeamPayload>[]
          }
          delete: {
            args: Prisma.TeamDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TeamPayload>
          }
          update: {
            args: Prisma.TeamUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TeamPayload>
          }
          deleteMany: {
            args: Prisma.TeamDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.TeamUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.TeamUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TeamPayload>[]
          }
          upsert: {
            args: Prisma.TeamUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TeamPayload>
          }
          aggregate: {
            args: Prisma.TeamAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateTeam>
          }
          groupBy: {
            args: Prisma.TeamGroupByArgs<ExtArgs>
            result: $Utils.Optional<TeamGroupByOutputType>[]
          }
          count: {
            args: Prisma.TeamCountArgs<ExtArgs>
            result: $Utils.Optional<TeamCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasourceUrl?: string
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Shorthand for `emit: 'stdout'`
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events only
     * log: [
     *   { emit: 'event', level: 'query' },
     *   { emit: 'event', level: 'info' },
     *   { emit: 'event', level: 'warn' }
     *   { emit: 'event', level: 'error' }
     * ]
     * 
     * / Emit as events and log to stdout
     * og: [
     *  { emit: 'stdout', level: 'query' },
     *  { emit: 'stdout', level: 'info' },
     *  { emit: 'stdout', level: 'warn' }
     *  { emit: 'stdout', level: 'error' }
     * 
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
    /**
     * Instance of a Driver Adapter, e.g., like one provided by `@prisma/adapter-planetscale`
     */
    adapter?: runtime.SqlDriverAdapterFactory | null
    /**
     * Global configuration for omitting model fields by default.
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig
  }
  export type GlobalOmitConfig = {
    applicationAnswer?: ApplicationAnswerOmit
    application?: ApplicationOmit
    eventAttendance?: EventAttendanceOmit
    event?: EventOmit
    profile?: ProfileOmit
    question?: QuestionOmit
    resume?: ResumeOmit
    sponsor?: SponsorOmit
    teamMember?: TeamMemberOmit
    team?: TeamOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type CheckIsLogLevel<T> = T extends LogLevel ? T : never;

  export type GetLogType<T> = CheckIsLogLevel<
    T extends LogDefinition ? T['level'] : T
  >;

  export type GetEvents<T extends any[]> = T extends Array<LogLevel | LogDefinition>
    ? GetLogType<T[number]>
    : never;

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'updateManyAndReturn'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type ApplicationCountOutputType
   */

  export type ApplicationCountOutputType = {
    answers: number
  }

  export type ApplicationCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    answers?: boolean | ApplicationCountOutputTypeCountAnswersArgs
  }

  // Custom InputTypes
  /**
   * ApplicationCountOutputType without action
   */
  export type ApplicationCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ApplicationCountOutputType
     */
    select?: ApplicationCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * ApplicationCountOutputType without action
   */
  export type ApplicationCountOutputTypeCountAnswersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ApplicationAnswerWhereInput
  }


  /**
   * Count Type EventCountOutputType
   */

  export type EventCountOutputType = {
    attendance: number
  }

  export type EventCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    attendance?: boolean | EventCountOutputTypeCountAttendanceArgs
  }

  // Custom InputTypes
  /**
   * EventCountOutputType without action
   */
  export type EventCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EventCountOutputType
     */
    select?: EventCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * EventCountOutputType without action
   */
  export type EventCountOutputTypeCountAttendanceArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: EventAttendanceWhereInput
  }


  /**
   * Count Type ProfileCountOutputType
   */

  export type ProfileCountOutputType = {
    resumes: number
    applications: number
    eventAttendance: number
    teamMembers: number
  }

  export type ProfileCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    resumes?: boolean | ProfileCountOutputTypeCountResumesArgs
    applications?: boolean | ProfileCountOutputTypeCountApplicationsArgs
    eventAttendance?: boolean | ProfileCountOutputTypeCountEventAttendanceArgs
    teamMembers?: boolean | ProfileCountOutputTypeCountTeamMembersArgs
  }

  // Custom InputTypes
  /**
   * ProfileCountOutputType without action
   */
  export type ProfileCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProfileCountOutputType
     */
    select?: ProfileCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * ProfileCountOutputType without action
   */
  export type ProfileCountOutputTypeCountResumesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ResumeWhereInput
  }

  /**
   * ProfileCountOutputType without action
   */
  export type ProfileCountOutputTypeCountApplicationsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ApplicationWhereInput
  }

  /**
   * ProfileCountOutputType without action
   */
  export type ProfileCountOutputTypeCountEventAttendanceArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: EventAttendanceWhereInput
  }

  /**
   * ProfileCountOutputType without action
   */
  export type ProfileCountOutputTypeCountTeamMembersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TeamMemberWhereInput
  }


  /**
   * Count Type QuestionCountOutputType
   */

  export type QuestionCountOutputType = {
    answers: number
  }

  export type QuestionCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    answers?: boolean | QuestionCountOutputTypeCountAnswersArgs
  }

  // Custom InputTypes
  /**
   * QuestionCountOutputType without action
   */
  export type QuestionCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the QuestionCountOutputType
     */
    select?: QuestionCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * QuestionCountOutputType without action
   */
  export type QuestionCountOutputTypeCountAnswersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ApplicationAnswerWhereInput
  }


  /**
   * Count Type ResumeCountOutputType
   */

  export type ResumeCountOutputType = {
    applications: number
  }

  export type ResumeCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    applications?: boolean | ResumeCountOutputTypeCountApplicationsArgs
  }

  // Custom InputTypes
  /**
   * ResumeCountOutputType without action
   */
  export type ResumeCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ResumeCountOutputType
     */
    select?: ResumeCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * ResumeCountOutputType without action
   */
  export type ResumeCountOutputTypeCountApplicationsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ApplicationWhereInput
  }


  /**
   * Count Type TeamCountOutputType
   */

  export type TeamCountOutputType = {
    members: number
  }

  export type TeamCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    members?: boolean | TeamCountOutputTypeCountMembersArgs
  }

  // Custom InputTypes
  /**
   * TeamCountOutputType without action
   */
  export type TeamCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TeamCountOutputType
     */
    select?: TeamCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * TeamCountOutputType without action
   */
  export type TeamCountOutputTypeCountMembersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TeamMemberWhereInput
  }


  /**
   * Models
   */

  /**
   * Model ApplicationAnswer
   */

  export type AggregateApplicationAnswer = {
    _count: ApplicationAnswerCountAggregateOutputType | null
    _avg: ApplicationAnswerAvgAggregateOutputType | null
    _sum: ApplicationAnswerSumAggregateOutputType | null
    _min: ApplicationAnswerMinAggregateOutputType | null
    _max: ApplicationAnswerMaxAggregateOutputType | null
  }

  export type ApplicationAnswerAvgAggregateOutputType = {
    id: number | null
    application_id: number | null
    question_id: number | null
  }

  export type ApplicationAnswerSumAggregateOutputType = {
    id: bigint | null
    application_id: bigint | null
    question_id: bigint | null
  }

  export type ApplicationAnswerMinAggregateOutputType = {
    id: bigint | null
    application_id: bigint | null
    question_id: bigint | null
    answer: string | null
    created_at: Date | null
    updated_at: Date | null
  }

  export type ApplicationAnswerMaxAggregateOutputType = {
    id: bigint | null
    application_id: bigint | null
    question_id: bigint | null
    answer: string | null
    created_at: Date | null
    updated_at: Date | null
  }

  export type ApplicationAnswerCountAggregateOutputType = {
    id: number
    application_id: number
    question_id: number
    answer: number
    created_at: number
    updated_at: number
    _all: number
  }


  export type ApplicationAnswerAvgAggregateInputType = {
    id?: true
    application_id?: true
    question_id?: true
  }

  export type ApplicationAnswerSumAggregateInputType = {
    id?: true
    application_id?: true
    question_id?: true
  }

  export type ApplicationAnswerMinAggregateInputType = {
    id?: true
    application_id?: true
    question_id?: true
    answer?: true
    created_at?: true
    updated_at?: true
  }

  export type ApplicationAnswerMaxAggregateInputType = {
    id?: true
    application_id?: true
    question_id?: true
    answer?: true
    created_at?: true
    updated_at?: true
  }

  export type ApplicationAnswerCountAggregateInputType = {
    id?: true
    application_id?: true
    question_id?: true
    answer?: true
    created_at?: true
    updated_at?: true
    _all?: true
  }

  export type ApplicationAnswerAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ApplicationAnswer to aggregate.
     */
    where?: ApplicationAnswerWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ApplicationAnswers to fetch.
     */
    orderBy?: ApplicationAnswerOrderByWithRelationInput | ApplicationAnswerOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ApplicationAnswerWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ApplicationAnswers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ApplicationAnswers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned ApplicationAnswers
    **/
    _count?: true | ApplicationAnswerCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ApplicationAnswerAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ApplicationAnswerSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ApplicationAnswerMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ApplicationAnswerMaxAggregateInputType
  }

  export type GetApplicationAnswerAggregateType<T extends ApplicationAnswerAggregateArgs> = {
        [P in keyof T & keyof AggregateApplicationAnswer]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateApplicationAnswer[P]>
      : GetScalarType<T[P], AggregateApplicationAnswer[P]>
  }




  export type ApplicationAnswerGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ApplicationAnswerWhereInput
    orderBy?: ApplicationAnswerOrderByWithAggregationInput | ApplicationAnswerOrderByWithAggregationInput[]
    by: ApplicationAnswerScalarFieldEnum[] | ApplicationAnswerScalarFieldEnum
    having?: ApplicationAnswerScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ApplicationAnswerCountAggregateInputType | true
    _avg?: ApplicationAnswerAvgAggregateInputType
    _sum?: ApplicationAnswerSumAggregateInputType
    _min?: ApplicationAnswerMinAggregateInputType
    _max?: ApplicationAnswerMaxAggregateInputType
  }

  export type ApplicationAnswerGroupByOutputType = {
    id: bigint
    application_id: bigint
    question_id: bigint
    answer: string | null
    created_at: Date
    updated_at: Date
    _count: ApplicationAnswerCountAggregateOutputType | null
    _avg: ApplicationAnswerAvgAggregateOutputType | null
    _sum: ApplicationAnswerSumAggregateOutputType | null
    _min: ApplicationAnswerMinAggregateOutputType | null
    _max: ApplicationAnswerMaxAggregateOutputType | null
  }

  type GetApplicationAnswerGroupByPayload<T extends ApplicationAnswerGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ApplicationAnswerGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ApplicationAnswerGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ApplicationAnswerGroupByOutputType[P]>
            : GetScalarType<T[P], ApplicationAnswerGroupByOutputType[P]>
        }
      >
    >


  export type ApplicationAnswerSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    application_id?: boolean
    question_id?: boolean
    answer?: boolean
    created_at?: boolean
    updated_at?: boolean
    application?: boolean | ApplicationDefaultArgs<ExtArgs>
    question?: boolean | QuestionDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["applicationAnswer"]>

  export type ApplicationAnswerSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    application_id?: boolean
    question_id?: boolean
    answer?: boolean
    created_at?: boolean
    updated_at?: boolean
    application?: boolean | ApplicationDefaultArgs<ExtArgs>
    question?: boolean | QuestionDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["applicationAnswer"]>

  export type ApplicationAnswerSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    application_id?: boolean
    question_id?: boolean
    answer?: boolean
    created_at?: boolean
    updated_at?: boolean
    application?: boolean | ApplicationDefaultArgs<ExtArgs>
    question?: boolean | QuestionDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["applicationAnswer"]>

  export type ApplicationAnswerSelectScalar = {
    id?: boolean
    application_id?: boolean
    question_id?: boolean
    answer?: boolean
    created_at?: boolean
    updated_at?: boolean
  }

  export type ApplicationAnswerOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "application_id" | "question_id" | "answer" | "created_at" | "updated_at", ExtArgs["result"]["applicationAnswer"]>
  export type ApplicationAnswerInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    application?: boolean | ApplicationDefaultArgs<ExtArgs>
    question?: boolean | QuestionDefaultArgs<ExtArgs>
  }
  export type ApplicationAnswerIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    application?: boolean | ApplicationDefaultArgs<ExtArgs>
    question?: boolean | QuestionDefaultArgs<ExtArgs>
  }
  export type ApplicationAnswerIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    application?: boolean | ApplicationDefaultArgs<ExtArgs>
    question?: boolean | QuestionDefaultArgs<ExtArgs>
  }

  export type $ApplicationAnswerPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "ApplicationAnswer"
    objects: {
      application: Prisma.$ApplicationPayload<ExtArgs>
      question: Prisma.$QuestionPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: bigint
      application_id: bigint
      question_id: bigint
      answer: string | null
      created_at: Date
      updated_at: Date
    }, ExtArgs["result"]["applicationAnswer"]>
    composites: {}
  }

  type ApplicationAnswerGetPayload<S extends boolean | null | undefined | ApplicationAnswerDefaultArgs> = $Result.GetResult<Prisma.$ApplicationAnswerPayload, S>

  type ApplicationAnswerCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ApplicationAnswerFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ApplicationAnswerCountAggregateInputType | true
    }

  export interface ApplicationAnswerDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['ApplicationAnswer'], meta: { name: 'ApplicationAnswer' } }
    /**
     * Find zero or one ApplicationAnswer that matches the filter.
     * @param {ApplicationAnswerFindUniqueArgs} args - Arguments to find a ApplicationAnswer
     * @example
     * // Get one ApplicationAnswer
     * const applicationAnswer = await prisma.applicationAnswer.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ApplicationAnswerFindUniqueArgs>(args: SelectSubset<T, ApplicationAnswerFindUniqueArgs<ExtArgs>>): Prisma__ApplicationAnswerClient<$Result.GetResult<Prisma.$ApplicationAnswerPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one ApplicationAnswer that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ApplicationAnswerFindUniqueOrThrowArgs} args - Arguments to find a ApplicationAnswer
     * @example
     * // Get one ApplicationAnswer
     * const applicationAnswer = await prisma.applicationAnswer.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ApplicationAnswerFindUniqueOrThrowArgs>(args: SelectSubset<T, ApplicationAnswerFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ApplicationAnswerClient<$Result.GetResult<Prisma.$ApplicationAnswerPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ApplicationAnswer that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ApplicationAnswerFindFirstArgs} args - Arguments to find a ApplicationAnswer
     * @example
     * // Get one ApplicationAnswer
     * const applicationAnswer = await prisma.applicationAnswer.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ApplicationAnswerFindFirstArgs>(args?: SelectSubset<T, ApplicationAnswerFindFirstArgs<ExtArgs>>): Prisma__ApplicationAnswerClient<$Result.GetResult<Prisma.$ApplicationAnswerPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ApplicationAnswer that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ApplicationAnswerFindFirstOrThrowArgs} args - Arguments to find a ApplicationAnswer
     * @example
     * // Get one ApplicationAnswer
     * const applicationAnswer = await prisma.applicationAnswer.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ApplicationAnswerFindFirstOrThrowArgs>(args?: SelectSubset<T, ApplicationAnswerFindFirstOrThrowArgs<ExtArgs>>): Prisma__ApplicationAnswerClient<$Result.GetResult<Prisma.$ApplicationAnswerPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more ApplicationAnswers that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ApplicationAnswerFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ApplicationAnswers
     * const applicationAnswers = await prisma.applicationAnswer.findMany()
     * 
     * // Get first 10 ApplicationAnswers
     * const applicationAnswers = await prisma.applicationAnswer.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const applicationAnswerWithIdOnly = await prisma.applicationAnswer.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ApplicationAnswerFindManyArgs>(args?: SelectSubset<T, ApplicationAnswerFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ApplicationAnswerPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a ApplicationAnswer.
     * @param {ApplicationAnswerCreateArgs} args - Arguments to create a ApplicationAnswer.
     * @example
     * // Create one ApplicationAnswer
     * const ApplicationAnswer = await prisma.applicationAnswer.create({
     *   data: {
     *     // ... data to create a ApplicationAnswer
     *   }
     * })
     * 
     */
    create<T extends ApplicationAnswerCreateArgs>(args: SelectSubset<T, ApplicationAnswerCreateArgs<ExtArgs>>): Prisma__ApplicationAnswerClient<$Result.GetResult<Prisma.$ApplicationAnswerPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many ApplicationAnswers.
     * @param {ApplicationAnswerCreateManyArgs} args - Arguments to create many ApplicationAnswers.
     * @example
     * // Create many ApplicationAnswers
     * const applicationAnswer = await prisma.applicationAnswer.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ApplicationAnswerCreateManyArgs>(args?: SelectSubset<T, ApplicationAnswerCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many ApplicationAnswers and returns the data saved in the database.
     * @param {ApplicationAnswerCreateManyAndReturnArgs} args - Arguments to create many ApplicationAnswers.
     * @example
     * // Create many ApplicationAnswers
     * const applicationAnswer = await prisma.applicationAnswer.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many ApplicationAnswers and only return the `id`
     * const applicationAnswerWithIdOnly = await prisma.applicationAnswer.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ApplicationAnswerCreateManyAndReturnArgs>(args?: SelectSubset<T, ApplicationAnswerCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ApplicationAnswerPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a ApplicationAnswer.
     * @param {ApplicationAnswerDeleteArgs} args - Arguments to delete one ApplicationAnswer.
     * @example
     * // Delete one ApplicationAnswer
     * const ApplicationAnswer = await prisma.applicationAnswer.delete({
     *   where: {
     *     // ... filter to delete one ApplicationAnswer
     *   }
     * })
     * 
     */
    delete<T extends ApplicationAnswerDeleteArgs>(args: SelectSubset<T, ApplicationAnswerDeleteArgs<ExtArgs>>): Prisma__ApplicationAnswerClient<$Result.GetResult<Prisma.$ApplicationAnswerPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one ApplicationAnswer.
     * @param {ApplicationAnswerUpdateArgs} args - Arguments to update one ApplicationAnswer.
     * @example
     * // Update one ApplicationAnswer
     * const applicationAnswer = await prisma.applicationAnswer.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ApplicationAnswerUpdateArgs>(args: SelectSubset<T, ApplicationAnswerUpdateArgs<ExtArgs>>): Prisma__ApplicationAnswerClient<$Result.GetResult<Prisma.$ApplicationAnswerPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more ApplicationAnswers.
     * @param {ApplicationAnswerDeleteManyArgs} args - Arguments to filter ApplicationAnswers to delete.
     * @example
     * // Delete a few ApplicationAnswers
     * const { count } = await prisma.applicationAnswer.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ApplicationAnswerDeleteManyArgs>(args?: SelectSubset<T, ApplicationAnswerDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ApplicationAnswers.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ApplicationAnswerUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ApplicationAnswers
     * const applicationAnswer = await prisma.applicationAnswer.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ApplicationAnswerUpdateManyArgs>(args: SelectSubset<T, ApplicationAnswerUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ApplicationAnswers and returns the data updated in the database.
     * @param {ApplicationAnswerUpdateManyAndReturnArgs} args - Arguments to update many ApplicationAnswers.
     * @example
     * // Update many ApplicationAnswers
     * const applicationAnswer = await prisma.applicationAnswer.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more ApplicationAnswers and only return the `id`
     * const applicationAnswerWithIdOnly = await prisma.applicationAnswer.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends ApplicationAnswerUpdateManyAndReturnArgs>(args: SelectSubset<T, ApplicationAnswerUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ApplicationAnswerPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one ApplicationAnswer.
     * @param {ApplicationAnswerUpsertArgs} args - Arguments to update or create a ApplicationAnswer.
     * @example
     * // Update or create a ApplicationAnswer
     * const applicationAnswer = await prisma.applicationAnswer.upsert({
     *   create: {
     *     // ... data to create a ApplicationAnswer
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ApplicationAnswer we want to update
     *   }
     * })
     */
    upsert<T extends ApplicationAnswerUpsertArgs>(args: SelectSubset<T, ApplicationAnswerUpsertArgs<ExtArgs>>): Prisma__ApplicationAnswerClient<$Result.GetResult<Prisma.$ApplicationAnswerPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of ApplicationAnswers.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ApplicationAnswerCountArgs} args - Arguments to filter ApplicationAnswers to count.
     * @example
     * // Count the number of ApplicationAnswers
     * const count = await prisma.applicationAnswer.count({
     *   where: {
     *     // ... the filter for the ApplicationAnswers we want to count
     *   }
     * })
    **/
    count<T extends ApplicationAnswerCountArgs>(
      args?: Subset<T, ApplicationAnswerCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ApplicationAnswerCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ApplicationAnswer.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ApplicationAnswerAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ApplicationAnswerAggregateArgs>(args: Subset<T, ApplicationAnswerAggregateArgs>): Prisma.PrismaPromise<GetApplicationAnswerAggregateType<T>>

    /**
     * Group by ApplicationAnswer.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ApplicationAnswerGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ApplicationAnswerGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ApplicationAnswerGroupByArgs['orderBy'] }
        : { orderBy?: ApplicationAnswerGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ApplicationAnswerGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetApplicationAnswerGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the ApplicationAnswer model
   */
  readonly fields: ApplicationAnswerFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for ApplicationAnswer.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ApplicationAnswerClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    application<T extends ApplicationDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ApplicationDefaultArgs<ExtArgs>>): Prisma__ApplicationClient<$Result.GetResult<Prisma.$ApplicationPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    question<T extends QuestionDefaultArgs<ExtArgs> = {}>(args?: Subset<T, QuestionDefaultArgs<ExtArgs>>): Prisma__QuestionClient<$Result.GetResult<Prisma.$QuestionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the ApplicationAnswer model
   */
  interface ApplicationAnswerFieldRefs {
    readonly id: FieldRef<"ApplicationAnswer", 'BigInt'>
    readonly application_id: FieldRef<"ApplicationAnswer", 'BigInt'>
    readonly question_id: FieldRef<"ApplicationAnswer", 'BigInt'>
    readonly answer: FieldRef<"ApplicationAnswer", 'String'>
    readonly created_at: FieldRef<"ApplicationAnswer", 'DateTime'>
    readonly updated_at: FieldRef<"ApplicationAnswer", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * ApplicationAnswer findUnique
   */
  export type ApplicationAnswerFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ApplicationAnswer
     */
    select?: ApplicationAnswerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ApplicationAnswer
     */
    omit?: ApplicationAnswerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ApplicationAnswerInclude<ExtArgs> | null
    /**
     * Filter, which ApplicationAnswer to fetch.
     */
    where: ApplicationAnswerWhereUniqueInput
  }

  /**
   * ApplicationAnswer findUniqueOrThrow
   */
  export type ApplicationAnswerFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ApplicationAnswer
     */
    select?: ApplicationAnswerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ApplicationAnswer
     */
    omit?: ApplicationAnswerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ApplicationAnswerInclude<ExtArgs> | null
    /**
     * Filter, which ApplicationAnswer to fetch.
     */
    where: ApplicationAnswerWhereUniqueInput
  }

  /**
   * ApplicationAnswer findFirst
   */
  export type ApplicationAnswerFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ApplicationAnswer
     */
    select?: ApplicationAnswerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ApplicationAnswer
     */
    omit?: ApplicationAnswerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ApplicationAnswerInclude<ExtArgs> | null
    /**
     * Filter, which ApplicationAnswer to fetch.
     */
    where?: ApplicationAnswerWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ApplicationAnswers to fetch.
     */
    orderBy?: ApplicationAnswerOrderByWithRelationInput | ApplicationAnswerOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ApplicationAnswers.
     */
    cursor?: ApplicationAnswerWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ApplicationAnswers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ApplicationAnswers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ApplicationAnswers.
     */
    distinct?: ApplicationAnswerScalarFieldEnum | ApplicationAnswerScalarFieldEnum[]
  }

  /**
   * ApplicationAnswer findFirstOrThrow
   */
  export type ApplicationAnswerFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ApplicationAnswer
     */
    select?: ApplicationAnswerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ApplicationAnswer
     */
    omit?: ApplicationAnswerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ApplicationAnswerInclude<ExtArgs> | null
    /**
     * Filter, which ApplicationAnswer to fetch.
     */
    where?: ApplicationAnswerWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ApplicationAnswers to fetch.
     */
    orderBy?: ApplicationAnswerOrderByWithRelationInput | ApplicationAnswerOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ApplicationAnswers.
     */
    cursor?: ApplicationAnswerWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ApplicationAnswers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ApplicationAnswers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ApplicationAnswers.
     */
    distinct?: ApplicationAnswerScalarFieldEnum | ApplicationAnswerScalarFieldEnum[]
  }

  /**
   * ApplicationAnswer findMany
   */
  export type ApplicationAnswerFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ApplicationAnswer
     */
    select?: ApplicationAnswerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ApplicationAnswer
     */
    omit?: ApplicationAnswerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ApplicationAnswerInclude<ExtArgs> | null
    /**
     * Filter, which ApplicationAnswers to fetch.
     */
    where?: ApplicationAnswerWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ApplicationAnswers to fetch.
     */
    orderBy?: ApplicationAnswerOrderByWithRelationInput | ApplicationAnswerOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing ApplicationAnswers.
     */
    cursor?: ApplicationAnswerWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ApplicationAnswers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ApplicationAnswers.
     */
    skip?: number
    distinct?: ApplicationAnswerScalarFieldEnum | ApplicationAnswerScalarFieldEnum[]
  }

  /**
   * ApplicationAnswer create
   */
  export type ApplicationAnswerCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ApplicationAnswer
     */
    select?: ApplicationAnswerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ApplicationAnswer
     */
    omit?: ApplicationAnswerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ApplicationAnswerInclude<ExtArgs> | null
    /**
     * The data needed to create a ApplicationAnswer.
     */
    data: XOR<ApplicationAnswerCreateInput, ApplicationAnswerUncheckedCreateInput>
  }

  /**
   * ApplicationAnswer createMany
   */
  export type ApplicationAnswerCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many ApplicationAnswers.
     */
    data: ApplicationAnswerCreateManyInput | ApplicationAnswerCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ApplicationAnswer createManyAndReturn
   */
  export type ApplicationAnswerCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ApplicationAnswer
     */
    select?: ApplicationAnswerSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ApplicationAnswer
     */
    omit?: ApplicationAnswerOmit<ExtArgs> | null
    /**
     * The data used to create many ApplicationAnswers.
     */
    data: ApplicationAnswerCreateManyInput | ApplicationAnswerCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ApplicationAnswerIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * ApplicationAnswer update
   */
  export type ApplicationAnswerUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ApplicationAnswer
     */
    select?: ApplicationAnswerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ApplicationAnswer
     */
    omit?: ApplicationAnswerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ApplicationAnswerInclude<ExtArgs> | null
    /**
     * The data needed to update a ApplicationAnswer.
     */
    data: XOR<ApplicationAnswerUpdateInput, ApplicationAnswerUncheckedUpdateInput>
    /**
     * Choose, which ApplicationAnswer to update.
     */
    where: ApplicationAnswerWhereUniqueInput
  }

  /**
   * ApplicationAnswer updateMany
   */
  export type ApplicationAnswerUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update ApplicationAnswers.
     */
    data: XOR<ApplicationAnswerUpdateManyMutationInput, ApplicationAnswerUncheckedUpdateManyInput>
    /**
     * Filter which ApplicationAnswers to update
     */
    where?: ApplicationAnswerWhereInput
    /**
     * Limit how many ApplicationAnswers to update.
     */
    limit?: number
  }

  /**
   * ApplicationAnswer updateManyAndReturn
   */
  export type ApplicationAnswerUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ApplicationAnswer
     */
    select?: ApplicationAnswerSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ApplicationAnswer
     */
    omit?: ApplicationAnswerOmit<ExtArgs> | null
    /**
     * The data used to update ApplicationAnswers.
     */
    data: XOR<ApplicationAnswerUpdateManyMutationInput, ApplicationAnswerUncheckedUpdateManyInput>
    /**
     * Filter which ApplicationAnswers to update
     */
    where?: ApplicationAnswerWhereInput
    /**
     * Limit how many ApplicationAnswers to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ApplicationAnswerIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * ApplicationAnswer upsert
   */
  export type ApplicationAnswerUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ApplicationAnswer
     */
    select?: ApplicationAnswerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ApplicationAnswer
     */
    omit?: ApplicationAnswerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ApplicationAnswerInclude<ExtArgs> | null
    /**
     * The filter to search for the ApplicationAnswer to update in case it exists.
     */
    where: ApplicationAnswerWhereUniqueInput
    /**
     * In case the ApplicationAnswer found by the `where` argument doesn't exist, create a new ApplicationAnswer with this data.
     */
    create: XOR<ApplicationAnswerCreateInput, ApplicationAnswerUncheckedCreateInput>
    /**
     * In case the ApplicationAnswer was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ApplicationAnswerUpdateInput, ApplicationAnswerUncheckedUpdateInput>
  }

  /**
   * ApplicationAnswer delete
   */
  export type ApplicationAnswerDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ApplicationAnswer
     */
    select?: ApplicationAnswerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ApplicationAnswer
     */
    omit?: ApplicationAnswerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ApplicationAnswerInclude<ExtArgs> | null
    /**
     * Filter which ApplicationAnswer to delete.
     */
    where: ApplicationAnswerWhereUniqueInput
  }

  /**
   * ApplicationAnswer deleteMany
   */
  export type ApplicationAnswerDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ApplicationAnswers to delete
     */
    where?: ApplicationAnswerWhereInput
    /**
     * Limit how many ApplicationAnswers to delete.
     */
    limit?: number
  }

  /**
   * ApplicationAnswer without action
   */
  export type ApplicationAnswerDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ApplicationAnswer
     */
    select?: ApplicationAnswerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ApplicationAnswer
     */
    omit?: ApplicationAnswerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ApplicationAnswerInclude<ExtArgs> | null
  }


  /**
   * Model Application
   */

  export type AggregateApplication = {
    _count: ApplicationCountAggregateOutputType | null
    _avg: ApplicationAvgAggregateOutputType | null
    _sum: ApplicationSumAggregateOutputType | null
    _min: ApplicationMinAggregateOutputType | null
    _max: ApplicationMaxAggregateOutputType | null
  }

  export type ApplicationAvgAggregateOutputType = {
    id: number | null
    resume_id: number | null
  }

  export type ApplicationSumAggregateOutputType = {
    id: bigint | null
    resume_id: bigint | null
  }

  export type ApplicationMinAggregateOutputType = {
    id: bigint | null
    profile_id: string | null
    resume_id: bigint | null
    status: $Enums.application_status_enum | null
    role: $Enums.role_enum | null
    term: string | null
    comments: string | null
    created_at: Date | null
    updated_at: Date | null
    submitted_at: Date | null
  }

  export type ApplicationMaxAggregateOutputType = {
    id: bigint | null
    profile_id: string | null
    resume_id: bigint | null
    status: $Enums.application_status_enum | null
    role: $Enums.role_enum | null
    term: string | null
    comments: string | null
    created_at: Date | null
    updated_at: Date | null
    submitted_at: Date | null
  }

  export type ApplicationCountAggregateOutputType = {
    id: number
    profile_id: number
    resume_id: number
    status: number
    role: number
    term: number
    comments: number
    created_at: number
    updated_at: number
    submitted_at: number
    _all: number
  }


  export type ApplicationAvgAggregateInputType = {
    id?: true
    resume_id?: true
  }

  export type ApplicationSumAggregateInputType = {
    id?: true
    resume_id?: true
  }

  export type ApplicationMinAggregateInputType = {
    id?: true
    profile_id?: true
    resume_id?: true
    status?: true
    role?: true
    term?: true
    comments?: true
    created_at?: true
    updated_at?: true
    submitted_at?: true
  }

  export type ApplicationMaxAggregateInputType = {
    id?: true
    profile_id?: true
    resume_id?: true
    status?: true
    role?: true
    term?: true
    comments?: true
    created_at?: true
    updated_at?: true
    submitted_at?: true
  }

  export type ApplicationCountAggregateInputType = {
    id?: true
    profile_id?: true
    resume_id?: true
    status?: true
    role?: true
    term?: true
    comments?: true
    created_at?: true
    updated_at?: true
    submitted_at?: true
    _all?: true
  }

  export type ApplicationAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Application to aggregate.
     */
    where?: ApplicationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Applications to fetch.
     */
    orderBy?: ApplicationOrderByWithRelationInput | ApplicationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ApplicationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Applications from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Applications.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Applications
    **/
    _count?: true | ApplicationCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ApplicationAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ApplicationSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ApplicationMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ApplicationMaxAggregateInputType
  }

  export type GetApplicationAggregateType<T extends ApplicationAggregateArgs> = {
        [P in keyof T & keyof AggregateApplication]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateApplication[P]>
      : GetScalarType<T[P], AggregateApplication[P]>
  }




  export type ApplicationGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ApplicationWhereInput
    orderBy?: ApplicationOrderByWithAggregationInput | ApplicationOrderByWithAggregationInput[]
    by: ApplicationScalarFieldEnum[] | ApplicationScalarFieldEnum
    having?: ApplicationScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ApplicationCountAggregateInputType | true
    _avg?: ApplicationAvgAggregateInputType
    _sum?: ApplicationSumAggregateInputType
    _min?: ApplicationMinAggregateInputType
    _max?: ApplicationMaxAggregateInputType
  }

  export type ApplicationGroupByOutputType = {
    id: bigint
    profile_id: string
    resume_id: bigint | null
    status: $Enums.application_status_enum
    role: $Enums.role_enum
    term: string
    comments: string | null
    created_at: Date
    updated_at: Date
    submitted_at: Date | null
    _count: ApplicationCountAggregateOutputType | null
    _avg: ApplicationAvgAggregateOutputType | null
    _sum: ApplicationSumAggregateOutputType | null
    _min: ApplicationMinAggregateOutputType | null
    _max: ApplicationMaxAggregateOutputType | null
  }

  type GetApplicationGroupByPayload<T extends ApplicationGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ApplicationGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ApplicationGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ApplicationGroupByOutputType[P]>
            : GetScalarType<T[P], ApplicationGroupByOutputType[P]>
        }
      >
    >


  export type ApplicationSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    profile_id?: boolean
    resume_id?: boolean
    status?: boolean
    role?: boolean
    term?: boolean
    comments?: boolean
    created_at?: boolean
    updated_at?: boolean
    submitted_at?: boolean
    profile?: boolean | ProfileDefaultArgs<ExtArgs>
    resume?: boolean | Application$resumeArgs<ExtArgs>
    answers?: boolean | Application$answersArgs<ExtArgs>
    _count?: boolean | ApplicationCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["application"]>

  export type ApplicationSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    profile_id?: boolean
    resume_id?: boolean
    status?: boolean
    role?: boolean
    term?: boolean
    comments?: boolean
    created_at?: boolean
    updated_at?: boolean
    submitted_at?: boolean
    profile?: boolean | ProfileDefaultArgs<ExtArgs>
    resume?: boolean | Application$resumeArgs<ExtArgs>
  }, ExtArgs["result"]["application"]>

  export type ApplicationSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    profile_id?: boolean
    resume_id?: boolean
    status?: boolean
    role?: boolean
    term?: boolean
    comments?: boolean
    created_at?: boolean
    updated_at?: boolean
    submitted_at?: boolean
    profile?: boolean | ProfileDefaultArgs<ExtArgs>
    resume?: boolean | Application$resumeArgs<ExtArgs>
  }, ExtArgs["result"]["application"]>

  export type ApplicationSelectScalar = {
    id?: boolean
    profile_id?: boolean
    resume_id?: boolean
    status?: boolean
    role?: boolean
    term?: boolean
    comments?: boolean
    created_at?: boolean
    updated_at?: boolean
    submitted_at?: boolean
  }

  export type ApplicationOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "profile_id" | "resume_id" | "status" | "role" | "term" | "comments" | "created_at" | "updated_at" | "submitted_at", ExtArgs["result"]["application"]>
  export type ApplicationInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    profile?: boolean | ProfileDefaultArgs<ExtArgs>
    resume?: boolean | Application$resumeArgs<ExtArgs>
    answers?: boolean | Application$answersArgs<ExtArgs>
    _count?: boolean | ApplicationCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type ApplicationIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    profile?: boolean | ProfileDefaultArgs<ExtArgs>
    resume?: boolean | Application$resumeArgs<ExtArgs>
  }
  export type ApplicationIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    profile?: boolean | ProfileDefaultArgs<ExtArgs>
    resume?: boolean | Application$resumeArgs<ExtArgs>
  }

  export type $ApplicationPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Application"
    objects: {
      profile: Prisma.$ProfilePayload<ExtArgs>
      resume: Prisma.$ResumePayload<ExtArgs> | null
      answers: Prisma.$ApplicationAnswerPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: bigint
      profile_id: string
      resume_id: bigint | null
      status: $Enums.application_status_enum
      role: $Enums.role_enum
      term: string
      comments: string | null
      created_at: Date
      updated_at: Date
      submitted_at: Date | null
    }, ExtArgs["result"]["application"]>
    composites: {}
  }

  type ApplicationGetPayload<S extends boolean | null | undefined | ApplicationDefaultArgs> = $Result.GetResult<Prisma.$ApplicationPayload, S>

  type ApplicationCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ApplicationFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ApplicationCountAggregateInputType | true
    }

  export interface ApplicationDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Application'], meta: { name: 'Application' } }
    /**
     * Find zero or one Application that matches the filter.
     * @param {ApplicationFindUniqueArgs} args - Arguments to find a Application
     * @example
     * // Get one Application
     * const application = await prisma.application.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ApplicationFindUniqueArgs>(args: SelectSubset<T, ApplicationFindUniqueArgs<ExtArgs>>): Prisma__ApplicationClient<$Result.GetResult<Prisma.$ApplicationPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Application that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ApplicationFindUniqueOrThrowArgs} args - Arguments to find a Application
     * @example
     * // Get one Application
     * const application = await prisma.application.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ApplicationFindUniqueOrThrowArgs>(args: SelectSubset<T, ApplicationFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ApplicationClient<$Result.GetResult<Prisma.$ApplicationPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Application that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ApplicationFindFirstArgs} args - Arguments to find a Application
     * @example
     * // Get one Application
     * const application = await prisma.application.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ApplicationFindFirstArgs>(args?: SelectSubset<T, ApplicationFindFirstArgs<ExtArgs>>): Prisma__ApplicationClient<$Result.GetResult<Prisma.$ApplicationPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Application that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ApplicationFindFirstOrThrowArgs} args - Arguments to find a Application
     * @example
     * // Get one Application
     * const application = await prisma.application.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ApplicationFindFirstOrThrowArgs>(args?: SelectSubset<T, ApplicationFindFirstOrThrowArgs<ExtArgs>>): Prisma__ApplicationClient<$Result.GetResult<Prisma.$ApplicationPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Applications that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ApplicationFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Applications
     * const applications = await prisma.application.findMany()
     * 
     * // Get first 10 Applications
     * const applications = await prisma.application.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const applicationWithIdOnly = await prisma.application.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ApplicationFindManyArgs>(args?: SelectSubset<T, ApplicationFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ApplicationPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Application.
     * @param {ApplicationCreateArgs} args - Arguments to create a Application.
     * @example
     * // Create one Application
     * const Application = await prisma.application.create({
     *   data: {
     *     // ... data to create a Application
     *   }
     * })
     * 
     */
    create<T extends ApplicationCreateArgs>(args: SelectSubset<T, ApplicationCreateArgs<ExtArgs>>): Prisma__ApplicationClient<$Result.GetResult<Prisma.$ApplicationPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Applications.
     * @param {ApplicationCreateManyArgs} args - Arguments to create many Applications.
     * @example
     * // Create many Applications
     * const application = await prisma.application.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ApplicationCreateManyArgs>(args?: SelectSubset<T, ApplicationCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Applications and returns the data saved in the database.
     * @param {ApplicationCreateManyAndReturnArgs} args - Arguments to create many Applications.
     * @example
     * // Create many Applications
     * const application = await prisma.application.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Applications and only return the `id`
     * const applicationWithIdOnly = await prisma.application.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ApplicationCreateManyAndReturnArgs>(args?: SelectSubset<T, ApplicationCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ApplicationPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Application.
     * @param {ApplicationDeleteArgs} args - Arguments to delete one Application.
     * @example
     * // Delete one Application
     * const Application = await prisma.application.delete({
     *   where: {
     *     // ... filter to delete one Application
     *   }
     * })
     * 
     */
    delete<T extends ApplicationDeleteArgs>(args: SelectSubset<T, ApplicationDeleteArgs<ExtArgs>>): Prisma__ApplicationClient<$Result.GetResult<Prisma.$ApplicationPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Application.
     * @param {ApplicationUpdateArgs} args - Arguments to update one Application.
     * @example
     * // Update one Application
     * const application = await prisma.application.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ApplicationUpdateArgs>(args: SelectSubset<T, ApplicationUpdateArgs<ExtArgs>>): Prisma__ApplicationClient<$Result.GetResult<Prisma.$ApplicationPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Applications.
     * @param {ApplicationDeleteManyArgs} args - Arguments to filter Applications to delete.
     * @example
     * // Delete a few Applications
     * const { count } = await prisma.application.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ApplicationDeleteManyArgs>(args?: SelectSubset<T, ApplicationDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Applications.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ApplicationUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Applications
     * const application = await prisma.application.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ApplicationUpdateManyArgs>(args: SelectSubset<T, ApplicationUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Applications and returns the data updated in the database.
     * @param {ApplicationUpdateManyAndReturnArgs} args - Arguments to update many Applications.
     * @example
     * // Update many Applications
     * const application = await prisma.application.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Applications and only return the `id`
     * const applicationWithIdOnly = await prisma.application.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends ApplicationUpdateManyAndReturnArgs>(args: SelectSubset<T, ApplicationUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ApplicationPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Application.
     * @param {ApplicationUpsertArgs} args - Arguments to update or create a Application.
     * @example
     * // Update or create a Application
     * const application = await prisma.application.upsert({
     *   create: {
     *     // ... data to create a Application
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Application we want to update
     *   }
     * })
     */
    upsert<T extends ApplicationUpsertArgs>(args: SelectSubset<T, ApplicationUpsertArgs<ExtArgs>>): Prisma__ApplicationClient<$Result.GetResult<Prisma.$ApplicationPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Applications.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ApplicationCountArgs} args - Arguments to filter Applications to count.
     * @example
     * // Count the number of Applications
     * const count = await prisma.application.count({
     *   where: {
     *     // ... the filter for the Applications we want to count
     *   }
     * })
    **/
    count<T extends ApplicationCountArgs>(
      args?: Subset<T, ApplicationCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ApplicationCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Application.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ApplicationAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ApplicationAggregateArgs>(args: Subset<T, ApplicationAggregateArgs>): Prisma.PrismaPromise<GetApplicationAggregateType<T>>

    /**
     * Group by Application.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ApplicationGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ApplicationGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ApplicationGroupByArgs['orderBy'] }
        : { orderBy?: ApplicationGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ApplicationGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetApplicationGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Application model
   */
  readonly fields: ApplicationFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Application.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ApplicationClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    profile<T extends ProfileDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ProfileDefaultArgs<ExtArgs>>): Prisma__ProfileClient<$Result.GetResult<Prisma.$ProfilePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    resume<T extends Application$resumeArgs<ExtArgs> = {}>(args?: Subset<T, Application$resumeArgs<ExtArgs>>): Prisma__ResumeClient<$Result.GetResult<Prisma.$ResumePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    answers<T extends Application$answersArgs<ExtArgs> = {}>(args?: Subset<T, Application$answersArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ApplicationAnswerPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Application model
   */
  interface ApplicationFieldRefs {
    readonly id: FieldRef<"Application", 'BigInt'>
    readonly profile_id: FieldRef<"Application", 'String'>
    readonly resume_id: FieldRef<"Application", 'BigInt'>
    readonly status: FieldRef<"Application", 'application_status_enum'>
    readonly role: FieldRef<"Application", 'role_enum'>
    readonly term: FieldRef<"Application", 'String'>
    readonly comments: FieldRef<"Application", 'String'>
    readonly created_at: FieldRef<"Application", 'DateTime'>
    readonly updated_at: FieldRef<"Application", 'DateTime'>
    readonly submitted_at: FieldRef<"Application", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Application findUnique
   */
  export type ApplicationFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Application
     */
    select?: ApplicationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Application
     */
    omit?: ApplicationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ApplicationInclude<ExtArgs> | null
    /**
     * Filter, which Application to fetch.
     */
    where: ApplicationWhereUniqueInput
  }

  /**
   * Application findUniqueOrThrow
   */
  export type ApplicationFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Application
     */
    select?: ApplicationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Application
     */
    omit?: ApplicationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ApplicationInclude<ExtArgs> | null
    /**
     * Filter, which Application to fetch.
     */
    where: ApplicationWhereUniqueInput
  }

  /**
   * Application findFirst
   */
  export type ApplicationFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Application
     */
    select?: ApplicationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Application
     */
    omit?: ApplicationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ApplicationInclude<ExtArgs> | null
    /**
     * Filter, which Application to fetch.
     */
    where?: ApplicationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Applications to fetch.
     */
    orderBy?: ApplicationOrderByWithRelationInput | ApplicationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Applications.
     */
    cursor?: ApplicationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Applications from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Applications.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Applications.
     */
    distinct?: ApplicationScalarFieldEnum | ApplicationScalarFieldEnum[]
  }

  /**
   * Application findFirstOrThrow
   */
  export type ApplicationFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Application
     */
    select?: ApplicationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Application
     */
    omit?: ApplicationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ApplicationInclude<ExtArgs> | null
    /**
     * Filter, which Application to fetch.
     */
    where?: ApplicationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Applications to fetch.
     */
    orderBy?: ApplicationOrderByWithRelationInput | ApplicationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Applications.
     */
    cursor?: ApplicationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Applications from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Applications.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Applications.
     */
    distinct?: ApplicationScalarFieldEnum | ApplicationScalarFieldEnum[]
  }

  /**
   * Application findMany
   */
  export type ApplicationFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Application
     */
    select?: ApplicationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Application
     */
    omit?: ApplicationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ApplicationInclude<ExtArgs> | null
    /**
     * Filter, which Applications to fetch.
     */
    where?: ApplicationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Applications to fetch.
     */
    orderBy?: ApplicationOrderByWithRelationInput | ApplicationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Applications.
     */
    cursor?: ApplicationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Applications from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Applications.
     */
    skip?: number
    distinct?: ApplicationScalarFieldEnum | ApplicationScalarFieldEnum[]
  }

  /**
   * Application create
   */
  export type ApplicationCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Application
     */
    select?: ApplicationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Application
     */
    omit?: ApplicationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ApplicationInclude<ExtArgs> | null
    /**
     * The data needed to create a Application.
     */
    data: XOR<ApplicationCreateInput, ApplicationUncheckedCreateInput>
  }

  /**
   * Application createMany
   */
  export type ApplicationCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Applications.
     */
    data: ApplicationCreateManyInput | ApplicationCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Application createManyAndReturn
   */
  export type ApplicationCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Application
     */
    select?: ApplicationSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Application
     */
    omit?: ApplicationOmit<ExtArgs> | null
    /**
     * The data used to create many Applications.
     */
    data: ApplicationCreateManyInput | ApplicationCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ApplicationIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Application update
   */
  export type ApplicationUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Application
     */
    select?: ApplicationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Application
     */
    omit?: ApplicationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ApplicationInclude<ExtArgs> | null
    /**
     * The data needed to update a Application.
     */
    data: XOR<ApplicationUpdateInput, ApplicationUncheckedUpdateInput>
    /**
     * Choose, which Application to update.
     */
    where: ApplicationWhereUniqueInput
  }

  /**
   * Application updateMany
   */
  export type ApplicationUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Applications.
     */
    data: XOR<ApplicationUpdateManyMutationInput, ApplicationUncheckedUpdateManyInput>
    /**
     * Filter which Applications to update
     */
    where?: ApplicationWhereInput
    /**
     * Limit how many Applications to update.
     */
    limit?: number
  }

  /**
   * Application updateManyAndReturn
   */
  export type ApplicationUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Application
     */
    select?: ApplicationSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Application
     */
    omit?: ApplicationOmit<ExtArgs> | null
    /**
     * The data used to update Applications.
     */
    data: XOR<ApplicationUpdateManyMutationInput, ApplicationUncheckedUpdateManyInput>
    /**
     * Filter which Applications to update
     */
    where?: ApplicationWhereInput
    /**
     * Limit how many Applications to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ApplicationIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Application upsert
   */
  export type ApplicationUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Application
     */
    select?: ApplicationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Application
     */
    omit?: ApplicationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ApplicationInclude<ExtArgs> | null
    /**
     * The filter to search for the Application to update in case it exists.
     */
    where: ApplicationWhereUniqueInput
    /**
     * In case the Application found by the `where` argument doesn't exist, create a new Application with this data.
     */
    create: XOR<ApplicationCreateInput, ApplicationUncheckedCreateInput>
    /**
     * In case the Application was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ApplicationUpdateInput, ApplicationUncheckedUpdateInput>
  }

  /**
   * Application delete
   */
  export type ApplicationDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Application
     */
    select?: ApplicationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Application
     */
    omit?: ApplicationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ApplicationInclude<ExtArgs> | null
    /**
     * Filter which Application to delete.
     */
    where: ApplicationWhereUniqueInput
  }

  /**
   * Application deleteMany
   */
  export type ApplicationDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Applications to delete
     */
    where?: ApplicationWhereInput
    /**
     * Limit how many Applications to delete.
     */
    limit?: number
  }

  /**
   * Application.resume
   */
  export type Application$resumeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Resume
     */
    select?: ResumeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Resume
     */
    omit?: ResumeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ResumeInclude<ExtArgs> | null
    where?: ResumeWhereInput
  }

  /**
   * Application.answers
   */
  export type Application$answersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ApplicationAnswer
     */
    select?: ApplicationAnswerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ApplicationAnswer
     */
    omit?: ApplicationAnswerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ApplicationAnswerInclude<ExtArgs> | null
    where?: ApplicationAnswerWhereInput
    orderBy?: ApplicationAnswerOrderByWithRelationInput | ApplicationAnswerOrderByWithRelationInput[]
    cursor?: ApplicationAnswerWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ApplicationAnswerScalarFieldEnum | ApplicationAnswerScalarFieldEnum[]
  }

  /**
   * Application without action
   */
  export type ApplicationDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Application
     */
    select?: ApplicationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Application
     */
    omit?: ApplicationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ApplicationInclude<ExtArgs> | null
  }


  /**
   * Model EventAttendance
   */

  export type AggregateEventAttendance = {
    _count: EventAttendanceCountAggregateOutputType | null
    _avg: EventAttendanceAvgAggregateOutputType | null
    _sum: EventAttendanceSumAggregateOutputType | null
    _min: EventAttendanceMinAggregateOutputType | null
    _max: EventAttendanceMaxAggregateOutputType | null
  }

  export type EventAttendanceAvgAggregateOutputType = {
    id: number | null
    event_id: number | null
  }

  export type EventAttendanceSumAggregateOutputType = {
    id: bigint | null
    event_id: bigint | null
  }

  export type EventAttendanceMinAggregateOutputType = {
    id: bigint | null
    event_id: bigint | null
    profile_id: string | null
    checked_in: boolean | null
    created_at: Date | null
  }

  export type EventAttendanceMaxAggregateOutputType = {
    id: bigint | null
    event_id: bigint | null
    profile_id: string | null
    checked_in: boolean | null
    created_at: Date | null
  }

  export type EventAttendanceCountAggregateOutputType = {
    id: number
    event_id: number
    profile_id: number
    checked_in: number
    created_at: number
    _all: number
  }


  export type EventAttendanceAvgAggregateInputType = {
    id?: true
    event_id?: true
  }

  export type EventAttendanceSumAggregateInputType = {
    id?: true
    event_id?: true
  }

  export type EventAttendanceMinAggregateInputType = {
    id?: true
    event_id?: true
    profile_id?: true
    checked_in?: true
    created_at?: true
  }

  export type EventAttendanceMaxAggregateInputType = {
    id?: true
    event_id?: true
    profile_id?: true
    checked_in?: true
    created_at?: true
  }

  export type EventAttendanceCountAggregateInputType = {
    id?: true
    event_id?: true
    profile_id?: true
    checked_in?: true
    created_at?: true
    _all?: true
  }

  export type EventAttendanceAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which EventAttendance to aggregate.
     */
    where?: EventAttendanceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of EventAttendances to fetch.
     */
    orderBy?: EventAttendanceOrderByWithRelationInput | EventAttendanceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: EventAttendanceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` EventAttendances from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` EventAttendances.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned EventAttendances
    **/
    _count?: true | EventAttendanceCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: EventAttendanceAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: EventAttendanceSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: EventAttendanceMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: EventAttendanceMaxAggregateInputType
  }

  export type GetEventAttendanceAggregateType<T extends EventAttendanceAggregateArgs> = {
        [P in keyof T & keyof AggregateEventAttendance]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateEventAttendance[P]>
      : GetScalarType<T[P], AggregateEventAttendance[P]>
  }




  export type EventAttendanceGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: EventAttendanceWhereInput
    orderBy?: EventAttendanceOrderByWithAggregationInput | EventAttendanceOrderByWithAggregationInput[]
    by: EventAttendanceScalarFieldEnum[] | EventAttendanceScalarFieldEnum
    having?: EventAttendanceScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: EventAttendanceCountAggregateInputType | true
    _avg?: EventAttendanceAvgAggregateInputType
    _sum?: EventAttendanceSumAggregateInputType
    _min?: EventAttendanceMinAggregateInputType
    _max?: EventAttendanceMaxAggregateInputType
  }

  export type EventAttendanceGroupByOutputType = {
    id: bigint
    event_id: bigint
    profile_id: string
    checked_in: boolean
    created_at: Date
    _count: EventAttendanceCountAggregateOutputType | null
    _avg: EventAttendanceAvgAggregateOutputType | null
    _sum: EventAttendanceSumAggregateOutputType | null
    _min: EventAttendanceMinAggregateOutputType | null
    _max: EventAttendanceMaxAggregateOutputType | null
  }

  type GetEventAttendanceGroupByPayload<T extends EventAttendanceGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<EventAttendanceGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof EventAttendanceGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], EventAttendanceGroupByOutputType[P]>
            : GetScalarType<T[P], EventAttendanceGroupByOutputType[P]>
        }
      >
    >


  export type EventAttendanceSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    event_id?: boolean
    profile_id?: boolean
    checked_in?: boolean
    created_at?: boolean
    event?: boolean | EventDefaultArgs<ExtArgs>
    profile?: boolean | ProfileDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["eventAttendance"]>

  export type EventAttendanceSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    event_id?: boolean
    profile_id?: boolean
    checked_in?: boolean
    created_at?: boolean
    event?: boolean | EventDefaultArgs<ExtArgs>
    profile?: boolean | ProfileDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["eventAttendance"]>

  export type EventAttendanceSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    event_id?: boolean
    profile_id?: boolean
    checked_in?: boolean
    created_at?: boolean
    event?: boolean | EventDefaultArgs<ExtArgs>
    profile?: boolean | ProfileDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["eventAttendance"]>

  export type EventAttendanceSelectScalar = {
    id?: boolean
    event_id?: boolean
    profile_id?: boolean
    checked_in?: boolean
    created_at?: boolean
  }

  export type EventAttendanceOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "event_id" | "profile_id" | "checked_in" | "created_at", ExtArgs["result"]["eventAttendance"]>
  export type EventAttendanceInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    event?: boolean | EventDefaultArgs<ExtArgs>
    profile?: boolean | ProfileDefaultArgs<ExtArgs>
  }
  export type EventAttendanceIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    event?: boolean | EventDefaultArgs<ExtArgs>
    profile?: boolean | ProfileDefaultArgs<ExtArgs>
  }
  export type EventAttendanceIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    event?: boolean | EventDefaultArgs<ExtArgs>
    profile?: boolean | ProfileDefaultArgs<ExtArgs>
  }

  export type $EventAttendancePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "EventAttendance"
    objects: {
      event: Prisma.$EventPayload<ExtArgs>
      profile: Prisma.$ProfilePayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: bigint
      event_id: bigint
      profile_id: string
      checked_in: boolean
      created_at: Date
    }, ExtArgs["result"]["eventAttendance"]>
    composites: {}
  }

  type EventAttendanceGetPayload<S extends boolean | null | undefined | EventAttendanceDefaultArgs> = $Result.GetResult<Prisma.$EventAttendancePayload, S>

  type EventAttendanceCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<EventAttendanceFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: EventAttendanceCountAggregateInputType | true
    }

  export interface EventAttendanceDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['EventAttendance'], meta: { name: 'EventAttendance' } }
    /**
     * Find zero or one EventAttendance that matches the filter.
     * @param {EventAttendanceFindUniqueArgs} args - Arguments to find a EventAttendance
     * @example
     * // Get one EventAttendance
     * const eventAttendance = await prisma.eventAttendance.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends EventAttendanceFindUniqueArgs>(args: SelectSubset<T, EventAttendanceFindUniqueArgs<ExtArgs>>): Prisma__EventAttendanceClient<$Result.GetResult<Prisma.$EventAttendancePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one EventAttendance that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {EventAttendanceFindUniqueOrThrowArgs} args - Arguments to find a EventAttendance
     * @example
     * // Get one EventAttendance
     * const eventAttendance = await prisma.eventAttendance.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends EventAttendanceFindUniqueOrThrowArgs>(args: SelectSubset<T, EventAttendanceFindUniqueOrThrowArgs<ExtArgs>>): Prisma__EventAttendanceClient<$Result.GetResult<Prisma.$EventAttendancePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first EventAttendance that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EventAttendanceFindFirstArgs} args - Arguments to find a EventAttendance
     * @example
     * // Get one EventAttendance
     * const eventAttendance = await prisma.eventAttendance.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends EventAttendanceFindFirstArgs>(args?: SelectSubset<T, EventAttendanceFindFirstArgs<ExtArgs>>): Prisma__EventAttendanceClient<$Result.GetResult<Prisma.$EventAttendancePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first EventAttendance that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EventAttendanceFindFirstOrThrowArgs} args - Arguments to find a EventAttendance
     * @example
     * // Get one EventAttendance
     * const eventAttendance = await prisma.eventAttendance.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends EventAttendanceFindFirstOrThrowArgs>(args?: SelectSubset<T, EventAttendanceFindFirstOrThrowArgs<ExtArgs>>): Prisma__EventAttendanceClient<$Result.GetResult<Prisma.$EventAttendancePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more EventAttendances that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EventAttendanceFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all EventAttendances
     * const eventAttendances = await prisma.eventAttendance.findMany()
     * 
     * // Get first 10 EventAttendances
     * const eventAttendances = await prisma.eventAttendance.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const eventAttendanceWithIdOnly = await prisma.eventAttendance.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends EventAttendanceFindManyArgs>(args?: SelectSubset<T, EventAttendanceFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$EventAttendancePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a EventAttendance.
     * @param {EventAttendanceCreateArgs} args - Arguments to create a EventAttendance.
     * @example
     * // Create one EventAttendance
     * const EventAttendance = await prisma.eventAttendance.create({
     *   data: {
     *     // ... data to create a EventAttendance
     *   }
     * })
     * 
     */
    create<T extends EventAttendanceCreateArgs>(args: SelectSubset<T, EventAttendanceCreateArgs<ExtArgs>>): Prisma__EventAttendanceClient<$Result.GetResult<Prisma.$EventAttendancePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many EventAttendances.
     * @param {EventAttendanceCreateManyArgs} args - Arguments to create many EventAttendances.
     * @example
     * // Create many EventAttendances
     * const eventAttendance = await prisma.eventAttendance.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends EventAttendanceCreateManyArgs>(args?: SelectSubset<T, EventAttendanceCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many EventAttendances and returns the data saved in the database.
     * @param {EventAttendanceCreateManyAndReturnArgs} args - Arguments to create many EventAttendances.
     * @example
     * // Create many EventAttendances
     * const eventAttendance = await prisma.eventAttendance.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many EventAttendances and only return the `id`
     * const eventAttendanceWithIdOnly = await prisma.eventAttendance.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends EventAttendanceCreateManyAndReturnArgs>(args?: SelectSubset<T, EventAttendanceCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$EventAttendancePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a EventAttendance.
     * @param {EventAttendanceDeleteArgs} args - Arguments to delete one EventAttendance.
     * @example
     * // Delete one EventAttendance
     * const EventAttendance = await prisma.eventAttendance.delete({
     *   where: {
     *     // ... filter to delete one EventAttendance
     *   }
     * })
     * 
     */
    delete<T extends EventAttendanceDeleteArgs>(args: SelectSubset<T, EventAttendanceDeleteArgs<ExtArgs>>): Prisma__EventAttendanceClient<$Result.GetResult<Prisma.$EventAttendancePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one EventAttendance.
     * @param {EventAttendanceUpdateArgs} args - Arguments to update one EventAttendance.
     * @example
     * // Update one EventAttendance
     * const eventAttendance = await prisma.eventAttendance.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends EventAttendanceUpdateArgs>(args: SelectSubset<T, EventAttendanceUpdateArgs<ExtArgs>>): Prisma__EventAttendanceClient<$Result.GetResult<Prisma.$EventAttendancePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more EventAttendances.
     * @param {EventAttendanceDeleteManyArgs} args - Arguments to filter EventAttendances to delete.
     * @example
     * // Delete a few EventAttendances
     * const { count } = await prisma.eventAttendance.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends EventAttendanceDeleteManyArgs>(args?: SelectSubset<T, EventAttendanceDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more EventAttendances.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EventAttendanceUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many EventAttendances
     * const eventAttendance = await prisma.eventAttendance.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends EventAttendanceUpdateManyArgs>(args: SelectSubset<T, EventAttendanceUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more EventAttendances and returns the data updated in the database.
     * @param {EventAttendanceUpdateManyAndReturnArgs} args - Arguments to update many EventAttendances.
     * @example
     * // Update many EventAttendances
     * const eventAttendance = await prisma.eventAttendance.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more EventAttendances and only return the `id`
     * const eventAttendanceWithIdOnly = await prisma.eventAttendance.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends EventAttendanceUpdateManyAndReturnArgs>(args: SelectSubset<T, EventAttendanceUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$EventAttendancePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one EventAttendance.
     * @param {EventAttendanceUpsertArgs} args - Arguments to update or create a EventAttendance.
     * @example
     * // Update or create a EventAttendance
     * const eventAttendance = await prisma.eventAttendance.upsert({
     *   create: {
     *     // ... data to create a EventAttendance
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the EventAttendance we want to update
     *   }
     * })
     */
    upsert<T extends EventAttendanceUpsertArgs>(args: SelectSubset<T, EventAttendanceUpsertArgs<ExtArgs>>): Prisma__EventAttendanceClient<$Result.GetResult<Prisma.$EventAttendancePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of EventAttendances.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EventAttendanceCountArgs} args - Arguments to filter EventAttendances to count.
     * @example
     * // Count the number of EventAttendances
     * const count = await prisma.eventAttendance.count({
     *   where: {
     *     // ... the filter for the EventAttendances we want to count
     *   }
     * })
    **/
    count<T extends EventAttendanceCountArgs>(
      args?: Subset<T, EventAttendanceCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], EventAttendanceCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a EventAttendance.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EventAttendanceAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends EventAttendanceAggregateArgs>(args: Subset<T, EventAttendanceAggregateArgs>): Prisma.PrismaPromise<GetEventAttendanceAggregateType<T>>

    /**
     * Group by EventAttendance.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EventAttendanceGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends EventAttendanceGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: EventAttendanceGroupByArgs['orderBy'] }
        : { orderBy?: EventAttendanceGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, EventAttendanceGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetEventAttendanceGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the EventAttendance model
   */
  readonly fields: EventAttendanceFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for EventAttendance.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__EventAttendanceClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    event<T extends EventDefaultArgs<ExtArgs> = {}>(args?: Subset<T, EventDefaultArgs<ExtArgs>>): Prisma__EventClient<$Result.GetResult<Prisma.$EventPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    profile<T extends ProfileDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ProfileDefaultArgs<ExtArgs>>): Prisma__ProfileClient<$Result.GetResult<Prisma.$ProfilePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the EventAttendance model
   */
  interface EventAttendanceFieldRefs {
    readonly id: FieldRef<"EventAttendance", 'BigInt'>
    readonly event_id: FieldRef<"EventAttendance", 'BigInt'>
    readonly profile_id: FieldRef<"EventAttendance", 'String'>
    readonly checked_in: FieldRef<"EventAttendance", 'Boolean'>
    readonly created_at: FieldRef<"EventAttendance", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * EventAttendance findUnique
   */
  export type EventAttendanceFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EventAttendance
     */
    select?: EventAttendanceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the EventAttendance
     */
    omit?: EventAttendanceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EventAttendanceInclude<ExtArgs> | null
    /**
     * Filter, which EventAttendance to fetch.
     */
    where: EventAttendanceWhereUniqueInput
  }

  /**
   * EventAttendance findUniqueOrThrow
   */
  export type EventAttendanceFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EventAttendance
     */
    select?: EventAttendanceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the EventAttendance
     */
    omit?: EventAttendanceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EventAttendanceInclude<ExtArgs> | null
    /**
     * Filter, which EventAttendance to fetch.
     */
    where: EventAttendanceWhereUniqueInput
  }

  /**
   * EventAttendance findFirst
   */
  export type EventAttendanceFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EventAttendance
     */
    select?: EventAttendanceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the EventAttendance
     */
    omit?: EventAttendanceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EventAttendanceInclude<ExtArgs> | null
    /**
     * Filter, which EventAttendance to fetch.
     */
    where?: EventAttendanceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of EventAttendances to fetch.
     */
    orderBy?: EventAttendanceOrderByWithRelationInput | EventAttendanceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for EventAttendances.
     */
    cursor?: EventAttendanceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` EventAttendances from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` EventAttendances.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of EventAttendances.
     */
    distinct?: EventAttendanceScalarFieldEnum | EventAttendanceScalarFieldEnum[]
  }

  /**
   * EventAttendance findFirstOrThrow
   */
  export type EventAttendanceFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EventAttendance
     */
    select?: EventAttendanceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the EventAttendance
     */
    omit?: EventAttendanceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EventAttendanceInclude<ExtArgs> | null
    /**
     * Filter, which EventAttendance to fetch.
     */
    where?: EventAttendanceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of EventAttendances to fetch.
     */
    orderBy?: EventAttendanceOrderByWithRelationInput | EventAttendanceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for EventAttendances.
     */
    cursor?: EventAttendanceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` EventAttendances from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` EventAttendances.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of EventAttendances.
     */
    distinct?: EventAttendanceScalarFieldEnum | EventAttendanceScalarFieldEnum[]
  }

  /**
   * EventAttendance findMany
   */
  export type EventAttendanceFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EventAttendance
     */
    select?: EventAttendanceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the EventAttendance
     */
    omit?: EventAttendanceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EventAttendanceInclude<ExtArgs> | null
    /**
     * Filter, which EventAttendances to fetch.
     */
    where?: EventAttendanceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of EventAttendances to fetch.
     */
    orderBy?: EventAttendanceOrderByWithRelationInput | EventAttendanceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing EventAttendances.
     */
    cursor?: EventAttendanceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` EventAttendances from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` EventAttendances.
     */
    skip?: number
    distinct?: EventAttendanceScalarFieldEnum | EventAttendanceScalarFieldEnum[]
  }

  /**
   * EventAttendance create
   */
  export type EventAttendanceCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EventAttendance
     */
    select?: EventAttendanceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the EventAttendance
     */
    omit?: EventAttendanceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EventAttendanceInclude<ExtArgs> | null
    /**
     * The data needed to create a EventAttendance.
     */
    data: XOR<EventAttendanceCreateInput, EventAttendanceUncheckedCreateInput>
  }

  /**
   * EventAttendance createMany
   */
  export type EventAttendanceCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many EventAttendances.
     */
    data: EventAttendanceCreateManyInput | EventAttendanceCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * EventAttendance createManyAndReturn
   */
  export type EventAttendanceCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EventAttendance
     */
    select?: EventAttendanceSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the EventAttendance
     */
    omit?: EventAttendanceOmit<ExtArgs> | null
    /**
     * The data used to create many EventAttendances.
     */
    data: EventAttendanceCreateManyInput | EventAttendanceCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EventAttendanceIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * EventAttendance update
   */
  export type EventAttendanceUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EventAttendance
     */
    select?: EventAttendanceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the EventAttendance
     */
    omit?: EventAttendanceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EventAttendanceInclude<ExtArgs> | null
    /**
     * The data needed to update a EventAttendance.
     */
    data: XOR<EventAttendanceUpdateInput, EventAttendanceUncheckedUpdateInput>
    /**
     * Choose, which EventAttendance to update.
     */
    where: EventAttendanceWhereUniqueInput
  }

  /**
   * EventAttendance updateMany
   */
  export type EventAttendanceUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update EventAttendances.
     */
    data: XOR<EventAttendanceUpdateManyMutationInput, EventAttendanceUncheckedUpdateManyInput>
    /**
     * Filter which EventAttendances to update
     */
    where?: EventAttendanceWhereInput
    /**
     * Limit how many EventAttendances to update.
     */
    limit?: number
  }

  /**
   * EventAttendance updateManyAndReturn
   */
  export type EventAttendanceUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EventAttendance
     */
    select?: EventAttendanceSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the EventAttendance
     */
    omit?: EventAttendanceOmit<ExtArgs> | null
    /**
     * The data used to update EventAttendances.
     */
    data: XOR<EventAttendanceUpdateManyMutationInput, EventAttendanceUncheckedUpdateManyInput>
    /**
     * Filter which EventAttendances to update
     */
    where?: EventAttendanceWhereInput
    /**
     * Limit how many EventAttendances to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EventAttendanceIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * EventAttendance upsert
   */
  export type EventAttendanceUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EventAttendance
     */
    select?: EventAttendanceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the EventAttendance
     */
    omit?: EventAttendanceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EventAttendanceInclude<ExtArgs> | null
    /**
     * The filter to search for the EventAttendance to update in case it exists.
     */
    where: EventAttendanceWhereUniqueInput
    /**
     * In case the EventAttendance found by the `where` argument doesn't exist, create a new EventAttendance with this data.
     */
    create: XOR<EventAttendanceCreateInput, EventAttendanceUncheckedCreateInput>
    /**
     * In case the EventAttendance was found with the provided `where` argument, update it with this data.
     */
    update: XOR<EventAttendanceUpdateInput, EventAttendanceUncheckedUpdateInput>
  }

  /**
   * EventAttendance delete
   */
  export type EventAttendanceDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EventAttendance
     */
    select?: EventAttendanceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the EventAttendance
     */
    omit?: EventAttendanceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EventAttendanceInclude<ExtArgs> | null
    /**
     * Filter which EventAttendance to delete.
     */
    where: EventAttendanceWhereUniqueInput
  }

  /**
   * EventAttendance deleteMany
   */
  export type EventAttendanceDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which EventAttendances to delete
     */
    where?: EventAttendanceWhereInput
    /**
     * Limit how many EventAttendances to delete.
     */
    limit?: number
  }

  /**
   * EventAttendance without action
   */
  export type EventAttendanceDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EventAttendance
     */
    select?: EventAttendanceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the EventAttendance
     */
    omit?: EventAttendanceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EventAttendanceInclude<ExtArgs> | null
  }


  /**
   * Model Event
   */

  export type AggregateEvent = {
    _count: EventCountAggregateOutputType | null
    _avg: EventAvgAggregateOutputType | null
    _sum: EventSumAggregateOutputType | null
    _min: EventMinAggregateOutputType | null
    _max: EventMaxAggregateOutputType | null
  }

  export type EventAvgAggregateOutputType = {
    id: number | null
    image_id: number | null
  }

  export type EventSumAggregateOutputType = {
    id: bigint | null
    image_id: bigint | null
  }

  export type EventMinAggregateOutputType = {
    id: bigint | null
    name: string | null
    registration_required: boolean | null
    description: string | null
    location: string | null
    start_time: Date | null
    buffered_start_time: Date | null
    end_time: Date | null
    buffered_end_time: Date | null
    payment_required: boolean | null
    image_id: bigint | null
    created_at: Date | null
    updated_at: Date | null
  }

  export type EventMaxAggregateOutputType = {
    id: bigint | null
    name: string | null
    registration_required: boolean | null
    description: string | null
    location: string | null
    start_time: Date | null
    buffered_start_time: Date | null
    end_time: Date | null
    buffered_end_time: Date | null
    payment_required: boolean | null
    image_id: bigint | null
    created_at: Date | null
    updated_at: Date | null
  }

  export type EventCountAggregateOutputType = {
    id: number
    name: number
    registration_required: number
    description: number
    location: number
    start_time: number
    buffered_start_time: number
    end_time: number
    buffered_end_time: number
    payment_required: number
    image_id: number
    created_at: number
    updated_at: number
    _all: number
  }


  export type EventAvgAggregateInputType = {
    id?: true
    image_id?: true
  }

  export type EventSumAggregateInputType = {
    id?: true
    image_id?: true
  }

  export type EventMinAggregateInputType = {
    id?: true
    name?: true
    registration_required?: true
    description?: true
    location?: true
    start_time?: true
    buffered_start_time?: true
    end_time?: true
    buffered_end_time?: true
    payment_required?: true
    image_id?: true
    created_at?: true
    updated_at?: true
  }

  export type EventMaxAggregateInputType = {
    id?: true
    name?: true
    registration_required?: true
    description?: true
    location?: true
    start_time?: true
    buffered_start_time?: true
    end_time?: true
    buffered_end_time?: true
    payment_required?: true
    image_id?: true
    created_at?: true
    updated_at?: true
  }

  export type EventCountAggregateInputType = {
    id?: true
    name?: true
    registration_required?: true
    description?: true
    location?: true
    start_time?: true
    buffered_start_time?: true
    end_time?: true
    buffered_end_time?: true
    payment_required?: true
    image_id?: true
    created_at?: true
    updated_at?: true
    _all?: true
  }

  export type EventAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Event to aggregate.
     */
    where?: EventWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Events to fetch.
     */
    orderBy?: EventOrderByWithRelationInput | EventOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: EventWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Events from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Events.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Events
    **/
    _count?: true | EventCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: EventAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: EventSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: EventMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: EventMaxAggregateInputType
  }

  export type GetEventAggregateType<T extends EventAggregateArgs> = {
        [P in keyof T & keyof AggregateEvent]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateEvent[P]>
      : GetScalarType<T[P], AggregateEvent[P]>
  }




  export type EventGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: EventWhereInput
    orderBy?: EventOrderByWithAggregationInput | EventOrderByWithAggregationInput[]
    by: EventScalarFieldEnum[] | EventScalarFieldEnum
    having?: EventScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: EventCountAggregateInputType | true
    _avg?: EventAvgAggregateInputType
    _sum?: EventSumAggregateInputType
    _min?: EventMinAggregateInputType
    _max?: EventMaxAggregateInputType
  }

  export type EventGroupByOutputType = {
    id: bigint
    name: string
    registration_required: boolean
    description: string | null
    location: string | null
    start_time: Date
    buffered_start_time: Date
    end_time: Date
    buffered_end_time: Date
    payment_required: boolean
    image_id: bigint | null
    created_at: Date
    updated_at: Date
    _count: EventCountAggregateOutputType | null
    _avg: EventAvgAggregateOutputType | null
    _sum: EventSumAggregateOutputType | null
    _min: EventMinAggregateOutputType | null
    _max: EventMaxAggregateOutputType | null
  }

  type GetEventGroupByPayload<T extends EventGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<EventGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof EventGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], EventGroupByOutputType[P]>
            : GetScalarType<T[P], EventGroupByOutputType[P]>
        }
      >
    >


  export type EventSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    registration_required?: boolean
    description?: boolean
    location?: boolean
    start_time?: boolean
    buffered_start_time?: boolean
    end_time?: boolean
    buffered_end_time?: boolean
    payment_required?: boolean
    image_id?: boolean
    created_at?: boolean
    updated_at?: boolean
    attendance?: boolean | Event$attendanceArgs<ExtArgs>
    _count?: boolean | EventCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["event"]>

  export type EventSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    registration_required?: boolean
    description?: boolean
    location?: boolean
    start_time?: boolean
    buffered_start_time?: boolean
    end_time?: boolean
    buffered_end_time?: boolean
    payment_required?: boolean
    image_id?: boolean
    created_at?: boolean
    updated_at?: boolean
  }, ExtArgs["result"]["event"]>

  export type EventSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    registration_required?: boolean
    description?: boolean
    location?: boolean
    start_time?: boolean
    buffered_start_time?: boolean
    end_time?: boolean
    buffered_end_time?: boolean
    payment_required?: boolean
    image_id?: boolean
    created_at?: boolean
    updated_at?: boolean
  }, ExtArgs["result"]["event"]>

  export type EventSelectScalar = {
    id?: boolean
    name?: boolean
    registration_required?: boolean
    description?: boolean
    location?: boolean
    start_time?: boolean
    buffered_start_time?: boolean
    end_time?: boolean
    buffered_end_time?: boolean
    payment_required?: boolean
    image_id?: boolean
    created_at?: boolean
    updated_at?: boolean
  }

  export type EventOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "registration_required" | "description" | "location" | "start_time" | "buffered_start_time" | "end_time" | "buffered_end_time" | "payment_required" | "image_id" | "created_at" | "updated_at", ExtArgs["result"]["event"]>
  export type EventInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    attendance?: boolean | Event$attendanceArgs<ExtArgs>
    _count?: boolean | EventCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type EventIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type EventIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $EventPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Event"
    objects: {
      attendance: Prisma.$EventAttendancePayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: bigint
      name: string
      registration_required: boolean
      description: string | null
      location: string | null
      start_time: Date
      buffered_start_time: Date
      end_time: Date
      buffered_end_time: Date
      payment_required: boolean
      image_id: bigint | null
      created_at: Date
      updated_at: Date
    }, ExtArgs["result"]["event"]>
    composites: {}
  }

  type EventGetPayload<S extends boolean | null | undefined | EventDefaultArgs> = $Result.GetResult<Prisma.$EventPayload, S>

  type EventCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<EventFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: EventCountAggregateInputType | true
    }

  export interface EventDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Event'], meta: { name: 'Event' } }
    /**
     * Find zero or one Event that matches the filter.
     * @param {EventFindUniqueArgs} args - Arguments to find a Event
     * @example
     * // Get one Event
     * const event = await prisma.event.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends EventFindUniqueArgs>(args: SelectSubset<T, EventFindUniqueArgs<ExtArgs>>): Prisma__EventClient<$Result.GetResult<Prisma.$EventPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Event that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {EventFindUniqueOrThrowArgs} args - Arguments to find a Event
     * @example
     * // Get one Event
     * const event = await prisma.event.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends EventFindUniqueOrThrowArgs>(args: SelectSubset<T, EventFindUniqueOrThrowArgs<ExtArgs>>): Prisma__EventClient<$Result.GetResult<Prisma.$EventPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Event that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EventFindFirstArgs} args - Arguments to find a Event
     * @example
     * // Get one Event
     * const event = await prisma.event.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends EventFindFirstArgs>(args?: SelectSubset<T, EventFindFirstArgs<ExtArgs>>): Prisma__EventClient<$Result.GetResult<Prisma.$EventPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Event that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EventFindFirstOrThrowArgs} args - Arguments to find a Event
     * @example
     * // Get one Event
     * const event = await prisma.event.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends EventFindFirstOrThrowArgs>(args?: SelectSubset<T, EventFindFirstOrThrowArgs<ExtArgs>>): Prisma__EventClient<$Result.GetResult<Prisma.$EventPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Events that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EventFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Events
     * const events = await prisma.event.findMany()
     * 
     * // Get first 10 Events
     * const events = await prisma.event.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const eventWithIdOnly = await prisma.event.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends EventFindManyArgs>(args?: SelectSubset<T, EventFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$EventPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Event.
     * @param {EventCreateArgs} args - Arguments to create a Event.
     * @example
     * // Create one Event
     * const Event = await prisma.event.create({
     *   data: {
     *     // ... data to create a Event
     *   }
     * })
     * 
     */
    create<T extends EventCreateArgs>(args: SelectSubset<T, EventCreateArgs<ExtArgs>>): Prisma__EventClient<$Result.GetResult<Prisma.$EventPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Events.
     * @param {EventCreateManyArgs} args - Arguments to create many Events.
     * @example
     * // Create many Events
     * const event = await prisma.event.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends EventCreateManyArgs>(args?: SelectSubset<T, EventCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Events and returns the data saved in the database.
     * @param {EventCreateManyAndReturnArgs} args - Arguments to create many Events.
     * @example
     * // Create many Events
     * const event = await prisma.event.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Events and only return the `id`
     * const eventWithIdOnly = await prisma.event.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends EventCreateManyAndReturnArgs>(args?: SelectSubset<T, EventCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$EventPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Event.
     * @param {EventDeleteArgs} args - Arguments to delete one Event.
     * @example
     * // Delete one Event
     * const Event = await prisma.event.delete({
     *   where: {
     *     // ... filter to delete one Event
     *   }
     * })
     * 
     */
    delete<T extends EventDeleteArgs>(args: SelectSubset<T, EventDeleteArgs<ExtArgs>>): Prisma__EventClient<$Result.GetResult<Prisma.$EventPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Event.
     * @param {EventUpdateArgs} args - Arguments to update one Event.
     * @example
     * // Update one Event
     * const event = await prisma.event.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends EventUpdateArgs>(args: SelectSubset<T, EventUpdateArgs<ExtArgs>>): Prisma__EventClient<$Result.GetResult<Prisma.$EventPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Events.
     * @param {EventDeleteManyArgs} args - Arguments to filter Events to delete.
     * @example
     * // Delete a few Events
     * const { count } = await prisma.event.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends EventDeleteManyArgs>(args?: SelectSubset<T, EventDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Events.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EventUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Events
     * const event = await prisma.event.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends EventUpdateManyArgs>(args: SelectSubset<T, EventUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Events and returns the data updated in the database.
     * @param {EventUpdateManyAndReturnArgs} args - Arguments to update many Events.
     * @example
     * // Update many Events
     * const event = await prisma.event.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Events and only return the `id`
     * const eventWithIdOnly = await prisma.event.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends EventUpdateManyAndReturnArgs>(args: SelectSubset<T, EventUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$EventPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Event.
     * @param {EventUpsertArgs} args - Arguments to update or create a Event.
     * @example
     * // Update or create a Event
     * const event = await prisma.event.upsert({
     *   create: {
     *     // ... data to create a Event
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Event we want to update
     *   }
     * })
     */
    upsert<T extends EventUpsertArgs>(args: SelectSubset<T, EventUpsertArgs<ExtArgs>>): Prisma__EventClient<$Result.GetResult<Prisma.$EventPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Events.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EventCountArgs} args - Arguments to filter Events to count.
     * @example
     * // Count the number of Events
     * const count = await prisma.event.count({
     *   where: {
     *     // ... the filter for the Events we want to count
     *   }
     * })
    **/
    count<T extends EventCountArgs>(
      args?: Subset<T, EventCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], EventCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Event.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EventAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends EventAggregateArgs>(args: Subset<T, EventAggregateArgs>): Prisma.PrismaPromise<GetEventAggregateType<T>>

    /**
     * Group by Event.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EventGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends EventGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: EventGroupByArgs['orderBy'] }
        : { orderBy?: EventGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, EventGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetEventGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Event model
   */
  readonly fields: EventFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Event.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__EventClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    attendance<T extends Event$attendanceArgs<ExtArgs> = {}>(args?: Subset<T, Event$attendanceArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$EventAttendancePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Event model
   */
  interface EventFieldRefs {
    readonly id: FieldRef<"Event", 'BigInt'>
    readonly name: FieldRef<"Event", 'String'>
    readonly registration_required: FieldRef<"Event", 'Boolean'>
    readonly description: FieldRef<"Event", 'String'>
    readonly location: FieldRef<"Event", 'String'>
    readonly start_time: FieldRef<"Event", 'DateTime'>
    readonly buffered_start_time: FieldRef<"Event", 'DateTime'>
    readonly end_time: FieldRef<"Event", 'DateTime'>
    readonly buffered_end_time: FieldRef<"Event", 'DateTime'>
    readonly payment_required: FieldRef<"Event", 'Boolean'>
    readonly image_id: FieldRef<"Event", 'BigInt'>
    readonly created_at: FieldRef<"Event", 'DateTime'>
    readonly updated_at: FieldRef<"Event", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Event findUnique
   */
  export type EventFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Event
     */
    select?: EventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Event
     */
    omit?: EventOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EventInclude<ExtArgs> | null
    /**
     * Filter, which Event to fetch.
     */
    where: EventWhereUniqueInput
  }

  /**
   * Event findUniqueOrThrow
   */
  export type EventFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Event
     */
    select?: EventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Event
     */
    omit?: EventOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EventInclude<ExtArgs> | null
    /**
     * Filter, which Event to fetch.
     */
    where: EventWhereUniqueInput
  }

  /**
   * Event findFirst
   */
  export type EventFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Event
     */
    select?: EventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Event
     */
    omit?: EventOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EventInclude<ExtArgs> | null
    /**
     * Filter, which Event to fetch.
     */
    where?: EventWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Events to fetch.
     */
    orderBy?: EventOrderByWithRelationInput | EventOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Events.
     */
    cursor?: EventWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Events from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Events.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Events.
     */
    distinct?: EventScalarFieldEnum | EventScalarFieldEnum[]
  }

  /**
   * Event findFirstOrThrow
   */
  export type EventFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Event
     */
    select?: EventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Event
     */
    omit?: EventOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EventInclude<ExtArgs> | null
    /**
     * Filter, which Event to fetch.
     */
    where?: EventWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Events to fetch.
     */
    orderBy?: EventOrderByWithRelationInput | EventOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Events.
     */
    cursor?: EventWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Events from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Events.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Events.
     */
    distinct?: EventScalarFieldEnum | EventScalarFieldEnum[]
  }

  /**
   * Event findMany
   */
  export type EventFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Event
     */
    select?: EventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Event
     */
    omit?: EventOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EventInclude<ExtArgs> | null
    /**
     * Filter, which Events to fetch.
     */
    where?: EventWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Events to fetch.
     */
    orderBy?: EventOrderByWithRelationInput | EventOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Events.
     */
    cursor?: EventWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Events from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Events.
     */
    skip?: number
    distinct?: EventScalarFieldEnum | EventScalarFieldEnum[]
  }

  /**
   * Event create
   */
  export type EventCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Event
     */
    select?: EventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Event
     */
    omit?: EventOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EventInclude<ExtArgs> | null
    /**
     * The data needed to create a Event.
     */
    data: XOR<EventCreateInput, EventUncheckedCreateInput>
  }

  /**
   * Event createMany
   */
  export type EventCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Events.
     */
    data: EventCreateManyInput | EventCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Event createManyAndReturn
   */
  export type EventCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Event
     */
    select?: EventSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Event
     */
    omit?: EventOmit<ExtArgs> | null
    /**
     * The data used to create many Events.
     */
    data: EventCreateManyInput | EventCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Event update
   */
  export type EventUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Event
     */
    select?: EventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Event
     */
    omit?: EventOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EventInclude<ExtArgs> | null
    /**
     * The data needed to update a Event.
     */
    data: XOR<EventUpdateInput, EventUncheckedUpdateInput>
    /**
     * Choose, which Event to update.
     */
    where: EventWhereUniqueInput
  }

  /**
   * Event updateMany
   */
  export type EventUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Events.
     */
    data: XOR<EventUpdateManyMutationInput, EventUncheckedUpdateManyInput>
    /**
     * Filter which Events to update
     */
    where?: EventWhereInput
    /**
     * Limit how many Events to update.
     */
    limit?: number
  }

  /**
   * Event updateManyAndReturn
   */
  export type EventUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Event
     */
    select?: EventSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Event
     */
    omit?: EventOmit<ExtArgs> | null
    /**
     * The data used to update Events.
     */
    data: XOR<EventUpdateManyMutationInput, EventUncheckedUpdateManyInput>
    /**
     * Filter which Events to update
     */
    where?: EventWhereInput
    /**
     * Limit how many Events to update.
     */
    limit?: number
  }

  /**
   * Event upsert
   */
  export type EventUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Event
     */
    select?: EventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Event
     */
    omit?: EventOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EventInclude<ExtArgs> | null
    /**
     * The filter to search for the Event to update in case it exists.
     */
    where: EventWhereUniqueInput
    /**
     * In case the Event found by the `where` argument doesn't exist, create a new Event with this data.
     */
    create: XOR<EventCreateInput, EventUncheckedCreateInput>
    /**
     * In case the Event was found with the provided `where` argument, update it with this data.
     */
    update: XOR<EventUpdateInput, EventUncheckedUpdateInput>
  }

  /**
   * Event delete
   */
  export type EventDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Event
     */
    select?: EventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Event
     */
    omit?: EventOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EventInclude<ExtArgs> | null
    /**
     * Filter which Event to delete.
     */
    where: EventWhereUniqueInput
  }

  /**
   * Event deleteMany
   */
  export type EventDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Events to delete
     */
    where?: EventWhereInput
    /**
     * Limit how many Events to delete.
     */
    limit?: number
  }

  /**
   * Event.attendance
   */
  export type Event$attendanceArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EventAttendance
     */
    select?: EventAttendanceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the EventAttendance
     */
    omit?: EventAttendanceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EventAttendanceInclude<ExtArgs> | null
    where?: EventAttendanceWhereInput
    orderBy?: EventAttendanceOrderByWithRelationInput | EventAttendanceOrderByWithRelationInput[]
    cursor?: EventAttendanceWhereUniqueInput
    take?: number
    skip?: number
    distinct?: EventAttendanceScalarFieldEnum | EventAttendanceScalarFieldEnum[]
  }

  /**
   * Event without action
   */
  export type EventDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Event
     */
    select?: EventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Event
     */
    omit?: EventOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EventInclude<ExtArgs> | null
  }


  /**
   * Model Profile
   */

  export type AggregateProfile = {
    _count: ProfileCountAggregateOutputType | null
    _avg: ProfileAvgAggregateOutputType | null
    _sum: ProfileSumAggregateOutputType | null
    _min: ProfileMinAggregateOutputType | null
    _max: ProfileMaxAggregateOutputType | null
  }

  export type ProfileAvgAggregateOutputType = {
    nfc_id: number | null
  }

  export type ProfileSumAggregateOutputType = {
    nfc_id: bigint | null
  }

  export type ProfileMinAggregateOutputType = {
    id: string | null
    first_name: string | null
    last_name: string | null
    role: $Enums.role_enum | null
    nfc_id: bigint | null
    created_at: Date | null
    updated_at: Date | null
  }

  export type ProfileMaxAggregateOutputType = {
    id: string | null
    first_name: string | null
    last_name: string | null
    role: $Enums.role_enum | null
    nfc_id: bigint | null
    created_at: Date | null
    updated_at: Date | null
  }

  export type ProfileCountAggregateOutputType = {
    id: number
    first_name: number
    last_name: number
    role: number
    nfc_id: number
    created_at: number
    updated_at: number
    _all: number
  }


  export type ProfileAvgAggregateInputType = {
    nfc_id?: true
  }

  export type ProfileSumAggregateInputType = {
    nfc_id?: true
  }

  export type ProfileMinAggregateInputType = {
    id?: true
    first_name?: true
    last_name?: true
    role?: true
    nfc_id?: true
    created_at?: true
    updated_at?: true
  }

  export type ProfileMaxAggregateInputType = {
    id?: true
    first_name?: true
    last_name?: true
    role?: true
    nfc_id?: true
    created_at?: true
    updated_at?: true
  }

  export type ProfileCountAggregateInputType = {
    id?: true
    first_name?: true
    last_name?: true
    role?: true
    nfc_id?: true
    created_at?: true
    updated_at?: true
    _all?: true
  }

  export type ProfileAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Profile to aggregate.
     */
    where?: ProfileWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Profiles to fetch.
     */
    orderBy?: ProfileOrderByWithRelationInput | ProfileOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ProfileWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Profiles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Profiles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Profiles
    **/
    _count?: true | ProfileCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ProfileAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ProfileSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ProfileMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ProfileMaxAggregateInputType
  }

  export type GetProfileAggregateType<T extends ProfileAggregateArgs> = {
        [P in keyof T & keyof AggregateProfile]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateProfile[P]>
      : GetScalarType<T[P], AggregateProfile[P]>
  }




  export type ProfileGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ProfileWhereInput
    orderBy?: ProfileOrderByWithAggregationInput | ProfileOrderByWithAggregationInput[]
    by: ProfileScalarFieldEnum[] | ProfileScalarFieldEnum
    having?: ProfileScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ProfileCountAggregateInputType | true
    _avg?: ProfileAvgAggregateInputType
    _sum?: ProfileSumAggregateInputType
    _min?: ProfileMinAggregateInputType
    _max?: ProfileMaxAggregateInputType
  }

  export type ProfileGroupByOutputType = {
    id: string
    first_name: string
    last_name: string
    role: $Enums.role_enum
    nfc_id: bigint | null
    created_at: Date
    updated_at: Date
    _count: ProfileCountAggregateOutputType | null
    _avg: ProfileAvgAggregateOutputType | null
    _sum: ProfileSumAggregateOutputType | null
    _min: ProfileMinAggregateOutputType | null
    _max: ProfileMaxAggregateOutputType | null
  }

  type GetProfileGroupByPayload<T extends ProfileGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ProfileGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ProfileGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ProfileGroupByOutputType[P]>
            : GetScalarType<T[P], ProfileGroupByOutputType[P]>
        }
      >
    >


  export type ProfileSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    first_name?: boolean
    last_name?: boolean
    role?: boolean
    nfc_id?: boolean
    created_at?: boolean
    updated_at?: boolean
    resumes?: boolean | Profile$resumesArgs<ExtArgs>
    applications?: boolean | Profile$applicationsArgs<ExtArgs>
    eventAttendance?: boolean | Profile$eventAttendanceArgs<ExtArgs>
    teamMembers?: boolean | Profile$teamMembersArgs<ExtArgs>
    _count?: boolean | ProfileCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["profile"]>

  export type ProfileSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    first_name?: boolean
    last_name?: boolean
    role?: boolean
    nfc_id?: boolean
    created_at?: boolean
    updated_at?: boolean
  }, ExtArgs["result"]["profile"]>

  export type ProfileSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    first_name?: boolean
    last_name?: boolean
    role?: boolean
    nfc_id?: boolean
    created_at?: boolean
    updated_at?: boolean
  }, ExtArgs["result"]["profile"]>

  export type ProfileSelectScalar = {
    id?: boolean
    first_name?: boolean
    last_name?: boolean
    role?: boolean
    nfc_id?: boolean
    created_at?: boolean
    updated_at?: boolean
  }

  export type ProfileOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "first_name" | "last_name" | "role" | "nfc_id" | "created_at" | "updated_at", ExtArgs["result"]["profile"]>
  export type ProfileInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    resumes?: boolean | Profile$resumesArgs<ExtArgs>
    applications?: boolean | Profile$applicationsArgs<ExtArgs>
    eventAttendance?: boolean | Profile$eventAttendanceArgs<ExtArgs>
    teamMembers?: boolean | Profile$teamMembersArgs<ExtArgs>
    _count?: boolean | ProfileCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type ProfileIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type ProfileIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $ProfilePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Profile"
    objects: {
      resumes: Prisma.$ResumePayload<ExtArgs>[]
      applications: Prisma.$ApplicationPayload<ExtArgs>[]
      eventAttendance: Prisma.$EventAttendancePayload<ExtArgs>[]
      teamMembers: Prisma.$TeamMemberPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      first_name: string
      last_name: string
      role: $Enums.role_enum
      nfc_id: bigint | null
      created_at: Date
      updated_at: Date
    }, ExtArgs["result"]["profile"]>
    composites: {}
  }

  type ProfileGetPayload<S extends boolean | null | undefined | ProfileDefaultArgs> = $Result.GetResult<Prisma.$ProfilePayload, S>

  type ProfileCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ProfileFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ProfileCountAggregateInputType | true
    }

  export interface ProfileDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Profile'], meta: { name: 'Profile' } }
    /**
     * Find zero or one Profile that matches the filter.
     * @param {ProfileFindUniqueArgs} args - Arguments to find a Profile
     * @example
     * // Get one Profile
     * const profile = await prisma.profile.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ProfileFindUniqueArgs>(args: SelectSubset<T, ProfileFindUniqueArgs<ExtArgs>>): Prisma__ProfileClient<$Result.GetResult<Prisma.$ProfilePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Profile that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ProfileFindUniqueOrThrowArgs} args - Arguments to find a Profile
     * @example
     * // Get one Profile
     * const profile = await prisma.profile.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ProfileFindUniqueOrThrowArgs>(args: SelectSubset<T, ProfileFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ProfileClient<$Result.GetResult<Prisma.$ProfilePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Profile that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProfileFindFirstArgs} args - Arguments to find a Profile
     * @example
     * // Get one Profile
     * const profile = await prisma.profile.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ProfileFindFirstArgs>(args?: SelectSubset<T, ProfileFindFirstArgs<ExtArgs>>): Prisma__ProfileClient<$Result.GetResult<Prisma.$ProfilePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Profile that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProfileFindFirstOrThrowArgs} args - Arguments to find a Profile
     * @example
     * // Get one Profile
     * const profile = await prisma.profile.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ProfileFindFirstOrThrowArgs>(args?: SelectSubset<T, ProfileFindFirstOrThrowArgs<ExtArgs>>): Prisma__ProfileClient<$Result.GetResult<Prisma.$ProfilePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Profiles that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProfileFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Profiles
     * const profiles = await prisma.profile.findMany()
     * 
     * // Get first 10 Profiles
     * const profiles = await prisma.profile.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const profileWithIdOnly = await prisma.profile.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ProfileFindManyArgs>(args?: SelectSubset<T, ProfileFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProfilePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Profile.
     * @param {ProfileCreateArgs} args - Arguments to create a Profile.
     * @example
     * // Create one Profile
     * const Profile = await prisma.profile.create({
     *   data: {
     *     // ... data to create a Profile
     *   }
     * })
     * 
     */
    create<T extends ProfileCreateArgs>(args: SelectSubset<T, ProfileCreateArgs<ExtArgs>>): Prisma__ProfileClient<$Result.GetResult<Prisma.$ProfilePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Profiles.
     * @param {ProfileCreateManyArgs} args - Arguments to create many Profiles.
     * @example
     * // Create many Profiles
     * const profile = await prisma.profile.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ProfileCreateManyArgs>(args?: SelectSubset<T, ProfileCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Profiles and returns the data saved in the database.
     * @param {ProfileCreateManyAndReturnArgs} args - Arguments to create many Profiles.
     * @example
     * // Create many Profiles
     * const profile = await prisma.profile.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Profiles and only return the `id`
     * const profileWithIdOnly = await prisma.profile.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ProfileCreateManyAndReturnArgs>(args?: SelectSubset<T, ProfileCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProfilePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Profile.
     * @param {ProfileDeleteArgs} args - Arguments to delete one Profile.
     * @example
     * // Delete one Profile
     * const Profile = await prisma.profile.delete({
     *   where: {
     *     // ... filter to delete one Profile
     *   }
     * })
     * 
     */
    delete<T extends ProfileDeleteArgs>(args: SelectSubset<T, ProfileDeleteArgs<ExtArgs>>): Prisma__ProfileClient<$Result.GetResult<Prisma.$ProfilePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Profile.
     * @param {ProfileUpdateArgs} args - Arguments to update one Profile.
     * @example
     * // Update one Profile
     * const profile = await prisma.profile.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ProfileUpdateArgs>(args: SelectSubset<T, ProfileUpdateArgs<ExtArgs>>): Prisma__ProfileClient<$Result.GetResult<Prisma.$ProfilePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Profiles.
     * @param {ProfileDeleteManyArgs} args - Arguments to filter Profiles to delete.
     * @example
     * // Delete a few Profiles
     * const { count } = await prisma.profile.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ProfileDeleteManyArgs>(args?: SelectSubset<T, ProfileDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Profiles.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProfileUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Profiles
     * const profile = await prisma.profile.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ProfileUpdateManyArgs>(args: SelectSubset<T, ProfileUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Profiles and returns the data updated in the database.
     * @param {ProfileUpdateManyAndReturnArgs} args - Arguments to update many Profiles.
     * @example
     * // Update many Profiles
     * const profile = await prisma.profile.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Profiles and only return the `id`
     * const profileWithIdOnly = await prisma.profile.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends ProfileUpdateManyAndReturnArgs>(args: SelectSubset<T, ProfileUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProfilePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Profile.
     * @param {ProfileUpsertArgs} args - Arguments to update or create a Profile.
     * @example
     * // Update or create a Profile
     * const profile = await prisma.profile.upsert({
     *   create: {
     *     // ... data to create a Profile
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Profile we want to update
     *   }
     * })
     */
    upsert<T extends ProfileUpsertArgs>(args: SelectSubset<T, ProfileUpsertArgs<ExtArgs>>): Prisma__ProfileClient<$Result.GetResult<Prisma.$ProfilePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Profiles.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProfileCountArgs} args - Arguments to filter Profiles to count.
     * @example
     * // Count the number of Profiles
     * const count = await prisma.profile.count({
     *   where: {
     *     // ... the filter for the Profiles we want to count
     *   }
     * })
    **/
    count<T extends ProfileCountArgs>(
      args?: Subset<T, ProfileCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ProfileCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Profile.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProfileAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ProfileAggregateArgs>(args: Subset<T, ProfileAggregateArgs>): Prisma.PrismaPromise<GetProfileAggregateType<T>>

    /**
     * Group by Profile.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProfileGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ProfileGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ProfileGroupByArgs['orderBy'] }
        : { orderBy?: ProfileGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ProfileGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetProfileGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Profile model
   */
  readonly fields: ProfileFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Profile.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ProfileClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    resumes<T extends Profile$resumesArgs<ExtArgs> = {}>(args?: Subset<T, Profile$resumesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ResumePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    applications<T extends Profile$applicationsArgs<ExtArgs> = {}>(args?: Subset<T, Profile$applicationsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ApplicationPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    eventAttendance<T extends Profile$eventAttendanceArgs<ExtArgs> = {}>(args?: Subset<T, Profile$eventAttendanceArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$EventAttendancePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    teamMembers<T extends Profile$teamMembersArgs<ExtArgs> = {}>(args?: Subset<T, Profile$teamMembersArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TeamMemberPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Profile model
   */
  interface ProfileFieldRefs {
    readonly id: FieldRef<"Profile", 'String'>
    readonly first_name: FieldRef<"Profile", 'String'>
    readonly last_name: FieldRef<"Profile", 'String'>
    readonly role: FieldRef<"Profile", 'role_enum'>
    readonly nfc_id: FieldRef<"Profile", 'BigInt'>
    readonly created_at: FieldRef<"Profile", 'DateTime'>
    readonly updated_at: FieldRef<"Profile", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Profile findUnique
   */
  export type ProfileFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Profile
     */
    select?: ProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Profile
     */
    omit?: ProfileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProfileInclude<ExtArgs> | null
    /**
     * Filter, which Profile to fetch.
     */
    where: ProfileWhereUniqueInput
  }

  /**
   * Profile findUniqueOrThrow
   */
  export type ProfileFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Profile
     */
    select?: ProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Profile
     */
    omit?: ProfileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProfileInclude<ExtArgs> | null
    /**
     * Filter, which Profile to fetch.
     */
    where: ProfileWhereUniqueInput
  }

  /**
   * Profile findFirst
   */
  export type ProfileFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Profile
     */
    select?: ProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Profile
     */
    omit?: ProfileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProfileInclude<ExtArgs> | null
    /**
     * Filter, which Profile to fetch.
     */
    where?: ProfileWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Profiles to fetch.
     */
    orderBy?: ProfileOrderByWithRelationInput | ProfileOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Profiles.
     */
    cursor?: ProfileWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Profiles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Profiles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Profiles.
     */
    distinct?: ProfileScalarFieldEnum | ProfileScalarFieldEnum[]
  }

  /**
   * Profile findFirstOrThrow
   */
  export type ProfileFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Profile
     */
    select?: ProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Profile
     */
    omit?: ProfileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProfileInclude<ExtArgs> | null
    /**
     * Filter, which Profile to fetch.
     */
    where?: ProfileWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Profiles to fetch.
     */
    orderBy?: ProfileOrderByWithRelationInput | ProfileOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Profiles.
     */
    cursor?: ProfileWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Profiles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Profiles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Profiles.
     */
    distinct?: ProfileScalarFieldEnum | ProfileScalarFieldEnum[]
  }

  /**
   * Profile findMany
   */
  export type ProfileFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Profile
     */
    select?: ProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Profile
     */
    omit?: ProfileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProfileInclude<ExtArgs> | null
    /**
     * Filter, which Profiles to fetch.
     */
    where?: ProfileWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Profiles to fetch.
     */
    orderBy?: ProfileOrderByWithRelationInput | ProfileOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Profiles.
     */
    cursor?: ProfileWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Profiles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Profiles.
     */
    skip?: number
    distinct?: ProfileScalarFieldEnum | ProfileScalarFieldEnum[]
  }

  /**
   * Profile create
   */
  export type ProfileCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Profile
     */
    select?: ProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Profile
     */
    omit?: ProfileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProfileInclude<ExtArgs> | null
    /**
     * The data needed to create a Profile.
     */
    data: XOR<ProfileCreateInput, ProfileUncheckedCreateInput>
  }

  /**
   * Profile createMany
   */
  export type ProfileCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Profiles.
     */
    data: ProfileCreateManyInput | ProfileCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Profile createManyAndReturn
   */
  export type ProfileCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Profile
     */
    select?: ProfileSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Profile
     */
    omit?: ProfileOmit<ExtArgs> | null
    /**
     * The data used to create many Profiles.
     */
    data: ProfileCreateManyInput | ProfileCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Profile update
   */
  export type ProfileUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Profile
     */
    select?: ProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Profile
     */
    omit?: ProfileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProfileInclude<ExtArgs> | null
    /**
     * The data needed to update a Profile.
     */
    data: XOR<ProfileUpdateInput, ProfileUncheckedUpdateInput>
    /**
     * Choose, which Profile to update.
     */
    where: ProfileWhereUniqueInput
  }

  /**
   * Profile updateMany
   */
  export type ProfileUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Profiles.
     */
    data: XOR<ProfileUpdateManyMutationInput, ProfileUncheckedUpdateManyInput>
    /**
     * Filter which Profiles to update
     */
    where?: ProfileWhereInput
    /**
     * Limit how many Profiles to update.
     */
    limit?: number
  }

  /**
   * Profile updateManyAndReturn
   */
  export type ProfileUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Profile
     */
    select?: ProfileSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Profile
     */
    omit?: ProfileOmit<ExtArgs> | null
    /**
     * The data used to update Profiles.
     */
    data: XOR<ProfileUpdateManyMutationInput, ProfileUncheckedUpdateManyInput>
    /**
     * Filter which Profiles to update
     */
    where?: ProfileWhereInput
    /**
     * Limit how many Profiles to update.
     */
    limit?: number
  }

  /**
   * Profile upsert
   */
  export type ProfileUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Profile
     */
    select?: ProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Profile
     */
    omit?: ProfileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProfileInclude<ExtArgs> | null
    /**
     * The filter to search for the Profile to update in case it exists.
     */
    where: ProfileWhereUniqueInput
    /**
     * In case the Profile found by the `where` argument doesn't exist, create a new Profile with this data.
     */
    create: XOR<ProfileCreateInput, ProfileUncheckedCreateInput>
    /**
     * In case the Profile was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ProfileUpdateInput, ProfileUncheckedUpdateInput>
  }

  /**
   * Profile delete
   */
  export type ProfileDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Profile
     */
    select?: ProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Profile
     */
    omit?: ProfileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProfileInclude<ExtArgs> | null
    /**
     * Filter which Profile to delete.
     */
    where: ProfileWhereUniqueInput
  }

  /**
   * Profile deleteMany
   */
  export type ProfileDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Profiles to delete
     */
    where?: ProfileWhereInput
    /**
     * Limit how many Profiles to delete.
     */
    limit?: number
  }

  /**
   * Profile.resumes
   */
  export type Profile$resumesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Resume
     */
    select?: ResumeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Resume
     */
    omit?: ResumeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ResumeInclude<ExtArgs> | null
    where?: ResumeWhereInput
    orderBy?: ResumeOrderByWithRelationInput | ResumeOrderByWithRelationInput[]
    cursor?: ResumeWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ResumeScalarFieldEnum | ResumeScalarFieldEnum[]
  }

  /**
   * Profile.applications
   */
  export type Profile$applicationsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Application
     */
    select?: ApplicationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Application
     */
    omit?: ApplicationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ApplicationInclude<ExtArgs> | null
    where?: ApplicationWhereInput
    orderBy?: ApplicationOrderByWithRelationInput | ApplicationOrderByWithRelationInput[]
    cursor?: ApplicationWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ApplicationScalarFieldEnum | ApplicationScalarFieldEnum[]
  }

  /**
   * Profile.eventAttendance
   */
  export type Profile$eventAttendanceArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EventAttendance
     */
    select?: EventAttendanceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the EventAttendance
     */
    omit?: EventAttendanceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EventAttendanceInclude<ExtArgs> | null
    where?: EventAttendanceWhereInput
    orderBy?: EventAttendanceOrderByWithRelationInput | EventAttendanceOrderByWithRelationInput[]
    cursor?: EventAttendanceWhereUniqueInput
    take?: number
    skip?: number
    distinct?: EventAttendanceScalarFieldEnum | EventAttendanceScalarFieldEnum[]
  }

  /**
   * Profile.teamMembers
   */
  export type Profile$teamMembersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TeamMember
     */
    select?: TeamMemberSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TeamMember
     */
    omit?: TeamMemberOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TeamMemberInclude<ExtArgs> | null
    where?: TeamMemberWhereInput
    orderBy?: TeamMemberOrderByWithRelationInput | TeamMemberOrderByWithRelationInput[]
    cursor?: TeamMemberWhereUniqueInput
    take?: number
    skip?: number
    distinct?: TeamMemberScalarFieldEnum | TeamMemberScalarFieldEnum[]
  }

  /**
   * Profile without action
   */
  export type ProfileDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Profile
     */
    select?: ProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Profile
     */
    omit?: ProfileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProfileInclude<ExtArgs> | null
  }


  /**
   * Model Question
   */

  export type AggregateQuestion = {
    _count: QuestionCountAggregateOutputType | null
    _avg: QuestionAvgAggregateOutputType | null
    _sum: QuestionSumAggregateOutputType | null
    _min: QuestionMinAggregateOutputType | null
    _max: QuestionMaxAggregateOutputType | null
  }

  export type QuestionAvgAggregateOutputType = {
    id: number | null
    order_num: number | null
    max_length: number | null
  }

  export type QuestionSumAggregateOutputType = {
    id: bigint | null
    order_num: number | null
    max_length: number | null
  }

  export type QuestionMinAggregateOutputType = {
    id: bigint | null
    question_id: string | null
    question: string | null
    is_required: boolean | null
    order_num: number | null
    max_length: number | null
    placeholder: string | null
    help_text: string | null
    role: $Enums.role_enum | null
    term: string | null
  }

  export type QuestionMaxAggregateOutputType = {
    id: bigint | null
    question_id: string | null
    question: string | null
    is_required: boolean | null
    order_num: number | null
    max_length: number | null
    placeholder: string | null
    help_text: string | null
    role: $Enums.role_enum | null
    term: string | null
  }

  export type QuestionCountAggregateOutputType = {
    id: number
    question_id: number
    question: number
    is_required: number
    order_num: number
    max_length: number
    placeholder: number
    help_text: number
    role: number
    term: number
    _all: number
  }


  export type QuestionAvgAggregateInputType = {
    id?: true
    order_num?: true
    max_length?: true
  }

  export type QuestionSumAggregateInputType = {
    id?: true
    order_num?: true
    max_length?: true
  }

  export type QuestionMinAggregateInputType = {
    id?: true
    question_id?: true
    question?: true
    is_required?: true
    order_num?: true
    max_length?: true
    placeholder?: true
    help_text?: true
    role?: true
    term?: true
  }

  export type QuestionMaxAggregateInputType = {
    id?: true
    question_id?: true
    question?: true
    is_required?: true
    order_num?: true
    max_length?: true
    placeholder?: true
    help_text?: true
    role?: true
    term?: true
  }

  export type QuestionCountAggregateInputType = {
    id?: true
    question_id?: true
    question?: true
    is_required?: true
    order_num?: true
    max_length?: true
    placeholder?: true
    help_text?: true
    role?: true
    term?: true
    _all?: true
  }

  export type QuestionAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Question to aggregate.
     */
    where?: QuestionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Questions to fetch.
     */
    orderBy?: QuestionOrderByWithRelationInput | QuestionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: QuestionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Questions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Questions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Questions
    **/
    _count?: true | QuestionCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: QuestionAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: QuestionSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: QuestionMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: QuestionMaxAggregateInputType
  }

  export type GetQuestionAggregateType<T extends QuestionAggregateArgs> = {
        [P in keyof T & keyof AggregateQuestion]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateQuestion[P]>
      : GetScalarType<T[P], AggregateQuestion[P]>
  }




  export type QuestionGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: QuestionWhereInput
    orderBy?: QuestionOrderByWithAggregationInput | QuestionOrderByWithAggregationInput[]
    by: QuestionScalarFieldEnum[] | QuestionScalarFieldEnum
    having?: QuestionScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: QuestionCountAggregateInputType | true
    _avg?: QuestionAvgAggregateInputType
    _sum?: QuestionSumAggregateInputType
    _min?: QuestionMinAggregateInputType
    _max?: QuestionMaxAggregateInputType
  }

  export type QuestionGroupByOutputType = {
    id: bigint
    question_id: string
    question: string
    is_required: boolean
    order_num: number
    max_length: number
    placeholder: string | null
    help_text: string | null
    role: $Enums.role_enum
    term: string
    _count: QuestionCountAggregateOutputType | null
    _avg: QuestionAvgAggregateOutputType | null
    _sum: QuestionSumAggregateOutputType | null
    _min: QuestionMinAggregateOutputType | null
    _max: QuestionMaxAggregateOutputType | null
  }

  type GetQuestionGroupByPayload<T extends QuestionGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<QuestionGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof QuestionGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], QuestionGroupByOutputType[P]>
            : GetScalarType<T[P], QuestionGroupByOutputType[P]>
        }
      >
    >


  export type QuestionSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    question_id?: boolean
    question?: boolean
    is_required?: boolean
    order_num?: boolean
    max_length?: boolean
    placeholder?: boolean
    help_text?: boolean
    role?: boolean
    term?: boolean
    answers?: boolean | Question$answersArgs<ExtArgs>
    _count?: boolean | QuestionCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["question"]>

  export type QuestionSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    question_id?: boolean
    question?: boolean
    is_required?: boolean
    order_num?: boolean
    max_length?: boolean
    placeholder?: boolean
    help_text?: boolean
    role?: boolean
    term?: boolean
  }, ExtArgs["result"]["question"]>

  export type QuestionSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    question_id?: boolean
    question?: boolean
    is_required?: boolean
    order_num?: boolean
    max_length?: boolean
    placeholder?: boolean
    help_text?: boolean
    role?: boolean
    term?: boolean
  }, ExtArgs["result"]["question"]>

  export type QuestionSelectScalar = {
    id?: boolean
    question_id?: boolean
    question?: boolean
    is_required?: boolean
    order_num?: boolean
    max_length?: boolean
    placeholder?: boolean
    help_text?: boolean
    role?: boolean
    term?: boolean
  }

  export type QuestionOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "question_id" | "question" | "is_required" | "order_num" | "max_length" | "placeholder" | "help_text" | "role" | "term", ExtArgs["result"]["question"]>
  export type QuestionInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    answers?: boolean | Question$answersArgs<ExtArgs>
    _count?: boolean | QuestionCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type QuestionIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type QuestionIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $QuestionPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Question"
    objects: {
      answers: Prisma.$ApplicationAnswerPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: bigint
      question_id: string
      question: string
      is_required: boolean
      order_num: number
      max_length: number
      placeholder: string | null
      help_text: string | null
      role: $Enums.role_enum
      term: string
    }, ExtArgs["result"]["question"]>
    composites: {}
  }

  type QuestionGetPayload<S extends boolean | null | undefined | QuestionDefaultArgs> = $Result.GetResult<Prisma.$QuestionPayload, S>

  type QuestionCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<QuestionFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: QuestionCountAggregateInputType | true
    }

  export interface QuestionDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Question'], meta: { name: 'Question' } }
    /**
     * Find zero or one Question that matches the filter.
     * @param {QuestionFindUniqueArgs} args - Arguments to find a Question
     * @example
     * // Get one Question
     * const question = await prisma.question.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends QuestionFindUniqueArgs>(args: SelectSubset<T, QuestionFindUniqueArgs<ExtArgs>>): Prisma__QuestionClient<$Result.GetResult<Prisma.$QuestionPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Question that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {QuestionFindUniqueOrThrowArgs} args - Arguments to find a Question
     * @example
     * // Get one Question
     * const question = await prisma.question.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends QuestionFindUniqueOrThrowArgs>(args: SelectSubset<T, QuestionFindUniqueOrThrowArgs<ExtArgs>>): Prisma__QuestionClient<$Result.GetResult<Prisma.$QuestionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Question that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {QuestionFindFirstArgs} args - Arguments to find a Question
     * @example
     * // Get one Question
     * const question = await prisma.question.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends QuestionFindFirstArgs>(args?: SelectSubset<T, QuestionFindFirstArgs<ExtArgs>>): Prisma__QuestionClient<$Result.GetResult<Prisma.$QuestionPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Question that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {QuestionFindFirstOrThrowArgs} args - Arguments to find a Question
     * @example
     * // Get one Question
     * const question = await prisma.question.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends QuestionFindFirstOrThrowArgs>(args?: SelectSubset<T, QuestionFindFirstOrThrowArgs<ExtArgs>>): Prisma__QuestionClient<$Result.GetResult<Prisma.$QuestionPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Questions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {QuestionFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Questions
     * const questions = await prisma.question.findMany()
     * 
     * // Get first 10 Questions
     * const questions = await prisma.question.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const questionWithIdOnly = await prisma.question.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends QuestionFindManyArgs>(args?: SelectSubset<T, QuestionFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$QuestionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Question.
     * @param {QuestionCreateArgs} args - Arguments to create a Question.
     * @example
     * // Create one Question
     * const Question = await prisma.question.create({
     *   data: {
     *     // ... data to create a Question
     *   }
     * })
     * 
     */
    create<T extends QuestionCreateArgs>(args: SelectSubset<T, QuestionCreateArgs<ExtArgs>>): Prisma__QuestionClient<$Result.GetResult<Prisma.$QuestionPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Questions.
     * @param {QuestionCreateManyArgs} args - Arguments to create many Questions.
     * @example
     * // Create many Questions
     * const question = await prisma.question.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends QuestionCreateManyArgs>(args?: SelectSubset<T, QuestionCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Questions and returns the data saved in the database.
     * @param {QuestionCreateManyAndReturnArgs} args - Arguments to create many Questions.
     * @example
     * // Create many Questions
     * const question = await prisma.question.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Questions and only return the `id`
     * const questionWithIdOnly = await prisma.question.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends QuestionCreateManyAndReturnArgs>(args?: SelectSubset<T, QuestionCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$QuestionPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Question.
     * @param {QuestionDeleteArgs} args - Arguments to delete one Question.
     * @example
     * // Delete one Question
     * const Question = await prisma.question.delete({
     *   where: {
     *     // ... filter to delete one Question
     *   }
     * })
     * 
     */
    delete<T extends QuestionDeleteArgs>(args: SelectSubset<T, QuestionDeleteArgs<ExtArgs>>): Prisma__QuestionClient<$Result.GetResult<Prisma.$QuestionPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Question.
     * @param {QuestionUpdateArgs} args - Arguments to update one Question.
     * @example
     * // Update one Question
     * const question = await prisma.question.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends QuestionUpdateArgs>(args: SelectSubset<T, QuestionUpdateArgs<ExtArgs>>): Prisma__QuestionClient<$Result.GetResult<Prisma.$QuestionPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Questions.
     * @param {QuestionDeleteManyArgs} args - Arguments to filter Questions to delete.
     * @example
     * // Delete a few Questions
     * const { count } = await prisma.question.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends QuestionDeleteManyArgs>(args?: SelectSubset<T, QuestionDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Questions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {QuestionUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Questions
     * const question = await prisma.question.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends QuestionUpdateManyArgs>(args: SelectSubset<T, QuestionUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Questions and returns the data updated in the database.
     * @param {QuestionUpdateManyAndReturnArgs} args - Arguments to update many Questions.
     * @example
     * // Update many Questions
     * const question = await prisma.question.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Questions and only return the `id`
     * const questionWithIdOnly = await prisma.question.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends QuestionUpdateManyAndReturnArgs>(args: SelectSubset<T, QuestionUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$QuestionPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Question.
     * @param {QuestionUpsertArgs} args - Arguments to update or create a Question.
     * @example
     * // Update or create a Question
     * const question = await prisma.question.upsert({
     *   create: {
     *     // ... data to create a Question
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Question we want to update
     *   }
     * })
     */
    upsert<T extends QuestionUpsertArgs>(args: SelectSubset<T, QuestionUpsertArgs<ExtArgs>>): Prisma__QuestionClient<$Result.GetResult<Prisma.$QuestionPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Questions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {QuestionCountArgs} args - Arguments to filter Questions to count.
     * @example
     * // Count the number of Questions
     * const count = await prisma.question.count({
     *   where: {
     *     // ... the filter for the Questions we want to count
     *   }
     * })
    **/
    count<T extends QuestionCountArgs>(
      args?: Subset<T, QuestionCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], QuestionCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Question.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {QuestionAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends QuestionAggregateArgs>(args: Subset<T, QuestionAggregateArgs>): Prisma.PrismaPromise<GetQuestionAggregateType<T>>

    /**
     * Group by Question.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {QuestionGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends QuestionGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: QuestionGroupByArgs['orderBy'] }
        : { orderBy?: QuestionGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, QuestionGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetQuestionGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Question model
   */
  readonly fields: QuestionFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Question.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__QuestionClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    answers<T extends Question$answersArgs<ExtArgs> = {}>(args?: Subset<T, Question$answersArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ApplicationAnswerPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Question model
   */
  interface QuestionFieldRefs {
    readonly id: FieldRef<"Question", 'BigInt'>
    readonly question_id: FieldRef<"Question", 'String'>
    readonly question: FieldRef<"Question", 'String'>
    readonly is_required: FieldRef<"Question", 'Boolean'>
    readonly order_num: FieldRef<"Question", 'Int'>
    readonly max_length: FieldRef<"Question", 'Int'>
    readonly placeholder: FieldRef<"Question", 'String'>
    readonly help_text: FieldRef<"Question", 'String'>
    readonly role: FieldRef<"Question", 'role_enum'>
    readonly term: FieldRef<"Question", 'String'>
  }
    

  // Custom InputTypes
  /**
   * Question findUnique
   */
  export type QuestionFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Question
     */
    select?: QuestionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Question
     */
    omit?: QuestionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QuestionInclude<ExtArgs> | null
    /**
     * Filter, which Question to fetch.
     */
    where: QuestionWhereUniqueInput
  }

  /**
   * Question findUniqueOrThrow
   */
  export type QuestionFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Question
     */
    select?: QuestionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Question
     */
    omit?: QuestionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QuestionInclude<ExtArgs> | null
    /**
     * Filter, which Question to fetch.
     */
    where: QuestionWhereUniqueInput
  }

  /**
   * Question findFirst
   */
  export type QuestionFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Question
     */
    select?: QuestionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Question
     */
    omit?: QuestionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QuestionInclude<ExtArgs> | null
    /**
     * Filter, which Question to fetch.
     */
    where?: QuestionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Questions to fetch.
     */
    orderBy?: QuestionOrderByWithRelationInput | QuestionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Questions.
     */
    cursor?: QuestionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Questions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Questions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Questions.
     */
    distinct?: QuestionScalarFieldEnum | QuestionScalarFieldEnum[]
  }

  /**
   * Question findFirstOrThrow
   */
  export type QuestionFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Question
     */
    select?: QuestionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Question
     */
    omit?: QuestionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QuestionInclude<ExtArgs> | null
    /**
     * Filter, which Question to fetch.
     */
    where?: QuestionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Questions to fetch.
     */
    orderBy?: QuestionOrderByWithRelationInput | QuestionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Questions.
     */
    cursor?: QuestionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Questions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Questions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Questions.
     */
    distinct?: QuestionScalarFieldEnum | QuestionScalarFieldEnum[]
  }

  /**
   * Question findMany
   */
  export type QuestionFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Question
     */
    select?: QuestionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Question
     */
    omit?: QuestionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QuestionInclude<ExtArgs> | null
    /**
     * Filter, which Questions to fetch.
     */
    where?: QuestionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Questions to fetch.
     */
    orderBy?: QuestionOrderByWithRelationInput | QuestionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Questions.
     */
    cursor?: QuestionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Questions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Questions.
     */
    skip?: number
    distinct?: QuestionScalarFieldEnum | QuestionScalarFieldEnum[]
  }

  /**
   * Question create
   */
  export type QuestionCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Question
     */
    select?: QuestionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Question
     */
    omit?: QuestionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QuestionInclude<ExtArgs> | null
    /**
     * The data needed to create a Question.
     */
    data: XOR<QuestionCreateInput, QuestionUncheckedCreateInput>
  }

  /**
   * Question createMany
   */
  export type QuestionCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Questions.
     */
    data: QuestionCreateManyInput | QuestionCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Question createManyAndReturn
   */
  export type QuestionCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Question
     */
    select?: QuestionSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Question
     */
    omit?: QuestionOmit<ExtArgs> | null
    /**
     * The data used to create many Questions.
     */
    data: QuestionCreateManyInput | QuestionCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Question update
   */
  export type QuestionUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Question
     */
    select?: QuestionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Question
     */
    omit?: QuestionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QuestionInclude<ExtArgs> | null
    /**
     * The data needed to update a Question.
     */
    data: XOR<QuestionUpdateInput, QuestionUncheckedUpdateInput>
    /**
     * Choose, which Question to update.
     */
    where: QuestionWhereUniqueInput
  }

  /**
   * Question updateMany
   */
  export type QuestionUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Questions.
     */
    data: XOR<QuestionUpdateManyMutationInput, QuestionUncheckedUpdateManyInput>
    /**
     * Filter which Questions to update
     */
    where?: QuestionWhereInput
    /**
     * Limit how many Questions to update.
     */
    limit?: number
  }

  /**
   * Question updateManyAndReturn
   */
  export type QuestionUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Question
     */
    select?: QuestionSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Question
     */
    omit?: QuestionOmit<ExtArgs> | null
    /**
     * The data used to update Questions.
     */
    data: XOR<QuestionUpdateManyMutationInput, QuestionUncheckedUpdateManyInput>
    /**
     * Filter which Questions to update
     */
    where?: QuestionWhereInput
    /**
     * Limit how many Questions to update.
     */
    limit?: number
  }

  /**
   * Question upsert
   */
  export type QuestionUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Question
     */
    select?: QuestionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Question
     */
    omit?: QuestionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QuestionInclude<ExtArgs> | null
    /**
     * The filter to search for the Question to update in case it exists.
     */
    where: QuestionWhereUniqueInput
    /**
     * In case the Question found by the `where` argument doesn't exist, create a new Question with this data.
     */
    create: XOR<QuestionCreateInput, QuestionUncheckedCreateInput>
    /**
     * In case the Question was found with the provided `where` argument, update it with this data.
     */
    update: XOR<QuestionUpdateInput, QuestionUncheckedUpdateInput>
  }

  /**
   * Question delete
   */
  export type QuestionDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Question
     */
    select?: QuestionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Question
     */
    omit?: QuestionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QuestionInclude<ExtArgs> | null
    /**
     * Filter which Question to delete.
     */
    where: QuestionWhereUniqueInput
  }

  /**
   * Question deleteMany
   */
  export type QuestionDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Questions to delete
     */
    where?: QuestionWhereInput
    /**
     * Limit how many Questions to delete.
     */
    limit?: number
  }

  /**
   * Question.answers
   */
  export type Question$answersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ApplicationAnswer
     */
    select?: ApplicationAnswerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ApplicationAnswer
     */
    omit?: ApplicationAnswerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ApplicationAnswerInclude<ExtArgs> | null
    where?: ApplicationAnswerWhereInput
    orderBy?: ApplicationAnswerOrderByWithRelationInput | ApplicationAnswerOrderByWithRelationInput[]
    cursor?: ApplicationAnswerWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ApplicationAnswerScalarFieldEnum | ApplicationAnswerScalarFieldEnum[]
  }

  /**
   * Question without action
   */
  export type QuestionDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Question
     */
    select?: QuestionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Question
     */
    omit?: QuestionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QuestionInclude<ExtArgs> | null
  }


  /**
   * Model Resume
   */

  export type AggregateResume = {
    _count: ResumeCountAggregateOutputType | null
    _avg: ResumeAvgAggregateOutputType | null
    _sum: ResumeSumAggregateOutputType | null
    _min: ResumeMinAggregateOutputType | null
    _max: ResumeMaxAggregateOutputType | null
  }

  export type ResumeAvgAggregateOutputType = {
    id: number | null
  }

  export type ResumeSumAggregateOutputType = {
    id: bigint | null
  }

  export type ResumeMinAggregateOutputType = {
    id: bigint | null
    profile_id: string | null
    file_path: string | null
    created_at: Date | null
  }

  export type ResumeMaxAggregateOutputType = {
    id: bigint | null
    profile_id: string | null
    file_path: string | null
    created_at: Date | null
  }

  export type ResumeCountAggregateOutputType = {
    id: number
    profile_id: number
    file_path: number
    created_at: number
    _all: number
  }


  export type ResumeAvgAggregateInputType = {
    id?: true
  }

  export type ResumeSumAggregateInputType = {
    id?: true
  }

  export type ResumeMinAggregateInputType = {
    id?: true
    profile_id?: true
    file_path?: true
    created_at?: true
  }

  export type ResumeMaxAggregateInputType = {
    id?: true
    profile_id?: true
    file_path?: true
    created_at?: true
  }

  export type ResumeCountAggregateInputType = {
    id?: true
    profile_id?: true
    file_path?: true
    created_at?: true
    _all?: true
  }

  export type ResumeAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Resume to aggregate.
     */
    where?: ResumeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Resumes to fetch.
     */
    orderBy?: ResumeOrderByWithRelationInput | ResumeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ResumeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Resumes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Resumes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Resumes
    **/
    _count?: true | ResumeCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ResumeAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ResumeSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ResumeMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ResumeMaxAggregateInputType
  }

  export type GetResumeAggregateType<T extends ResumeAggregateArgs> = {
        [P in keyof T & keyof AggregateResume]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateResume[P]>
      : GetScalarType<T[P], AggregateResume[P]>
  }




  export type ResumeGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ResumeWhereInput
    orderBy?: ResumeOrderByWithAggregationInput | ResumeOrderByWithAggregationInput[]
    by: ResumeScalarFieldEnum[] | ResumeScalarFieldEnum
    having?: ResumeScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ResumeCountAggregateInputType | true
    _avg?: ResumeAvgAggregateInputType
    _sum?: ResumeSumAggregateInputType
    _min?: ResumeMinAggregateInputType
    _max?: ResumeMaxAggregateInputType
  }

  export type ResumeGroupByOutputType = {
    id: bigint
    profile_id: string
    file_path: string
    created_at: Date
    _count: ResumeCountAggregateOutputType | null
    _avg: ResumeAvgAggregateOutputType | null
    _sum: ResumeSumAggregateOutputType | null
    _min: ResumeMinAggregateOutputType | null
    _max: ResumeMaxAggregateOutputType | null
  }

  type GetResumeGroupByPayload<T extends ResumeGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ResumeGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ResumeGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ResumeGroupByOutputType[P]>
            : GetScalarType<T[P], ResumeGroupByOutputType[P]>
        }
      >
    >


  export type ResumeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    profile_id?: boolean
    file_path?: boolean
    created_at?: boolean
    profile?: boolean | ProfileDefaultArgs<ExtArgs>
    applications?: boolean | Resume$applicationsArgs<ExtArgs>
    _count?: boolean | ResumeCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["resume"]>

  export type ResumeSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    profile_id?: boolean
    file_path?: boolean
    created_at?: boolean
    profile?: boolean | ProfileDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["resume"]>

  export type ResumeSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    profile_id?: boolean
    file_path?: boolean
    created_at?: boolean
    profile?: boolean | ProfileDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["resume"]>

  export type ResumeSelectScalar = {
    id?: boolean
    profile_id?: boolean
    file_path?: boolean
    created_at?: boolean
  }

  export type ResumeOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "profile_id" | "file_path" | "created_at", ExtArgs["result"]["resume"]>
  export type ResumeInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    profile?: boolean | ProfileDefaultArgs<ExtArgs>
    applications?: boolean | Resume$applicationsArgs<ExtArgs>
    _count?: boolean | ResumeCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type ResumeIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    profile?: boolean | ProfileDefaultArgs<ExtArgs>
  }
  export type ResumeIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    profile?: boolean | ProfileDefaultArgs<ExtArgs>
  }

  export type $ResumePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Resume"
    objects: {
      profile: Prisma.$ProfilePayload<ExtArgs>
      applications: Prisma.$ApplicationPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: bigint
      profile_id: string
      file_path: string
      created_at: Date
    }, ExtArgs["result"]["resume"]>
    composites: {}
  }

  type ResumeGetPayload<S extends boolean | null | undefined | ResumeDefaultArgs> = $Result.GetResult<Prisma.$ResumePayload, S>

  type ResumeCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ResumeFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ResumeCountAggregateInputType | true
    }

  export interface ResumeDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Resume'], meta: { name: 'Resume' } }
    /**
     * Find zero or one Resume that matches the filter.
     * @param {ResumeFindUniqueArgs} args - Arguments to find a Resume
     * @example
     * // Get one Resume
     * const resume = await prisma.resume.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ResumeFindUniqueArgs>(args: SelectSubset<T, ResumeFindUniqueArgs<ExtArgs>>): Prisma__ResumeClient<$Result.GetResult<Prisma.$ResumePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Resume that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ResumeFindUniqueOrThrowArgs} args - Arguments to find a Resume
     * @example
     * // Get one Resume
     * const resume = await prisma.resume.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ResumeFindUniqueOrThrowArgs>(args: SelectSubset<T, ResumeFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ResumeClient<$Result.GetResult<Prisma.$ResumePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Resume that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ResumeFindFirstArgs} args - Arguments to find a Resume
     * @example
     * // Get one Resume
     * const resume = await prisma.resume.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ResumeFindFirstArgs>(args?: SelectSubset<T, ResumeFindFirstArgs<ExtArgs>>): Prisma__ResumeClient<$Result.GetResult<Prisma.$ResumePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Resume that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ResumeFindFirstOrThrowArgs} args - Arguments to find a Resume
     * @example
     * // Get one Resume
     * const resume = await prisma.resume.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ResumeFindFirstOrThrowArgs>(args?: SelectSubset<T, ResumeFindFirstOrThrowArgs<ExtArgs>>): Prisma__ResumeClient<$Result.GetResult<Prisma.$ResumePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Resumes that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ResumeFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Resumes
     * const resumes = await prisma.resume.findMany()
     * 
     * // Get first 10 Resumes
     * const resumes = await prisma.resume.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const resumeWithIdOnly = await prisma.resume.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ResumeFindManyArgs>(args?: SelectSubset<T, ResumeFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ResumePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Resume.
     * @param {ResumeCreateArgs} args - Arguments to create a Resume.
     * @example
     * // Create one Resume
     * const Resume = await prisma.resume.create({
     *   data: {
     *     // ... data to create a Resume
     *   }
     * })
     * 
     */
    create<T extends ResumeCreateArgs>(args: SelectSubset<T, ResumeCreateArgs<ExtArgs>>): Prisma__ResumeClient<$Result.GetResult<Prisma.$ResumePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Resumes.
     * @param {ResumeCreateManyArgs} args - Arguments to create many Resumes.
     * @example
     * // Create many Resumes
     * const resume = await prisma.resume.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ResumeCreateManyArgs>(args?: SelectSubset<T, ResumeCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Resumes and returns the data saved in the database.
     * @param {ResumeCreateManyAndReturnArgs} args - Arguments to create many Resumes.
     * @example
     * // Create many Resumes
     * const resume = await prisma.resume.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Resumes and only return the `id`
     * const resumeWithIdOnly = await prisma.resume.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ResumeCreateManyAndReturnArgs>(args?: SelectSubset<T, ResumeCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ResumePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Resume.
     * @param {ResumeDeleteArgs} args - Arguments to delete one Resume.
     * @example
     * // Delete one Resume
     * const Resume = await prisma.resume.delete({
     *   where: {
     *     // ... filter to delete one Resume
     *   }
     * })
     * 
     */
    delete<T extends ResumeDeleteArgs>(args: SelectSubset<T, ResumeDeleteArgs<ExtArgs>>): Prisma__ResumeClient<$Result.GetResult<Prisma.$ResumePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Resume.
     * @param {ResumeUpdateArgs} args - Arguments to update one Resume.
     * @example
     * // Update one Resume
     * const resume = await prisma.resume.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ResumeUpdateArgs>(args: SelectSubset<T, ResumeUpdateArgs<ExtArgs>>): Prisma__ResumeClient<$Result.GetResult<Prisma.$ResumePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Resumes.
     * @param {ResumeDeleteManyArgs} args - Arguments to filter Resumes to delete.
     * @example
     * // Delete a few Resumes
     * const { count } = await prisma.resume.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ResumeDeleteManyArgs>(args?: SelectSubset<T, ResumeDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Resumes.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ResumeUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Resumes
     * const resume = await prisma.resume.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ResumeUpdateManyArgs>(args: SelectSubset<T, ResumeUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Resumes and returns the data updated in the database.
     * @param {ResumeUpdateManyAndReturnArgs} args - Arguments to update many Resumes.
     * @example
     * // Update many Resumes
     * const resume = await prisma.resume.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Resumes and only return the `id`
     * const resumeWithIdOnly = await prisma.resume.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends ResumeUpdateManyAndReturnArgs>(args: SelectSubset<T, ResumeUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ResumePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Resume.
     * @param {ResumeUpsertArgs} args - Arguments to update or create a Resume.
     * @example
     * // Update or create a Resume
     * const resume = await prisma.resume.upsert({
     *   create: {
     *     // ... data to create a Resume
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Resume we want to update
     *   }
     * })
     */
    upsert<T extends ResumeUpsertArgs>(args: SelectSubset<T, ResumeUpsertArgs<ExtArgs>>): Prisma__ResumeClient<$Result.GetResult<Prisma.$ResumePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Resumes.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ResumeCountArgs} args - Arguments to filter Resumes to count.
     * @example
     * // Count the number of Resumes
     * const count = await prisma.resume.count({
     *   where: {
     *     // ... the filter for the Resumes we want to count
     *   }
     * })
    **/
    count<T extends ResumeCountArgs>(
      args?: Subset<T, ResumeCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ResumeCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Resume.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ResumeAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ResumeAggregateArgs>(args: Subset<T, ResumeAggregateArgs>): Prisma.PrismaPromise<GetResumeAggregateType<T>>

    /**
     * Group by Resume.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ResumeGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ResumeGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ResumeGroupByArgs['orderBy'] }
        : { orderBy?: ResumeGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ResumeGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetResumeGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Resume model
   */
  readonly fields: ResumeFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Resume.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ResumeClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    profile<T extends ProfileDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ProfileDefaultArgs<ExtArgs>>): Prisma__ProfileClient<$Result.GetResult<Prisma.$ProfilePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    applications<T extends Resume$applicationsArgs<ExtArgs> = {}>(args?: Subset<T, Resume$applicationsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ApplicationPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Resume model
   */
  interface ResumeFieldRefs {
    readonly id: FieldRef<"Resume", 'BigInt'>
    readonly profile_id: FieldRef<"Resume", 'String'>
    readonly file_path: FieldRef<"Resume", 'String'>
    readonly created_at: FieldRef<"Resume", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Resume findUnique
   */
  export type ResumeFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Resume
     */
    select?: ResumeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Resume
     */
    omit?: ResumeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ResumeInclude<ExtArgs> | null
    /**
     * Filter, which Resume to fetch.
     */
    where: ResumeWhereUniqueInput
  }

  /**
   * Resume findUniqueOrThrow
   */
  export type ResumeFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Resume
     */
    select?: ResumeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Resume
     */
    omit?: ResumeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ResumeInclude<ExtArgs> | null
    /**
     * Filter, which Resume to fetch.
     */
    where: ResumeWhereUniqueInput
  }

  /**
   * Resume findFirst
   */
  export type ResumeFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Resume
     */
    select?: ResumeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Resume
     */
    omit?: ResumeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ResumeInclude<ExtArgs> | null
    /**
     * Filter, which Resume to fetch.
     */
    where?: ResumeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Resumes to fetch.
     */
    orderBy?: ResumeOrderByWithRelationInput | ResumeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Resumes.
     */
    cursor?: ResumeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Resumes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Resumes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Resumes.
     */
    distinct?: ResumeScalarFieldEnum | ResumeScalarFieldEnum[]
  }

  /**
   * Resume findFirstOrThrow
   */
  export type ResumeFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Resume
     */
    select?: ResumeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Resume
     */
    omit?: ResumeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ResumeInclude<ExtArgs> | null
    /**
     * Filter, which Resume to fetch.
     */
    where?: ResumeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Resumes to fetch.
     */
    orderBy?: ResumeOrderByWithRelationInput | ResumeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Resumes.
     */
    cursor?: ResumeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Resumes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Resumes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Resumes.
     */
    distinct?: ResumeScalarFieldEnum | ResumeScalarFieldEnum[]
  }

  /**
   * Resume findMany
   */
  export type ResumeFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Resume
     */
    select?: ResumeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Resume
     */
    omit?: ResumeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ResumeInclude<ExtArgs> | null
    /**
     * Filter, which Resumes to fetch.
     */
    where?: ResumeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Resumes to fetch.
     */
    orderBy?: ResumeOrderByWithRelationInput | ResumeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Resumes.
     */
    cursor?: ResumeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Resumes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Resumes.
     */
    skip?: number
    distinct?: ResumeScalarFieldEnum | ResumeScalarFieldEnum[]
  }

  /**
   * Resume create
   */
  export type ResumeCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Resume
     */
    select?: ResumeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Resume
     */
    omit?: ResumeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ResumeInclude<ExtArgs> | null
    /**
     * The data needed to create a Resume.
     */
    data: XOR<ResumeCreateInput, ResumeUncheckedCreateInput>
  }

  /**
   * Resume createMany
   */
  export type ResumeCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Resumes.
     */
    data: ResumeCreateManyInput | ResumeCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Resume createManyAndReturn
   */
  export type ResumeCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Resume
     */
    select?: ResumeSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Resume
     */
    omit?: ResumeOmit<ExtArgs> | null
    /**
     * The data used to create many Resumes.
     */
    data: ResumeCreateManyInput | ResumeCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ResumeIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Resume update
   */
  export type ResumeUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Resume
     */
    select?: ResumeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Resume
     */
    omit?: ResumeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ResumeInclude<ExtArgs> | null
    /**
     * The data needed to update a Resume.
     */
    data: XOR<ResumeUpdateInput, ResumeUncheckedUpdateInput>
    /**
     * Choose, which Resume to update.
     */
    where: ResumeWhereUniqueInput
  }

  /**
   * Resume updateMany
   */
  export type ResumeUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Resumes.
     */
    data: XOR<ResumeUpdateManyMutationInput, ResumeUncheckedUpdateManyInput>
    /**
     * Filter which Resumes to update
     */
    where?: ResumeWhereInput
    /**
     * Limit how many Resumes to update.
     */
    limit?: number
  }

  /**
   * Resume updateManyAndReturn
   */
  export type ResumeUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Resume
     */
    select?: ResumeSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Resume
     */
    omit?: ResumeOmit<ExtArgs> | null
    /**
     * The data used to update Resumes.
     */
    data: XOR<ResumeUpdateManyMutationInput, ResumeUncheckedUpdateManyInput>
    /**
     * Filter which Resumes to update
     */
    where?: ResumeWhereInput
    /**
     * Limit how many Resumes to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ResumeIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Resume upsert
   */
  export type ResumeUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Resume
     */
    select?: ResumeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Resume
     */
    omit?: ResumeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ResumeInclude<ExtArgs> | null
    /**
     * The filter to search for the Resume to update in case it exists.
     */
    where: ResumeWhereUniqueInput
    /**
     * In case the Resume found by the `where` argument doesn't exist, create a new Resume with this data.
     */
    create: XOR<ResumeCreateInput, ResumeUncheckedCreateInput>
    /**
     * In case the Resume was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ResumeUpdateInput, ResumeUncheckedUpdateInput>
  }

  /**
   * Resume delete
   */
  export type ResumeDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Resume
     */
    select?: ResumeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Resume
     */
    omit?: ResumeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ResumeInclude<ExtArgs> | null
    /**
     * Filter which Resume to delete.
     */
    where: ResumeWhereUniqueInput
  }

  /**
   * Resume deleteMany
   */
  export type ResumeDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Resumes to delete
     */
    where?: ResumeWhereInput
    /**
     * Limit how many Resumes to delete.
     */
    limit?: number
  }

  /**
   * Resume.applications
   */
  export type Resume$applicationsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Application
     */
    select?: ApplicationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Application
     */
    omit?: ApplicationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ApplicationInclude<ExtArgs> | null
    where?: ApplicationWhereInput
    orderBy?: ApplicationOrderByWithRelationInput | ApplicationOrderByWithRelationInput[]
    cursor?: ApplicationWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ApplicationScalarFieldEnum | ApplicationScalarFieldEnum[]
  }

  /**
   * Resume without action
   */
  export type ResumeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Resume
     */
    select?: ResumeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Resume
     */
    omit?: ResumeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ResumeInclude<ExtArgs> | null
  }


  /**
   * Model Sponsor
   */

  export type AggregateSponsor = {
    _count: SponsorCountAggregateOutputType | null
    _avg: SponsorAvgAggregateOutputType | null
    _sum: SponsorSumAggregateOutputType | null
    _min: SponsorMinAggregateOutputType | null
    _max: SponsorMaxAggregateOutputType | null
  }

  export type SponsorAvgAggregateOutputType = {
    id: number | null
  }

  export type SponsorSumAggregateOutputType = {
    id: bigint | null
  }

  export type SponsorMinAggregateOutputType = {
    id: bigint | null
    name: string | null
    logo_url: string | null
    website_url: string | null
    tier: $Enums.sponsor_tier_enum | null
    created_at: Date | null
  }

  export type SponsorMaxAggregateOutputType = {
    id: bigint | null
    name: string | null
    logo_url: string | null
    website_url: string | null
    tier: $Enums.sponsor_tier_enum | null
    created_at: Date | null
  }

  export type SponsorCountAggregateOutputType = {
    id: number
    name: number
    logo_url: number
    website_url: number
    tier: number
    created_at: number
    _all: number
  }


  export type SponsorAvgAggregateInputType = {
    id?: true
  }

  export type SponsorSumAggregateInputType = {
    id?: true
  }

  export type SponsorMinAggregateInputType = {
    id?: true
    name?: true
    logo_url?: true
    website_url?: true
    tier?: true
    created_at?: true
  }

  export type SponsorMaxAggregateInputType = {
    id?: true
    name?: true
    logo_url?: true
    website_url?: true
    tier?: true
    created_at?: true
  }

  export type SponsorCountAggregateInputType = {
    id?: true
    name?: true
    logo_url?: true
    website_url?: true
    tier?: true
    created_at?: true
    _all?: true
  }

  export type SponsorAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Sponsor to aggregate.
     */
    where?: SponsorWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Sponsors to fetch.
     */
    orderBy?: SponsorOrderByWithRelationInput | SponsorOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: SponsorWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Sponsors from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Sponsors.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Sponsors
    **/
    _count?: true | SponsorCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: SponsorAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: SponsorSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: SponsorMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: SponsorMaxAggregateInputType
  }

  export type GetSponsorAggregateType<T extends SponsorAggregateArgs> = {
        [P in keyof T & keyof AggregateSponsor]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateSponsor[P]>
      : GetScalarType<T[P], AggregateSponsor[P]>
  }




  export type SponsorGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SponsorWhereInput
    orderBy?: SponsorOrderByWithAggregationInput | SponsorOrderByWithAggregationInput[]
    by: SponsorScalarFieldEnum[] | SponsorScalarFieldEnum
    having?: SponsorScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: SponsorCountAggregateInputType | true
    _avg?: SponsorAvgAggregateInputType
    _sum?: SponsorSumAggregateInputType
    _min?: SponsorMinAggregateInputType
    _max?: SponsorMaxAggregateInputType
  }

  export type SponsorGroupByOutputType = {
    id: bigint
    name: string
    logo_url: string
    website_url: string
    tier: $Enums.sponsor_tier_enum
    created_at: Date
    _count: SponsorCountAggregateOutputType | null
    _avg: SponsorAvgAggregateOutputType | null
    _sum: SponsorSumAggregateOutputType | null
    _min: SponsorMinAggregateOutputType | null
    _max: SponsorMaxAggregateOutputType | null
  }

  type GetSponsorGroupByPayload<T extends SponsorGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<SponsorGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof SponsorGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], SponsorGroupByOutputType[P]>
            : GetScalarType<T[P], SponsorGroupByOutputType[P]>
        }
      >
    >


  export type SponsorSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    logo_url?: boolean
    website_url?: boolean
    tier?: boolean
    created_at?: boolean
  }, ExtArgs["result"]["sponsor"]>

  export type SponsorSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    logo_url?: boolean
    website_url?: boolean
    tier?: boolean
    created_at?: boolean
  }, ExtArgs["result"]["sponsor"]>

  export type SponsorSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    logo_url?: boolean
    website_url?: boolean
    tier?: boolean
    created_at?: boolean
  }, ExtArgs["result"]["sponsor"]>

  export type SponsorSelectScalar = {
    id?: boolean
    name?: boolean
    logo_url?: boolean
    website_url?: boolean
    tier?: boolean
    created_at?: boolean
  }

  export type SponsorOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "logo_url" | "website_url" | "tier" | "created_at", ExtArgs["result"]["sponsor"]>

  export type $SponsorPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Sponsor"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: bigint
      name: string
      logo_url: string
      website_url: string
      tier: $Enums.sponsor_tier_enum
      created_at: Date
    }, ExtArgs["result"]["sponsor"]>
    composites: {}
  }

  type SponsorGetPayload<S extends boolean | null | undefined | SponsorDefaultArgs> = $Result.GetResult<Prisma.$SponsorPayload, S>

  type SponsorCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<SponsorFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: SponsorCountAggregateInputType | true
    }

  export interface SponsorDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Sponsor'], meta: { name: 'Sponsor' } }
    /**
     * Find zero or one Sponsor that matches the filter.
     * @param {SponsorFindUniqueArgs} args - Arguments to find a Sponsor
     * @example
     * // Get one Sponsor
     * const sponsor = await prisma.sponsor.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends SponsorFindUniqueArgs>(args: SelectSubset<T, SponsorFindUniqueArgs<ExtArgs>>): Prisma__SponsorClient<$Result.GetResult<Prisma.$SponsorPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Sponsor that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {SponsorFindUniqueOrThrowArgs} args - Arguments to find a Sponsor
     * @example
     * // Get one Sponsor
     * const sponsor = await prisma.sponsor.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends SponsorFindUniqueOrThrowArgs>(args: SelectSubset<T, SponsorFindUniqueOrThrowArgs<ExtArgs>>): Prisma__SponsorClient<$Result.GetResult<Prisma.$SponsorPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Sponsor that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SponsorFindFirstArgs} args - Arguments to find a Sponsor
     * @example
     * // Get one Sponsor
     * const sponsor = await prisma.sponsor.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends SponsorFindFirstArgs>(args?: SelectSubset<T, SponsorFindFirstArgs<ExtArgs>>): Prisma__SponsorClient<$Result.GetResult<Prisma.$SponsorPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Sponsor that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SponsorFindFirstOrThrowArgs} args - Arguments to find a Sponsor
     * @example
     * // Get one Sponsor
     * const sponsor = await prisma.sponsor.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends SponsorFindFirstOrThrowArgs>(args?: SelectSubset<T, SponsorFindFirstOrThrowArgs<ExtArgs>>): Prisma__SponsorClient<$Result.GetResult<Prisma.$SponsorPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Sponsors that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SponsorFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Sponsors
     * const sponsors = await prisma.sponsor.findMany()
     * 
     * // Get first 10 Sponsors
     * const sponsors = await prisma.sponsor.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const sponsorWithIdOnly = await prisma.sponsor.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends SponsorFindManyArgs>(args?: SelectSubset<T, SponsorFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SponsorPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Sponsor.
     * @param {SponsorCreateArgs} args - Arguments to create a Sponsor.
     * @example
     * // Create one Sponsor
     * const Sponsor = await prisma.sponsor.create({
     *   data: {
     *     // ... data to create a Sponsor
     *   }
     * })
     * 
     */
    create<T extends SponsorCreateArgs>(args: SelectSubset<T, SponsorCreateArgs<ExtArgs>>): Prisma__SponsorClient<$Result.GetResult<Prisma.$SponsorPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Sponsors.
     * @param {SponsorCreateManyArgs} args - Arguments to create many Sponsors.
     * @example
     * // Create many Sponsors
     * const sponsor = await prisma.sponsor.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends SponsorCreateManyArgs>(args?: SelectSubset<T, SponsorCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Sponsors and returns the data saved in the database.
     * @param {SponsorCreateManyAndReturnArgs} args - Arguments to create many Sponsors.
     * @example
     * // Create many Sponsors
     * const sponsor = await prisma.sponsor.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Sponsors and only return the `id`
     * const sponsorWithIdOnly = await prisma.sponsor.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends SponsorCreateManyAndReturnArgs>(args?: SelectSubset<T, SponsorCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SponsorPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Sponsor.
     * @param {SponsorDeleteArgs} args - Arguments to delete one Sponsor.
     * @example
     * // Delete one Sponsor
     * const Sponsor = await prisma.sponsor.delete({
     *   where: {
     *     // ... filter to delete one Sponsor
     *   }
     * })
     * 
     */
    delete<T extends SponsorDeleteArgs>(args: SelectSubset<T, SponsorDeleteArgs<ExtArgs>>): Prisma__SponsorClient<$Result.GetResult<Prisma.$SponsorPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Sponsor.
     * @param {SponsorUpdateArgs} args - Arguments to update one Sponsor.
     * @example
     * // Update one Sponsor
     * const sponsor = await prisma.sponsor.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends SponsorUpdateArgs>(args: SelectSubset<T, SponsorUpdateArgs<ExtArgs>>): Prisma__SponsorClient<$Result.GetResult<Prisma.$SponsorPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Sponsors.
     * @param {SponsorDeleteManyArgs} args - Arguments to filter Sponsors to delete.
     * @example
     * // Delete a few Sponsors
     * const { count } = await prisma.sponsor.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends SponsorDeleteManyArgs>(args?: SelectSubset<T, SponsorDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Sponsors.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SponsorUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Sponsors
     * const sponsor = await prisma.sponsor.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends SponsorUpdateManyArgs>(args: SelectSubset<T, SponsorUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Sponsors and returns the data updated in the database.
     * @param {SponsorUpdateManyAndReturnArgs} args - Arguments to update many Sponsors.
     * @example
     * // Update many Sponsors
     * const sponsor = await prisma.sponsor.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Sponsors and only return the `id`
     * const sponsorWithIdOnly = await prisma.sponsor.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends SponsorUpdateManyAndReturnArgs>(args: SelectSubset<T, SponsorUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SponsorPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Sponsor.
     * @param {SponsorUpsertArgs} args - Arguments to update or create a Sponsor.
     * @example
     * // Update or create a Sponsor
     * const sponsor = await prisma.sponsor.upsert({
     *   create: {
     *     // ... data to create a Sponsor
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Sponsor we want to update
     *   }
     * })
     */
    upsert<T extends SponsorUpsertArgs>(args: SelectSubset<T, SponsorUpsertArgs<ExtArgs>>): Prisma__SponsorClient<$Result.GetResult<Prisma.$SponsorPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Sponsors.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SponsorCountArgs} args - Arguments to filter Sponsors to count.
     * @example
     * // Count the number of Sponsors
     * const count = await prisma.sponsor.count({
     *   where: {
     *     // ... the filter for the Sponsors we want to count
     *   }
     * })
    **/
    count<T extends SponsorCountArgs>(
      args?: Subset<T, SponsorCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], SponsorCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Sponsor.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SponsorAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends SponsorAggregateArgs>(args: Subset<T, SponsorAggregateArgs>): Prisma.PrismaPromise<GetSponsorAggregateType<T>>

    /**
     * Group by Sponsor.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SponsorGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends SponsorGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: SponsorGroupByArgs['orderBy'] }
        : { orderBy?: SponsorGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, SponsorGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetSponsorGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Sponsor model
   */
  readonly fields: SponsorFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Sponsor.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__SponsorClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Sponsor model
   */
  interface SponsorFieldRefs {
    readonly id: FieldRef<"Sponsor", 'BigInt'>
    readonly name: FieldRef<"Sponsor", 'String'>
    readonly logo_url: FieldRef<"Sponsor", 'String'>
    readonly website_url: FieldRef<"Sponsor", 'String'>
    readonly tier: FieldRef<"Sponsor", 'sponsor_tier_enum'>
    readonly created_at: FieldRef<"Sponsor", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Sponsor findUnique
   */
  export type SponsorFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Sponsor
     */
    select?: SponsorSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Sponsor
     */
    omit?: SponsorOmit<ExtArgs> | null
    /**
     * Filter, which Sponsor to fetch.
     */
    where: SponsorWhereUniqueInput
  }

  /**
   * Sponsor findUniqueOrThrow
   */
  export type SponsorFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Sponsor
     */
    select?: SponsorSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Sponsor
     */
    omit?: SponsorOmit<ExtArgs> | null
    /**
     * Filter, which Sponsor to fetch.
     */
    where: SponsorWhereUniqueInput
  }

  /**
   * Sponsor findFirst
   */
  export type SponsorFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Sponsor
     */
    select?: SponsorSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Sponsor
     */
    omit?: SponsorOmit<ExtArgs> | null
    /**
     * Filter, which Sponsor to fetch.
     */
    where?: SponsorWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Sponsors to fetch.
     */
    orderBy?: SponsorOrderByWithRelationInput | SponsorOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Sponsors.
     */
    cursor?: SponsorWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Sponsors from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Sponsors.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Sponsors.
     */
    distinct?: SponsorScalarFieldEnum | SponsorScalarFieldEnum[]
  }

  /**
   * Sponsor findFirstOrThrow
   */
  export type SponsorFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Sponsor
     */
    select?: SponsorSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Sponsor
     */
    omit?: SponsorOmit<ExtArgs> | null
    /**
     * Filter, which Sponsor to fetch.
     */
    where?: SponsorWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Sponsors to fetch.
     */
    orderBy?: SponsorOrderByWithRelationInput | SponsorOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Sponsors.
     */
    cursor?: SponsorWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Sponsors from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Sponsors.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Sponsors.
     */
    distinct?: SponsorScalarFieldEnum | SponsorScalarFieldEnum[]
  }

  /**
   * Sponsor findMany
   */
  export type SponsorFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Sponsor
     */
    select?: SponsorSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Sponsor
     */
    omit?: SponsorOmit<ExtArgs> | null
    /**
     * Filter, which Sponsors to fetch.
     */
    where?: SponsorWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Sponsors to fetch.
     */
    orderBy?: SponsorOrderByWithRelationInput | SponsorOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Sponsors.
     */
    cursor?: SponsorWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Sponsors from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Sponsors.
     */
    skip?: number
    distinct?: SponsorScalarFieldEnum | SponsorScalarFieldEnum[]
  }

  /**
   * Sponsor create
   */
  export type SponsorCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Sponsor
     */
    select?: SponsorSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Sponsor
     */
    omit?: SponsorOmit<ExtArgs> | null
    /**
     * The data needed to create a Sponsor.
     */
    data: XOR<SponsorCreateInput, SponsorUncheckedCreateInput>
  }

  /**
   * Sponsor createMany
   */
  export type SponsorCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Sponsors.
     */
    data: SponsorCreateManyInput | SponsorCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Sponsor createManyAndReturn
   */
  export type SponsorCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Sponsor
     */
    select?: SponsorSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Sponsor
     */
    omit?: SponsorOmit<ExtArgs> | null
    /**
     * The data used to create many Sponsors.
     */
    data: SponsorCreateManyInput | SponsorCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Sponsor update
   */
  export type SponsorUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Sponsor
     */
    select?: SponsorSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Sponsor
     */
    omit?: SponsorOmit<ExtArgs> | null
    /**
     * The data needed to update a Sponsor.
     */
    data: XOR<SponsorUpdateInput, SponsorUncheckedUpdateInput>
    /**
     * Choose, which Sponsor to update.
     */
    where: SponsorWhereUniqueInput
  }

  /**
   * Sponsor updateMany
   */
  export type SponsorUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Sponsors.
     */
    data: XOR<SponsorUpdateManyMutationInput, SponsorUncheckedUpdateManyInput>
    /**
     * Filter which Sponsors to update
     */
    where?: SponsorWhereInput
    /**
     * Limit how many Sponsors to update.
     */
    limit?: number
  }

  /**
   * Sponsor updateManyAndReturn
   */
  export type SponsorUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Sponsor
     */
    select?: SponsorSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Sponsor
     */
    omit?: SponsorOmit<ExtArgs> | null
    /**
     * The data used to update Sponsors.
     */
    data: XOR<SponsorUpdateManyMutationInput, SponsorUncheckedUpdateManyInput>
    /**
     * Filter which Sponsors to update
     */
    where?: SponsorWhereInput
    /**
     * Limit how many Sponsors to update.
     */
    limit?: number
  }

  /**
   * Sponsor upsert
   */
  export type SponsorUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Sponsor
     */
    select?: SponsorSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Sponsor
     */
    omit?: SponsorOmit<ExtArgs> | null
    /**
     * The filter to search for the Sponsor to update in case it exists.
     */
    where: SponsorWhereUniqueInput
    /**
     * In case the Sponsor found by the `where` argument doesn't exist, create a new Sponsor with this data.
     */
    create: XOR<SponsorCreateInput, SponsorUncheckedCreateInput>
    /**
     * In case the Sponsor was found with the provided `where` argument, update it with this data.
     */
    update: XOR<SponsorUpdateInput, SponsorUncheckedUpdateInput>
  }

  /**
   * Sponsor delete
   */
  export type SponsorDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Sponsor
     */
    select?: SponsorSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Sponsor
     */
    omit?: SponsorOmit<ExtArgs> | null
    /**
     * Filter which Sponsor to delete.
     */
    where: SponsorWhereUniqueInput
  }

  /**
   * Sponsor deleteMany
   */
  export type SponsorDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Sponsors to delete
     */
    where?: SponsorWhereInput
    /**
     * Limit how many Sponsors to delete.
     */
    limit?: number
  }

  /**
   * Sponsor without action
   */
  export type SponsorDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Sponsor
     */
    select?: SponsorSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Sponsor
     */
    omit?: SponsorOmit<ExtArgs> | null
  }


  /**
   * Model TeamMember
   */

  export type AggregateTeamMember = {
    _count: TeamMemberCountAggregateOutputType | null
    _avg: TeamMemberAvgAggregateOutputType | null
    _sum: TeamMemberSumAggregateOutputType | null
    _min: TeamMemberMinAggregateOutputType | null
    _max: TeamMemberMaxAggregateOutputType | null
  }

  export type TeamMemberAvgAggregateOutputType = {
    id: number | null
    team_id: number | null
  }

  export type TeamMemberSumAggregateOutputType = {
    id: bigint | null
    team_id: bigint | null
  }

  export type TeamMemberMinAggregateOutputType = {
    id: bigint | null
    team_id: bigint | null
    profile_id: string | null
    role: $Enums.team_role_enum | null
    created_at: Date | null
    joined_at: Date | null
  }

  export type TeamMemberMaxAggregateOutputType = {
    id: bigint | null
    team_id: bigint | null
    profile_id: string | null
    role: $Enums.team_role_enum | null
    created_at: Date | null
    joined_at: Date | null
  }

  export type TeamMemberCountAggregateOutputType = {
    id: number
    team_id: number
    profile_id: number
    role: number
    created_at: number
    joined_at: number
    _all: number
  }


  export type TeamMemberAvgAggregateInputType = {
    id?: true
    team_id?: true
  }

  export type TeamMemberSumAggregateInputType = {
    id?: true
    team_id?: true
  }

  export type TeamMemberMinAggregateInputType = {
    id?: true
    team_id?: true
    profile_id?: true
    role?: true
    created_at?: true
    joined_at?: true
  }

  export type TeamMemberMaxAggregateInputType = {
    id?: true
    team_id?: true
    profile_id?: true
    role?: true
    created_at?: true
    joined_at?: true
  }

  export type TeamMemberCountAggregateInputType = {
    id?: true
    team_id?: true
    profile_id?: true
    role?: true
    created_at?: true
    joined_at?: true
    _all?: true
  }

  export type TeamMemberAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which TeamMember to aggregate.
     */
    where?: TeamMemberWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TeamMembers to fetch.
     */
    orderBy?: TeamMemberOrderByWithRelationInput | TeamMemberOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: TeamMemberWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TeamMembers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TeamMembers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned TeamMembers
    **/
    _count?: true | TeamMemberCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: TeamMemberAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: TeamMemberSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: TeamMemberMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: TeamMemberMaxAggregateInputType
  }

  export type GetTeamMemberAggregateType<T extends TeamMemberAggregateArgs> = {
        [P in keyof T & keyof AggregateTeamMember]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateTeamMember[P]>
      : GetScalarType<T[P], AggregateTeamMember[P]>
  }




  export type TeamMemberGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TeamMemberWhereInput
    orderBy?: TeamMemberOrderByWithAggregationInput | TeamMemberOrderByWithAggregationInput[]
    by: TeamMemberScalarFieldEnum[] | TeamMemberScalarFieldEnum
    having?: TeamMemberScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: TeamMemberCountAggregateInputType | true
    _avg?: TeamMemberAvgAggregateInputType
    _sum?: TeamMemberSumAggregateInputType
    _min?: TeamMemberMinAggregateInputType
    _max?: TeamMemberMaxAggregateInputType
  }

  export type TeamMemberGroupByOutputType = {
    id: bigint
    team_id: bigint
    profile_id: string
    role: $Enums.team_role_enum
    created_at: Date
    joined_at: Date
    _count: TeamMemberCountAggregateOutputType | null
    _avg: TeamMemberAvgAggregateOutputType | null
    _sum: TeamMemberSumAggregateOutputType | null
    _min: TeamMemberMinAggregateOutputType | null
    _max: TeamMemberMaxAggregateOutputType | null
  }

  type GetTeamMemberGroupByPayload<T extends TeamMemberGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<TeamMemberGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof TeamMemberGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], TeamMemberGroupByOutputType[P]>
            : GetScalarType<T[P], TeamMemberGroupByOutputType[P]>
        }
      >
    >


  export type TeamMemberSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    team_id?: boolean
    profile_id?: boolean
    role?: boolean
    created_at?: boolean
    joined_at?: boolean
    team?: boolean | TeamDefaultArgs<ExtArgs>
    profile?: boolean | ProfileDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["teamMember"]>

  export type TeamMemberSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    team_id?: boolean
    profile_id?: boolean
    role?: boolean
    created_at?: boolean
    joined_at?: boolean
    team?: boolean | TeamDefaultArgs<ExtArgs>
    profile?: boolean | ProfileDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["teamMember"]>

  export type TeamMemberSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    team_id?: boolean
    profile_id?: boolean
    role?: boolean
    created_at?: boolean
    joined_at?: boolean
    team?: boolean | TeamDefaultArgs<ExtArgs>
    profile?: boolean | ProfileDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["teamMember"]>

  export type TeamMemberSelectScalar = {
    id?: boolean
    team_id?: boolean
    profile_id?: boolean
    role?: boolean
    created_at?: boolean
    joined_at?: boolean
  }

  export type TeamMemberOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "team_id" | "profile_id" | "role" | "created_at" | "joined_at", ExtArgs["result"]["teamMember"]>
  export type TeamMemberInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    team?: boolean | TeamDefaultArgs<ExtArgs>
    profile?: boolean | ProfileDefaultArgs<ExtArgs>
  }
  export type TeamMemberIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    team?: boolean | TeamDefaultArgs<ExtArgs>
    profile?: boolean | ProfileDefaultArgs<ExtArgs>
  }
  export type TeamMemberIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    team?: boolean | TeamDefaultArgs<ExtArgs>
    profile?: boolean | ProfileDefaultArgs<ExtArgs>
  }

  export type $TeamMemberPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "TeamMember"
    objects: {
      team: Prisma.$TeamPayload<ExtArgs>
      profile: Prisma.$ProfilePayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: bigint
      team_id: bigint
      profile_id: string
      role: $Enums.team_role_enum
      created_at: Date
      joined_at: Date
    }, ExtArgs["result"]["teamMember"]>
    composites: {}
  }

  type TeamMemberGetPayload<S extends boolean | null | undefined | TeamMemberDefaultArgs> = $Result.GetResult<Prisma.$TeamMemberPayload, S>

  type TeamMemberCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<TeamMemberFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: TeamMemberCountAggregateInputType | true
    }

  export interface TeamMemberDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['TeamMember'], meta: { name: 'TeamMember' } }
    /**
     * Find zero or one TeamMember that matches the filter.
     * @param {TeamMemberFindUniqueArgs} args - Arguments to find a TeamMember
     * @example
     * // Get one TeamMember
     * const teamMember = await prisma.teamMember.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends TeamMemberFindUniqueArgs>(args: SelectSubset<T, TeamMemberFindUniqueArgs<ExtArgs>>): Prisma__TeamMemberClient<$Result.GetResult<Prisma.$TeamMemberPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one TeamMember that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {TeamMemberFindUniqueOrThrowArgs} args - Arguments to find a TeamMember
     * @example
     * // Get one TeamMember
     * const teamMember = await prisma.teamMember.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends TeamMemberFindUniqueOrThrowArgs>(args: SelectSubset<T, TeamMemberFindUniqueOrThrowArgs<ExtArgs>>): Prisma__TeamMemberClient<$Result.GetResult<Prisma.$TeamMemberPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first TeamMember that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TeamMemberFindFirstArgs} args - Arguments to find a TeamMember
     * @example
     * // Get one TeamMember
     * const teamMember = await prisma.teamMember.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends TeamMemberFindFirstArgs>(args?: SelectSubset<T, TeamMemberFindFirstArgs<ExtArgs>>): Prisma__TeamMemberClient<$Result.GetResult<Prisma.$TeamMemberPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first TeamMember that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TeamMemberFindFirstOrThrowArgs} args - Arguments to find a TeamMember
     * @example
     * // Get one TeamMember
     * const teamMember = await prisma.teamMember.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends TeamMemberFindFirstOrThrowArgs>(args?: SelectSubset<T, TeamMemberFindFirstOrThrowArgs<ExtArgs>>): Prisma__TeamMemberClient<$Result.GetResult<Prisma.$TeamMemberPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more TeamMembers that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TeamMemberFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all TeamMembers
     * const teamMembers = await prisma.teamMember.findMany()
     * 
     * // Get first 10 TeamMembers
     * const teamMembers = await prisma.teamMember.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const teamMemberWithIdOnly = await prisma.teamMember.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends TeamMemberFindManyArgs>(args?: SelectSubset<T, TeamMemberFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TeamMemberPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a TeamMember.
     * @param {TeamMemberCreateArgs} args - Arguments to create a TeamMember.
     * @example
     * // Create one TeamMember
     * const TeamMember = await prisma.teamMember.create({
     *   data: {
     *     // ... data to create a TeamMember
     *   }
     * })
     * 
     */
    create<T extends TeamMemberCreateArgs>(args: SelectSubset<T, TeamMemberCreateArgs<ExtArgs>>): Prisma__TeamMemberClient<$Result.GetResult<Prisma.$TeamMemberPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many TeamMembers.
     * @param {TeamMemberCreateManyArgs} args - Arguments to create many TeamMembers.
     * @example
     * // Create many TeamMembers
     * const teamMember = await prisma.teamMember.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends TeamMemberCreateManyArgs>(args?: SelectSubset<T, TeamMemberCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many TeamMembers and returns the data saved in the database.
     * @param {TeamMemberCreateManyAndReturnArgs} args - Arguments to create many TeamMembers.
     * @example
     * // Create many TeamMembers
     * const teamMember = await prisma.teamMember.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many TeamMembers and only return the `id`
     * const teamMemberWithIdOnly = await prisma.teamMember.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends TeamMemberCreateManyAndReturnArgs>(args?: SelectSubset<T, TeamMemberCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TeamMemberPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a TeamMember.
     * @param {TeamMemberDeleteArgs} args - Arguments to delete one TeamMember.
     * @example
     * // Delete one TeamMember
     * const TeamMember = await prisma.teamMember.delete({
     *   where: {
     *     // ... filter to delete one TeamMember
     *   }
     * })
     * 
     */
    delete<T extends TeamMemberDeleteArgs>(args: SelectSubset<T, TeamMemberDeleteArgs<ExtArgs>>): Prisma__TeamMemberClient<$Result.GetResult<Prisma.$TeamMemberPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one TeamMember.
     * @param {TeamMemberUpdateArgs} args - Arguments to update one TeamMember.
     * @example
     * // Update one TeamMember
     * const teamMember = await prisma.teamMember.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends TeamMemberUpdateArgs>(args: SelectSubset<T, TeamMemberUpdateArgs<ExtArgs>>): Prisma__TeamMemberClient<$Result.GetResult<Prisma.$TeamMemberPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more TeamMembers.
     * @param {TeamMemberDeleteManyArgs} args - Arguments to filter TeamMembers to delete.
     * @example
     * // Delete a few TeamMembers
     * const { count } = await prisma.teamMember.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends TeamMemberDeleteManyArgs>(args?: SelectSubset<T, TeamMemberDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more TeamMembers.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TeamMemberUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many TeamMembers
     * const teamMember = await prisma.teamMember.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends TeamMemberUpdateManyArgs>(args: SelectSubset<T, TeamMemberUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more TeamMembers and returns the data updated in the database.
     * @param {TeamMemberUpdateManyAndReturnArgs} args - Arguments to update many TeamMembers.
     * @example
     * // Update many TeamMembers
     * const teamMember = await prisma.teamMember.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more TeamMembers and only return the `id`
     * const teamMemberWithIdOnly = await prisma.teamMember.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends TeamMemberUpdateManyAndReturnArgs>(args: SelectSubset<T, TeamMemberUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TeamMemberPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one TeamMember.
     * @param {TeamMemberUpsertArgs} args - Arguments to update or create a TeamMember.
     * @example
     * // Update or create a TeamMember
     * const teamMember = await prisma.teamMember.upsert({
     *   create: {
     *     // ... data to create a TeamMember
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the TeamMember we want to update
     *   }
     * })
     */
    upsert<T extends TeamMemberUpsertArgs>(args: SelectSubset<T, TeamMemberUpsertArgs<ExtArgs>>): Prisma__TeamMemberClient<$Result.GetResult<Prisma.$TeamMemberPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of TeamMembers.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TeamMemberCountArgs} args - Arguments to filter TeamMembers to count.
     * @example
     * // Count the number of TeamMembers
     * const count = await prisma.teamMember.count({
     *   where: {
     *     // ... the filter for the TeamMembers we want to count
     *   }
     * })
    **/
    count<T extends TeamMemberCountArgs>(
      args?: Subset<T, TeamMemberCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], TeamMemberCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a TeamMember.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TeamMemberAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends TeamMemberAggregateArgs>(args: Subset<T, TeamMemberAggregateArgs>): Prisma.PrismaPromise<GetTeamMemberAggregateType<T>>

    /**
     * Group by TeamMember.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TeamMemberGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends TeamMemberGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: TeamMemberGroupByArgs['orderBy'] }
        : { orderBy?: TeamMemberGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, TeamMemberGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetTeamMemberGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the TeamMember model
   */
  readonly fields: TeamMemberFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for TeamMember.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__TeamMemberClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    team<T extends TeamDefaultArgs<ExtArgs> = {}>(args?: Subset<T, TeamDefaultArgs<ExtArgs>>): Prisma__TeamClient<$Result.GetResult<Prisma.$TeamPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    profile<T extends ProfileDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ProfileDefaultArgs<ExtArgs>>): Prisma__ProfileClient<$Result.GetResult<Prisma.$ProfilePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the TeamMember model
   */
  interface TeamMemberFieldRefs {
    readonly id: FieldRef<"TeamMember", 'BigInt'>
    readonly team_id: FieldRef<"TeamMember", 'BigInt'>
    readonly profile_id: FieldRef<"TeamMember", 'String'>
    readonly role: FieldRef<"TeamMember", 'team_role_enum'>
    readonly created_at: FieldRef<"TeamMember", 'DateTime'>
    readonly joined_at: FieldRef<"TeamMember", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * TeamMember findUnique
   */
  export type TeamMemberFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TeamMember
     */
    select?: TeamMemberSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TeamMember
     */
    omit?: TeamMemberOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TeamMemberInclude<ExtArgs> | null
    /**
     * Filter, which TeamMember to fetch.
     */
    where: TeamMemberWhereUniqueInput
  }

  /**
   * TeamMember findUniqueOrThrow
   */
  export type TeamMemberFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TeamMember
     */
    select?: TeamMemberSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TeamMember
     */
    omit?: TeamMemberOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TeamMemberInclude<ExtArgs> | null
    /**
     * Filter, which TeamMember to fetch.
     */
    where: TeamMemberWhereUniqueInput
  }

  /**
   * TeamMember findFirst
   */
  export type TeamMemberFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TeamMember
     */
    select?: TeamMemberSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TeamMember
     */
    omit?: TeamMemberOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TeamMemberInclude<ExtArgs> | null
    /**
     * Filter, which TeamMember to fetch.
     */
    where?: TeamMemberWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TeamMembers to fetch.
     */
    orderBy?: TeamMemberOrderByWithRelationInput | TeamMemberOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for TeamMembers.
     */
    cursor?: TeamMemberWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TeamMembers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TeamMembers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of TeamMembers.
     */
    distinct?: TeamMemberScalarFieldEnum | TeamMemberScalarFieldEnum[]
  }

  /**
   * TeamMember findFirstOrThrow
   */
  export type TeamMemberFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TeamMember
     */
    select?: TeamMemberSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TeamMember
     */
    omit?: TeamMemberOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TeamMemberInclude<ExtArgs> | null
    /**
     * Filter, which TeamMember to fetch.
     */
    where?: TeamMemberWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TeamMembers to fetch.
     */
    orderBy?: TeamMemberOrderByWithRelationInput | TeamMemberOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for TeamMembers.
     */
    cursor?: TeamMemberWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TeamMembers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TeamMembers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of TeamMembers.
     */
    distinct?: TeamMemberScalarFieldEnum | TeamMemberScalarFieldEnum[]
  }

  /**
   * TeamMember findMany
   */
  export type TeamMemberFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TeamMember
     */
    select?: TeamMemberSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TeamMember
     */
    omit?: TeamMemberOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TeamMemberInclude<ExtArgs> | null
    /**
     * Filter, which TeamMembers to fetch.
     */
    where?: TeamMemberWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TeamMembers to fetch.
     */
    orderBy?: TeamMemberOrderByWithRelationInput | TeamMemberOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing TeamMembers.
     */
    cursor?: TeamMemberWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TeamMembers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TeamMembers.
     */
    skip?: number
    distinct?: TeamMemberScalarFieldEnum | TeamMemberScalarFieldEnum[]
  }

  /**
   * TeamMember create
   */
  export type TeamMemberCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TeamMember
     */
    select?: TeamMemberSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TeamMember
     */
    omit?: TeamMemberOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TeamMemberInclude<ExtArgs> | null
    /**
     * The data needed to create a TeamMember.
     */
    data: XOR<TeamMemberCreateInput, TeamMemberUncheckedCreateInput>
  }

  /**
   * TeamMember createMany
   */
  export type TeamMemberCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many TeamMembers.
     */
    data: TeamMemberCreateManyInput | TeamMemberCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * TeamMember createManyAndReturn
   */
  export type TeamMemberCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TeamMember
     */
    select?: TeamMemberSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the TeamMember
     */
    omit?: TeamMemberOmit<ExtArgs> | null
    /**
     * The data used to create many TeamMembers.
     */
    data: TeamMemberCreateManyInput | TeamMemberCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TeamMemberIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * TeamMember update
   */
  export type TeamMemberUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TeamMember
     */
    select?: TeamMemberSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TeamMember
     */
    omit?: TeamMemberOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TeamMemberInclude<ExtArgs> | null
    /**
     * The data needed to update a TeamMember.
     */
    data: XOR<TeamMemberUpdateInput, TeamMemberUncheckedUpdateInput>
    /**
     * Choose, which TeamMember to update.
     */
    where: TeamMemberWhereUniqueInput
  }

  /**
   * TeamMember updateMany
   */
  export type TeamMemberUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update TeamMembers.
     */
    data: XOR<TeamMemberUpdateManyMutationInput, TeamMemberUncheckedUpdateManyInput>
    /**
     * Filter which TeamMembers to update
     */
    where?: TeamMemberWhereInput
    /**
     * Limit how many TeamMembers to update.
     */
    limit?: number
  }

  /**
   * TeamMember updateManyAndReturn
   */
  export type TeamMemberUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TeamMember
     */
    select?: TeamMemberSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the TeamMember
     */
    omit?: TeamMemberOmit<ExtArgs> | null
    /**
     * The data used to update TeamMembers.
     */
    data: XOR<TeamMemberUpdateManyMutationInput, TeamMemberUncheckedUpdateManyInput>
    /**
     * Filter which TeamMembers to update
     */
    where?: TeamMemberWhereInput
    /**
     * Limit how many TeamMembers to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TeamMemberIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * TeamMember upsert
   */
  export type TeamMemberUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TeamMember
     */
    select?: TeamMemberSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TeamMember
     */
    omit?: TeamMemberOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TeamMemberInclude<ExtArgs> | null
    /**
     * The filter to search for the TeamMember to update in case it exists.
     */
    where: TeamMemberWhereUniqueInput
    /**
     * In case the TeamMember found by the `where` argument doesn't exist, create a new TeamMember with this data.
     */
    create: XOR<TeamMemberCreateInput, TeamMemberUncheckedCreateInput>
    /**
     * In case the TeamMember was found with the provided `where` argument, update it with this data.
     */
    update: XOR<TeamMemberUpdateInput, TeamMemberUncheckedUpdateInput>
  }

  /**
   * TeamMember delete
   */
  export type TeamMemberDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TeamMember
     */
    select?: TeamMemberSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TeamMember
     */
    omit?: TeamMemberOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TeamMemberInclude<ExtArgs> | null
    /**
     * Filter which TeamMember to delete.
     */
    where: TeamMemberWhereUniqueInput
  }

  /**
   * TeamMember deleteMany
   */
  export type TeamMemberDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which TeamMembers to delete
     */
    where?: TeamMemberWhereInput
    /**
     * Limit how many TeamMembers to delete.
     */
    limit?: number
  }

  /**
   * TeamMember without action
   */
  export type TeamMemberDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TeamMember
     */
    select?: TeamMemberSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TeamMember
     */
    omit?: TeamMemberOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TeamMemberInclude<ExtArgs> | null
  }


  /**
   * Model Team
   */

  export type AggregateTeam = {
    _count: TeamCountAggregateOutputType | null
    _avg: TeamAvgAggregateOutputType | null
    _sum: TeamSumAggregateOutputType | null
    _min: TeamMinAggregateOutputType | null
    _max: TeamMaxAggregateOutputType | null
  }

  export type TeamAvgAggregateOutputType = {
    id: number | null
    team_size: number | null
  }

  export type TeamSumAggregateOutputType = {
    id: bigint | null
    team_size: number | null
  }

  export type TeamMinAggregateOutputType = {
    id: bigint | null
    team_name: string | null
    team_size: number | null
    is_recruiting: boolean | null
    created_at: Date | null
  }

  export type TeamMaxAggregateOutputType = {
    id: bigint | null
    team_name: string | null
    team_size: number | null
    is_recruiting: boolean | null
    created_at: Date | null
  }

  export type TeamCountAggregateOutputType = {
    id: number
    team_name: number
    team_size: number
    is_recruiting: number
    created_at: number
    _all: number
  }


  export type TeamAvgAggregateInputType = {
    id?: true
    team_size?: true
  }

  export type TeamSumAggregateInputType = {
    id?: true
    team_size?: true
  }

  export type TeamMinAggregateInputType = {
    id?: true
    team_name?: true
    team_size?: true
    is_recruiting?: true
    created_at?: true
  }

  export type TeamMaxAggregateInputType = {
    id?: true
    team_name?: true
    team_size?: true
    is_recruiting?: true
    created_at?: true
  }

  export type TeamCountAggregateInputType = {
    id?: true
    team_name?: true
    team_size?: true
    is_recruiting?: true
    created_at?: true
    _all?: true
  }

  export type TeamAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Team to aggregate.
     */
    where?: TeamWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Teams to fetch.
     */
    orderBy?: TeamOrderByWithRelationInput | TeamOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: TeamWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Teams from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Teams.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Teams
    **/
    _count?: true | TeamCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: TeamAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: TeamSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: TeamMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: TeamMaxAggregateInputType
  }

  export type GetTeamAggregateType<T extends TeamAggregateArgs> = {
        [P in keyof T & keyof AggregateTeam]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateTeam[P]>
      : GetScalarType<T[P], AggregateTeam[P]>
  }




  export type TeamGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TeamWhereInput
    orderBy?: TeamOrderByWithAggregationInput | TeamOrderByWithAggregationInput[]
    by: TeamScalarFieldEnum[] | TeamScalarFieldEnum
    having?: TeamScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: TeamCountAggregateInputType | true
    _avg?: TeamAvgAggregateInputType
    _sum?: TeamSumAggregateInputType
    _min?: TeamMinAggregateInputType
    _max?: TeamMaxAggregateInputType
  }

  export type TeamGroupByOutputType = {
    id: bigint
    team_name: string
    team_size: number
    is_recruiting: boolean
    created_at: Date
    _count: TeamCountAggregateOutputType | null
    _avg: TeamAvgAggregateOutputType | null
    _sum: TeamSumAggregateOutputType | null
    _min: TeamMinAggregateOutputType | null
    _max: TeamMaxAggregateOutputType | null
  }

  type GetTeamGroupByPayload<T extends TeamGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<TeamGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof TeamGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], TeamGroupByOutputType[P]>
            : GetScalarType<T[P], TeamGroupByOutputType[P]>
        }
      >
    >


  export type TeamSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    team_name?: boolean
    team_size?: boolean
    is_recruiting?: boolean
    created_at?: boolean
    members?: boolean | Team$membersArgs<ExtArgs>
    _count?: boolean | TeamCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["team"]>

  export type TeamSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    team_name?: boolean
    team_size?: boolean
    is_recruiting?: boolean
    created_at?: boolean
  }, ExtArgs["result"]["team"]>

  export type TeamSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    team_name?: boolean
    team_size?: boolean
    is_recruiting?: boolean
    created_at?: boolean
  }, ExtArgs["result"]["team"]>

  export type TeamSelectScalar = {
    id?: boolean
    team_name?: boolean
    team_size?: boolean
    is_recruiting?: boolean
    created_at?: boolean
  }

  export type TeamOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "team_name" | "team_size" | "is_recruiting" | "created_at", ExtArgs["result"]["team"]>
  export type TeamInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    members?: boolean | Team$membersArgs<ExtArgs>
    _count?: boolean | TeamCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type TeamIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type TeamIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $TeamPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Team"
    objects: {
      members: Prisma.$TeamMemberPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: bigint
      team_name: string
      team_size: number
      is_recruiting: boolean
      created_at: Date
    }, ExtArgs["result"]["team"]>
    composites: {}
  }

  type TeamGetPayload<S extends boolean | null | undefined | TeamDefaultArgs> = $Result.GetResult<Prisma.$TeamPayload, S>

  type TeamCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<TeamFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: TeamCountAggregateInputType | true
    }

  export interface TeamDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Team'], meta: { name: 'Team' } }
    /**
     * Find zero or one Team that matches the filter.
     * @param {TeamFindUniqueArgs} args - Arguments to find a Team
     * @example
     * // Get one Team
     * const team = await prisma.team.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends TeamFindUniqueArgs>(args: SelectSubset<T, TeamFindUniqueArgs<ExtArgs>>): Prisma__TeamClient<$Result.GetResult<Prisma.$TeamPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Team that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {TeamFindUniqueOrThrowArgs} args - Arguments to find a Team
     * @example
     * // Get one Team
     * const team = await prisma.team.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends TeamFindUniqueOrThrowArgs>(args: SelectSubset<T, TeamFindUniqueOrThrowArgs<ExtArgs>>): Prisma__TeamClient<$Result.GetResult<Prisma.$TeamPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Team that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TeamFindFirstArgs} args - Arguments to find a Team
     * @example
     * // Get one Team
     * const team = await prisma.team.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends TeamFindFirstArgs>(args?: SelectSubset<T, TeamFindFirstArgs<ExtArgs>>): Prisma__TeamClient<$Result.GetResult<Prisma.$TeamPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Team that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TeamFindFirstOrThrowArgs} args - Arguments to find a Team
     * @example
     * // Get one Team
     * const team = await prisma.team.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends TeamFindFirstOrThrowArgs>(args?: SelectSubset<T, TeamFindFirstOrThrowArgs<ExtArgs>>): Prisma__TeamClient<$Result.GetResult<Prisma.$TeamPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Teams that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TeamFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Teams
     * const teams = await prisma.team.findMany()
     * 
     * // Get first 10 Teams
     * const teams = await prisma.team.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const teamWithIdOnly = await prisma.team.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends TeamFindManyArgs>(args?: SelectSubset<T, TeamFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TeamPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Team.
     * @param {TeamCreateArgs} args - Arguments to create a Team.
     * @example
     * // Create one Team
     * const Team = await prisma.team.create({
     *   data: {
     *     // ... data to create a Team
     *   }
     * })
     * 
     */
    create<T extends TeamCreateArgs>(args: SelectSubset<T, TeamCreateArgs<ExtArgs>>): Prisma__TeamClient<$Result.GetResult<Prisma.$TeamPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Teams.
     * @param {TeamCreateManyArgs} args - Arguments to create many Teams.
     * @example
     * // Create many Teams
     * const team = await prisma.team.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends TeamCreateManyArgs>(args?: SelectSubset<T, TeamCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Teams and returns the data saved in the database.
     * @param {TeamCreateManyAndReturnArgs} args - Arguments to create many Teams.
     * @example
     * // Create many Teams
     * const team = await prisma.team.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Teams and only return the `id`
     * const teamWithIdOnly = await prisma.team.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends TeamCreateManyAndReturnArgs>(args?: SelectSubset<T, TeamCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TeamPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Team.
     * @param {TeamDeleteArgs} args - Arguments to delete one Team.
     * @example
     * // Delete one Team
     * const Team = await prisma.team.delete({
     *   where: {
     *     // ... filter to delete one Team
     *   }
     * })
     * 
     */
    delete<T extends TeamDeleteArgs>(args: SelectSubset<T, TeamDeleteArgs<ExtArgs>>): Prisma__TeamClient<$Result.GetResult<Prisma.$TeamPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Team.
     * @param {TeamUpdateArgs} args - Arguments to update one Team.
     * @example
     * // Update one Team
     * const team = await prisma.team.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends TeamUpdateArgs>(args: SelectSubset<T, TeamUpdateArgs<ExtArgs>>): Prisma__TeamClient<$Result.GetResult<Prisma.$TeamPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Teams.
     * @param {TeamDeleteManyArgs} args - Arguments to filter Teams to delete.
     * @example
     * // Delete a few Teams
     * const { count } = await prisma.team.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends TeamDeleteManyArgs>(args?: SelectSubset<T, TeamDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Teams.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TeamUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Teams
     * const team = await prisma.team.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends TeamUpdateManyArgs>(args: SelectSubset<T, TeamUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Teams and returns the data updated in the database.
     * @param {TeamUpdateManyAndReturnArgs} args - Arguments to update many Teams.
     * @example
     * // Update many Teams
     * const team = await prisma.team.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Teams and only return the `id`
     * const teamWithIdOnly = await prisma.team.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends TeamUpdateManyAndReturnArgs>(args: SelectSubset<T, TeamUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TeamPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Team.
     * @param {TeamUpsertArgs} args - Arguments to update or create a Team.
     * @example
     * // Update or create a Team
     * const team = await prisma.team.upsert({
     *   create: {
     *     // ... data to create a Team
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Team we want to update
     *   }
     * })
     */
    upsert<T extends TeamUpsertArgs>(args: SelectSubset<T, TeamUpsertArgs<ExtArgs>>): Prisma__TeamClient<$Result.GetResult<Prisma.$TeamPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Teams.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TeamCountArgs} args - Arguments to filter Teams to count.
     * @example
     * // Count the number of Teams
     * const count = await prisma.team.count({
     *   where: {
     *     // ... the filter for the Teams we want to count
     *   }
     * })
    **/
    count<T extends TeamCountArgs>(
      args?: Subset<T, TeamCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], TeamCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Team.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TeamAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends TeamAggregateArgs>(args: Subset<T, TeamAggregateArgs>): Prisma.PrismaPromise<GetTeamAggregateType<T>>

    /**
     * Group by Team.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TeamGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends TeamGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: TeamGroupByArgs['orderBy'] }
        : { orderBy?: TeamGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, TeamGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetTeamGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Team model
   */
  readonly fields: TeamFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Team.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__TeamClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    members<T extends Team$membersArgs<ExtArgs> = {}>(args?: Subset<T, Team$membersArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TeamMemberPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Team model
   */
  interface TeamFieldRefs {
    readonly id: FieldRef<"Team", 'BigInt'>
    readonly team_name: FieldRef<"Team", 'String'>
    readonly team_size: FieldRef<"Team", 'Int'>
    readonly is_recruiting: FieldRef<"Team", 'Boolean'>
    readonly created_at: FieldRef<"Team", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Team findUnique
   */
  export type TeamFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Team
     */
    select?: TeamSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Team
     */
    omit?: TeamOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TeamInclude<ExtArgs> | null
    /**
     * Filter, which Team to fetch.
     */
    where: TeamWhereUniqueInput
  }

  /**
   * Team findUniqueOrThrow
   */
  export type TeamFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Team
     */
    select?: TeamSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Team
     */
    omit?: TeamOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TeamInclude<ExtArgs> | null
    /**
     * Filter, which Team to fetch.
     */
    where: TeamWhereUniqueInput
  }

  /**
   * Team findFirst
   */
  export type TeamFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Team
     */
    select?: TeamSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Team
     */
    omit?: TeamOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TeamInclude<ExtArgs> | null
    /**
     * Filter, which Team to fetch.
     */
    where?: TeamWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Teams to fetch.
     */
    orderBy?: TeamOrderByWithRelationInput | TeamOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Teams.
     */
    cursor?: TeamWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Teams from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Teams.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Teams.
     */
    distinct?: TeamScalarFieldEnum | TeamScalarFieldEnum[]
  }

  /**
   * Team findFirstOrThrow
   */
  export type TeamFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Team
     */
    select?: TeamSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Team
     */
    omit?: TeamOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TeamInclude<ExtArgs> | null
    /**
     * Filter, which Team to fetch.
     */
    where?: TeamWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Teams to fetch.
     */
    orderBy?: TeamOrderByWithRelationInput | TeamOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Teams.
     */
    cursor?: TeamWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Teams from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Teams.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Teams.
     */
    distinct?: TeamScalarFieldEnum | TeamScalarFieldEnum[]
  }

  /**
   * Team findMany
   */
  export type TeamFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Team
     */
    select?: TeamSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Team
     */
    omit?: TeamOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TeamInclude<ExtArgs> | null
    /**
     * Filter, which Teams to fetch.
     */
    where?: TeamWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Teams to fetch.
     */
    orderBy?: TeamOrderByWithRelationInput | TeamOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Teams.
     */
    cursor?: TeamWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Teams from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Teams.
     */
    skip?: number
    distinct?: TeamScalarFieldEnum | TeamScalarFieldEnum[]
  }

  /**
   * Team create
   */
  export type TeamCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Team
     */
    select?: TeamSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Team
     */
    omit?: TeamOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TeamInclude<ExtArgs> | null
    /**
     * The data needed to create a Team.
     */
    data: XOR<TeamCreateInput, TeamUncheckedCreateInput>
  }

  /**
   * Team createMany
   */
  export type TeamCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Teams.
     */
    data: TeamCreateManyInput | TeamCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Team createManyAndReturn
   */
  export type TeamCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Team
     */
    select?: TeamSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Team
     */
    omit?: TeamOmit<ExtArgs> | null
    /**
     * The data used to create many Teams.
     */
    data: TeamCreateManyInput | TeamCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Team update
   */
  export type TeamUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Team
     */
    select?: TeamSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Team
     */
    omit?: TeamOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TeamInclude<ExtArgs> | null
    /**
     * The data needed to update a Team.
     */
    data: XOR<TeamUpdateInput, TeamUncheckedUpdateInput>
    /**
     * Choose, which Team to update.
     */
    where: TeamWhereUniqueInput
  }

  /**
   * Team updateMany
   */
  export type TeamUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Teams.
     */
    data: XOR<TeamUpdateManyMutationInput, TeamUncheckedUpdateManyInput>
    /**
     * Filter which Teams to update
     */
    where?: TeamWhereInput
    /**
     * Limit how many Teams to update.
     */
    limit?: number
  }

  /**
   * Team updateManyAndReturn
   */
  export type TeamUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Team
     */
    select?: TeamSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Team
     */
    omit?: TeamOmit<ExtArgs> | null
    /**
     * The data used to update Teams.
     */
    data: XOR<TeamUpdateManyMutationInput, TeamUncheckedUpdateManyInput>
    /**
     * Filter which Teams to update
     */
    where?: TeamWhereInput
    /**
     * Limit how many Teams to update.
     */
    limit?: number
  }

  /**
   * Team upsert
   */
  export type TeamUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Team
     */
    select?: TeamSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Team
     */
    omit?: TeamOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TeamInclude<ExtArgs> | null
    /**
     * The filter to search for the Team to update in case it exists.
     */
    where: TeamWhereUniqueInput
    /**
     * In case the Team found by the `where` argument doesn't exist, create a new Team with this data.
     */
    create: XOR<TeamCreateInput, TeamUncheckedCreateInput>
    /**
     * In case the Team was found with the provided `where` argument, update it with this data.
     */
    update: XOR<TeamUpdateInput, TeamUncheckedUpdateInput>
  }

  /**
   * Team delete
   */
  export type TeamDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Team
     */
    select?: TeamSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Team
     */
    omit?: TeamOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TeamInclude<ExtArgs> | null
    /**
     * Filter which Team to delete.
     */
    where: TeamWhereUniqueInput
  }

  /**
   * Team deleteMany
   */
  export type TeamDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Teams to delete
     */
    where?: TeamWhereInput
    /**
     * Limit how many Teams to delete.
     */
    limit?: number
  }

  /**
   * Team.members
   */
  export type Team$membersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TeamMember
     */
    select?: TeamMemberSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TeamMember
     */
    omit?: TeamMemberOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TeamMemberInclude<ExtArgs> | null
    where?: TeamMemberWhereInput
    orderBy?: TeamMemberOrderByWithRelationInput | TeamMemberOrderByWithRelationInput[]
    cursor?: TeamMemberWhereUniqueInput
    take?: number
    skip?: number
    distinct?: TeamMemberScalarFieldEnum | TeamMemberScalarFieldEnum[]
  }

  /**
   * Team without action
   */
  export type TeamDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Team
     */
    select?: TeamSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Team
     */
    omit?: TeamOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TeamInclude<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const ApplicationAnswerScalarFieldEnum: {
    id: 'id',
    application_id: 'application_id',
    question_id: 'question_id',
    answer: 'answer',
    created_at: 'created_at',
    updated_at: 'updated_at'
  };

  export type ApplicationAnswerScalarFieldEnum = (typeof ApplicationAnswerScalarFieldEnum)[keyof typeof ApplicationAnswerScalarFieldEnum]


  export const ApplicationScalarFieldEnum: {
    id: 'id',
    profile_id: 'profile_id',
    resume_id: 'resume_id',
    status: 'status',
    role: 'role',
    term: 'term',
    comments: 'comments',
    created_at: 'created_at',
    updated_at: 'updated_at',
    submitted_at: 'submitted_at'
  };

  export type ApplicationScalarFieldEnum = (typeof ApplicationScalarFieldEnum)[keyof typeof ApplicationScalarFieldEnum]


  export const EventAttendanceScalarFieldEnum: {
    id: 'id',
    event_id: 'event_id',
    profile_id: 'profile_id',
    checked_in: 'checked_in',
    created_at: 'created_at'
  };

  export type EventAttendanceScalarFieldEnum = (typeof EventAttendanceScalarFieldEnum)[keyof typeof EventAttendanceScalarFieldEnum]


  export const EventScalarFieldEnum: {
    id: 'id',
    name: 'name',
    registration_required: 'registration_required',
    description: 'description',
    location: 'location',
    start_time: 'start_time',
    buffered_start_time: 'buffered_start_time',
    end_time: 'end_time',
    buffered_end_time: 'buffered_end_time',
    payment_required: 'payment_required',
    image_id: 'image_id',
    created_at: 'created_at',
    updated_at: 'updated_at'
  };

  export type EventScalarFieldEnum = (typeof EventScalarFieldEnum)[keyof typeof EventScalarFieldEnum]


  export const ProfileScalarFieldEnum: {
    id: 'id',
    first_name: 'first_name',
    last_name: 'last_name',
    role: 'role',
    nfc_id: 'nfc_id',
    created_at: 'created_at',
    updated_at: 'updated_at'
  };

  export type ProfileScalarFieldEnum = (typeof ProfileScalarFieldEnum)[keyof typeof ProfileScalarFieldEnum]


  export const QuestionScalarFieldEnum: {
    id: 'id',
    question_id: 'question_id',
    question: 'question',
    is_required: 'is_required',
    order_num: 'order_num',
    max_length: 'max_length',
    placeholder: 'placeholder',
    help_text: 'help_text',
    role: 'role',
    term: 'term'
  };

  export type QuestionScalarFieldEnum = (typeof QuestionScalarFieldEnum)[keyof typeof QuestionScalarFieldEnum]


  export const ResumeScalarFieldEnum: {
    id: 'id',
    profile_id: 'profile_id',
    file_path: 'file_path',
    created_at: 'created_at'
  };

  export type ResumeScalarFieldEnum = (typeof ResumeScalarFieldEnum)[keyof typeof ResumeScalarFieldEnum]


  export const SponsorScalarFieldEnum: {
    id: 'id',
    name: 'name',
    logo_url: 'logo_url',
    website_url: 'website_url',
    tier: 'tier',
    created_at: 'created_at'
  };

  export type SponsorScalarFieldEnum = (typeof SponsorScalarFieldEnum)[keyof typeof SponsorScalarFieldEnum]


  export const TeamMemberScalarFieldEnum: {
    id: 'id',
    team_id: 'team_id',
    profile_id: 'profile_id',
    role: 'role',
    created_at: 'created_at',
    joined_at: 'joined_at'
  };

  export type TeamMemberScalarFieldEnum = (typeof TeamMemberScalarFieldEnum)[keyof typeof TeamMemberScalarFieldEnum]


  export const TeamScalarFieldEnum: {
    id: 'id',
    team_name: 'team_name',
    team_size: 'team_size',
    is_recruiting: 'is_recruiting',
    created_at: 'created_at'
  };

  export type TeamScalarFieldEnum = (typeof TeamScalarFieldEnum)[keyof typeof TeamScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  /**
   * Field references
   */


  /**
   * Reference to a field of type 'BigInt'
   */
  export type BigIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'BigInt'>
    


  /**
   * Reference to a field of type 'BigInt[]'
   */
  export type ListBigIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'BigInt[]'>
    


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'application_status_enum'
   */
  export type Enumapplication_status_enumFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'application_status_enum'>
    


  /**
   * Reference to a field of type 'application_status_enum[]'
   */
  export type ListEnumapplication_status_enumFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'application_status_enum[]'>
    


  /**
   * Reference to a field of type 'role_enum'
   */
  export type Enumrole_enumFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'role_enum'>
    


  /**
   * Reference to a field of type 'role_enum[]'
   */
  export type ListEnumrole_enumFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'role_enum[]'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    


  /**
   * Reference to a field of type 'sponsor_tier_enum'
   */
  export type Enumsponsor_tier_enumFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'sponsor_tier_enum'>
    


  /**
   * Reference to a field of type 'sponsor_tier_enum[]'
   */
  export type ListEnumsponsor_tier_enumFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'sponsor_tier_enum[]'>
    


  /**
   * Reference to a field of type 'team_role_enum'
   */
  export type Enumteam_role_enumFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'team_role_enum'>
    


  /**
   * Reference to a field of type 'team_role_enum[]'
   */
  export type ListEnumteam_role_enumFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'team_role_enum[]'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'Float[]'
   */
  export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>
    
  /**
   * Deep Input Types
   */


  export type ApplicationAnswerWhereInput = {
    AND?: ApplicationAnswerWhereInput | ApplicationAnswerWhereInput[]
    OR?: ApplicationAnswerWhereInput[]
    NOT?: ApplicationAnswerWhereInput | ApplicationAnswerWhereInput[]
    id?: BigIntFilter<"ApplicationAnswer"> | bigint | number
    application_id?: BigIntFilter<"ApplicationAnswer"> | bigint | number
    question_id?: BigIntFilter<"ApplicationAnswer"> | bigint | number
    answer?: StringNullableFilter<"ApplicationAnswer"> | string | null
    created_at?: DateTimeFilter<"ApplicationAnswer"> | Date | string
    updated_at?: DateTimeFilter<"ApplicationAnswer"> | Date | string
    application?: XOR<ApplicationScalarRelationFilter, ApplicationWhereInput>
    question?: XOR<QuestionScalarRelationFilter, QuestionWhereInput>
  }

  export type ApplicationAnswerOrderByWithRelationInput = {
    id?: SortOrder
    application_id?: SortOrder
    question_id?: SortOrder
    answer?: SortOrderInput | SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    application?: ApplicationOrderByWithRelationInput
    question?: QuestionOrderByWithRelationInput
  }

  export type ApplicationAnswerWhereUniqueInput = Prisma.AtLeast<{
    id?: bigint | number
    application_id_question_id?: ApplicationAnswerApplication_idQuestion_idCompoundUniqueInput
    AND?: ApplicationAnswerWhereInput | ApplicationAnswerWhereInput[]
    OR?: ApplicationAnswerWhereInput[]
    NOT?: ApplicationAnswerWhereInput | ApplicationAnswerWhereInput[]
    application_id?: BigIntFilter<"ApplicationAnswer"> | bigint | number
    question_id?: BigIntFilter<"ApplicationAnswer"> | bigint | number
    answer?: StringNullableFilter<"ApplicationAnswer"> | string | null
    created_at?: DateTimeFilter<"ApplicationAnswer"> | Date | string
    updated_at?: DateTimeFilter<"ApplicationAnswer"> | Date | string
    application?: XOR<ApplicationScalarRelationFilter, ApplicationWhereInput>
    question?: XOR<QuestionScalarRelationFilter, QuestionWhereInput>
  }, "id" | "application_id_question_id">

  export type ApplicationAnswerOrderByWithAggregationInput = {
    id?: SortOrder
    application_id?: SortOrder
    question_id?: SortOrder
    answer?: SortOrderInput | SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    _count?: ApplicationAnswerCountOrderByAggregateInput
    _avg?: ApplicationAnswerAvgOrderByAggregateInput
    _max?: ApplicationAnswerMaxOrderByAggregateInput
    _min?: ApplicationAnswerMinOrderByAggregateInput
    _sum?: ApplicationAnswerSumOrderByAggregateInput
  }

  export type ApplicationAnswerScalarWhereWithAggregatesInput = {
    AND?: ApplicationAnswerScalarWhereWithAggregatesInput | ApplicationAnswerScalarWhereWithAggregatesInput[]
    OR?: ApplicationAnswerScalarWhereWithAggregatesInput[]
    NOT?: ApplicationAnswerScalarWhereWithAggregatesInput | ApplicationAnswerScalarWhereWithAggregatesInput[]
    id?: BigIntWithAggregatesFilter<"ApplicationAnswer"> | bigint | number
    application_id?: BigIntWithAggregatesFilter<"ApplicationAnswer"> | bigint | number
    question_id?: BigIntWithAggregatesFilter<"ApplicationAnswer"> | bigint | number
    answer?: StringNullableWithAggregatesFilter<"ApplicationAnswer"> | string | null
    created_at?: DateTimeWithAggregatesFilter<"ApplicationAnswer"> | Date | string
    updated_at?: DateTimeWithAggregatesFilter<"ApplicationAnswer"> | Date | string
  }

  export type ApplicationWhereInput = {
    AND?: ApplicationWhereInput | ApplicationWhereInput[]
    OR?: ApplicationWhereInput[]
    NOT?: ApplicationWhereInput | ApplicationWhereInput[]
    id?: BigIntFilter<"Application"> | bigint | number
    profile_id?: UuidFilter<"Application"> | string
    resume_id?: BigIntNullableFilter<"Application"> | bigint | number | null
    status?: Enumapplication_status_enumFilter<"Application"> | $Enums.application_status_enum
    role?: Enumrole_enumFilter<"Application"> | $Enums.role_enum
    term?: StringFilter<"Application"> | string
    comments?: StringNullableFilter<"Application"> | string | null
    created_at?: DateTimeFilter<"Application"> | Date | string
    updated_at?: DateTimeFilter<"Application"> | Date | string
    submitted_at?: DateTimeNullableFilter<"Application"> | Date | string | null
    profile?: XOR<ProfileScalarRelationFilter, ProfileWhereInput>
    resume?: XOR<ResumeNullableScalarRelationFilter, ResumeWhereInput> | null
    answers?: ApplicationAnswerListRelationFilter
  }

  export type ApplicationOrderByWithRelationInput = {
    id?: SortOrder
    profile_id?: SortOrder
    resume_id?: SortOrderInput | SortOrder
    status?: SortOrder
    role?: SortOrder
    term?: SortOrder
    comments?: SortOrderInput | SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    submitted_at?: SortOrderInput | SortOrder
    profile?: ProfileOrderByWithRelationInput
    resume?: ResumeOrderByWithRelationInput
    answers?: ApplicationAnswerOrderByRelationAggregateInput
  }

  export type ApplicationWhereUniqueInput = Prisma.AtLeast<{
    id?: bigint | number
    profile_id_role_term?: ApplicationProfile_idRoleTermCompoundUniqueInput
    AND?: ApplicationWhereInput | ApplicationWhereInput[]
    OR?: ApplicationWhereInput[]
    NOT?: ApplicationWhereInput | ApplicationWhereInput[]
    profile_id?: UuidFilter<"Application"> | string
    resume_id?: BigIntNullableFilter<"Application"> | bigint | number | null
    status?: Enumapplication_status_enumFilter<"Application"> | $Enums.application_status_enum
    role?: Enumrole_enumFilter<"Application"> | $Enums.role_enum
    term?: StringFilter<"Application"> | string
    comments?: StringNullableFilter<"Application"> | string | null
    created_at?: DateTimeFilter<"Application"> | Date | string
    updated_at?: DateTimeFilter<"Application"> | Date | string
    submitted_at?: DateTimeNullableFilter<"Application"> | Date | string | null
    profile?: XOR<ProfileScalarRelationFilter, ProfileWhereInput>
    resume?: XOR<ResumeNullableScalarRelationFilter, ResumeWhereInput> | null
    answers?: ApplicationAnswerListRelationFilter
  }, "id" | "profile_id_role_term">

  export type ApplicationOrderByWithAggregationInput = {
    id?: SortOrder
    profile_id?: SortOrder
    resume_id?: SortOrderInput | SortOrder
    status?: SortOrder
    role?: SortOrder
    term?: SortOrder
    comments?: SortOrderInput | SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    submitted_at?: SortOrderInput | SortOrder
    _count?: ApplicationCountOrderByAggregateInput
    _avg?: ApplicationAvgOrderByAggregateInput
    _max?: ApplicationMaxOrderByAggregateInput
    _min?: ApplicationMinOrderByAggregateInput
    _sum?: ApplicationSumOrderByAggregateInput
  }

  export type ApplicationScalarWhereWithAggregatesInput = {
    AND?: ApplicationScalarWhereWithAggregatesInput | ApplicationScalarWhereWithAggregatesInput[]
    OR?: ApplicationScalarWhereWithAggregatesInput[]
    NOT?: ApplicationScalarWhereWithAggregatesInput | ApplicationScalarWhereWithAggregatesInput[]
    id?: BigIntWithAggregatesFilter<"Application"> | bigint | number
    profile_id?: UuidWithAggregatesFilter<"Application"> | string
    resume_id?: BigIntNullableWithAggregatesFilter<"Application"> | bigint | number | null
    status?: Enumapplication_status_enumWithAggregatesFilter<"Application"> | $Enums.application_status_enum
    role?: Enumrole_enumWithAggregatesFilter<"Application"> | $Enums.role_enum
    term?: StringWithAggregatesFilter<"Application"> | string
    comments?: StringNullableWithAggregatesFilter<"Application"> | string | null
    created_at?: DateTimeWithAggregatesFilter<"Application"> | Date | string
    updated_at?: DateTimeWithAggregatesFilter<"Application"> | Date | string
    submitted_at?: DateTimeNullableWithAggregatesFilter<"Application"> | Date | string | null
  }

  export type EventAttendanceWhereInput = {
    AND?: EventAttendanceWhereInput | EventAttendanceWhereInput[]
    OR?: EventAttendanceWhereInput[]
    NOT?: EventAttendanceWhereInput | EventAttendanceWhereInput[]
    id?: BigIntFilter<"EventAttendance"> | bigint | number
    event_id?: BigIntFilter<"EventAttendance"> | bigint | number
    profile_id?: UuidFilter<"EventAttendance"> | string
    checked_in?: BoolFilter<"EventAttendance"> | boolean
    created_at?: DateTimeFilter<"EventAttendance"> | Date | string
    event?: XOR<EventScalarRelationFilter, EventWhereInput>
    profile?: XOR<ProfileScalarRelationFilter, ProfileWhereInput>
  }

  export type EventAttendanceOrderByWithRelationInput = {
    id?: SortOrder
    event_id?: SortOrder
    profile_id?: SortOrder
    checked_in?: SortOrder
    created_at?: SortOrder
    event?: EventOrderByWithRelationInput
    profile?: ProfileOrderByWithRelationInput
  }

  export type EventAttendanceWhereUniqueInput = Prisma.AtLeast<{
    id?: bigint | number
    event_id_profile_id?: EventAttendanceEvent_idProfile_idCompoundUniqueInput
    AND?: EventAttendanceWhereInput | EventAttendanceWhereInput[]
    OR?: EventAttendanceWhereInput[]
    NOT?: EventAttendanceWhereInput | EventAttendanceWhereInput[]
    event_id?: BigIntFilter<"EventAttendance"> | bigint | number
    profile_id?: UuidFilter<"EventAttendance"> | string
    checked_in?: BoolFilter<"EventAttendance"> | boolean
    created_at?: DateTimeFilter<"EventAttendance"> | Date | string
    event?: XOR<EventScalarRelationFilter, EventWhereInput>
    profile?: XOR<ProfileScalarRelationFilter, ProfileWhereInput>
  }, "id" | "event_id_profile_id">

  export type EventAttendanceOrderByWithAggregationInput = {
    id?: SortOrder
    event_id?: SortOrder
    profile_id?: SortOrder
    checked_in?: SortOrder
    created_at?: SortOrder
    _count?: EventAttendanceCountOrderByAggregateInput
    _avg?: EventAttendanceAvgOrderByAggregateInput
    _max?: EventAttendanceMaxOrderByAggregateInput
    _min?: EventAttendanceMinOrderByAggregateInput
    _sum?: EventAttendanceSumOrderByAggregateInput
  }

  export type EventAttendanceScalarWhereWithAggregatesInput = {
    AND?: EventAttendanceScalarWhereWithAggregatesInput | EventAttendanceScalarWhereWithAggregatesInput[]
    OR?: EventAttendanceScalarWhereWithAggregatesInput[]
    NOT?: EventAttendanceScalarWhereWithAggregatesInput | EventAttendanceScalarWhereWithAggregatesInput[]
    id?: BigIntWithAggregatesFilter<"EventAttendance"> | bigint | number
    event_id?: BigIntWithAggregatesFilter<"EventAttendance"> | bigint | number
    profile_id?: UuidWithAggregatesFilter<"EventAttendance"> | string
    checked_in?: BoolWithAggregatesFilter<"EventAttendance"> | boolean
    created_at?: DateTimeWithAggregatesFilter<"EventAttendance"> | Date | string
  }

  export type EventWhereInput = {
    AND?: EventWhereInput | EventWhereInput[]
    OR?: EventWhereInput[]
    NOT?: EventWhereInput | EventWhereInput[]
    id?: BigIntFilter<"Event"> | bigint | number
    name?: StringFilter<"Event"> | string
    registration_required?: BoolFilter<"Event"> | boolean
    description?: StringNullableFilter<"Event"> | string | null
    location?: StringNullableFilter<"Event"> | string | null
    start_time?: DateTimeFilter<"Event"> | Date | string
    buffered_start_time?: DateTimeFilter<"Event"> | Date | string
    end_time?: DateTimeFilter<"Event"> | Date | string
    buffered_end_time?: DateTimeFilter<"Event"> | Date | string
    payment_required?: BoolFilter<"Event"> | boolean
    image_id?: BigIntNullableFilter<"Event"> | bigint | number | null
    created_at?: DateTimeFilter<"Event"> | Date | string
    updated_at?: DateTimeFilter<"Event"> | Date | string
    attendance?: EventAttendanceListRelationFilter
  }

  export type EventOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    registration_required?: SortOrder
    description?: SortOrderInput | SortOrder
    location?: SortOrderInput | SortOrder
    start_time?: SortOrder
    buffered_start_time?: SortOrder
    end_time?: SortOrder
    buffered_end_time?: SortOrder
    payment_required?: SortOrder
    image_id?: SortOrderInput | SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    attendance?: EventAttendanceOrderByRelationAggregateInput
  }

  export type EventWhereUniqueInput = Prisma.AtLeast<{
    id?: bigint | number
    AND?: EventWhereInput | EventWhereInput[]
    OR?: EventWhereInput[]
    NOT?: EventWhereInput | EventWhereInput[]
    name?: StringFilter<"Event"> | string
    registration_required?: BoolFilter<"Event"> | boolean
    description?: StringNullableFilter<"Event"> | string | null
    location?: StringNullableFilter<"Event"> | string | null
    start_time?: DateTimeFilter<"Event"> | Date | string
    buffered_start_time?: DateTimeFilter<"Event"> | Date | string
    end_time?: DateTimeFilter<"Event"> | Date | string
    buffered_end_time?: DateTimeFilter<"Event"> | Date | string
    payment_required?: BoolFilter<"Event"> | boolean
    image_id?: BigIntNullableFilter<"Event"> | bigint | number | null
    created_at?: DateTimeFilter<"Event"> | Date | string
    updated_at?: DateTimeFilter<"Event"> | Date | string
    attendance?: EventAttendanceListRelationFilter
  }, "id">

  export type EventOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    registration_required?: SortOrder
    description?: SortOrderInput | SortOrder
    location?: SortOrderInput | SortOrder
    start_time?: SortOrder
    buffered_start_time?: SortOrder
    end_time?: SortOrder
    buffered_end_time?: SortOrder
    payment_required?: SortOrder
    image_id?: SortOrderInput | SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    _count?: EventCountOrderByAggregateInput
    _avg?: EventAvgOrderByAggregateInput
    _max?: EventMaxOrderByAggregateInput
    _min?: EventMinOrderByAggregateInput
    _sum?: EventSumOrderByAggregateInput
  }

  export type EventScalarWhereWithAggregatesInput = {
    AND?: EventScalarWhereWithAggregatesInput | EventScalarWhereWithAggregatesInput[]
    OR?: EventScalarWhereWithAggregatesInput[]
    NOT?: EventScalarWhereWithAggregatesInput | EventScalarWhereWithAggregatesInput[]
    id?: BigIntWithAggregatesFilter<"Event"> | bigint | number
    name?: StringWithAggregatesFilter<"Event"> | string
    registration_required?: BoolWithAggregatesFilter<"Event"> | boolean
    description?: StringNullableWithAggregatesFilter<"Event"> | string | null
    location?: StringNullableWithAggregatesFilter<"Event"> | string | null
    start_time?: DateTimeWithAggregatesFilter<"Event"> | Date | string
    buffered_start_time?: DateTimeWithAggregatesFilter<"Event"> | Date | string
    end_time?: DateTimeWithAggregatesFilter<"Event"> | Date | string
    buffered_end_time?: DateTimeWithAggregatesFilter<"Event"> | Date | string
    payment_required?: BoolWithAggregatesFilter<"Event"> | boolean
    image_id?: BigIntNullableWithAggregatesFilter<"Event"> | bigint | number | null
    created_at?: DateTimeWithAggregatesFilter<"Event"> | Date | string
    updated_at?: DateTimeWithAggregatesFilter<"Event"> | Date | string
  }

  export type ProfileWhereInput = {
    AND?: ProfileWhereInput | ProfileWhereInput[]
    OR?: ProfileWhereInput[]
    NOT?: ProfileWhereInput | ProfileWhereInput[]
    id?: UuidFilter<"Profile"> | string
    first_name?: StringFilter<"Profile"> | string
    last_name?: StringFilter<"Profile"> | string
    role?: Enumrole_enumFilter<"Profile"> | $Enums.role_enum
    nfc_id?: BigIntNullableFilter<"Profile"> | bigint | number | null
    created_at?: DateTimeFilter<"Profile"> | Date | string
    updated_at?: DateTimeFilter<"Profile"> | Date | string
    resumes?: ResumeListRelationFilter
    applications?: ApplicationListRelationFilter
    eventAttendance?: EventAttendanceListRelationFilter
    teamMembers?: TeamMemberListRelationFilter
  }

  export type ProfileOrderByWithRelationInput = {
    id?: SortOrder
    first_name?: SortOrder
    last_name?: SortOrder
    role?: SortOrder
    nfc_id?: SortOrderInput | SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    resumes?: ResumeOrderByRelationAggregateInput
    applications?: ApplicationOrderByRelationAggregateInput
    eventAttendance?: EventAttendanceOrderByRelationAggregateInput
    teamMembers?: TeamMemberOrderByRelationAggregateInput
  }

  export type ProfileWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: ProfileWhereInput | ProfileWhereInput[]
    OR?: ProfileWhereInput[]
    NOT?: ProfileWhereInput | ProfileWhereInput[]
    first_name?: StringFilter<"Profile"> | string
    last_name?: StringFilter<"Profile"> | string
    role?: Enumrole_enumFilter<"Profile"> | $Enums.role_enum
    nfc_id?: BigIntNullableFilter<"Profile"> | bigint | number | null
    created_at?: DateTimeFilter<"Profile"> | Date | string
    updated_at?: DateTimeFilter<"Profile"> | Date | string
    resumes?: ResumeListRelationFilter
    applications?: ApplicationListRelationFilter
    eventAttendance?: EventAttendanceListRelationFilter
    teamMembers?: TeamMemberListRelationFilter
  }, "id">

  export type ProfileOrderByWithAggregationInput = {
    id?: SortOrder
    first_name?: SortOrder
    last_name?: SortOrder
    role?: SortOrder
    nfc_id?: SortOrderInput | SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    _count?: ProfileCountOrderByAggregateInput
    _avg?: ProfileAvgOrderByAggregateInput
    _max?: ProfileMaxOrderByAggregateInput
    _min?: ProfileMinOrderByAggregateInput
    _sum?: ProfileSumOrderByAggregateInput
  }

  export type ProfileScalarWhereWithAggregatesInput = {
    AND?: ProfileScalarWhereWithAggregatesInput | ProfileScalarWhereWithAggregatesInput[]
    OR?: ProfileScalarWhereWithAggregatesInput[]
    NOT?: ProfileScalarWhereWithAggregatesInput | ProfileScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"Profile"> | string
    first_name?: StringWithAggregatesFilter<"Profile"> | string
    last_name?: StringWithAggregatesFilter<"Profile"> | string
    role?: Enumrole_enumWithAggregatesFilter<"Profile"> | $Enums.role_enum
    nfc_id?: BigIntNullableWithAggregatesFilter<"Profile"> | bigint | number | null
    created_at?: DateTimeWithAggregatesFilter<"Profile"> | Date | string
    updated_at?: DateTimeWithAggregatesFilter<"Profile"> | Date | string
  }

  export type QuestionWhereInput = {
    AND?: QuestionWhereInput | QuestionWhereInput[]
    OR?: QuestionWhereInput[]
    NOT?: QuestionWhereInput | QuestionWhereInput[]
    id?: BigIntFilter<"Question"> | bigint | number
    question_id?: StringFilter<"Question"> | string
    question?: StringFilter<"Question"> | string
    is_required?: BoolFilter<"Question"> | boolean
    order_num?: IntFilter<"Question"> | number
    max_length?: IntFilter<"Question"> | number
    placeholder?: StringNullableFilter<"Question"> | string | null
    help_text?: StringNullableFilter<"Question"> | string | null
    role?: Enumrole_enumFilter<"Question"> | $Enums.role_enum
    term?: StringFilter<"Question"> | string
    answers?: ApplicationAnswerListRelationFilter
  }

  export type QuestionOrderByWithRelationInput = {
    id?: SortOrder
    question_id?: SortOrder
    question?: SortOrder
    is_required?: SortOrder
    order_num?: SortOrder
    max_length?: SortOrder
    placeholder?: SortOrderInput | SortOrder
    help_text?: SortOrderInput | SortOrder
    role?: SortOrder
    term?: SortOrder
    answers?: ApplicationAnswerOrderByRelationAggregateInput
  }

  export type QuestionWhereUniqueInput = Prisma.AtLeast<{
    id?: bigint | number
    term_question_id?: QuestionTermQuestion_idCompoundUniqueInput
    AND?: QuestionWhereInput | QuestionWhereInput[]
    OR?: QuestionWhereInput[]
    NOT?: QuestionWhereInput | QuestionWhereInput[]
    question_id?: StringFilter<"Question"> | string
    question?: StringFilter<"Question"> | string
    is_required?: BoolFilter<"Question"> | boolean
    order_num?: IntFilter<"Question"> | number
    max_length?: IntFilter<"Question"> | number
    placeholder?: StringNullableFilter<"Question"> | string | null
    help_text?: StringNullableFilter<"Question"> | string | null
    role?: Enumrole_enumFilter<"Question"> | $Enums.role_enum
    term?: StringFilter<"Question"> | string
    answers?: ApplicationAnswerListRelationFilter
  }, "id" | "term_question_id">

  export type QuestionOrderByWithAggregationInput = {
    id?: SortOrder
    question_id?: SortOrder
    question?: SortOrder
    is_required?: SortOrder
    order_num?: SortOrder
    max_length?: SortOrder
    placeholder?: SortOrderInput | SortOrder
    help_text?: SortOrderInput | SortOrder
    role?: SortOrder
    term?: SortOrder
    _count?: QuestionCountOrderByAggregateInput
    _avg?: QuestionAvgOrderByAggregateInput
    _max?: QuestionMaxOrderByAggregateInput
    _min?: QuestionMinOrderByAggregateInput
    _sum?: QuestionSumOrderByAggregateInput
  }

  export type QuestionScalarWhereWithAggregatesInput = {
    AND?: QuestionScalarWhereWithAggregatesInput | QuestionScalarWhereWithAggregatesInput[]
    OR?: QuestionScalarWhereWithAggregatesInput[]
    NOT?: QuestionScalarWhereWithAggregatesInput | QuestionScalarWhereWithAggregatesInput[]
    id?: BigIntWithAggregatesFilter<"Question"> | bigint | number
    question_id?: StringWithAggregatesFilter<"Question"> | string
    question?: StringWithAggregatesFilter<"Question"> | string
    is_required?: BoolWithAggregatesFilter<"Question"> | boolean
    order_num?: IntWithAggregatesFilter<"Question"> | number
    max_length?: IntWithAggregatesFilter<"Question"> | number
    placeholder?: StringNullableWithAggregatesFilter<"Question"> | string | null
    help_text?: StringNullableWithAggregatesFilter<"Question"> | string | null
    role?: Enumrole_enumWithAggregatesFilter<"Question"> | $Enums.role_enum
    term?: StringWithAggregatesFilter<"Question"> | string
  }

  export type ResumeWhereInput = {
    AND?: ResumeWhereInput | ResumeWhereInput[]
    OR?: ResumeWhereInput[]
    NOT?: ResumeWhereInput | ResumeWhereInput[]
    id?: BigIntFilter<"Resume"> | bigint | number
    profile_id?: UuidFilter<"Resume"> | string
    file_path?: StringFilter<"Resume"> | string
    created_at?: DateTimeFilter<"Resume"> | Date | string
    profile?: XOR<ProfileScalarRelationFilter, ProfileWhereInput>
    applications?: ApplicationListRelationFilter
  }

  export type ResumeOrderByWithRelationInput = {
    id?: SortOrder
    profile_id?: SortOrder
    file_path?: SortOrder
    created_at?: SortOrder
    profile?: ProfileOrderByWithRelationInput
    applications?: ApplicationOrderByRelationAggregateInput
  }

  export type ResumeWhereUniqueInput = Prisma.AtLeast<{
    id?: bigint | number
    file_path?: string
    AND?: ResumeWhereInput | ResumeWhereInput[]
    OR?: ResumeWhereInput[]
    NOT?: ResumeWhereInput | ResumeWhereInput[]
    profile_id?: UuidFilter<"Resume"> | string
    created_at?: DateTimeFilter<"Resume"> | Date | string
    profile?: XOR<ProfileScalarRelationFilter, ProfileWhereInput>
    applications?: ApplicationListRelationFilter
  }, "id" | "file_path">

  export type ResumeOrderByWithAggregationInput = {
    id?: SortOrder
    profile_id?: SortOrder
    file_path?: SortOrder
    created_at?: SortOrder
    _count?: ResumeCountOrderByAggregateInput
    _avg?: ResumeAvgOrderByAggregateInput
    _max?: ResumeMaxOrderByAggregateInput
    _min?: ResumeMinOrderByAggregateInput
    _sum?: ResumeSumOrderByAggregateInput
  }

  export type ResumeScalarWhereWithAggregatesInput = {
    AND?: ResumeScalarWhereWithAggregatesInput | ResumeScalarWhereWithAggregatesInput[]
    OR?: ResumeScalarWhereWithAggregatesInput[]
    NOT?: ResumeScalarWhereWithAggregatesInput | ResumeScalarWhereWithAggregatesInput[]
    id?: BigIntWithAggregatesFilter<"Resume"> | bigint | number
    profile_id?: UuidWithAggregatesFilter<"Resume"> | string
    file_path?: StringWithAggregatesFilter<"Resume"> | string
    created_at?: DateTimeWithAggregatesFilter<"Resume"> | Date | string
  }

  export type SponsorWhereInput = {
    AND?: SponsorWhereInput | SponsorWhereInput[]
    OR?: SponsorWhereInput[]
    NOT?: SponsorWhereInput | SponsorWhereInput[]
    id?: BigIntFilter<"Sponsor"> | bigint | number
    name?: StringFilter<"Sponsor"> | string
    logo_url?: StringFilter<"Sponsor"> | string
    website_url?: StringFilter<"Sponsor"> | string
    tier?: Enumsponsor_tier_enumFilter<"Sponsor"> | $Enums.sponsor_tier_enum
    created_at?: DateTimeFilter<"Sponsor"> | Date | string
  }

  export type SponsorOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    logo_url?: SortOrder
    website_url?: SortOrder
    tier?: SortOrder
    created_at?: SortOrder
  }

  export type SponsorWhereUniqueInput = Prisma.AtLeast<{
    id?: bigint | number
    name?: string
    AND?: SponsorWhereInput | SponsorWhereInput[]
    OR?: SponsorWhereInput[]
    NOT?: SponsorWhereInput | SponsorWhereInput[]
    logo_url?: StringFilter<"Sponsor"> | string
    website_url?: StringFilter<"Sponsor"> | string
    tier?: Enumsponsor_tier_enumFilter<"Sponsor"> | $Enums.sponsor_tier_enum
    created_at?: DateTimeFilter<"Sponsor"> | Date | string
  }, "id" | "name">

  export type SponsorOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    logo_url?: SortOrder
    website_url?: SortOrder
    tier?: SortOrder
    created_at?: SortOrder
    _count?: SponsorCountOrderByAggregateInput
    _avg?: SponsorAvgOrderByAggregateInput
    _max?: SponsorMaxOrderByAggregateInput
    _min?: SponsorMinOrderByAggregateInput
    _sum?: SponsorSumOrderByAggregateInput
  }

  export type SponsorScalarWhereWithAggregatesInput = {
    AND?: SponsorScalarWhereWithAggregatesInput | SponsorScalarWhereWithAggregatesInput[]
    OR?: SponsorScalarWhereWithAggregatesInput[]
    NOT?: SponsorScalarWhereWithAggregatesInput | SponsorScalarWhereWithAggregatesInput[]
    id?: BigIntWithAggregatesFilter<"Sponsor"> | bigint | number
    name?: StringWithAggregatesFilter<"Sponsor"> | string
    logo_url?: StringWithAggregatesFilter<"Sponsor"> | string
    website_url?: StringWithAggregatesFilter<"Sponsor"> | string
    tier?: Enumsponsor_tier_enumWithAggregatesFilter<"Sponsor"> | $Enums.sponsor_tier_enum
    created_at?: DateTimeWithAggregatesFilter<"Sponsor"> | Date | string
  }

  export type TeamMemberWhereInput = {
    AND?: TeamMemberWhereInput | TeamMemberWhereInput[]
    OR?: TeamMemberWhereInput[]
    NOT?: TeamMemberWhereInput | TeamMemberWhereInput[]
    id?: BigIntFilter<"TeamMember"> | bigint | number
    team_id?: BigIntFilter<"TeamMember"> | bigint | number
    profile_id?: UuidFilter<"TeamMember"> | string
    role?: Enumteam_role_enumFilter<"TeamMember"> | $Enums.team_role_enum
    created_at?: DateTimeFilter<"TeamMember"> | Date | string
    joined_at?: DateTimeFilter<"TeamMember"> | Date | string
    team?: XOR<TeamScalarRelationFilter, TeamWhereInput>
    profile?: XOR<ProfileScalarRelationFilter, ProfileWhereInput>
  }

  export type TeamMemberOrderByWithRelationInput = {
    id?: SortOrder
    team_id?: SortOrder
    profile_id?: SortOrder
    role?: SortOrder
    created_at?: SortOrder
    joined_at?: SortOrder
    team?: TeamOrderByWithRelationInput
    profile?: ProfileOrderByWithRelationInput
  }

  export type TeamMemberWhereUniqueInput = Prisma.AtLeast<{
    id?: bigint | number
    team_id_profile_id?: TeamMemberTeam_idProfile_idCompoundUniqueInput
    AND?: TeamMemberWhereInput | TeamMemberWhereInput[]
    OR?: TeamMemberWhereInput[]
    NOT?: TeamMemberWhereInput | TeamMemberWhereInput[]
    team_id?: BigIntFilter<"TeamMember"> | bigint | number
    profile_id?: UuidFilter<"TeamMember"> | string
    role?: Enumteam_role_enumFilter<"TeamMember"> | $Enums.team_role_enum
    created_at?: DateTimeFilter<"TeamMember"> | Date | string
    joined_at?: DateTimeFilter<"TeamMember"> | Date | string
    team?: XOR<TeamScalarRelationFilter, TeamWhereInput>
    profile?: XOR<ProfileScalarRelationFilter, ProfileWhereInput>
  }, "id" | "team_id_profile_id">

  export type TeamMemberOrderByWithAggregationInput = {
    id?: SortOrder
    team_id?: SortOrder
    profile_id?: SortOrder
    role?: SortOrder
    created_at?: SortOrder
    joined_at?: SortOrder
    _count?: TeamMemberCountOrderByAggregateInput
    _avg?: TeamMemberAvgOrderByAggregateInput
    _max?: TeamMemberMaxOrderByAggregateInput
    _min?: TeamMemberMinOrderByAggregateInput
    _sum?: TeamMemberSumOrderByAggregateInput
  }

  export type TeamMemberScalarWhereWithAggregatesInput = {
    AND?: TeamMemberScalarWhereWithAggregatesInput | TeamMemberScalarWhereWithAggregatesInput[]
    OR?: TeamMemberScalarWhereWithAggregatesInput[]
    NOT?: TeamMemberScalarWhereWithAggregatesInput | TeamMemberScalarWhereWithAggregatesInput[]
    id?: BigIntWithAggregatesFilter<"TeamMember"> | bigint | number
    team_id?: BigIntWithAggregatesFilter<"TeamMember"> | bigint | number
    profile_id?: UuidWithAggregatesFilter<"TeamMember"> | string
    role?: Enumteam_role_enumWithAggregatesFilter<"TeamMember"> | $Enums.team_role_enum
    created_at?: DateTimeWithAggregatesFilter<"TeamMember"> | Date | string
    joined_at?: DateTimeWithAggregatesFilter<"TeamMember"> | Date | string
  }

  export type TeamWhereInput = {
    AND?: TeamWhereInput | TeamWhereInput[]
    OR?: TeamWhereInput[]
    NOT?: TeamWhereInput | TeamWhereInput[]
    id?: BigIntFilter<"Team"> | bigint | number
    team_name?: StringFilter<"Team"> | string
    team_size?: IntFilter<"Team"> | number
    is_recruiting?: BoolFilter<"Team"> | boolean
    created_at?: DateTimeFilter<"Team"> | Date | string
    members?: TeamMemberListRelationFilter
  }

  export type TeamOrderByWithRelationInput = {
    id?: SortOrder
    team_name?: SortOrder
    team_size?: SortOrder
    is_recruiting?: SortOrder
    created_at?: SortOrder
    members?: TeamMemberOrderByRelationAggregateInput
  }

  export type TeamWhereUniqueInput = Prisma.AtLeast<{
    id?: bigint | number
    team_name?: string
    AND?: TeamWhereInput | TeamWhereInput[]
    OR?: TeamWhereInput[]
    NOT?: TeamWhereInput | TeamWhereInput[]
    team_size?: IntFilter<"Team"> | number
    is_recruiting?: BoolFilter<"Team"> | boolean
    created_at?: DateTimeFilter<"Team"> | Date | string
    members?: TeamMemberListRelationFilter
  }, "id" | "team_name">

  export type TeamOrderByWithAggregationInput = {
    id?: SortOrder
    team_name?: SortOrder
    team_size?: SortOrder
    is_recruiting?: SortOrder
    created_at?: SortOrder
    _count?: TeamCountOrderByAggregateInput
    _avg?: TeamAvgOrderByAggregateInput
    _max?: TeamMaxOrderByAggregateInput
    _min?: TeamMinOrderByAggregateInput
    _sum?: TeamSumOrderByAggregateInput
  }

  export type TeamScalarWhereWithAggregatesInput = {
    AND?: TeamScalarWhereWithAggregatesInput | TeamScalarWhereWithAggregatesInput[]
    OR?: TeamScalarWhereWithAggregatesInput[]
    NOT?: TeamScalarWhereWithAggregatesInput | TeamScalarWhereWithAggregatesInput[]
    id?: BigIntWithAggregatesFilter<"Team"> | bigint | number
    team_name?: StringWithAggregatesFilter<"Team"> | string
    team_size?: IntWithAggregatesFilter<"Team"> | number
    is_recruiting?: BoolWithAggregatesFilter<"Team"> | boolean
    created_at?: DateTimeWithAggregatesFilter<"Team"> | Date | string
  }

  export type ApplicationAnswerCreateInput = {
    id?: bigint | number
    answer?: string | null
    created_at?: Date | string
    updated_at?: Date | string
    application: ApplicationCreateNestedOneWithoutAnswersInput
    question: QuestionCreateNestedOneWithoutAnswersInput
  }

  export type ApplicationAnswerUncheckedCreateInput = {
    id?: bigint | number
    application_id: bigint | number
    question_id: bigint | number
    answer?: string | null
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type ApplicationAnswerUpdateInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    answer?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    application?: ApplicationUpdateOneRequiredWithoutAnswersNestedInput
    question?: QuestionUpdateOneRequiredWithoutAnswersNestedInput
  }

  export type ApplicationAnswerUncheckedUpdateInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    application_id?: BigIntFieldUpdateOperationsInput | bigint | number
    question_id?: BigIntFieldUpdateOperationsInput | bigint | number
    answer?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ApplicationAnswerCreateManyInput = {
    id?: bigint | number
    application_id: bigint | number
    question_id: bigint | number
    answer?: string | null
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type ApplicationAnswerUpdateManyMutationInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    answer?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ApplicationAnswerUncheckedUpdateManyInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    application_id?: BigIntFieldUpdateOperationsInput | bigint | number
    question_id?: BigIntFieldUpdateOperationsInput | bigint | number
    answer?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ApplicationCreateInput = {
    id?: bigint | number
    status?: $Enums.application_status_enum
    role: $Enums.role_enum
    term: string
    comments?: string | null
    created_at?: Date | string
    updated_at?: Date | string
    submitted_at?: Date | string | null
    profile: ProfileCreateNestedOneWithoutApplicationsInput
    resume?: ResumeCreateNestedOneWithoutApplicationsInput
    answers?: ApplicationAnswerCreateNestedManyWithoutApplicationInput
  }

  export type ApplicationUncheckedCreateInput = {
    id?: bigint | number
    profile_id: string
    resume_id?: bigint | number | null
    status?: $Enums.application_status_enum
    role: $Enums.role_enum
    term: string
    comments?: string | null
    created_at?: Date | string
    updated_at?: Date | string
    submitted_at?: Date | string | null
    answers?: ApplicationAnswerUncheckedCreateNestedManyWithoutApplicationInput
  }

  export type ApplicationUpdateInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    status?: Enumapplication_status_enumFieldUpdateOperationsInput | $Enums.application_status_enum
    role?: Enumrole_enumFieldUpdateOperationsInput | $Enums.role_enum
    term?: StringFieldUpdateOperationsInput | string
    comments?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    submitted_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    profile?: ProfileUpdateOneRequiredWithoutApplicationsNestedInput
    resume?: ResumeUpdateOneWithoutApplicationsNestedInput
    answers?: ApplicationAnswerUpdateManyWithoutApplicationNestedInput
  }

  export type ApplicationUncheckedUpdateInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    profile_id?: StringFieldUpdateOperationsInput | string
    resume_id?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
    status?: Enumapplication_status_enumFieldUpdateOperationsInput | $Enums.application_status_enum
    role?: Enumrole_enumFieldUpdateOperationsInput | $Enums.role_enum
    term?: StringFieldUpdateOperationsInput | string
    comments?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    submitted_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    answers?: ApplicationAnswerUncheckedUpdateManyWithoutApplicationNestedInput
  }

  export type ApplicationCreateManyInput = {
    id?: bigint | number
    profile_id: string
    resume_id?: bigint | number | null
    status?: $Enums.application_status_enum
    role: $Enums.role_enum
    term: string
    comments?: string | null
    created_at?: Date | string
    updated_at?: Date | string
    submitted_at?: Date | string | null
  }

  export type ApplicationUpdateManyMutationInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    status?: Enumapplication_status_enumFieldUpdateOperationsInput | $Enums.application_status_enum
    role?: Enumrole_enumFieldUpdateOperationsInput | $Enums.role_enum
    term?: StringFieldUpdateOperationsInput | string
    comments?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    submitted_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type ApplicationUncheckedUpdateManyInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    profile_id?: StringFieldUpdateOperationsInput | string
    resume_id?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
    status?: Enumapplication_status_enumFieldUpdateOperationsInput | $Enums.application_status_enum
    role?: Enumrole_enumFieldUpdateOperationsInput | $Enums.role_enum
    term?: StringFieldUpdateOperationsInput | string
    comments?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    submitted_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type EventAttendanceCreateInput = {
    id?: bigint | number
    checked_in?: boolean
    created_at?: Date | string
    event: EventCreateNestedOneWithoutAttendanceInput
    profile: ProfileCreateNestedOneWithoutEventAttendanceInput
  }

  export type EventAttendanceUncheckedCreateInput = {
    id?: bigint | number
    event_id: bigint | number
    profile_id: string
    checked_in?: boolean
    created_at?: Date | string
  }

  export type EventAttendanceUpdateInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    checked_in?: BoolFieldUpdateOperationsInput | boolean
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    event?: EventUpdateOneRequiredWithoutAttendanceNestedInput
    profile?: ProfileUpdateOneRequiredWithoutEventAttendanceNestedInput
  }

  export type EventAttendanceUncheckedUpdateInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    event_id?: BigIntFieldUpdateOperationsInput | bigint | number
    profile_id?: StringFieldUpdateOperationsInput | string
    checked_in?: BoolFieldUpdateOperationsInput | boolean
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type EventAttendanceCreateManyInput = {
    id?: bigint | number
    event_id: bigint | number
    profile_id: string
    checked_in?: boolean
    created_at?: Date | string
  }

  export type EventAttendanceUpdateManyMutationInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    checked_in?: BoolFieldUpdateOperationsInput | boolean
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type EventAttendanceUncheckedUpdateManyInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    event_id?: BigIntFieldUpdateOperationsInput | bigint | number
    profile_id?: StringFieldUpdateOperationsInput | string
    checked_in?: BoolFieldUpdateOperationsInput | boolean
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type EventCreateInput = {
    id?: bigint | number
    name: string
    registration_required: boolean
    description?: string | null
    location?: string | null
    start_time: Date | string
    buffered_start_time: Date | string
    end_time: Date | string
    buffered_end_time: Date | string
    payment_required?: boolean
    image_id?: bigint | number | null
    created_at?: Date | string
    updated_at?: Date | string
    attendance?: EventAttendanceCreateNestedManyWithoutEventInput
  }

  export type EventUncheckedCreateInput = {
    id?: bigint | number
    name: string
    registration_required: boolean
    description?: string | null
    location?: string | null
    start_time: Date | string
    buffered_start_time: Date | string
    end_time: Date | string
    buffered_end_time: Date | string
    payment_required?: boolean
    image_id?: bigint | number | null
    created_at?: Date | string
    updated_at?: Date | string
    attendance?: EventAttendanceUncheckedCreateNestedManyWithoutEventInput
  }

  export type EventUpdateInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    name?: StringFieldUpdateOperationsInput | string
    registration_required?: BoolFieldUpdateOperationsInput | boolean
    description?: NullableStringFieldUpdateOperationsInput | string | null
    location?: NullableStringFieldUpdateOperationsInput | string | null
    start_time?: DateTimeFieldUpdateOperationsInput | Date | string
    buffered_start_time?: DateTimeFieldUpdateOperationsInput | Date | string
    end_time?: DateTimeFieldUpdateOperationsInput | Date | string
    buffered_end_time?: DateTimeFieldUpdateOperationsInput | Date | string
    payment_required?: BoolFieldUpdateOperationsInput | boolean
    image_id?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    attendance?: EventAttendanceUpdateManyWithoutEventNestedInput
  }

  export type EventUncheckedUpdateInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    name?: StringFieldUpdateOperationsInput | string
    registration_required?: BoolFieldUpdateOperationsInput | boolean
    description?: NullableStringFieldUpdateOperationsInput | string | null
    location?: NullableStringFieldUpdateOperationsInput | string | null
    start_time?: DateTimeFieldUpdateOperationsInput | Date | string
    buffered_start_time?: DateTimeFieldUpdateOperationsInput | Date | string
    end_time?: DateTimeFieldUpdateOperationsInput | Date | string
    buffered_end_time?: DateTimeFieldUpdateOperationsInput | Date | string
    payment_required?: BoolFieldUpdateOperationsInput | boolean
    image_id?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    attendance?: EventAttendanceUncheckedUpdateManyWithoutEventNestedInput
  }

  export type EventCreateManyInput = {
    id?: bigint | number
    name: string
    registration_required: boolean
    description?: string | null
    location?: string | null
    start_time: Date | string
    buffered_start_time: Date | string
    end_time: Date | string
    buffered_end_time: Date | string
    payment_required?: boolean
    image_id?: bigint | number | null
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type EventUpdateManyMutationInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    name?: StringFieldUpdateOperationsInput | string
    registration_required?: BoolFieldUpdateOperationsInput | boolean
    description?: NullableStringFieldUpdateOperationsInput | string | null
    location?: NullableStringFieldUpdateOperationsInput | string | null
    start_time?: DateTimeFieldUpdateOperationsInput | Date | string
    buffered_start_time?: DateTimeFieldUpdateOperationsInput | Date | string
    end_time?: DateTimeFieldUpdateOperationsInput | Date | string
    buffered_end_time?: DateTimeFieldUpdateOperationsInput | Date | string
    payment_required?: BoolFieldUpdateOperationsInput | boolean
    image_id?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type EventUncheckedUpdateManyInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    name?: StringFieldUpdateOperationsInput | string
    registration_required?: BoolFieldUpdateOperationsInput | boolean
    description?: NullableStringFieldUpdateOperationsInput | string | null
    location?: NullableStringFieldUpdateOperationsInput | string | null
    start_time?: DateTimeFieldUpdateOperationsInput | Date | string
    buffered_start_time?: DateTimeFieldUpdateOperationsInput | Date | string
    end_time?: DateTimeFieldUpdateOperationsInput | Date | string
    buffered_end_time?: DateTimeFieldUpdateOperationsInput | Date | string
    payment_required?: BoolFieldUpdateOperationsInput | boolean
    image_id?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProfileCreateInput = {
    id?: string
    first_name: string
    last_name: string
    role?: $Enums.role_enum
    nfc_id?: bigint | number | null
    created_at?: Date | string
    updated_at?: Date | string
    resumes?: ResumeCreateNestedManyWithoutProfileInput
    applications?: ApplicationCreateNestedManyWithoutProfileInput
    eventAttendance?: EventAttendanceCreateNestedManyWithoutProfileInput
    teamMembers?: TeamMemberCreateNestedManyWithoutProfileInput
  }

  export type ProfileUncheckedCreateInput = {
    id?: string
    first_name: string
    last_name: string
    role?: $Enums.role_enum
    nfc_id?: bigint | number | null
    created_at?: Date | string
    updated_at?: Date | string
    resumes?: ResumeUncheckedCreateNestedManyWithoutProfileInput
    applications?: ApplicationUncheckedCreateNestedManyWithoutProfileInput
    eventAttendance?: EventAttendanceUncheckedCreateNestedManyWithoutProfileInput
    teamMembers?: TeamMemberUncheckedCreateNestedManyWithoutProfileInput
  }

  export type ProfileUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    first_name?: StringFieldUpdateOperationsInput | string
    last_name?: StringFieldUpdateOperationsInput | string
    role?: Enumrole_enumFieldUpdateOperationsInput | $Enums.role_enum
    nfc_id?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    resumes?: ResumeUpdateManyWithoutProfileNestedInput
    applications?: ApplicationUpdateManyWithoutProfileNestedInput
    eventAttendance?: EventAttendanceUpdateManyWithoutProfileNestedInput
    teamMembers?: TeamMemberUpdateManyWithoutProfileNestedInput
  }

  export type ProfileUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    first_name?: StringFieldUpdateOperationsInput | string
    last_name?: StringFieldUpdateOperationsInput | string
    role?: Enumrole_enumFieldUpdateOperationsInput | $Enums.role_enum
    nfc_id?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    resumes?: ResumeUncheckedUpdateManyWithoutProfileNestedInput
    applications?: ApplicationUncheckedUpdateManyWithoutProfileNestedInput
    eventAttendance?: EventAttendanceUncheckedUpdateManyWithoutProfileNestedInput
    teamMembers?: TeamMemberUncheckedUpdateManyWithoutProfileNestedInput
  }

  export type ProfileCreateManyInput = {
    id?: string
    first_name: string
    last_name: string
    role?: $Enums.role_enum
    nfc_id?: bigint | number | null
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type ProfileUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    first_name?: StringFieldUpdateOperationsInput | string
    last_name?: StringFieldUpdateOperationsInput | string
    role?: Enumrole_enumFieldUpdateOperationsInput | $Enums.role_enum
    nfc_id?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProfileUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    first_name?: StringFieldUpdateOperationsInput | string
    last_name?: StringFieldUpdateOperationsInput | string
    role?: Enumrole_enumFieldUpdateOperationsInput | $Enums.role_enum
    nfc_id?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type QuestionCreateInput = {
    id?: bigint | number
    question_id: string
    question: string
    is_required?: boolean
    order_num: number
    max_length: number
    placeholder?: string | null
    help_text?: string | null
    role: $Enums.role_enum
    term: string
    answers?: ApplicationAnswerCreateNestedManyWithoutQuestionInput
  }

  export type QuestionUncheckedCreateInput = {
    id?: bigint | number
    question_id: string
    question: string
    is_required?: boolean
    order_num: number
    max_length: number
    placeholder?: string | null
    help_text?: string | null
    role: $Enums.role_enum
    term: string
    answers?: ApplicationAnswerUncheckedCreateNestedManyWithoutQuestionInput
  }

  export type QuestionUpdateInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    question_id?: StringFieldUpdateOperationsInput | string
    question?: StringFieldUpdateOperationsInput | string
    is_required?: BoolFieldUpdateOperationsInput | boolean
    order_num?: IntFieldUpdateOperationsInput | number
    max_length?: IntFieldUpdateOperationsInput | number
    placeholder?: NullableStringFieldUpdateOperationsInput | string | null
    help_text?: NullableStringFieldUpdateOperationsInput | string | null
    role?: Enumrole_enumFieldUpdateOperationsInput | $Enums.role_enum
    term?: StringFieldUpdateOperationsInput | string
    answers?: ApplicationAnswerUpdateManyWithoutQuestionNestedInput
  }

  export type QuestionUncheckedUpdateInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    question_id?: StringFieldUpdateOperationsInput | string
    question?: StringFieldUpdateOperationsInput | string
    is_required?: BoolFieldUpdateOperationsInput | boolean
    order_num?: IntFieldUpdateOperationsInput | number
    max_length?: IntFieldUpdateOperationsInput | number
    placeholder?: NullableStringFieldUpdateOperationsInput | string | null
    help_text?: NullableStringFieldUpdateOperationsInput | string | null
    role?: Enumrole_enumFieldUpdateOperationsInput | $Enums.role_enum
    term?: StringFieldUpdateOperationsInput | string
    answers?: ApplicationAnswerUncheckedUpdateManyWithoutQuestionNestedInput
  }

  export type QuestionCreateManyInput = {
    id?: bigint | number
    question_id: string
    question: string
    is_required?: boolean
    order_num: number
    max_length: number
    placeholder?: string | null
    help_text?: string | null
    role: $Enums.role_enum
    term: string
  }

  export type QuestionUpdateManyMutationInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    question_id?: StringFieldUpdateOperationsInput | string
    question?: StringFieldUpdateOperationsInput | string
    is_required?: BoolFieldUpdateOperationsInput | boolean
    order_num?: IntFieldUpdateOperationsInput | number
    max_length?: IntFieldUpdateOperationsInput | number
    placeholder?: NullableStringFieldUpdateOperationsInput | string | null
    help_text?: NullableStringFieldUpdateOperationsInput | string | null
    role?: Enumrole_enumFieldUpdateOperationsInput | $Enums.role_enum
    term?: StringFieldUpdateOperationsInput | string
  }

  export type QuestionUncheckedUpdateManyInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    question_id?: StringFieldUpdateOperationsInput | string
    question?: StringFieldUpdateOperationsInput | string
    is_required?: BoolFieldUpdateOperationsInput | boolean
    order_num?: IntFieldUpdateOperationsInput | number
    max_length?: IntFieldUpdateOperationsInput | number
    placeholder?: NullableStringFieldUpdateOperationsInput | string | null
    help_text?: NullableStringFieldUpdateOperationsInput | string | null
    role?: Enumrole_enumFieldUpdateOperationsInput | $Enums.role_enum
    term?: StringFieldUpdateOperationsInput | string
  }

  export type ResumeCreateInput = {
    id?: bigint | number
    file_path: string
    created_at?: Date | string
    profile: ProfileCreateNestedOneWithoutResumesInput
    applications?: ApplicationCreateNestedManyWithoutResumeInput
  }

  export type ResumeUncheckedCreateInput = {
    id?: bigint | number
    profile_id: string
    file_path: string
    created_at?: Date | string
    applications?: ApplicationUncheckedCreateNestedManyWithoutResumeInput
  }

  export type ResumeUpdateInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    file_path?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    profile?: ProfileUpdateOneRequiredWithoutResumesNestedInput
    applications?: ApplicationUpdateManyWithoutResumeNestedInput
  }

  export type ResumeUncheckedUpdateInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    profile_id?: StringFieldUpdateOperationsInput | string
    file_path?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    applications?: ApplicationUncheckedUpdateManyWithoutResumeNestedInput
  }

  export type ResumeCreateManyInput = {
    id?: bigint | number
    profile_id: string
    file_path: string
    created_at?: Date | string
  }

  export type ResumeUpdateManyMutationInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    file_path?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ResumeUncheckedUpdateManyInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    profile_id?: StringFieldUpdateOperationsInput | string
    file_path?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SponsorCreateInput = {
    id?: bigint | number
    name: string
    logo_url: string
    website_url: string
    tier?: $Enums.sponsor_tier_enum
    created_at?: Date | string
  }

  export type SponsorUncheckedCreateInput = {
    id?: bigint | number
    name: string
    logo_url: string
    website_url: string
    tier?: $Enums.sponsor_tier_enum
    created_at?: Date | string
  }

  export type SponsorUpdateInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    name?: StringFieldUpdateOperationsInput | string
    logo_url?: StringFieldUpdateOperationsInput | string
    website_url?: StringFieldUpdateOperationsInput | string
    tier?: Enumsponsor_tier_enumFieldUpdateOperationsInput | $Enums.sponsor_tier_enum
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SponsorUncheckedUpdateInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    name?: StringFieldUpdateOperationsInput | string
    logo_url?: StringFieldUpdateOperationsInput | string
    website_url?: StringFieldUpdateOperationsInput | string
    tier?: Enumsponsor_tier_enumFieldUpdateOperationsInput | $Enums.sponsor_tier_enum
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SponsorCreateManyInput = {
    id?: bigint | number
    name: string
    logo_url: string
    website_url: string
    tier?: $Enums.sponsor_tier_enum
    created_at?: Date | string
  }

  export type SponsorUpdateManyMutationInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    name?: StringFieldUpdateOperationsInput | string
    logo_url?: StringFieldUpdateOperationsInput | string
    website_url?: StringFieldUpdateOperationsInput | string
    tier?: Enumsponsor_tier_enumFieldUpdateOperationsInput | $Enums.sponsor_tier_enum
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SponsorUncheckedUpdateManyInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    name?: StringFieldUpdateOperationsInput | string
    logo_url?: StringFieldUpdateOperationsInput | string
    website_url?: StringFieldUpdateOperationsInput | string
    tier?: Enumsponsor_tier_enumFieldUpdateOperationsInput | $Enums.sponsor_tier_enum
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TeamMemberCreateInput = {
    id?: bigint | number
    role?: $Enums.team_role_enum
    created_at?: Date | string
    joined_at?: Date | string
    team: TeamCreateNestedOneWithoutMembersInput
    profile: ProfileCreateNestedOneWithoutTeamMembersInput
  }

  export type TeamMemberUncheckedCreateInput = {
    id?: bigint | number
    team_id: bigint | number
    profile_id: string
    role?: $Enums.team_role_enum
    created_at?: Date | string
    joined_at?: Date | string
  }

  export type TeamMemberUpdateInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    role?: Enumteam_role_enumFieldUpdateOperationsInput | $Enums.team_role_enum
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    joined_at?: DateTimeFieldUpdateOperationsInput | Date | string
    team?: TeamUpdateOneRequiredWithoutMembersNestedInput
    profile?: ProfileUpdateOneRequiredWithoutTeamMembersNestedInput
  }

  export type TeamMemberUncheckedUpdateInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    team_id?: BigIntFieldUpdateOperationsInput | bigint | number
    profile_id?: StringFieldUpdateOperationsInput | string
    role?: Enumteam_role_enumFieldUpdateOperationsInput | $Enums.team_role_enum
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    joined_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TeamMemberCreateManyInput = {
    id?: bigint | number
    team_id: bigint | number
    profile_id: string
    role?: $Enums.team_role_enum
    created_at?: Date | string
    joined_at?: Date | string
  }

  export type TeamMemberUpdateManyMutationInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    role?: Enumteam_role_enumFieldUpdateOperationsInput | $Enums.team_role_enum
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    joined_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TeamMemberUncheckedUpdateManyInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    team_id?: BigIntFieldUpdateOperationsInput | bigint | number
    profile_id?: StringFieldUpdateOperationsInput | string
    role?: Enumteam_role_enumFieldUpdateOperationsInput | $Enums.team_role_enum
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    joined_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TeamCreateInput = {
    id?: bigint | number
    team_name: string
    team_size?: number
    is_recruiting?: boolean
    created_at?: Date | string
    members?: TeamMemberCreateNestedManyWithoutTeamInput
  }

  export type TeamUncheckedCreateInput = {
    id?: bigint | number
    team_name: string
    team_size?: number
    is_recruiting?: boolean
    created_at?: Date | string
    members?: TeamMemberUncheckedCreateNestedManyWithoutTeamInput
  }

  export type TeamUpdateInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    team_name?: StringFieldUpdateOperationsInput | string
    team_size?: IntFieldUpdateOperationsInput | number
    is_recruiting?: BoolFieldUpdateOperationsInput | boolean
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    members?: TeamMemberUpdateManyWithoutTeamNestedInput
  }

  export type TeamUncheckedUpdateInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    team_name?: StringFieldUpdateOperationsInput | string
    team_size?: IntFieldUpdateOperationsInput | number
    is_recruiting?: BoolFieldUpdateOperationsInput | boolean
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    members?: TeamMemberUncheckedUpdateManyWithoutTeamNestedInput
  }

  export type TeamCreateManyInput = {
    id?: bigint | number
    team_name: string
    team_size?: number
    is_recruiting?: boolean
    created_at?: Date | string
  }

  export type TeamUpdateManyMutationInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    team_name?: StringFieldUpdateOperationsInput | string
    team_size?: IntFieldUpdateOperationsInput | number
    is_recruiting?: BoolFieldUpdateOperationsInput | boolean
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TeamUncheckedUpdateManyInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    team_name?: StringFieldUpdateOperationsInput | string
    team_size?: IntFieldUpdateOperationsInput | number
    is_recruiting?: BoolFieldUpdateOperationsInput | boolean
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type BigIntFilter<$PrismaModel = never> = {
    equals?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    in?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel>
    notIn?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel>
    lt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    lte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    not?: NestedBigIntFilter<$PrismaModel> | bigint | number
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type ApplicationScalarRelationFilter = {
    is?: ApplicationWhereInput
    isNot?: ApplicationWhereInput
  }

  export type QuestionScalarRelationFilter = {
    is?: QuestionWhereInput
    isNot?: QuestionWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type ApplicationAnswerApplication_idQuestion_idCompoundUniqueInput = {
    application_id: bigint | number
    question_id: bigint | number
  }

  export type ApplicationAnswerCountOrderByAggregateInput = {
    id?: SortOrder
    application_id?: SortOrder
    question_id?: SortOrder
    answer?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type ApplicationAnswerAvgOrderByAggregateInput = {
    id?: SortOrder
    application_id?: SortOrder
    question_id?: SortOrder
  }

  export type ApplicationAnswerMaxOrderByAggregateInput = {
    id?: SortOrder
    application_id?: SortOrder
    question_id?: SortOrder
    answer?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type ApplicationAnswerMinOrderByAggregateInput = {
    id?: SortOrder
    application_id?: SortOrder
    question_id?: SortOrder
    answer?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type ApplicationAnswerSumOrderByAggregateInput = {
    id?: SortOrder
    application_id?: SortOrder
    question_id?: SortOrder
  }

  export type BigIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    in?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel>
    notIn?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel>
    lt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    lte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    not?: NestedBigIntWithAggregatesFilter<$PrismaModel> | bigint | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedBigIntFilter<$PrismaModel>
    _min?: NestedBigIntFilter<$PrismaModel>
    _max?: NestedBigIntFilter<$PrismaModel>
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type UuidFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedUuidFilter<$PrismaModel> | string
  }

  export type BigIntNullableFilter<$PrismaModel = never> = {
    equals?: bigint | number | BigIntFieldRefInput<$PrismaModel> | null
    in?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel> | null
    notIn?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel> | null
    lt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    lte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    not?: NestedBigIntNullableFilter<$PrismaModel> | bigint | number | null
  }

  export type Enumapplication_status_enumFilter<$PrismaModel = never> = {
    equals?: $Enums.application_status_enum | Enumapplication_status_enumFieldRefInput<$PrismaModel>
    in?: $Enums.application_status_enum[] | ListEnumapplication_status_enumFieldRefInput<$PrismaModel>
    notIn?: $Enums.application_status_enum[] | ListEnumapplication_status_enumFieldRefInput<$PrismaModel>
    not?: NestedEnumapplication_status_enumFilter<$PrismaModel> | $Enums.application_status_enum
  }

  export type Enumrole_enumFilter<$PrismaModel = never> = {
    equals?: $Enums.role_enum | Enumrole_enumFieldRefInput<$PrismaModel>
    in?: $Enums.role_enum[] | ListEnumrole_enumFieldRefInput<$PrismaModel>
    notIn?: $Enums.role_enum[] | ListEnumrole_enumFieldRefInput<$PrismaModel>
    not?: NestedEnumrole_enumFilter<$PrismaModel> | $Enums.role_enum
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type DateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type ProfileScalarRelationFilter = {
    is?: ProfileWhereInput
    isNot?: ProfileWhereInput
  }

  export type ResumeNullableScalarRelationFilter = {
    is?: ResumeWhereInput | null
    isNot?: ResumeWhereInput | null
  }

  export type ApplicationAnswerListRelationFilter = {
    every?: ApplicationAnswerWhereInput
    some?: ApplicationAnswerWhereInput
    none?: ApplicationAnswerWhereInput
  }

  export type ApplicationAnswerOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ApplicationProfile_idRoleTermCompoundUniqueInput = {
    profile_id: string
    role: $Enums.role_enum
    term: string
  }

  export type ApplicationCountOrderByAggregateInput = {
    id?: SortOrder
    profile_id?: SortOrder
    resume_id?: SortOrder
    status?: SortOrder
    role?: SortOrder
    term?: SortOrder
    comments?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    submitted_at?: SortOrder
  }

  export type ApplicationAvgOrderByAggregateInput = {
    id?: SortOrder
    resume_id?: SortOrder
  }

  export type ApplicationMaxOrderByAggregateInput = {
    id?: SortOrder
    profile_id?: SortOrder
    resume_id?: SortOrder
    status?: SortOrder
    role?: SortOrder
    term?: SortOrder
    comments?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    submitted_at?: SortOrder
  }

  export type ApplicationMinOrderByAggregateInput = {
    id?: SortOrder
    profile_id?: SortOrder
    resume_id?: SortOrder
    status?: SortOrder
    role?: SortOrder
    term?: SortOrder
    comments?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    submitted_at?: SortOrder
  }

  export type ApplicationSumOrderByAggregateInput = {
    id?: SortOrder
    resume_id?: SortOrder
  }

  export type UuidWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedUuidWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type BigIntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: bigint | number | BigIntFieldRefInput<$PrismaModel> | null
    in?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel> | null
    notIn?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel> | null
    lt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    lte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    not?: NestedBigIntNullableWithAggregatesFilter<$PrismaModel> | bigint | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedBigIntNullableFilter<$PrismaModel>
    _min?: NestedBigIntNullableFilter<$PrismaModel>
    _max?: NestedBigIntNullableFilter<$PrismaModel>
  }

  export type Enumapplication_status_enumWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.application_status_enum | Enumapplication_status_enumFieldRefInput<$PrismaModel>
    in?: $Enums.application_status_enum[] | ListEnumapplication_status_enumFieldRefInput<$PrismaModel>
    notIn?: $Enums.application_status_enum[] | ListEnumapplication_status_enumFieldRefInput<$PrismaModel>
    not?: NestedEnumapplication_status_enumWithAggregatesFilter<$PrismaModel> | $Enums.application_status_enum
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumapplication_status_enumFilter<$PrismaModel>
    _max?: NestedEnumapplication_status_enumFilter<$PrismaModel>
  }

  export type Enumrole_enumWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.role_enum | Enumrole_enumFieldRefInput<$PrismaModel>
    in?: $Enums.role_enum[] | ListEnumrole_enumFieldRefInput<$PrismaModel>
    notIn?: $Enums.role_enum[] | ListEnumrole_enumFieldRefInput<$PrismaModel>
    not?: NestedEnumrole_enumWithAggregatesFilter<$PrismaModel> | $Enums.role_enum
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumrole_enumFilter<$PrismaModel>
    _max?: NestedEnumrole_enumFilter<$PrismaModel>
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type DateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type EventScalarRelationFilter = {
    is?: EventWhereInput
    isNot?: EventWhereInput
  }

  export type EventAttendanceEvent_idProfile_idCompoundUniqueInput = {
    event_id: bigint | number
    profile_id: string
  }

  export type EventAttendanceCountOrderByAggregateInput = {
    id?: SortOrder
    event_id?: SortOrder
    profile_id?: SortOrder
    checked_in?: SortOrder
    created_at?: SortOrder
  }

  export type EventAttendanceAvgOrderByAggregateInput = {
    id?: SortOrder
    event_id?: SortOrder
  }

  export type EventAttendanceMaxOrderByAggregateInput = {
    id?: SortOrder
    event_id?: SortOrder
    profile_id?: SortOrder
    checked_in?: SortOrder
    created_at?: SortOrder
  }

  export type EventAttendanceMinOrderByAggregateInput = {
    id?: SortOrder
    event_id?: SortOrder
    profile_id?: SortOrder
    checked_in?: SortOrder
    created_at?: SortOrder
  }

  export type EventAttendanceSumOrderByAggregateInput = {
    id?: SortOrder
    event_id?: SortOrder
  }

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type EventAttendanceListRelationFilter = {
    every?: EventAttendanceWhereInput
    some?: EventAttendanceWhereInput
    none?: EventAttendanceWhereInput
  }

  export type EventAttendanceOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type EventCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    registration_required?: SortOrder
    description?: SortOrder
    location?: SortOrder
    start_time?: SortOrder
    buffered_start_time?: SortOrder
    end_time?: SortOrder
    buffered_end_time?: SortOrder
    payment_required?: SortOrder
    image_id?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type EventAvgOrderByAggregateInput = {
    id?: SortOrder
    image_id?: SortOrder
  }

  export type EventMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    registration_required?: SortOrder
    description?: SortOrder
    location?: SortOrder
    start_time?: SortOrder
    buffered_start_time?: SortOrder
    end_time?: SortOrder
    buffered_end_time?: SortOrder
    payment_required?: SortOrder
    image_id?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type EventMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    registration_required?: SortOrder
    description?: SortOrder
    location?: SortOrder
    start_time?: SortOrder
    buffered_start_time?: SortOrder
    end_time?: SortOrder
    buffered_end_time?: SortOrder
    payment_required?: SortOrder
    image_id?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type EventSumOrderByAggregateInput = {
    id?: SortOrder
    image_id?: SortOrder
  }

  export type ResumeListRelationFilter = {
    every?: ResumeWhereInput
    some?: ResumeWhereInput
    none?: ResumeWhereInput
  }

  export type ApplicationListRelationFilter = {
    every?: ApplicationWhereInput
    some?: ApplicationWhereInput
    none?: ApplicationWhereInput
  }

  export type TeamMemberListRelationFilter = {
    every?: TeamMemberWhereInput
    some?: TeamMemberWhereInput
    none?: TeamMemberWhereInput
  }

  export type ResumeOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ApplicationOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type TeamMemberOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ProfileCountOrderByAggregateInput = {
    id?: SortOrder
    first_name?: SortOrder
    last_name?: SortOrder
    role?: SortOrder
    nfc_id?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type ProfileAvgOrderByAggregateInput = {
    nfc_id?: SortOrder
  }

  export type ProfileMaxOrderByAggregateInput = {
    id?: SortOrder
    first_name?: SortOrder
    last_name?: SortOrder
    role?: SortOrder
    nfc_id?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type ProfileMinOrderByAggregateInput = {
    id?: SortOrder
    first_name?: SortOrder
    last_name?: SortOrder
    role?: SortOrder
    nfc_id?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type ProfileSumOrderByAggregateInput = {
    nfc_id?: SortOrder
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type QuestionTermQuestion_idCompoundUniqueInput = {
    term: string
    question_id: string
  }

  export type QuestionCountOrderByAggregateInput = {
    id?: SortOrder
    question_id?: SortOrder
    question?: SortOrder
    is_required?: SortOrder
    order_num?: SortOrder
    max_length?: SortOrder
    placeholder?: SortOrder
    help_text?: SortOrder
    role?: SortOrder
    term?: SortOrder
  }

  export type QuestionAvgOrderByAggregateInput = {
    id?: SortOrder
    order_num?: SortOrder
    max_length?: SortOrder
  }

  export type QuestionMaxOrderByAggregateInput = {
    id?: SortOrder
    question_id?: SortOrder
    question?: SortOrder
    is_required?: SortOrder
    order_num?: SortOrder
    max_length?: SortOrder
    placeholder?: SortOrder
    help_text?: SortOrder
    role?: SortOrder
    term?: SortOrder
  }

  export type QuestionMinOrderByAggregateInput = {
    id?: SortOrder
    question_id?: SortOrder
    question?: SortOrder
    is_required?: SortOrder
    order_num?: SortOrder
    max_length?: SortOrder
    placeholder?: SortOrder
    help_text?: SortOrder
    role?: SortOrder
    term?: SortOrder
  }

  export type QuestionSumOrderByAggregateInput = {
    id?: SortOrder
    order_num?: SortOrder
    max_length?: SortOrder
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type ResumeCountOrderByAggregateInput = {
    id?: SortOrder
    profile_id?: SortOrder
    file_path?: SortOrder
    created_at?: SortOrder
  }

  export type ResumeAvgOrderByAggregateInput = {
    id?: SortOrder
  }

  export type ResumeMaxOrderByAggregateInput = {
    id?: SortOrder
    profile_id?: SortOrder
    file_path?: SortOrder
    created_at?: SortOrder
  }

  export type ResumeMinOrderByAggregateInput = {
    id?: SortOrder
    profile_id?: SortOrder
    file_path?: SortOrder
    created_at?: SortOrder
  }

  export type ResumeSumOrderByAggregateInput = {
    id?: SortOrder
  }

  export type Enumsponsor_tier_enumFilter<$PrismaModel = never> = {
    equals?: $Enums.sponsor_tier_enum | Enumsponsor_tier_enumFieldRefInput<$PrismaModel>
    in?: $Enums.sponsor_tier_enum[] | ListEnumsponsor_tier_enumFieldRefInput<$PrismaModel>
    notIn?: $Enums.sponsor_tier_enum[] | ListEnumsponsor_tier_enumFieldRefInput<$PrismaModel>
    not?: NestedEnumsponsor_tier_enumFilter<$PrismaModel> | $Enums.sponsor_tier_enum
  }

  export type SponsorCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    logo_url?: SortOrder
    website_url?: SortOrder
    tier?: SortOrder
    created_at?: SortOrder
  }

  export type SponsorAvgOrderByAggregateInput = {
    id?: SortOrder
  }

  export type SponsorMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    logo_url?: SortOrder
    website_url?: SortOrder
    tier?: SortOrder
    created_at?: SortOrder
  }

  export type SponsorMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    logo_url?: SortOrder
    website_url?: SortOrder
    tier?: SortOrder
    created_at?: SortOrder
  }

  export type SponsorSumOrderByAggregateInput = {
    id?: SortOrder
  }

  export type Enumsponsor_tier_enumWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.sponsor_tier_enum | Enumsponsor_tier_enumFieldRefInput<$PrismaModel>
    in?: $Enums.sponsor_tier_enum[] | ListEnumsponsor_tier_enumFieldRefInput<$PrismaModel>
    notIn?: $Enums.sponsor_tier_enum[] | ListEnumsponsor_tier_enumFieldRefInput<$PrismaModel>
    not?: NestedEnumsponsor_tier_enumWithAggregatesFilter<$PrismaModel> | $Enums.sponsor_tier_enum
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumsponsor_tier_enumFilter<$PrismaModel>
    _max?: NestedEnumsponsor_tier_enumFilter<$PrismaModel>
  }

  export type Enumteam_role_enumFilter<$PrismaModel = never> = {
    equals?: $Enums.team_role_enum | Enumteam_role_enumFieldRefInput<$PrismaModel>
    in?: $Enums.team_role_enum[] | ListEnumteam_role_enumFieldRefInput<$PrismaModel>
    notIn?: $Enums.team_role_enum[] | ListEnumteam_role_enumFieldRefInput<$PrismaModel>
    not?: NestedEnumteam_role_enumFilter<$PrismaModel> | $Enums.team_role_enum
  }

  export type TeamScalarRelationFilter = {
    is?: TeamWhereInput
    isNot?: TeamWhereInput
  }

  export type TeamMemberTeam_idProfile_idCompoundUniqueInput = {
    team_id: bigint | number
    profile_id: string
  }

  export type TeamMemberCountOrderByAggregateInput = {
    id?: SortOrder
    team_id?: SortOrder
    profile_id?: SortOrder
    role?: SortOrder
    created_at?: SortOrder
    joined_at?: SortOrder
  }

  export type TeamMemberAvgOrderByAggregateInput = {
    id?: SortOrder
    team_id?: SortOrder
  }

  export type TeamMemberMaxOrderByAggregateInput = {
    id?: SortOrder
    team_id?: SortOrder
    profile_id?: SortOrder
    role?: SortOrder
    created_at?: SortOrder
    joined_at?: SortOrder
  }

  export type TeamMemberMinOrderByAggregateInput = {
    id?: SortOrder
    team_id?: SortOrder
    profile_id?: SortOrder
    role?: SortOrder
    created_at?: SortOrder
    joined_at?: SortOrder
  }

  export type TeamMemberSumOrderByAggregateInput = {
    id?: SortOrder
    team_id?: SortOrder
  }

  export type Enumteam_role_enumWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.team_role_enum | Enumteam_role_enumFieldRefInput<$PrismaModel>
    in?: $Enums.team_role_enum[] | ListEnumteam_role_enumFieldRefInput<$PrismaModel>
    notIn?: $Enums.team_role_enum[] | ListEnumteam_role_enumFieldRefInput<$PrismaModel>
    not?: NestedEnumteam_role_enumWithAggregatesFilter<$PrismaModel> | $Enums.team_role_enum
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumteam_role_enumFilter<$PrismaModel>
    _max?: NestedEnumteam_role_enumFilter<$PrismaModel>
  }

  export type TeamCountOrderByAggregateInput = {
    id?: SortOrder
    team_name?: SortOrder
    team_size?: SortOrder
    is_recruiting?: SortOrder
    created_at?: SortOrder
  }

  export type TeamAvgOrderByAggregateInput = {
    id?: SortOrder
    team_size?: SortOrder
  }

  export type TeamMaxOrderByAggregateInput = {
    id?: SortOrder
    team_name?: SortOrder
    team_size?: SortOrder
    is_recruiting?: SortOrder
    created_at?: SortOrder
  }

  export type TeamMinOrderByAggregateInput = {
    id?: SortOrder
    team_name?: SortOrder
    team_size?: SortOrder
    is_recruiting?: SortOrder
    created_at?: SortOrder
  }

  export type TeamSumOrderByAggregateInput = {
    id?: SortOrder
    team_size?: SortOrder
  }

  export type ApplicationCreateNestedOneWithoutAnswersInput = {
    create?: XOR<ApplicationCreateWithoutAnswersInput, ApplicationUncheckedCreateWithoutAnswersInput>
    connectOrCreate?: ApplicationCreateOrConnectWithoutAnswersInput
    connect?: ApplicationWhereUniqueInput
  }

  export type QuestionCreateNestedOneWithoutAnswersInput = {
    create?: XOR<QuestionCreateWithoutAnswersInput, QuestionUncheckedCreateWithoutAnswersInput>
    connectOrCreate?: QuestionCreateOrConnectWithoutAnswersInput
    connect?: QuestionWhereUniqueInput
  }

  export type BigIntFieldUpdateOperationsInput = {
    set?: bigint | number
    increment?: bigint | number
    decrement?: bigint | number
    multiply?: bigint | number
    divide?: bigint | number
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type ApplicationUpdateOneRequiredWithoutAnswersNestedInput = {
    create?: XOR<ApplicationCreateWithoutAnswersInput, ApplicationUncheckedCreateWithoutAnswersInput>
    connectOrCreate?: ApplicationCreateOrConnectWithoutAnswersInput
    upsert?: ApplicationUpsertWithoutAnswersInput
    connect?: ApplicationWhereUniqueInput
    update?: XOR<XOR<ApplicationUpdateToOneWithWhereWithoutAnswersInput, ApplicationUpdateWithoutAnswersInput>, ApplicationUncheckedUpdateWithoutAnswersInput>
  }

  export type QuestionUpdateOneRequiredWithoutAnswersNestedInput = {
    create?: XOR<QuestionCreateWithoutAnswersInput, QuestionUncheckedCreateWithoutAnswersInput>
    connectOrCreate?: QuestionCreateOrConnectWithoutAnswersInput
    upsert?: QuestionUpsertWithoutAnswersInput
    connect?: QuestionWhereUniqueInput
    update?: XOR<XOR<QuestionUpdateToOneWithWhereWithoutAnswersInput, QuestionUpdateWithoutAnswersInput>, QuestionUncheckedUpdateWithoutAnswersInput>
  }

  export type ProfileCreateNestedOneWithoutApplicationsInput = {
    create?: XOR<ProfileCreateWithoutApplicationsInput, ProfileUncheckedCreateWithoutApplicationsInput>
    connectOrCreate?: ProfileCreateOrConnectWithoutApplicationsInput
    connect?: ProfileWhereUniqueInput
  }

  export type ResumeCreateNestedOneWithoutApplicationsInput = {
    create?: XOR<ResumeCreateWithoutApplicationsInput, ResumeUncheckedCreateWithoutApplicationsInput>
    connectOrCreate?: ResumeCreateOrConnectWithoutApplicationsInput
    connect?: ResumeWhereUniqueInput
  }

  export type ApplicationAnswerCreateNestedManyWithoutApplicationInput = {
    create?: XOR<ApplicationAnswerCreateWithoutApplicationInput, ApplicationAnswerUncheckedCreateWithoutApplicationInput> | ApplicationAnswerCreateWithoutApplicationInput[] | ApplicationAnswerUncheckedCreateWithoutApplicationInput[]
    connectOrCreate?: ApplicationAnswerCreateOrConnectWithoutApplicationInput | ApplicationAnswerCreateOrConnectWithoutApplicationInput[]
    createMany?: ApplicationAnswerCreateManyApplicationInputEnvelope
    connect?: ApplicationAnswerWhereUniqueInput | ApplicationAnswerWhereUniqueInput[]
  }

  export type ApplicationAnswerUncheckedCreateNestedManyWithoutApplicationInput = {
    create?: XOR<ApplicationAnswerCreateWithoutApplicationInput, ApplicationAnswerUncheckedCreateWithoutApplicationInput> | ApplicationAnswerCreateWithoutApplicationInput[] | ApplicationAnswerUncheckedCreateWithoutApplicationInput[]
    connectOrCreate?: ApplicationAnswerCreateOrConnectWithoutApplicationInput | ApplicationAnswerCreateOrConnectWithoutApplicationInput[]
    createMany?: ApplicationAnswerCreateManyApplicationInputEnvelope
    connect?: ApplicationAnswerWhereUniqueInput | ApplicationAnswerWhereUniqueInput[]
  }

  export type Enumapplication_status_enumFieldUpdateOperationsInput = {
    set?: $Enums.application_status_enum
  }

  export type Enumrole_enumFieldUpdateOperationsInput = {
    set?: $Enums.role_enum
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type ProfileUpdateOneRequiredWithoutApplicationsNestedInput = {
    create?: XOR<ProfileCreateWithoutApplicationsInput, ProfileUncheckedCreateWithoutApplicationsInput>
    connectOrCreate?: ProfileCreateOrConnectWithoutApplicationsInput
    upsert?: ProfileUpsertWithoutApplicationsInput
    connect?: ProfileWhereUniqueInput
    update?: XOR<XOR<ProfileUpdateToOneWithWhereWithoutApplicationsInput, ProfileUpdateWithoutApplicationsInput>, ProfileUncheckedUpdateWithoutApplicationsInput>
  }

  export type ResumeUpdateOneWithoutApplicationsNestedInput = {
    create?: XOR<ResumeCreateWithoutApplicationsInput, ResumeUncheckedCreateWithoutApplicationsInput>
    connectOrCreate?: ResumeCreateOrConnectWithoutApplicationsInput
    upsert?: ResumeUpsertWithoutApplicationsInput
    disconnect?: ResumeWhereInput | boolean
    delete?: ResumeWhereInput | boolean
    connect?: ResumeWhereUniqueInput
    update?: XOR<XOR<ResumeUpdateToOneWithWhereWithoutApplicationsInput, ResumeUpdateWithoutApplicationsInput>, ResumeUncheckedUpdateWithoutApplicationsInput>
  }

  export type ApplicationAnswerUpdateManyWithoutApplicationNestedInput = {
    create?: XOR<ApplicationAnswerCreateWithoutApplicationInput, ApplicationAnswerUncheckedCreateWithoutApplicationInput> | ApplicationAnswerCreateWithoutApplicationInput[] | ApplicationAnswerUncheckedCreateWithoutApplicationInput[]
    connectOrCreate?: ApplicationAnswerCreateOrConnectWithoutApplicationInput | ApplicationAnswerCreateOrConnectWithoutApplicationInput[]
    upsert?: ApplicationAnswerUpsertWithWhereUniqueWithoutApplicationInput | ApplicationAnswerUpsertWithWhereUniqueWithoutApplicationInput[]
    createMany?: ApplicationAnswerCreateManyApplicationInputEnvelope
    set?: ApplicationAnswerWhereUniqueInput | ApplicationAnswerWhereUniqueInput[]
    disconnect?: ApplicationAnswerWhereUniqueInput | ApplicationAnswerWhereUniqueInput[]
    delete?: ApplicationAnswerWhereUniqueInput | ApplicationAnswerWhereUniqueInput[]
    connect?: ApplicationAnswerWhereUniqueInput | ApplicationAnswerWhereUniqueInput[]
    update?: ApplicationAnswerUpdateWithWhereUniqueWithoutApplicationInput | ApplicationAnswerUpdateWithWhereUniqueWithoutApplicationInput[]
    updateMany?: ApplicationAnswerUpdateManyWithWhereWithoutApplicationInput | ApplicationAnswerUpdateManyWithWhereWithoutApplicationInput[]
    deleteMany?: ApplicationAnswerScalarWhereInput | ApplicationAnswerScalarWhereInput[]
  }

  export type NullableBigIntFieldUpdateOperationsInput = {
    set?: bigint | number | null
    increment?: bigint | number
    decrement?: bigint | number
    multiply?: bigint | number
    divide?: bigint | number
  }

  export type ApplicationAnswerUncheckedUpdateManyWithoutApplicationNestedInput = {
    create?: XOR<ApplicationAnswerCreateWithoutApplicationInput, ApplicationAnswerUncheckedCreateWithoutApplicationInput> | ApplicationAnswerCreateWithoutApplicationInput[] | ApplicationAnswerUncheckedCreateWithoutApplicationInput[]
    connectOrCreate?: ApplicationAnswerCreateOrConnectWithoutApplicationInput | ApplicationAnswerCreateOrConnectWithoutApplicationInput[]
    upsert?: ApplicationAnswerUpsertWithWhereUniqueWithoutApplicationInput | ApplicationAnswerUpsertWithWhereUniqueWithoutApplicationInput[]
    createMany?: ApplicationAnswerCreateManyApplicationInputEnvelope
    set?: ApplicationAnswerWhereUniqueInput | ApplicationAnswerWhereUniqueInput[]
    disconnect?: ApplicationAnswerWhereUniqueInput | ApplicationAnswerWhereUniqueInput[]
    delete?: ApplicationAnswerWhereUniqueInput | ApplicationAnswerWhereUniqueInput[]
    connect?: ApplicationAnswerWhereUniqueInput | ApplicationAnswerWhereUniqueInput[]
    update?: ApplicationAnswerUpdateWithWhereUniqueWithoutApplicationInput | ApplicationAnswerUpdateWithWhereUniqueWithoutApplicationInput[]
    updateMany?: ApplicationAnswerUpdateManyWithWhereWithoutApplicationInput | ApplicationAnswerUpdateManyWithWhereWithoutApplicationInput[]
    deleteMany?: ApplicationAnswerScalarWhereInput | ApplicationAnswerScalarWhereInput[]
  }

  export type EventCreateNestedOneWithoutAttendanceInput = {
    create?: XOR<EventCreateWithoutAttendanceInput, EventUncheckedCreateWithoutAttendanceInput>
    connectOrCreate?: EventCreateOrConnectWithoutAttendanceInput
    connect?: EventWhereUniqueInput
  }

  export type ProfileCreateNestedOneWithoutEventAttendanceInput = {
    create?: XOR<ProfileCreateWithoutEventAttendanceInput, ProfileUncheckedCreateWithoutEventAttendanceInput>
    connectOrCreate?: ProfileCreateOrConnectWithoutEventAttendanceInput
    connect?: ProfileWhereUniqueInput
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type EventUpdateOneRequiredWithoutAttendanceNestedInput = {
    create?: XOR<EventCreateWithoutAttendanceInput, EventUncheckedCreateWithoutAttendanceInput>
    connectOrCreate?: EventCreateOrConnectWithoutAttendanceInput
    upsert?: EventUpsertWithoutAttendanceInput
    connect?: EventWhereUniqueInput
    update?: XOR<XOR<EventUpdateToOneWithWhereWithoutAttendanceInput, EventUpdateWithoutAttendanceInput>, EventUncheckedUpdateWithoutAttendanceInput>
  }

  export type ProfileUpdateOneRequiredWithoutEventAttendanceNestedInput = {
    create?: XOR<ProfileCreateWithoutEventAttendanceInput, ProfileUncheckedCreateWithoutEventAttendanceInput>
    connectOrCreate?: ProfileCreateOrConnectWithoutEventAttendanceInput
    upsert?: ProfileUpsertWithoutEventAttendanceInput
    connect?: ProfileWhereUniqueInput
    update?: XOR<XOR<ProfileUpdateToOneWithWhereWithoutEventAttendanceInput, ProfileUpdateWithoutEventAttendanceInput>, ProfileUncheckedUpdateWithoutEventAttendanceInput>
  }

  export type EventAttendanceCreateNestedManyWithoutEventInput = {
    create?: XOR<EventAttendanceCreateWithoutEventInput, EventAttendanceUncheckedCreateWithoutEventInput> | EventAttendanceCreateWithoutEventInput[] | EventAttendanceUncheckedCreateWithoutEventInput[]
    connectOrCreate?: EventAttendanceCreateOrConnectWithoutEventInput | EventAttendanceCreateOrConnectWithoutEventInput[]
    createMany?: EventAttendanceCreateManyEventInputEnvelope
    connect?: EventAttendanceWhereUniqueInput | EventAttendanceWhereUniqueInput[]
  }

  export type EventAttendanceUncheckedCreateNestedManyWithoutEventInput = {
    create?: XOR<EventAttendanceCreateWithoutEventInput, EventAttendanceUncheckedCreateWithoutEventInput> | EventAttendanceCreateWithoutEventInput[] | EventAttendanceUncheckedCreateWithoutEventInput[]
    connectOrCreate?: EventAttendanceCreateOrConnectWithoutEventInput | EventAttendanceCreateOrConnectWithoutEventInput[]
    createMany?: EventAttendanceCreateManyEventInputEnvelope
    connect?: EventAttendanceWhereUniqueInput | EventAttendanceWhereUniqueInput[]
  }

  export type EventAttendanceUpdateManyWithoutEventNestedInput = {
    create?: XOR<EventAttendanceCreateWithoutEventInput, EventAttendanceUncheckedCreateWithoutEventInput> | EventAttendanceCreateWithoutEventInput[] | EventAttendanceUncheckedCreateWithoutEventInput[]
    connectOrCreate?: EventAttendanceCreateOrConnectWithoutEventInput | EventAttendanceCreateOrConnectWithoutEventInput[]
    upsert?: EventAttendanceUpsertWithWhereUniqueWithoutEventInput | EventAttendanceUpsertWithWhereUniqueWithoutEventInput[]
    createMany?: EventAttendanceCreateManyEventInputEnvelope
    set?: EventAttendanceWhereUniqueInput | EventAttendanceWhereUniqueInput[]
    disconnect?: EventAttendanceWhereUniqueInput | EventAttendanceWhereUniqueInput[]
    delete?: EventAttendanceWhereUniqueInput | EventAttendanceWhereUniqueInput[]
    connect?: EventAttendanceWhereUniqueInput | EventAttendanceWhereUniqueInput[]
    update?: EventAttendanceUpdateWithWhereUniqueWithoutEventInput | EventAttendanceUpdateWithWhereUniqueWithoutEventInput[]
    updateMany?: EventAttendanceUpdateManyWithWhereWithoutEventInput | EventAttendanceUpdateManyWithWhereWithoutEventInput[]
    deleteMany?: EventAttendanceScalarWhereInput | EventAttendanceScalarWhereInput[]
  }

  export type EventAttendanceUncheckedUpdateManyWithoutEventNestedInput = {
    create?: XOR<EventAttendanceCreateWithoutEventInput, EventAttendanceUncheckedCreateWithoutEventInput> | EventAttendanceCreateWithoutEventInput[] | EventAttendanceUncheckedCreateWithoutEventInput[]
    connectOrCreate?: EventAttendanceCreateOrConnectWithoutEventInput | EventAttendanceCreateOrConnectWithoutEventInput[]
    upsert?: EventAttendanceUpsertWithWhereUniqueWithoutEventInput | EventAttendanceUpsertWithWhereUniqueWithoutEventInput[]
    createMany?: EventAttendanceCreateManyEventInputEnvelope
    set?: EventAttendanceWhereUniqueInput | EventAttendanceWhereUniqueInput[]
    disconnect?: EventAttendanceWhereUniqueInput | EventAttendanceWhereUniqueInput[]
    delete?: EventAttendanceWhereUniqueInput | EventAttendanceWhereUniqueInput[]
    connect?: EventAttendanceWhereUniqueInput | EventAttendanceWhereUniqueInput[]
    update?: EventAttendanceUpdateWithWhereUniqueWithoutEventInput | EventAttendanceUpdateWithWhereUniqueWithoutEventInput[]
    updateMany?: EventAttendanceUpdateManyWithWhereWithoutEventInput | EventAttendanceUpdateManyWithWhereWithoutEventInput[]
    deleteMany?: EventAttendanceScalarWhereInput | EventAttendanceScalarWhereInput[]
  }

  export type ResumeCreateNestedManyWithoutProfileInput = {
    create?: XOR<ResumeCreateWithoutProfileInput, ResumeUncheckedCreateWithoutProfileInput> | ResumeCreateWithoutProfileInput[] | ResumeUncheckedCreateWithoutProfileInput[]
    connectOrCreate?: ResumeCreateOrConnectWithoutProfileInput | ResumeCreateOrConnectWithoutProfileInput[]
    createMany?: ResumeCreateManyProfileInputEnvelope
    connect?: ResumeWhereUniqueInput | ResumeWhereUniqueInput[]
  }

  export type ApplicationCreateNestedManyWithoutProfileInput = {
    create?: XOR<ApplicationCreateWithoutProfileInput, ApplicationUncheckedCreateWithoutProfileInput> | ApplicationCreateWithoutProfileInput[] | ApplicationUncheckedCreateWithoutProfileInput[]
    connectOrCreate?: ApplicationCreateOrConnectWithoutProfileInput | ApplicationCreateOrConnectWithoutProfileInput[]
    createMany?: ApplicationCreateManyProfileInputEnvelope
    connect?: ApplicationWhereUniqueInput | ApplicationWhereUniqueInput[]
  }

  export type EventAttendanceCreateNestedManyWithoutProfileInput = {
    create?: XOR<EventAttendanceCreateWithoutProfileInput, EventAttendanceUncheckedCreateWithoutProfileInput> | EventAttendanceCreateWithoutProfileInput[] | EventAttendanceUncheckedCreateWithoutProfileInput[]
    connectOrCreate?: EventAttendanceCreateOrConnectWithoutProfileInput | EventAttendanceCreateOrConnectWithoutProfileInput[]
    createMany?: EventAttendanceCreateManyProfileInputEnvelope
    connect?: EventAttendanceWhereUniqueInput | EventAttendanceWhereUniqueInput[]
  }

  export type TeamMemberCreateNestedManyWithoutProfileInput = {
    create?: XOR<TeamMemberCreateWithoutProfileInput, TeamMemberUncheckedCreateWithoutProfileInput> | TeamMemberCreateWithoutProfileInput[] | TeamMemberUncheckedCreateWithoutProfileInput[]
    connectOrCreate?: TeamMemberCreateOrConnectWithoutProfileInput | TeamMemberCreateOrConnectWithoutProfileInput[]
    createMany?: TeamMemberCreateManyProfileInputEnvelope
    connect?: TeamMemberWhereUniqueInput | TeamMemberWhereUniqueInput[]
  }

  export type ResumeUncheckedCreateNestedManyWithoutProfileInput = {
    create?: XOR<ResumeCreateWithoutProfileInput, ResumeUncheckedCreateWithoutProfileInput> | ResumeCreateWithoutProfileInput[] | ResumeUncheckedCreateWithoutProfileInput[]
    connectOrCreate?: ResumeCreateOrConnectWithoutProfileInput | ResumeCreateOrConnectWithoutProfileInput[]
    createMany?: ResumeCreateManyProfileInputEnvelope
    connect?: ResumeWhereUniqueInput | ResumeWhereUniqueInput[]
  }

  export type ApplicationUncheckedCreateNestedManyWithoutProfileInput = {
    create?: XOR<ApplicationCreateWithoutProfileInput, ApplicationUncheckedCreateWithoutProfileInput> | ApplicationCreateWithoutProfileInput[] | ApplicationUncheckedCreateWithoutProfileInput[]
    connectOrCreate?: ApplicationCreateOrConnectWithoutProfileInput | ApplicationCreateOrConnectWithoutProfileInput[]
    createMany?: ApplicationCreateManyProfileInputEnvelope
    connect?: ApplicationWhereUniqueInput | ApplicationWhereUniqueInput[]
  }

  export type EventAttendanceUncheckedCreateNestedManyWithoutProfileInput = {
    create?: XOR<EventAttendanceCreateWithoutProfileInput, EventAttendanceUncheckedCreateWithoutProfileInput> | EventAttendanceCreateWithoutProfileInput[] | EventAttendanceUncheckedCreateWithoutProfileInput[]
    connectOrCreate?: EventAttendanceCreateOrConnectWithoutProfileInput | EventAttendanceCreateOrConnectWithoutProfileInput[]
    createMany?: EventAttendanceCreateManyProfileInputEnvelope
    connect?: EventAttendanceWhereUniqueInput | EventAttendanceWhereUniqueInput[]
  }

  export type TeamMemberUncheckedCreateNestedManyWithoutProfileInput = {
    create?: XOR<TeamMemberCreateWithoutProfileInput, TeamMemberUncheckedCreateWithoutProfileInput> | TeamMemberCreateWithoutProfileInput[] | TeamMemberUncheckedCreateWithoutProfileInput[]
    connectOrCreate?: TeamMemberCreateOrConnectWithoutProfileInput | TeamMemberCreateOrConnectWithoutProfileInput[]
    createMany?: TeamMemberCreateManyProfileInputEnvelope
    connect?: TeamMemberWhereUniqueInput | TeamMemberWhereUniqueInput[]
  }

  export type ResumeUpdateManyWithoutProfileNestedInput = {
    create?: XOR<ResumeCreateWithoutProfileInput, ResumeUncheckedCreateWithoutProfileInput> | ResumeCreateWithoutProfileInput[] | ResumeUncheckedCreateWithoutProfileInput[]
    connectOrCreate?: ResumeCreateOrConnectWithoutProfileInput | ResumeCreateOrConnectWithoutProfileInput[]
    upsert?: ResumeUpsertWithWhereUniqueWithoutProfileInput | ResumeUpsertWithWhereUniqueWithoutProfileInput[]
    createMany?: ResumeCreateManyProfileInputEnvelope
    set?: ResumeWhereUniqueInput | ResumeWhereUniqueInput[]
    disconnect?: ResumeWhereUniqueInput | ResumeWhereUniqueInput[]
    delete?: ResumeWhereUniqueInput | ResumeWhereUniqueInput[]
    connect?: ResumeWhereUniqueInput | ResumeWhereUniqueInput[]
    update?: ResumeUpdateWithWhereUniqueWithoutProfileInput | ResumeUpdateWithWhereUniqueWithoutProfileInput[]
    updateMany?: ResumeUpdateManyWithWhereWithoutProfileInput | ResumeUpdateManyWithWhereWithoutProfileInput[]
    deleteMany?: ResumeScalarWhereInput | ResumeScalarWhereInput[]
  }

  export type ApplicationUpdateManyWithoutProfileNestedInput = {
    create?: XOR<ApplicationCreateWithoutProfileInput, ApplicationUncheckedCreateWithoutProfileInput> | ApplicationCreateWithoutProfileInput[] | ApplicationUncheckedCreateWithoutProfileInput[]
    connectOrCreate?: ApplicationCreateOrConnectWithoutProfileInput | ApplicationCreateOrConnectWithoutProfileInput[]
    upsert?: ApplicationUpsertWithWhereUniqueWithoutProfileInput | ApplicationUpsertWithWhereUniqueWithoutProfileInput[]
    createMany?: ApplicationCreateManyProfileInputEnvelope
    set?: ApplicationWhereUniqueInput | ApplicationWhereUniqueInput[]
    disconnect?: ApplicationWhereUniqueInput | ApplicationWhereUniqueInput[]
    delete?: ApplicationWhereUniqueInput | ApplicationWhereUniqueInput[]
    connect?: ApplicationWhereUniqueInput | ApplicationWhereUniqueInput[]
    update?: ApplicationUpdateWithWhereUniqueWithoutProfileInput | ApplicationUpdateWithWhereUniqueWithoutProfileInput[]
    updateMany?: ApplicationUpdateManyWithWhereWithoutProfileInput | ApplicationUpdateManyWithWhereWithoutProfileInput[]
    deleteMany?: ApplicationScalarWhereInput | ApplicationScalarWhereInput[]
  }

  export type EventAttendanceUpdateManyWithoutProfileNestedInput = {
    create?: XOR<EventAttendanceCreateWithoutProfileInput, EventAttendanceUncheckedCreateWithoutProfileInput> | EventAttendanceCreateWithoutProfileInput[] | EventAttendanceUncheckedCreateWithoutProfileInput[]
    connectOrCreate?: EventAttendanceCreateOrConnectWithoutProfileInput | EventAttendanceCreateOrConnectWithoutProfileInput[]
    upsert?: EventAttendanceUpsertWithWhereUniqueWithoutProfileInput | EventAttendanceUpsertWithWhereUniqueWithoutProfileInput[]
    createMany?: EventAttendanceCreateManyProfileInputEnvelope
    set?: EventAttendanceWhereUniqueInput | EventAttendanceWhereUniqueInput[]
    disconnect?: EventAttendanceWhereUniqueInput | EventAttendanceWhereUniqueInput[]
    delete?: EventAttendanceWhereUniqueInput | EventAttendanceWhereUniqueInput[]
    connect?: EventAttendanceWhereUniqueInput | EventAttendanceWhereUniqueInput[]
    update?: EventAttendanceUpdateWithWhereUniqueWithoutProfileInput | EventAttendanceUpdateWithWhereUniqueWithoutProfileInput[]
    updateMany?: EventAttendanceUpdateManyWithWhereWithoutProfileInput | EventAttendanceUpdateManyWithWhereWithoutProfileInput[]
    deleteMany?: EventAttendanceScalarWhereInput | EventAttendanceScalarWhereInput[]
  }

  export type TeamMemberUpdateManyWithoutProfileNestedInput = {
    create?: XOR<TeamMemberCreateWithoutProfileInput, TeamMemberUncheckedCreateWithoutProfileInput> | TeamMemberCreateWithoutProfileInput[] | TeamMemberUncheckedCreateWithoutProfileInput[]
    connectOrCreate?: TeamMemberCreateOrConnectWithoutProfileInput | TeamMemberCreateOrConnectWithoutProfileInput[]
    upsert?: TeamMemberUpsertWithWhereUniqueWithoutProfileInput | TeamMemberUpsertWithWhereUniqueWithoutProfileInput[]
    createMany?: TeamMemberCreateManyProfileInputEnvelope
    set?: TeamMemberWhereUniqueInput | TeamMemberWhereUniqueInput[]
    disconnect?: TeamMemberWhereUniqueInput | TeamMemberWhereUniqueInput[]
    delete?: TeamMemberWhereUniqueInput | TeamMemberWhereUniqueInput[]
    connect?: TeamMemberWhereUniqueInput | TeamMemberWhereUniqueInput[]
    update?: TeamMemberUpdateWithWhereUniqueWithoutProfileInput | TeamMemberUpdateWithWhereUniqueWithoutProfileInput[]
    updateMany?: TeamMemberUpdateManyWithWhereWithoutProfileInput | TeamMemberUpdateManyWithWhereWithoutProfileInput[]
    deleteMany?: TeamMemberScalarWhereInput | TeamMemberScalarWhereInput[]
  }

  export type ResumeUncheckedUpdateManyWithoutProfileNestedInput = {
    create?: XOR<ResumeCreateWithoutProfileInput, ResumeUncheckedCreateWithoutProfileInput> | ResumeCreateWithoutProfileInput[] | ResumeUncheckedCreateWithoutProfileInput[]
    connectOrCreate?: ResumeCreateOrConnectWithoutProfileInput | ResumeCreateOrConnectWithoutProfileInput[]
    upsert?: ResumeUpsertWithWhereUniqueWithoutProfileInput | ResumeUpsertWithWhereUniqueWithoutProfileInput[]
    createMany?: ResumeCreateManyProfileInputEnvelope
    set?: ResumeWhereUniqueInput | ResumeWhereUniqueInput[]
    disconnect?: ResumeWhereUniqueInput | ResumeWhereUniqueInput[]
    delete?: ResumeWhereUniqueInput | ResumeWhereUniqueInput[]
    connect?: ResumeWhereUniqueInput | ResumeWhereUniqueInput[]
    update?: ResumeUpdateWithWhereUniqueWithoutProfileInput | ResumeUpdateWithWhereUniqueWithoutProfileInput[]
    updateMany?: ResumeUpdateManyWithWhereWithoutProfileInput | ResumeUpdateManyWithWhereWithoutProfileInput[]
    deleteMany?: ResumeScalarWhereInput | ResumeScalarWhereInput[]
  }

  export type ApplicationUncheckedUpdateManyWithoutProfileNestedInput = {
    create?: XOR<ApplicationCreateWithoutProfileInput, ApplicationUncheckedCreateWithoutProfileInput> | ApplicationCreateWithoutProfileInput[] | ApplicationUncheckedCreateWithoutProfileInput[]
    connectOrCreate?: ApplicationCreateOrConnectWithoutProfileInput | ApplicationCreateOrConnectWithoutProfileInput[]
    upsert?: ApplicationUpsertWithWhereUniqueWithoutProfileInput | ApplicationUpsertWithWhereUniqueWithoutProfileInput[]
    createMany?: ApplicationCreateManyProfileInputEnvelope
    set?: ApplicationWhereUniqueInput | ApplicationWhereUniqueInput[]
    disconnect?: ApplicationWhereUniqueInput | ApplicationWhereUniqueInput[]
    delete?: ApplicationWhereUniqueInput | ApplicationWhereUniqueInput[]
    connect?: ApplicationWhereUniqueInput | ApplicationWhereUniqueInput[]
    update?: ApplicationUpdateWithWhereUniqueWithoutProfileInput | ApplicationUpdateWithWhereUniqueWithoutProfileInput[]
    updateMany?: ApplicationUpdateManyWithWhereWithoutProfileInput | ApplicationUpdateManyWithWhereWithoutProfileInput[]
    deleteMany?: ApplicationScalarWhereInput | ApplicationScalarWhereInput[]
  }

  export type EventAttendanceUncheckedUpdateManyWithoutProfileNestedInput = {
    create?: XOR<EventAttendanceCreateWithoutProfileInput, EventAttendanceUncheckedCreateWithoutProfileInput> | EventAttendanceCreateWithoutProfileInput[] | EventAttendanceUncheckedCreateWithoutProfileInput[]
    connectOrCreate?: EventAttendanceCreateOrConnectWithoutProfileInput | EventAttendanceCreateOrConnectWithoutProfileInput[]
    upsert?: EventAttendanceUpsertWithWhereUniqueWithoutProfileInput | EventAttendanceUpsertWithWhereUniqueWithoutProfileInput[]
    createMany?: EventAttendanceCreateManyProfileInputEnvelope
    set?: EventAttendanceWhereUniqueInput | EventAttendanceWhereUniqueInput[]
    disconnect?: EventAttendanceWhereUniqueInput | EventAttendanceWhereUniqueInput[]
    delete?: EventAttendanceWhereUniqueInput | EventAttendanceWhereUniqueInput[]
    connect?: EventAttendanceWhereUniqueInput | EventAttendanceWhereUniqueInput[]
    update?: EventAttendanceUpdateWithWhereUniqueWithoutProfileInput | EventAttendanceUpdateWithWhereUniqueWithoutProfileInput[]
    updateMany?: EventAttendanceUpdateManyWithWhereWithoutProfileInput | EventAttendanceUpdateManyWithWhereWithoutProfileInput[]
    deleteMany?: EventAttendanceScalarWhereInput | EventAttendanceScalarWhereInput[]
  }

  export type TeamMemberUncheckedUpdateManyWithoutProfileNestedInput = {
    create?: XOR<TeamMemberCreateWithoutProfileInput, TeamMemberUncheckedCreateWithoutProfileInput> | TeamMemberCreateWithoutProfileInput[] | TeamMemberUncheckedCreateWithoutProfileInput[]
    connectOrCreate?: TeamMemberCreateOrConnectWithoutProfileInput | TeamMemberCreateOrConnectWithoutProfileInput[]
    upsert?: TeamMemberUpsertWithWhereUniqueWithoutProfileInput | TeamMemberUpsertWithWhereUniqueWithoutProfileInput[]
    createMany?: TeamMemberCreateManyProfileInputEnvelope
    set?: TeamMemberWhereUniqueInput | TeamMemberWhereUniqueInput[]
    disconnect?: TeamMemberWhereUniqueInput | TeamMemberWhereUniqueInput[]
    delete?: TeamMemberWhereUniqueInput | TeamMemberWhereUniqueInput[]
    connect?: TeamMemberWhereUniqueInput | TeamMemberWhereUniqueInput[]
    update?: TeamMemberUpdateWithWhereUniqueWithoutProfileInput | TeamMemberUpdateWithWhereUniqueWithoutProfileInput[]
    updateMany?: TeamMemberUpdateManyWithWhereWithoutProfileInput | TeamMemberUpdateManyWithWhereWithoutProfileInput[]
    deleteMany?: TeamMemberScalarWhereInput | TeamMemberScalarWhereInput[]
  }

  export type ApplicationAnswerCreateNestedManyWithoutQuestionInput = {
    create?: XOR<ApplicationAnswerCreateWithoutQuestionInput, ApplicationAnswerUncheckedCreateWithoutQuestionInput> | ApplicationAnswerCreateWithoutQuestionInput[] | ApplicationAnswerUncheckedCreateWithoutQuestionInput[]
    connectOrCreate?: ApplicationAnswerCreateOrConnectWithoutQuestionInput | ApplicationAnswerCreateOrConnectWithoutQuestionInput[]
    createMany?: ApplicationAnswerCreateManyQuestionInputEnvelope
    connect?: ApplicationAnswerWhereUniqueInput | ApplicationAnswerWhereUniqueInput[]
  }

  export type ApplicationAnswerUncheckedCreateNestedManyWithoutQuestionInput = {
    create?: XOR<ApplicationAnswerCreateWithoutQuestionInput, ApplicationAnswerUncheckedCreateWithoutQuestionInput> | ApplicationAnswerCreateWithoutQuestionInput[] | ApplicationAnswerUncheckedCreateWithoutQuestionInput[]
    connectOrCreate?: ApplicationAnswerCreateOrConnectWithoutQuestionInput | ApplicationAnswerCreateOrConnectWithoutQuestionInput[]
    createMany?: ApplicationAnswerCreateManyQuestionInputEnvelope
    connect?: ApplicationAnswerWhereUniqueInput | ApplicationAnswerWhereUniqueInput[]
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type ApplicationAnswerUpdateManyWithoutQuestionNestedInput = {
    create?: XOR<ApplicationAnswerCreateWithoutQuestionInput, ApplicationAnswerUncheckedCreateWithoutQuestionInput> | ApplicationAnswerCreateWithoutQuestionInput[] | ApplicationAnswerUncheckedCreateWithoutQuestionInput[]
    connectOrCreate?: ApplicationAnswerCreateOrConnectWithoutQuestionInput | ApplicationAnswerCreateOrConnectWithoutQuestionInput[]
    upsert?: ApplicationAnswerUpsertWithWhereUniqueWithoutQuestionInput | ApplicationAnswerUpsertWithWhereUniqueWithoutQuestionInput[]
    createMany?: ApplicationAnswerCreateManyQuestionInputEnvelope
    set?: ApplicationAnswerWhereUniqueInput | ApplicationAnswerWhereUniqueInput[]
    disconnect?: ApplicationAnswerWhereUniqueInput | ApplicationAnswerWhereUniqueInput[]
    delete?: ApplicationAnswerWhereUniqueInput | ApplicationAnswerWhereUniqueInput[]
    connect?: ApplicationAnswerWhereUniqueInput | ApplicationAnswerWhereUniqueInput[]
    update?: ApplicationAnswerUpdateWithWhereUniqueWithoutQuestionInput | ApplicationAnswerUpdateWithWhereUniqueWithoutQuestionInput[]
    updateMany?: ApplicationAnswerUpdateManyWithWhereWithoutQuestionInput | ApplicationAnswerUpdateManyWithWhereWithoutQuestionInput[]
    deleteMany?: ApplicationAnswerScalarWhereInput | ApplicationAnswerScalarWhereInput[]
  }

  export type ApplicationAnswerUncheckedUpdateManyWithoutQuestionNestedInput = {
    create?: XOR<ApplicationAnswerCreateWithoutQuestionInput, ApplicationAnswerUncheckedCreateWithoutQuestionInput> | ApplicationAnswerCreateWithoutQuestionInput[] | ApplicationAnswerUncheckedCreateWithoutQuestionInput[]
    connectOrCreate?: ApplicationAnswerCreateOrConnectWithoutQuestionInput | ApplicationAnswerCreateOrConnectWithoutQuestionInput[]
    upsert?: ApplicationAnswerUpsertWithWhereUniqueWithoutQuestionInput | ApplicationAnswerUpsertWithWhereUniqueWithoutQuestionInput[]
    createMany?: ApplicationAnswerCreateManyQuestionInputEnvelope
    set?: ApplicationAnswerWhereUniqueInput | ApplicationAnswerWhereUniqueInput[]
    disconnect?: ApplicationAnswerWhereUniqueInput | ApplicationAnswerWhereUniqueInput[]
    delete?: ApplicationAnswerWhereUniqueInput | ApplicationAnswerWhereUniqueInput[]
    connect?: ApplicationAnswerWhereUniqueInput | ApplicationAnswerWhereUniqueInput[]
    update?: ApplicationAnswerUpdateWithWhereUniqueWithoutQuestionInput | ApplicationAnswerUpdateWithWhereUniqueWithoutQuestionInput[]
    updateMany?: ApplicationAnswerUpdateManyWithWhereWithoutQuestionInput | ApplicationAnswerUpdateManyWithWhereWithoutQuestionInput[]
    deleteMany?: ApplicationAnswerScalarWhereInput | ApplicationAnswerScalarWhereInput[]
  }

  export type ProfileCreateNestedOneWithoutResumesInput = {
    create?: XOR<ProfileCreateWithoutResumesInput, ProfileUncheckedCreateWithoutResumesInput>
    connectOrCreate?: ProfileCreateOrConnectWithoutResumesInput
    connect?: ProfileWhereUniqueInput
  }

  export type ApplicationCreateNestedManyWithoutResumeInput = {
    create?: XOR<ApplicationCreateWithoutResumeInput, ApplicationUncheckedCreateWithoutResumeInput> | ApplicationCreateWithoutResumeInput[] | ApplicationUncheckedCreateWithoutResumeInput[]
    connectOrCreate?: ApplicationCreateOrConnectWithoutResumeInput | ApplicationCreateOrConnectWithoutResumeInput[]
    createMany?: ApplicationCreateManyResumeInputEnvelope
    connect?: ApplicationWhereUniqueInput | ApplicationWhereUniqueInput[]
  }

  export type ApplicationUncheckedCreateNestedManyWithoutResumeInput = {
    create?: XOR<ApplicationCreateWithoutResumeInput, ApplicationUncheckedCreateWithoutResumeInput> | ApplicationCreateWithoutResumeInput[] | ApplicationUncheckedCreateWithoutResumeInput[]
    connectOrCreate?: ApplicationCreateOrConnectWithoutResumeInput | ApplicationCreateOrConnectWithoutResumeInput[]
    createMany?: ApplicationCreateManyResumeInputEnvelope
    connect?: ApplicationWhereUniqueInput | ApplicationWhereUniqueInput[]
  }

  export type ProfileUpdateOneRequiredWithoutResumesNestedInput = {
    create?: XOR<ProfileCreateWithoutResumesInput, ProfileUncheckedCreateWithoutResumesInput>
    connectOrCreate?: ProfileCreateOrConnectWithoutResumesInput
    upsert?: ProfileUpsertWithoutResumesInput
    connect?: ProfileWhereUniqueInput
    update?: XOR<XOR<ProfileUpdateToOneWithWhereWithoutResumesInput, ProfileUpdateWithoutResumesInput>, ProfileUncheckedUpdateWithoutResumesInput>
  }

  export type ApplicationUpdateManyWithoutResumeNestedInput = {
    create?: XOR<ApplicationCreateWithoutResumeInput, ApplicationUncheckedCreateWithoutResumeInput> | ApplicationCreateWithoutResumeInput[] | ApplicationUncheckedCreateWithoutResumeInput[]
    connectOrCreate?: ApplicationCreateOrConnectWithoutResumeInput | ApplicationCreateOrConnectWithoutResumeInput[]
    upsert?: ApplicationUpsertWithWhereUniqueWithoutResumeInput | ApplicationUpsertWithWhereUniqueWithoutResumeInput[]
    createMany?: ApplicationCreateManyResumeInputEnvelope
    set?: ApplicationWhereUniqueInput | ApplicationWhereUniqueInput[]
    disconnect?: ApplicationWhereUniqueInput | ApplicationWhereUniqueInput[]
    delete?: ApplicationWhereUniqueInput | ApplicationWhereUniqueInput[]
    connect?: ApplicationWhereUniqueInput | ApplicationWhereUniqueInput[]
    update?: ApplicationUpdateWithWhereUniqueWithoutResumeInput | ApplicationUpdateWithWhereUniqueWithoutResumeInput[]
    updateMany?: ApplicationUpdateManyWithWhereWithoutResumeInput | ApplicationUpdateManyWithWhereWithoutResumeInput[]
    deleteMany?: ApplicationScalarWhereInput | ApplicationScalarWhereInput[]
  }

  export type ApplicationUncheckedUpdateManyWithoutResumeNestedInput = {
    create?: XOR<ApplicationCreateWithoutResumeInput, ApplicationUncheckedCreateWithoutResumeInput> | ApplicationCreateWithoutResumeInput[] | ApplicationUncheckedCreateWithoutResumeInput[]
    connectOrCreate?: ApplicationCreateOrConnectWithoutResumeInput | ApplicationCreateOrConnectWithoutResumeInput[]
    upsert?: ApplicationUpsertWithWhereUniqueWithoutResumeInput | ApplicationUpsertWithWhereUniqueWithoutResumeInput[]
    createMany?: ApplicationCreateManyResumeInputEnvelope
    set?: ApplicationWhereUniqueInput | ApplicationWhereUniqueInput[]
    disconnect?: ApplicationWhereUniqueInput | ApplicationWhereUniqueInput[]
    delete?: ApplicationWhereUniqueInput | ApplicationWhereUniqueInput[]
    connect?: ApplicationWhereUniqueInput | ApplicationWhereUniqueInput[]
    update?: ApplicationUpdateWithWhereUniqueWithoutResumeInput | ApplicationUpdateWithWhereUniqueWithoutResumeInput[]
    updateMany?: ApplicationUpdateManyWithWhereWithoutResumeInput | ApplicationUpdateManyWithWhereWithoutResumeInput[]
    deleteMany?: ApplicationScalarWhereInput | ApplicationScalarWhereInput[]
  }

  export type Enumsponsor_tier_enumFieldUpdateOperationsInput = {
    set?: $Enums.sponsor_tier_enum
  }

  export type TeamCreateNestedOneWithoutMembersInput = {
    create?: XOR<TeamCreateWithoutMembersInput, TeamUncheckedCreateWithoutMembersInput>
    connectOrCreate?: TeamCreateOrConnectWithoutMembersInput
    connect?: TeamWhereUniqueInput
  }

  export type ProfileCreateNestedOneWithoutTeamMembersInput = {
    create?: XOR<ProfileCreateWithoutTeamMembersInput, ProfileUncheckedCreateWithoutTeamMembersInput>
    connectOrCreate?: ProfileCreateOrConnectWithoutTeamMembersInput
    connect?: ProfileWhereUniqueInput
  }

  export type Enumteam_role_enumFieldUpdateOperationsInput = {
    set?: $Enums.team_role_enum
  }

  export type TeamUpdateOneRequiredWithoutMembersNestedInput = {
    create?: XOR<TeamCreateWithoutMembersInput, TeamUncheckedCreateWithoutMembersInput>
    connectOrCreate?: TeamCreateOrConnectWithoutMembersInput
    upsert?: TeamUpsertWithoutMembersInput
    connect?: TeamWhereUniqueInput
    update?: XOR<XOR<TeamUpdateToOneWithWhereWithoutMembersInput, TeamUpdateWithoutMembersInput>, TeamUncheckedUpdateWithoutMembersInput>
  }

  export type ProfileUpdateOneRequiredWithoutTeamMembersNestedInput = {
    create?: XOR<ProfileCreateWithoutTeamMembersInput, ProfileUncheckedCreateWithoutTeamMembersInput>
    connectOrCreate?: ProfileCreateOrConnectWithoutTeamMembersInput
    upsert?: ProfileUpsertWithoutTeamMembersInput
    connect?: ProfileWhereUniqueInput
    update?: XOR<XOR<ProfileUpdateToOneWithWhereWithoutTeamMembersInput, ProfileUpdateWithoutTeamMembersInput>, ProfileUncheckedUpdateWithoutTeamMembersInput>
  }

  export type TeamMemberCreateNestedManyWithoutTeamInput = {
    create?: XOR<TeamMemberCreateWithoutTeamInput, TeamMemberUncheckedCreateWithoutTeamInput> | TeamMemberCreateWithoutTeamInput[] | TeamMemberUncheckedCreateWithoutTeamInput[]
    connectOrCreate?: TeamMemberCreateOrConnectWithoutTeamInput | TeamMemberCreateOrConnectWithoutTeamInput[]
    createMany?: TeamMemberCreateManyTeamInputEnvelope
    connect?: TeamMemberWhereUniqueInput | TeamMemberWhereUniqueInput[]
  }

  export type TeamMemberUncheckedCreateNestedManyWithoutTeamInput = {
    create?: XOR<TeamMemberCreateWithoutTeamInput, TeamMemberUncheckedCreateWithoutTeamInput> | TeamMemberCreateWithoutTeamInput[] | TeamMemberUncheckedCreateWithoutTeamInput[]
    connectOrCreate?: TeamMemberCreateOrConnectWithoutTeamInput | TeamMemberCreateOrConnectWithoutTeamInput[]
    createMany?: TeamMemberCreateManyTeamInputEnvelope
    connect?: TeamMemberWhereUniqueInput | TeamMemberWhereUniqueInput[]
  }

  export type TeamMemberUpdateManyWithoutTeamNestedInput = {
    create?: XOR<TeamMemberCreateWithoutTeamInput, TeamMemberUncheckedCreateWithoutTeamInput> | TeamMemberCreateWithoutTeamInput[] | TeamMemberUncheckedCreateWithoutTeamInput[]
    connectOrCreate?: TeamMemberCreateOrConnectWithoutTeamInput | TeamMemberCreateOrConnectWithoutTeamInput[]
    upsert?: TeamMemberUpsertWithWhereUniqueWithoutTeamInput | TeamMemberUpsertWithWhereUniqueWithoutTeamInput[]
    createMany?: TeamMemberCreateManyTeamInputEnvelope
    set?: TeamMemberWhereUniqueInput | TeamMemberWhereUniqueInput[]
    disconnect?: TeamMemberWhereUniqueInput | TeamMemberWhereUniqueInput[]
    delete?: TeamMemberWhereUniqueInput | TeamMemberWhereUniqueInput[]
    connect?: TeamMemberWhereUniqueInput | TeamMemberWhereUniqueInput[]
    update?: TeamMemberUpdateWithWhereUniqueWithoutTeamInput | TeamMemberUpdateWithWhereUniqueWithoutTeamInput[]
    updateMany?: TeamMemberUpdateManyWithWhereWithoutTeamInput | TeamMemberUpdateManyWithWhereWithoutTeamInput[]
    deleteMany?: TeamMemberScalarWhereInput | TeamMemberScalarWhereInput[]
  }

  export type TeamMemberUncheckedUpdateManyWithoutTeamNestedInput = {
    create?: XOR<TeamMemberCreateWithoutTeamInput, TeamMemberUncheckedCreateWithoutTeamInput> | TeamMemberCreateWithoutTeamInput[] | TeamMemberUncheckedCreateWithoutTeamInput[]
    connectOrCreate?: TeamMemberCreateOrConnectWithoutTeamInput | TeamMemberCreateOrConnectWithoutTeamInput[]
    upsert?: TeamMemberUpsertWithWhereUniqueWithoutTeamInput | TeamMemberUpsertWithWhereUniqueWithoutTeamInput[]
    createMany?: TeamMemberCreateManyTeamInputEnvelope
    set?: TeamMemberWhereUniqueInput | TeamMemberWhereUniqueInput[]
    disconnect?: TeamMemberWhereUniqueInput | TeamMemberWhereUniqueInput[]
    delete?: TeamMemberWhereUniqueInput | TeamMemberWhereUniqueInput[]
    connect?: TeamMemberWhereUniqueInput | TeamMemberWhereUniqueInput[]
    update?: TeamMemberUpdateWithWhereUniqueWithoutTeamInput | TeamMemberUpdateWithWhereUniqueWithoutTeamInput[]
    updateMany?: TeamMemberUpdateManyWithWhereWithoutTeamInput | TeamMemberUpdateManyWithWhereWithoutTeamInput[]
    deleteMany?: TeamMemberScalarWhereInput | TeamMemberScalarWhereInput[]
  }

  export type NestedBigIntFilter<$PrismaModel = never> = {
    equals?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    in?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel>
    notIn?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel>
    lt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    lte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    not?: NestedBigIntFilter<$PrismaModel> | bigint | number
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedBigIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    in?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel>
    notIn?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel>
    lt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    lte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    not?: NestedBigIntWithAggregatesFilter<$PrismaModel> | bigint | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedBigIntFilter<$PrismaModel>
    _min?: NestedBigIntFilter<$PrismaModel>
    _max?: NestedBigIntFilter<$PrismaModel>
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedUuidFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedUuidFilter<$PrismaModel> | string
  }

  export type NestedBigIntNullableFilter<$PrismaModel = never> = {
    equals?: bigint | number | BigIntFieldRefInput<$PrismaModel> | null
    in?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel> | null
    notIn?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel> | null
    lt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    lte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    not?: NestedBigIntNullableFilter<$PrismaModel> | bigint | number | null
  }

  export type NestedEnumapplication_status_enumFilter<$PrismaModel = never> = {
    equals?: $Enums.application_status_enum | Enumapplication_status_enumFieldRefInput<$PrismaModel>
    in?: $Enums.application_status_enum[] | ListEnumapplication_status_enumFieldRefInput<$PrismaModel>
    notIn?: $Enums.application_status_enum[] | ListEnumapplication_status_enumFieldRefInput<$PrismaModel>
    not?: NestedEnumapplication_status_enumFilter<$PrismaModel> | $Enums.application_status_enum
  }

  export type NestedEnumrole_enumFilter<$PrismaModel = never> = {
    equals?: $Enums.role_enum | Enumrole_enumFieldRefInput<$PrismaModel>
    in?: $Enums.role_enum[] | ListEnumrole_enumFieldRefInput<$PrismaModel>
    notIn?: $Enums.role_enum[] | ListEnumrole_enumFieldRefInput<$PrismaModel>
    not?: NestedEnumrole_enumFilter<$PrismaModel> | $Enums.role_enum
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedDateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type NestedUuidWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedUuidWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedBigIntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: bigint | number | BigIntFieldRefInput<$PrismaModel> | null
    in?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel> | null
    notIn?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel> | null
    lt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    lte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    not?: NestedBigIntNullableWithAggregatesFilter<$PrismaModel> | bigint | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedBigIntNullableFilter<$PrismaModel>
    _min?: NestedBigIntNullableFilter<$PrismaModel>
    _max?: NestedBigIntNullableFilter<$PrismaModel>
  }

  export type NestedFloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
  }

  export type NestedEnumapplication_status_enumWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.application_status_enum | Enumapplication_status_enumFieldRefInput<$PrismaModel>
    in?: $Enums.application_status_enum[] | ListEnumapplication_status_enumFieldRefInput<$PrismaModel>
    notIn?: $Enums.application_status_enum[] | ListEnumapplication_status_enumFieldRefInput<$PrismaModel>
    not?: NestedEnumapplication_status_enumWithAggregatesFilter<$PrismaModel> | $Enums.application_status_enum
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumapplication_status_enumFilter<$PrismaModel>
    _max?: NestedEnumapplication_status_enumFilter<$PrismaModel>
  }

  export type NestedEnumrole_enumWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.role_enum | Enumrole_enumFieldRefInput<$PrismaModel>
    in?: $Enums.role_enum[] | ListEnumrole_enumFieldRefInput<$PrismaModel>
    notIn?: $Enums.role_enum[] | ListEnumrole_enumFieldRefInput<$PrismaModel>
    not?: NestedEnumrole_enumWithAggregatesFilter<$PrismaModel> | $Enums.role_enum
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumrole_enumFilter<$PrismaModel>
    _max?: NestedEnumrole_enumFilter<$PrismaModel>
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedDateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type NestedEnumsponsor_tier_enumFilter<$PrismaModel = never> = {
    equals?: $Enums.sponsor_tier_enum | Enumsponsor_tier_enumFieldRefInput<$PrismaModel>
    in?: $Enums.sponsor_tier_enum[] | ListEnumsponsor_tier_enumFieldRefInput<$PrismaModel>
    notIn?: $Enums.sponsor_tier_enum[] | ListEnumsponsor_tier_enumFieldRefInput<$PrismaModel>
    not?: NestedEnumsponsor_tier_enumFilter<$PrismaModel> | $Enums.sponsor_tier_enum
  }

  export type NestedEnumsponsor_tier_enumWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.sponsor_tier_enum | Enumsponsor_tier_enumFieldRefInput<$PrismaModel>
    in?: $Enums.sponsor_tier_enum[] | ListEnumsponsor_tier_enumFieldRefInput<$PrismaModel>
    notIn?: $Enums.sponsor_tier_enum[] | ListEnumsponsor_tier_enumFieldRefInput<$PrismaModel>
    not?: NestedEnumsponsor_tier_enumWithAggregatesFilter<$PrismaModel> | $Enums.sponsor_tier_enum
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumsponsor_tier_enumFilter<$PrismaModel>
    _max?: NestedEnumsponsor_tier_enumFilter<$PrismaModel>
  }

  export type NestedEnumteam_role_enumFilter<$PrismaModel = never> = {
    equals?: $Enums.team_role_enum | Enumteam_role_enumFieldRefInput<$PrismaModel>
    in?: $Enums.team_role_enum[] | ListEnumteam_role_enumFieldRefInput<$PrismaModel>
    notIn?: $Enums.team_role_enum[] | ListEnumteam_role_enumFieldRefInput<$PrismaModel>
    not?: NestedEnumteam_role_enumFilter<$PrismaModel> | $Enums.team_role_enum
  }

  export type NestedEnumteam_role_enumWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.team_role_enum | Enumteam_role_enumFieldRefInput<$PrismaModel>
    in?: $Enums.team_role_enum[] | ListEnumteam_role_enumFieldRefInput<$PrismaModel>
    notIn?: $Enums.team_role_enum[] | ListEnumteam_role_enumFieldRefInput<$PrismaModel>
    not?: NestedEnumteam_role_enumWithAggregatesFilter<$PrismaModel> | $Enums.team_role_enum
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumteam_role_enumFilter<$PrismaModel>
    _max?: NestedEnumteam_role_enumFilter<$PrismaModel>
  }

  export type ApplicationCreateWithoutAnswersInput = {
    id?: bigint | number
    status?: $Enums.application_status_enum
    role: $Enums.role_enum
    term: string
    comments?: string | null
    created_at?: Date | string
    updated_at?: Date | string
    submitted_at?: Date | string | null
    profile: ProfileCreateNestedOneWithoutApplicationsInput
    resume?: ResumeCreateNestedOneWithoutApplicationsInput
  }

  export type ApplicationUncheckedCreateWithoutAnswersInput = {
    id?: bigint | number
    profile_id: string
    resume_id?: bigint | number | null
    status?: $Enums.application_status_enum
    role: $Enums.role_enum
    term: string
    comments?: string | null
    created_at?: Date | string
    updated_at?: Date | string
    submitted_at?: Date | string | null
  }

  export type ApplicationCreateOrConnectWithoutAnswersInput = {
    where: ApplicationWhereUniqueInput
    create: XOR<ApplicationCreateWithoutAnswersInput, ApplicationUncheckedCreateWithoutAnswersInput>
  }

  export type QuestionCreateWithoutAnswersInput = {
    id?: bigint | number
    question_id: string
    question: string
    is_required?: boolean
    order_num: number
    max_length: number
    placeholder?: string | null
    help_text?: string | null
    role: $Enums.role_enum
    term: string
  }

  export type QuestionUncheckedCreateWithoutAnswersInput = {
    id?: bigint | number
    question_id: string
    question: string
    is_required?: boolean
    order_num: number
    max_length: number
    placeholder?: string | null
    help_text?: string | null
    role: $Enums.role_enum
    term: string
  }

  export type QuestionCreateOrConnectWithoutAnswersInput = {
    where: QuestionWhereUniqueInput
    create: XOR<QuestionCreateWithoutAnswersInput, QuestionUncheckedCreateWithoutAnswersInput>
  }

  export type ApplicationUpsertWithoutAnswersInput = {
    update: XOR<ApplicationUpdateWithoutAnswersInput, ApplicationUncheckedUpdateWithoutAnswersInput>
    create: XOR<ApplicationCreateWithoutAnswersInput, ApplicationUncheckedCreateWithoutAnswersInput>
    where?: ApplicationWhereInput
  }

  export type ApplicationUpdateToOneWithWhereWithoutAnswersInput = {
    where?: ApplicationWhereInput
    data: XOR<ApplicationUpdateWithoutAnswersInput, ApplicationUncheckedUpdateWithoutAnswersInput>
  }

  export type ApplicationUpdateWithoutAnswersInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    status?: Enumapplication_status_enumFieldUpdateOperationsInput | $Enums.application_status_enum
    role?: Enumrole_enumFieldUpdateOperationsInput | $Enums.role_enum
    term?: StringFieldUpdateOperationsInput | string
    comments?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    submitted_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    profile?: ProfileUpdateOneRequiredWithoutApplicationsNestedInput
    resume?: ResumeUpdateOneWithoutApplicationsNestedInput
  }

  export type ApplicationUncheckedUpdateWithoutAnswersInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    profile_id?: StringFieldUpdateOperationsInput | string
    resume_id?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
    status?: Enumapplication_status_enumFieldUpdateOperationsInput | $Enums.application_status_enum
    role?: Enumrole_enumFieldUpdateOperationsInput | $Enums.role_enum
    term?: StringFieldUpdateOperationsInput | string
    comments?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    submitted_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type QuestionUpsertWithoutAnswersInput = {
    update: XOR<QuestionUpdateWithoutAnswersInput, QuestionUncheckedUpdateWithoutAnswersInput>
    create: XOR<QuestionCreateWithoutAnswersInput, QuestionUncheckedCreateWithoutAnswersInput>
    where?: QuestionWhereInput
  }

  export type QuestionUpdateToOneWithWhereWithoutAnswersInput = {
    where?: QuestionWhereInput
    data: XOR<QuestionUpdateWithoutAnswersInput, QuestionUncheckedUpdateWithoutAnswersInput>
  }

  export type QuestionUpdateWithoutAnswersInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    question_id?: StringFieldUpdateOperationsInput | string
    question?: StringFieldUpdateOperationsInput | string
    is_required?: BoolFieldUpdateOperationsInput | boolean
    order_num?: IntFieldUpdateOperationsInput | number
    max_length?: IntFieldUpdateOperationsInput | number
    placeholder?: NullableStringFieldUpdateOperationsInput | string | null
    help_text?: NullableStringFieldUpdateOperationsInput | string | null
    role?: Enumrole_enumFieldUpdateOperationsInput | $Enums.role_enum
    term?: StringFieldUpdateOperationsInput | string
  }

  export type QuestionUncheckedUpdateWithoutAnswersInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    question_id?: StringFieldUpdateOperationsInput | string
    question?: StringFieldUpdateOperationsInput | string
    is_required?: BoolFieldUpdateOperationsInput | boolean
    order_num?: IntFieldUpdateOperationsInput | number
    max_length?: IntFieldUpdateOperationsInput | number
    placeholder?: NullableStringFieldUpdateOperationsInput | string | null
    help_text?: NullableStringFieldUpdateOperationsInput | string | null
    role?: Enumrole_enumFieldUpdateOperationsInput | $Enums.role_enum
    term?: StringFieldUpdateOperationsInput | string
  }

  export type ProfileCreateWithoutApplicationsInput = {
    id?: string
    first_name: string
    last_name: string
    role?: $Enums.role_enum
    nfc_id?: bigint | number | null
    created_at?: Date | string
    updated_at?: Date | string
    resumes?: ResumeCreateNestedManyWithoutProfileInput
    eventAttendance?: EventAttendanceCreateNestedManyWithoutProfileInput
    teamMembers?: TeamMemberCreateNestedManyWithoutProfileInput
  }

  export type ProfileUncheckedCreateWithoutApplicationsInput = {
    id?: string
    first_name: string
    last_name: string
    role?: $Enums.role_enum
    nfc_id?: bigint | number | null
    created_at?: Date | string
    updated_at?: Date | string
    resumes?: ResumeUncheckedCreateNestedManyWithoutProfileInput
    eventAttendance?: EventAttendanceUncheckedCreateNestedManyWithoutProfileInput
    teamMembers?: TeamMemberUncheckedCreateNestedManyWithoutProfileInput
  }

  export type ProfileCreateOrConnectWithoutApplicationsInput = {
    where: ProfileWhereUniqueInput
    create: XOR<ProfileCreateWithoutApplicationsInput, ProfileUncheckedCreateWithoutApplicationsInput>
  }

  export type ResumeCreateWithoutApplicationsInput = {
    id?: bigint | number
    file_path: string
    created_at?: Date | string
    profile: ProfileCreateNestedOneWithoutResumesInput
  }

  export type ResumeUncheckedCreateWithoutApplicationsInput = {
    id?: bigint | number
    profile_id: string
    file_path: string
    created_at?: Date | string
  }

  export type ResumeCreateOrConnectWithoutApplicationsInput = {
    where: ResumeWhereUniqueInput
    create: XOR<ResumeCreateWithoutApplicationsInput, ResumeUncheckedCreateWithoutApplicationsInput>
  }

  export type ApplicationAnswerCreateWithoutApplicationInput = {
    id?: bigint | number
    answer?: string | null
    created_at?: Date | string
    updated_at?: Date | string
    question: QuestionCreateNestedOneWithoutAnswersInput
  }

  export type ApplicationAnswerUncheckedCreateWithoutApplicationInput = {
    id?: bigint | number
    question_id: bigint | number
    answer?: string | null
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type ApplicationAnswerCreateOrConnectWithoutApplicationInput = {
    where: ApplicationAnswerWhereUniqueInput
    create: XOR<ApplicationAnswerCreateWithoutApplicationInput, ApplicationAnswerUncheckedCreateWithoutApplicationInput>
  }

  export type ApplicationAnswerCreateManyApplicationInputEnvelope = {
    data: ApplicationAnswerCreateManyApplicationInput | ApplicationAnswerCreateManyApplicationInput[]
    skipDuplicates?: boolean
  }

  export type ProfileUpsertWithoutApplicationsInput = {
    update: XOR<ProfileUpdateWithoutApplicationsInput, ProfileUncheckedUpdateWithoutApplicationsInput>
    create: XOR<ProfileCreateWithoutApplicationsInput, ProfileUncheckedCreateWithoutApplicationsInput>
    where?: ProfileWhereInput
  }

  export type ProfileUpdateToOneWithWhereWithoutApplicationsInput = {
    where?: ProfileWhereInput
    data: XOR<ProfileUpdateWithoutApplicationsInput, ProfileUncheckedUpdateWithoutApplicationsInput>
  }

  export type ProfileUpdateWithoutApplicationsInput = {
    id?: StringFieldUpdateOperationsInput | string
    first_name?: StringFieldUpdateOperationsInput | string
    last_name?: StringFieldUpdateOperationsInput | string
    role?: Enumrole_enumFieldUpdateOperationsInput | $Enums.role_enum
    nfc_id?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    resumes?: ResumeUpdateManyWithoutProfileNestedInput
    eventAttendance?: EventAttendanceUpdateManyWithoutProfileNestedInput
    teamMembers?: TeamMemberUpdateManyWithoutProfileNestedInput
  }

  export type ProfileUncheckedUpdateWithoutApplicationsInput = {
    id?: StringFieldUpdateOperationsInput | string
    first_name?: StringFieldUpdateOperationsInput | string
    last_name?: StringFieldUpdateOperationsInput | string
    role?: Enumrole_enumFieldUpdateOperationsInput | $Enums.role_enum
    nfc_id?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    resumes?: ResumeUncheckedUpdateManyWithoutProfileNestedInput
    eventAttendance?: EventAttendanceUncheckedUpdateManyWithoutProfileNestedInput
    teamMembers?: TeamMemberUncheckedUpdateManyWithoutProfileNestedInput
  }

  export type ResumeUpsertWithoutApplicationsInput = {
    update: XOR<ResumeUpdateWithoutApplicationsInput, ResumeUncheckedUpdateWithoutApplicationsInput>
    create: XOR<ResumeCreateWithoutApplicationsInput, ResumeUncheckedCreateWithoutApplicationsInput>
    where?: ResumeWhereInput
  }

  export type ResumeUpdateToOneWithWhereWithoutApplicationsInput = {
    where?: ResumeWhereInput
    data: XOR<ResumeUpdateWithoutApplicationsInput, ResumeUncheckedUpdateWithoutApplicationsInput>
  }

  export type ResumeUpdateWithoutApplicationsInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    file_path?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    profile?: ProfileUpdateOneRequiredWithoutResumesNestedInput
  }

  export type ResumeUncheckedUpdateWithoutApplicationsInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    profile_id?: StringFieldUpdateOperationsInput | string
    file_path?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ApplicationAnswerUpsertWithWhereUniqueWithoutApplicationInput = {
    where: ApplicationAnswerWhereUniqueInput
    update: XOR<ApplicationAnswerUpdateWithoutApplicationInput, ApplicationAnswerUncheckedUpdateWithoutApplicationInput>
    create: XOR<ApplicationAnswerCreateWithoutApplicationInput, ApplicationAnswerUncheckedCreateWithoutApplicationInput>
  }

  export type ApplicationAnswerUpdateWithWhereUniqueWithoutApplicationInput = {
    where: ApplicationAnswerWhereUniqueInput
    data: XOR<ApplicationAnswerUpdateWithoutApplicationInput, ApplicationAnswerUncheckedUpdateWithoutApplicationInput>
  }

  export type ApplicationAnswerUpdateManyWithWhereWithoutApplicationInput = {
    where: ApplicationAnswerScalarWhereInput
    data: XOR<ApplicationAnswerUpdateManyMutationInput, ApplicationAnswerUncheckedUpdateManyWithoutApplicationInput>
  }

  export type ApplicationAnswerScalarWhereInput = {
    AND?: ApplicationAnswerScalarWhereInput | ApplicationAnswerScalarWhereInput[]
    OR?: ApplicationAnswerScalarWhereInput[]
    NOT?: ApplicationAnswerScalarWhereInput | ApplicationAnswerScalarWhereInput[]
    id?: BigIntFilter<"ApplicationAnswer"> | bigint | number
    application_id?: BigIntFilter<"ApplicationAnswer"> | bigint | number
    question_id?: BigIntFilter<"ApplicationAnswer"> | bigint | number
    answer?: StringNullableFilter<"ApplicationAnswer"> | string | null
    created_at?: DateTimeFilter<"ApplicationAnswer"> | Date | string
    updated_at?: DateTimeFilter<"ApplicationAnswer"> | Date | string
  }

  export type EventCreateWithoutAttendanceInput = {
    id?: bigint | number
    name: string
    registration_required: boolean
    description?: string | null
    location?: string | null
    start_time: Date | string
    buffered_start_time: Date | string
    end_time: Date | string
    buffered_end_time: Date | string
    payment_required?: boolean
    image_id?: bigint | number | null
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type EventUncheckedCreateWithoutAttendanceInput = {
    id?: bigint | number
    name: string
    registration_required: boolean
    description?: string | null
    location?: string | null
    start_time: Date | string
    buffered_start_time: Date | string
    end_time: Date | string
    buffered_end_time: Date | string
    payment_required?: boolean
    image_id?: bigint | number | null
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type EventCreateOrConnectWithoutAttendanceInput = {
    where: EventWhereUniqueInput
    create: XOR<EventCreateWithoutAttendanceInput, EventUncheckedCreateWithoutAttendanceInput>
  }

  export type ProfileCreateWithoutEventAttendanceInput = {
    id?: string
    first_name: string
    last_name: string
    role?: $Enums.role_enum
    nfc_id?: bigint | number | null
    created_at?: Date | string
    updated_at?: Date | string
    resumes?: ResumeCreateNestedManyWithoutProfileInput
    applications?: ApplicationCreateNestedManyWithoutProfileInput
    teamMembers?: TeamMemberCreateNestedManyWithoutProfileInput
  }

  export type ProfileUncheckedCreateWithoutEventAttendanceInput = {
    id?: string
    first_name: string
    last_name: string
    role?: $Enums.role_enum
    nfc_id?: bigint | number | null
    created_at?: Date | string
    updated_at?: Date | string
    resumes?: ResumeUncheckedCreateNestedManyWithoutProfileInput
    applications?: ApplicationUncheckedCreateNestedManyWithoutProfileInput
    teamMembers?: TeamMemberUncheckedCreateNestedManyWithoutProfileInput
  }

  export type ProfileCreateOrConnectWithoutEventAttendanceInput = {
    where: ProfileWhereUniqueInput
    create: XOR<ProfileCreateWithoutEventAttendanceInput, ProfileUncheckedCreateWithoutEventAttendanceInput>
  }

  export type EventUpsertWithoutAttendanceInput = {
    update: XOR<EventUpdateWithoutAttendanceInput, EventUncheckedUpdateWithoutAttendanceInput>
    create: XOR<EventCreateWithoutAttendanceInput, EventUncheckedCreateWithoutAttendanceInput>
    where?: EventWhereInput
  }

  export type EventUpdateToOneWithWhereWithoutAttendanceInput = {
    where?: EventWhereInput
    data: XOR<EventUpdateWithoutAttendanceInput, EventUncheckedUpdateWithoutAttendanceInput>
  }

  export type EventUpdateWithoutAttendanceInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    name?: StringFieldUpdateOperationsInput | string
    registration_required?: BoolFieldUpdateOperationsInput | boolean
    description?: NullableStringFieldUpdateOperationsInput | string | null
    location?: NullableStringFieldUpdateOperationsInput | string | null
    start_time?: DateTimeFieldUpdateOperationsInput | Date | string
    buffered_start_time?: DateTimeFieldUpdateOperationsInput | Date | string
    end_time?: DateTimeFieldUpdateOperationsInput | Date | string
    buffered_end_time?: DateTimeFieldUpdateOperationsInput | Date | string
    payment_required?: BoolFieldUpdateOperationsInput | boolean
    image_id?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type EventUncheckedUpdateWithoutAttendanceInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    name?: StringFieldUpdateOperationsInput | string
    registration_required?: BoolFieldUpdateOperationsInput | boolean
    description?: NullableStringFieldUpdateOperationsInput | string | null
    location?: NullableStringFieldUpdateOperationsInput | string | null
    start_time?: DateTimeFieldUpdateOperationsInput | Date | string
    buffered_start_time?: DateTimeFieldUpdateOperationsInput | Date | string
    end_time?: DateTimeFieldUpdateOperationsInput | Date | string
    buffered_end_time?: DateTimeFieldUpdateOperationsInput | Date | string
    payment_required?: BoolFieldUpdateOperationsInput | boolean
    image_id?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProfileUpsertWithoutEventAttendanceInput = {
    update: XOR<ProfileUpdateWithoutEventAttendanceInput, ProfileUncheckedUpdateWithoutEventAttendanceInput>
    create: XOR<ProfileCreateWithoutEventAttendanceInput, ProfileUncheckedCreateWithoutEventAttendanceInput>
    where?: ProfileWhereInput
  }

  export type ProfileUpdateToOneWithWhereWithoutEventAttendanceInput = {
    where?: ProfileWhereInput
    data: XOR<ProfileUpdateWithoutEventAttendanceInput, ProfileUncheckedUpdateWithoutEventAttendanceInput>
  }

  export type ProfileUpdateWithoutEventAttendanceInput = {
    id?: StringFieldUpdateOperationsInput | string
    first_name?: StringFieldUpdateOperationsInput | string
    last_name?: StringFieldUpdateOperationsInput | string
    role?: Enumrole_enumFieldUpdateOperationsInput | $Enums.role_enum
    nfc_id?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    resumes?: ResumeUpdateManyWithoutProfileNestedInput
    applications?: ApplicationUpdateManyWithoutProfileNestedInput
    teamMembers?: TeamMemberUpdateManyWithoutProfileNestedInput
  }

  export type ProfileUncheckedUpdateWithoutEventAttendanceInput = {
    id?: StringFieldUpdateOperationsInput | string
    first_name?: StringFieldUpdateOperationsInput | string
    last_name?: StringFieldUpdateOperationsInput | string
    role?: Enumrole_enumFieldUpdateOperationsInput | $Enums.role_enum
    nfc_id?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    resumes?: ResumeUncheckedUpdateManyWithoutProfileNestedInput
    applications?: ApplicationUncheckedUpdateManyWithoutProfileNestedInput
    teamMembers?: TeamMemberUncheckedUpdateManyWithoutProfileNestedInput
  }

  export type EventAttendanceCreateWithoutEventInput = {
    id?: bigint | number
    checked_in?: boolean
    created_at?: Date | string
    profile: ProfileCreateNestedOneWithoutEventAttendanceInput
  }

  export type EventAttendanceUncheckedCreateWithoutEventInput = {
    id?: bigint | number
    profile_id: string
    checked_in?: boolean
    created_at?: Date | string
  }

  export type EventAttendanceCreateOrConnectWithoutEventInput = {
    where: EventAttendanceWhereUniqueInput
    create: XOR<EventAttendanceCreateWithoutEventInput, EventAttendanceUncheckedCreateWithoutEventInput>
  }

  export type EventAttendanceCreateManyEventInputEnvelope = {
    data: EventAttendanceCreateManyEventInput | EventAttendanceCreateManyEventInput[]
    skipDuplicates?: boolean
  }

  export type EventAttendanceUpsertWithWhereUniqueWithoutEventInput = {
    where: EventAttendanceWhereUniqueInput
    update: XOR<EventAttendanceUpdateWithoutEventInput, EventAttendanceUncheckedUpdateWithoutEventInput>
    create: XOR<EventAttendanceCreateWithoutEventInput, EventAttendanceUncheckedCreateWithoutEventInput>
  }

  export type EventAttendanceUpdateWithWhereUniqueWithoutEventInput = {
    where: EventAttendanceWhereUniqueInput
    data: XOR<EventAttendanceUpdateWithoutEventInput, EventAttendanceUncheckedUpdateWithoutEventInput>
  }

  export type EventAttendanceUpdateManyWithWhereWithoutEventInput = {
    where: EventAttendanceScalarWhereInput
    data: XOR<EventAttendanceUpdateManyMutationInput, EventAttendanceUncheckedUpdateManyWithoutEventInput>
  }

  export type EventAttendanceScalarWhereInput = {
    AND?: EventAttendanceScalarWhereInput | EventAttendanceScalarWhereInput[]
    OR?: EventAttendanceScalarWhereInput[]
    NOT?: EventAttendanceScalarWhereInput | EventAttendanceScalarWhereInput[]
    id?: BigIntFilter<"EventAttendance"> | bigint | number
    event_id?: BigIntFilter<"EventAttendance"> | bigint | number
    profile_id?: UuidFilter<"EventAttendance"> | string
    checked_in?: BoolFilter<"EventAttendance"> | boolean
    created_at?: DateTimeFilter<"EventAttendance"> | Date | string
  }

  export type ResumeCreateWithoutProfileInput = {
    id?: bigint | number
    file_path: string
    created_at?: Date | string
    applications?: ApplicationCreateNestedManyWithoutResumeInput
  }

  export type ResumeUncheckedCreateWithoutProfileInput = {
    id?: bigint | number
    file_path: string
    created_at?: Date | string
    applications?: ApplicationUncheckedCreateNestedManyWithoutResumeInput
  }

  export type ResumeCreateOrConnectWithoutProfileInput = {
    where: ResumeWhereUniqueInput
    create: XOR<ResumeCreateWithoutProfileInput, ResumeUncheckedCreateWithoutProfileInput>
  }

  export type ResumeCreateManyProfileInputEnvelope = {
    data: ResumeCreateManyProfileInput | ResumeCreateManyProfileInput[]
    skipDuplicates?: boolean
  }

  export type ApplicationCreateWithoutProfileInput = {
    id?: bigint | number
    status?: $Enums.application_status_enum
    role: $Enums.role_enum
    term: string
    comments?: string | null
    created_at?: Date | string
    updated_at?: Date | string
    submitted_at?: Date | string | null
    resume?: ResumeCreateNestedOneWithoutApplicationsInput
    answers?: ApplicationAnswerCreateNestedManyWithoutApplicationInput
  }

  export type ApplicationUncheckedCreateWithoutProfileInput = {
    id?: bigint | number
    resume_id?: bigint | number | null
    status?: $Enums.application_status_enum
    role: $Enums.role_enum
    term: string
    comments?: string | null
    created_at?: Date | string
    updated_at?: Date | string
    submitted_at?: Date | string | null
    answers?: ApplicationAnswerUncheckedCreateNestedManyWithoutApplicationInput
  }

  export type ApplicationCreateOrConnectWithoutProfileInput = {
    where: ApplicationWhereUniqueInput
    create: XOR<ApplicationCreateWithoutProfileInput, ApplicationUncheckedCreateWithoutProfileInput>
  }

  export type ApplicationCreateManyProfileInputEnvelope = {
    data: ApplicationCreateManyProfileInput | ApplicationCreateManyProfileInput[]
    skipDuplicates?: boolean
  }

  export type EventAttendanceCreateWithoutProfileInput = {
    id?: bigint | number
    checked_in?: boolean
    created_at?: Date | string
    event: EventCreateNestedOneWithoutAttendanceInput
  }

  export type EventAttendanceUncheckedCreateWithoutProfileInput = {
    id?: bigint | number
    event_id: bigint | number
    checked_in?: boolean
    created_at?: Date | string
  }

  export type EventAttendanceCreateOrConnectWithoutProfileInput = {
    where: EventAttendanceWhereUniqueInput
    create: XOR<EventAttendanceCreateWithoutProfileInput, EventAttendanceUncheckedCreateWithoutProfileInput>
  }

  export type EventAttendanceCreateManyProfileInputEnvelope = {
    data: EventAttendanceCreateManyProfileInput | EventAttendanceCreateManyProfileInput[]
    skipDuplicates?: boolean
  }

  export type TeamMemberCreateWithoutProfileInput = {
    id?: bigint | number
    role?: $Enums.team_role_enum
    created_at?: Date | string
    joined_at?: Date | string
    team: TeamCreateNestedOneWithoutMembersInput
  }

  export type TeamMemberUncheckedCreateWithoutProfileInput = {
    id?: bigint | number
    team_id: bigint | number
    role?: $Enums.team_role_enum
    created_at?: Date | string
    joined_at?: Date | string
  }

  export type TeamMemberCreateOrConnectWithoutProfileInput = {
    where: TeamMemberWhereUniqueInput
    create: XOR<TeamMemberCreateWithoutProfileInput, TeamMemberUncheckedCreateWithoutProfileInput>
  }

  export type TeamMemberCreateManyProfileInputEnvelope = {
    data: TeamMemberCreateManyProfileInput | TeamMemberCreateManyProfileInput[]
    skipDuplicates?: boolean
  }

  export type ResumeUpsertWithWhereUniqueWithoutProfileInput = {
    where: ResumeWhereUniqueInput
    update: XOR<ResumeUpdateWithoutProfileInput, ResumeUncheckedUpdateWithoutProfileInput>
    create: XOR<ResumeCreateWithoutProfileInput, ResumeUncheckedCreateWithoutProfileInput>
  }

  export type ResumeUpdateWithWhereUniqueWithoutProfileInput = {
    where: ResumeWhereUniqueInput
    data: XOR<ResumeUpdateWithoutProfileInput, ResumeUncheckedUpdateWithoutProfileInput>
  }

  export type ResumeUpdateManyWithWhereWithoutProfileInput = {
    where: ResumeScalarWhereInput
    data: XOR<ResumeUpdateManyMutationInput, ResumeUncheckedUpdateManyWithoutProfileInput>
  }

  export type ResumeScalarWhereInput = {
    AND?: ResumeScalarWhereInput | ResumeScalarWhereInput[]
    OR?: ResumeScalarWhereInput[]
    NOT?: ResumeScalarWhereInput | ResumeScalarWhereInput[]
    id?: BigIntFilter<"Resume"> | bigint | number
    profile_id?: UuidFilter<"Resume"> | string
    file_path?: StringFilter<"Resume"> | string
    created_at?: DateTimeFilter<"Resume"> | Date | string
  }

  export type ApplicationUpsertWithWhereUniqueWithoutProfileInput = {
    where: ApplicationWhereUniqueInput
    update: XOR<ApplicationUpdateWithoutProfileInput, ApplicationUncheckedUpdateWithoutProfileInput>
    create: XOR<ApplicationCreateWithoutProfileInput, ApplicationUncheckedCreateWithoutProfileInput>
  }

  export type ApplicationUpdateWithWhereUniqueWithoutProfileInput = {
    where: ApplicationWhereUniqueInput
    data: XOR<ApplicationUpdateWithoutProfileInput, ApplicationUncheckedUpdateWithoutProfileInput>
  }

  export type ApplicationUpdateManyWithWhereWithoutProfileInput = {
    where: ApplicationScalarWhereInput
    data: XOR<ApplicationUpdateManyMutationInput, ApplicationUncheckedUpdateManyWithoutProfileInput>
  }

  export type ApplicationScalarWhereInput = {
    AND?: ApplicationScalarWhereInput | ApplicationScalarWhereInput[]
    OR?: ApplicationScalarWhereInput[]
    NOT?: ApplicationScalarWhereInput | ApplicationScalarWhereInput[]
    id?: BigIntFilter<"Application"> | bigint | number
    profile_id?: UuidFilter<"Application"> | string
    resume_id?: BigIntNullableFilter<"Application"> | bigint | number | null
    status?: Enumapplication_status_enumFilter<"Application"> | $Enums.application_status_enum
    role?: Enumrole_enumFilter<"Application"> | $Enums.role_enum
    term?: StringFilter<"Application"> | string
    comments?: StringNullableFilter<"Application"> | string | null
    created_at?: DateTimeFilter<"Application"> | Date | string
    updated_at?: DateTimeFilter<"Application"> | Date | string
    submitted_at?: DateTimeNullableFilter<"Application"> | Date | string | null
  }

  export type EventAttendanceUpsertWithWhereUniqueWithoutProfileInput = {
    where: EventAttendanceWhereUniqueInput
    update: XOR<EventAttendanceUpdateWithoutProfileInput, EventAttendanceUncheckedUpdateWithoutProfileInput>
    create: XOR<EventAttendanceCreateWithoutProfileInput, EventAttendanceUncheckedCreateWithoutProfileInput>
  }

  export type EventAttendanceUpdateWithWhereUniqueWithoutProfileInput = {
    where: EventAttendanceWhereUniqueInput
    data: XOR<EventAttendanceUpdateWithoutProfileInput, EventAttendanceUncheckedUpdateWithoutProfileInput>
  }

  export type EventAttendanceUpdateManyWithWhereWithoutProfileInput = {
    where: EventAttendanceScalarWhereInput
    data: XOR<EventAttendanceUpdateManyMutationInput, EventAttendanceUncheckedUpdateManyWithoutProfileInput>
  }

  export type TeamMemberUpsertWithWhereUniqueWithoutProfileInput = {
    where: TeamMemberWhereUniqueInput
    update: XOR<TeamMemberUpdateWithoutProfileInput, TeamMemberUncheckedUpdateWithoutProfileInput>
    create: XOR<TeamMemberCreateWithoutProfileInput, TeamMemberUncheckedCreateWithoutProfileInput>
  }

  export type TeamMemberUpdateWithWhereUniqueWithoutProfileInput = {
    where: TeamMemberWhereUniqueInput
    data: XOR<TeamMemberUpdateWithoutProfileInput, TeamMemberUncheckedUpdateWithoutProfileInput>
  }

  export type TeamMemberUpdateManyWithWhereWithoutProfileInput = {
    where: TeamMemberScalarWhereInput
    data: XOR<TeamMemberUpdateManyMutationInput, TeamMemberUncheckedUpdateManyWithoutProfileInput>
  }

  export type TeamMemberScalarWhereInput = {
    AND?: TeamMemberScalarWhereInput | TeamMemberScalarWhereInput[]
    OR?: TeamMemberScalarWhereInput[]
    NOT?: TeamMemberScalarWhereInput | TeamMemberScalarWhereInput[]
    id?: BigIntFilter<"TeamMember"> | bigint | number
    team_id?: BigIntFilter<"TeamMember"> | bigint | number
    profile_id?: UuidFilter<"TeamMember"> | string
    role?: Enumteam_role_enumFilter<"TeamMember"> | $Enums.team_role_enum
    created_at?: DateTimeFilter<"TeamMember"> | Date | string
    joined_at?: DateTimeFilter<"TeamMember"> | Date | string
  }

  export type ApplicationAnswerCreateWithoutQuestionInput = {
    id?: bigint | number
    answer?: string | null
    created_at?: Date | string
    updated_at?: Date | string
    application: ApplicationCreateNestedOneWithoutAnswersInput
  }

  export type ApplicationAnswerUncheckedCreateWithoutQuestionInput = {
    id?: bigint | number
    application_id: bigint | number
    answer?: string | null
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type ApplicationAnswerCreateOrConnectWithoutQuestionInput = {
    where: ApplicationAnswerWhereUniqueInput
    create: XOR<ApplicationAnswerCreateWithoutQuestionInput, ApplicationAnswerUncheckedCreateWithoutQuestionInput>
  }

  export type ApplicationAnswerCreateManyQuestionInputEnvelope = {
    data: ApplicationAnswerCreateManyQuestionInput | ApplicationAnswerCreateManyQuestionInput[]
    skipDuplicates?: boolean
  }

  export type ApplicationAnswerUpsertWithWhereUniqueWithoutQuestionInput = {
    where: ApplicationAnswerWhereUniqueInput
    update: XOR<ApplicationAnswerUpdateWithoutQuestionInput, ApplicationAnswerUncheckedUpdateWithoutQuestionInput>
    create: XOR<ApplicationAnswerCreateWithoutQuestionInput, ApplicationAnswerUncheckedCreateWithoutQuestionInput>
  }

  export type ApplicationAnswerUpdateWithWhereUniqueWithoutQuestionInput = {
    where: ApplicationAnswerWhereUniqueInput
    data: XOR<ApplicationAnswerUpdateWithoutQuestionInput, ApplicationAnswerUncheckedUpdateWithoutQuestionInput>
  }

  export type ApplicationAnswerUpdateManyWithWhereWithoutQuestionInput = {
    where: ApplicationAnswerScalarWhereInput
    data: XOR<ApplicationAnswerUpdateManyMutationInput, ApplicationAnswerUncheckedUpdateManyWithoutQuestionInput>
  }

  export type ProfileCreateWithoutResumesInput = {
    id?: string
    first_name: string
    last_name: string
    role?: $Enums.role_enum
    nfc_id?: bigint | number | null
    created_at?: Date | string
    updated_at?: Date | string
    applications?: ApplicationCreateNestedManyWithoutProfileInput
    eventAttendance?: EventAttendanceCreateNestedManyWithoutProfileInput
    teamMembers?: TeamMemberCreateNestedManyWithoutProfileInput
  }

  export type ProfileUncheckedCreateWithoutResumesInput = {
    id?: string
    first_name: string
    last_name: string
    role?: $Enums.role_enum
    nfc_id?: bigint | number | null
    created_at?: Date | string
    updated_at?: Date | string
    applications?: ApplicationUncheckedCreateNestedManyWithoutProfileInput
    eventAttendance?: EventAttendanceUncheckedCreateNestedManyWithoutProfileInput
    teamMembers?: TeamMemberUncheckedCreateNestedManyWithoutProfileInput
  }

  export type ProfileCreateOrConnectWithoutResumesInput = {
    where: ProfileWhereUniqueInput
    create: XOR<ProfileCreateWithoutResumesInput, ProfileUncheckedCreateWithoutResumesInput>
  }

  export type ApplicationCreateWithoutResumeInput = {
    id?: bigint | number
    status?: $Enums.application_status_enum
    role: $Enums.role_enum
    term: string
    comments?: string | null
    created_at?: Date | string
    updated_at?: Date | string
    submitted_at?: Date | string | null
    profile: ProfileCreateNestedOneWithoutApplicationsInput
    answers?: ApplicationAnswerCreateNestedManyWithoutApplicationInput
  }

  export type ApplicationUncheckedCreateWithoutResumeInput = {
    id?: bigint | number
    profile_id: string
    status?: $Enums.application_status_enum
    role: $Enums.role_enum
    term: string
    comments?: string | null
    created_at?: Date | string
    updated_at?: Date | string
    submitted_at?: Date | string | null
    answers?: ApplicationAnswerUncheckedCreateNestedManyWithoutApplicationInput
  }

  export type ApplicationCreateOrConnectWithoutResumeInput = {
    where: ApplicationWhereUniqueInput
    create: XOR<ApplicationCreateWithoutResumeInput, ApplicationUncheckedCreateWithoutResumeInput>
  }

  export type ApplicationCreateManyResumeInputEnvelope = {
    data: ApplicationCreateManyResumeInput | ApplicationCreateManyResumeInput[]
    skipDuplicates?: boolean
  }

  export type ProfileUpsertWithoutResumesInput = {
    update: XOR<ProfileUpdateWithoutResumesInput, ProfileUncheckedUpdateWithoutResumesInput>
    create: XOR<ProfileCreateWithoutResumesInput, ProfileUncheckedCreateWithoutResumesInput>
    where?: ProfileWhereInput
  }

  export type ProfileUpdateToOneWithWhereWithoutResumesInput = {
    where?: ProfileWhereInput
    data: XOR<ProfileUpdateWithoutResumesInput, ProfileUncheckedUpdateWithoutResumesInput>
  }

  export type ProfileUpdateWithoutResumesInput = {
    id?: StringFieldUpdateOperationsInput | string
    first_name?: StringFieldUpdateOperationsInput | string
    last_name?: StringFieldUpdateOperationsInput | string
    role?: Enumrole_enumFieldUpdateOperationsInput | $Enums.role_enum
    nfc_id?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    applications?: ApplicationUpdateManyWithoutProfileNestedInput
    eventAttendance?: EventAttendanceUpdateManyWithoutProfileNestedInput
    teamMembers?: TeamMemberUpdateManyWithoutProfileNestedInput
  }

  export type ProfileUncheckedUpdateWithoutResumesInput = {
    id?: StringFieldUpdateOperationsInput | string
    first_name?: StringFieldUpdateOperationsInput | string
    last_name?: StringFieldUpdateOperationsInput | string
    role?: Enumrole_enumFieldUpdateOperationsInput | $Enums.role_enum
    nfc_id?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    applications?: ApplicationUncheckedUpdateManyWithoutProfileNestedInput
    eventAttendance?: EventAttendanceUncheckedUpdateManyWithoutProfileNestedInput
    teamMembers?: TeamMemberUncheckedUpdateManyWithoutProfileNestedInput
  }

  export type ApplicationUpsertWithWhereUniqueWithoutResumeInput = {
    where: ApplicationWhereUniqueInput
    update: XOR<ApplicationUpdateWithoutResumeInput, ApplicationUncheckedUpdateWithoutResumeInput>
    create: XOR<ApplicationCreateWithoutResumeInput, ApplicationUncheckedCreateWithoutResumeInput>
  }

  export type ApplicationUpdateWithWhereUniqueWithoutResumeInput = {
    where: ApplicationWhereUniqueInput
    data: XOR<ApplicationUpdateWithoutResumeInput, ApplicationUncheckedUpdateWithoutResumeInput>
  }

  export type ApplicationUpdateManyWithWhereWithoutResumeInput = {
    where: ApplicationScalarWhereInput
    data: XOR<ApplicationUpdateManyMutationInput, ApplicationUncheckedUpdateManyWithoutResumeInput>
  }

  export type TeamCreateWithoutMembersInput = {
    id?: bigint | number
    team_name: string
    team_size?: number
    is_recruiting?: boolean
    created_at?: Date | string
  }

  export type TeamUncheckedCreateWithoutMembersInput = {
    id?: bigint | number
    team_name: string
    team_size?: number
    is_recruiting?: boolean
    created_at?: Date | string
  }

  export type TeamCreateOrConnectWithoutMembersInput = {
    where: TeamWhereUniqueInput
    create: XOR<TeamCreateWithoutMembersInput, TeamUncheckedCreateWithoutMembersInput>
  }

  export type ProfileCreateWithoutTeamMembersInput = {
    id?: string
    first_name: string
    last_name: string
    role?: $Enums.role_enum
    nfc_id?: bigint | number | null
    created_at?: Date | string
    updated_at?: Date | string
    resumes?: ResumeCreateNestedManyWithoutProfileInput
    applications?: ApplicationCreateNestedManyWithoutProfileInput
    eventAttendance?: EventAttendanceCreateNestedManyWithoutProfileInput
  }

  export type ProfileUncheckedCreateWithoutTeamMembersInput = {
    id?: string
    first_name: string
    last_name: string
    role?: $Enums.role_enum
    nfc_id?: bigint | number | null
    created_at?: Date | string
    updated_at?: Date | string
    resumes?: ResumeUncheckedCreateNestedManyWithoutProfileInput
    applications?: ApplicationUncheckedCreateNestedManyWithoutProfileInput
    eventAttendance?: EventAttendanceUncheckedCreateNestedManyWithoutProfileInput
  }

  export type ProfileCreateOrConnectWithoutTeamMembersInput = {
    where: ProfileWhereUniqueInput
    create: XOR<ProfileCreateWithoutTeamMembersInput, ProfileUncheckedCreateWithoutTeamMembersInput>
  }

  export type TeamUpsertWithoutMembersInput = {
    update: XOR<TeamUpdateWithoutMembersInput, TeamUncheckedUpdateWithoutMembersInput>
    create: XOR<TeamCreateWithoutMembersInput, TeamUncheckedCreateWithoutMembersInput>
    where?: TeamWhereInput
  }

  export type TeamUpdateToOneWithWhereWithoutMembersInput = {
    where?: TeamWhereInput
    data: XOR<TeamUpdateWithoutMembersInput, TeamUncheckedUpdateWithoutMembersInput>
  }

  export type TeamUpdateWithoutMembersInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    team_name?: StringFieldUpdateOperationsInput | string
    team_size?: IntFieldUpdateOperationsInput | number
    is_recruiting?: BoolFieldUpdateOperationsInput | boolean
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TeamUncheckedUpdateWithoutMembersInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    team_name?: StringFieldUpdateOperationsInput | string
    team_size?: IntFieldUpdateOperationsInput | number
    is_recruiting?: BoolFieldUpdateOperationsInput | boolean
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProfileUpsertWithoutTeamMembersInput = {
    update: XOR<ProfileUpdateWithoutTeamMembersInput, ProfileUncheckedUpdateWithoutTeamMembersInput>
    create: XOR<ProfileCreateWithoutTeamMembersInput, ProfileUncheckedCreateWithoutTeamMembersInput>
    where?: ProfileWhereInput
  }

  export type ProfileUpdateToOneWithWhereWithoutTeamMembersInput = {
    where?: ProfileWhereInput
    data: XOR<ProfileUpdateWithoutTeamMembersInput, ProfileUncheckedUpdateWithoutTeamMembersInput>
  }

  export type ProfileUpdateWithoutTeamMembersInput = {
    id?: StringFieldUpdateOperationsInput | string
    first_name?: StringFieldUpdateOperationsInput | string
    last_name?: StringFieldUpdateOperationsInput | string
    role?: Enumrole_enumFieldUpdateOperationsInput | $Enums.role_enum
    nfc_id?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    resumes?: ResumeUpdateManyWithoutProfileNestedInput
    applications?: ApplicationUpdateManyWithoutProfileNestedInput
    eventAttendance?: EventAttendanceUpdateManyWithoutProfileNestedInput
  }

  export type ProfileUncheckedUpdateWithoutTeamMembersInput = {
    id?: StringFieldUpdateOperationsInput | string
    first_name?: StringFieldUpdateOperationsInput | string
    last_name?: StringFieldUpdateOperationsInput | string
    role?: Enumrole_enumFieldUpdateOperationsInput | $Enums.role_enum
    nfc_id?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    resumes?: ResumeUncheckedUpdateManyWithoutProfileNestedInput
    applications?: ApplicationUncheckedUpdateManyWithoutProfileNestedInput
    eventAttendance?: EventAttendanceUncheckedUpdateManyWithoutProfileNestedInput
  }

  export type TeamMemberCreateWithoutTeamInput = {
    id?: bigint | number
    role?: $Enums.team_role_enum
    created_at?: Date | string
    joined_at?: Date | string
    profile: ProfileCreateNestedOneWithoutTeamMembersInput
  }

  export type TeamMemberUncheckedCreateWithoutTeamInput = {
    id?: bigint | number
    profile_id: string
    role?: $Enums.team_role_enum
    created_at?: Date | string
    joined_at?: Date | string
  }

  export type TeamMemberCreateOrConnectWithoutTeamInput = {
    where: TeamMemberWhereUniqueInput
    create: XOR<TeamMemberCreateWithoutTeamInput, TeamMemberUncheckedCreateWithoutTeamInput>
  }

  export type TeamMemberCreateManyTeamInputEnvelope = {
    data: TeamMemberCreateManyTeamInput | TeamMemberCreateManyTeamInput[]
    skipDuplicates?: boolean
  }

  export type TeamMemberUpsertWithWhereUniqueWithoutTeamInput = {
    where: TeamMemberWhereUniqueInput
    update: XOR<TeamMemberUpdateWithoutTeamInput, TeamMemberUncheckedUpdateWithoutTeamInput>
    create: XOR<TeamMemberCreateWithoutTeamInput, TeamMemberUncheckedCreateWithoutTeamInput>
  }

  export type TeamMemberUpdateWithWhereUniqueWithoutTeamInput = {
    where: TeamMemberWhereUniqueInput
    data: XOR<TeamMemberUpdateWithoutTeamInput, TeamMemberUncheckedUpdateWithoutTeamInput>
  }

  export type TeamMemberUpdateManyWithWhereWithoutTeamInput = {
    where: TeamMemberScalarWhereInput
    data: XOR<TeamMemberUpdateManyMutationInput, TeamMemberUncheckedUpdateManyWithoutTeamInput>
  }

  export type ApplicationAnswerCreateManyApplicationInput = {
    id?: bigint | number
    question_id: bigint | number
    answer?: string | null
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type ApplicationAnswerUpdateWithoutApplicationInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    answer?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    question?: QuestionUpdateOneRequiredWithoutAnswersNestedInput
  }

  export type ApplicationAnswerUncheckedUpdateWithoutApplicationInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    question_id?: BigIntFieldUpdateOperationsInput | bigint | number
    answer?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ApplicationAnswerUncheckedUpdateManyWithoutApplicationInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    question_id?: BigIntFieldUpdateOperationsInput | bigint | number
    answer?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type EventAttendanceCreateManyEventInput = {
    id?: bigint | number
    profile_id: string
    checked_in?: boolean
    created_at?: Date | string
  }

  export type EventAttendanceUpdateWithoutEventInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    checked_in?: BoolFieldUpdateOperationsInput | boolean
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    profile?: ProfileUpdateOneRequiredWithoutEventAttendanceNestedInput
  }

  export type EventAttendanceUncheckedUpdateWithoutEventInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    profile_id?: StringFieldUpdateOperationsInput | string
    checked_in?: BoolFieldUpdateOperationsInput | boolean
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type EventAttendanceUncheckedUpdateManyWithoutEventInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    profile_id?: StringFieldUpdateOperationsInput | string
    checked_in?: BoolFieldUpdateOperationsInput | boolean
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ResumeCreateManyProfileInput = {
    id?: bigint | number
    file_path: string
    created_at?: Date | string
  }

  export type ApplicationCreateManyProfileInput = {
    id?: bigint | number
    resume_id?: bigint | number | null
    status?: $Enums.application_status_enum
    role: $Enums.role_enum
    term: string
    comments?: string | null
    created_at?: Date | string
    updated_at?: Date | string
    submitted_at?: Date | string | null
  }

  export type EventAttendanceCreateManyProfileInput = {
    id?: bigint | number
    event_id: bigint | number
    checked_in?: boolean
    created_at?: Date | string
  }

  export type TeamMemberCreateManyProfileInput = {
    id?: bigint | number
    team_id: bigint | number
    role?: $Enums.team_role_enum
    created_at?: Date | string
    joined_at?: Date | string
  }

  export type ResumeUpdateWithoutProfileInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    file_path?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    applications?: ApplicationUpdateManyWithoutResumeNestedInput
  }

  export type ResumeUncheckedUpdateWithoutProfileInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    file_path?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    applications?: ApplicationUncheckedUpdateManyWithoutResumeNestedInput
  }

  export type ResumeUncheckedUpdateManyWithoutProfileInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    file_path?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ApplicationUpdateWithoutProfileInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    status?: Enumapplication_status_enumFieldUpdateOperationsInput | $Enums.application_status_enum
    role?: Enumrole_enumFieldUpdateOperationsInput | $Enums.role_enum
    term?: StringFieldUpdateOperationsInput | string
    comments?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    submitted_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    resume?: ResumeUpdateOneWithoutApplicationsNestedInput
    answers?: ApplicationAnswerUpdateManyWithoutApplicationNestedInput
  }

  export type ApplicationUncheckedUpdateWithoutProfileInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    resume_id?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
    status?: Enumapplication_status_enumFieldUpdateOperationsInput | $Enums.application_status_enum
    role?: Enumrole_enumFieldUpdateOperationsInput | $Enums.role_enum
    term?: StringFieldUpdateOperationsInput | string
    comments?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    submitted_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    answers?: ApplicationAnswerUncheckedUpdateManyWithoutApplicationNestedInput
  }

  export type ApplicationUncheckedUpdateManyWithoutProfileInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    resume_id?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
    status?: Enumapplication_status_enumFieldUpdateOperationsInput | $Enums.application_status_enum
    role?: Enumrole_enumFieldUpdateOperationsInput | $Enums.role_enum
    term?: StringFieldUpdateOperationsInput | string
    comments?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    submitted_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type EventAttendanceUpdateWithoutProfileInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    checked_in?: BoolFieldUpdateOperationsInput | boolean
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    event?: EventUpdateOneRequiredWithoutAttendanceNestedInput
  }

  export type EventAttendanceUncheckedUpdateWithoutProfileInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    event_id?: BigIntFieldUpdateOperationsInput | bigint | number
    checked_in?: BoolFieldUpdateOperationsInput | boolean
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type EventAttendanceUncheckedUpdateManyWithoutProfileInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    event_id?: BigIntFieldUpdateOperationsInput | bigint | number
    checked_in?: BoolFieldUpdateOperationsInput | boolean
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TeamMemberUpdateWithoutProfileInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    role?: Enumteam_role_enumFieldUpdateOperationsInput | $Enums.team_role_enum
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    joined_at?: DateTimeFieldUpdateOperationsInput | Date | string
    team?: TeamUpdateOneRequiredWithoutMembersNestedInput
  }

  export type TeamMemberUncheckedUpdateWithoutProfileInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    team_id?: BigIntFieldUpdateOperationsInput | bigint | number
    role?: Enumteam_role_enumFieldUpdateOperationsInput | $Enums.team_role_enum
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    joined_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TeamMemberUncheckedUpdateManyWithoutProfileInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    team_id?: BigIntFieldUpdateOperationsInput | bigint | number
    role?: Enumteam_role_enumFieldUpdateOperationsInput | $Enums.team_role_enum
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    joined_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ApplicationAnswerCreateManyQuestionInput = {
    id?: bigint | number
    application_id: bigint | number
    answer?: string | null
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type ApplicationAnswerUpdateWithoutQuestionInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    answer?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    application?: ApplicationUpdateOneRequiredWithoutAnswersNestedInput
  }

  export type ApplicationAnswerUncheckedUpdateWithoutQuestionInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    application_id?: BigIntFieldUpdateOperationsInput | bigint | number
    answer?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ApplicationAnswerUncheckedUpdateManyWithoutQuestionInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    application_id?: BigIntFieldUpdateOperationsInput | bigint | number
    answer?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ApplicationCreateManyResumeInput = {
    id?: bigint | number
    profile_id: string
    status?: $Enums.application_status_enum
    role: $Enums.role_enum
    term: string
    comments?: string | null
    created_at?: Date | string
    updated_at?: Date | string
    submitted_at?: Date | string | null
  }

  export type ApplicationUpdateWithoutResumeInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    status?: Enumapplication_status_enumFieldUpdateOperationsInput | $Enums.application_status_enum
    role?: Enumrole_enumFieldUpdateOperationsInput | $Enums.role_enum
    term?: StringFieldUpdateOperationsInput | string
    comments?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    submitted_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    profile?: ProfileUpdateOneRequiredWithoutApplicationsNestedInput
    answers?: ApplicationAnswerUpdateManyWithoutApplicationNestedInput
  }

  export type ApplicationUncheckedUpdateWithoutResumeInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    profile_id?: StringFieldUpdateOperationsInput | string
    status?: Enumapplication_status_enumFieldUpdateOperationsInput | $Enums.application_status_enum
    role?: Enumrole_enumFieldUpdateOperationsInput | $Enums.role_enum
    term?: StringFieldUpdateOperationsInput | string
    comments?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    submitted_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    answers?: ApplicationAnswerUncheckedUpdateManyWithoutApplicationNestedInput
  }

  export type ApplicationUncheckedUpdateManyWithoutResumeInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    profile_id?: StringFieldUpdateOperationsInput | string
    status?: Enumapplication_status_enumFieldUpdateOperationsInput | $Enums.application_status_enum
    role?: Enumrole_enumFieldUpdateOperationsInput | $Enums.role_enum
    term?: StringFieldUpdateOperationsInput | string
    comments?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    submitted_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type TeamMemberCreateManyTeamInput = {
    id?: bigint | number
    profile_id: string
    role?: $Enums.team_role_enum
    created_at?: Date | string
    joined_at?: Date | string
  }

  export type TeamMemberUpdateWithoutTeamInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    role?: Enumteam_role_enumFieldUpdateOperationsInput | $Enums.team_role_enum
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    joined_at?: DateTimeFieldUpdateOperationsInput | Date | string
    profile?: ProfileUpdateOneRequiredWithoutTeamMembersNestedInput
  }

  export type TeamMemberUncheckedUpdateWithoutTeamInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    profile_id?: StringFieldUpdateOperationsInput | string
    role?: Enumteam_role_enumFieldUpdateOperationsInput | $Enums.team_role_enum
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    joined_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TeamMemberUncheckedUpdateManyWithoutTeamInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    profile_id?: StringFieldUpdateOperationsInput | string
    role?: Enumteam_role_enumFieldUpdateOperationsInput | $Enums.team_role_enum
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    joined_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }



  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}