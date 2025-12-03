from rest_framework import permissions
from.models import Employee


class IsSuperAdmin(permissions.BasePermission):
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.is_superuser)


class IsActiveAdmin(permissions.BasePermission):
    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            return False
        try:
            return request.user.employee_profile.is_staff_admin == True
        except (AttributeError, Employee.DoesNotExist):
            return False


class CanManageShifts(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.user.is_superuser:
            return True
        try:
            return request.user.employee_profile.can_manage_shifts
        except AttributeError:
            return False


class CanManageBlog(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.user.is_superuser:
            return True
        try:
            return request.user.employee_profile.can_manage_blog
        except AttributeError:
            return False


class CanApproveRegistrations(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.user.is_superuser:
            return True
        try:
            return request.user.employee_profile.can_approve_registrations
        except AttributeError:
            return False


class CanManageAdmins(permissions.BasePermission):
    """فقط سوپرادمین اجازه داره مدیر اضافه/ویرایش کنه"""
    def has_permission(self, request, view):
        return request.user.is_superuser


class IsAdminOrSelf(permissions.BasePermission):
    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            return False
        try:
            if request.user.employee_profile.is_staff_admin:
                return True
        except AttributeError:
            pass

        if view.action in ['list', 'create', 'destroy']:
            return False

        return view.action in ['retrieve', 'update', 'partial_update', 'me']

    def has_object_permission(self, request, view, obj):
        try:
            if request.user.employee_profile.is_staff_admin:
                return True
        except AttributeError:
            pass

        return obj.user == request.user