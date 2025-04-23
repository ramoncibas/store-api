export class Phone {
  private readonly value: string;

  constructor(phone: string) {
    const cleaned = phone.replace(/\D/g, '');

    if (!this.isValid(cleaned)) {
      throw new Error('Número de telefone inválido');
    }

    this.value = cleaned;
  }

  private isValid(phone: string): boolean {
    // Validação básica: DDD (2 dígitos) + número (8 ou 9 dígitos)
    return /^(\d{2})(\d{8,9})$/.test(phone);
  }

  public getValue(): string {
    return this.value;
  }

  public getFormatted(): string {
    // Retorna no formato (XX) XXXXX-XXXX ou (XX) XXXX-XXXX
    const match = this.value.match(/^(\d{2})(\d{4,5})(\d{4})$/);
    if (!match) return this.value;

    const [, ddd, first, second] = match;
    return `(${ddd}) ${first}-${second}`;
  }
}
