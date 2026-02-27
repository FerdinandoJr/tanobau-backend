export class Money {
    constructor(
        public readonly amount: string,
        public readonly currency: string,
        public readonly scale: number
    ) { }

    get value(): number {
        return parseFloat(this.amount)
    }

    toString(): string {
        return `${this.currency} ${this.amount}`
    }
    
    static fromNumber(value: number, currency: string = "BRL", scale: number = 2): Money {
        return new Money(value.toFixed(scale), currency, scale)
    }

    static fromString(value: string, currency: string = "BRL", scale: number = 2): Money {
        return new Money(value, currency, scale)
    }
}