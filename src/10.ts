import * as fs from "fs";
import { inclusiveRange, lcm } from "./utils";

type Point = { x: number; y: number };

export function run10() {
  const lines = fs.readFileSync("inputs/10.txt", "utf8").split("\n");

  const isCell = ({ x, y }: Point): boolean => {
    return y >= 0 && y < lines.length && x >= 0 && x < lines[y].length;
  };

  const valueAt = ({ x, y }: Point) => {
    return lines[y][x];
  };

  const neightboursAt = ({ x, y }: Point): Point[] => {
    const neighbours: Point[] = [];

    switch (valueAt({ x, y })) {
      case "|":
        neighbours.push({ x, y: y - 1 });
        neighbours.push({ x, y: y + 1 });
        break;
      case "-":
        neighbours.push({ x: x - 1, y });
        neighbours.push({ x: x + 1, y });
        break;
      case "F":
        neighbours.push({ x: x + 1, y });
        neighbours.push({ x, y: y + 1 });
        break;
      case "L":
        neighbours.push({ x: x + 1, y });
        neighbours.push({ x, y: y - 1 });
        break;
      case "J":
        neighbours.push({ x: x - 1, y });
        neighbours.push({ x, y: y - 1 });
        break;
      case "7":
        neighbours.push({ x: x - 1, y });
        neighbours.push({ x, y: y + 1 });
        break;
    }

    return neighbours.filter(isCell);
  };

  const allPoints = lines.flatMap((l, y) =>
    l.split("").map((_, x): Point => ({ x, y }))
  );
  const cellsThatTouchS = allPoints.filter((p) =>
    neightboursAt(p).some((np) => valueAt(np) === "S")
  );
  const sPoint = allPoints.find((p) => valueAt(p) === "S")!;
  let [s1, s2] = cellsThatTouchS;
  const sPointSymbol =
    s1.x === s2.x
      ? "|"
      : s1.y === s2.y
      ? "-"
      : s1.x < s2.x && s1.y === sPoint.y
      ? "7"
      : s1.x < s2.x && s2.y === sPoint.y
      ? "L"
      : s1.y === sPoint.y
      ? "F"
      : "J";
  const visited = new Set<string>(
    [s1, s2, sPoint].map((v) => JSON.stringify(v))
  );
  console.log(sPoint, visited);
  let steps = 1;
  while (s1.x !== s2.x || s1.y !== s2.y) {
    s1 = neightboursAt(s1).filter((p) => !visited.has(JSON.stringify(p)))[0];
    s2 = neightboursAt(s2).filter((p) => !visited.has(JSON.stringify(p)))[0];
    visited.add(JSON.stringify(s1));
    visited.add(JSON.stringify(s2));
    steps += 1;
  }

  console.log(`P1 answer ${steps}`);

  const pointsAbove = ({ x, y }: Point): Point[] => {
    const r = [];
    for (const nY of inclusiveRange(0, y - 1)) {
      r.push({ x, y: nY });
    }
    return r;
  };
  const pointsBelow = ({ x, y }: Point): Point[] => {
    const r = [];
    for (const nY of inclusiveRange(y + 1, lines.length - 1)) {
      r.push({ x, y: nY });
    }
    return r;
  };
  const pointsLeft = ({ x, y }: Point): Point[] => {
    const r = [];
    for (const nX of inclusiveRange(0, x - 1)) {
      r.push({ x: nX, y });
    }
    return r;
  };
  const pointsRight = ({ x, y }: Point): Point[] => {
    const r = [];
    for (const nX of inclusiveRange(x + 1, lines[0].length - 1)) {
      r.push({ x: nX, y });
    }
    return r;
  };

  const horizontalPipesCrossed = (symbols: string[]): number => {
    const relSymbols = symbols
      .map((s) => (s === "S" ? sPointSymbol : s))
      .filter((s) => s !== "|");
    let pipesCrossed = 0;
    let lastCorner = null;
    let i = 0;
    while (i < relSymbols.length) {
      const currentSymbol = relSymbols[i];
      if (currentSymbol === "-") {
        pipesCrossed += 1;
      } else {
        if (lastCorner !== null) {
          if (
            (lastCorner === "7" && currentSymbol === "L") ||
            (lastCorner === "F" && currentSymbol === "J")
          ) {
            pipesCrossed += 1;
          }
          lastCorner = null;
        } else {
          lastCorner = currentSymbol;
        }
      }
      i += 1;
    }
    return pipesCrossed;
  };

  const verticalPipesCrossed = (symbols: string[]): number => {
    const relSymbols = symbols
      .map((s) => (s === "S" ? sPointSymbol : s))
      .filter((s) => s !== "-");
    let pipesCrossed = 0;
    let lastCorner = null;
    let i = 0;
    while (i < relSymbols.length) {
      const currentSymbol = relSymbols[i];
      if (currentSymbol === "|") {
        pipesCrossed += 1;
      } else {
        if (lastCorner !== null) {
          if (
            (lastCorner === "L" && currentSymbol === "7") ||
            (lastCorner === "F" && currentSymbol === "J")
          ) {
            pipesCrossed += 1;
          }
          lastCorner = null;
        } else {
          lastCorner = currentSymbol;
        }
      }
      i += 1;
    }
    return pipesCrossed;
  };

  // Any cell that is on an inside loop will have pipes surrounding it. if pipesBelow == pipesAbove and pipesBelow > 0
  const pointsInLoop = allPoints.filter((p) => {
    if (visited.has(JSON.stringify(p))) {
      return false;
    }
    const [pA, pB, pL, pR] = [
      horizontalPipesCrossed(
        pointsAbove(p)
          .filter((nP) => visited.has(JSON.stringify(nP)))
          .map(valueAt)
      ),
      horizontalPipesCrossed(
        pointsBelow(p)
          .filter((nP) => visited.has(JSON.stringify(nP)))
          .map(valueAt)
      ),
      verticalPipesCrossed(
        pointsLeft(p)
          .filter((nP) => visited.has(JSON.stringify(nP)))
          .map(valueAt)
      ),
      verticalPipesCrossed(
        pointsRight(p)
          .filter((nP) => visited.has(JSON.stringify(nP)))
          .map(valueAt)
      ),
    ];
    if (pA === 0 || pB === 0 || pL === 0 || pR === 0) {
      return false;
    }
    console.log(p, pA, pB, pL, pR);
    return !(pA % 2 === 0 && pB % 2 === 0 && pR % 2 === 0 && pL % 2 === 0);
  });
  console.log(pointsInLoop.length);
}
