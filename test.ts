import { assert } from 'chai';
import { ValidationResult } from 'joi';
import 'mocha';
import { Voi } from './lib';

function assertErrorType(result: ValidationResult, errorType: string) {
    assert.exists(result.error);
    assert.lengthOf(result.error!.details, 1);
    assert.equal(result.error!.details[0].type, errorType);
}

describe('Enum validation', () => {
    enum Dnd {
        roll20 = 'roll20',
        dungeons = 'dungeons',
        dragons = 'dragons',
    }

    it('should validate a good enum value', () => {
        const result = Voi.voi().enum(Dnd).validate('roll20');
        assert.notExists(result.error);
    });

    it('should not validate null', () => {
        const result = Voi.voi().enum(Dnd).validate(null);
        assertErrorType(result, 'voi.enum');
    });

    it('should not validate an enum object', () => {
        const result = Voi.voi().enum(Dnd).validate(Dnd);
        assertErrorType(result, 'voi.enum');
    });

    it('should not validate an empty object', () => {
        const result = Voi.voi().enum(Dnd).validate({});
        assertErrorType(result, 'voi.enum');
    });

    it('should not validate another random object', () => {
        const result = Voi.voi().enum(Dnd).validate({ foo: 'bar' });
        assertErrorType(result, 'voi.enum');
    });

    it('should not validate an empty string', () => {
        const result = Voi.voi().enum(Dnd).validate('');
        assertErrorType(result, 'voi.enum');
    });

    it('should not validate a bad enum value', () => {
        const result = Voi.voi().enum(Dnd).validate('foo');
        assertErrorType(result, 'voi.enum');
    });
});

describe('Simple email validation', () => {
    it('should validate a good email address', () => {
        const result = Voi.string().simpleEmail().validate('test@example.com');
        assert.isUndefined(result.error);
    });

    it('should validate an email address with weird characters', () => {
        const result = Voi.string().simpleEmail().validate('teઞȹ3@லstދ@eષxaǭĕǮݩݪmpl@e.com');
        assert.isUndefined(result.error);
    });

    it('should require a simpleEmail to have an @ symbol', () => {
        const result = Voi.string().simpleEmail().validate('testexample.com');
        assertErrorType(result, 'string.simpleEmail');
    });

    it('should require a char before the @ symbol', () => {
        const result = Voi.string().simpleEmail().validate('@testexample.com');
        assertErrorType(result, 'string.simpleEmail');
    });

    it('should require a char after the @ symbol', () => {
        const result = Voi.string().simpleEmail().validate('testexample.com@');
        assertErrorType(result, 'string.simpleEmail');
    });
});
