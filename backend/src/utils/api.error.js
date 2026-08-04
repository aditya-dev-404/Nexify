class ApiError extends Error{
    constructor(status, message = "Something Went Wrong"){
        super(message);
        this.status = status;
        this.success = status < 400;
    }
}

export default ApiError