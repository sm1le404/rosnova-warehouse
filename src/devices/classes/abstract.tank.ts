export abstract class AbstractTank {
  /**
   * Производим инициализацию портов для уровнемеров
   */
  abstract initPorts(): Promise<void>;
  /**
   * Закрытие портов, срабатывает во время отключения модуля
   */
  abstract closePorts(): Promise<void>;
  /**
   * Пытаемся произвести продолжить после перезапуска приложения
   */
  abstract start(): Promise<void>;
  /**
   * Читаем состояние резервуаров
   */
  abstract readTanks(): Promise<void>;

  /**
   * Считываем состояние резервуара
   */
  abstract readCommand(addressId: number, comId: number): Promise<void>;
}
