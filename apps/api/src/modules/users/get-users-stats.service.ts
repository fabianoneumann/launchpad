import type { UserStats, UsersRepository } from '@/repositories/users-repository'

export class GetUsersStatsService {
  constructor(private usersRepository: UsersRepository) {}

  async execute(): Promise<UserStats> {
    return this.usersRepository.stats()
  }
}
