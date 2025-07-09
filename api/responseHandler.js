function successResponse(res, data) {
  res.json({ status: 200, data });
}

function errorResponse(res, errorMessage) {
  res.status(500).json({ status: 500, data: [{ error: errorMessage }] });
}

module.exports = { successResponse, errorResponse };
