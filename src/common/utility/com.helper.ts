export class ComHelper {
  static comToNumber(com: string) {
    return Number(com.replace('COM', ''));
  }

  static numberToCom(comId: number) {
    return `COM${comId}`;
  }
}
