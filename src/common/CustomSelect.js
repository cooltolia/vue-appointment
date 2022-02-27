import $$ from '@/common/plugins';
import SimpleBar from 'simplebar';

export default class CustomSelect {
    /**
     * @param {HTMLElement} select
     * @param {Object} settings
     * @param {Boolean} settings.multiple - multiple choises
     * @param {String} settings.multipleCounterLabel
     * @param {Function} settings.onSelect - callback for selected element
     */
    constructor(select, settings = {}) {
        if (!select) {
            throw new Error('No element has been passed');
        }
        this.select = select;
        this.settings = settings;

        this.setup();
    }

    setup() {
        this.valueInput = this.select.querySelector('.custom-select__value');
        this.selected = this.select.querySelector('.custom-select__selected');
        this.dropdown = this.select.querySelector('.custom-select__dropdown');
        this.optionsList = this.select.querySelector('.custom-select__options');

        this.inititalPlaceholder = this.selected.textContent.trim();

        new SimpleBar(this.dropdown, {
            autoHide: false,
        });

        /** keycodes */
        this.keyCodes = {
            enter: 13,
            down_arrow: 40,
            up_arrow: 38,
            escape: 27,
        };

        if (this.settings.multiple) {
            this.multipleCounter = 0;
            this.optionsList.classList.add('multiple');
        }

        /** set proper UI if has initial selected options */
        const initialSelectedOptions = [...this.optionsList.children].filter((el) =>
            el.classList.contains('selected')
        );

        if (initialSelectedOptions.length > 0 && this.settings.multiple) {
            this.multipleCounter = initialSelectedOptions.length;
            this.selected.textContent = `${this.settings.multipleCounterLabel}: ${this.multipleCounter}`;

            if (this.valueInput) {
                this.valueInput.value = initialSelectedOptions.reduce(
                    (acc, el) => (acc += `${el.textContent.trim()};`),
                    ''
                );
            }

            if (initialSelectedOptions.length + 1 === [...this.optionsList.children].length) {
                [...this.optionsList.children]
                    .find((el) => el.dataset.all !== undefined)
                    .classList.add('selected');
            }
        } else if (initialSelectedOptions.length === 1) {
            this.selected.textContent = initialSelectedOptions[0].textContent.trim();

            if (this.valueInput) {
                this.valueInput.value = this.selected.textContent;
                this.valueInput.dataset.id = initialSelectedOptions[0].dataset.id;
            }
        } else {
            this.multipleCounter = 0;
            this.selected.textContent = this.inititalPlaceholder;
        }

        this.setEventHandlers();
    }

    setEventHandlers() {
        this.selected.addEventListener('keydown', (e) => this.toggleOptionsList(e));
        this.selected.addEventListener('click', (e) => this.toggleOptionsList(e));

        this.optionsList.addEventListener('click', (e) => {
            const target = e.target;

            if (target.classList.contains('custom-select__option')) {
                this.selectItem(e);
            }
        });

        this.optionsList.addEventListener('keydown', (e) => {
            const target = e.target;

            if (target.classList.contains('custom-select__option')) {
                switch (e.keyCode) {
                    case this.keyCodes.enter:
                        this.selectItem(e);

                        break;

                    case this.keyCodes.down_arrow:
                        e.preventDefault();

                        this.focusNextListItem(this.keyCodes.down_arrow);
                        break;

                    case this.keyCodes.up_arrow:
                        e.preventDefault();

                        this.focusNextListItem(this.keyCodes.up_arrow);
                        break;

                    case this.keyCodes.escape:
                        this.closeOptionsList();
                        break;

                    default:
                        break;
                }
            }
        });

        document.addEventListener('click', (e) => {
            if (!this.select.contains(e.target) && this.dropdown.classList.contains('opened')) {
                this.closeOptionsList();
            }
        });
    }

    toggleOptionsList(e) {
        if (e.keyCode === this.keyCodes.escape) {
            this.closeOptionsList();
        }

        if (e.type === 'click') {
            this.dropdown.classList.toggle('opened');
            this.dropdown.parentNode.classList.toggle('opened');
            this.selected.classList.toggle('opened');

            this.dropdown.setAttribute('aria-expanded', this.dropdown.classList.contains('opened'));
            $$.fadeToggle(this.dropdown);
        }

        if (e.keyCode === this.keyCodes.down_arrow) {
            e.preventDefault();

            this.focusNextListItem(this.keyCodes.down_arrow);
        }

        if (e.keyCode === this.keyCodes.up_arrow) {
            e.preventDefault();

            this.focusNextListItem(this.keyCodes.up_arrow);
        }
    }

    closeOptionsList() {
        this.dropdown.classList.remove('opened');
        this.dropdown.parentNode.classList.remove('opened');
        this.selected.classList.remove('opened');
        this.dropdown.setAttribute('aria-expanded', false);
        $$.fadeOut(this.dropdown);
    }

    focusNextListItem(direction) {
        const activeElement = document.activeElement;
        const options = [...this.optionsList.children];
        if (activeElement.classList.contains('custom-select__selected')) {
            this.optionsList.children[0].focus();
        } else {
            const currentActiveElementIndex = options.indexOf(activeElement);
            if (direction === this.keyCodes.down_arrow) {
                const currentActiveElementIsNotLastItem =
                    currentActiveElementIndex < options.length - 1;
                if (currentActiveElementIsNotLastItem) {
                    const nextListItem = options[currentActiveElementIndex + 1];

                    nextListItem.focus();
                }
            } else if (direction === this.keyCodes.up_arrow) {
                const currentActiveElementIsNotFirstItem = currentActiveElementIndex > 0;
                if (currentActiveElementIsNotFirstItem) {
                    const nextListItem = options[currentActiveElementIndex - 1];
                    nextListItem.focus();
                }
            }
        }
    }

    selectItem(e) {
        const selectedValue = e.target.textContent.trim();
        if (this.settings.multiple) {
            this.multipleSelectLogic(e, selectedValue);
        } else {
            /** clicked item was already selected */
            if (this.selected.textContent === selectedValue) {
                this.closeOptionsList();
                return;
            }

            this.selected.textContent = selectedValue;

            if (this.valueInput) {
                this.valueInput.value = selectedValue;
                this.valueInput.dataset.id = e.target.dataset.id;
                this.dispatchInputChange();
            }
            this.closeOptionsList();

            if (typeof this.settings.onSelect === 'function') {
                const selectedItem = {
                    value: selectedValue,
                    id: e.target.dataset.id,
                    index: e.target.dataset.index,
                };
                this.settings.onSelect(selectedItem);
            }
        }
    }

    setSelected(value) {
        this.selected.textContent = value;

        if (this.valueInput) {
            this.valueInput.value = value;
            this.dispatchInputChange();
        }
    }

    clearSelected() {
        this.selected.textContent = this.inititalPlaceholder;
        if (this.valueInput) {
            this.valueInput.value = null;
            // this.dispatchInputChange();
        }

        if (this.multipleCounter) {
            this.multipleCounter = 0;
        }
    }

    multipleSelectLogic(e, selectedValue) {
        const valueDivider = ';';
        const target = e.target;
        const action = target.classList.contains('selected') ? 'remove' : 'add';
        const toggleAll = target.dataset.all !== undefined;
        if (action === 'remove') {
            target.classList.remove('selected');
            this.multipleCounter--;

            if (this.valueInput) {
                this.valueInput.value = this.valueInput.value
                    .split(valueDivider)
                    .filter((val) => val !== selectedValue)
                    .join(valueDivider);
                this.dispatchInputChange();
            }

            if (toggleAll) {
                [...this.optionsList.children]
                    .filter((li) => li.dataset.id)
                    .map((li) => li.classList.remove('selected'));
                this.multipleCounter = 0;
            } else {
                [...this.optionsList.children]
                    .find((el) => el.dataset.all !== undefined)
                    .classList.remove('selected');
            }
        } else {
            target.classList.add('selected');
            this.multipleCounter++;

            if (this.valueInput) {
                this.valueInput.value += selectedValue + valueDivider;
                this.dispatchInputChange();
            }

            if (toggleAll) {
                const options = [...this.optionsList.children]
                    .filter((li) => li.dataset.id)
                    .map((li) => li.classList.add('selected'));

                this.multipleCounter = options.length;
            } else if (this.multipleCounter === this.optionsList.children.length - 1) {
                [...this.optionsList.children]
                    .find((el) => el.dataset.all !== undefined)
                    .classList.add('selected');
            }
        }

        if (this.multipleCounter === 0) {
            this.selected.textContent = this.inititalPlaceholder;
        } else {
            this.selected.textContent = `${this.settings.multipleCounterLabel}: ${this.multipleCounter}`;
        }

        if (typeof this.settings.onSelect === 'function') {
            const selectedItem = {
                value: selectedValue,
                id: e.target.dataset.id,
                index: e.target.dataset.index,
                action,
                toggleAll,
            };
            this.settings.onSelect(selectedItem);
        }
    }

    dispatchInputChange() {
        const e = new Event('change');
        this.valueInput.dispatchEvent(e);
    }
}
