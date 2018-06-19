class CalcController {

    constructor (){
        this._locale        = "pt-BR";
        this._operation     = [];
        this._dateCalcEl    = document.querySelector("#data");
        this._timeCalcEl    = document.querySelector("#hora");
        this._displayCalcEl = document.querySelector("#display");
        this._currentDate;
        this.initialize();
        this.initButtonsEvents();
    }

    initialize(){
        this.setDisplayDateTime();
        let intervalDateTime = setInterval(()=> {
            this.setDisplayDateTime();
        }, 1000);
    }

    addEventListenerAll(element, events, fn){
        events.split(' ').forEach(event => {
            element.addEventListener(event, fn, false);
        });
    }

    clearAll(){
        this._operation = [];
    }

    cancelEntry(){
        this._operation.pop();
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

    setLastNumberToDisplay(){
        let lastNumber;
        for (let i = this._operation.length-1;i >= 0; i--){
            if(!this.isOperator(this._operation[i])){
                lastNumber = this._operation[i];
                break;
            }
        }
        this.displayCalc = lastNumber;
    }

    calc(){
        let last = this._operation.pop();
        let result = eval(this._operation.join(""));
        this._operation = [result, last];
        this.setLastNumberToDisplay();
    }

    addOperation(value){
        if(isNaN(this.getLastOperation())){
            //string
            if(this.isOperator(value)){
                //trocar o operador
                this.setLastOperation(value);
            } else if (isNaN(value)){
                console.log("Outra coisa",value);
            } else {
                this.pushOperation(value);
                this.setLastNumberToDisplay();
            }
        } else {
            if (this.isOperator(value)) {
                this.pushOperation(value);
            } else {
                let newvalue = this.getLastOperation().toString() + value.toString();
                this.setLastOperation(parseInt(newvalue));
                this.setLastNumberToDisplay();
            }            
        }
    }

    setError(){
        this.displayCalc = 'Error';
    }

    execBtn(value){
        switch (value) {
            case 'ac':
                this.clearAll();
                break;
            case 'ce':
                this.cancelEntry();
                break;
            case 'soma':
                this.addOperation("+");
                break;
            case 'subtracao':
                this.addOperation("-"); 
                break;
            case 'multiplicacao':
                this.addOperation("*");
                break;
            case 'divisao':
                this.addOperation("/");
                break;
            case 'porcento':
                this.addOperation("%");
                break;                
            case 'ponto':
                this.addOperation(".");
                break;
            case 'igual':
                this.addOperation("=");
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
            default:
                this.setError();
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
        this._displayCalcEl.innerHTML = value;
    }

    get currenteDate(){
        return new Date();
    }

    set currenteDate(value){
        this._currentDate = value;
    }
}