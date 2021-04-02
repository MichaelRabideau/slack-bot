import markovify

from .data import data

_model = None
def get_model():
    global _model
    if _model:
        return _model
    _model = Model(data)
    return _model


# TODO: load from db
class Model:
    def __init__(self, text):
        self.text_model = markovify.Text(text).compile()

    def generate_response(self):
        return self.text_model.make_short_sentence(50)
