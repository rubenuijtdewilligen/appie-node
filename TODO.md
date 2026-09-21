## Authentication

[x] Retrieve anonymous token.
[x] Log in via OAuth code.
[x] Refresh token.
[ ] Log out (POST /mobile-auth/v1/auth/token/logout).
[ ] Manage passkeys (ciamPasskeyRegisterStart, ciamPasskeyUpdate).
[ ] Set up or modify Multi-Factor Authentication (MFA) (ciamUpdateMfaSetting).
[ ] Verify phone number via SMS (ciamPhoneNumberSendCode).

## Receipts

[x] Retrieve overview of all receipts (posReceiptsPage).
[x] View specific receipt details (posReceiptDetails).
[x] Map physical POS IDs to current webshop IDs (productConvertId).
[ ] Download PDF version of the receipt (posReceiptPdf).
[ ] Permanently delete receipts from history (posReceiptsDelete).

## Products & Search

[ ] GraphQL Search: Advanced search with facets (brand, diet, Nutri-Score) (SearchProducts).
[ ] REST Search: Enrich results to retrieve products in the Bonus (GET /.../search/v2/products).
[x] Retrieve product details & highlights via REST (GET /.../product/detail/v4/fir/).
[x] Retrieve nutritional values via the GraphQL tradeItem.
[ ] Retrieve ingredients and allergens via the GraphQL tradeItem.
[ ] Query categories/taxonomies (store tree structure).
[ ] Manage purchase history (Hide products from "Previously Purchased": productPurchaseHistoryHideProducts).

## Bonus & Offers

[ ] Retrieve personal Bonus Box and activate offers (FetchBonusBoxOffers, bonusActivatePersonalPromotion).
[ ] Retrieve Spotlight bonus offers (the 'front page' deals).
[ ] Retrieve previously purchased bonus products.
[ ] Digital scratch cards.

## Shopping Lists & Shopping Cart

[ ] Retrieve lists (v3) and view contents (v2).
[ ] Add or check off items (via product ID or free text).
[ ] Retrieve detailed shopping cart (FetchMyListBasket).
[ ] Manage favorites lists (Create, share, delete: favoriteListAddV2, favoriteListShareWithSubAccountsV2).

## Orders, Delivery & Invoices

[ ] Retrieve and modify active orders (add/remove products).
[ ] Check available delivery and pickup slots (orderDeliverySlots, orderPickupSlots).
[ ] Order check-in / "I'm here" functionality (orderCheckin).
[ ] View Track & Trace status and exact ETA (FetchOrderTrackTrace).
[ ] Cancel or reopen orders (orderCancel, orderReopen).
[ ] Download invoices as PDF.

## Loyalty Programs

[ ] AH Premium / Delivery Bundle: Check status and calculate current savings (subscriptionPremiumSavingsV2, subscriptionCalculateSavings).
[ ] Koopzegels: View current balance, reserved funds, transactions, and savings goals (purchaseStampBalance, purchaseStampSavingGoalSet).
[ ] Redeem Koopzegels: Generate a one-time TOTP secret to redeem stamps (purchaseStampCreateSecret).
[ ] Air Miles: View balance and transactions (milesBalance, milesTransactions), or donate to charity (milesDonate).
[ ] Share Koopzegels: Generate links to give away Koopzegels (stampSharingGiftLinkCreate).

## Recipes

[ ] Search for recipes using filters (difficulty level, time, ingredients) (FetchRecipes).
[ ] Retrieve personalized recipe recommendations based on profile (FetchRecommendedRecipes).
[ ] "My Cookbook" system: save personal recipes, create folders, and send messages to other members (cookBookMember, cookBookMemberSendMessage).
[ ] Directly load/scrape recipes from external websites into the AH system (scrapeRecipe).

## Profile

[ ] View customer profile, addresses, and consents/opt-ins (FetchMember).
[ ] Manage linked loyalty cards (Bonus, Gall&Gall, Etos) (ahMemberAddCard, ahMemberDeleteCard).
[ ] Set dietary and nutritional preferences (e.g., vegetarian, family composition) (recipeSaveFoodPreferencesV2).

# Stores

[ ] Search for stores based on GPS, including current opening hours and services (storesSearch).
[ ] Set favorite store (storesSetFavouriteStore).
