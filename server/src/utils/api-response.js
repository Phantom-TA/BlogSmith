class ApiResponse{
    constructor(statusCode,data, message="Success") {
        this.statusCode = statusCode;
        this.data = data;
        this.message = (statusCode < 400) ? message : "Something went wrong";
        this.success = statusCode < 400; // Assuming status codes < 400 are successful
    }
}
export {ApiResponse}
 