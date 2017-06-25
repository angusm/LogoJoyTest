let todoModule = angular.module('todo', []);

/**
 * Models a to-do list item.
 */
class Item {
    constructor(title) {
        this.title = title;
        this.active = false;
    }
}

/** @enum {string} Magic filter values. */
const FilterValues = {
    ALL: 'all',
    ACTIVE: 'active',
    COMPLETE: 'complete',
};

/**
 * Maps filter types to filter functions.
 * @const {Map<FilterValues, function(Array<Item>): Array<Item>>}
 */
const filterFunctions = new Map([
    [FilterValues.ALL, (item) => true],
    [FilterValues.ACTIVE, (item) => !item.active],
    [FilterValues.COMPLETE, (item) => item.active],
]);

class TodoController {
    /**
     * @returns {Array<Item>} Items that pass the currently set filter.
     * @export
     */
    static getFilteredItems(items, filter) {
        return items.filter(filterFunctions.get(filter));
    }

    /**
     * @returns {string} The enum value for filtering to show all items.
     * @export
     */
    static getAllFilterValue() {
        return FilterValues.ALL;
    }

    /**
     * @returns {string} The enum value for filtering to show active items.
     * @export
     */
    static getActiveFilterValue() {
        return FilterValues.ACTIVE;
    }

    /**
     * @returns {string} The enum value for filtering to show complete items.
     * @export
     */
    static getCompleteFilterValue() {
        return FilterValues.COMPLETE;
    }

    /**
     * Returns the items that are still in an active state.
     * @param {Array<Item>} items Items in the list to filter.
     * @returns {Array<Item>} Items in the given list that are still active.
     * @export
     */
    static getActiveItems(items) {
        return items.filter(filterFunctions.get(FilterValues.ACTIVE));
    }

    /**
     * Returns the items that are still in a complete state.
     * @param {Array<Item>} items Items in the list to filter.
     * @returns {Array<Item>} Items in the given list that are complete.
     * @export
     */
    static getCompleteItems(items) {
        return items.filter(filterFunctions.get(FilterValues.COMPLETE));
    }

    /**
     * Creates a new item with the given title and adds it to the list.
     * Discards empty items
     * @param {string} itemToAdd Title to use when creating the new item.
     * @param {Array<Item>} items List of items to add the new item to.
     * @export
     */
    static addItem(itemToAdd, items) {
        if (!itemToAdd) {
            return;
        }
        items.push(new Item(itemToAdd));
    }

    /**
     * Return the class of this instance, to be used to call static methods.
     * @returns {TodoController} The class this is an instance of.
     * @export
     */
    getClass() {
        return this.constructor;
    }
}

todoModule.controller('todoController', [TodoController]);

// Quick enter key directive pulled from StackOverflow renamed and reformatted
todoModule.directive('onEnterKey', () => {
    return (scope, element, attrs) => {
        element.bind('keydown keypress', function (event) {
            if (event.which !== 13) {
                return;
            }
            scope.$apply(() => {
                scope.$eval(attrs.onEnterKey);
            });
            event.preventDefault();
        });
    };
});