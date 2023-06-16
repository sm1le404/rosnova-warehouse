export const chunk = (data: Array<any>, chunkCount: number) => {
  let chunks: Array<any> = [];
  while (data.length) {
    chunks.push(data.splice(0, chunkCount));
  }
  return chunks;
};
