import * as fs from "fs";
import { cellsAround, inclusiveRange } from "./utils";

class Scratchcard {
  readonly cardId: number;
  readonly numbers: Set<number>;
  readonly winningNumbers: Set<number>;

  constructor(
    cardId: number,
    numbers: Set<number>,
    winningNumbers: Set<number>
  ) {
    this.cardId = cardId;
    this.numbers = numbers;
    this.winningNumbers = winningNumbers;
  }

  static from(line: string): Scratchcard {
    const p = line.split("|");
    const p1 = p[0].split(":");
    const cardId = parseInt(p1[0].replace(/[^\d]/g, ""));

    const cardNumbers = p1[1]
      .split(" ")
      .map((n) => n.trim())
      .filter((n) => n !== "")
      .map((n) => parseInt(n));

    const winningNumbers = p[1]
      .split(" ")
      .map((n) => n.trim())
      .filter((n) => n !== "")
      .map((n) => parseInt(n));

    return new Scratchcard(
      cardId,
      new Set(cardNumbers),
      new Set(winningNumbers)
    );
  }

  matchingNumbers() {
    return new Set([...this.numbers].filter((n) => this.winningNumbers.has(n)));
  }

  points() {
    const matches = this.matchingNumbers();
    if (matches.size === 0) {
      return 0;
    }
    return Math.pow(2, matches.size - 1);
  }

  winsCards() {
    const matches = this.matchingNumbers();
    return [...inclusiveRange(0, matches.size - 1)].map(
      (n) => this.cardId + n + 1
    );
  }
}

export function run04() {
  const lines = fs.readFileSync("inputs/04.txt", "utf8").split("\n");
  const cards = lines.map(Scratchcard.from);
  const totalPoints = cards.reduce((acc, card) => acc + card.points(), 0);
  console.log(`There are ${totalPoints} points`);

  const cardsToQuantity = cards.map((card) => 1);
  for (const card of cards.reverse()) {
    for (const winningId of card.winsCards().reverse()) {
      if (winningId <= cards.length) {
        cardsToQuantity[card.cardId - 1] += cardsToQuantity[winningId - 1];
      }
    }
  }

  const totalCards = cardsToQuantity.reduce((a, b) => a + b, 0);
  console.log(`There are ${totalCards}`);
}
