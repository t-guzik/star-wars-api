import { plainToInstance } from 'class-transformer';
import { ClassConstructor } from 'class-transformer/types/interfaces';
import { validateSync } from 'class-validator';
import { EnvVariables } from './namespaces';

export const validate =
  (validators: ClassConstructor<EnvVariables>[]) =>
    (config: Record<string, unknown>): EnvVariables => {
      const validatedConfigs = validators.map(cls =>
        plainToInstance(cls, config, {
          enableImplicitConversion: false,
          exposeDefaultValues: true,
          excludeExtraneousValues: true,
          exposeUnsetFields: false,
        }),
      );
      const errorsArray = validatedConfigs.map(vc => validateSync(vc, {skipMissingProperties: false}));
      const errors = errorsArray.reduce((p, c) => [...p, ...c], []);

      if (errors.length > 0) {
        throw new Error(errors.join('\n'));
      }

      return validatedConfigs.reduce((p, c) => ({...p, ...c}), {});
    };
