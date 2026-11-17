# UI-тесты Testboard

Автотесты на JavaScript и Playwright для сайта [Testboard](https://testboard.avito.com/). Сделаны в рамках практик и лабораторной работы школы QA Авито.

## Тесты

Практика (`tests/practice`):
- пустая форма входа показывает ошибки «Email обязателен» и «Пароль обязателен»;
- поле email хранит введённое значение;
- ссылка регистрации ведёт на /auth/register.

Лабораторная работа:

| ID | Что проверяется | Тип | Файл |
| --- | --- | --- | --- |
| C1 | Создание объявления через форму, проверка всех полей и фото на странице объявления | позитивный | tests/create/create-ad.spec.js |
| C2 | Отправка пустой формы: три ошибки обязательных полей | негативный | tests/create/create-ad-validation.spec.js |
| C3 | Гость открывает /advertisements/create и попадает на /auth/login | негативный | tests/create/guest-access.spec.js |
| C4 | Цена 1 000 001 ₽: ошибка, значения сохранены, запрос не отправлен | негативный | tests/create/create-ad-validation.spec.js |
| C5 | Количество 101: ошибка, значения сохранены, запрос не отправлен | негативный | tests/create/create-ad-validation.spec.js |
| F1 | Пустое избранное | позитивный | tests/favorites/favorites.spec.js |
| F2 | Добавление из каталога | позитивный | tests/favorites/favorites.spec.js |
| F3 | Сохранение после обновления страницы | позитивный | tests/favorites/favorites.spec.js |
| F4 | Удаление из избранного | позитивный | tests/favorites/favorites.spec.js |
| F5 | Поиск без совпадений и возврат карточек после очистки | негативный | tests/favorites/favorites.spec.js |
| V1.1, V1.2 | Вариант 1: повторное нажатие, два объявления | позитивный | tests/favorites/variant-1-catalog.spec.js |
| V2.1, V2.2 | Вариант 2: добавление со страницы объявления, согласованность состояния | позитивный | tests/favorites/variant-2-ad-page.spec.js |
| V3.1, V3.2 | Вариант 3: поиск по названию, сортировка по цене | позитивный | tests/favorites/variant-3-search-sort.spec.js |

## Структура

- `pages` — Page Object: главная с каталогом, попап и страница входа, регистрация, создание объявления, объявление, избранное.
- `components/adCard.js` — карточка объявления, поиск карточки по UUID.
- `helpers` — учебный email, тестовые данные, работа с API.
- `configs/environment.js` — адрес сайта и данные продавца из .env.
- `fixtures/index.js` — вход продавца через API, создание объявлений и их удаление после теста.
- `assets/test-photo.png` — фото для объявлений.

Объявления для тестов избранного создаются через API с уникальным названием и фото. ID сохраняется сразу после создания, после теста объявление удаляется (в том числе если тест упал). Перед удалением проверяется, что объявление принадлежит продавцу. Тесты избранного выполняются гостем в новом контексте браузера, тесты создания — с сессией продавца.

## Установка и настройка

```bash
npm ci
npx playwright install chromium
cp .env.example .env
```

В `.env` указать данные учебного продавца, зарегистрированного на Testboard:

```
BASE_URL=https://testboard.avito.com
E2E_USER_EMAIL=
E2E_USER_PASSWORD=
```

## Запуск

```bash
npm test                                  # все тесты
npm test -- tests/create tests/favorites  # только лабораторная
npm test -- tests/practice                # только практика
npm test -- --repeat-each=3               # три прогона подряд
npm test -- -g "C1:"                      # один тест
npm test -- --headed                      # с браузером
```

## Отчёт и trace

```bash
npx playwright show-report
npx playwright show-trace test-results/<папка-теста>/trace.zip
```

При падении теста в test-results сохраняются скриншот и trace. Отчёты, trace и .env в репозиторий не попадают.
