from django.http import HttpResponseNotFound, Http404
from django.shortcuts import render


class JsonErrorMiddleware:
    API_PREFIX = "/api/"

    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        # Check if the URL does not belong to the API app
        if not request.path.startswith(self.API_PREFIX):
            try:
                response = self.get_response(request)

                # Check for HttpResponseNotFound
                if isinstance(response, HttpResponseNotFound):
                    return render(request, "CairoCoinPlus/main/notfound.html")

                return response
            except Exception as e:
                return self.process_exception(request, e)

        return self.get_response(request)

    def process_exception(self, request, exception):
        # Check if the URL does not belong to the API app
        if not request.path.startswith(self.API_PREFIX):
            if isinstance(exception, Http404):
                # Handle 404 errors
                return render(request, "CairoCoinPlus/main/notfound.html")

            return render(request, "CairoCoinPlus/main/forbidden.html")

        return None  # Continue with the default processing for API URLs
