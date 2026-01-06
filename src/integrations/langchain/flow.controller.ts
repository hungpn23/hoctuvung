import { ApiPublicEndpoint } from '@common/decorators/api-endpoint.decorator';
import { StoreService } from '@integrations/langchain/store.service';
import { Body, Controller, Get, Post } from '@nestjs/common';

@Controller('flow')
export class FlowController {
  constructor(private readonly storeService: StoreService) {}

  @ApiPublicEndpoint()
  @Get('ingest')
  async ingestData() {
    return await this.storeService.ingestData();
  }

  @ApiPublicEndpoint()
  @Post('search')
  async search(@Body() body: { query: string }) {
    return await this.storeService.similaritySearch(body.query, 1);
  }
}
