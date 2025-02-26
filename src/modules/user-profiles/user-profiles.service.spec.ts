import { Test, TestingModule } from '@nestjs/testing';
import { UserProfilesService } from './user-profiles.service';

describe('UserProfilesService', () => {
  let service: UserProfilesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserProfilesService],
    }).compile();

    service = module.get<UserProfilesService>(UserProfilesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
