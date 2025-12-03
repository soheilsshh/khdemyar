from rest_framework import permissions

class IsSuperAdmin(permissions.BasePermission):
    def has_permission(self, request, view):
        return bool(
            request.user
            and request.user.is_authenticated
            and request.user.is_superuser
        )

class IsSystemAdmin(permissions.BasePermission):
    def has_permission(self, request, view):
        return bool(
            request.user
            and request.user.is_authenticated
            and getattr(request.user, 'is_admin', False)
            and request.user.is_staff
        )


class IsAdminOrSelf(permissions.BasePermission):
    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False

        if getattr(request.user, 'is_admin', False) and request.user.is_staff:
            return True

        if view.action in ['list', 'create', 'destroy', 'update', 'partial_update']:
            return False

        return view.action in ['retrieve', 'me', 'update', 'partial_update']

    def has_object_permission(self, request, view, obj):
        if getattr(request.user, 'is_admin', False) and request.user.is_staff:
            return True

        if hasattr(obj, 'user'):
            return obj.user == request.user
        if hasattr(obj, 'employee') and hasattr(obj.employee, 'user'):
            return obj.employee.user == request.user

        return False


class IsApprovedEmployee(permissions.BasePermission):
    def has_permission(self, request, view):
        return bool(
            request.user
            and request.user.is_authenticated
            and request.user.is_active
            and getattr(request.user, 'is_approved', False)
        )


class IsAdminOrReadOnly(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return bool(
            request.user
            and request.user.is_authenticated
            and getattr(request.user, 'is_admin', False)
            and request.user.is_staff
        )


class IsApprovedEmployeeOrAdmin(permissions.BasePermission):
    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False

        if getattr(request.user, 'is_admin', False) and request.user.is_staff:
            return True

        return request.user.is_active and getattr(request.user, 'is_approved', False)

