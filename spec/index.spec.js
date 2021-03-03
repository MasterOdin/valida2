
const { expect } = require('chai');
const Valida = require('../lib/');

describe('basic valida test', () => {
  it('should pass', () => {
    const studentSchema = {
      name: [
        { sanitizer: Valida.Sanitizer.trim },
        { validator: Valida.Validator.required },
      ],
      age: [
        { sanitizer: Valida.Sanitizer.toInt },
        { validator: Valida.Validator.required },
      ],
    };

    const classroomSchema = {
      name: [
        { sanitizer: Valida.Sanitizer.trim },
        { validator: Valida.Validator.required },
      ],
      students: [
        { validator: Valida.Validator.array },
        { validator: Valida.Validator.required },
        { validator: Valida.Validator.schema, schema: studentSchema },
      ],
    };

    const obj = {
      name: 'class 1403',
      students: [
        {
          name: 'Eduardo Nunes',
          age: '32',
        },
        {
          name: 'Paulo Ragonha',
          age: 30,
        },
        {
          name: 'Max Nunes',
          age: 24,
        },
      ],
    };

    const data = Valida.process(obj, classroomSchema);
    expect(data).to.eql({
      name: 'class 1403',
      students: [
        {
          name: 'Eduardo Nunes',
          age: 32,
        },
        {
          name: 'Paulo Ragonha',
          age: 30,
        },
        {
          name: 'Max Nunes',
          age: 24,
        },
      ],
    });
  });
});
