export class DispenserHelper {
  static getLitres = (responseStatus: Array<any>): number => {
    const litresPacket = Buffer.from(responseStatus)
      .slice(4, 13)
      .filter((e, index) => index % 2 == 0);
    return parseInt(litresPacket.toString());
  };

  static getSummaryLitres = (responseStatus: Array<any>): number => {
    const litresPacket = Buffer.from(responseStatus)
      .slice(4, 17)
      .filter((e, index) => index % 2 == 0);
    return parseInt(litresPacket.toString());
  };
}
