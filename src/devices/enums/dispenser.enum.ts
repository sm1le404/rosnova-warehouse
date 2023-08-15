export enum DispenserStatusEnum {
  READY = 1 << 1,
  MESSAGE_COMPLETE = 1 << 2,
  MESSAGE_SEND = 1 << 3,
  DISABLE = 1 << 4,
  ENABLE = 1 << 5,
}

export enum DispenserCommand {
  STATUS = 0x31, // Запрос статуса ТРК
  INIT = 0x32, // Санкционирование ТРК
  FLUSH = 0x33, // Сброс ТРК
  GET_CURRENT_STATUS = 0x34, // Запрос текущих данных отпуска топлива
  GET_CURRENT_FULL_STATUS = 0x35, // Запрос полных данных отпуска топлива
  GET_SUMMARY_STATE = 0x36, // Запрос показаний суммарников
  GET_TYPE_TRK = 0x37, // Запрос типа ТРК
  APPROVE_LITRES = 0x38, //	Подтверждение записи итогов отпуска
  SET_PRICE = 0x51, //	Установка цены за топливо
  SET_LITRES = 0x54, //	Установка дозы отпуска топлива в литрах
  START_DROP = 0x56, //	Безусловный старт раздачи
  CHECK_LITRES = 0x58, // Запрос количества литров
}

export enum DispenserBytes {
  DEL = 0x7f,
  START_BYTE = 0x02, // Стартовый байт
  LINE_NUMBER = 0x20,
  STOP_BYTE = 0x03,
  ACK = 0x06, // Ответ ТРК – данные приняты, команда выполнена
  NAK = 0x15, //Ответ ТРК – – данные не приняты, т. е.
  // при полностью корректном запросе от СУ принята команда, не входящая в перечень команд СУ
  CAN = 0x18, // Ответ ТРК – данные приняты правильно, но выполнить команду нет возможности,
  // т. е. от СУ поступила команда , которую в данный момент времени выполнять нельзя
}

export enum DispenserStatus {
  TRK_OFF_RK_ON = 0x30,
  TRK_OFF_RK_OFF = 0x31,
  INITIALIZE = 0x32,
  PROCESS = 0x33,
  DONE = 0x34,
  MANUAL_MODE = 0x35,
}
