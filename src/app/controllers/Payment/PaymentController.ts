async function processPayment(user_id: string, amount: number): Promise<boolean> {
  // Lógica de processamento de pagamento simulada
  // Pode envolver chamadas a serviços de pagamento externos como Stripe

  // Simulando sucesso aleatório (50% de chance)
  return Math.random() < 0.5;
}