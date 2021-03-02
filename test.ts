import { assert } from 'chai';
import { ValidationResult } from 'joi';
import 'mocha';
import moment from 'moment';
import { Voi } from './lib';

function assertErrorType(result: ValidationResult, errorType: string) {
    assert.exists(result.error);
    assert.lengthOf(result.error!.details, 1);
    assert.equal(result.error!.details[0].type, errorType);
}

describe('Date validation', () => {
    it('should validate a good date', () => {
        const result = Voi.voi().date().validate('2012-03-01');
        assert.isUndefined(result.error);
    });

    it('should require date to not be an empty string', () => {
        const result = Voi.voi().date().validate('');
        assertErrorType(result, 'voi.date');
    });

    it('should require date to not be a date object', () => {
        const result = Voi.voi().date().validate(new Date());
        assertErrorType(result, 'voi.date');
    });

    it('should require date to not be a moment object', () => {
        const result = Voi.voi().date().validate(moment());
        assertErrorType(result, 'voi.date');
    });

    it('should require date to not be a plain year', () => {
        const result = Voi.voi().date().validate('2012');
        assertErrorType(result, 'voi.date');
    });

    it('should require date to not be a date time', () => {
        const result = Voi.voi().date().validate('2012-03-01 12:00:00');
        assertErrorType(result, 'voi.date');
    });

    it('should require date to not be an exclamation', () => {
        const result = Voi.voi().date().validate('yeah');
        assertErrorType(result, 'voi.date');
    });

    it('should require date to not be an iso date', () => {
        const result = Voi.voi().date().validate('2012-03-01T12:00:00Z');
        assertErrorType(result, 'voi.date');
    });

    it('should require date to not be non-existent', () => {
        const result = Voi.voi().date().validate('2012-02-31');
        assertErrorType(result, 'voi.date');
    });
});

describe('DateTime validation', () => {
    it('should validate a good dateTime', () => {
        const result = Voi.voi().dateTime().validate('2012-03-01 14:15:16');
        assert.isUndefined(result.error);
    });

    it('should require dateTime to not be an empty string', () => {
        const result = Voi.voi().dateTime().validate('');
        assertErrorType(result, 'voi.dateTime');
    });

    it('should require dateTime to not be a date object', () => {
        const result = Voi.voi().dateTime().validate(new Date());
        assertErrorType(result, 'voi.dateTime');
    });

    it('should require dateTime to not be a moment object', () => {
        const result = Voi.voi().dateTime().validate(moment());
        assertErrorType(result, 'voi.dateTime');
    });

    it('should require dateTime to not be a plain year', () => {
        const result = Voi.voi().dateTime().validate('2012');
        assertErrorType(result, 'voi.dateTime');
    });

    it('should require dateTime to not be a plain date', () => {
        const result = Voi.voi().dateTime().validate('2012-03-01');
        assertErrorType(result, 'voi.dateTime');
    });

    it('should require dateTime to not be a word', () => {
        const result = Voi.voi().dateTime().validate('whut');
        assertErrorType(result, 'voi.dateTime');
    });

    it('should require dateTime to not be an iso date', () => {
        const result = Voi.voi().dateTime().validate('2012-03-01T12:00:00Z');
        assertErrorType(result, 'voi.dateTime');
    });

    it('should require dateTime to not be non-existent', () => {
        const result = Voi.voi().dateTime().validate('2012-02-31');
        assertErrorType(result, 'voi.dateTime');
    });
});

describe('End date validation', () => {
    it('should validate a good end date, when the end date is equal to the start date', () => {
        const result = Voi
            .object({ startDate: Voi.voi().date(), endDate: Voi.voi().date().endDate() })
            .validate({ startDate: '2012-03-01', endDate: '2012-03-01' });
        assert.isUndefined(result.error);
    });

    it('should validate a good end date, when the end date is larger than the start date', () => {
        const result = Voi
            .object({ startDate: Voi.voi().date(), endDate: Voi.voi().date().endDate() })
            .validate({ startDate: '2020-03-01', endDate: '2020-03-03' });
        assert.isUndefined(result.error);
    });

    it('should require end date to be larger than or equal to start date', () => {
        const result = Voi
            .object({ startDate: Voi.voi().date(), endDate: Voi.voi().date().endDate() })
            .validate({ startDate: '2020-03-03', endDate: '2020-03-01' });
        assertErrorType(result, 'voi.endDate');
    });

    it('should validate a good end date, when the start date is null', () => {
        const result = Voi
            .object({ startDate: Voi.voi().date().allow(null), endDate: Voi.voi().date().endDate() })
            .validate({ startDate: null, endDate: '2020-03-03' });
        assert.isUndefined(result.error);
    });

    it('should validate a good end date, when the end date is null', () => {
        const result = Voi
            .object({ startDate: Voi.voi().date(), endDate: Voi.voi().date().endDate().allow(null) })
            .validate({ startDate: '2020-03-03', endDate: null });
        assert.isUndefined(result.error);
    });

    it('should require a startDate to not be undefined', () => {
        const result = Voi
            .object({ endDate: Voi.voi().date().endDate() })
            .validate({ endDate: '2020-03-03' });
        assertErrorType(result, 'voi.missingStartDate');
    });
});

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
