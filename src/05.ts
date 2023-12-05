import * as fs from "fs";
import { cellsAround, inclusiveRange } from "./utils";

type ValueRange = {
  start: bigint;
  length: bigint;
};

type MapRange = {
  sourceStart: bigint;
  destinationStart: bigint;
  length: bigint;
};

function parseRange(line: string): MapRange {
  const parts = line.split(" ");
  return {
    destinationStart: BigInt(parts[0]),
    sourceStart: BigInt(parts[1]),
    length: BigInt(parts[2]),
  };
}

class ValueMapper {
  readonly ranges: MapRange[];

  constructor(ranges: MapRange[]) {
    this.ranges = ranges.sort((a, b) =>
      a.sourceStart > b.sourceStart ? 1 : -1
    );
  }

  getValue(key: bigint) {
    const containingRange = this.ranges.find(
      (range) =>
        range.sourceStart <= key && key < range.sourceStart + range.length
    );
    if (containingRange) {
      return (
        key - containingRange.sourceStart + containingRange.destinationStart
      );
    }
    return key;
  }

  getRangeValue(startRange: ValueRange): ValueRange[] {
    const mappedRanges: ValueRange[] = [];
    let unmatchedRange: ValueRange = { ...startRange };
    let i = 0;
    while (unmatchedRange.length > 0) {
      if (
        i < this.ranges.length &&
        this.ranges[i].sourceStart > unmatchedRange.start
      ) {
        const currentRange = this.ranges[i];
        const length =
          currentRange.sourceStart - unmatchedRange.start <
          unmatchedRange.length
            ? currentRange.sourceStart - unmatchedRange.start
            : unmatchedRange.length;
        mappedRanges.push({
          start: unmatchedRange.start,
          length,
        });
        unmatchedRange = {
          start: unmatchedRange.start + length,
          length: unmatchedRange.length - length,
        };
        i += 1;
        continue;
      }

      if (i < this.ranges.length) {
        const currentRange = this.ranges[i];
        if (
          unmatchedRange.start <
          currentRange.sourceStart + currentRange.length
        ) {
          const offset = unmatchedRange.start - currentRange.sourceStart;
          const length =
            currentRange.length - offset < unmatchedRange.length
              ? currentRange.length - offset
              : unmatchedRange.length;
          mappedRanges.push({
            start: currentRange.destinationStart + offset,
            length,
          });
          unmatchedRange = {
            start: unmatchedRange.start + length,
            length: unmatchedRange.length - length,
          };
        }
      } else {
        mappedRanges.push(unmatchedRange);
        unmatchedRange = {
          start: unmatchedRange.start + unmatchedRange.length,
          length: BigInt(0),
        };
      }
      i += 1;
    }

    return mappedRanges;
  }
}

export function run05() {
  const lines = fs.readFileSync("inputs/05.txt", "utf8").split("\n");

  const startSeeds = lines[0]
    .split(": ")[1]
    .split(" ")
    .map((v) => BigInt(v));

  const valueMaps: ValueMapper[] = [];
  let i = 2;
  while (i < lines.length) {
    const mapName = lines[i];
    i += 1;
    const ranges: MapRange[] = [];
    while (i < lines.length && lines[i] !== "") {
      ranges.push(parseRange(lines[i]));
      i += 1;
    }
    valueMaps.push(new ValueMapper(ranges));
    i += 1;
  }

  const startLocations = startSeeds.map((seed) =>
    valueMaps.reduce((acc, mapper) => mapper.getValue(acc), seed)
  );
  const minStartLocation = startLocations.reduce((a, b) => (a < b ? a : b));

  console.log(`Closest start location is ${minStartLocation}`);

  const seedRanges: ValueRange[] = startSeeds
    .reduce((acc, seed) => {
      if (acc.length === 0) {
        return [[seed]];
      }
      if (acc[acc.length - 1].length === 1) {
        acc[acc.length - 1].push(seed);
      } else {
        acc.push([seed]);
      }
      return acc;
    }, [])
    .map(([start, length]) => ({ start, length }));

  const startLocationRanges = seedRanges.flatMap((seed) =>
    valueMaps.reduce(
      (acc, mapper) => acc.flatMap((vr) => mapper.getRangeValue(vr)),
      [seed]
    )
  );
  const minStartRangeLocation = startLocationRanges.reduce((a, b) =>
    a.start < b.start ? a : b
  );

  console.log(`Closest start location is ${minStartRangeLocation.start}`);
}
