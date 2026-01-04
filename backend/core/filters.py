import django_filters
from django_filters import CharFilter, NumberFilter, ChoiceFilter
from django.db.models import Q
from .models import Employee

class EmployeeFilter(django_filters.FilterSet):
    first_name = CharFilter(lookup_expr='icontains', label='نام')
    last_name = CharFilter(lookup_expr='icontains', label='نام خانوادگی')
    phone_number = CharFilter(field_name='user__phone_number', lookup_expr='contains', label='موبایل')
    national_id = CharFilter(lookup_expr='icontains', label='کد ملی')
    phone = CharFilter(lookup_expr='contains', label='تلفن ثابت')
    full_name = CharFilter(method='filter_by_full_name', label='نام و نام خانوادگی')

    # ۱- فیلتر محدوده تعداد شیفت (با استفاده از کلید total_shifts_count که در view آنوتیت شده)
    min_shifts = NumberFilter(field_name='total_shifts_count', lookup_expr='gte', label='حداقل تعداد شیفت')
    max_shifts = NumberFilter(field_name='total_shifts_count', lookup_expr='lte', label='حداکثر تعداد شیفت')

    # ۲- فیلتر محدوده تعداد فرزند
    min_children = NumberFilter(field_name='children_count', lookup_expr='gte', label='حداقل تعداد فرزند')
    max_children = NumberFilter(field_name='children_count', lookup_expr='lte', label='حداکثر تعداد فرزند')

    # ۳- فیلتر بر اساس سوءپیشینه
    # چون فیلد شما TextField است، اگر پر باشد یعنی توضیحات سوءپیشینه دارد
    CRIMINAL_CHOICES = (
        ('yes', 'دارای سوءپیشینه'),
        ('no', 'بدون سوءپیشینه'),
    )
    has_criminal_record = ChoiceFilter(
        method='filter_criminal_record',
        choices=CRIMINAL_CHOICES,
        label='وضعیت سوءپیشینه'
    )

    class Meta:
        model = Employee
        fields = []

    def filter_by_full_name(self, queryset, name, value):
        if not value:
            return queryset
        parts = value.strip().split()
        if len(parts) >= 2:
            first = parts[0]
            last = ' '.join(parts[1:])
            return queryset.filter(
                first_name__icontains=first,
                last_name__icontains=last
            )
        else:
            return queryset.filter(
                first_name__icontains=value
            ) | queryset.filter(
                last_name__icontains=value
            )

    def filter_criminal_record(self, queryset, name, value):
        if value == 'yes':
            # فیلتر کردن مواردی که فیلد خالی نیست و null هم نیست
            return queryset.exclude(Q(criminal_record__isnull=True) | Q(criminal_record=''))
        if value == 'no':
            # فیلتر کردن مواردی که فیلد خالی یا null است
            return queryset.filter(Q(criminal_record__isnull=True) | Q(criminal_record=''))
        return queryset