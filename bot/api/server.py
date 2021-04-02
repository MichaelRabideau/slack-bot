from flask_api import FlaskAPI

from bot import config

app = FlaskAPI(__name__)


def run():
    app.run(debug=False, host='0.0.0.0', port=config.PORT)


@app.route('/hello')
def hello_world():
    return {'message': 'Hello, World!'}
