let input = document.getElementById("myFile");
let inputCode = document.getElementById("input-code");

input.addEventListener("change", function () {
    if (this.files && this.files[0]) {
        let myFile = this.files[0];
        let reader = new FileReader();

        reader.addEventListener('load', function (e) {
            let programText = e.target.result;
            inputCode.textContent = programText;
            lexerView.setSourceByStringsAndRun(programText);
        });

        reader.readAsBinaryString(myFile);
    }
});