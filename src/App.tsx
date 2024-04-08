import "./styles.css";
import { Product, ProductInformation } from "./lib/types";
import { toProductInformation, toDictionary } from "./lib/utils";
import { getProducts, getUsers, getReviews, getCompanies } from "./lib/api";
import { useEffect, useState, FC } from "react";
import Card from "./Card";
// Техническое задание:
// Доработать приложение App, чтобы в отрисованном списке
// были реальные отзывы и их авторы,
// а также компания-производитель с названием и годом происхождения,
// Данные об отзывах, пользователях и компаниях можно получить при помощи асинхронных
// функций getUsers, getReviews, getCompanies

// функция getProducts возвращает Promise<Product[]>
// функция getUsers возвращает Promise<User[]>
// функция getReviews возвращает Promise<Review[]>
// функция getCompanies возвращает Promise<Company[]>

// В объектах реализующих интерфейс Product указаны только uuid
// пользователей, обзоров и компаний

// В объектах реализующих интерфейс ProductInformation, ReviewInformation
// указана полная информация об пользователе и обзоре.

const App: FC = () => {
  const [products, setProducts] = useState<ProductInformation[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    Promise.all([getProducts(), getUsers(), getReviews(), getCompanies()])
      .then(
        ([fetchedProducts, fetchedUsers, fetchedReviews, fetchedCompanies]) => {
          const usersDict = toDictionary(fetchedUsers);
          const reviewsDict = toDictionary(fetchedReviews);
          const companiesDict = toDictionary(fetchedCompanies);
          console.log(companiesDict);
          const productsInformation = fetchedProducts.map((p: Product) =>
            toProductInformation(p, usersDict, reviewsDict, companiesDict)
          );
          setProducts(productsInformation);
        }
      )
      .catch((err) => console.log(err))
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  return (
    <div>
      <h1>Список товаров:</h1>
      {isLoading && <div>Загрузка...</div>}

      {!isLoading && products.map((p) => <Card key={p.id} product={p} />)}
    </div>
  );
};

export default App;
