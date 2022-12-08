from django.db import models
from django.contrib.auth.models import User
from phone_field import PhoneField
from django.core.validators import RegexValidator
from django.conf import settings
from phonenumber_field.modelfields import PhoneNumberField
# from django.contrib.gis.db.models import PointField
# from django.contrib.gis.db.models.functions import GeometryDistance
# from django.contrib.gis.geos import Point
from location_field.models.plain import PlainLocationField
from math import sin, cos, sqrt, atan2, radians
from recurrence.fields import RecurrenceField
import datetime as dt
from django.core.exceptions import ValidationError
# Create your models here.

# def image_upload_location(instance,imagename):
#     # studio_name = instance.name.lower().replace(" ", "-")
#     image_name = imagename.lower().replace(" ", "-")
#     return settings.MEDIA_URL + "studios/{}".format(image_name)


# class Amenitie(models.Model):
#     # studio = models.ForeignKey(Studio, default=None, on_delete=models.CASCADE, related_name='studio_amenities', null = True)
#     type = models.CharField(max_length = 180)
#     quantity = models.PositiveIntegerField()
    
#     def _str_(self):
#         return self.type
class coachName(models.Model):
    coachNames = models.CharField(max_length = 180)
    def _str_(self):
        return self.Amname
    def save(self, *args, **kwargs):
        print(len(list(coachName.objects.filter(coachNames = self.coachNames))))
        if (len(list(coachName.objects.filter(coachNames = self.coachNames))) == 0):
            super().save(*args, **kwargs)
        else:
            pass

class className(models.Model):
    classNames = models.CharField(max_length = 180)
    def _str_(self):
        return self.Amname
    def save(self, *args, **kwargs):
        print(len(list(className.objects.filter(classNames = self.classNames))))
        if (len(list(className.objects.filter(classNames = self.classNames))) == 0):
            super().save(*args, **kwargs)
        else:
            pass
        
class Aname(models.Model):
    # studioID = models.PositiveIntegerField()
    Amname = models.CharField(max_length = 180)
    def _str_(self):
        return self.Amname
    def save(self, *args, **kwargs):
        print(len(list(Aname.objects.filter(Amname = self.Amname))))
        if (len(list(Aname.objects.filter(Amname = self.Amname))) == 0):
            super().save(*args, **kwargs)
        else:
            pass
        # temp2 = Studio.objects.filter(pk = self.studioID)
        # print(temp2[0])
        # temp2[0].amenities.add(self.id)


class Studio(models.Model):
    # def distances(self, studio):
    #     R = 6373.0
    #     temp = str(studio.geographical_location)
    #     x = temp.split(",")
    #     par1 = x[0]
    #     par2 = x[1]
    #     # ##############change here for specific location)################# #
    #     # lat1 = radians(43.6629)
    #     # lon1 = radians(-79.3957)
    #     Locationloc = str(Location.objects.filter()[0].get().location).split(',')
    #     print(Locationloc)
    #     LocationLat = Locationloc[0]
    #     LocationLon= Locationloc[1]
    #     lat1 = radians(float(LocationLat))
    #     lon1 = radians(float(LocationLon))

    #     lat2 = radians(float(par1))
    #     lon2 = radians(float(par2))

    #     dlon = lon2 - lon1
    #     dlat = lat2 - lat1
    #     a = (sin(dlat/2))**2 + cos(lat1) * cos(lat2) * (sin(dlon/2))**2
    #     c = 2 * atan2(sqrt(a), sqrt(1-a))
    #     distance = R * c

    #     # km to miles
    #     distance /= 1.609344

    #     return distance

    name = models.CharField(max_length = 180)
    address = models.CharField(max_length = 180)
    # geographical_location = models.CharField(max_length = 180)
    # geographical_location = PointField (null=False, blank=False, srid=4326,geography=True, verbose_name='Location')
    geographical_location = PlainLocationField(based_fields = ['address'], zoom = 7)

    postal_code = models.CharField(max_length=6, validators=[
        RegexValidator('^[A-Z]{1}[0-9]{1}[A-Z]{1}\s*[0-9]{1}[A-Z]{1}[0-9]{1}$', ('Invalid postal code'))
    ])
    # phone_number = PhoneField(blank = True)
    phone_number = PhoneNumberField()
    # images = models.ImageField (upload_to = 'studios', null = True, blank = True)
    # images = models.ManyToManyField(ImageAttachment)
    # distance = models.FloatField(editable= False)
    # amenities = models.ManyToManyField(Amenitie)
    amenities = models.ManyToManyField(Aname, blank = True, null = True, editable= False)
    classes = models.ManyToManyField(className, blank = True, null = True, editable= False)
    coaches = models.ManyToManyField(coachName, blank = True, null = True, editable=False)

    
    def _str_(self):
        return self.name.url
    # def save(self, *args, **kwargs):
    #     self.distance = self.distances(self)
        
    #     super().save(*args, **kwargs)

class ImageAttachment(models.Model):
    # def get_upload_path(instance, filename):
    #     return 'documents/{0}/{1}'.format(inshttp://127.0.0.1:8000/studios/user/drop_classftance.name, filename)
    studio = models.ForeignKey(Studio, default=None, on_delete=models.CASCADE, related_name='studio_images', null = True) # When a studio is deleted, upload models are also deleted
    # images = models.ImageField(upload_to=image_upload_location, null = True, blank = True)
    images = models.ImageField (upload_to = 'studios', null = True, blank = True)
    def _str_(self):
        return self.image.url

class Amenitie(models.Model):
    studio = models.ForeignKey(Studio, default=None, on_delete=models.CASCADE, related_name='studio_amenities', null = True)
    type = models.CharField(max_length = 180)
    quantity = models.PositiveIntegerField()
    
    def _str_(self):
        return self.type
    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        temp = Aname(Amname = self.type)
        temp.save()
        temp2 = Studio.objects.filter(pk = self.studio.id)
        a = Aname.objects.filter(Amname = self.type)
        temp2[0].amenities.add(a[0].id)

    
class Location(models.Model):
    location = PlainLocationField(zoom =7)
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="location")
    def _str_(self):
        return self.location
    
    
# class calendarDate(models.Model):
#     cDate = models.DateField()
#     def _str_(self):
#         return self.cDate
#     def save(self, *args, **kwargs):
#         print('len', len(list(calendarDate.objects.filter(cDate = self.cDate))))
#         print('calendarDate: self.cDate', self.cDate)
#         if (len(list(calendarDate.objects.filter(cDate = self.cDate))) == 0):
#             super().save(*args, **kwargs)
#         else:
#             pass
        
# class timeRange(models.Model):
#     # timeRangeS = models.TimeField()
#     # timeRangeE = models.TimeField()
#     timeRangeSE = models.CharField(max_length = 180)
#     def _str_(self):
#         return self.timeRangeSE
#     def save(self, *args, **kwargs):
#         print('len', len(list(timeRange.objects.filter(timeRangeSE = self.timeRangeSE))))
#         if (len(list(timeRange.objects.filter(timeRangeSE = self.timeRangeSE))) == 0):
#             super().save(*args, **kwargs)
#         else:
#             pass


class CourseKeyWord(models.Model):
    name = models.CharField(max_length= 180, null=False, blank=False)

        
    
class Course(models.Model): 
    name = models.CharField(max_length=200, null = False)
    description = models.CharField(max_length=200, null = False)
    coach = models.CharField(max_length=200, null = False)
    
    # KEYWORDS = [
    #     ('upper-body', 'upper-body'),
    #     ('core', 'core'),
    #     ('HIIT', 'HIIT')
    #     ]
    # start = models.TimeField()
    # end = models.TimeField()
    
    start_time = models.DateTimeField('start')
    end_time = models.DateTimeField('end')
    
    # interval = models.DateField(widget=AdminDateWidget)
    # start = models.TimeField()
    # end = models.TimeField()
    keywords = models.ManyToManyField(CourseKeyWord)
    capacity = models.PositiveIntegerField(null = False)
    times = RecurrenceField(null = True, blank = True,include_dtstart=True) 

    # user = models.ForeignKey(User, default=None, on_delete=models.CASCADE, related_name='studio_user', null = True) # When a studio is deleted, upload models are also deleted
    studio = models.ForeignKey(Studio, default=None, on_delete=models.CASCADE, related_name='studio_class', null = True) # When a studio is deleted, upload models are also deleted
    
    # calendarDate2 = models.ManyToManyField(calendarDate,blank = True, null = True)
    # trange = models.ManyToManyField(timeRange, blank = True, null = True)

    # def between(self):
    #     return self.times.between(self.start_time, self.end_time, dtstart=self.start_time, inc=True)
            
    def _str_(self):
        # start_time = self.start_time.strftime("%H:%M")
        # end_time = self.end_time.strftime("%H:%M")
        # return "{} ({} - {})".format(self.name, start_time, end_time)
        return self.name

    def delete(self, *args, **kwargs):
        for c in ClassDate.objects.filter(course_id=self.id):
            c.delete()
        
        super(Course, self).delete(*args, **kwargs)
    
    def save(self, *args, **kwargs):
        # super().save(*args, **kwargs)
        print('in save course: self.start_time', self.start_time)
        print('in save course: dt.datetime.now()', dt.datetime.now())
        print('in save course: self.start_time.replace(tzinfo=None)', self.start_time.replace(tzinfo=None))
        print('in save course: dt.datetime.now().replace(tzinfo=None)', dt.datetime.now().replace(tzinfo=None))
        
        
        
        if self.start_time.replace(tzinfo=None) < dt.datetime.now().replace(tzinfo=None): #if start_time < now, use now-until to compute occ
            # excl_list = list(self.times.between(dt.datetime.now().replace(tzinfo=None), self.times.exrules[0].until.replace(tzinfo=None))) 
            occ_list = list(self.times.between(dt.datetime.now().replace(tzinfo=None), self.times.rrules[0].until.replace(tzinfo=None))) 
        else:   #if start_time > now, use start_time-until to compute occ
            # excl_list = list(self.times.between(dt.datetime.now().replace(tzinfo=None), self.times.exrules[0].until.replace(tzinfo=None))) 
            occ_list = list(self.times.between(self.start_time.replace(tzinfo=None), self.times.rrules[0].until.replace(tzinfo=None)))       
        
        
        print('occ_list', list(occ_list))
        if len(list(occ_list)) > 0: # it has at least one future schedule
            self.start_time = dt.datetime.combine(occ_list[0].date(), self.start_time.time())
            self.end_time = dt.datetime.combine(occ_list[0].date(), self.end_time.time())
            
        super().save(*args, **kwargs)             
        print('after save self.start_time', self.start_time)
        
        # for each occ
        if len(ClassDate.objects.filter(course_id=self.id)) != 0:
            for c in ClassDate.objects.filter(course_id=self.id):
                # c.delete()
                c.studio_id = self.studio.id
                c.course_id = self.id
                c.date_start = dt.datetime.combine(c.date_start.date(), self.start_time.time())
                c.date_end = dt.datetime.combine(c.date_end.date(), self.end_time.time())
                c.capacity = self.capacity
                c.name = self.name
                c.coach = self.coach
                c.studio_name = self.studio.name
                c.save()
        else:
            for idx, occ in enumerate(occ_list):
                # Enrollment.objects.create(**validated_data)
                print('idx',idx, 'occ.date', occ.date())
                print('idx',idx, 'self.start_time.time()', self.start_time.time())
                print('idx',idx, 'dt.datetime.combine(occ.date(), self.start_time.time()', dt.datetime.combine(occ.date(), self.start_time.time()))
                cd= ClassDate(
                    studio_id = self.studio.id, 
                    course_id = self.id, 
                    date_start = dt.datetime.combine(occ.date(), self.start_time.time()),
                    date_end = dt.datetime.combine(occ.date(), self.end_time.time() ),
                    capacity = self.capacity,
                    name = self.name,
                    coach = self.coach,
                    studio_name = self.studio.name
                    )
                cd.save()
                
            
            
        temp = className(classNames = self.name)
        temp.save()
        test = coachName(coachNames = self.coach)
        test.save()
        
        temp2 = Studio.objects.filter(pk = self.studio.id)
        a = className.objects.filter(classNames = self.name)
        temp2[0].classes.add(a[0].id)
        b = coachName.objects.filter(coachNames = self.coach)
        temp2[0].coaches.add(b[0].id)
        
class ClassDate(models.Model):
    studio_id = models.PositiveIntegerField()
    course_id = models.PositiveIntegerField()
    date_start = models.DateTimeField()
    date_end = models.DateTimeField()
    capacity = models.PositiveIntegerField()
    current_enrolment = models.PositiveIntegerField(default=0)
    name = models.CharField(max_length=200, null = False)
    coach = models.CharField(max_length=200, null = False)
    studio_name = models.CharField(max_length=200, null = False)

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        
        # temp9 = calendarDate(cDate = self.date_start.date())
        # temp9.save()
        # temp29 = Course.objects.filter(pk = self.course_id)
    
        # aspecial = calendarDate.objects.filter(cDate = self.date_start.date())
        # # print('in ClassDate: self.date_start.date()',self.date_start.date())
        # # print('temp29', temp29)
        # # print('aspecial',aspecial)
        # # print('temp29[0].clendarDates', temp29[0].calendarDate2.all())
        # temp29[0].calendarDate2.add(aspecial[0].id)
        
        # if aspecial not in Course.objects.filter(pk = self.course_id)[0].calendarDate2.all():
        #     print('idkkkkkkkkkkkk')
        # print('!!!!', temp29[0].calendarDate2.all()) 
        
        # inputstr = self.date_start.replace(tzinfo=None).time().strftime("%H:%M:%S") + self.date_end.replace(tzinfo=None).time().strftime("%H:%M:%S")
        # temp10 = timeRange(timeRangeSE = inputstr)
        # temp10.save()
        # temp30 = Course.objects.filter(pk = self.course_id)
        # bspecial = timeRange.objects.get(timeRangeSE = inputstr)
        
        # print('bspecial', bspecial)
        # print('self.date_start.time()', self.date_start.time())
        # print('self.date_end.time()', self.date_end.time())
        # print('temp30[0].clendarDates', temp30[0].trange.all())
        # temp30[0].trange.add(bspecial.id)
        # print('?????????', temp30[0].trange.all()) 
        # temp29[0].save()
            
class Enroll(models.Model):
    user = models.ForeignKey(User, default=None, on_delete=models.CASCADE, related_name='userenroll', null = True)
    enrollDate = models.ForeignKey(ClassDate, on_delete=models.CASCADE)
    is_dropped = models.BooleanField(default = False)
    def _str_(self):
        return self.user
    # def save(self, *args, **kwargs):
        
    #     super().save(*args, **kwargs)
        
        # print('self', Enroll.objects.filter(id = self.id)[0].enrollDate.all())
        # Enroll.save()
        
        # enrollDate = Enroll.objects.create(**self.enrollDate)
        
        # enrollDate.save()
        
        # print('self', Enroll.objects.filter(id = self.id)[0].enrollDate)
        
class Drop(models.Model):
    user = models.ForeignKey(User, default=None, on_delete=models.CASCADE, related_name='userdrop', null = True)
    DropDate = models.ForeignKey(Enroll, on_delete=models.CASCADE)
    # DropDate = models.ForeignKey(Enroll, on_delete=models.CASCADE)
    
    def _str_(self):
        return self.user
    # def save(self, *args, **kwargs):
    #     changed = Enroll.objects.filter(id = self.DropDate.id, enrollDate = self.DropDate.enrollDate, user = self.user.id)
    #     print(changed)
    #     if len(changed) == 0:
    #         raise ValidationError("The user is not enrolled in this course.")

    #     if (changed[0].is_dropped == True):
    #         raise ValidationError("The user has already dropped the course.")
    #     changed[0].is_dropped = True
    #     changed[0].save()
    
    #     changed3 = ClassDate.objects.get(id = self.DropDate.enrollDate_id)
    #     changed3.current_enrolment = changed3.current_enrolment - 1
    #     changed3.save()

    #     super().save(*args, **kwargs)
    #     print('dropdate:', self.DropDate)

        # Enroll.objects.filter(id = self.DropDate.id)[0].is_dropped = True
        # Enroll.objects.filter(id=self.DropDate.id)[0].save(is_dropped = True)
        

        
        