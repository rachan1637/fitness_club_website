from rest_framework import serializers
from .models import Studio,ImageAttachment, Amenitie, Location, Course, Enroll, Drop, ClassDate, CourseKeyWord
from math import sin, cos, sqrt, atan2, radians
import datetime as dt
import copy
from Subscriptions.models import UserSubscription

# from .views import LocationLat, LocationLon
# class SubStudioSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Studio
#         fields = ['name','address','geographical_location']


class ImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ImageAttachment
        fields = ('images',)

class AmenetiesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Amenitie
        fields = ('type', 'quantity')
        
class StudioSerializer(serializers.ModelSerializer):
    # images = serializers.SerializerMethodField()
    studio_images = ImageSerializer(many=True)
    distance = serializers.SerializerMethodField('distances')
    
    # def get_images(self, studio):
    #    return ImageSerializer(studio.studio_images.all(), many=True).data
    def distances(self, studio):
        R = 6373.0
        temp = str(studio.geographical_location)
        x = temp.split(",")
        par1 = x[0]
        par2 = x[1]
        # ##############change here for specific location)################# #
        # lat1 = radians(43.6629)
        # lon1 = radians(-79.3957)
        print(self.context)
        Locationloc = str(Location.objects.filter(user=self.context["request"].user)[0].location).split(',')
        print(Locationloc)
        LocationLat = Locationloc[0]
        LocationLon= Locationloc[1]
        lat1 = radians(float(LocationLat))
        lon1 = radians(float(LocationLon))

        lat2 = radians(float(par1))
        lon2 = radians(float(par2))

        dlon = lon2 - lon1
        dlat = lat2 - lat1
        a = (sin(dlat/2))**2 + cos(lat1) * cos(lat2) * (sin(dlon/2))**2
        c = 2 * atan2(sqrt(a), sqrt(1-a))
        distance = R * c

        # km to miles
        distance /= 1.609344

        return distance
    
    class Meta:
        model = Studio
        fields = ('id', 'name', 'address', 'geographical_location', 'postal_code', 'phone_number','studio_images','distance','amenities')
        # ordering = ('distance',)
        # ordering = ['phone_number']


    def create(self, validated_data):
        images_data = validated_data.pop('studio_images')
        studio = Studio.objects.create(**validated_data)
        for image_data in images_data:
            ImageAttachment.objects.create(studio = studio, **image_data)
            # ImageAttachment.objects.create(strudio = studio, images = image_data)
        return studio
    
    def update(self, instance, validated_data):
        images_data = validated_data.pop('studio_images')
        images = (instance.studio_images).all()
        images = list(images)
        instance.name = validated_data.get('name', instance.name)
        instance.address = validated_data.get('address', instance.address)
        instance.geographical_location = validated_data.get('geographical_location', instance.geographical_location)
        instance.postal_code = validated_data.get('postal_code', instance.postal_code)
        instance.phone_number = validated_data.get('phone_number', instance.phone_number)
        instance.save()

        for image_data in images_data:
            image = images.pop(0)
            image.images = image_data.get('images', image.images)
            image.save()
        return instance

    # def create(self, validated_data):
    #     """
    #     Create and return a new `Snippet` instance, given the validated data.
    #     """
    #     return Studio.objects.create(**validated_data)
# class StudioCSerializer(serializers.HyperlinkedModelSerializer):
#     images = serializers['images']
   
#     class Meta:
#         model = Studio
#         fields = ('name', 'address', 'geographical_location', 'postal_code', 'phone_number','images')

class Studio2Serializer(serializers.ModelSerializer):
    # images = serializers.SerializerMethodField()
    studio_images = ImageSerializer(many=True)
    
    # def get_images(self, studio):
    #    return ImageSerializer(studio.studio_images.all(), many=True).data
    url = serializers.SerializerMethodField('urll')
   

    def urll(self, studio):
        destination = str(studio.geographical_location)
        # return f'https://maps.googleapis.com/maps/api/directions/json?origin=43.6629,-79.3957&destination={destination}&key=AIzaSyCn8EqVgYZbJPAHlCiEK4IscaBIG-Vq7NQ'
        return f'https://www.google.com/maps/dir/43.6629,-79.3957/{destination}'
    

    class Meta:
        model = Studio
        fields = ('name', 'address', 'geographical_location', 'postal_code', 'phone_number','studio_images', 'url')

class LocationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Location
        fields = ('location',)

    def create(self, validated_data):
        location = Location.objects.create(
            location = validated_data["location"],
            user = self.context["request"].user,
        )

        return location

    def update(self, instance, validated_data):
        instance.location = validated_data["location"]
        instance.save()
        return instance

class CourseKeywWordSerializer(serializers.ModelSerializer):
    class Meta:
        model = CourseKeyWord
        fields = ("name", )
        
class CourseSerializer(serializers.ModelSerializer):
    keyword_names = CourseKeywWordSerializer(read_only=True, many=True, source="keywords")
   
    # def get_name_url(self, obj):
    #     return obj
        
    class Meta:
        model = Course
        fields = ('id', 'name', 'description','coach','start_time','end_time', 'keyword_names','capacity', 'times')
        

class ClassDateSerializer(serializers.ModelSerializer):
    # def get_name_url(self, obj):
    #     return obj
        
    class Meta:
        model = ClassDate
        fields = ('id', 'studio_id', 'course_id','date_start','date_end','capacity', 'current_enrolment','name', 'coach')

# class DropClassDateSerializer(serializers.ModelSerializer):
#     drop = serializers.BooleanField(write_only=True, required=True)
#     class Meta:
#         model = Enroll
#         fields = ("drop", "enrolled_class_id")
#         extra_kwargs = {"is_dropped": {'required': True}}
    
#     def update(self, instance, validated_data):
#         enrolled_class = Enroll.objects.filter(user=instance.user, enrollDate=ClassDate.objects.get(validated_data["enrolled_class_id"]))
#         if len(enrolled_class) == 0:
#             raise serializers.ValidationError("This class is not enrolled by the user.")

#         if validated_data["drop"] == True:
#             return instance
        
#         instance.is_dropped = validated_data["drop"]
#         instance.save()

#         # Change class date size
#         instance.enrollDate.current_enrolment -= 1
#         instance.enrollDate.save()


    


class DropSerializer(serializers.ModelSerializer):
    class Meta:
        model = Drop
        fields = ('id','DropDate')
    
    def create(self, validated_data):
        print(self.context["request"].user)
        # instance.enrollDate.current_enrolment = validated_data["enrollDate"].current_enrolment + 1
        # instance.save()
        # print("validated_dat",validated_data["enrollDate"])
        # return instance
        # Enroll.objects.get(enrollDate = validated_data['DropDate'])

        # changed = Enroll.objects.filter(id = self.DropDate.id, enrollDate = self.DropDate.enrollDate, user = self.context["request"].user)
        changed = Enroll.objects.filter(
            id = validated_data['DropDate'].id, 
            enrollDate = validated_data['DropDate'].enrollDate, 
            user = self.context["request"].user
        )
        print(changed)
        if len(changed) == 0:
            raise serializers.ValidationError("The user is not enrolled in this course.")

        if (changed[0].is_dropped == True):
            raise serializers.ValidationError("The user has already dropped the course.")
        changed[0].is_dropped = True
        changed[0].save()
    
        # changed3 = ClassDate.objects.get(id = self.DropDate.enrollDate_id)
        changed3 = ClassDate.objects.get(id = validated_data['DropDate'].enrollDate_id)
        changed3.current_enrolment = changed3.current_enrolment - 1
        changed3.save()


        return Drop.objects.create(
                user = self.context['request'].user,
                DropDate = validated_data['DropDate']
            )
        
    def validate_DropDate(self, data):
        """
        Check that the start is before the stop.
        """
        print('data:', data)

        if data.enrollDate.current_enrolment <=0:
            raise serializers.ValidationError("Below 0")
        return data
        
class DropCourseSerializer(serializers.ModelSerializer):
    course_code = serializers.IntegerField(required=True, write_only=True)
    class Meta:
        model = Drop
        fields = ("course_code", )
    def create(self, validated_data):
        dropcourseid = validated_data["course_code"]
        # all_class = ClassDate.objects.filter(course_id = enrollcourseid)
        # for c in all_class:
        #     Enroll.objects.create(
        #         user = self.context['request'].user,
        #         enrollDate = c
        #     )
        # ob_drop_li = []
        enroll_id_list = []
        # changed = Enroll.objects.filter(
        #     id = validated_data['DropDate'].id, 
        #     enrollDate = validated_data['DropDate'].enrollDate, 
        #     user = self.context["request"].user
        # )
        if len(ClassDate.objects.filter(course_id = dropcourseid)) == 0:
            raise serializers.ValidationError("The course code is incorrect.")

        for object in ClassDate.objects.filter(course_id = dropcourseid):
            if object.current_enrolment <= 0:
                continue
            
            changed = Enroll.objects.filter(user = validated_data['user'], enrollDate = object)
            
            # changed = Enroll.objects.filter(enrollDate = object)
            for obj in changed:
                if obj.is_dropped == True:
                    continue

                enroll_id_list.append(obj.id)
                print("enroll_id_list",enroll_id_list)
                obj.is_dropped = True
                
                obj.save()
                Drop.objects.create(
                    user=self.context["request"].user,
                    DropDate = obj,
                )
            
                object.current_enrolment = object.current_enrolment -1
                object.save()
        
        if len(enroll_id_list) == 0:
            raise serializers.ValidationError("Not enroll in any class under the class code or all classes have already been dropped.")

        # if len(enroll_id_list) == 0:
        #     raise serializers.ValidationError("Already Drop")
        return enroll_id_list
        # drop_list = []
        # for object1 in Enroll.objects.filter(id__in = enroll_id_list):
        #     object1.is_dropped = True
        #     object1.save()
        #     drop_list.append(Drop.objects.create(
        #         user = self.context['request'].user,
        #         DropDate = object1))
        # # print('enobj',Enroll.objects.filter(id__in = enroll_id_list))
        # if len(drop_list) == 0:
            # raise serializers.ValidationError("Already Dropped")
        # return drop_list

class EnrollSerializer(serializers.ModelSerializer):
    class Meta:
        model = Enroll
        fields = ('id', 'enrollDate',)
    def create(self, validated_data):
        Enroll_num = Enroll.objects.filter(user = validated_data['user'], enrollDate_id = validated_data['enrollDate'].id, is_dropped=False)
        # print('Enroll_num',Enroll_num)
        if len(list(Enroll_num)) > 0:
            raise serializers.ValidationError("Already Enrolled")
        # validated_data['user']
        
        changed2 = ClassDate.objects.get(id = validated_data['enrollDate'].id)  
        changed2.current_enrolment = changed2.current_enrolment +1
        changed2.save()
        # instance.enrollDate.current_enrolment = validated_data["enrollDate"].current_enrolment + 1
        # instance.save()
        # print("validated_dat",validated_data["enrollDate"])
        # return instance

        if len(Enroll.objects.filter(user = validated_data['user'], enrollDate_id = validated_data['enrollDate'].id, is_dropeed=True)) == 1:
            enrolled_class = Enroll.objects.get(user=validated_data["user"], enrollDate_id = validated_data['enrollDate'].id)
            enrolled_class.is_dropped = False
            enrolled_class.save()
            return enrolled_class
        else:
            return Enroll.objects.create(
                    user = self.context['request'].user,
                    enrollDate = validated_data['enrollDate']
                )

    def validate_enrollDate(self, data):
        """
        Check that the start is before the stop.
        """
        print('data:', data)
        if len(UserSubscription.objects.filter(user=self.context["request"].user)) == 0:
            raise serializers.ValidationError("User hasn't subscribed a plan yet.")

        if dt.datetime.today() > dt.datetime.combine(self.context["request"].user.sub_plan.valid_date, dt.datetime.min.time()):
            raise serializers.ValidationError("Enrollment unallowed. Subscription plan is cancelled and the valid date has passed.")

        if data.current_enrolment >= data.capacity:
            raise serializers.ValidationError("Exceed Capacity")
        return data
    
class AddCourseSerializer(serializers.ModelSerializer):
    course_code = serializers.IntegerField(required=True, write_only=True)
    class Meta:
        model = Enroll
        fields = ("course_code", )
        
    def create(self, validated_data):
        # Enroll_num = Enroll.objects.filter(user = validated_data['user'], enrollDate_id = validated_data['enrollDate'].id)  
        # # print('Enroll_num',Enroll_num)
        # if len(list(Enroll_num)) > 0:
        #     raise serializers.ValidationError("Already Enrolled")
        if len(UserSubscription.objects.filter(user=self.context["request"].user)) == 0:
            raise serializers.ValidationError("User hasn't subscribed a plan yet.")

        if dt.datetime.today() > dt.datetime.combine(self.context["request"].user.sub_plan.valid_date, dt.datetime.min.time()):
            raise serializers.ValidationError("Enrollment unallowed. Subscription plan is cancelled and the valid date has passed.")
        
        # Get all class based on course code
        enrollcourseid = validated_data["course_code"]
        # all_class = ClassDate.objects.filter(course_id = enrollcourseid)
        # for c in all_class:
        #     Enroll.objects.create(
        #         user = self.context['request'].user,
        #         enrollDate = c
        #     )
        ob_li = []
        reach_capacity_count = 0
        already_enrolled_count = 0
        for object2 in ClassDate.objects.filter(course_id = enrollcourseid):
            Enroll_num = Enroll.objects.filter(user = validated_data['user'], enrollDate_id = object2.id, is_dropped = False)  
            if len(list(Enroll_num)) > 0:
                already_enrolled_count += 1
                continue

            if object2.current_enrolment >= object2.capacity:
                reach_capacity_count += 1
                continue
            
            object2.current_enrolment = object2.current_enrolment +1
            object2.save()
            
            ob_li.append(Enroll.objects.create(
                user = self.context['request'].user,
                enrollDate = object2)

            )

        if len(ob_li) == 0:
            # if reach_capacity_count > 0 and already_enrolled_count > 0:
            #     raise serializers.ValidationError("Some classes have been enrolled successfully. Some classes cannot be enrolled due to capacity limit or already enrolled.")
            
            # if reach_capacity_count > 0:
            #     raise serializers.ValidationError("Some classes have been enrolled successfully. Some classes cannot be enrolled due to capacity limit.")
            
            # if already_enrolled_count > 0:
            #     raise serializers.ValidationError("Some classes have been enrolled successfully. Some classes cannot be enrolled because they have already been enrolled.")
        # else:
            raise serializers.ValidationError("All classes cannot be enrolled due to capacity limit or already enrolled.")

        # if len(ob_li) == 0:
        #     raise serializers.ValidationError("Already Enrolled")
        # ob_li = []
        # for object in ClassDate.objects.filter(course_id = enrollcourseid):
        #     ob_li.append(Enroll.objects.create(
        #         user = self.context['request'].user,
        #         enrollDate = object))
            
        return ob_li
        
        # return [Enroll.objects.create(
        #         user = self.context['request'].user,
        #         enrollDate = object
        #     ) for object in ClassDate.objects.filter(course_id = enrollcourseid)]

# class EnrollmentSerializer(serializers.ModelSerializer):
#     # avalible_occur = serializers.SerializerMethodField('get_name')
#     # course = CourseSerializer(read_only = True)
#     # name = serializers.SerializerMethodField('get_name')
#     # def get_name(self, obj):
#     #     return obj.name
#     # name = serializers.StringRelatedField()
#     # course_id = serializers.SerializerMethodField('get_course_id')
#     # def get_course_id(self, obj):
#     #     return obj.course_id
    
#     # studio_id = serializers.SerializerMethodField('get_studio_id')
#     # def get_studio_id(self, obj):
#     #     return obj.studio_id
    
#     # name = serializers.CharField(max_length=120)

#     class Meta:
#         model = Enrollment
#         fields = ('id','user','course','course_start','course_end', 'session')

#         # fields = ('course',)    
#     # def validate_course(self, attr):
#     #     courseData = Course.objects.filter(studio_id = self.kwargs['pk'])
#     #     if attr.course_start != attr.course_end:
#     #         raise serializers.ValidationError({"password": "Password fields didn't match."})
#     #     # pass
#     # #     return course
#     def create(self, validated_data):
        
#         try:
#             # li = Course.objects.filter(start_time__gte = validated_data['course_start'])
#             newCourse = Course.objects.filter(id = validated_data['course'].id).first()
#             print(newCourse)
            
#             occur_list = []
#             occurrence = newCourse.times.occurrences()
#             if newCourse.times.rrules[0].until is None:
#                 occur_list.append("Indefinitely")
#             else:
#                 for occ in occurrence:
#                     occur_list.append([dt.datetime.combine(occ.date(), newCourse.start_time.time()), dt.datetime.combine(occ.date(), newCourse.end_time.time())])
            
#             print('occur_list',occur_list)
            
#             avalible_occ = []
#             if len(occur_list) > 0:
#                 if occur_list[0] == "Indefinitely":
#                     print(validated_data['course_start'])
#                     if validated_data['course_start'] == None and validated_data['course_end'] == None:
#                         avalible_occ = copy.deepcopy(occur_list)
#                     elif validated_data['course_start'] != None and validated_data['course_end'] == None:
#                         avalible_occ = copy.deepcopy(occur_list)
#                     elif validated_data['course_start'] == None and validated_data['course_end'] != None:
#                         for occ in occurrence:
#                             if occ.date() > validated_data['course_end']:
#                                 break
#                             avalible_occ.append([dt.datetime.combine(occ.date(), newCourse.start_time.time()), dt.datetime.combine(occ.date(), newCourse.end_time.time())])
#                     elif validated_data['course_start'] != None and validated_data['course_end'] != None:
#                         for occ in occurrence:
#                             if validated_data['course_start'] < occ.date() and validated_data['course_end'] > occ.date():
#                                 avalible_occ.append([dt.datetime.combine(occ.date(), newCourse.start_time.time()), dt.datetime.combine(occ.date(), newCourse.end_time.time())])
#                             else:
#                                 break
#                 else:   
#                         if validated_data['course_start'] == None and validated_data['course_end'] == None:
#                             avalible_occ = copy.deepcopy(occur_list)
                        
#                         elif validated_data['course_start'] == None and validated_data['course_end'] != None:
#                             for pair in occur_list:
#                                 if validated_data['course_end'] > pair[1].date():
#                                     avalible_occ.append(pair)
                                    
#                         elif validated_data['course_start'] != None and validated_data['course_end'] == None:
#                             for pair in occur_list:
#                                 if validated_data['course_start'] < pair[0].date():
#                                     avalible_occ.append(pair)
#                         else:
#                             for pair in occur_list:
#                                 if validated_data['course_start'] < pair[0].date() and validated_data['course_end'] > pair[1].date():
#                                     avalible_occ.append(pair)
                    
#             print('avalible_occ',avalible_occ)
#             print('validated_data',validated_data)
#             avalible_occ_new = []
#             for i in avalible_occ:
#                 print('i', i)
#                 p = []
#                 if i == "Indefinitely":
#                     p = "Indefinitely"
#                 else:
#                     for j in i:
#                         p.append(j.strftime("%Y-%m-%d %H:%M:%S"))
#                 avalible_occ_new.append(p)
#             print("avalible_occ_new",avalible_occ_new)
#             validated_data['session'] = avalible_occ_new
#         except Course.DoesNotExist:
#             raise serializers.ValidationError('Please provide the valid option for course')

#         return Enrollment.objects.create(**validated_data) #remember to replace 'Model' with your actual model name.

    
    # def update(self, instance, validated_data):
    #     course_data = validated_data.pop('studio_class')
    #     course = (instance.studio_class).all()
    #     course = list(course)
    #     # instance.course = validated_data.get('name', instance.name)
    #     instance.course_start = validated_data.get('address', instance.address)
    #     instance.course_end = validated_data.get('geographical_location', instance.geographical_location)
    #     instance.save()

    #     for image_data in course_data:
    #         image = images.pop(0)
    #         image.images = image_data.get('images', image.images)
    #         image.save()
    #     return instance
        # enrollment_data = validated_data.pop('class_enrollment')
        # course = Course.objects.create(**validated_data)
        # for ele in enrollment_data:
        #     Enrollment.objects.create(course = course, **ele)
        #     # ImageAttachment.objects.create(strudio = studio, images = image_data)
        # return course
        
# class DropCourseSerializer(serializers.ModelSerializer):
    
#     class Meta:
#         model = DropCourse
#         fields = ('exclude_start', 'exclude_end', 'session')
    
#     # def update(self, **kwargs):
#     #     enrolCourseNum = Enrollment.objects.get(id = self.kwargs['pk'])
        