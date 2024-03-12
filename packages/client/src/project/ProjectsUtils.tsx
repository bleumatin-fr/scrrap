import { Project } from '@scrrap/core';

export const sortByDate = (a: Project, b: Project) => {
  return (
    (new Date(b.updatedAt) || new Date(b.createdAt)).getTime() -
    (new Date(a.updatedAt) || new Date(a.createdAt)).getTime()
  );
};
