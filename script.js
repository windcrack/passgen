document.addEventListener('DOMContentLoaded', () =>{
    class GeneratePasswor {
      constructor(options) {
        this.$elInputBoxOut =
          document.querySelector(options.elInputBoxOut) || "";
        this.$elInputBoxRange =
          document.querySelector(options.elInputBoxRange) || "";
        this.$elInputBoxRangeNumber =
          document.querySelector(options.elInputBoxRangeNumber) || "";
        this.$elPassIndicator =
          document.querySelector(options.elPassIndicator) || "";
        this.$elButton = document.querySelector(options.elButton) || "";
        this.$elOptions = document.querySelectorAll(options.elOptions) || [];
        this.$elCopyPass = document.querySelector(options.elCopyPass);
        this.charset = "abdehkmnpswxz";
        this.charsetUp = "ABDEFGHKMNPQRSTWXZ";
        this.charsetNumber = "123456789";
        this.charsetSymbols = "~!@-#$";
        this.lenCharset = 16;
        this.curId = new Set();

        console.log("$elPassIndicator", this.$elPassIndicator);
    
        this.init();
    
      }

      selectLenth(rangeInput, elBlockNumber) {
        let that = this;
        console.log(elBlockNumber, rangeInput);
        rangeInput.addEventListener("input", function () {
          elBlockNumber.innerText = this.value;
          that.lenCharset = this.value;
        });
      }

      selectOption(){
        let that = this;
        this.$elOptions.forEach((option) =>{
          option.addEventListener("change", function () {
            if (this.checked) {
              // Добавляем id в Set, если опция выбрана
              that.curId.add(this.id);
            } else {
              // Удаляем id из Set, если опция снята
              that.curId.delete(this.id);
            }
          });
        });
        
      }

      passwordDifficulty(passBlock){
        let is_lower = false;
        let is_up = false;
        let is_number = false;
        let is_symbol = false;
        let rating = 0;

        for (let i = 0; i < passBlock.length; i++) {
          if (!is_lower && this.charset.indexOf(passBlock[i]) != -1) {
            is_lower = true;
          }else if(!is_up && this.charsetUp.indexOf(passBlock[i]) != -1){
            is_up = true;
          }else if(!is_number && this.charsetNumber.indexOf(passBlock[i]) != -1){
            is_number = true;
          }else if (!is_symbol && this.charsetSymbols.indexOf(passBlock[i]) != -1) {
            is_symbol = true;
          }
        }

        if(is_lower) rating++;
        if(is_up) rating++;
        if(is_number) rating++;
        if(is_symbol) rating++;

        if(passBlock.length < 6 && rating < 3){
            this.$elPassIndicator.style.setProperty('--size-week', '30%');
            this.$elPassIndicator.style.setProperty("--color-week", "red");
        }else if(passBlock.length < 6 && rating >= 3){
            this.$elPassIndicator.style.setProperty('--size-week', '50%');
            this.$elPassIndicator.style.setProperty("--color-week", "#F6A840");
        }else if(passBlock.length >= 8 && rating < 3){
            this.$elPassIndicator.style.setProperty('--size-week', '50%');
            this.$elPassIndicator.style.setProperty("--color-week", "#F6A840");
        }else if(passBlock.length >= 8 && rating >= 3){
            this.$elPassIndicator.style.setProperty('--size-week', '100%');
            this.$elPassIndicator.style.setProperty("--color-week", "#84AB28");
        }
      }

      generate(len, output) {
        let curCharset = this.charset;
        console.log("this.curId", this.curId);
        // Используем Set для проверки наличия опций
        if (this.curId.has("uppercase")) {
          curCharset += this.charsetUp;
        }
        if (this.curId.has("numbers")) {
          curCharset += this.charsetNumber;
        }
        if (this.curId.has("symbols")) {
          curCharset += this.charsetSymbols;
        }

        let str = "";
        for (let i = 0; i < len; i++) {
          let pos = Math.floor(Math.random() * curCharset.length);
          str += curCharset.substring(pos, pos + 1);
        }

        return (output.value = str);
      }

      passGen(button) {
        
        button.addEventListener("click", () => {
          this.generate(this.lenCharset, this.$elInputBoxOut);
          this.passwordDifficulty(this.$elInputBoxOut.value);
        });
      }

      copyPass(){
        this.$elCopyPass.addEventListener('click', () =>{
            if (this.$elInputBoxOut.value !== "") {
              navigator.clipboard.writeText(this.$elInputBoxOut.value);
            } else {
              confirm("Нечего копировать");
            }
        });
      }

      init(){
        this.$elInputBoxRangeNumber.innerText = this.lenCharset;
        this.$elInputBoxRange.value = this.lenCharset;

        this.selectLenth(this.$elInputBoxRange, this.$elInputBoxRangeNumber);
        this.selectOption(this.$elOptions);
        this.passGen(this.$elButton, this.lenCharset);
        this.copyPass();
      }
    }

    new GeneratePasswor({
      elInputBoxOut: ".js-input-box",
      elInputBoxRange: ".js-pass-length-input",
      elInputBoxRangeNumber: ".js-pass-length-number",
      elPassIndicator: ".js-pass-indicator-week",
      elButton: ".js-generate-btn",
      elOptions: ".js-option",
      elCopyPass: ".js-copy-btn",
    });
})