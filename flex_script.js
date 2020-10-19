class LexerView {
    constructor(options) {
        this.lexer = options.lexer;
        this.reservedWords = ['do', 'while'];
        this.table = document.getElementById("lex-table");
        this.errors = [];
        this.errorsTextarea = document.getElementById("errors");
        this.addDefinitions();
        this.addRules();
    }
    addDefinitions() {
        this.lexer.addDefinition('LETTER', /(?:(?![XVI])[a-zA-Z])+/);
        this.lexer.addDefinition('ROMAN', /[XVI]+/);
        this.lexer.addDefinition('DIGIT', /[0-9]+/);
        this.lexer.addDefinition('ASSIGNMENT', /:=/);
        this.lexer.addDefinition('DELIMITER', /;/);
        this.lexer.addDefinition('COMPARISON', /[<>=]/);
        this.lexer.addDefinition('WHITESPACE', /\s/);
        this.lexer.addDefinition('BRACE_OPEN', /[(]/);
        this.lexer.addDefinition('BRACE_CLOSED', /[)]/);
    }
    addRules() {
        this.lexer.addRule(/{LETTER}({DIGIT}?)+/,  (lexer) => {
            let lexem = lexer.text;

            this.isWordReserved(lexem)
                ? this.addToTable('KEYWORD', lexem)
                : this.addToTable('IDENTIFIER', lexem);
        });

        this.lexer.addRule(/{ROMAN}/,  (lexer) => {
            this.addToTable('ROMAN', lexer.text);
        });

        this.lexer.addRule(/{ASSIGNMENT}/, (lexer) => {
            this.addToTable('ASSIGNMENT', lexer.text);
        });

        this.lexer.addRule(/{COMPARISON}/,  (lexer) => {
            this.addToTable('COMPARISON', lexer.text);
        });

        this.lexer.addRule(/{DIGIT}/, (lexer) => {
            this.addToTable('DIGIT', lexer.text);
        });

        this.lexer.addRule(/{DELIMITER}/, (lexer) => {
            this.addToTable('DELIMITER', lexer.text);
        });

        this.lexer.addRule(/{WHITESPACE}/, (lexer) => {
            this.addToTable('WHITESPACE', lexer.text);
        });

        this.lexer.addRule(/{BRACE_OPEN}/, (lexer) => {
            this.addToTable('BRACE_OPEN', lexer.text);
        });
        this.lexer.addRule(/{BRACE_CLOSED}/, (lexer) => {
            this.addToTable('BRACE_CLOSED', lexer.text);
        });

        this.lexer.addRule(/./, (lexer) => {
            this.addToTable('Undefined symbol', lexer.text);
            this.errors.push(lexer.source);
        });
    }
    isWordReserved(text) {
        return this.reservedWords.includes(text);
    }
    addToTable(type, lexem) {
        let numberOfLex = this.table.rows.length - 1;
        let row = this.table.insertRow();
        let cell1 = row.insertCell(0);
        let cell2 = row.insertCell(1);
        let cell3 = row.insertCell(2);
        cell1.innerHTML = numberOfLex;
        cell2.innerHTML = lexem;
        cell3.innerHTML = type;
    }
    renderErrors() {
        let errorStr = '';
        this.errors = new Set(this.errors);
        this.errors.forEach((str) => {
            errorStr += str + '\n';
        });
        this.errorsTextarea.textContent = errorStr;
    }
    clearTable(table) {
        while (table.rows.length > 1) {
            table.deleteRow(1);
        }
    }
    setSourceByStringsAndRun(sourceCode) {
        let stringArr = sourceCode.split('\n');
        this.clearTable(this.table);
        this.errors = [];
        stringArr.forEach((str) => {
            this.lexer.setSource(str);
            this.lexer.lex();
        });
        if (this.errors.length) {
            this.renderErrors();
        }
    }
}

let lexerView = new LexerView({lexer: window.lexer});
window.lexerView = lexerView;
