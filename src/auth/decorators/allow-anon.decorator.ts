import { SetMetadata } from '@nestjs/common';

export const ALLOW_ANON_KEY = 'allow-anon';
export const AllowAnon = (): any => SetMetadata(ALLOW_ANON_KEY, true);
