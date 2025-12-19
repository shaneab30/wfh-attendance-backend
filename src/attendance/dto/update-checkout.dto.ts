import { IsString, IsNotEmpty } from 'class-validator';

export class UpdateCheckoutDto {
  @IsString()
  @IsNotEmpty()
  check_out_time: string;
}
