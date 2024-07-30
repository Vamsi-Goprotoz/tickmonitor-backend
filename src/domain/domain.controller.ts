import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CreateDomainDto } from './dto/create-domain.dto';
import { DomainService } from './domain.service';

@Controller('domains')
export class DomainController {
  constructor(private readonly domainService: DomainService) {}
  @Post()
  create(@Body() body: CreateDomainDto) {
    return this.domainService.create(body);
  }

  @Get(':id/users')
  getAllUsers(@Param('id') id: string) {
    return this.domainService.findAllUsersByDomain(id);
  }

  @Get(':id/verticals')
  getAllVerticals(@Param('id') id: string) {
    return this.domainService.findAllVerticalsByDomain(id);
  }

  @Get()
  getAll() {
    return this.domainService.findAll();
  }
}
