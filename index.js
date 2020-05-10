module.exports = {
    inject: (ItemUtils, {globalPrefix = "$", currentPagePlaceholder = /%current%/g, maxPagePlaceholder = /%max%/g} = {}) => {
        const log = message => java.lang.System.out.println(`[ItemUtils-Pagination] ${message}`);

        if(ItemUtils == null || typeof ItemUtils !== "object") return log("Injection failed: an ItemUtils instance was not passed.");

        const {ItemBuilder, InventoryBuilder, GUIManager} = ItemUtils;

        try {
            function buildPage({
                array,
                borderSlots,
                borderItem,
                borderAction,
                emptySlotItem,
                emptySlotAction,
                previousPageSlot,
                previousPageItem,
                previousPageAction,
                alreadyOnFirstPageItem,
                alreadyOnFirstPageAction,
                nextPageSlot,
                nextPageItem,
                nextPageAction,
                alreadyOnLastPageItem,
                alreadyOnLastPageAction,
                guiTitle,
                guiRows,
                loopedElementHandler,
                staticItems,
                staticActions,
                itemsPerPage,

                page = 1,
                pages,
                objectCount,
                isBorderSlot,
                changePageMethod
            }){
                const startIndex = itemsPerPage * (page - 1),
                    slots = [];
                let _n = 0;
                for(let i = 0; i < itemsPerPage; _n++){
                    if(!isBorderSlot(_n) && _n !== previousPageSlot && _n !== nextPageSlot && staticItems[_n] === undefined){
                        slots.push(_n);
                        i++;
                    }
                }
                const _items = {}, _actions = {};
                for(let index in slots){
                    index = parseInt(index);
                    const slot = slots[index];
                    const i = startIndex + index;
                    if(i >= objectCount){
                        _items[slot] = emptySlotItem;
                        _actions[slot] = emptySlotAction;
                    } else {
                        const _el = array[i];
                        const {item = new ItemBuilder("AIR"), action = (_event) => {}} = loopedElementHandler(_el, i);
                        _items[slot] = item;
                        _actions[slot] = InventoryClickEvent => action(InventoryClickEvent);
                    }
                }
                borderSlots.forEach(slot => {
                    _items[slot] = borderItem;
                    _actions[slot] = borderAction;
                });
                const items = {
                    ...staticItems,
                    ..._items,
                    [previousPageSlot]: page <= 1 ? alreadyOnFirstPageItem : previousPageItem(page - 1),
                    [nextPageSlot]: page >= pages ? alreadyOnLastPageItem : nextPageItem(page + 1)
                };
                const actions = {
                    ...staticActions,
                    ..._actions,
                    [previousPageSlot]: page <= 1 ? alreadyOnFirstPageAction : event => {
                        previousPageAction(event, page - 1);
                        changePageMethod(event, page - 1);
                    },
                    [nextPageSlot]: page >= pages ? alreadyOnLastPageAction : event => {
                        nextPageAction(event, page + 1);
                        changePageMethod(event, page + 1);
                    }
                };
                return {inventory: new InventoryBuilder(guiRows, guiTitle.replace(currentPagePlaceholder, page).replace(maxPagePlaceholder, pages), items), actions};
            }

            // Global menus
    
            GUIManager.createGlobalPaginatedMenu = settings => {
                const {
                    baseID,
                    borderSlots = [],
                    borderItem = new ItemBuilder("AIR"),
                    borderAction = _event => {},
                    emptySlotItem = new ItemBuilder("AIR"),
                    emptySlotAction = _event => {},
                    previousPageSlot,
                    previousPageItem,
                    previousPageAction = (_event, _page) => {},
                    alreadyOnFirstPageItem,
                    alreadyOnFirstPageAction = _event => {},
                    nextPageSlot,
                    nextPageItem,
                    nextPageAction = (_event, _page) => {},
                    alreadyOnLastPageItem,
                    alreadyOnLastPageAction = _event => {},
                    guiTitle = `${currentPagePlaceholder}/${maxPagePlaceholder}`,
                    guiRows = 6,
                    loopedElementHandler = (_el, _index) => {return {item: new ItemBuilder("AIR"), action: (_event) => {}}},
                    staticItems = {},
                    staticActions = {},
                    guiOptions = {},
                    // itemsPerPage defaults to the full inventory, minus the 2 slots needed for the previous and next page buttons, border slots and static items.
                    itemsPerPage = (((9 * guiRows) - 2) - (borderSlots.length)) - Object.keys(staticItems).length,
                } = settings;

                // Always use a cloned array for global menus, as these are static and it will prevent unintended problems after creating the menu.
                const array = [...settings.array],
                    isBorderSlot = slot => borderSlots.indexOf(slot) > -1,
                    objectCount = array.length,
                    pages = Math.ceil(objectCount / itemsPerPage);

                (function next(page){
                    const _staticActions = {...staticActions};
                    for(const i in _staticActions){
                        // A staticAction that is being used to refresh the page should be an object, not a function
                        if(typeof _staticActions[i] === "object" && _staticActions[i].reloadPage){
                            const {action} = _staticActions[i];
                            _staticActions[i] = event => {
                                action(event);
                                GUIManager.displayGlobalPaginatedMenu(event.getWhoClicked(), baseID, page);
                            }
                        }
                    }

                    const {inventory, actions} = buildPage({
                        array,
                        borderSlots,
                        borderItem,
                        borderAction,
                        emptySlotItem,
                        emptySlotAction,
                        previousPageSlot,
                        previousPageItem,
                        previousPageAction,
                        alreadyOnFirstPageItem,
                        alreadyOnFirstPageAction,
                        nextPageSlot,
                        nextPageItem,
                        nextPageAction,
                        alreadyOnLastPageItem,
                        alreadyOnLastPageAction,
                        guiTitle,
                        guiRows,
                        loopedElementHandler,
                        staticItems,
                        staticActions: _staticActions,
                        itemsPerPage,
                        page,
                        pages,
                        objectCount,
                        isBorderSlot,
                        changePageMethod: (event, page) => GUIManager.displayGlobalPaginatedMenu(event.getWhoClicked(), baseID, page)
                    });
                    GUIManager.createGlobalMenu(baseID + globalPrefix + page, inventory, actions, guiOptions);
                    if(page <= pages) next(page + 1);
                }(1));
            };
            GUIManager.displayGlobalPaginatedMenu = (player, baseID, page = 1) => GUIManager.displayGlobalMenu(player, baseID + globalPrefix + page);

            // Temporary menus

            GUIManager.displayTemporaryPaginatedMenu = (settings, player, page = 1) => {
                const {
                    borderSlots = [],
                    borderItem = new ItemBuilder("AIR"),
                    borderAction = _event => {},
                    emptySlotItem = new ItemBuilder("AIR"),
                    emptySlotAction = _event => {},
                    previousPageSlot,
                    previousPageItem,
                    previousPageAction = (_event, _page) => {},
                    alreadyOnFirstPageItem,
                    alreadyOnFirstPageAction = _event => {},
                    nextPageSlot,
                    nextPageItem,
                    nextPageAction = (_event, _page) => {},
                    alreadyOnLastPageItem,
                    alreadyOnLastPageAction = _event => {},
                    guiTitle = `${currentPagePlaceholder}/${maxPagePlaceholder}`,
                    guiRows = 6,
                    loopedElementHandler = (_el, _index) => {return {item: new ItemBuilder("AIR"), action: (_event) => {}}},
                    staticItems = {},
                    staticActions = {},
                    guiOptions = {},
                    // itemsPerPage defaults to the full inventory, minus the 2 slots needed for the previous and next page buttons, border slots and static items.
                    itemsPerPage = (((9 * guiRows) - 2) - (borderSlots.length)) - Object.keys(staticItems).length,

                    // Should we clone the array (default), or use the original array (can be modified after the menu was created/displayed)
                    cloneArray = true,

                    // Should we use the original array when refreshing the page (default), or should we use a cloned array (requires cloneArray === true)
                    cloneForRefresh = false,

                    // Function to execute if the array is empty / the GUI has 0 pages. This can be used to send an error message, open an alternate menu, etc
                    noPagesCallback = () => {}
                } = settings;

                if(settings.array.length < 1) return noPagesCallback();

                const array = cloneArray ? [...settings.array] : settings.array,
                    isBorderSlot = slot => borderSlots.indexOf(slot) > -1,
                    objectCount = array.length,
                    pages = Math.ceil(objectCount / itemsPerPage);

                if(page > pages) page = pages;
                else if(page < 1) page = 1;

                const _staticActions = {...staticActions};
                for(const i in _staticActions){
                    // A staticAction that is being used to refresh the page should be an object, not a function
                    if(typeof _staticActions[i] === "object" && _staticActions[i].reloadPage){
                        const {action} = _staticActions[i];
                        _staticActions[i] = event => {
                            action(event);
                            GUIManager.displayTemporaryPaginatedMenu((cloneArray && cloneForRefresh) ? {...settings, array} : settings, player, page);
                        }
                    }
                }

                const {inventory, actions} = buildPage({
                    array,
                    borderSlots,
                    borderItem,
                    borderAction,
                    emptySlotItem,
                    emptySlotAction,
                    previousPageSlot,
                    previousPageItem,
                    previousPageAction,
                    alreadyOnFirstPageItem,
                    alreadyOnFirstPageAction,
                    nextPageSlot,
                    nextPageItem,
                    nextPageAction,
                    alreadyOnLastPageItem,
                    alreadyOnLastPageAction,
                    guiTitle,
                    guiRows,
                    loopedElementHandler,
                    staticItems,
                    staticActions: _staticActions,
                    itemsPerPage,
                    page,
                    pages,
                    objectCount,
                    isBorderSlot,
                    changePageMethod: (_event, page) => GUIManager.displayTemporaryPaginatedMenu(settings, player, page)
                });
                GUIManager.displayTemporaryMenu(player, inventory, actions, guiOptions);
            };
    
            return {ItemBuilder, InventoryBuilder, GUIManager, registerItemBuilderCustomOption: ItemUtils.registerItemBuilderCustomOption};
        } catch(e){
            log("Injection failed! Perhaps you've passed in a malformed ItemUtils instance?");
        }
    }
}