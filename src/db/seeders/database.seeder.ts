import { Visibility } from '@api/deck/deck.enum';
import { Card } from '@api/deck/entities/card.entity';
import { Deck } from '@api/deck/entities/deck.entity';
import { User } from '@api/user/entities/user.entity';
import { UserRole } from '@common/constants/role.enum';
import { faker } from '@faker-js/faker';
import { EntityManager } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';

/**
 * Database's main seeder.
 * MikroORM will automatically call flush() after the run() method is completed.
 */
export class DatabaseSeeder extends Seeder {
  run(em: EntityManager) {
    console.time('🌱 Seeding database');

    em.create(User, {
      username: 'admin',
      email: 'admin@admin.com',
      password: 'password',
      emailVerified: true,
      avatarUrl: faker.image.avatar(),
      role: UserRole.ADMIN,
    });

    for (let i = 0; i < 10; i++) {
      const username =
        faker.internet
          .username()
          .toLowerCase()
          .replace(/[^a-z0-9]/g, '') + i;
      const user = em.create(User, {
        username,
        email: `${username}@example.com`,
        password: 'password',
        avatarUrl: faker.image.avatar(),
        role: i === 0 ? UserRole.ADMIN : UserRole.USER,
      });

      const deckCount = faker.number.int({ min: 1, max: 5 });
      for (let j = 0; j < deckCount; j++) {
        const deckVisibility = faker.helpers.arrayElement([
          Visibility.PUBLIC,
          Visibility.PRIVATE,
          Visibility.PROTECTED,
        ]);

        const deck = em.create(Deck, {
          owner: user,
          name: faker.lorem.words({ min: 2, max: 5 }),
          description: faker.lorem.sentence(),
          visibility: deckVisibility,
          passcode:
            deckVisibility === Visibility.PROTECTED
              ? faker.string.alphanumeric(4)
              : '',
        });

        const cardCount = faker.number.int({ min: 10, max: 100 });
        for (let k = 0; k < cardCount; k++) {
          em.create(Card, {
            deck: deck,
            question: faker.lorem.words({ min: 3, max: 8 }),
            answer: faker.lorem.words({ min: 5, max: 15 }),
          });
        }
      }
    }
    console.timeEnd('🌱 Seeding database');
  }
}
