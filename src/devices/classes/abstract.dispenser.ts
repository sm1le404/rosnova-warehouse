import { DispenserFixOperationDto } from '../dto/dispenser.fix.operation.dto';
import { DispenserGetFuelDto } from '../dto/dispenser.get.fuel.dto';
import { DispenserCommandInterface } from '../dto/dispenser.command.interface';

export abstract class AbstractDispenser {
  /**
   * Производим инициализацию портов, во время отработки конструктора
   */
  abstract initPorts(): Promise<void>;
  /**
   * Закрытие портов, срабатывает во время отключения модуля
   */
  abstract closePorts(): Promise<void>;
  /**
   * Фиксируем результат выполнения операции
   */
  abstract doneOperation(payload: DispenserFixOperationDto): Promise<void>;
  /**
   * Инициируем слив топлива с колонки
   */
  abstract drainFuel(payload: DispenserGetFuelDto): Promise<void>;

  /**
   * Пытаемся произвести продолжиь после перезапуска приложения
   */
  abstract start(): Promise<void>;

  /**
   * Обновляем состояние суммарников
   */
  abstract updateDispenserSummary(): Promise<void>;
  /**
   * Обновляем статус колонок
   */
  abstract updateDispenserStatuses(): Promise<void>;

  /**
   * Вызов произвольной команды на девайсе
   */
  abstract callCommand(payload: DispenserCommandInterface): Promise<any>;
}
