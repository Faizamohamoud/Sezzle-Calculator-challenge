

var socket = io(location.origin);
socket.on('connect', function(){
    console.log('I am connected')
});
socket.on('calc', function(data){
    let list = document.getElementById("list-of-results");
    //document.getElementById("list-of-results").innerHTML = '';
    let createdLi = document.createElement("li");
    createdLi.innerText = data;
    list.appendChild(createdLi);
    console.log('data', data);
});
socket.on('disconnect', function(){

});


function calculate() {
    const number1 = document.getElementById("number1").value;
    const number2 = document.getElementById("number2").value;
    let result = document.getElementById("result");
    let inputs = document.getElementsByName("operation");

    for (let i in inputs) {
        if (inputs[i].value == "/" && inputs[i].checked && number2 == 0) {
            alert("Number cannot be divided by zero");
            result.value = "";
        }
        else if (inputs[i].checked) {
            result.value = eval(number1 + inputs[i].value + number2);
            // making AJAX request to localhost:3000/add/:number
            var xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function () {
                if (this.readyState == 4 && this.status == 200) {
                    console.log('Success');
                }
            };
            var url = "add/" + eval(number1 + inputs[i].value + number2);
            xhttp.open("GET", url, true);
            xhttp.send();
        }
    }

    displayResults();
}

function displayResults() {
    let arrayResults = null;

    // making AJAX request to localhost:3000/view
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var json = JSON.parse(this.responseText);
            arrayResults = json.arr;

            if (arrayResults == null) {
                arrayResults = [];
            }

            let list = document.getElementById("list-of-results");
            document.getElementById("list-of-results").innerHTML = '';
            for (let i = 0; i < arrayResults.length; i++) {
                let createdLi = document.createElement("li");
                createdLi.innerText = arrayResults[i];
                list.appendChild(createdLi);
            }

            // resetting controls after displaying successfully.
            document.getElementById("number1").value = 0;
            document.getElementById("number2").value = 0;
            document.getElementById("result").value = 0;
        }
    };
    xhttp.open("GET", "view", true);
    xhttp.send();
}

displayResults();
