# ItemUtils-Pagination
 Easily create paginated GUIs with minimal code footprint.
 This is an extension for **ItemUtils**. Without it, this module will not work.

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