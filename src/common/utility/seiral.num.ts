const si = require('systeminformation');
const crypto = require('crypto');

export async function getMotherBoardCode(): Promise<string> {
  let base = '';
  try {
    const motherboardData = await si.system();
    base = motherboardData.uuid;
  } catch (err) {}
  return crypto.createHash('md5').update(base).digest('hex');
}
