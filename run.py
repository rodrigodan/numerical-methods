from app import app
# verifico se o user está executando o meu arquivo principal
if __name__ == "__main__":
    # em outras palavras, só dará um run, se ele estiver pronto
    app.run(debug=True) 