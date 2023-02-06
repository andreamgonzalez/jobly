const { BadRequestError } = require("../expressError");

describe("sqlForPartialUpdate", function () {
    test("works: empty dataToUpdate obj", function () {
        try {
            const result = dataToUpdate({}, {firstName: 'first_name', lastName: 'last_name'});
            fail();
          } catch (err) {
            expect(err instanceof BadRequestError).toBeTruthy();
          }
    });

    test("works: dataToUpdate obj", function () {
        const result = dataToUpdate({ firstName: 'Alice', lastName: 'Jones'}, {firstName: 'first_name', lastName: 'last_name'});
        expect(result).toEqual([
            '"first_name"=$1',
            '"last_name"=$2'
        ]);
    });
})
module.exports = { sqlForPartialUpdate };
