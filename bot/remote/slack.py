import logging

import requests

from bot.config import SLACK_TOKEN

logger = logging.getLogger(__name__)

users = {}


def get_username_from_id(uid):
    if uid not in users:
        u = get_user(uid)
        if u:
            users[uid] = u
    u = users.get(uid)
    if u:
        return u.get('profile', {}).get('display_name')
    return ''


def get_user(user_id):
    headers = {
        'content-type': 'application/x-www-form-urlencoded',
    }
    payload = {
        "token": SLACK_TOKEN,
        "user": user_id.upper(),
    }
    r = requests.post(
        'https://slack.com/api/users.info',
        headers=headers,
        data=payload,
    )
    logger.info("fetched user info %s", r.json())
    return r.json().get("user")
