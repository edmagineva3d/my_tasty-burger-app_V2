import Image1 from "../assets/menu/burger-11.jpg";
import Image2 from "../assets/menu/burger-12.jpg";
import Image3 from "../assets/menu/burger-13.jpg";
import Image5 from "../assets/menu/burger-15.jpg";
import Image6 from "../assets/menu/burger-16.jpg";
import Image7 from "../assets/menu/burger-17.jpg";
import type { CartItem, RecommendationBundle } from "../types";

export const familyMealBundles: RecommendationBundle[] = [
  {
    id: "bundle-family-feast",
    title: "Family Burger Feast",
    description: "4 Crispy Chicken Burgers + 2 Large Battered Fries + 4 Special Dips. Great for the whole family!",
    category: "family",
    image: Image1,
    bundlePrice: 469.0,
    originalPrice: 555.1,
    servings: "Serves 4 - 5",
    badge: "SAVE ₱86.10",
    itemsIncluded: [
      "4x Crispy Chicken Burgers",
      "2x Large Crispy Battered Fries",
      "4x House Garlic Mayo Dips",
    ],
    cartPayload: {
      id: "bundle-family-feast",
      image: Image1,
      title: "Family Burger Feast (4 Burgers + 2 Fries)",
      paragraph: "4 Crispy Chicken Burgers + 2 Large Battered Fries + 4 Dips",
      rating: 5,
      price: 469.0,
      bundleTag: "Family Meal Bundle",
      selectedSize: "Large",
    },
  },
  {
    id: "bundle-burger-fries-combo",
    title: "Burger & Fries Combo Feast",
    description: "2 Ultimate Bacon Burgers + 2 Crinkle Fries + 2 Cheese Sauces. Perfect for couples or friends.",
    category: "family",
    image: Image2,
    bundlePrice: 329.0,
    originalPrice: 381.0,
    servings: "Serves 2 - 3",
    badge: "SAVE ₱52.00",
    itemsIncluded: [
      "2x Ultimate Bacon Burgers",
      "2x Golden Crinkle Fries",
      "2x Cheddar Cheese Sauce Dips",
    ],
    cartPayload: {
      id: "bundle-burger-fries-combo",
      image: Image2,
      title: "Burger & Fries Combo Feast (2 Bacon + 2 Fries)",
      paragraph: "2 Ultimate Bacon Burgers + 2 Crinkle Fries + 2 Cheese Sauces",
      rating: 4.8,
      price: 329.0,
      bundleTag: "Combo Feast Bundle",
      selectedSize: "Medium",
    },
  },
  {
    id: "bundle-movie-night",
    title: "Family Movie Night Bundle",
    description: "3 Black Sheep Burgers + 3 Waffle Fries + 3 Dipping Sauces. The ultimate weekend treat.",
    category: "family",
    image: Image3,
    bundlePrice: 469.0,
    originalPrice: 541.0,
    servings: "Serves 3 - 4",
    badge: "SAVE ₱72.00",
    itemsIncluded: [
      "3x Black Sheep Burgers",
      "3x Crispy Waffle Fries",
      "3x House Dipping Sauces",
    ],
    cartPayload: {
      id: "bundle-movie-night",
      image: Image3,
      title: "Family Movie Night Bundle (3 Burgers + 3 Waffle Fries)",
      paragraph: "3 Black Sheep Burgers + 3 Waffle Fries + 3 Dips",
      rating: 4.9,
      price: 469.0,
      bundleTag: "Family Movie Bundle",
      selectedSize: "Medium",
    },
  },
];

export const studentMealBundles: RecommendationBundle[] = [
  {
    id: "student-solo-meal",
    title: "Student Solo Burger Meal",
    description: "1 Black Sheep Burger + 1 Medium Battered Fries. Wholesome and wallet-friendly.",
    category: "student",
    image: Image3,
    bundlePrice: 109.0,
    originalPrice: 128.4,
    servings: "Serves 1",
    badge: "BUDGET FAVORITE",
    itemsIncluded: [
      "1x Black Sheep Burger",
      "1x Medium Battered Fries",
    ],
    cartPayload: {
      id: "student-solo-meal",
      image: Image3,
      title: "Student Solo Meal (Black Sheep + Fries)",
      paragraph: "1 Black Sheep Burger + 1 Medium Battered Fries",
      rating: 4.5,
      price: 109.0,
      bundleTag: "Student Budget Meal",
      selectedSize: "Medium",
    },
  },
  {
    id: "student-budget-fries",
    title: "Budget Burger & Fries",
    description: "1 Crispy Chicken Burger + 1 Medium Battered Fries. Crispy, filling, and affordable.",
    category: "student",
    image: Image1,
    bundlePrice: 139.0,
    originalPrice: 158.4,
    servings: "Serves 1",
    badge: "STUDENT PICK",
    itemsIncluded: [
      "1x Crispy Chicken Burger",
      "1x Medium Battered Fries",
    ],
    cartPayload: {
      id: "student-budget-fries",
      image: Image1,
      title: "Budget Burger & Fries (Chicken + Fries)",
      paragraph: "1 Crispy Chicken Burger + 1 Medium Battered Fries",
      rating: 4.7,
      price: 139.0,
      bundleTag: "Student Budget Meal",
      selectedSize: "Medium",
    },
  },
  {
    id: "student-sharing-combo",
    title: "Student Sharing Combo",
    description: "2 Crispy Chicken Burgers + 1 Sharing Crinkle Fries. Great for campus buddies.",
    category: "student",
    image: Image6,
    bundlePrice: 239.0,
    originalPrice: 277.5,
    servings: "Serves 2",
    badge: "SAVE ₱38.50",
    itemsIncluded: [
      "2x Crispy Chicken Burgers",
      "1x Sharing Crinkle Fries",
    ],
    cartPayload: {
      id: "student-sharing-combo",
      image: Image6,
      title: "Student Sharing Combo (2 Burgers + Fries)",
      paragraph: "2 Crispy Chicken Burgers + 1 Sharing Crinkle Fries",
      rating: 4.8,
      price: 239.0,
      bundleTag: "Student Sharing Combo",
      selectedSize: "Medium",
    },
  },
  {
    id: "student-under-100",
    title: "Affordable Solo Meal (Under ₱100)",
    description: "1 Black Sheep Burger + Signature Garlic Mayo Dip. Maximum taste on a tight allowance.",
    category: "budget",
    image: Image3,
    bundlePrice: 75.0,
    originalPrice: 81.15,
    servings: "Serves 1",
    badge: "UNDER ₱100",
    itemsIncluded: [
      "1x Black Sheep Burger",
      "1x Signature Garlic Mayo Dip",
    ],
    cartPayload: {
      id: "student-under-100",
      image: Image3,
      title: "Affordable Solo Snack (Black Sheep + Dip)",
      paragraph: "1 Black Sheep Burger + Signature Garlic Mayo Dip",
      rating: 4.4,
      price: 75.0,
      bundleTag: "Under ₱100 Meal",
      selectedSize: "Regular",
    },
  },
];

export const pairedSides: RecommendationBundle[] = [
  {
    id: "paired-battered-fries",
    title: "Battered Fries (Medium)",
    description: "Golden and crunchy, seasoned to perfection. Best paired with any burger.",
    category: "paired",
    image: Image5,
    bundlePrice: 59.25,
    originalPrice: 59.25,
    servings: "Single Side",
    badge: "POPULAR PAIRING",
    itemsIncluded: ["1x Medium Battered Fries"],
    cartPayload: {
      id: "paired-battered-fries",
      image: Image5,
      title: "Battered Fries",
      paragraph: "Crispy battered fries served golden and crunchy",
      rating: 4.5,
      price: 59.25,
      selectedSize: "Medium",
    },
  },
  {
    id: "paired-crinkle-fries",
    title: "Crinkle Fries (Medium)",
    description: "Wavy cuts for maximum crunch and dip retention.",
    category: "paired",
    image: Image6,
    bundlePrice: 79.18,
    originalPrice: 79.18,
    servings: "Single Side",
    badge: "TOP SIDE",
    itemsIncluded: ["1x Medium Crinkle Fries"],
    cartPayload: {
      id: "paired-crinkle-fries",
      image: Image6,
      title: "Crinkle Fries",
      paragraph: "Crispy crinkle-cut fries with a golden texture",
      rating: 4.6,
      price: 79.18,
      selectedSize: "Medium",
    },
  },
  {
    id: "paired-waffle-fries",
    title: "Waffle Fries (Medium)",
    description: "Lattice cut crisped to golden bliss. Exceptional with melted cheese dip.",
    category: "paired",
    image: Image7,
    bundlePrice: 99.19,
    originalPrice: 99.19,
    servings: "Single Side",
    badge: "CRISPY CRUNCH",
    itemsIncluded: ["1x Medium Waffle Fries"],
    cartPayload: {
      id: "paired-waffle-fries",
      image: Image7,
      title: "Waffle Fries",
      paragraph: "Crispy waffle-cut fries with a golden texture",
      rating: 4.7,
      price: 99.19,
      selectedSize: "Medium",
    },
  },
];

export function getSmartRecommendations(currentCart: CartItem[]): RecommendationBundle[] {
  const hasBurger = currentCart.some((item) => !item.title.toLowerCase().includes("fries"));
  const hasFries = currentCart.some((item) => item.title.toLowerCase().includes("fries"));

  const results: RecommendationBundle[] = [];

  // If cart has burgers but no fries, prioritize paired fries
  if (hasBurger && !hasFries) {
    results.push(...pairedSides);
  }

  // Include family and student bundles
  results.push(...familyMealBundles);
  results.push(...studentMealBundles);

  // If cart already has fries, include paired sides at the end
  if (!hasBurger || hasFries) {
    results.push(...pairedSides.filter((item) => !results.some((r) => r.id === item.id)));
  }

  return results;
}

