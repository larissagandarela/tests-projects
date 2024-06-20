/**
* Quantity sold can be one or more units
 * --> If stock becomes negative an exception must be thrown
 * --> The purchase price cannot be greater than the purchase price
 * @param {*} product
 * @param {*} amount
 */

export default function sellProduct(product, amount){
    product.stock -= amount;
    return product;
}