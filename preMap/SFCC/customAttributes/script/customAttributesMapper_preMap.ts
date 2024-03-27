import type {
  Datum,
  PreMapInput,
  MappedCustomAttributes,
  CustomAttributeElement,
  DatumCustomAttributes,
  PaymentCustomAttributes,
  GiftCertificateCustomeAttributes,
} from '../types/customTypes';

/*
 * preMapFunction stub:
 *
 * The name of the function can be changed to anything you like.
 *
 * The function will be passed one ‘options’ argument that has the following fields:
 *   ‘data’ - an array of records representing the page of data before it has been mapped.  A record can be an object {} or array [] depending on the data source.
 *   '_importId' - the _importId currently running.
 *   '_connectionId' - the _connectionId currently running.
 *   '_flowId' - the _flowId currently running.
 *   '_integrationId' - the _integrationId currently running.
 *   'settings' - all custom settings in scope for the import currently running.
 *
 * The function needs to return an array, and the length MUST match the options.data array length.
 * Each element in the array represents the actions that should be taken on the record at that index.
 * Each element in the array should have the following fields:
 *   'data' - the modified/unmodified record that should be passed along for processing.
 *   'errors' -  used to report one or more errors for the specific record.  Each error must have the following structure: {code: '', message: '', source: ‘’ }
 * Returning an empty object {} for a specific record will indicate that the record should be ignored.
 * Returning both 'data' and 'errors' for a specific record will indicate that the record should be processed but errors should also be logged.
 * Throwing an exception will fail the entire page of records.
 */

export class PreMapElementReturn {
  constructor(public data: Datum, public errors: ErrorEntry[]) {}
}

export class ErrorEntry {
  constructor(
    public code: string,
    public message: string,
    public source: string
  ) {}
}

export function preMap({ data }: PreMapInput) {
  return data.map((record) => {
    let errors: ErrorEntry[] = [];
    /* 
        PAYMENTS
      */
    let paymentMethod: string = '';
    let pnReference: string = '';
    if (
      'payments' in record &&
      record.payments &&
      record.payments.payment &&
      record.payments.payment.length > 0
    ) {
      for (const payment of record.payments.payment) {
        /* 
            PAYMENT CUSTOM ATTRIBUTES
          */
        if (payment['custom-attributes']) {
          payment.customAttributes = customAttributeMapper(
            payment['custom-attributes']
          );
        }
        /* 
            CREDIT CARD CUSTOM ATTRIBUTES
          */
        if (
          payment['credit-card'] &&
          payment['credit-card']['custom-attributes']
        ) {
          const creditCardCustomAttributes = customAttributeMapper(
            payment['credit-card']['custom-attributes']
          );
          payment['credit-card'].customAtributes = creditCardCustomAttributes;
          if ('pn_ref_number' in creditCardCustomAttributes) {
            pnReference = creditCardCustomAttributes.pn_ref_number;
          }
        }
        /* 
            GIFT-CERTIFICATE CUSTOM ATTRIBUTES
          */
        if (
          payment['gift-certificate'] &&
          payment['gift-certificate']['custom-attributes']
        ) {
          payment['gift-certificate'].customAttributes = customAttributeMapper(
            payment['gift-certificate']['custom-attributes']
          );
        }
      }
    }
    /* 
         ETAIL DISCOUNT CODE and RATE
      */
    let merchandizeEtailDiscountCodes: string[] = [];
    // let orderTotalEtailDiscountCodes: string[] = [];
    let merchandizeDiscountrate: number = 0;
    // let orderTotalDiscountrate: number = 0;
    if (record.totals['merchandize-total']['price-adjustments']) {
      for (const merchandizePriceAdjustment of record.totals[
        'merchandize-total'
      ]['price-adjustments']['price-adjustment']) {
        if (merchandizePriceAdjustment['coupon-id']) {
          merchandizeEtailDiscountCodes.push(
            merchandizePriceAdjustment['coupon-id']
          );
        }

        merchandizeDiscountrate += parseFloat(
          merchandizePriceAdjustment['net-price']
        );
        /* 
              MERCHANDIZE TOTAL PRICE ADJUSTMENT CUSTOM ATTRIBUTES
            */
        const merchandizePriceAdjustmentCustomAttributes =
          customAttributeMapper(
            merchandizePriceAdjustment['custom-attributes']
          );
      }
    }

    /* 
            ITEM : RATE
      */
    for (const productLineItem of record['product-lineitems'][
      'product-lineitem'
    ]) {
      let lineItemRate: number = +productLineItem['base-price'];
      if (
        productLineItem['price-adjustments'] &&
        productLineItem['price-adjustments']['price-adjustment'] &&
        productLineItem['price-adjustments']['price-adjustment'].length > 0
      ) {
        lineItemRate = productLineItem['price-adjustments'][
          'price-adjustment'
        ].reduce((lineItemRate, priceAdjustment) => {
          return (
            lineItemRate +
            +priceAdjustment['base-price'] / +productLineItem.quantity['&txt']
          );
        }, lineItemRate);
      }
      productLineItem.rate = lineItemRate.toFixed(2);
      productLineItem.celigoGiftCardField =
        productLineItem['product-id'].split('-')[0];
      /* 
        PRODUCT LINE ITEM CUSTOM ATTRIBUTES
      */
      // i.e. product-lineitems.product-lineitem[*].custom-attributes.auroraGiftMessageText
      if (productLineItem['custom-attributes']) {
        productLineItem['custom-attributes'] = customAttributeMapper(
          productLineItem['custom-attributes'] as CustomAttributeElement[]
        );
      }
    }
    record.productLineItems = record['product-lineitems']['product-lineitem'];
    record.paymentMethod = paymentMethod;
    record.etailDiscountCode = merchandizeEtailDiscountCodes.join(' ');
    record.discountrate = merchandizeDiscountrate.toFixed(2);
    record.pnReference = pnReference;
    return new PreMapElementReturn(record, errors);
  });
}

/* 
    HELPER FUNCTIONS
  */

const customAttributeMapper = (
  customAttributes:
    | CustomAttributeElement[]
    | CustomAttributeElement
    | PaymentCustomAttributes
    | DatumCustomAttributes
    | GiftCertificateCustomeAttributes
): MappedCustomAttributes => {
  let customAttributesMap = new Map<string, string>();
  if (Array.isArray(customAttributes)) {
    for (const { ['custom-attribute']: customAttribute } of customAttributes) {
      if (Array.isArray(customAttribute)) {
        for (const customAttributeElement of customAttribute) {
          customAttributesMap.set(
            customAttributeElement['attribute-id'],
            customAttributeElement['&txt']
          );
        }
      } else {
        customAttributesMap.set(
          customAttribute['attribute-id'],
          customAttribute['&txt']
        );
      }
    }
  } else if ('custom-attribute' in customAttributes) {
    if (Array.isArray(customAttributes['custom-attribute'])) {
      for (const customAttribute of customAttributes['custom-attribute']) {
        customAttributesMap.set(
          customAttribute['attribute-id'],
          customAttribute['&txt']
        );
      }
    } else if (
      'value' in customAttributes['custom-attribute'] ||
      '&txt' in customAttributes['custom-attribute']
    ) {
      let value = '';
      'value' in customAttributes['custom-attribute']
        ? (value = customAttributes['custom-attribute'].value)
        : (value = customAttributes['custom-attribute']['&txt']);
      customAttributesMap.set(
        customAttributes['custom-attribute']['attribute-id'],
        value
      );
    }
  }
  return Object.fromEntries(customAttributesMap);
};
