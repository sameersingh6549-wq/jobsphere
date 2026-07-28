from rest_framework.views import exception_handler
from rest_framework.response import Response
from rest_framework import status

def custom_exception_handler(exc, context):
    """
    Custom DRF Exception Handler to return standardized JSON error format:
    {
        "status": "error",
        "message": "Error summary",
        "errors": { ... detail dict ... }
    }
    """
    response = exception_handler(exc, context)

    if response is not None:
        custom_data = {
            "status": "error",
            "message": "An error occurred while processing your request.",
            "errors": response.data
        }

        if isinstance(response.data, dict) and "detail" in response.data:
            custom_data["message"] = str(response.data["detail"])
            del custom_data["errors"]["detail"]
        elif isinstance(response.data, list):
            custom_data["message"] = str(response.data[0])

        response.data = custom_data

    return response
