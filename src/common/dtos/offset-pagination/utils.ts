import { plainToInstance } from 'class-transformer';
import { MetadataDto, QueryDto } from './offset-pagination.dto';

export function createMetadata(totalRecords: number, query: QueryDto) {
  const take = query.take;

  const totalPages = take > 0 ? Math.ceil(totalRecords / take) : 0;

  const currentPage = query.page;

  const nextPage = currentPage < totalPages ? currentPage + 1 : undefined;

  const previousPage =
    currentPage > 1 && currentPage - 1 < totalPages
      ? currentPage - 1
      : undefined;

  return plainToInstance(MetadataDto, {
    take,
    totalRecords,
    totalPages,
    currentPage,
    nextPage,
    previousPage,
  });
}

// export async function paginate<>(
//   builder: SelectQueryBuilder<Entity>,
//   query: OffsetPaginationQueryDto,
// ) {
//   const { skip, take, order, search } = query;

//   if (search) {
//     builder
//       .where('set.name LIKE :name', { name: `%${search.trim()}%` })
//       .orWhere('set.description LIKE :description', {
//         description: `%${search.trim()}%`,
//       });
//   }

//   builder.skip(skip).take(take).orderBy(`${builder.alias}.createdAt`, order);

//   const [entities, totalRecords] = await builder.getManyAndCount();

//   return plainToInstance(OffsetPaginatedDto<Entity>, {
//     data: entities,
//     metadata: genOffsetMetadata(totalRecords, query),
//   });
// }
