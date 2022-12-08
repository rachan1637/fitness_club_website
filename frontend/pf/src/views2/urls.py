from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import TokenObtainPairView
from Studios import urls as Studio_urls
from .views import (
    StudioListApiView, 
    StudioProfileApiView, 
    CreateSpecificLocation,
    UpdateSpecificLocation,
    ClassListView,
    EnrollmentView,
    DropView, 
    EnrollmentCourseView,
    DropDateListView,
    DropCourseView,
    EnrollmentListView, 
    HistoryListView, 
    filterDateView, 
    filterTimeRangeView,
    StudioSearchListApiView,
    StudioListALLApiView,
    ClassListAllView,
)
urlpatterns = [
    path('create_location/', CreateSpecificLocation.as_view()),
    path('update_location/', UpdateSpecificLocation.as_view()),
    path('list_studios/', StudioListApiView.as_view()),
    path('list_all_studios/', StudioListALLApiView.as_view()),
    path('view_studio/<int:pk>/', StudioProfileApiView.as_view()),
    # path('images', ImageListView.as_view()),
    # path('images/(?P<pk>\d+)/$', ImageEditView.as_view()),
    path('list_classes/studio/<int:pk>/', ClassListView.as_view()),
    path('enroll_classdate/', EnrollmentView.as_view()),
    path('enroll_class/', EnrollmentCourseView.as_view()),
    path('list_enrolled_classdate/', EnrollmentListView.as_view()),
    path('drop_classdate/', DropView.as_view()),
    path('drop_class/', DropCourseView.as_view()),
    # path('list_dropped_classdate/', DropDateListView.as_view()),
    path('history/', HistoryListView.as_view()),
    path('list_studios_search/', StudioSearchListApiView.as_view()),
    path('list_classes/studio/<int:pk>/search_date/<str:filterDate>/', filterDateView.as_view()),
    path('list_classes/studio/<int:pk>/search_time/<str:filterstart>/<str:filterend>/',filterTimeRangeView.as_view()),
    path('list_all_classes/studio/<int:pk>/', ClassListAllView.as_view()),
    
]
