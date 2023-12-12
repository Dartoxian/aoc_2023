import * as fs from "fs";
import { inclusiveRange, lcm } from "./utils";

type Point = [number, number];

export function run11() {
  const lines = fs.readFileSync("inputs/11.txt", "utf8").split("\n");

  const colsWithoutGalaxies = [
    ...inclusiveRange(0, lines[0].length - 1),
  ].filter((col) => lines.every((line) => line[col] === "."));

  const points: Point[] = [];
  let offsetY = 0;
  lines.forEach((line, y) => {
    let hasGalaxy = false;
    line.split("").forEach((v, x) => {
      if (v === "#") {
        hasGalaxy = true;
        points.push([
          // for p2 multiply the length by 999999 instead
          x + colsWithoutGalaxies.filter((c) => c < x).length,
          y + offsetY,
        ]);
      }
    });
    if (!hasGalaxy) {
      // For p2 add 999999 instead
      offsetY += 1;
    }
  });

  const shortestSum = points
    .flatMap((p1) =>
      points.map((p2) => Math.abs(p1[0] - p2[0]) + Math.abs(p1[1] - p2[1]))
    )
    .reduce((a, b) => a + b);

  console.log(shortestSum / 2);
}
