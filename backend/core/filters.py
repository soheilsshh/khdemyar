import django_filters
from django_filters import CharFilter
from .models import Employee

class EmployeeFilter(django_filters.FilterSet):
    first_name = CharFilter(lookup_expr='icontains', label='نام')
    last_name = CharFilter(lookup_expr='icontains', label='نام خانوادگی')
    phone_number = CharFilter(field_name='user__phone_number', lookup_expr='contains', label='موبایل')
    national_id = CharFilter(lookup_expr='icontains', label='کد ملی')
    phone = CharFilter(lookup_expr='contains', label='تلفن ثابت')
    full_name = CharFilter(method='filter_by_full_name', label='نام و نام خانوادگی')

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