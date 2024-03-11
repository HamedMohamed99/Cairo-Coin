from django.http import JsonResponse, HttpResponseNotFound
from django.http import Http404
from django.core.exceptions import PermissionDenied


class JsonErrorMiddleware:
    API_PREFIX = "/api/"

    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        try:
            response = self.get_response(request)

            # Check if the URL belongs to the API app
            if request.path.startswith(self.API_PREFIX):
                # Check for HttpResponseNotFound
                if isinstance(response, HttpResponseNotFound):
                    error_response = {
                        "status": "error",
                        "message": f"Error processing the request 404: URL Not Found",
                        "data": None,
                    }
                    return JsonResponse(error_response, status=404)

            return response
        except Exception as e:
            return self.process_exception(request, e)

    def process_exception(self, request, exception):
        # Check if the URL belongs to the API app
        if request.path.startswith(self.API_PREFIX):
            if isinstance(exception, Http404):
                # Handle 404 errors
                error_response = {
                    "status": "error",
                    "message": f"Error processing the request 404: {str(exception)}",
                    "data": None,
                }
                return JsonResponse(error_response, status=404)

            elif isinstance(exception, PermissionDenied):
                # Handle permission denied errors
                error_response = {
                    "status": "error",
                    "message": f"Error processing the request 403: {str(exception)}",
                    "data": None,
                }
                return JsonResponse(error_response, status=403)

            # Catch all other exceptions and return a generic JSON response
            error_response = {
                "status": "error",
                "message": f"Error processing the request 500: {str(exception)}",
                "data": None,
            }
            return JsonResponse(error_response, status=500)

        return None  # Continue with the default processing for non-API URLs
