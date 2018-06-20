class CalcController {

    constructor (){
        this._locale        = "pt-BR";
        this._lastOperator  = '';
        this._lastNumber    = '';
        this._audioOnOff    = false;
        this._audio         = new Audio('click.mp3');
        this._operation     = [];
        this._dateCalcEl    = document.querySelector("#data");
        this._timeCalcEl    = document.querySelector("#hora");
        this._displayCalcEl = document.querySelector("#display");
        this._currentDate;
        this.initialize();
        this.initButtonsEvents();
        this.initKeyBoard();
    }

    copyToClipBoard(){
        //criando elemento
        let input  = document.createElement('input');
        input.value = this.displayCalc;
        document.body.appendChild(input);

        //copiar valor
        input.select();
        document.execCommand("Copy");

        //remover input
        input.remove();
    }

    pasteFromClipboard(){
        document.addEventListener('paste', e => {
            let text = e.clipboardData.getData('Text');
            this.displayCalc = parseFloat(text);
        });
    }

    initialize(){
        this.setDisplayDateTime();
        let intervalDateTime = setInterval(()=> {
            this.setDisplayDateTime();
        }, 1000);
        this.setLastNumberToDisplay();
        this.pasteFromClipboard();
        document.querySelectorAll('.btn-ac').forEach(btn => {
            btn.addEventListener('dblclick', e => {
                this.toggleAudio();
            });
        });
    }

    toggleAudio(){
        this._audioOnOff = !this._audioOnOff;        
    }

    playAudio(){
        if (this._audioOnOff) {
            this._audio.currentTime = 0;
            this._audio.play();
        }
    }

    initKeyBoard(){
        document.addEventListener('keyup', e => {
            switch (e.key) {
                case 'c':
                    if (e.ctrlKey || e.metaKey) this.copyToClipBoard();
                    break;
            }          
            this.execBtn(e.key);
        });
    }

    addEventListenerAll(element, events, fn){
        events.split(' ').forEach(event => {
            element.addEventListener(event, fn, false);
        });
    }

    clearAll(){
        this._operation = [];
        this._lastNumber = '';
        this._lastOperator = '';
        this.setLastNumberToDisplay();
    }

    cancelEntry(){
        this._operation.pop();
        this.setLastNumberToDisplay();
    }

    getLastOperation(){
        return this._operation[this._operation.length-1];
    }

    setLastOperation(value){
        this._operation[this._operation.length-1] = value;
    }

    isOperator(value){
        return (['+', '-', '*', '/', '%'].indexOf(value) > -1);
    }

    pushOperation(value){
        this._operation.push(value);
        if (this._operation.length > 3) {
            this.calc();
        } else {
            
        }
    }

    getLastItem(isOperator = true){
        let lastItem;
        for (let i = this._operation.length-1;i >= 0; i--){            
            if(this.isOperator(this._operation[i]) == isOperator){
                lastItem = this._operation[i];
                break;
            }           
        }
        if (!lastItem) {
            lastItem = (isOperator) ? this._lastOperator : this._lastNumber;
        }
        return lastItem;
    }

    setLastNumberToDisplay(){
        let lastNumber = this.getLastItem(false);
        if(!lastNumber) lastNumber = 0;
        this.displayCalc = lastNumber;
    }

    getResult(){
        try {
            return eval(this._operation.join(""));
        } catch (e) {
            console.log(e);
            setTimeout(()=>{
                this.setError();
            },1);
        }        
    }

    calc(){
        let last = '';
        let result = '';

        this._lastOperator = this.getLastItem();

        if (this._operation.length < 3 ) {
            let firstItem = this._operation[0];            
            this._operation = [firstItem, this._lastOperator, this._lastNumber];
        }

        if (this._operation.length > 3 ) {
            last = this._operation.pop();            
            this._lastNumber   = this.getResult();
        } else if (this._operation.length == 3 ) {
            this._lastNumber   = this.getLastItem(false);
        } 
        
        result = this.getResult();
        if (last == "%") {
            result /= 100;
            this._operation = [result];   
        } else {            
            this._operation = [result];
            if(last) this._operation.push(last);               
        }
        this.setLastNumberToDisplay();
    }

    addOperation(value){
        if(isNaN(this.getLastOperation())){
            //string
            if(this.isOperator(value)){
                //trocar o operador
                this.setLastOperation(value);
            } else {
                this.pushOperation(value);
                this.setLastNumberToDisplay();
            }
        } else {
            if (this.isOperator(value)) {
                this.pushOperation(value);
            } else {
                let newvalue = this.getLastOperation().toString() + value.toString();
                this.setLastOperation(newvalue);
                this.setLastNumberToDisplay();
            }            
        }
    }

    setError(){
        this.displayCalc = 'Error';
    }

    addDot(){
        let lastOperation = this.getLastOperation();
        
        if (typeof lastOperation === 'string' && lastOperation.split('').indexOf('.') > -1) return;

        if (this.isOperator(lastOperation) || !lastOperation) {
            this.pushOperation('0.');
        } else {
            this.setLastOperation(lastOperation.toString() + '.');
        }
        this.setLastNumberToDisplay();
    }

    execBtn(value){
        this.playAudio();
        switch (value) {
            case 'ac':
            case 'Escape':
                this.clearAll();
                break;
            case 'ce':
            case 'Backspace':
                this.cancelEntry();
                break;
            case 'soma':
            case '+':
                this.addOperation("+");
                break;
            case 'subtracao':
            case '-':
                this.addOperation("-"); 
                break;
            case 'multiplicacao':
            case '*':
                this.addOperation("*");
                break;
            case 'divisao':
            case '/':
                this.addOperation("/");
                break;
            case 'porcento':
            case '%':
                this.addOperation("%");
                break;                
            case 'ponto':
            case '.':
            case ',':
                this.addDot();
                break;
            case 'igual':
            case 'Enter':
            case '=':
                this.calc();
                break;
            case '0':
            case '1':
            case '2':
            case '3':
            case '4':
            case '5':
            case '6':
            case '7':
            case '8':
            case '9':
                this.addOperation(parseInt(value));
                break;
        }
    }

    initButtonsEvents(){
        let buttons = document.querySelectorAll("#buttons > g, #parts > g");
        buttons.forEach((btn, index) => {
            this.addEventListenerAll(btn, 'click drag', e => {
                let textBtn = btn.className.baseVal.replace("btn-","");
                this.execBtn(textBtn);
            });
            this.addEventListenerAll(btn, 'mouseover mouseup mousedown', e => {
                btn.style.cursor = "pointer";
            });
        });
    }

    setDisplayDateTime(){
        this.displayDate = this.currenteDate.toLocaleDateString(this._locale,{
            day: '2-digit',
            month: 'long',
            year: 'numeric'
        });
        this.displayTime = this.currenteDate.toLocaleTimeString(this._locale);
    }

    get displayTime(){
        return this._timeCalcEl.innerHTML;
    }

    set displayTime(value){
        this._timeCalcEl.innerHTML = value;
    }

    get displayDate(){
        return this._dateCalcEl.innerHTML;
    }

    set displayDate(value){
        this._dateCalcEl.innerHTML = value;
    }

    get displayCalc(){
        return this._displayCalcEl.innerHTML;
    }

    set displayCalc(value){
        if (value.toString().length > 10) {
            this.setError();
            return false;
        }
        this._displayCalcEl.innerHTML = value;
    }

    get currenteDate(){
        return new Date();
    }

    set currenteDate(value){
        this._currentDate = value;
    }
}