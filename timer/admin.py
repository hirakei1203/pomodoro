from django.contrib import admin

from .models import User, Setlist, Record

admin.site.register(User)
admin.site.register(Setlist)
admin.site.register(Record)
# Register your models here.
