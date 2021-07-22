/**
 * Configuration object
 * @property {MIN_PRICE} Set the value for minimal payment while trading flow
 * @property {EXTERNAL_BUILD} toggle build for the internal and external users
 * @property {STAGING_BUILD} toggle merchant ID for stage and production servers
 * @property {IPHONE_X_BOTTOM_TAB_NAVIGATOR_HEIGHT} Set the value for bottom tab navigator height on the iPhones X and above
 * @property {NOT_IPHONE_X_BOTTOM_TAB_NAVIGATOR_HEIGHT} Set the value for bottom tab navigator height on the phones that lover then iPhones X
 * @property {LEADERBOARD_ITEMS_PER_PAGE} Set the count of the entries on the wishlist leaderboard screen
 * @property {LIVE_PAYMENTS} toggle from testing endpoints to live which will take money while payment

 */
export default {
  MIN_PRICE: 1,
  EXTERNAL_BUILD: false,
  STAGING_BUILD: true,
  IPHONE_X_BOTTOM_TAB_NAVIGATOR_HEIGHT: 80,
  NOT_IPHONE_X_BOTTOM_TAB_NAVIGATOR_HEIGHT: 50,
  LEADERBOARD_ITEMS_PER_PAGE: 15,
  LIVE_PAYMENTS: true,
  APP_STORE_LINK: 'https://apps.apple.com/ua/app/cellr-curate-your-wine-life/id1528260692',
};
