import { Controller } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";

@ApiTags('Report')
@Controller('report')
export class ReportController {}