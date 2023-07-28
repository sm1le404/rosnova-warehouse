import { Operation } from '../../operations/entities/operation.entity';

export const findDispenserIndices = (operations: Operation[]): number[] => {
  const indices: Record<number, number> = {};

  return operations.reduce((result, item, index) => {
    const id = item.dispenser?.id;
    if (indices[id] === undefined) {
      indices[id] = index;
      result.push(index);
    }
    return result;
  }, [] as number[]);
};
