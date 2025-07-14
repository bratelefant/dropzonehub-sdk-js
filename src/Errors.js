export const Errors = {
  400: new Error(
    "Bad Request: The request could not be understood or was missing required parameters."
  ),
  401: new Error("Unauthorized: API key is required."),
  403: new Error(
    "Forbidden: You do not have permission to access this resource."
  ),
  404: new Error("Not Found: The requested resource could not be found."),
  500: new Error(
    "Internal Server Error: An unexpected error occurred on the server."
  ),
  resError: async (res) => {
    const body = await res.json();

    return new Error(
      `Status: ${res.status}; StatusText: ${res.statusText}; ErrorType: ${
        body.message || "Unknown error"
      }. ErrorData: ${
        JSON.stringify(body.data) || "No additional data available."
      }`
    );
  },
};
