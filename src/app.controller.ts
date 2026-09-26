import {
  Controller,
  Get,
  NotFoundException,
  Param,
  Res,
  StreamableFile,
} from '@nestjs/common';
import { AppService } from './app.service';
import { createReadStream, existsSync } from 'fs';
import { basename, extname, join } from 'path';
import { Response } from 'express';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): { id: number; name: string } {
    return this.appService.getHello();
  }

  // сразу же скачивать файл
  // @Get('uploads/:filename')
  // getFile(@Param('filename') filename: string): StreamableFile {
  //   const file = createReadStream(join(process.cwd(), 'uploads/', filename));
  //   return new StreamableFile(file);
  // }

  // автоматически просматривать файл
  @Get('uploads/:filename')
  getFile(
    @Param('filename') filename: string,
    @Res({ passthrough: true }) res: Response,
  ): StreamableFile {
    const safeName = basename(filename);
    const filePath = join(process.cwd(), 'uploads', safeName);

    if (!existsSync(filePath)) {
      throw new NotFoundException('Файл не найден');
    }
    res.type(extname(safeName));
    res.setHeader('Content-Disposition', `inline; filename="${safeName}"`);

    return new StreamableFile(createReadStream(filePath));
  }
}
