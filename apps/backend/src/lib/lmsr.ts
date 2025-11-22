import { Market } from "@prisma/client";

export interface MarketState {
  qYes: number;
  qNo: number;
  b: number;
}

export function cost(state: MarketState): number {
  const { qYes, qNo, b } = state;
  if (b <= 0) {
    throw new Error("Liquidity parameter b must be positive");
  }
  const expYes = Math.exp(qYes / b);
  const expNo = Math.exp(qNo / b);
  return b * Math.log(expYes + expNo);
}

export function priceYes(state: MarketState): number {
  const { qYes, qNo, b } = state;
  if (b <= 0) throw new Error("Liquidity parameter b must be positive");

  const expYes = Math.exp(qYes / b);
  const expNo = Math.exp(qNo / b);

  return expYes / (expYes + expNo);
}

export function priceNo(state: MarketState): number {
  return 1 - priceYes(state);
}
export function buyYes(
  state: MarketState,
  budget: number
): {
  shares: number;
  newState: MarketState;
  actualCost: number;
  price: number;
} {
  if (budget <= 0) throw new Error("Budget must be positive");

  const initialCost = cost(state);
  const targetCost = initialCost + budget;

  let low = 0;
  let high = budget * 10;
  let shares = 0;
  const tolerance = 0.01;

  for (let i = 0; i < 100; i++) {
    shares = (low + high) / 2;
    const newState = { ...state, qYes: state.qYes + shares };
    const newCost = cost(newState);
    const diff = newCost - targetCost;
    if (Math.abs(diff) < tolerance) break;

    if (diff > 0) {
      high = shares;
    } else {
      low = shares;
    }
  }

  const newState: MarketState = { ...state, qYes: state.qYes + shares };
  const actualCost = cost(newState) - initialCost;
  const price = priceYes(newState);

  return {
    shares,
    newState,
    actualCost,
    price,
  };
}
export function buyNo(
  state: MarketState,
  budget: number
): {
  shares: number;
  newState: MarketState;
  actualCost: number;
  price: number;
} {
  if (budget <= 0) throw new Error("Budget must be positive");

  const initialCost = cost(state);
  const targetCost = initialCost + budget;

  let low = 0;
  let high = budget * 10;
  let shares = 0;
  const tolerance = 0.01;

  for (let i = 0; i < 100; i++) {
    shares = (low + high) / 2;
    const newState = { ...state, qNo: state.qNo + shares };
    const newCost = cost(newState);
    const diff = newCost - targetCost;
    if (Math.abs(diff) < tolerance) break;

    if (diff > 0) {
      high = shares;
    } else {
      low = shares;
    }
  }

  const newState: MarketState = { ...state, qNo: state.qNo + shares };
  const actualCost = cost(newState) - initialCost;
  const price = priceNo(newState);

  return {
    shares,
    newState,
    actualCost,
    price,
  };
}

export function getMarketSummary(state: MarketState) {
  const yesPrice = priceYes(state);
  const noPrice = priceNo(state);
  const totalCost = cost(state);

  return {
    ...state,
    yesPrice,
    noPrice,
    totalCost,
  };
}
