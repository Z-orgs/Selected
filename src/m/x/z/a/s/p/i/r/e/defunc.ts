import { clean } from 'diacritic';
import { toLower, deburr } from 'lodash';

export const MXZ = (input: string) => toLower(deburr(clean(input)));
