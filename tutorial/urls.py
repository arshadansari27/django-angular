from django.conf.urls import url, include
from rest_framework import routers
from tutorial.quickstart import views
from django.views.generic.base import RedirectView



router = routers.DefaultRouter()
router.register(r'users', views.UserViewSet)
router.register(r'groups', views.GroupViewSet)

# Wire up our API using automatic URL routing.
# Additionally, we include login URLs for the browsable API.
urlpatterns = [
    url(r'^api/v1/', include(router.urls)),
    url(r'^auth/', include('djoser.urls.authtoken')),
    url(r'^$', RedirectView.as_view(url="/app/index.html")),
]

# url(r'^api-auth/',
#   include('rest_framework.urls', namespace='rest_framework')),
