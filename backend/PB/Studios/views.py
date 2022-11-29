from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, generics
from rest_framework import permissions
from .models import Studio, ImageAttachment, Location,Course,Enroll,Drop, ClassDate
from .serializers import (
    StudioSerializer, 
    ImageSerializer, 
    Studio2Serializer, 
    LocationSerializer,
    CourseSerializer,
    EnrollSerializer,
    DropSerializer, 
    AddCourseSerializer, 
    DropCourseSerializer, 
    # DropClassDateSerializer
)
from rest_framework.parsers import FileUploadParser, MultiPartParser
from rest_framework.permissions import  IsAdminUser, IsAuthenticated
from location_field.models.plain import PlainLocationField
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.generics import GenericAPIView
from rest_framework import filters

from django.http import HttpResponse
import datetime as dt
from datetime import timedelta
import ast
import copy
# Create your views here.

# class DropClassDateView(generics.UpdateAPIView):
#     queryset = Enroll.objects.all()
#     permission_classes = (IsAuthenticated, )
#     serializer_class = DropClassDateSerializer

    # def get_queryset(self):
    #     return Enroll.objects.filter(user=self.request.user)

class StudioListApiView(generics.ListAPIView):
    queryset = Studio.objects.all()
    serializer_class = StudioSerializer
    permission_classes = (IsAuthenticated,)

    def get(self, request, *args, **kwargs):
        studioList = Studio.objects
        serializer = StudioSerializer(studioList, many = True, context={"request": request})
        sortedData = sorted(serializer.data, key = lambda k:k['distance'])
        return Response(sortedData, status = status.HTTP_200_OK)

class StudioSearchListApiView(generics.ListAPIView):
    # parser_classes = (FileUploadParser, MultiPartParser)
    # queryset = Studio.objects.all().order_by('distance')
    queryset = Studio.objects.all()
    serializer_class = StudioSerializer
    permission_classes = (IsAuthenticated,)
    # filter_backends = [filters.OrderingFilter,DjangoFilterBackend,filters.SearchFilter]
    filter_backends = [DjangoFilterBackend,filters.SearchFilter]

    filterset_fields = ['name','amenities','classes', 'coaches']
    search_fields = ['name','amenities__Amname','classes__classNames', 'coaches__coachNames']
    # ordering_fields = ['distance',]

    

# class StudioListApiView(APIView):
#     permission_classes = [permissions.IsAuthenticated]
#     filter_backends = [DjangoFilterBackend]
#     filterset_fields = ['name',]
#     def get(self, request, *args, **kwargs):
#         studioList = Studio.objects
#         serializer = StudioSerializer(studioList, many = True)
#         sortedData = sorted(serializer.data, key = lambda k:k['distance'])
#         return Response(sortedData, status = status.HTTP_200_OK)

class StudioProfileApiView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    def get(self, request, *args, **kwargs):
        studioNum = Studio.objects.get(id = self.kwargs['pk'])
        serializer = Studio2Serializer(studioNum, many = False)
        return Response(serializer.data, status = status.HTTP_200_OK)

# class StudioEditApiView(generics.RetrieveUpdateDestroyAPIView):
#     serializer_class = StudioSerializer
#     queryset = Studio.objects.all()
#     permission_classes = (IsAdminUser,)

class ImageListView(generics.ListCreateAPIView):
    queryset = ImageAttachment.objects.all()
    serializer_class = ImageSerializer
    
class ImageEditView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = ImageSerializer
    queryset = ImageAttachment.objects.all()

class CreateSpecificLocation(generics.CreateAPIView):
    # permission_classes = [permissions.IsAuthenticated]
    # def post(self, request, *args, **kwargs):
    #     location = self.objects
    #     return location
    serializer_class = LocationSerializer
    queryset = Location.objects.all()
    permission_classes = (IsAuthenticated,)

class UpdateSpecificLocation(generics.UpdateAPIView):
    # permission_classes = [permissions.IsAuthenticated]
    # def post(self, request, *args, **kwargs):
    #     location = self.objects
    #     return location
    serializer_class = LocationSerializer
    queryset = Location.objects.all()
    permission_classes = (IsAuthenticated,)

    def get_object(self):
        return Location.objects.filter(user=self.request.user)[0]
    


class ClassListView(generics.ListAPIView):
    permission_classes = [permissions.IsAuthenticated]
    # queryset = Course.objects.all()
    # for i in queryset:
    #     print(i.start_time)
        # print(i.end_time)
    # print('queryset',queryset)
    filter_backends = [DjangoFilterBackend,filters.SearchFilter]
    serializer_class = CourseSerializer
    filterset_fields = ['name','coach',]
    search_fields = ['name','coach',]

    def get_queryset(self):
        return Course.objects.filter(studio=Studio.objects.get(id = self.kwargs["pk"])).order_by('start_time')
    
    
    # def get_queryset(self):
    #     # studio_name = Studio.objects.filter(id = self.kwargs['pk'])
    #     classList = Course.objects.filter(studio_id = self.kwargs['pk'])
    #     # print(classList)
    #     c_list = []
    #     for c in classList:
    #         if c.times.rrules[0].until is None:
    #             print('No End date')
    #             print('start',c.times.dtstart)
    #             c_list.append(c.id)
    #         else: # filter past occurrence
    #             # occurrence = c.times.occurrences()
    #             occurrence = c.times.between(c.start_time.replace(tzinfo=None), c.times.rrules[0].until.replace(tzinfo=None))
    #             if len(list(occurrence)) > 0:
    #                 c_list.append(c.id)
    #             # print(list(occurrence))
    #             # print(c.start_time.replace(tzinfo=None))
    #             # print(c.times.rrules[0].until.replace(tzinfo=None))

    #     #newClassList include no end date events +  end date events has future occurrence
    #     newClassList = Course.objects.filter(id__in=c_list, studio_id = self.kwargs['pk'])
    #     serializer = CourseSerializer(newClassList, many = True)
    #     results = []
    #     for obj in newClassList:
    #         times_dict = {}
    #         occur_list = []
    #         occurrence = obj.times.between(obj.start_time.replace(tzinfo=None), obj.times.rrules[0].until.replace(tzinfo=None))
    #         if obj.times.rrules[0].until is None:
    #             occur_list.append("Indefinitely")
    #         else:
    #             for occ in occurrence:
    #                 occur_list.append([dt.datetime.combine(occ.date(), obj.start_time.time()), dt.datetime.combine(occ.date(), obj.end_time.time())])
            
    #         data = {}
    #         data['name'] = obj.name
    #         data['description'] = obj.description
    #         data['coach'] = obj.coach
    #         data['start_time'] = dt.datetime.combine(occurrence[0].date(), obj.start_time.time())
    #         data['end_time'] = dt.datetime.combine(occurrence[0].date(), obj.end_time.time())
    #         data['keywords'] = obj.keywords
    #         data['capacity'] = obj.capacity
            
    #         # print(list(obj.times))
    #         text_rules = []
    #         for rule in obj.times.rrules:
    #             text_rules.append(rule.to_text())
                
    #         text_exrules = []
    #         for rule in obj.times.exrules:
    #             text_exrules.append(rule.to_text())
            
    #         times_dict['starts'] = obj.start_time.time()
    #         times_dict['ends'] = obj.end_time.time()
    #         times_dict["RRULE"] = text_rules
    #         times_dict["exrules"] = text_exrules
    #         times_dict["occurrence"] = occur_list
            
    #         data['times'] = times_dict
            
    #         results.append(data)
    #         obj.start_time = data['start_time']
    #         obj.end_time = data['end_time']
            
    #         # obj.times = str(data['times'])
            
    #         # obj.save()
    #     sortedResults = sorted(results, key=lambda d: d['start_time']) 
        
    #     # return Response(sortedResults, status = status.HTTP_200_OK)
    #     # print(dt.datetime.now())
    #     return Course.objects.filter(start_time__gte=dt.datetime.now()).order_by('start_time')
    
class EnrollmentView(generics.CreateAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = EnrollSerializer
    queryset = Enroll.objects.all()
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
    # print(list(queryset))

class EnrollmentCourseView(generics.CreateAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = AddCourseSerializer
    queryset = Enroll.objects.all()
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class DropView(generics.CreateAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = DropSerializer
    queryset = Drop.objects.all()
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
        
class DropCourseView(generics.CreateAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = DropCourseSerializer
    queryset = Drop.objects.all()
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
    
class DropDateListView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    def get(self, request, *args, **kwargs):
        dropDateList = Drop.objects.filter(user = request.user.id)
        serializer = DropSerializer(dropDateList, many = True)
        # sortedData = sorted(serializer.data, key = lambda k:k['distance'])
        return Response(serializer.data, status = status.HTTP_200_OK)
    


# class EnrollmentView(generics.CreateAPIView):
#     permission_classes = [permissions.IsAuthenticated]
#     serializer_class = EnrollmentSerializer
#     queryset = Enrollment.objects.all()
#     def perform_create(self, serializer):
#         serializer.save(user=self.request.user)
#     # print(list(queryset))
    
class EnrollmentListView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    def get(self, request, *args, **kwargs):
        # enrollmentList = Enroll.objects.filter(user = request.user.id, is_dropped = False, enrollDate__date_end__gte = dt.datetime.now()+timedelta(days=8))
        enrollmentList = Enroll.objects.filter(user = request.user.id, is_dropped = False, enrollDate__date_end__gte = dt.datetime.now())
        serializer = EnrollSerializer(enrollmentList, many = True)
        
        results = []
        for obj1 in enrollmentList:
            data = {}
            data["enroll_id"] = obj1.id
            data['classDate_id'] = obj1.enrollDate.id
            data["course_id"] = obj1.enrollDate.course_id
            data['date_start'] = obj1.enrollDate.date_start
            data['date_end'] = obj1.enrollDate.date_end
            results.append(data)
            
        sortedResults = sorted(results, key = lambda k:k['date_start'])
        print(sortedResults)
        return Response(sortedResults, status = status.HTTP_200_OK)
    
class HistoryListView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    def get(self, request, *args, **kwargs):
        # date_now_more_5_days = (datetime.now() + timedelta(days=5) )
        # enrollmentList = Enroll.objects.filter(user = request.user.id, enrollDate__date_end__lt = dt.datetime.now()+timedelta(days=8))
        enrollmentList = Enroll.objects.filter(user = request.user.id, enrollDate__date_end__lt = dt.datetime.now())
        serializer = EnrollSerializer(enrollmentList, many = True)
        
        results = []
        for obj1 in enrollmentList:
            data = {}
            data['enroll_id'] = obj1.id
            data["classDate_id"] = obj1.enrollDate.id
            data["course_id"] = obj1.enrollDate.course_id
            data['date_start'] = obj1.enrollDate.date_start
            data['date_end'] = obj1.enrollDate.date_end
            data["is_dropped"] = obj1.is_dropped
            results.append(data)
            
        sortedResults = sorted(results, key = lambda k:k['date_start'])
        print(sortedResults)
        return Response(sortedResults, status = status.HTTP_200_OK)

# class DropCourseView(generics.RetrieveDestroyAPIView):
#     permission_classes = [permissions.IsAuthenticated]
#     serializer_class = DropCourseSerializer
#     queryset = Enrollment.objects.all()
#     # serializer_class = DropCourseSerializer
#     # queryset = DropCourse.objects.all()
#     # permission_classes = (IsAuthenticated,)
    
#     def get(self, request, *args, **kwargs):
#         enrolCourseNum = Enrollment.objects.get(id = self.kwargs['pk'])
#         serializer = EnrollmentSerializer(enrolCourseNum, many = False)
#         # print('self.request.user',self.request.user.id)
#         if serializer.data['user']!=self.request.user.id:
#             return HttpResponse('Unauthorized', status=401)
        
#         return Response(serializer.data, status = status.HTTP_200_OK)
    
#     def post(self, request, *args, **kwargs):
#         enrol = Enrollment.objects.get(id = self.kwargs['pk'])
#         enrolCourseSessionstr = enrol.session
#         print(enrolCourseSessionstr)
#         if enrolCourseSessionstr == None:
#             pass
#         else:
#             enrolCourseSession = ast.literal_eval(enrolCourseSessionstr)
            
#             exclude_start_get = request.POST.get('exclude_start')
#             if exclude_start_get == '':
#                 exclude_start = None
#             else:  
#                 exclude_start = dt.datetime.strptime(exclude_start_get, "%Y-%m-%d").date()
            
#             exclude_end_get = request.POST.get('exclude_end')
#             if exclude_end_get == '':
#                 exclude_end = None
#             else:
#                 exclude_end = dt.datetime.strptime(exclude_end_get, "%Y-%m-%d").date()
#             newsession_li = []
#             if len(enrolCourseSession) > 0:
#                 if enrolCourseSession[0] == "Indefinitely":
#                     pass
#                 else:
#                     if exclude_start == None and exclude_end == None:
#                         newsession_li = copy.deepcopy(enrolCourseSession)
                    
#                     elif exclude_start == None and exclude_end != None:
#                         for ele in enrolCourseSession:
#                             end_t = dt.datetime.strptime(ele[1], "%Y-%m-%d %H:%M:%S").date()
                            
#                             if exclude_end < end_t:
#                                 newsession_li.append(ele)
                                
#                     elif exclude_start != None and exclude_end == None:
#                         for ele in enrolCourseSession:
#                             start_t = dt.datetime.strptime(ele[0], "%Y-%m-%d %H:%M:%S").date()
#                             if exclude_start > start_t:
#                                 newsession_li.append(ele)
                                
#                     elif exclude_start != None and exclude_end != None:
#                         for ele in enrolCourseSession:
#                             start_t = dt.datetime.strptime(ele[0], "%Y-%m-%d %H:%M:%S").date()
#                             end_t = dt.datetime.strptime(ele[1], "%Y-%m-%d %H:%M:%S").date()
#                             print('exclude_end',exclude_end)
#                             print('end_t',end_t)
#                             if exclude_start > start_t and exclude_end < end_t:
#                                 newsession_li.append(ele)
                                
#             enrol.session = newsession_li
#             enrol.save()
        
#         return Response(status = status.HTTP_200_OK)

class filterDateView(generics.ListAPIView):
    serializer_class = CourseSerializer
    def get_queryset(self):
        filterDate = self.kwargs['filterDate']
        filterDate_startT_str = filterDate + " 00:00:00"
        filterDate_endT_str = filterDate + " 23:59:59"
        filterDate_startT = dt.datetime.strptime(filterDate_startT_str, "%Y-%m-%d %H:%M:%S")
        filterDate_endT = dt.datetime.strptime(filterDate_endT_str, "%Y-%m-%d %H:%M:%S")
        returnlist=[]
        cdf = ClassDate.objects.filter(studio_id = self.kwargs['pk'], date_start__gte = filterDate_startT, date_start__lte = filterDate_endT )
        for cd in cdf:
            returnlist.append(cd.course_id)
        return Course.objects.filter(id__in = returnlist )
        
class filterTimeRangeView(generics.ListAPIView):
    serializer_class = CourseSerializer
    def get_queryset(self):
        filterstartT_str = self.kwargs['filterstart']
        filterendT_str = self.kwargs['filterend']
        
        filterstartT = dt.datetime.strptime(filterstartT_str, "%H:%M:%S")
        filterendT = dt.datetime.strptime(filterendT_str, "%H:%M:%S")
        # print("filterstartT",filterstartT)
        course_id_li = []
        courseList = Course.objects.filter(studio_id = self.kwargs['pk'])
        for course_i in courseList:
            print("filterstartT.time()",filterstartT.time())
            print("course_i.start_time.time()",course_i.start_time.time())
            
            if (course_i.start_time.time() >= filterstartT.time() and course_i.start_time.time() <= filterendT.time()
                and course_i.end_time.time() >= filterstartT.time() and course_i.end_time.time() <= filterendT.time()): 
                    
                    course_id_li.append(course_i.id)
                    
        
        return Course.objects.filter(id__in = course_id_li )