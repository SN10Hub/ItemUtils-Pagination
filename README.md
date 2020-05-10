# ItemUtils-Pagination
 Easily create paginated GUIs with minimal code footprint.
 This is an extension for **ItemUtils**. Without it, this module will not work.
 The latest version of ItemUtils-Pagination is **1.0.0**, and that's the version this documentation will be referencing.
# Setup Guide
 Once you've installed ItemUtils-Pagination, all you have to do to start using it is inject it into an ItemUtils instance.
## Traditional ItemUtils Setup
 ```js
 const {ItemBuilder, InventoryBuilder, GUIManager} = require("ItemUtils");
 ```
## Setup with ItemUtils-Pagination
 ```js
 const {ItemBuilder, InventoryBuilder, GUIManager} = require("ItemUtils-Pagination").inject(require("ItemUtils"));
 ```
## Setup with ItemUtils-Pagination (Repos)
 ```js
 const req = package => Repos.require(Repos.getRepoIdByURL("https://repo.sn10hub.net"), package);
 const {ItemBuilder, InventoryBuilder, GUIManager} = req("ItemUtils-Pagination").inject(req("ItemUtils"));
 ```
## Instance Settings (Optional)
 Certain aspects of your ItemUtils-Pagination instance can be customized by passing in additional options while injecting. These options are:

 `globalPrefix` *(string, default "$")* - the prefix that will be used to separate the base ID from the page number when generating global paginated menus. Example: a menu with a base ID of hello, the default global prefix ($) and 3 pages will generate GUIs hello$1, hello$2 and hello$3.

 `currentPagePlaceholder` *(string or RegExp, default /%current%/g)* - a placeholder that can be used in menu titles to display the current page. Using a string will only parse the first instance of the placeholder, whereas using a RegExp can parse all instances of the placeholder.

 `maxPagePlaceholder` *(string or RegExp, default /%max%/g)* - a placeholder that can be used in menu titles to display the total number of pages. Using a string will only parse the first instance of the placeholder, whereas using a RegExp can parse all instances of the placeholder.
 
# The different types of menus
 If you're already using the GUIManager from ItemUtils, you'll be pleased to know that both types of menus are fully supported with ItemUtils-Pagination, and both global and temporary paginated menus can be created. For the uninitiated, ItemUtils' GUIManager offers two types of menus: global and temporary. Global menus are pre-rendered, can be viewed by multiple players at a time, and are perfect for static menus, such as a help menu, a rules menu, or a shop. Temporary menus are completely generated on-the-fly, can only be viewed by one player at a time, and are deleted once the player closes them. Only the currently requested page is rendered for temporary menus, whereas the entire menu is rendered upon creation for global menus.
## Protection against mutation
 JavaScript arrays are objects, which means that they are *mutable*. By default, creating a global paginated menu will create and store a clone of the array. This means that changes made to the original array after the menu was created will not have an effect on the contents of the menu. Temporary paginated menus also use a cloned array by default, but will use the original array if the players clicks on a refresh button. Navigating between pages does *not* count as clicking a refresh button, refresh buttons are optional to have in your menu and are explicity declared by you. This can be useful if you have data that frequently updates, and you want playerss to be able to check if the data has changed by refreshing the menu. This feature can also be disabled to use the cloned array for refreshes too. You can also explicity disable array cloning for temporary menus, however this is typically an unsafe option and should be used with caution, or not at all.
# Creating menus
 Creating global and temporary paginated menus is generally a similar process, as a lot of settings are shared between both.
## Universal settings (used by both global and temporary menus)
 `array` *(array, required)* - the array that this paginated menu should render.
 
 `borderSlots` *(array, optional, default [])* - a list of slots to place the `borderItem` in. This can be used as a more efficient way of rendering borders, as opposed to `staticItems` and `staticActions`.

 `borderItem` *(ItemStack, optional, default Air)* - the ItemStack to place in each declared border slot.

 `borderAction` *(function, taking an event argument, optional)* - the function to execute when a player clicks on a declared border slot.

 `emptySlotItem` *(ItemStack, optional, default Air)* - the ItemStack to place in a slot that would normally be used to render an array element, but there is no element to render is the array has ended. This will only appear on the last page of a menu.
 
 `emptySlotAction` *(function, taking an event argument, optional)* - the function to execute when a player clicks on an empty slot.

 `previousPageSlot` *(integer, required)* - the slot to place the previous page item in.

 `previousPageItem` *(function, optionally taking a page argument, returns ItemStack, required)* - the ItemStack to use as the previous page button. The page argument is optional, and can be used to display what page the button will take the player to. Example: `Go to page ${page}`

 `previousPageAction` *(function, taking 2 arguments [event, page], optional)* - an additional function to execute when the player clicks the `previousPageItem` to navigate to the previous page.

 `alreadyOnFirstPageItem` *(ItemStack, required)* - an alternate ItemStack to render in the place of the `previousPageItem` when the player is already viewing the first page of the menu.

 `alreadyOnFirstPageAction` *(function, taking an event argument, optional)* - an additional function to execute when the player clicks the `previousPageItem`, but is already viewing the first page of the menu.

 `nextPageSlot` *(integer, required)* - the slot to place the next page item in.

 `nextPageItem` *(function, optionally taking a page argument, returns ItemStack, required)* - the ItemStack to use as the previous page button. The page argument is optional, and can be used to display what page the button will take the player to. Example: `Go to page ${page}`

 `nextPageAction` *(function, taking 2 arguments [event, page], optional)* - an additional function to execute when the player clicks the `nextPageItem` to navigate to the next page.

 `alreadyOnLastPageItem` *(ItemStack, required)* - an alternate ItemStack to render in the place of the `nextPageItem` when the player is already viewing the last page of the menu.

 `alreadyOnLastPageAction` *(function, taking an event argument, optional)* - an additional function to execute when the player clicks the `nextPageItem`, but is already viewing the last page of the menu.

 `guiTitle` *(string, optional)* - a title for the menu. The `currentPagePlaceholder` and `maxPagePlaceholder` can be used to render the current page and the total amount of pages in the GUI title.

 `guiRows` *(number, optional, default 6)* - the number of rows each menu page should have.

 `loopedElementHandler` *(function, taking 2 arguments [element, index], returning an object {item: ItemStack, action: GUIAction}, optional)* - a function used to render array elements to the menu. This function should return an object, containing an `item` field and an `action` field. The `item` is the ItemStack that will be rendered, and the `action` is the action that will be executed when the player clicks the item. The `element` function argument is the current element in the array, and `index` is the index of that element in the array.

 `staticItems` *(Object<ItemStack>, optional, default {})* - a set of static items to render to each page of the menu. This can be used for decorations, a method of rendering a border using more than one type of item, a close menu button, or anything else.

 `staticActions` *(Object<GUIAction>, optional, default {})* - a set of static actions to render to each page of the menu. These can be used to assign actions to your static items.
 
 `guiOptions` *(Object, optional, default {})* - options to use for each page of the menu. This is where standard GUIManager options can be declared, such as `extraAction`.

 `itemsPerPage` *(integer, optional)* - the number of array elements to render to each page of the menu. **Manually declaring this value is not recommended**, as it is accurately computed for you by default.
## Settings specific to global menus
 `baseID` *(string, required)* - the base ID to use when creating each page of the menu. Example: a menu with a base ID of hello, the default global prefix ($) and 3 pages will generate GUIs hello$1, hello$2 and hello$3.
## Settings specific to temporary menus
 `cloneArray` *(boolean, optional, default true)* - whether or not a clone of the provided array should be used to render the menu, or the original array. Setting `cloneArray` to false is **unsafe, as it can cause issues regarding object mutation** *(mentioned earlier)*.

 `cloneForRefresh` *(boolean, optional, default false)* - whether or not a clone of the provided array should be used when the player clicks a refresh button in your menu. `cloneForRefresh` can only be set to true if `cloneArray` is also set to true.

 `noPagesCallback` *(function, optional)* - an alternate function to execute if the menu has zero pages upon creation (i.e. the provided array is empty). This can be used to do anything you want, such as displaying an alternative menu, or sending an error message in chat.
# Displaying menus
 A global paginated menu is created using the following syntax:
 ```js
 GUIManager.createGlobalPaginatedMenu(settings);
 ```
 ...and can then be opened to a player using the `displayGlobalPaginatedMenu` method:
 ```js
 GUIManager.displayGlobalPaginatedMenu(player, baseID, page);
 ```
 ...where `page` is optional, and defaults to 1.

 A temporary paginated menu is displayed instantly upon creation:
 ```js
 GUIManager.displayTemporaryPaginatedMenu(settings, player, page);
 ```
 ...where `page` is optional, and defaults to 1.
 This is intentionally similar to the behavior of regular GUIManager temporary menus.