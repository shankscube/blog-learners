const responses = require("../configs/constants").responses;

exports.responseOk = (response, statuscode, data) => {
  response.status(200).json({
    status: true,
    message: responses[statuscode],
    code: statuscode,
    data,
  });
};

exports.responseIssues = (response, statuscode) => {
  response.status(500).json({
    status: false,
    message: responses[statuscode],
    code: statuscode,
    data: {},
  });
};
