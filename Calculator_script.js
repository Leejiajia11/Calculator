class Calculator {
    constructor(displayElement) {
        this.displayElement = displayElement;
        this.reset();
    }

    reset() {
        this.displayContent = '';
        this.updateDisplay();
    }

    delete() {
        this.displayContent = this.displayContent.slice(0, -1);
        this.updateDisplay();
    }

    appendNumber(number) {
        this.displayContent += number;
        this.updateDisplay();
    }

    chooseOperator(operator) {
        const lastChar = this.displayContent.slice(-1);
        // 如果最后一个字符是运算符或左括号时，允许添加运算符
/*        if (['+', '-', '*', '/'].includes(lastChar)) {
            this.displayContent = this.displayContent.slice(0, -1); // 覆盖前一个运算符
        } else if (lastChar === '(' && operator !== 'subtract') {
            // 如果是左括号后面只能输入减号运算符
            return;
        }*/

        switch (operator) {
            case 'add':
                this.displayContent += '+';
                break;
            case 'subtract':
                this.displayContent += '-';
                break;
            case 'multiply':
                this.displayContent += '*';
                break;
            case 'divide':
                this.displayContent += '/';
                break;
            case 'power':
                this.displayContent += '^';
                break;
            case 'percent':
                this.displayContent += '%';
                break;
            case 'root':
                this.displayContent += '√';
                break;
            case 'openParen':
                if ([')', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'].includes(lastChar)) {
                    // 数字或右括号后不能直接跟左括号
                    return;
                }
                this.displayContent += '(';
                break;
            case 'closeParen':
                if (this.isParenthesesBalanced() && !['+', '-', '*', '/', '('].includes(lastChar)) {
                    // 右括号可以跟在数字或另一个右括号之后
                    return;
                }
                this.displayContent += ')';
                break;
        }
        this.updateDisplay();
    }

    calculate() {
        try {
            // 替换 `^` 为 `**`，`%` 为 `* (b / 100)`，`√` 为开 n 次方
            let expression = this.displayContent
                .replace(/\^/g, '**')                    // 处理次方运算
                .replace(/(\d+)%/g, '($1/100)')          // 处理百分比
                .replace(/(\d+)√(\d+)/g, 'Math.pow($2, 1/$1)'); // 处理 n√x 开 n 次方

            // 使用替换后的 expression 进行括号匹配检查和计算
            if (this.isParenthesesBalanced(expression)) {
                const result = new Function('return ' + expression)();
                this.displayContent = result.toString();
            } else {
                this.displayContent = '括号不匹配';
            }
        } catch (error) {
            this.displayContent = '错误';
        }
        this.updateDisplay();
    }

    isParenthesesBalanced() {
        let stack = [];
        for (let char of this.displayContent) {
            if (char === '(') {
                stack.push(char);
            } else if (char === ')') {
                if (stack.length === 0) {
                    return false;
                }
                stack.pop();
            }
        }
        return stack.length === 0;
    }

    updateDisplay() {
        this.displayElement.value = this.displayContent || '0';
    }

    handleKeyboardInput(event) {
        if (/\d/.test(event.key)) {
            this.appendNumber(event.key);
        } else if (event.key === '.') {
            this.appendNumber('.');
        } else if (event.key === 'Backspace') {
            this.delete();
        } else if (event.key === 'Escape') {
            this.reset();
        } else if (event.key === 'Enter' || event.key === '=') {
            this.calculate();
        } else if (event.key === '+') {
            this.chooseOperator('add');
        } else if (event.key === '-') {
            this.chooseOperator('subtract');
        } else if (event.key === '*') {
            this.chooseOperator('multiply');
        } else if (event.key === '/') {
            this.chooseOperator('divide');
        } else if (target.dataset.action === 'n√') {
            calculator.chooseOperator('root');
        }
        else if (event.key === '%') {
            this.chooseOperator('percent');
        } else if (event.key === '(') {
            this.chooseOperator('openParen');
        } else if (event.key === ')') {
            this.chooseOperator('closeParen');
        }
    }
}

const calculator = new Calculator(document.getElementById('display'));

document.querySelector('.calculator-keys').addEventListener('click', (event) => {
    const target = event.target;
    if (!target.matches('button')) return;

    if (target.dataset.action === 'clear') {
        calculator.reset();
    } else if (target.dataset.action === 'delete') {
        calculator.delete();
    } else if (target.dataset.action === 'add') {
        calculator.chooseOperator('add');
    } else if (target.dataset.action === 'subtract') {
        calculator.chooseOperator('subtract');
    } else if (target.dataset.action === 'multiply') {
        calculator.chooseOperator('multiply');
    } else if (target.dataset.action === 'divide') {
        calculator.chooseOperator('divide');
    }else if (target.dataset.action === 'power') {
        calculator.chooseOperator('power');
    } else if (target.dataset.action === 'percent') {
        calculator.chooseOperator('percent');
    } else if (target.dataset.action === 'root') {
        calculator.chooseOperator('root');
    } else if (target.dataset.action === 'equals') {
        calculator.calculate();
    } else if (target.dataset.action === 'openParen') {
        calculator.chooseOperator('openParen');
    } else if (target.dataset.action === 'closeParen') {
        calculator.chooseOperator('closeParen');
    } else {
        calculator.appendNumber(target.textContent);
    }
});

document.addEventListener('keydown', (event) => {
    calculator.handleKeyboardInput(event);
});