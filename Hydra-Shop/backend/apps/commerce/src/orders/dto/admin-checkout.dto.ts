import { IsEnum, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum AdminCheckoutPaymentMethod {
  WALLET = 'wallet',
  MERCADOPAGO = 'mercadopago',
  TRANSFER = 'transfer',
  GOOGLEPAY = 'googlepay',
  WALLET_PLUS_MERCADOPAGO = 'wallet_plus_mercadopago',
  WALLET_PLUS_TRANSFER = 'wallet_plus_transfer',
}

export enum AdminCheckoutShippingMethod {
  PICKUP = 'pickup',
  SHIPPING = 'shipping',
  ARRANGE = 'arrange',
}

export class AdminCheckoutDto {
  @ApiProperty({ enum: AdminCheckoutShippingMethod })
  @IsEnum(AdminCheckoutShippingMethod)
  @IsNotEmpty()
  shippingMethod: AdminCheckoutShippingMethod;

  @ApiProperty({ enum: AdminCheckoutPaymentMethod })
  @IsEnum(AdminCheckoutPaymentMethod)
  @IsNotEmpty()
  paymentMethod: AdminCheckoutPaymentMethod;
}
