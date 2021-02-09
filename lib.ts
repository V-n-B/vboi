import Joi from 'joi';
import { values } from 'lodash';

export type Schema = Joi.Schema;
export type ObjectSchema = Joi.ObjectSchema;
export type ValidationError = Joi.ValidationError;

export interface IVoi extends Joi.Root {
    string(): IStringSchema;
    voi(): IVoiSchema;
}

export interface IStringSchema extends Joi.StringSchema {
    simpleEmail(): this;
}

export interface IVoiSchema extends Joi.AnySchema {
    enum<E extends { [P in keyof E]: string }>(jsEnum: E): this;
}

export const Voi: IVoi = Joi.extend(
    {
        type: 'voi',
        messages: {
            'voi.enum': '{{#label}} must be an enum value',
        },
        rules: {
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
