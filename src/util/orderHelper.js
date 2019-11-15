import {  floor } from "./";
const getPrecision = str => ~(str + '').indexOf('.') ? (str + '').split('.')[1].length : 0;

/**
 * @param quantityIncrement
 * @param orderQuantity
 * @param precision
 * @param minimumQuantity
 * @param maximumQuantity
 * @returns {{valid: boolean, errors: *}}
 */
export function validateOrderQuantity(quantityIncrement, orderQuantity, precision, minimumQuantity, maximumQuantity) {
  const quantity = +orderQuantity;
  const precisionMax = getPrecision(orderQuantity) > precision
    ? getPrecision(orderQuantity) : precision;
  const valid = floor(quantity % quantityIncrement, precisionMax) === 0;
  const errors = [];

  if(!valid) {
    errors.push(_t('Quantity Increment {quantityIncrement}',
      'ERROR.QUANTITY_INCREMENT',
      {
        quantityIncrement
      }
    ))
  }
  if(minimumQuantity && quantity < minimumQuantity) {
    errors.push(_t('Minimum Quantity {minimumQuantity}',
      'ERROR.MINIMUM_QUANTITY',
      {
        minimumQuantity
      },
    ))
  }
  if(maximumQuantity && quantity > maximumQuantity) {
    errors.push(_t('Maximum Quantity {maximumQuantity}',
      'ERROR.MAXIMUM_QUANTITY',
      {
        maximumQuantity
      },
    ))
  }

  return { valid: !errors.length, errors }
}