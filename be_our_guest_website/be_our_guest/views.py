"""
The views for the be_our_guest app.
"""
from django.http import HttpResponse


def index(_) -> HttpResponse:
    """The index view of the website.

    Args:
        _ (request): The request object.

    Returns:
        HttpResponse: The response object.
    """
    return HttpResponse("Hello, world. You're at the Be our guest index.")
