const validationSchema = require('./schemas/photo.schema')

exports.validate = (body) => {
  try {
    /* Check required fields */
    validationSchema.required.forEach(field => {
      if (!body[field]) {
        throw `Missing required field: ${field}`
      }
    })

    /* Validate each field against schema */
    Object.entries(body).forEach(field => {
      for (const prop in validationSchema.properties[field[0]]) {
        const { type, minLength, maxLength, pattern } = validationSchema.properties[field[0]]
        const value = body[field[0]]

        switch(prop) {
          case 'type':
            if (typeof value !== type) {
              throw `Field '${field[0]}' type is ${typeof body[field[0]]}. Expected type is ${type}.`
            }
            break
          case 'minLength':
            if (value.length < minLength) {
              throw `Value of field '${field[0]}' is shorter than minLength (${minLength})`
            }
            break
          case 'maxLength':
            if (value.length > maxLength) {
              throw `Value of field '${field[0]}' is longer than maxLength (${maxLength})`
            }
            break
          case 'pattern':
            if (!pattern.test(value)) {
              throw `Value of field '${field[0]}' does not meet regexp matching criteria.`
            }
        }
      }
    })
  }
  catch (err) {
    return err
  }
}

exports.escape = (inputField) => {
  return inputField
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/'/g, '&quot;')
    .replace(/'/g, '&#039;');
}
