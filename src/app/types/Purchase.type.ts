export default interface Purchase {
  id?: number;
  customer_id: number;
  total_amount: number;
  // total_value: number;
  purchase_date?: Date;
}
