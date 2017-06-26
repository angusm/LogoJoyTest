/**
 * Models a to-do list item.
 */
class Item {
    /**
     * @param {string} title Title for the to-do item.
     * @param {boolean} active Whether the to-do item has not been checked off.
     */
    constructor(title, active=true) {
        /** @type {string} Title for the to-do item. */
        this.title = title;

        /** @type {boolean} Whether the to-do item has not been checked off. */
        this.active = active;
    }
}

/** @enum {string} Magic filter values. */
const FilterValue = {
    ALL: 'all',
    ACTIVE: 'active',
    COMPLETE: 'complete',
};

/**
 * Maps filter types to filter functions.
 * @const {Map<FilterValue, function(Array<Item>): Array<Item>>}
 */
const filterFunctions = new Map([
    [FilterValue.ALL, (item) => true],
    [FilterValue.ACTIVE, (item) => item.active],
    [FilterValue.COMPLETE, (item) => !item.active],
]);

/**
 * Component for adding items to the to-do app.
 */
class TodoAddCta extends React.Component {
    /**
     * @param {Object} props Props from parent.
     */
    constructor(props) {
        super(props);

        /** @type {Object} Current state */
        this.state = {
            inputValue: '',
        };
    }

    /**
     * Adds an item in response to a click event.
     */
    addItemOnClick() {
        this.props.addItem(this.state.inputValue);
    }

    /**
     * Adds an item in response to the enter key.
     */
    addItemOnEnter(event) {
        if (event.key !== 'Enter') {
            return;
        }
        this.props.addItem(this.state.inputValue);
    }

    /**
     * Updates the input value as it is typed.
     */
    updateInputValue(event) {
        this.setState({
            inputValue: event.target.value,
        });
    }

    /**
     * Renders the template
     * @returns {XML}
     */
    render() {
        return (
            <div className="col-md-12 input-group">
                <span className="input-group-btn">
                    <button className="btn btn-primary"
                            onClick={this.addItemOnClick.bind(this)}>
                        Add
                    </button>
                </span>
                <input className="form-control"
                       type="text"
                       onChange={this.updateInputValue.bind(this)}
                       onKeyPress={this.addItemOnEnter.bind(this)}
                       value={this.state.inputValue} />
            </div>
        )
    }
}

/**
 * Component for displaying to-do items.
 */
class TodoList extends React.Component {
    /**
     * Returns the class names to assign to an item in the list.
     * @param {Item} item Item to get the CSS classes for.
     * @returns {string} Returns the CSS classes to add as a string.
     */
    getActiveClass(item) {
        return !item.active ? 'done' : '';
    }

    /**
     * Toggles the active state of the given item.
     * @param {Item} item The item's whose state to toggle.
     */
    toggleActive(item) {
        this.props.toggleActive(item);
    }

    /**
     * Renders the template for the to-do list.
     * @returns {XML}
     */
    render() {
        const items = this.props.items.map((item) => {
            return (
                <li className={`list-item list-group-item ${this.getActiveClass(item)}`}
                    onClick={this.toggleActive.bind(this, item)}>
                    <input type="checkbox" checked={!item.active} />
                    <span>{item.title}</span>
                </li>)
        });
        return (
            <ul className="list-group col-md-12 input-group">
                {items}
            </ul>
        )
    }
}

/**
 * The footer component for the to-do list.
 */
class TodoFooter extends React.Component {
    /**
     * Handles a filter value being selected.
     * @param {Event} e The change event.
     */
    handleFilterSelection(e) {
        this.props.setFilter(e.target.value);
    }

    /**
     * Renders the footer component.
     * @returns {XML}
     */
    render() {
        const options = Object.keys(FilterValue).map((filterValueKey) => {
            return FilterValue[filterValueKey];
        }).map((optionValue) => {
            return <option value={optionValue}>{optionValue}</option>;
        });
        return (
            <div className="row">
                <div className="col-md-6">
                    <select onChange={this.handleFilterSelection.bind(this)}>
                        {options}
                    </select>
                </div>
                <div className="col-md-6 clear-button-container">
                    <button className="btn btn-default"
                            onClick={this.props.clearCompleted}
                            disabled={!this.props.completeItemsExist}>
                        Clear Complete
                    </button>
                </div>
            </div>
        )
    }
}

/**
 *
 */
class TodoApp extends React.Component {
    /**
     * @param {Object} props Props from parent.
     */
    constructor(props) {
        super(props);

        /** @type {Object} Current state */
        this.state = {
            items: [],
            filter: FilterValue.ALL,
        };
    }

    /**
     * Adds a new item to the list using the given name.
     * @param {string} itemName Item to add to the list of items.
     */
    addItem(itemName) {
        this.setState({
            items: [...this.state.items, new Item(itemName)],
        });
    }

    /**
     * Removes the completed items from the to-do list
     */
    clearCompleted() {
        this.setState({
            items: this.state.items.filter(
                filterFunctions.get(FilterValue.ACTIVE)),
        });
    }

    /**
     * @returns {Array<Item>} Items with a completed status.
     */
    getCompleteItems() {
        return this.state.items.filter(
            filterFunctions.get(FilterValue.COMPLETE));
    }

    /**
     * @returns {Array<Item>} Items that pass the current filter.
     */
    getFilteredItems() {
        return this.state.items.filter(
            filterFunctions.get(this.state.filter));
    }

    /**
     * @param {FilterValue} filter Sets the current filter.
     */
    setFilter(filter) {
        this.setState({
            filter: filter,
        });
    }

    /**
     * @param {Item} itemToToggle Item whose active status should be toggled.
     */
    toggleActive(itemToToggle) {
        this.setState({
            items: this.state.items.map((item) => {
                if (item !== itemToToggle) {
                    return item;
                } else {
                    return new Item(itemToToggle.title, !itemToToggle.active);
                }
            }),
        });
    }

    /**
     * Renders the template for the to-do list application.
     * @returns {XML}
     */
    render() {
        return (
            <div className="container">
                <h1 className="col-md-12">todos</h1>
                <TodoAddCta addItem={this.addItem.bind(this)} />
                <TodoList items={this.getFilteredItems()}
                          toggleActive={this.toggleActive.bind(this)} />
                <TodoFooter setFilter={this.setFilter.bind(this)}
                            clearCompleted={this.clearCompleted.bind(this)}
                            completeItemsExist={!!this.getCompleteItems().length} />
            </div>
        );
    }
}

ReactDOM.render(<TodoApp />, document.getElementById('todo'));