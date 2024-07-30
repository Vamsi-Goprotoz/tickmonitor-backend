import { IsJSON, IsNotEmpty, IsUrl } from 'class-validator';

export class CreateDomainDto {
  @IsNotEmpty()
  domainName: string;

  @IsNotEmpty()
  domainId: string;

  @IsUrl()
  domainUrl: string;

  @IsJSON()
  details?: object;

  level?: number;
}
