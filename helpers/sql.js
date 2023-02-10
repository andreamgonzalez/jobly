const { BadRequestError } = require("../expressError");

  /** Create an array of columns (from dataToUpdate object), 
   * 
   * update the fields as indicated in the jsToSQL object, and return the new array
   *
   * dataToUpdate object should be like { firstName: value, lastName: value }
   *
   * jsToSql object should be { firstName: 'first_name', lastName: 'last_name', ...}
   * 
   * Returns [ '"first_name" = $1', '"last_name" = $2' ]
   *
   * Throws BadRequestError if dataToUpdate object is empty.
   * */


  function sqlForPartialUpdate(dataToUpdate, jsToSql) {
    const keys = Object.keys(dataToUpdate);
    console.log(dataToUpdate);
    if (keys.length === 0) throw new BadRequestError("No data");
  
    // {firstName: 'Aliya', age: 32} => ['"first_name"=$1', '"age"=$2']
    const cols = keys.map((colName, idx) =>
        `"${jsToSql[colName] || colName}"=$${idx + 1}`,
    );
  
    return {
      setCols: cols.join(", "),
      values: Object.values(dataToUpdate),
    };
  }
  /** Takes an object where each k/v pair is an optional param provided from the route for filtering
 *
 * Returns an object that is a SQL query { handle, name, description, numEmployees, logoUrl }, ...]
 * */

  function sqlCompaniesFilter(filterObj) {
    const { handle, minEmployees, maxEmployees } = filterObj;
    let whereClause = '';

    if (handle || minEmployees || maxEmployees) {

      if (minEmployees && maxEmployees ) {
          if( minEmployees > maxEmployees){
            throw new BadRequestError(
              `The minimum number of employees cannot exceed the maximum number of employees.`
            );
          }

      }
      
      //if name exists create name query else empty string
      let nameFilter = handle ? `name ILIKE '%${handle}%'` : '';

      //if minEmployees exists create name query else empty string
      let minFilter = minEmployees ? `${nameFilter ? 'AND ' : ''} num_employees >= ${minEmployees}` : '';
      
      //if minEmployees exists create name query else empty string
      let maxFilter = maxEmployees ? `${nameFilter || minFilter ? 'AND ' : ''}num_employees <= ${maxEmployees}` : '';
  
      // Create WHERE clause with applied filters
      whereClause = ` WHERE ${nameFilter} ${minFilter} ${maxFilter};`;
    }
    return whereClause;
  }

  function sqlJobsFilter(filterObj) {
    const { title, minSalary, hasEquity } = filterObj;
    let whereClause = '';

    if (title || minSalary || hasEquity) {
      
      //if title exists create title query else empty string
      let titleFilter = title ? `title ILIKE '%${title}%'` : '';

      //if minSalary exists create minSalary query else empty string
      let minSalaryFilter = minSalaryFilter ? `${titleFilter ? 'AND ' : ''} salary >= ${minSalary}` : '';
      
      //if minEquity exists create name query else empty string   
      let hasEquityFilter = hasEquity === true ? `${titleFilter || minSalary ? 'AND ' : ''} equity >= 0` : '';
  
      // Create WHERE clause with applied filters
      whereClause = ` WHERE ${titleFilter} ${minSalaryFilter} ${hasEquityFilter};`;
    }
    return whereClause;
  }

module.exports = { sqlForPartialUpdate, sqlCompaniesFilter, sqlJobsFilter };
