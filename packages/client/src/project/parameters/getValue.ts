import { Value } from '@scrrap/core';

export const getValue = <T>(value: Value): T | undefined => {
  if (value === undefined) {
    return undefined;
  }
  return value as unknown as T;
};
