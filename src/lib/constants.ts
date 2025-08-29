export const MONTH_IN_MS = 1000 * 60 * 60 * 24 * 30;
export const YEAR_IN_MS = 1000 * 60 * 60 * 24 * 365;

export type SubscriptionInterval = "day" | "week" | "month" | "year";

export type Product = {
  id: string;
  name: string;
  priceInPennies: number;
  link: string;
  isSubscription: boolean;
  subscriptionInterval: SubscriptionInterval;
};

export const PRODUCTS = {
  trial: {
    id: "free-trial-subscription",
    name: "Free Trial",
    priceInPennies: 0,
    link: "",
    isSubscription: true,
    subscriptionInterval: "week",
  },
  monthly: {
    id: "monthly-subscription",
    name: "Monthly Subscription",
    priceInPennies: 799,
    link: "",
    isSubscription: true,
    subscriptionInterval: "month",
  },
  yearly: {
    id: "yearly-subscription",
    name: "Yearly Subscription",
    priceInPennies: 5999,
    link: "",
    isSubscription: true,
    subscriptionInterval: "year",
  },
} as const satisfies Record<string, Product>;
