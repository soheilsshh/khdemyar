from rest_framework import permissions


class IsAdminOrSelf(permissions.BasePermission):
    def has_permission(self, request, view):

        if not request.user or not request.user.is_authenticated:
            return False


        if getattr(request.user, 'is_admin', False) or request.user.is_staff:
            return True


        if view.action in ['list', 'create', 'destroy']:
            return False

        return True

    def has_object_permission(self, request, view, obj):

        if getattr(request.user, 'is_admin', False) or request.user.is_staff:
            return True


        return getattr(obj, 'user', None) == request.user
