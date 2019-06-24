# apartir do package app faça:
# importe a variável app definida dentro do módulo app
from app import app
from flask import render_template,request
import numpy as np
from numpy import array, zeros, diag, diagflat, dot, max
import pprint
import scipy
import scipy.linalg
# abaixo temos um decorator e serve ele para dizer aplicar uma função encima de outra


@app.route("/")
def index():
    return render_template('index.html')

@app.route("/choleskyAndSylvester")
def method1():
    return render_template('home.html')


@app.route("/", methods=['GET', 'POST'])
def calculus():
    t = True
    # A = [[16, -4, 12, -4], [-4, 2, -1, 1], [12, -1, 14, -2], [-4, 1, -2, 83]]

    if request.method == "POST":
        name = request.form["dimension"]
        y = name.split(",")
        n = int(y[0][0])  
        nInteger = int(y[0][1])
        print()
        print()
        print()
        print()
        print()
        print(nInteger)
        # print(int(y[1]))

        Matrix = [[0 for i in range(nInteger)] for j in range(nInteger)] 
        count = 1   

        for i in range (0,nInteger):
            for j in range (0,nInteger):
                Matrix[i][j] = int(y[count])
                count += 1
        retorno2 = ""
        # print(Matrix)
        # Sylvester's criterian
        if(n == 1):
            t = np.all(np.linalg.eigvals(Matrix) > 0)
            t2 = symmetric(Matrix)
            t = t and t2
            print(t)
            # chol_A = np.linalg.cholesky(Matrix)
            # print (chol_A)
            retorno = str(t) + ""
            return retorno
        else:
            chol_A = np.linalg.cholesky(Matrix)
            for i in range (0,nInteger):
                for j in range (0,nInteger):
                   retorno2 += str(chol_A[i][j]) + ","
            print(retorno2)
            return retorno2

def symmetric(master):
    master_count = len(master)

    if not master: # checks to see if the list is empty
        return True

    if master_count != len(master[0]): #check to make sure the list is a square
        return False
    i = 0
    while i < master_count:
        j = 0
        while j < master_count:
            # print (str(master[i][j]) +" "+str(master[j][i]))
            if master[i][j] != master[j][i]:
                return False
            j = j + 1 # close the loop
        i = i + 1 # close the loop
    return True

@app.route('/gausElimination')
def method3():
    return render_template('gaus.html')

@app.route("/gausElimination", methods=['GET', 'POST'])
def calculus3():
    if request.method == "POST":
        name = request.form["dimension"]
        # print (name)
        y = name.split(",")
        # matrix's dimenssion 
        n = int(y[0][0])
        # print (n)
        count = 1
        # create a matrix with zeros elements
        Matrix2 = scipy.zeros((n,n), int)
        # atribute each elements received from javaScript to matrix2 witch type is scipy:
        for i in range (0,n):
            for j in range (0,n):
                Matrix2[i][j] = y[count]
                count += 1
        # receiving the elements from L and U to the matrix2
        P, L, U = scipy.linalg.lu(Matrix2)
        # convert each element to string
        # matrix L are retorno and matrix U are retorno2
        retorno = str(L[0][0]) + ""
        retorno2 = str(U[0][0]) + ""
        # convert each element of L and U to string:
        for i in range (0,n):
            for j in range (0,n):
                if(i != 0 or j != 0):
                    retorno += "," + str(L[i][j])
                    retorno2 += "," + str(U[i][j])
        # return the elements of the matrixes together following the structure bellow: MatrixL#MatrixU
        retorno_total = retorno + "#" + retorno2


    return retorno_total

# jacobi
@app.route('/jacobi')
def jacobi():
    return render_template('jacobi.html')

@app.route("/jacobi", methods=['GET', 'POST'])
def calculusJacobi():
    if request.method == "POST":
        name = request.form["dimension"]
        y = name.split(",")
        y = name.split(",")
        # (op)type of calculus:
        # 1 - Diagonally Dominant:
        # 2 - Jacob Method:
        op = int(y[0])
        # matrix's dimension
        m = int(y[1])
        print(op)
        A = [[0 for i in range(m)] for j in range(m)]
        count = 2
        for i in range (0,m):
            for j in range (0,m):
                A[i][j] = float(y[count])
                count += 1
        if op==1:
            #print("Opcao 1 selecionada...")
            #método 1-----------
            retorno = (lineCriterion(A))
            print(retorno)
            #-------------------
        elif op==2:
            b = [0 for i in range(m)]
            x = [0 for i in range(m)]
            for i in range (0,m):
                b[i] = float(y[count])
                # print(b[i])
                count += 1
            for i in range (0,m):
                x[i] = float(y[count])
                # print(x[i])
                count += 1
            n = int(y[count])
            retorno = sol_jacobi(A, b, n, x)
    return retorno

def canonicalBasis(n):
    base = zeros(n)
    for i in range(0, n):
        base[i] = 1
    return base

def lineCriterion(A):
    D = diag(A)
    R = A - diagflat(D)
    base = canonicalBasis(len(A[0])) 
    x = dot(R,base)/D 
    value = x.max()
    if(value < 1):
        return "1"
    else:
        return "0"
    
def sol_jacobi(A, b, n, x):
    """Solves the equation Ax=b via the Jacobi iterative method."""
    # Create an initial guess if needed                                                                                                                                                            
    if x is None:
        x = zeros(len(A[0]))
    
    # Create a vector of the diagonal elements of A                                                                                                                                                
    # and subtract them from A                                                                                                                                                                     
    D = np.diag(A)
    R = A - np.diagflat(D)
    
    # Iterate for N times                                                                                                                                                                          
    for i in range(n):
        tmp = x
        x = (b - np.dot(R,x)) / D
        error = np.amax(np.absolute(x - tmp)) / np.amax(np.absolute(x))     #erro em cada iteração
    
    x_f = ""
    current = 0
    while current < len(x):
        x_f += str(x[current])
        current += 1
        if (current < len(x)):
            x_f += ";"
    
    #print str(x_f) + "#" + str(error)
    return str(x_f) + "#" + str(error)