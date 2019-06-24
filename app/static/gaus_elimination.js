send.onclick = GetingMatrixData; //call getingMatrixData through send click event

var A = new Array();

function GetingMatrixData(){

    var n = document.getElementById("dimension"); //Matrix'sdimension
    var e = document.getElementById("elements"); //Matrix's elements separeted by ,
    var nInteger =  parseInt(n.value);// string to int (matrix's dimension)

    var dividir = divideElements(e); // return an array for each element
    populateElement(nInteger,dividir); //include elements in the matrix 
    // the algorithm will calculate something <=> a condition being satisfied:
    if(defineCondition(nInteger,dividir) == 1){
        // the calculus will work only if the condition be satisfied
        createTable(nInteger, "Matrix A"); //create a new table, imput the matrix A with its data already ploted and place in html file    
        CalculateLUMatrix(n); //calculate L and U matrix through a developed server in flask using http request
    }
};

function divideElements(e){
    
    var e2 = e.value; //matrix'elements with , (eg.: 1,2,3,...)

    return (e2.split(',')); //divide elements from , and is atrubuted for an array of these separeted elements

}

function populateElement(nInteger, dividir){
    //populate each element in a bi-dimesional array
    k = 0;
    for (i=0;i<nInteger;i++) {
        A[i] = new Array(); // each array's element is set with a new array
        for (j=0 ; j<nInteger; j++) {
            A[i][j]= dividir[k];
            k = k + 1;
        }
    }
}

function defineCondition(nInteger,dividir){
    if(2 <= nInteger && nInteger <= 8 && dividir.length == nInteger*nInteger){
        return 1;
    }
    else{
        
        document.getElementById("tables2").innerHTML = "";
        document.getElementById("tables3").innerHTML = "";
        document.getElementById("tables4").innerHTML = "";

        alert("Your values are not valid. Please, insert a dimension in a range: 2 and 8 and with a quantity dimension x dimension of Matrix coordinates");
        return 0;
    }
}

function createTable(nInteger, tableName){

    //1 header
    var table = document.createElement('table'); //create a tag called table
    
    // identifing tag table2 in html where there is an id: table2(space where the Matrix A will being ploted:)
    var tables2 = document.getElementById("tables2");
    
    //populate tables2 tag with the contents bellow(title):
    createTableTitle(tables2, tableName);
 
    // 2 Body
    // drawing lines and colums to table2
    for (var i = 0; i < nInteger; i++){
        var tr = document.createElement('tr');   
        for (var j = 0; j < nInteger; j++){

            var td = document.createElement('td');
        
            var text = document.createTextNode(A[i][j]+"");
        
            td.appendChild(text);
            tr.appendChild(td);

        }
        table.appendChild(tr);
    }

    tables2.appendChild(table);
};

function createTableTitle(tables2, tableName){
    tables2.innerHTML = "";
    tables2.innerHTML += "<b>" + tableName + ":</b>" + "<br><br>";

}

function CalculateLUMatrix(n){

    // req receive an HTTPRequest
    var req = new XMLHttpRequest();
    // trash
    var resultado = document.getElementById('result');

    // what to do when i receive data back from python:
    req.onreadystatechange = function(){

          if(this.readyState == 4 && this.status == 200) {
            // array where LLUU[0] is l11,l12,...(L elements) and LLUU[1] is u11,u12,... (U elements)
            LLUU = this.responseText.split("#");
            // each L and U element has to be separeted in a big array with their elements
            L = LLUU[0].split(",");
            U = LLUU[1].split(",");
            // bi-dimensional arrays used to receive the elements of L and U respectively:
            var L_power = new Array();
            var U_power = new Array();
            //contador is a count to go across the array elements to atribute elements of L and U elements respectively: 
            contador = 0;
            for (indice=0;indice<mnnm;indice++) {
                    L_power[indice] = new Array();
                    U_power[indice] = new Array();
                for (jindice=0;jindice<mnnm;jindice++) {
                    L_power[indice][jindice] = L[contador];
                    U_power[indice][jindice] = U[contador];
                    contador += 1;
                }
            } 

            // alert(L_power[0][1]); 
            // here we will create the tables tag to populate L and U elements:
            var table_new = document.createElement('table');
            var table_new2 = document.createElement('table');
            // get the div, where id is table3 and table4, because i will put our element from python there
            var tables_3 = document.getElementById("tables3");
            var tables_4 = document.getElementById("tables4");
            // Giving a name to the elements L and U to put in the html:
            tables_3.innerHTML = "<b>" + "Matrix L:" + "</b>" + "<br><br>";
            tables_4.innerHTML = "<b>" + "Matrix u:" + "</b>" + "<br><br>";
            // process to creat line and cell for each line to receive each L and U element
            for (var i = 0; i < mnnm; i++){
                // tr_2: lines to table L
                // tr_3: lines to table U
                var tr_2 = document.createElement('tr');
                var tr_3 = document.createElement('tr');
                   
                for (var j = 0; j < mnnm; j++){
        
                    var td_2 = document.createElement('td');
                    var td_3 = document.createElement('td');
                
                    var text_2 = document.createTextNode( L_power[i][j]+"");
                    var text_3 = document.createTextNode( U_power[i][j]+"");
                    // alert(L[i][j]);
                    td_2.appendChild(text_2);
                    td_3.appendChild(text_3);
                    tr_2.appendChild(td_2);
                    tr_3.appendChild(td_3);
                }
                // import each tr(line) with its cells to the apropriate table
                // table_new: matrix L
                // table_new2: matrix U 
                table_new.appendChild(tr_2);
                table_new2.appendChild(tr_3);

            }     

            // import tr_2 amd tr_3 elements in their respectively tables
            tables_3.appendChild(table_new);       
            tables_4.appendChild(table_new2);       
            // result.innerHTML = this.responseText;

          } else {

            // result.innerHTML = "処理中...";

          }

        }

        // var y = document.getElementById('dimension');
        mnnm = parseInt(n.value);
        // alert("mnnm");
        req.open('POST', '/gausElimination', true);

        req.setRequestHeader('content-type', 'application/x-www-form-urlencoded;charset=UTF-8');


        req.send("dimension=" + mnnm + "," + A + "");
};


