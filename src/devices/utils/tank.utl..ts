/**
 * Получаем контрольную строку с младшим байтом
 * @param buffer
 */
export const crc16 = (buffer: Buffer) => {
  let crc = 0xffff;
  let odd;

  for (let i = 0; i < buffer.length; i++) {
    crc = crc ^ buffer[i];

    for (let j = 0; j < 8; j++) {
      odd = crc & 0x0001;
      crc = crc >> 1;
      if (odd) {
        crc = crc ^ 0xa001;
      }
    }
  }

  return crc;
};

/**
 * Получаем контрольную строку со старшим байтом
 * @param buffer
 */
export const crc16top = (buffer: Buffer) => {
  const src = crc16(buffer);
  return (src << 8) | (src >> 8);
};

/**
 * Таким образом обрабатываем данные приходящие со стрелы по каждому параметру
 * 5,6 === 0 значит с параметром все ок
 * @param payload
 */
export const getFloatFromArr = (payload: Array<any>): number => {
  if (
    Array.isArray(payload) &&
    payload.length == 6 &&
    payload[4] == 0 &&
    payload[5] == 0
  ) {
    const reordered = new Uint8Array([
      payload[2],
      payload[3],
      payload[0],
      payload[1],
    ]);
    return new DataView(reordered.buffer).getFloat32(0);
  }
  return 0;
};
