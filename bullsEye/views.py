from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from django.views.decorators.cache import never_cache


def home(request):
    return render(request, 'landing.html')


@login_required
@never_cache 
def index(request):
    return render(request, 'index.html') 

@login_required
def order(request):
    return render(request, 'orders.html')