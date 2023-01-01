# from django.contrib import admin
# from .models import Studio
# # , ImageAttachment

# # Register your models here.
# admin.site.register(Studio)
# # admin.site.register(ImageAttachment)






from django.contrib import admin
from .models import Studio, ImageAttachment, Amenitie,Location, Aname, Course,ClassDate, Enroll, Drop, className, coachName, CourseKeyWord


# Register your models here.
# admin.site.register(Studio)
# admin.site.register(ImageAttachment)
class StudioImageAdmin(admin.StackedInline):
    model = ImageAttachment
    
# class StudioAmenitieAdmin(admin.StackedInline):
#     model = Amenitie



@admin.register(Studio)
class StudioAdmin(admin.ModelAdmin):
    list_display = ['name']
    inlines = [StudioImageAdmin]

# @admin.register(ImageAttachment)
# class StudioFileAdmin(admin.ModelAdmin):
#     pass

@admin.register(Amenitie)
class AmenitieAdmin(admin.ModelAdmin):
    list_display = ['type']
# admin.site.register(Amenitie)

admin.site.register(Location)

# @admin.register(Aname)
# class AnameAdmin(admin.ModelAdmin):
#     list_display = ['Amname']
# admin.site.register(Aname)

@admin.register(Course)
class CourseAdmin(admin.ModelAdmin):
    list_display = ['name']
    def save_related(self, request, form, formsets, change):
        super().save_related(request, form, formsets, change)
        # form.instance.permissions.add(request.user)
        
# admin.site.register(Course)

    
# @admin.register(className)
# class classNameAdmin(admin.ModelAdmin):
#     list_display = ['classNames']

@admin.register(ClassDate)
class ClassDateAdmin(admin.ModelAdmin):
    pass

# admin.site.register(ClassDate)

# @admin.register(coachName)
# class coachNameAdmin(admin.ModelAdmin):
#     list_display = ['coachNames']


# admin.site.register(Enroll)

# admin.site.register(calendarDate)

# @admin.register(calendarDate)
# class calendarAdmin(admin.ModelAdmin):
#     list_display = ['cDate']
# @admin.register(Enroll)
# class EnrollAdmin(admin.ModelAdmin):
#     # filter_horizontal = ('enrollDate',)
#     pass
# @admin.register(timeRange)
# class timeRangeAdmin(admin.ModelAdmin):
#     list_display = []


# admin.site.register(timeRange)
    
# class coachNameAdmin(admin.ModelAdmin):
#     list_display = ['cDate']

# admin.site.register(Drop)
admin.site.register(CourseKeyWord)
admin.site.register(Enroll)
admin.site.register(Drop)