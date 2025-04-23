import User from "./User";
import Customer from "./Customer";
import Product from "./Product";
import Review from "./Review";
import ShoppingCart from "./ShoppingCart";
import RevokedTokens from "./RevokedTokens";

const Schema = `
  ${User}
  ${Customer}
  ${Product}
  ${Review}
  ${ShoppingCart}
  ${RevokedTokens}
`;

export default Schema;