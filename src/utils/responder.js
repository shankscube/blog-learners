const responses = require('../configs/constants').responses;

exports.responseOk = (response, statuscode, data) => {
    response.status(statuscode).json({
        status: true,
        message: responses[statuscode],
        code: statuscode,
        data
    });
}

exports.responseIssues = (response, statuscode) => {
    response.status(statuscode).json({
        status: false,
        message: responses[statuscode],
        code: statuscode,
        data: {}
    });
}
