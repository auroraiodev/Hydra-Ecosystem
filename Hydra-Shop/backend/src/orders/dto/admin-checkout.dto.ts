import { IsEnum, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum PaymentMethod {
  WALLET = 'wallet',
  MERCADOPAGO = 'mercadopago',
  TRANSFER = 'transfer',
  GOOGLEPAY = 'googlepay',
  WALLET_PLUS_MERCADOPAGO = 'wallet_plus_mercadopago',
  WALLET_PLUS_TRANSFER = 'wallet_plus_transfer',
}

export enum ShippingMethod {
  PICKUP = 'pickup',
  SHIPPING = 'shipping',
  ARRANGE = 'arrange',
}

export class AdminCheckoutDto {
  @ApiProperty({ enum: ShippingMethod })
  @IsEnum(ShippingMethod)
  @IsNotEmpty()
  shippingMethod: ShippingMethod;

  @ApiProperty({ enum: PaymentMethod })
  @IsEnum(PaymentMethod)
  @IsNotEmpty()
  paymentMethod: PaymentMethod;
}
