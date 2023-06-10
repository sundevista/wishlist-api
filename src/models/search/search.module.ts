import { Module } from '@nestjs/common';
import { ElasticSearchModule } from '../../core/elasticsearch/elasticsearch.module';
import SearchService from './search.service';

@Module({
  imports: [ElasticSearchModule],
  providers: [SearchService],
  exports: [SearchService],
})
export class SearchModule {}
