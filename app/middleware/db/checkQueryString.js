const { buildErrObject } = require('../../middleware/utils')

/**
 * Checks the query string for filtering records
 * query.filter should be the text to search (string)
 * query.fields should be the fields to search into (array)
 * @param {Object} query - query object
 */
const checkQueryString = (query = {}) => {
  return new Promise((resolve, reject) => {
    try {
      if (
        typeof query.filter !== 'undefined' &&
        typeof query.fields !== 'undefined'
      ) {
        const data = {
          $and: []
        }
        const array = []
        // Takes fields param and builds an array by splitting with ','
        const arrayFields = query.fields.split(',')
        const arrayFilter = query.filter.split(',')
        // Adds SQL Like %word% with regex
        arrayFields.map((item, index) => {
          array.push({
            [item]: {
              $regex: new RegExp(arrayFilter[index], 'i')
            }
          })
        })
        // Puts array result in data
        data.$and = array
        resolve(data)
      } else {
        resolve({})
      }
    } catch (err) {
      console.log(err.message)
      reject(buildErrObject(422, 'ERROR_WITH_FILTER'))
    }
  })
}

module.exports = { checkQueryString }
