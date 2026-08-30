declare namespace Temporal {
  class Instant {
    static from(item: string | { [key: string]: unknown }): Instant;
    toZonedDateTimeISO(timeZone: string | { toString(): string }): ZonedDateTime;
    until(other: Instant, options?: { largestUnit?: string }): Duration;
    equals(other: Instant): boolean;
    valueOf(): number;
    toString(): string;
    toJSON(): string;
  }

  class ZonedDateTime {
    static from(item: string | { [key: string]: unknown }): ZonedDateTime;
    get epochMilliseconds(): number;
    get timeZoneId(): string;
    equals(other: ZonedDateTime): boolean;
    valueOf(): number;
    toString(): string;
  }

  class Duration {
    static from(item: { [key: string]: unknown }): Duration;
    get years(): number;
    get months(): number;
    get weeks(): number;
    get days(): number;
    get hours(): number;
    get minutes(): number;
    get seconds(): number;
    get milliseconds(): number;
    get microseconds(): number;
    get nanoseconds(): number;
    total(options: { unit: string }): number;
    toString(): string;
  }

  namespace Now {
    function instant(): Instant;
  }
}
