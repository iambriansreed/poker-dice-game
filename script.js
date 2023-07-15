class ScoreCard {
    values = {
        upper1: 0,
        upper2: 0,
        upper3: 0,
        upper4: 0,
        upper5: 0,
        upper6: 0,
        lower1: 0,
        lower2: 0,
        lower3: 0,
        lower4: 0,
        lower5: 0,
        lower6: 0,
        lower7: 0,
        lower8: 0
    };
    activeScoreSelect = null;

    constructor() {
        this.modal = document.getElementById('modal');
        this.modalContent = modal.querySelector('.content');
        this.modalBackdrop = modal.querySelector('.backdrop');

        this.container = document.getElementById('upper-section');
        this.upperSubtotal = document.getElementById('upper-section-subtotal');
        this.upperBonus = document.getElementById('upper-section-bonus');
        this.lowerTotal = document.getElementById('lower-section-total');
        this.grandTotal = document.getElementById('grand-total');
        this.upperSectionTotal = document.getElementsByClassName(
            'upper-section-total'
        );

        this.template = this.container.innerHTML;

        this.modalBackdrop.onclick = () => {
            this.toggleModal(false);
        };

        this.modalContent.onclick = event => {
            this.toggleModal(false);
            const isNone = event.target.innerText === NONE;
            this.activeScoreSelect.className = isNone ? '' : 'has-value';
            this.activeScoreSelect.innerText = isNone
                ? ''
                : event.target.innerText;
            this.setValue(
                this.activeScoreSelect.getAttribute('name'),
                parseInt(event.target.innerText || 0, 10)
            );
        };

        customElement('score-select', '', (element, props) => {
            let optionValues = [];
            if (props.range) {
                const params = props.range.split(',').map(n => parseInt(n, 10));
                optionValues = range(...params);
            } else if (props.options) {
                optionValues = props.options.split(',');
            }
            element.onclick = () => {
                this.toggleModal(writeOptions(optionValues));
                this.activeScoreSelect = element;
            };
        });
    }

    setValue(name, value) {
        this.values[name] = value;
        this.calculateTotals();
    }

    calculateTotals = () => {
        const upperSubtotal =
            this.values.upper1 +
            this.values.upper2 +
            this.values.upper3 +
            this.values.upper4 +
            this.values.upper5 +
            this.values.upper6;
        const lowerTotal =
            this.values.lower1 +
            this.values.lower2 +
            this.values.lower3 +
            this.values.lower4 +
            this.values.lower5 +
            this.values.lower6 +
            this.values.lower7 +
            this.values.lower8;

        const bonus = upperSubtotal > 62 ? 35 : 0;
        const upperTotal = bonus + upperSubtotal;

        this.upperSubtotal.innerText = upperSubtotal;
        this.upperBonus.innerText = bonus || '';
        this.lowerTotal.innerText = lowerTotal;
        this.grandTotal.innerText = upperTotal + lowerTotal;

        Array.from(this.upperSectionTotal).forEach(el => {
            el.innerText = upperTotal;
        });
    };

    toggleModal(innerHTML) {
        this.modal.style.display = innerHTML ? 'block' : 'none';
        this.modalContent.innerHTML = innerHTML || '';
    }
}

const scoreCard = new ScoreCard();

function customElement(selector, innerHTML, cb) {
    document.querySelectorAll(selector).forEach(element => {
        const props = {
            children: element.innerHTML
        };
        if (innerHTML) element.innerHTML = innerHTML;
        for (
            let i = 0, attrs = element.attributes, n = attrs.length;
            i < n;
            i++
        ) {
            props[attrs[i].nodeName] = attrs[i].value;
        }
        cb(element, props);
    });
}

const NONE = '';

function writeOptions(values = []) {
    const optionValues = [NONE, 0, ...values];
    return (
        '<div class="select">' +
        optionValues
            .map(value => `<div class="option">${value}</div>`)
            .join('') +
        '</div>'
    );
}

function dice(num) {
    const _ = [' ', ' ', ' ', ' ', ' ', ' ', ' '];

    const x = {
        1: [' ', ' ', ' ', ' ', ' ', ' ', false],
        2: [false, ' ', ' ', ' ', ' ', false, ' '],
        3: [false, ' ', ' ', ' ', ' ', false, false],
        4: [false, ' ', false, false, ' ', false, ' '],
        5: [false, ' ', false, false, ' ', false],
        6: [false, false, false, false, false, false, ' ']
    };

    const [a, b, c, d, e, f, g] = x[num] || _;
    return `<svg viewBox="0 0 400 400" version="1.1" xmlns="http://www.w3.org/2000/svg">
<rect x="2" y="2" rx="10" ry="10" width="396" height="396" stroke="gray" fill="lightgray" stroke-width="4"/>
  ${a ||
      '<circle cx="100" cy="100" r="40" stroke="black" fill="black" stroke-width="4"/>'}
  ${b ||
      '<circle cx="100" cy="200" r="40" stroke="black" fill="black" stroke-width="4"/>'}
  ${c ||
      '<circle cx="100" cy="300" r="40" stroke="black" fill="black" stroke-width="4"/>'}
  ${d ||
      '<circle cx="300" cy="100" r="40" stroke="black" fill="black" stroke-width="4"/>'}
  ${e ||
      '<circle cx="300" cy="200" r="40" stroke="black" fill="black" stroke-width="4"/>'}
  ${f ||
      '<circle cx="300" cy="300" r="40" stroke="black" fill="black" stroke-width="4"/>'}
  ${g ||
      '<circle cx="200" cy="200" r="40" stroke="black" fill="black" stroke-width="4"/>'}
</svg>
`;
}

/**
 * range()
 *
 * Returns an array of numbers between a start number and an end number incremented
 * sequentially by a fixed number(step), beginning with either the start number or
 * the end number depending on which is greater.
 *
 * @param {number} start (Required: The start number.)
 * @param {number} end (Required: The end number. If end is less than start,
 *  then the range begins with end instead of start and decrements instead of increment.)
 * @param {number} step (Optional: The fixed increment or decrement step. Defaults to 1.)
 *
 * @return {array} (An array containing the range numbers.)
 *
 * @throws {TypeError} (If any of start, end and step is not a finite number.)
 * @throws {Error} (If step is not a positive number.)
 */
function range(start, end, step = 1) {
    // Test that the first 3 arguments are finite numbers.
    // Using Array.prototype.every() and Number.isFinite().
    const allNumbers = [start, end, step].every(Number.isFinite);

    // Throw an error if any of the first 3 arguments is not a finite number.
    if (!allNumbers) {
        throw new TypeError(
            'range() expects only finite numbers as arguments.'
        );
    }

    // Ensure the step is always a positive number.
    if (step <= 0) {
        throw new Error('step must be a number greater than 0.');
    }

    // When the start number is greater than the end number,
    // modify the step for decrementing instead of incrementing.
    if (start > end) {
        step = -step;
    }

    // Determine the length of the array to be returned.
    // The length is incremented by 1 after Math.floor().
    // This ensures that the end number is listed if it falls within the range.
    const length = Math.floor(Math.abs((end - start) / step)) + 1;

    // Fill up a new array with the range numbers
    // using Array.from() with a mapping function.
    // Finally, return the new array.
    return Array.from(Array(length), (x, index) => start + index * step);
}
