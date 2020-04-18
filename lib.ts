import Joi from '@hapi/joi';
import { values } from 'lodash';

export interface IVoi extends Joi.Root {
    voi(): IVoiSchema;
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
);
