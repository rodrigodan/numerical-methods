send.onclick = GetingMatrixData; //call getingMatrixData through send click event
var A = new Array();
var X = new Array();
var B = new Array();

function GetingMatrixData(){

    var n = document.getElementById("dimension"); //Matrix'sdimension
    var e = document.getElementById("elements"); //Matrix's elements separeted by ,
    var b = document.getElementById("vetorB"); 
    var vx = document.getElementById("vetorX"); 
    var qn = document.getElementById("interection_number"); 
    
    var nInteger =  parseInt(n.value);// string to int (matrix's dimension)
    var qnInteger =  parseInt(qn.value);// string to int (matrix's dimension)

    var dividir = divideElements(e); // return an array for each element
    var dividir2 = divideElements(vx); // return an array for each element
    var dividir3 = divideElements(b); // return an array for each element
    populateElement(nInteger,dividir,dividir2,dividir3); //include elements in the matrix 
    // the algorithm will calculate something <=> a condition being satisfied(Sylvester's criterion is one of them):
    if(defineCondition(n,nInteger,dividir,qnInteger) == 1){
        createTable(nInteger, "Matrix A"); //create a new table, imput the matrix A with its data already ploted and place in html file  
        // alert("Error");  
        // return 0;
        // CalculaCholesky(n);//calculate cholesky matrix through a developed server in flask using http request
    }
    
};

function divideElements(e){
    
    var e2 = e.value; //matrix'elements with , (eg.: 1,2,3,...)

    return (e2.split(',')); //divide elements from , and is atrubuted for an array of these separeted elements

}

function populateElement(nInteger, dividir,dividir2,dividir3){
    //populate each element in a bi-dimesional array
    k = 0;
    for (i=0;i<nInteger;i++) {
        A[i] = new Array(); // each array's element is set with a new array
        for (j=0 ; j<nInteger; j++) {
            A[i][j]= dividir[k];
            k = k + 1;
        }

        X[i] = dividir2[i];
        B[i] = dividir3[i];

    }
}

function defineCondition(nnn,nInteger,dividir,qnInteger){

    if(2 <= nInteger && nInteger <= 8 && dividir.length == nInteger*nInteger){
        var req = new XMLHttpRequest();
    
        var resultado = document.getElementById('line-criteria');

        req.onreadystatechange = function(){
            if(this.readyState == 4 && this.status == 200) {
                criteria = this.responseText.split("#");  
                // alert(criteria);
                if(criteria == "0"){
                    
                    document.getElementById("line-criteria").innerHTML = "";
                    document.getElementById("tables4").innerHTML = "";
                    
                    document.getElementById("line-criteria_cont").innerHTML = "";
                    document.getElementById('system_solution').innerHTML = "";
                    document.getElementById('Erro').innerHTML = "";
                    alert("The line's criterion WAS NOT satisfied, thus, there is no guarantee of convergence");
                    document.getElementById("line-criteria").innerHTML = "The line's criterion WAS NOT satisfied, thus, there is no guarantee of convergence";
                    return 0;

                }
                if(criteria == "1"){
                    
                    resultado.innerHTML = "<br><br>" + "The line criterion was satisfied, thus, the matrix A is a diagonally dominant matrix, because:" + "<br><br>"; 
        
                    for(i = 0; i < nInteger; i++){
                        for(j = 0; j < nInteger; j++){
                            if(i != j){

                                if(j == nInteger-1 || ( (i == nInteger -1) && (j == nInteger - 2))){

                                    resultado.innerHTML += A[i][j];
                                }
                                else{

                                    resultado.innerHTML += A[i][j] + " + ";

                                }

                            }
                        }
                        resultado.innerHTML += " < " + A[i][i] + "<br>";
                        
                    }

                    resultado2 = document.getElementById('line-criteria_cont');
                       
                    resultado2.innerHTML = "<br><br><br>";
                    resultado2.innerHTML += "Where the elements: ";

                    for(i = 0; i < nInteger; i++){
                        for(j = 0; j < nInteger; j++){
                            if(i == j){
                                resultado2.innerHTML += A[i][j] + ","; 
                            }
                        }
                    }
                    resultado2.innerHTML += " are elements from the main diagonal of the Matrix A.";
                    resultado2.innerHTML += "And now, we can apply the Jacobi method to find out an approximate root solution of the system to the aproximate values:";
                    resultado2.innerHTML += "<br>";
                    resultado2.innerHTML += " <b>[</b> ";
                    for(i = 0; i < nInteger; i++){
                        resultado2.innerHTML += "<b>" + X[i] + "," + "</b>";
                    }
                    resultado2.innerHTML += "<b> ].</b>";
                    resultado2.innerHTML += "<br>";

                    calculateJacobiAndErrorAproximate(nInteger,qnInteger);
                    

                    // resultado.innerHTML +=  "<b>" + "k = " + "</b>";
                    // for(i = 1; i < nInteger + 1; i++){
                    //     resultado.innerHTML += "<b>" + i + ", " + "</b>"; 
                    // }
                    // resultado.innerHTML += "<br><br>" + "Where Ak is a set of " + nInteger + " matrix that you can see in the " +  "section 1.0 bellow:"; 





                    // var matrices = document.getElementById('matrices');
                    // matrices.innerHTML = "";
                    // for(z = 1; z < nInteger + 1; z++){
                    //     var span_content = document.createElement("SPAN"); 
                    //     var matrix2 = document.createElement('table');
                    //     for(i = 0; i < z; i++){
                    //         var tr2 = document.createElement('tr');   
                    //         for(j = 0; j < z; j++){
                    //             var td2 = document.createElement('td');
                    //             var text2 = document.createTextNode(A[i][j]+"");

                    //             td2.appendChild(text2);
                    //             tr2.appendChild(td2);
                    //         }
                    //         matrix2.appendChild(tr2);
                    //     }

                    //     span_content.appendChild(matrix2);
                    //     span_content.setAttribute("style", "display: inline-block; margin-left:15px;");
                        
                    //     matrices.appendChild(span_content);
                    // }

                    // matrices.innerHTML += "<br>" + "<b>" + "section 1.0" + "<b>" + "<br>";
                    // CalculaCholesky(nnn);
                    
                }

                // else{
                    
                //     document.getElementById("InfoMatrixG").innerHTML = "";
                //     document.getElementById("MatrixG").innerHTML = "";
                    
                //     document.getElementById("tables3").innerHTML = "";
                //     document.getElementById('tables4').innerHTML = "";
                //     document.getElementById('matrices').innerHTML = "";
                //     alert("The Sylvester's criterion WAS NOT satisfied, then, the matrix is not a positive definite Matrix");
                //     return 0;

                // }
                
            }

            else{

            }
        }
        req.open('POST', '/jacobi', true);

        req.setRequestHeader('content-type', 'application/x-www-form-urlencoded;charset=UTF-8');


        req.send("dimension=" + "1" +","+ nInteger + "," + A + "");
        return 1;
    }

    else{
        
        // document.getElementById("tables2").innerHTML = "";
        // document.getElementById("tables3").innerHTML = "";
        // document.getElementById("tables4").innerHTML = "";
        
        // document.getElementById("matrices").innerHTML = "";
        // document.getElementById("InfoMatrixGPrevious").innerHTML = "";
        // document.getElementById("MatrixG").innerHTML = "";

        alert("Your values are not valid. Please, insert a dimension in a range: 2 and 8 and with a quantity dimension x dimension of Matrix coordinates");
        return 0;
    }
}

function calculateJacobiAndErrorAproximate(nInteger,qnInteger){
    // alert("aqui");
    var req4 = new XMLHttpRequest();
    var resultado2 = document.getElementById('system_solution');
    req4.onreadystatechange = function(){
        if(this.readyState == 4 && this.status == 200) {
            aproximacao = this.responseText.split("#");
            resultado2.innerHTML = "After " + qnInteger + " interaction, the result aproximate solution is: " + "[ " + aproximacao[0] + " ] and the error was equals to " + aproximacao[1]; 
            // alert(criteria);
        }
        
    }

    req4.open('POST', '/jacobi', true);

    req4.setRequestHeader('content-type', 'application/x-www-form-urlencoded;charset=UTF-8');


    req4.send("dimension=" + "2" +","+ nInteger + "," + A + "," + B + "," + X + "," + qnInteger);
    return 1;
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
    
    var resultado = document.getElementById('result');

    req.onreadystatechange = function(){

          if(this.readyState == 4 && this.status == 200) {

            retornado = this.responseText.split("#");
            
            retornado = LLUU[0].split(",");
        
            var G = new Array();
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
            var table_new = document.createElement('table');
            var table_new2 = document.createElement('table');
            var tables_3 = document.getElementById("tables3");
            var tables_4 = document.getElementById("tables4");

            tables_3.innerHTML = "<b>" + "Matrix L:" + "</b>" + "<br><br>";
            tables_4.innerHTML = "<b>" + "Matrix u:" + "</b>" + "<br><br>";
    
            for (var i = 0; i < mnnm; i++){
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
                table_new.appendChild(tr_2);
                table_new2.appendChild(tr_3);

            }     
            tables_3.appendChild(table_new);       
            tables_4.appendChild(table_new2);       
            // result.innerHTML = this.responseText;

          } else {

            // result.innerHTML = "処理中...";

          }

        }

        // var y = document.getElementById('dimension');
        mnnm = parseInt(n.value);
        // alert(mnnm);
        req.open('POST', '/', true);

        req.setRequestHeader('content-type', 'application/x-www-form-urlencoded;charset=UTF-8');


        req.send("dimension=" + mnnm + "," + A + "");
};


function CalculaCholesky(m){
    n = parseInt(m.value);
    var req3 = new XMLHttpRequest();
    // alert(n);
    // var resultado3 = document.getElementById('result');
    req3.onreadystatechange = function(){
        if(this.readyState == 4 && this.status == 200) {
            
            retornado = this.responseText.split(","); 
            
            // alert(retornado);
            
            var G = new Array();

            contador = 0;

            for (indice=0;indice<n;indice++) {
                G[indice] = new Array();
                for (jindice=0;jindice<n;jindice++) {
                    G[indice][jindice] = parseInt(retornado[contador]);
                    // alert(G[indice][jindice]);
                    contador += 1;
                }
            }
            var table_new4 = document.createElement('table');
            var G_Espace = document.getElementById("MatrixG");
            G_Espace.innerHTML = "<b>" + "Matrix G:" + "</b>" + "<br><br>";

            for (i = 0; i < n; i++){
                var tr_4 = document.createElement('tr');
                for (j = 0; j < n; j++){
                        var td_4 = document.createElement('td');
                        // alert(G[i][j]);
                        var text_4 = document.createTextNode(G[i][j]+"");
                        td_4.appendChild(text_4);
                        tr_4.appendChild(td_4);
                }
                table_new4.appendChild(tr_4);
            }

            G_Espace.appendChild(table_new4);

            document.getElementById("InfoMatrixGPrevious").innerHTML = "<br><br>" + "Thus, like the Sylvester's criterion worked, then, there is a theorem that say that exist an unique G(called cholesky's factor) where A = GG−T."; 
            document.getElementById("InfoMatrixGPrevious").innerHTML += "<br>";
            document.getElementById("InfoMatrixGPrevious").innerHTML += "Where G, can be seen in the matrix G in the right side bellow.";
            // resultado3.innerHTML = "dgkdk";
            // var table_new = document.createElement('table');

        }

        else{

        }
    }
    req3.open('POST', '/', true);

    req3.setRequestHeader('content-type', 'application/x-www-form-urlencoded;charset=UTF-8');

    req3.send("dimension=" + "2" + n + "," + A + "");

    
            // var info_2 = getElementById('InfoMatrixG');
            // info_2.innerHTML = "";
            
            // content_5 = getElementById("InfoMatrixG");
            
            // info_2.innerHTML = "<br><br>" + "Then, like the Sylvester's criterion worked, then, there is a theorem that say that exist an unique G where A = GG−T";

};