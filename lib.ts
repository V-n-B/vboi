import Joi from 'joi';
import { values } from 'lodash';
import moment from 'moment';

export interface IVoi extends Joi.Root {
    string(): IStringSchema;
    voi(): IVoiSchema;
}

export interface IStringSchema extends Joi.StringSchema {
    simpleEmail(): this;
}

export interface IVoiSchema extends Joi.AnySchema {
    date(): this;
    dateTime(): this;
    endDate(): this;
    enum<E extends { [P in keyof E]: string }>(jsEnum: E): this;
}

export const Voi: IVoi = Joi.extend(
    {
        type: 'voi',
        messages: {
            'voi.enum': '{{#label}} must be an enum value',
            'voi.date': '{{#label}} must to be a valid date string',
            'voi.dateTime': '{{#label}} must be a valid dateTime string',
            'voi.endDate': '{{#label}} must be larger than or equal to start date',
            'voi.missingStartDate': 'The startDate field is missing',
        },
        rules: {
            date: {
                validate(value: any, helpers: any, args: {}, options: any) {
                    if (typeof value === 'string' && moment(value, 'YYYY-MM-DD', true).isValid()) {
                        return value;
                    }
                    return helpers.error('voi.date');
                },
            },
            dateTime: {
                validate(value: any, helpers: any, args: {}, options: any) {
                    if (typeof value === 'string' && moment(value, 'YYYY-MM-DD HH:mm:ss', true).isValid()) {
                        return value;
                    }
                    return helpers.error('voi.dateTime');
                },
            },
            endDate: {
                validate(value: any, helpers: any, args: {}, options: any) {
                    if (helpers.state.ancestors[0].startDate === undefined) {
                        return helpers.error('voi.missingStartDate');
                    } else if (helpers.state.ancestors[0].startDate === null || value === null) {
                        return value;
                    } else if (moment(value).isSameOrAfter(helpers.state.ancestors[0].startDate)) {
                        return value;
                    } else {
                        return helpers.error('voi.endDate');
                    }
                },
            },
            enum: {
                method(jsEnum: any) {
                    return this.$_addRule({ name: 'enum', args: { jsEnum } });
                },
                args: [
                    {
                        name: 'jsEnum',
                        ref: true,
                        assert: Joi.object().pattern(/.*/, Joi.string().required()),
                        message: 'must be an enum',
                    },
                ],
                validate(value: any, helpers: any, args: Record<string, any>, options: any) {
                    if (values(args.jsEnum).indexOf(value) >= 0) {
                        return value;
                    }
                    return helpers.error('voi.enum');
                },
            },
        },
    },
    {
        type: 'string',
        base: Joi.string(),
        messages: {
            'string.simpleEmail': '{{#label}} needs to be a valid email address',
        },
        rules: {
            simpleEmail: {
                method() {
                    return this.$_addRule('simpleEmail');
                },
                validate(value: any, helpers: any, args: Record<string, any>, options: any) {
                    if (typeof value === 'string' && /^.+@.+$/.test(value)) {
                        return value;
                    } else {
                        return helpers.error('string.simpleEmail');
                    }
                },
            },
        },
    },
);
