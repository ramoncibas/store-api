import Product, { ShoppingCartItem } from "types/Product.type";

class ProductHelper {
  static calculateTotalAmount(cartItems: ShoppingCartItem[], productList: Product[]): number {
    return cartItems.reduce((total, item) => {
      const product = productList.find(product => product.id === item.product_id);
  
      if (product && product.price !== null) {
        total += product.price * item.quantity;
      }
  
      return total;
    }, 0);
  }

  static async processPayment(customerId: number | string, totalAmount: number): Promise<boolean> {
    // Move this method to Payment Class

    return true;
  }
}

export default ProductHelper;