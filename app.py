"""Flask app for Cupcakes"""

from flask import Flask, request, render_template, redirect, flash, jsonify
from flask_debugtoolbar import DebugToolbarExtension
from models import db, connect_db, Cupcake

app = Flask(__name__)

app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql:///cupcakes'

app.app_context().push()

app.config['SQLALCHEMY_TRACK_MODIFCATIONS'] = False
app.config['SECRET_KEY'] = 'oh-so-secret'

connect_db(app)


@app.route('/')
def index_page():
    cupcakes = Cupcake.query.all()
    return render_template('index.html', cupcakes=cupcakes)

@app.route('/api/cupcakes')
def view_cupcakes():
    all_cupcakes = [cupcake.serialize() for cupcake in Cupcake.query.all()]
    return jsonify(cupcakes=all_cupcakes)

@app.route('/api/cupcakes/<int:id>')
def view_cupcake(id):
    cupcake = (Cupcake.query.get_or_404(id)).serialize()
    return jsonify(cupcake=cupcake)

@app.route('/api/cupcakes', methods=['POST'])
def add_cupcake():
    cupcake = Cupcake(flavor = request.json['flavor'],
                      size = request.json['size'],
                      rating = request.json['rating'])
    db.session.add(cupcake)
    db.session.commit()
    json_cupcake = jsonify(cupcake=cupcake.serialize())
    return (json_cupcake, 201)

@app.route('/api/cupcakes/<int:id>', methods=['PATCH'])
def update_cupcake(id):
    cupcake = Cupcake.query.get_or_404(id)
    cupcake.flavor = request.json.get('flavor', cupcake.flavor)
    cupcake.size = request.json.get('size', cupcake.size)
    cupcake.rating = request.json.get('rating', cupcake.rating)
    cupcake.image = request.json.get('image', cupcake.image)
    db.session.commit()
    return jsonify(cupcake=cupcake.serialize())

@app.route('/api/cupcakes/<int:id>', methods=['DELETE'])
def delete_cupcake(id):
    cupcake = Cupcake.query.get_or_404(id)
    db.session.delete(cupcake)
    db.session.commit()
    return jsonify(msg='deleted')