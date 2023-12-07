import * as fs from "fs";

const cards = [
  "A",
  "K",
  "Q",
  "J",
  "T",
  "9",
  "8",
  "7",
  "6",
  "5",
  "4",
  "3",
  "2",
] as const;

type Card = typeof cards[number];

function assertCard(maybeCard: string): Card {
  if (cards.indexOf(maybeCard as any) === -1) {
    throw new Error(`${maybeCard} is not a card`);
  }
  return maybeCard as Card;
}

function cardScore(card: Card) {
  return cards.length - cards.indexOf(card);
}

function cardScoreWithJokers(card: Card) {
  if (card === "J") {
    return 0;
  }
  return cards.length - cards.indexOf(card);
}

const handTypes = [
  "Five of a kind",
  "Four of a kind",
  "Full House",
  "Three of a kind",
  "Two Pair",
  "One Pair",
  "High Card",
] as const;

type HandType = typeof handTypes[number];

function handScore(hand: HandType) {
  return handTypes.length - handTypes.indexOf(hand);
}

class Hand {
  cards: Card[];
  bid: number;

  constructor(cards: Card[], bid: number) {
    this.cards = cards;
    this.bid = bid;
  }

  static from(line: string): Hand {
    const parts = line.split(/\s+/);
    return new Hand(parts[0].split("").map(assertCard), parseInt(parts[1]));
  }
  handType(): HandType {
    const groups = this.cards.reduce((acc, card) => {
      acc[card] = (!!acc[card] ? acc[card] : 0) + 1;
      return acc;
    }, {} as Record<Card, number>);

    if (Object.entries(groups).length === 1) {
      return "Five of a kind";
    }
    if (Object.entries(groups).length === 2) {
      if (Object.values(groups).some((count) => count === 4)) {
        return "Four of a kind";
      }
      return "Full House";
    }
    if (Object.entries(groups).length === 3) {
      if (Object.values(groups).some((count) => count === 3)) {
        return "Three of a kind";
      }
      return "Two Pair";
    }
    if (Object.entries(groups).length === 4) {
      return "One Pair";
    }
    return "High Card";
  }

  handTypeWithJokers(): HandType {
    let groups = this.cards.reduce((acc, card) => {
      acc[card] = (!!acc[card] ? acc[card] : 0) + 1;
      return acc;
    }, {} as Record<Card, number>);
    const jokers = groups["J"] || 0;
    if (!!groups["J"] && jokers !== 5) {
      const mostCommonCard = Object.entries(groups)
        .filter((x) => x[0] !== "J")
        .sort((a, b) => a[1] - b[1]);
      groups[mostCommonCard[mostCommonCard.length - 1][0]] += jokers;
      const { J: _, ...newGroups } = groups;
      groups = newGroups as Record<Card, number>;
    }
    if (Object.entries(groups).length === 1) {
      return "Five of a kind";
    }
    if (Object.entries(groups).length === 2) {
      if (Object.values(groups).some((count) => count === 4)) {
        return "Four of a kind";
      }
      return "Full House";
    }
    if (Object.entries(groups).length === 3) {
      if (Object.values(groups).some((count) => count === 3)) {
        return "Three of a kind";
      }
      return "Two Pair";
    }
    if (Object.entries(groups).length === 4) {
      return "One Pair";
    }
    return "High Card";
  }
}

export function run07() {
  const lines = fs.readFileSync("inputs/07.txt", "utf8").split("\n");
  const hands = lines.map((line) => Hand.from(line));

  const part1Sorted = hands.sort((a, b) => {
    const aHandScore = handScore(a.handType());
    const bHandScore = handScore(b.handType());
    if (aHandScore !== bHandScore) {
      return aHandScore - bHandScore;
    }
    let i = 0;
    while (i < a.cards.length) {
      const aCardScore = cardScore(a.cards[i]);
      const bCardScore = cardScore(b.cards[i]);
      if (aCardScore !== bCardScore) {
        return aCardScore - bCardScore;
      }
      i += 1;
    }
    return 0;
  });

  const part1Scores = part1Sorted.map((hand, i) => (i + 1) * hand.bid);
  const part1Total = part1Scores.reduce((a, b) => a + b);
  console.log(`Part1 total is ${part1Total}`);

  const part2Sorted = hands.sort((a, b) => {
    const aHandScore = handScore(a.handTypeWithJokers());
    const bHandScore = handScore(b.handTypeWithJokers());
    if (aHandScore !== bHandScore) {
      return aHandScore - bHandScore;
    }
    let i = 0;
    while (i < a.cards.length) {
      const aCardScore = cardScoreWithJokers(a.cards[i]);
      const bCardScore = cardScoreWithJokers(b.cards[i]);
      if (aCardScore !== bCardScore) {
        return aCardScore - bCardScore;
      }
      i += 1;
    }
    return 0;
  });

  const part2Scores = part2Sorted.map((hand, i) => (i + 1) * hand.bid);
  const part2Total = part2Scores.reduce((a, b) => a + b);
  console.log(`Part2 total is ${part2Total}`);
}
