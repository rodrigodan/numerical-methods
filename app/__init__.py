# da biblioteca flask, importe a classe Flask
from flask import Flask
from flask import render_template

# instancia da classe Flask
# ele precisa de uma variável especial chamado __name__
# especifica por meio do __name__ qual é o arquivo que estou executando
# o app controla a aplicação inteira
app = Flask(__name__)
app.config.from_object('config')

from app.controllers import default


