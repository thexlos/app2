export interface BusinessSavedLinks {
  website: string;
  googleReview: string;
  booking: string;
  payment: string;
  facebook: string;
  instagram: string;
}

export const businessSavedLinks: Record<string, BusinessSavedLinks> = {
  "j-thomas-flooring": {
    website: "https://jthomasflooring.example",
    googleReview: "https://g.page/r/j-thomas-flooring/review",
    booking: "https://jthomasflooring.example/free-measure",
    payment: "https://pay.example/j-thomas-flooring",
    facebook: "https://facebook.com/jthomasflooring",
    instagram: "https://instagram.com/jthomasflooring",
  },
  "start-here-support": {
    website: "https://starthere.example",
    googleReview: "https://g.page/r/start-here-support/review",
    booking: "https://starthere.example/book",
    payment: "https://pay.example/start-here-support",
    facebook: "https://facebook.com/startherehelper",
    instagram: "https://instagram.com/startherehelper",
  },
  "coliseu-boxing": {
    website: "https://coliseuboxing.example",
    googleReview: "https://g.page/r/coliseu-boxing/review",
    booking: "https://coliseuboxing.example/trial-class",
    payment: "https://pay.example/coliseu-boxing",
    facebook: "https://facebook.com/coliseuboxing",
    instagram: "https://instagram.com/coliseuboxing",
  },
  "sample-restaurant": {
    website: "https://samplerestaurant.example",
    googleReview: "https://g.page/r/sample-restaurant/review",
    booking: "https://samplerestaurant.example/reservations",
    payment: "https://pay.example/sample-restaurant",
    facebook: "https://facebook.com/samplerestaurant",
    instagram: "https://instagram.com/samplerestaurant",
  },
  "sample-cleaning": {
    website: "https://samplecleaning.example",
    googleReview: "https://g.page/r/sample-cleaning/review",
    booking: "https://samplecleaning.example/book",
    payment: "https://pay.example/sample-cleaning",
    facebook: "https://facebook.com/samplecleaning",
    instagram: "https://instagram.com/samplecleaning",
  },
};
