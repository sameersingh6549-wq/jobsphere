from django.urls import path
from jobs import views

urlpatterns = [
    path('', views.home, name='home'),
    path('postjob/', views.postjob, name='postjob'),
    path('job/',views.job, name='job'),
    path('edit_job/<int:id>/',views.edit_job, name='edit_job'),
    path('delete_job/<int:id>/',views.delete_job, name='delete_job'),
    path('application/<int:id>',views.application,name='application'),
    path('my_application/', views.my_applications, name='my_application'),
    path('applicants/<int:id>', views.applicants, name='applicants'),
    path('my_posted_jobs/', views.my_posted_jobs, name='my_posted_jobs'),
    path('dashboard/', views.dashboard, name='dashboard'),
]