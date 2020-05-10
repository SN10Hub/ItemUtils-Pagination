"use strict";

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

module.exports = {
  inject: function inject(ItemUtils) {
    var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
        _ref$globalPrefix = _ref.globalPrefix,
        globalPrefix = _ref$globalPrefix === void 0 ? "$" : _ref$globalPrefix,
        _ref$currentPagePlace = _ref.currentPagePlaceholder,
        currentPagePlaceholder = _ref$currentPagePlace === void 0 ? /%current%/g : _ref$currentPagePlace,
        _ref$maxPagePlacehold = _ref.maxPagePlaceholder,
        maxPagePlaceholder = _ref$maxPagePlacehold === void 0 ? /%max%/g : _ref$maxPagePlacehold;

    var log = function log(message) {
      return java.lang.System.out.println("[ItemUtils-Pagination] ".concat(message));
    };

    if (ItemUtils == null || _typeof(ItemUtils) !== "object") return log("Injection failed: an ItemUtils instance was not passed.");
    var ItemBuilder = ItemUtils.ItemBuilder,
        InventoryBuilder = ItemUtils.InventoryBuilder,
        GUIManager = ItemUtils.GUIManager;

    try {
      var buildPage = function buildPage(_ref2) {
        var array = _ref2.array,
            borderSlots = _ref2.borderSlots,
            borderItem = _ref2.borderItem,
            borderAction = _ref2.borderAction,
            emptySlotItem = _ref2.emptySlotItem,
            emptySlotAction = _ref2.emptySlotAction,
            previousPageSlot = _ref2.previousPageSlot,
            previousPageItem = _ref2.previousPageItem,
            previousPageAction = _ref2.previousPageAction,
            alreadyOnFirstPageItem = _ref2.alreadyOnFirstPageItem,
            alreadyOnFirstPageAction = _ref2.alreadyOnFirstPageAction,
            nextPageSlot = _ref2.nextPageSlot,
            nextPageItem = _ref2.nextPageItem,
            nextPageAction = _ref2.nextPageAction,
            alreadyOnLastPageItem = _ref2.alreadyOnLastPageItem,
            alreadyOnLastPageAction = _ref2.alreadyOnLastPageAction,
            guiTitle = _ref2.guiTitle,
            guiRows = _ref2.guiRows,
            loopedElementItem = _ref2.loopedElementItem,
            loopedElementAction = _ref2.loopedElementAction,
            staticItems = _ref2.staticItems,
            staticActions = _ref2.staticActions,
            itemsPerPage = _ref2.itemsPerPage,
            _ref2$page = _ref2.page,
            page = _ref2$page === void 0 ? 1 : _ref2$page,
            pages = _ref2.pages,
            objectCount = _ref2.objectCount,
            isBorderSlot = _ref2.isBorderSlot,
            changePageMethod = _ref2.changePageMethod;
        var startIndex = itemsPerPage * (page - 1),
            slots = [];
        var _n = 0;

        for (var i = 0; i < itemsPerPage; _n++) {
          if (!isBorderSlot(_n) && _n !== previousPageSlot && _n !== nextPageSlot && staticItems[_n] === undefined) {
            slots.push(_n);
            i++;
          }
        }

        var _items = {},
            _actions = {};

        for (var index in slots) {
          index = parseInt(index);
          var slot = slots[index];

          var _i = startIndex + index;

          if (_i >= objectCount) {
            _items[slot] = emptySlotItem;
            _actions[slot] = emptySlotAction;
          } else {
            (function () {
              var _el = array[startIndex + index];
              _items[slot] = loopedElementItem(startIndex + index);

              _actions[slot] = function (InventoryClickEvent) {
                return loopedElementAction(_el, InventoryClickEvent);
              };
            })();
          }
        }

        borderSlots.forEach(function (slot) {
          _items[slot] = borderItem;
          _actions[slot] = borderAction;
        });

        var items = _objectSpread({}, staticItems, {}, _items); // Assigned after declaring the object because Babel cannot compile the code using the modern method.


        items[previousPageSlot] = page <= 1 ? alreadyOnFirstPageItem : previousPageItem(page - 1);
        items[nextPageSlot] = page >= pages ? alreadyOnLastPageItem : nextPageItem(page + 1);

        var actions = _objectSpread({}, staticActions, {}, _actions); // Assigned after declaring the object because Babel cannot compile the code using the modern method.


        actions[previousPageSlot] = page <= 1 ? alreadyOnFirstPageAction : function (event) {
          previousPageAction(event, page - 1);
          changePageMethod(event, page - 1);
        };
        actions[nextPageSlot] = page >= pages ? alreadyOnLastPageAction : function (event) {
          nextPageAction(event, page + 1);
          changePageMethod(event, page + 1);
        };
        return {
          inventory: new InventoryBuilder(guiRows, guiTitle.replace(currentPagePlaceholder, page).replace(maxPagePlaceholder, pages), items),
          actions: actions
        };
      }; // Global menus


      GUIManager.createGlobalPaginatedMenu = function (settings) {
        var baseID = settings.baseID,
            _settings$borderSlots = settings.borderSlots,
            borderSlots = _settings$borderSlots === void 0 ? [] : _settings$borderSlots,
            _settings$borderItem = settings.borderItem,
            borderItem = _settings$borderItem === void 0 ? new ItemBuilder("AIR") : _settings$borderItem,
            _settings$borderActio = settings.borderAction,
            borderAction = _settings$borderActio === void 0 ? function (_event) {} : _settings$borderActio,
            _settings$emptySlotIt = settings.emptySlotItem,
            emptySlotItem = _settings$emptySlotIt === void 0 ? new ItemBuilder("AIR") : _settings$emptySlotIt,
            _settings$emptySlotAc = settings.emptySlotAction,
            emptySlotAction = _settings$emptySlotAc === void 0 ? function (_event) {} : _settings$emptySlotAc,
            previousPageSlot = settings.previousPageSlot,
            previousPageItem = settings.previousPageItem,
            _settings$previousPag = settings.previousPageAction,
            previousPageAction = _settings$previousPag === void 0 ? function (_event, _page) {} : _settings$previousPag,
            alreadyOnFirstPageItem = settings.alreadyOnFirstPageItem,
            _settings$alreadyOnFi = settings.alreadyOnFirstPageAction,
            alreadyOnFirstPageAction = _settings$alreadyOnFi === void 0 ? function (_event) {} : _settings$alreadyOnFi,
            nextPageSlot = settings.nextPageSlot,
            nextPageItem = settings.nextPageItem,
            _settings$nextPageAct = settings.nextPageAction,
            nextPageAction = _settings$nextPageAct === void 0 ? function (_event, _page) {} : _settings$nextPageAct,
            alreadyOnLastPageItem = settings.alreadyOnLastPageItem,
            _settings$alreadyOnLa = settings.alreadyOnLastPageAction,
            alreadyOnLastPageAction = _settings$alreadyOnLa === void 0 ? function (_event) {} : _settings$alreadyOnLa,
            _settings$guiTitle = settings.guiTitle,
            guiTitle = _settings$guiTitle === void 0 ? "".concat(currentPagePlaceholder, "/").concat(maxPagePlaceholder) : _settings$guiTitle,
            _settings$guiRows = settings.guiRows,
            guiRows = _settings$guiRows === void 0 ? 6 : _settings$guiRows,
            _settings$loopedEleme = settings.loopedElementItem,
            loopedElementItem = _settings$loopedEleme === void 0 ? function (_el) {
          return new ItemBuilder("AIR");
        } : _settings$loopedEleme,
            _settings$loopedEleme2 = settings.loopedElementAction,
            loopedElementAction = _settings$loopedEleme2 === void 0 ? function (_el, _event) {} : _settings$loopedEleme2,
            _settings$staticItems = settings.staticItems,
            staticItems = _settings$staticItems === void 0 ? {} : _settings$staticItems,
            _settings$staticActio = settings.staticActions,
            staticActions = _settings$staticActio === void 0 ? {} : _settings$staticActio,
            _settings$guiOptions = settings.guiOptions,
            guiOptions = _settings$guiOptions === void 0 ? {} : _settings$guiOptions,
            _settings$itemsPerPag = settings.itemsPerPage,
            itemsPerPage = _settings$itemsPerPag === void 0 ? 9 * guiRows - 2 - borderSlots.length - Object.keys(staticItems).length : _settings$itemsPerPag; // Always use a cloned array for global menus, as these are static and it will prevent unintended problems after creating the menu.

        var array = _toConsumableArray(settings.array),
            isBorderSlot = function isBorderSlot(slot) {
          return borderSlots.indexOf(slot) > -1;
        },
            objectCount = array.length,
            pages = Math.ceil(objectCount / itemsPerPage);

        (function next(page) {
          var _staticActions = _objectSpread({}, staticActions);

          for (var i in _staticActions) {
            // A staticAction that is being used to refresh the page should be an object, not a function
            if (_typeof(_staticActions[i]) === "object" && _staticActions[i].reloadPage) {
              (function () {
                var action = _staticActions[i].action;

                _staticActions[i] = function (event) {
                  action(event);
                  GUIManager.displayGlobalPaginatedMenu(event.getWhoClicked(), baseID, page);
                };
              })();
            }
          }

          var _buildPage = buildPage({
            array: array,
            borderSlots: borderSlots,
            borderItem: borderItem,
            borderAction: borderAction,
            emptySlotItem: emptySlotItem,
            emptySlotAction: emptySlotAction,
            previousPageSlot: previousPageSlot,
            previousPageItem: previousPageItem,
            previousPageAction: previousPageAction,
            alreadyOnFirstPageItem: alreadyOnFirstPageItem,
            alreadyOnFirstPageAction: alreadyOnFirstPageAction,
            nextPageSlot: nextPageSlot,
            nextPageItem: nextPageItem,
            nextPageAction: nextPageAction,
            alreadyOnLastPageItem: alreadyOnLastPageItem,
            alreadyOnLastPageAction: alreadyOnLastPageAction,
            guiTitle: guiTitle,
            guiRows: guiRows,
            loopedElementItem: loopedElementItem,
            loopedElementAction: loopedElementAction,
            staticItems: staticItems,
            staticActions: _staticActions,
            itemsPerPage: itemsPerPage,
            page: page,
            pages: pages,
            objectCount: objectCount,
            isBorderSlot: isBorderSlot,
            changePageMethod: function changePageMethod(event, page) {
              return GUIManager.displayGlobalPaginatedMenu(event.getWhoClicked(), baseID, page);
            }
          }),
              inventory = _buildPage.inventory,
              actions = _buildPage.actions;

          GUIManager.createGlobalMenu(baseID + globalPrefix + page, inventory, actions, guiOptions);
          if (page <= pages) next(page + 1);
        })(1);
      };

      GUIManager.displayGlobalPaginatedMenu = function (player, baseID) {
        var page = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;
        return GUIManager.displayGlobalMenu(player, baseID + globalPrefix + page);
      }; // Temporary menus


      GUIManager.displayTemporaryPaginatedMenu = function (settings, player) {
        var page = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;
        var _settings$borderSlots2 = settings.borderSlots,
            borderSlots = _settings$borderSlots2 === void 0 ? [] : _settings$borderSlots2,
            _settings$borderItem2 = settings.borderItem,
            borderItem = _settings$borderItem2 === void 0 ? new ItemBuilder("AIR") : _settings$borderItem2,
            _settings$borderActio2 = settings.borderAction,
            borderAction = _settings$borderActio2 === void 0 ? function (_event) {} : _settings$borderActio2,
            _settings$emptySlotIt2 = settings.emptySlotItem,
            emptySlotItem = _settings$emptySlotIt2 === void 0 ? new ItemBuilder("AIR") : _settings$emptySlotIt2,
            _settings$emptySlotAc2 = settings.emptySlotAction,
            emptySlotAction = _settings$emptySlotAc2 === void 0 ? function (_event) {} : _settings$emptySlotAc2,
            previousPageSlot = settings.previousPageSlot,
            previousPageItem = settings.previousPageItem,
            _settings$previousPag2 = settings.previousPageAction,
            previousPageAction = _settings$previousPag2 === void 0 ? function (_event, _page) {} : _settings$previousPag2,
            alreadyOnFirstPageItem = settings.alreadyOnFirstPageItem,
            _settings$alreadyOnFi2 = settings.alreadyOnFirstPageAction,
            alreadyOnFirstPageAction = _settings$alreadyOnFi2 === void 0 ? function (_event) {} : _settings$alreadyOnFi2,
            nextPageSlot = settings.nextPageSlot,
            nextPageItem = settings.nextPageItem,
            _settings$nextPageAct2 = settings.nextPageAction,
            nextPageAction = _settings$nextPageAct2 === void 0 ? function (_event, _page) {} : _settings$nextPageAct2,
            alreadyOnLastPageItem = settings.alreadyOnLastPageItem,
            _settings$alreadyOnLa2 = settings.alreadyOnLastPageAction,
            alreadyOnLastPageAction = _settings$alreadyOnLa2 === void 0 ? function (_event) {} : _settings$alreadyOnLa2,
            _settings$guiTitle2 = settings.guiTitle,
            guiTitle = _settings$guiTitle2 === void 0 ? "".concat(currentPagePlaceholder, "/").concat(maxPagePlaceholder) : _settings$guiTitle2,
            _settings$guiRows2 = settings.guiRows,
            guiRows = _settings$guiRows2 === void 0 ? 6 : _settings$guiRows2,
            _settings$loopedEleme3 = settings.loopedElementItem,
            loopedElementItem = _settings$loopedEleme3 === void 0 ? function (_el) {
          return new ItemBuilder("AIR");
        } : _settings$loopedEleme3,
            _settings$loopedEleme4 = settings.loopedElementAction,
            loopedElementAction = _settings$loopedEleme4 === void 0 ? function (_el, _event) {} : _settings$loopedEleme4,
            _settings$staticItems2 = settings.staticItems,
            staticItems = _settings$staticItems2 === void 0 ? {} : _settings$staticItems2,
            _settings$staticActio2 = settings.staticActions,
            staticActions = _settings$staticActio2 === void 0 ? {} : _settings$staticActio2,
            _settings$guiOptions2 = settings.guiOptions,
            guiOptions = _settings$guiOptions2 === void 0 ? {} : _settings$guiOptions2,
            _settings$itemsPerPag2 = settings.itemsPerPage,
            itemsPerPage = _settings$itemsPerPag2 === void 0 ? 9 * guiRows - 2 - borderSlots.length - Object.keys(staticItems).length : _settings$itemsPerPag2,
            _settings$cloneArray = settings.cloneArray,
            cloneArray = _settings$cloneArray === void 0 ? true : _settings$cloneArray,
            _settings$cloneForRef = settings.cloneForRefresh,
            cloneForRefresh = _settings$cloneForRef === void 0 ? false : _settings$cloneForRef,
            _settings$noPagesCall = settings.noPagesCallback,
            noPagesCallback = _settings$noPagesCall === void 0 ? function () {} : _settings$noPagesCall;
        if (settings.array.length < 1) return noPagesCallback();

        var array = cloneArray ? _toConsumableArray(settings.array) : settings.array,
            isBorderSlot = function isBorderSlot(slot) {
          return borderSlots.indexOf(slot) > -1;
        },
            objectCount = array.length,
            pages = Math.ceil(objectCount / itemsPerPage);

        if (page > pages) page = pages;else if (page < 1) page = 1;

        var _staticActions = _objectSpread({}, staticActions);

        for (var i in _staticActions) {
          // A staticAction that is being used to refresh the page should be an object, not a function
          if (_typeof(_staticActions[i]) === "object" && _staticActions[i].reloadPage) {
            (function () {
              var action = _staticActions[i].action;

              _staticActions[i] = function (event) {
                action(event);
                GUIManager.displayTemporaryPaginatedMenu(cloneArray && cloneForRefresh ? _objectSpread({}, settings, {
                  array: array
                }) : settings, player, page);
              };
            })();
          }
        }

        var _buildPage2 = buildPage({
          array: array,
          borderSlots: borderSlots,
          borderItem: borderItem,
          borderAction: borderAction,
          emptySlotItem: emptySlotItem,
          emptySlotAction: emptySlotAction,
          previousPageSlot: previousPageSlot,
          previousPageItem: previousPageItem,
          previousPageAction: previousPageAction,
          alreadyOnFirstPageItem: alreadyOnFirstPageItem,
          alreadyOnFirstPageAction: alreadyOnFirstPageAction,
          nextPageSlot: nextPageSlot,
          nextPageItem: nextPageItem,
          nextPageAction: nextPageAction,
          alreadyOnLastPageItem: alreadyOnLastPageItem,
          alreadyOnLastPageAction: alreadyOnLastPageAction,
          guiTitle: guiTitle,
          guiRows: guiRows,
          loopedElementItem: loopedElementItem,
          loopedElementAction: loopedElementAction,
          staticItems: staticItems,
          staticActions: _staticActions,
          itemsPerPage: itemsPerPage,
          page: page,
          pages: pages,
          objectCount: objectCount,
          isBorderSlot: isBorderSlot,
          changePageMethod: function changePageMethod(_event, page) {
            return GUIManager.displayTemporaryPaginatedMenu(settings, player, page);
          }
        }),
            inventory = _buildPage2.inventory,
            actions = _buildPage2.actions;

        GUIManager.displayTemporaryMenu(player, inventory, actions, guiOptions);
      };

      return {
        ItemBuilder: ItemBuilder,
        InventoryBuilder: InventoryBuilder,
        GUIManager: GUIManager
      };
    } catch (e) {
      log("Injection failed! Perhaps you've passed in a malformed ItemUtils instance?");
    }
  }
};