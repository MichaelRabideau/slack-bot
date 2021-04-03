import logging
import functools
import flask
import jwt

from bot import config

logger = logging.getLogger(__name__)

jwks_client = jwt.PyJWKClient(config.JWKS_URL)


def verify(token):
    signing_key = jwks_client.get_signing_key_from_jwt(token)
    data = jwt.decode(
        token,
        signing_key.key,
        algorithms=["RS256"],
        audience=config.JWT_AUDIENCE
    )
    return data


def check_team(data):
    sub = data['sub']
    uid_tid = sub.split('|')[-1]
    tid = uid_tid.split('-')[0]
    return tid == config.ALLOWED_TEAM


def authorize(f):
    @functools.wraps(f)
    def decorated_function(*args, **kwargs):
        hdr = flask.request.headers.get('authorization')
        part = hdr.split(' ')
        decoded = {}
        if len(part) != 2 or part[0] != 'Bearer':
            return {'message': 'Not authenticated'}, 401
        try:
            decoded = verify(part[1])
            if check_team(decoded):
                kwargs['user'] = decoded
            else:
                logger.warning('team not allowed %s', decoded)
                return {'message': 'Not authorized'}, 403
        except Exception as e:
            print(e)
            return {'message': 'Not authenticated'}, 401
        return f(*args, **kwargs)
    return decorated_function
