
export class Email {
    public value: string
    
    constructor(value: string) {
        // Validação de email pode ser feita aqui        
        if (!Email.validateEmail(value)) {
            throw new Error("Invalid email format")
        }
        this.value = value.trim().toLowerCase();
    }
    
    static validateEmail(email: string): boolean {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        return re.test(email)
    }


    toString(): string {
        return this.value
    }
}