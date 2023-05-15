import { Injectable } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { User } from '../users/entities/user.entity';
import UserSearchBody from './types/user-search-body.interface';

@Injectable()
export default class SearchService {
  index = 'users';

  constructor(private readonly elasticSearchService: ElasticsearchService) {}

  async indexUser(user: User) {
    return this.elasticSearchService.index<UserSearchBody>({
      index: this.index,
      document: {
        id: user.id,
        username: user.username,
        full_name: user.full_name,
      },
    });
  }

  async searchUser(text: string): Promise<UserSearchBody[]> {
    const body = await this.elasticSearchService.search<UserSearchBody>({
      index: this.index,
      query: {
        bool: {
          should: {
            multi_match: {
              query: text,
              fields: ['username', 'full_name'],
              fuzziness: 'AUTO',
            },
          },
        },
      },
    });
    const hits = body.hits.hits;
    return hits.map((item) => item._source);
  }

  async remove(userId: string) {
    this.elasticSearchService.deleteByQuery({
      index: this.index,
      query: {
        match: {
          id: userId,
        },
      },
    });
  }

  async update(user: User) {
    const newBody: UserSearchBody = {
      id: user.id,
      username: user.username,
      full_name: user.full_name,
    };

    const script = Object.entries(newBody).reduce((result, [key, value]) => {
      return `${result} ctx._source.${key}='${value}';`;
    }, '');

    return this.elasticSearchService.updateByQuery({
      index: this.index,
      query: {
        match: {
          id: user.id,
        },
      },
      script: {
        source: script,
      },
    });
  }
}
