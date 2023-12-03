import * as fs from "fs";
import { cellsAround } from "./utils";

function isDigit(char: string) {
  return !!char.match(/\d/);
}

function isSymbol(char?: string) {
  return !!char && !isDigit(char) && char !== ".";
}

function isGear(char?: string) {
  return char === "*";
}

export function run03() {
  const grid = fs.readFileSync("inputs/03.txt", "utf8").split("\n");

  const getCell = (i: number, j: number) =>
    j < 0 || j >= grid.length || i < 0 || i >= grid[j].length
      ? undefined
      : grid[j][i];

  const cellAdjacentToSymbol = (i: number, j: number) => {
    return [...cellsAround(i, j)].some(([neighbourI, neighbourJ]) =>
      isSymbol(getCell(neighbourI, neighbourJ))
    );
  };

  const partsAdjacentToSymbols: number[] = [];

  grid.forEach((row, j) => {
    let i = 0;
    let currentPartNumber = "";
    let currentPartSymbolAdjacent = false;
    while (i < row.length) {
      let currentCell = getCell(i, j);
      if (!isDigit(currentCell)) {
        if (currentPartNumber !== "" && currentPartSymbolAdjacent) {
          partsAdjacentToSymbols.push(parseInt(currentPartNumber));
        }
        currentPartNumber = "";
        currentPartSymbolAdjacent = false;
        i += 1;
        continue;
      }

      currentPartSymbolAdjacent =
        currentPartSymbolAdjacent || cellAdjacentToSymbol(i, j);
      currentPartNumber += currentCell;
      i += 1;
    }
    if (currentPartNumber !== "" && currentPartSymbolAdjacent) {
      partsAdjacentToSymbols.push(parseInt(currentPartNumber));
    }
  });

  const partsAdjacentToSymbolsSum = partsAdjacentToSymbols.reduce(
    (a, b) => a + b,
    0
  );
  console.log(`Part 1 answer is ${partsAdjacentToSymbolsSum}`);

  const partsWithAdjacentGears: {
    partNumber: number;
    gearCells: [number, number][];
  }[] = [];

  grid.forEach((row, j) => {
    let i = 0;
    let currentPartNumber = "";
    let currentPartGearLocations: [number, number][] = [];
    while (i < row.length) {
      let currentCell = getCell(i, j);
      if (!isDigit(currentCell)) {
        if (currentPartNumber !== "") {
          partsWithAdjacentGears.push({
            partNumber: parseInt(currentPartNumber),
            gearCells: currentPartGearLocations,
          });
        }
        currentPartNumber = "";
        currentPartGearLocations = [];
        i += 1;
        continue;
      }

      for (const [neighbourI, neighbourJ] of cellsAround(i, j)) {
        if (isGear(getCell(neighbourI, neighbourJ))) {
          currentPartGearLocations.push([neighbourI, neighbourJ]);
        }
      }

      currentPartNumber += currentCell;
      i += 1;
    }
    if (currentPartNumber !== "") {
      partsWithAdjacentGears.push({
        partNumber: parseInt(currentPartNumber),
        gearCells: currentPartGearLocations,
      });
    }
  });

  // Dedupe gear cells
  partsWithAdjacentGears.forEach((part) => {
    part.gearCells = part.gearCells.filter(
      ([i, j], occI, arr) =>
        arr.findIndex(([findI, findJ]) => findI === i && findJ === j) === occI
    );
  });

  const gearsNextToParts: Record<string, number[]> = partsWithAdjacentGears
    .flatMap(({ partNumber, gearCells }) =>
      gearCells.map((gearCell) => [gearCell.join("|"), partNumber])
    )
    .reduce((acc, [cellId, partNumber]) => {
      if (!acc[cellId]) {
        acc[cellId] = [];
      }
      acc[cellId].push(partNumber);
      return acc;
    }, {});

  const part2Result = Object.values(gearsNextToParts)
    .filter((parts) => parts.length === 2)
    .reduce((acc, parts) => acc + parts[0] * parts[1], 0);
  console.log(`Part 2 result is ${part2Result}`);
}
