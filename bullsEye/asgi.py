"""
ASGI config for bullsEye project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/5.0/howto/deployment/asgi/
"""

import os
from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack
from django.urls import path
from bullsEye.consumers import YourConsumer

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'bullsEye.settings')

application = ProtocolTypeRouter({
    "http": get_asgi_application(),
    "websocket": AuthMiddlewareStack(
        URLRouter([
            path("ws/kline/", YourConsumer.as_asgi()),  # Adjust the path and consumer class as needed
        ])
    ),
})
