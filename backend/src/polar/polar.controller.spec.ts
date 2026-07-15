import { Test, TestingModule } from '@nestjs/testing';
import { PolarController } from './polar.controller';

describe('PolarController', () => {
  let controller: PolarController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PolarController],
    }).compile();

    controller = module.get<PolarController>(PolarController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
