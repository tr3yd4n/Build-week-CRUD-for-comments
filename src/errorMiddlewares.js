export const badRequestMiddleware = (err, req, res, next) => {
    if (err.status === 400) {
      res.status(400).send(err.errorsList)
    } else {
      console.log(err);
      next(err)
    }
  }

  export const notFoundMiddleware = (err, req, res, next) => {
    if (err.status === 404) {
      res.status(404).send({ successful: false, message: err.message })
    } else {
      console.log(err)
      next(err)
    }
  }
  
  export const catchAllErrorsMiddleware = (err, req, res, next) => {
    console.log(err)
    res.status(500).send("Generic Server Error")
  }