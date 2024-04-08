import {
    Review,
    User,
    ReviewInformation,
    Product,
    ProductInformation,
    Company,
  } from "./types";
  
  //хэлпер, хэш словарь чтобы не использовать find
  export const toDictionary = <T extends { id: string }>(
    items: T[] //получает массив id
  ): Record<string, T> =>
    items.reduce((acc, item) => ({ ...acc, [item.id]: item }), {});
  
  export const toReviewInformation = (
    review: Review,
    usersDict: Record<string, User>
  ): ReviewInformation => ({
    id: review.id,
    text: review.text,
    user: usersDict[review.userId],
  });
  
  export const toProductInformation = (
    product: Product,
    usersDict: Record<string, User>,
    reviewsDict: Record<string, Review>,
    companiesDict: Record<string, Company>
  ): ProductInformation => {
    return {
      id: product.id,
      name: product.name || "Без названия",
      company: companiesDict[product.companyId] || "Test company",
      reviews: product.reviewIds //проходим по Id отзывов
        .map((r: string) => {
          const review = reviewsDict[r];
          if (!review) return null;
          return toReviewInformation(review, usersDict);
        })
        .filter(Boolean) as ReviewInformation[], //фильтруем чтобы если были null они не учитывались и сужаем тип до ReviewInformation[]
      description: product.description,
    };
  };
  