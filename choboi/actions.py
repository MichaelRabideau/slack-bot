# -*- coding: utf-8 -*-
import random

cucks = {}


def print_help(*args, **kwargs):
    commands = """
    Here are phrases I understand:

        herro
        is <name> a cuck?
        who is a cuck?
    """
    return commands


def herro(*args, **kwargs):
    return "parese"


def is_a_cuck(*args, **kwargs):
    name = args[0].lower()
    if name not in cucks:
        cucks[name] = 'Yes' if random.randint(0, 1) else 'No'
    return cucks[name]


def who_is_a_cuck(*args, **kwargs):
    return ", ".join(
        [name for name, is_a_cuck in cucks.items() if is_a_cuck == 'Yes']
    )
