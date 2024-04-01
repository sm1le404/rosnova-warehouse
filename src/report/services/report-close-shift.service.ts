import { Injectable } from '@nestjs/common';
import { GetClosingReportDto } from '../dto/get-closing-report.dto';
import * as ExcelJS from 'exceljs';
import path from 'path';
import { InjectRepository } from '@nestjs/typeorm';
import { Fuel } from '../../fuel/entities/fuel.entity';
import { In, Repository } from 'typeorm';
import { FuelHolder } from '../../fuel-holder/entities/fuel-holder.entity';
import { valueRound } from '../utils';

@Injectable()
export class ReportCloseShiftService {
  constructor(
    @InjectRepository(Fuel)
    private fuelRepository: Repository<Fuel>,
    @InjectRepository(FuelHolder)
    private fuelHolderRepository: Repository<FuelHolder>,
  ) {}

  async generate(payload: GetClosingReportDto[]): Promise<ExcelJS.Workbook> {
    const workbook = new ExcelJS.Workbook();
    workbook.created = new Date();
    await workbook.xlsx.readFile(
      path.join(
        __dirname,
        '..',
        '..',
        'assets',
        'closing-report-template.xlsx',
      ),
    );
    const worksheet = workbook.getWorksheet('page');

    const startPosition = 3;

    const fuelList = await this.fuelRepository.find({
      where: { id: In(payload.map((p) => p.tank.fuel.id)) },
      withDeleted: true,
    });

    const fuelHolderList = await this.fuelHolderRepository.find({
      where: { id: In(payload.map((p) => p.tank.fuelHolder.id)) },
      withDeleted: true,
    });

    payload.forEach((e, i) => {
      const fuel = fuelList.find((f) => f.id === e.tank.fuel.id);
      const fuelHolder = fuelHolderList.find(
        (f) => f.id === e.tank.fuelHolder.id,
      );
      const tankData = `${e.tank.sortIndex}. ${fuel?.name ?? ''} - ${
        fuelHolder?.shortName ?? ''
      }`;

      worksheet.getCell(`A${startPosition + i}`).value = tankData;

      worksheet.getCell(`B${startPosition + i}`).value = `${valueRound(
        e.oldMeasurement.volume,
      )}`;

      worksheet.getCell(`C${startPosition + i}`).value = `${valueRound(
        e.oldMeasurement.weight,
      )}`;

      worksheet.getCell(`D${startPosition + i}`).value = `${valueRound(
        e.incomesSum.volume,
      )}`;

      worksheet.getCell(`E${startPosition + i}`).value = `${valueRound(
        e.incomesSum.weight,
      )}`;

      worksheet.getCell(`F${startPosition + i}`).value = `${valueRound(
        e.incomesSum.docVolume,
      )}`;

      worksheet.getCell(`G${startPosition + i}`).value = `${valueRound(
        e.incomesSum.docWeight,
      )}`;

      worksheet.getCell(`H${startPosition + i}`).value = `${valueRound(
        e.outcomesSum.volume,
      )}`;

      worksheet.getCell(`I${startPosition + i}`).value = `${valueRound(
        e.outcomesSum.weight,
      )}`;

      worksheet.getCell(`J${startPosition + i}`).value = `${valueRound(
        e.outcomesSum.docVolume,
      )}`;

      worksheet.getCell(`K${startPosition + i}`).value = `${valueRound(
        e.outcomesSum.docWeight,
      )}`;

      worksheet.getCell(`L${startPosition + i}`).value = `${valueRound(
        e.tank.volume,
      )}`;

      worksheet.getCell(`M${startPosition + i}`).value = `${valueRound(
        e.tank.weight,
      )}`;

      worksheet.getCell(`N${startPosition + i}`).value = `${valueRound(
        e.tank.docVolume,
      )}`;

      worksheet.getCell(`O${startPosition + i}`).value = `${valueRound(
        e.tank.docWeight,
      )}`;

      worksheet.getCell(
        `P${startPosition + i}`,
      ).value = `${e.newMeasurement.level}`;

      worksheet.getCell(`Q${startPosition + i}`).value = `${valueRound(
        e.newMeasurement.density,
      )}`;

      worksheet.getCell(`R${startPosition + i}`).value = `${valueRound(
        e.newMeasurement.volume,
      )}`;

      worksheet.getCell(`S${startPosition + i}`).value = `${valueRound(
        e.newMeasurement.weight,
      )}`;

      worksheet.getCell(`T${startPosition + i}`).value = `${valueRound(
        e.newMeasurement.volume * e.newMeasurement.density -
          (e.oldMeasurement.weight +
            e.incomesSum.weight +
            e.outcomesSum.weight),
        0,
      )}`;
    });

    const summaryPosition = startPosition + payload.length;

    // Итоговые суммы
    worksheet.getCell(`A${summaryPosition}`).value = 'ИТОГО';
    worksheet.getCell(`B${summaryPosition}`).value = valueRound(
      payload.reduce(
        // eslint-disable-next-line no-param-reassign
        (acc, e) => (acc += e.oldMeasurement.volume),
        0,
      ),
    );
    worksheet.getCell(`C${summaryPosition}`).value = valueRound(
      payload.reduce(
        // eslint-disable-next-line no-param-reassign
        (acc, e) => (acc += e.oldMeasurement.weight),
        0,
      ),
    );
    worksheet.getCell(`D${summaryPosition}`).value = valueRound(
      payload.reduce(
        // eslint-disable-next-line no-param-reassign
        (acc, e) => (acc += e.incomesSum.volume),
        0,
      ),
    );
    worksheet.getCell(`E${summaryPosition}`).value = valueRound(
      payload.reduce(
        // eslint-disable-next-line no-param-reassign
        (acc, e) => (acc += e.incomesSum.weight),
        0,
      ),
    );
    worksheet.getCell(`F${summaryPosition}`).value = valueRound(
      payload.reduce(
        // eslint-disable-next-line no-param-reassign
        (acc, e) => (acc += e.incomesSum.docVolume),
        0,
      ),
    );
    worksheet.getCell(`G${summaryPosition}`).value = valueRound(
      payload.reduce(
        // eslint-disable-next-line no-param-reassign
        (acc, e) => (acc += e.incomesSum.docWeight),
        0,
      ),
    );
    worksheet.getCell(`H${summaryPosition}`).value = valueRound(
      payload.reduce(
        // eslint-disable-next-line no-param-reassign
        (acc, e) => (acc += e.outcomesSum.volume),
        0,
      ),
    );
    worksheet.getCell(`I${summaryPosition}`).value = valueRound(
      payload.reduce(
        // eslint-disable-next-line no-param-reassign
        (acc, e) => (acc += e.outcomesSum.weight),
        0,
      ),
    );
    worksheet.getCell(`J${summaryPosition}`).value = valueRound(
      payload.reduce(
        // eslint-disable-next-line no-param-reassign
        (acc, e) => (acc += e.outcomesSum.docVolume),
        0,
      ),
    );
    worksheet.getCell(`K${summaryPosition}`).value = valueRound(
      payload.reduce(
        // eslint-disable-next-line no-param-reassign
        (acc, e) => (acc += e.outcomesSum.docWeight),
        0,
      ),
    );
    worksheet.getCell(`L${summaryPosition}`).value = valueRound(
      payload.reduce(
        // eslint-disable-next-line no-param-reassign
        (acc, e) => (acc += e.tank.volume),
        0,
      ),
    );
    worksheet.getCell(`M${summaryPosition}`).value = valueRound(
      payload.reduce(
        // eslint-disable-next-line no-param-reassign
        (acc, e) => (acc += e.tank.weight),
        0,
      ),
    );
    worksheet.getCell(`N${summaryPosition}`).value = valueRound(
      payload.reduce(
        // eslint-disable-next-line no-param-reassign
        (acc, e) => (acc += e.tank.docVolume),
        0,
      ),
    );
    worksheet.getCell(`O${summaryPosition}`).value = valueRound(
      payload.reduce(
        // eslint-disable-next-line no-param-reassign
        (acc, e) => (acc += e.tank.docWeight),
        0,
      ),
    );
    worksheet.getCell(`R${summaryPosition}`).value = valueRound(
      payload.reduce(
        // eslint-disable-next-line no-param-reassign
        (acc, e) => (acc += e.newMeasurement.volume),
        0,
      ),
    );
    worksheet.getCell(`S${summaryPosition}`).value = valueRound(
      payload.reduce(
        // eslint-disable-next-line no-param-reassign
        (acc, e) => (acc += e.newMeasurement.weight),
        0,
      ),
    );

    return workbook;
  }
}
