export enum DispenserRVStatus {
  TRK_OFF_RK_ON = 1, // В Ожидании
  INITIALIZE = 2, // Подготовка
  PROCESS = 3, // ТРК включена. Идет отпуск топлива.
  DONE = 4, // ТРК выключена . Отпуск топлива закончен.
  ERROR = 5, //Произошла ошибка
}
