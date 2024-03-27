/* 
    PRE MAP
*/
export interface PreMapInput {
  data: Datum[];
}

export interface Datum {
  'order-date': string;
  'created-by': string;
  'original-order-no': string;
  currency: string;
  'customer-locale': string;
  taxation: string;
  'invoice-no': string;
  customer: Customer;
  status: DatumStatus;
  'current-order-no': string;
  'product-lineitems': ProductLineitems;
  productLineItems?: ProductLineitem[];
  'shipping-lineitems': ShippingLineitems;
  shipments: Shipments;
  totals: DatumTotals;
  payments: Payments;
  remoteHost: string;
  'custom-attributes'?: DatumCustomAttributes;
  'order-no': string;
  paymentMethod?: string;
  etailDiscountCode?: string;
  discountrate?: string;
  pnReference?: string;
}

export interface DatumCustomAttributes {
  'custom-attribute': DatumCustomAtrribute[];
}

export interface DatumCustomAtrribute {
  'attribute-id': string;
  '&txt': string;
}

export interface Customer {
  'customer-no'?: string;
  'customer-name'?: string;
  'customer-email'?: string;
  'billing-address': IngAddress;
}

export interface IngAddress {
  'first-name': string;
  'last-name': string;
  address1: string;
  city: string;
  'postal-code': string;
  'state-code': string;
  'country-code': string;
  phone: string;
  'custom-attributes'?: BillingAddressCustomAttributes;
}

export interface BillingAddressCustomAttributes {
  'custom-attribute': { [key: string]: string };
}

export interface Payments {
  payment?: Payment[];
}

export interface Payment {
  'custom-method'?: CustomMethod;
  amount: string;
  'processor-id'?: string;
  'transaction-id'?: string;
  'custom-attributes'?: CustomAttributeElement;
  'credit-card'?: CreditCard;
  'gift-certificate'?: GiftCertificate;
  customAttributes?: MappedCustomAttributes;
}

export interface CreditCard {
  'card-type': string;
  'card-number': string;
  'card-holder': string;
  'card-token': string;
  'expiration-month': string;
  'expiration-year': string;
  'custom-attributes': DatumCustomAttributes;
  customAtributes?: MappedCustomAttributes;
}

export interface GiftCertificate {
  'custom-attributes': GiftCertificateCustomeAttributes;
  customAttributes?: MappedCustomAttributes;
}

export interface GiftCertificateCustomeAttributes {
  'custom-attribute': DatumCustomAtrribute;
}

export interface PaymentCustomAttributes {
  'custom-attribute': PaymentCustomAttribute;
}

export interface PaymentCustomAttribute {
  value: string;
  'attribute-id': string;
}

export interface CustomMethod {
  'method-name': string;
  'custom-attributes'?: DatumCustomAttributes;
}

export interface ProductLineitems {
  'product-lineitem': ProductLineitem[];
}

export interface ProductLineitem {
  'net-price': string;
  tax: string;
  'gross-price': string;
  'base-price': string;
  'lineitem-text': string;
  'tax-basis': string;
  position: string;
  'product-id': string;
  'product-name': string;
  quantity: Quantity;
  'tax-rate': string;
  'shipment-id': string;
  gift: string;
  'custom-attributes'?: CustomAttributeElement[] | MappedCustomAttributes;
  'price-adjustments'?: PriceAdjustments;
  rate?: string;
  celigoGiftCardField?: string;
}

export interface CustomAttributeElement {
  'custom-attribute': { [key: string]: string }[] | { [key: string]: string };
}

export interface MappedCustomAttributes {
  [key: string]: string;
}

export interface Quantity {
  unit: string;
  '&txt': string;
}

export interface Shipments {
  shipment: Shipment[];
}

export interface Shipment {
  status: ShipmentStatus;
  'shipping-method': string;
  'shipping-address': IngAddress;
  gift: string;
  totals: ShipmentTotals;
  // 'custom-attributes'?: DatumCustomAttributes;
  'shipment-id': string;
}

export interface ShipmentStatus {
  'shipping-status': string;
}

export interface ShipmentTotals {
  'merchandize-total': Total;
  'adjusted-merchandize-total': Total;
  'shipping-total': Total;
  'adjusted-shipping-total': Total;
  'shipment-total': Total;
}

export interface Total {
  'net-price': string;
  tax: string;
  'gross-price': string;
  'price-adjustments'?: AdjustedTotalPriceAdjustments;
}

export interface AdjustedTotalPriceAdjustments {
  'price-adjustment': PriceAdjustment[];
}

export interface PriceAdjustments {
  'price-adjustment': PriceAdjustment[];
}

export interface PriceAdjustment {
  'net-price': string;
  tax: string;
  'gross-price': string;
  'base-price': string;
  'lineitem-text': string;
  'tax-basis': string;
  'promotion-id': string;
  'campaign-id': string;
  'coupon-id'?: string;
}

export interface ShippingLineitems {
  'shipping-lineitem': ShippingLineitem[];
}

export interface ShippingLineitem {
  'net-price': string;
  tax: string;
  'gross-price': string;
  'base-price': string;
  'lineitem-text': string;
  'tax-basis': string;
  'item-id': string;
  'shipment-id': string;
  'tax-rate': string;
}

export interface DatumStatus {
  'order-status': string;
  'shipping-status': string;
  'confirmation-status': string;
  'payment-status': string;
}

export interface DatumTotals {
  'merchandize-total': Total;
  'adjusted-merchandize-total': Total;
  'shipping-total': Total;
  'adjusted-shipping-total': Total;
  'order-total': Total;
}
