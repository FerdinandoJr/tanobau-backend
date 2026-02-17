export class CNPJ {
    readonly value: string;

    constructor(value: string) {
        const cleanValue = this.clean(value);

        if (!this.isValidCNPJ(cleanValue)) {
            throw new Error('CNPJ inválido');
        }

        this.value = cleanValue;
    }

    private clean(value: string): string {
        // Remove todos os caracteres não numéricos
        return value.replace(/\D/g, '');
    }

    private isValidCNPJ(cnpj: string): boolean {
        // Verifica se tem 14 dígitos
        if (cnpj.length !== 14) {
            return false;
        }

        // Verifica se todos os dígitos são iguais (ex: 00000000000000)
        if (/^(\d)\1+$/.test(cnpj)) {
            return false;
        }

        // Calcula o primeiro dígito verificador
        let sum = 0;
        let weight = 5;
        for (let i = 0; i < 12; i++) {
            sum += parseInt(cnpj.charAt(i)) * weight;
            weight = weight === 2 ? 9 : weight - 1;
        }
        let firstDigit = sum % 11 < 2 ? 0 : 11 - (sum % 11);

        // Verifica o primeiro dígito
        if (firstDigit !== parseInt(cnpj.charAt(12))) {
            return false;
        }

        // Calcula o segundo dígito verificador
        sum = 0;
        weight = 6;
        for (let i = 0; i < 13; i++) {
            sum += parseInt(cnpj.charAt(i)) * weight;
            weight = weight === 2 ? 9 : weight - 1;
        }
        let secondDigit = sum % 11 < 2 ? 0 : 11 - (sum % 11);

        // Verifica o segundo dígito
        return secondDigit === parseInt(cnpj.charAt(13));
    }

    isValid(): boolean {
        return this.isValidCNPJ(this.value);
    }

    format(): string {
        // Formata o CNPJ: XX.XXX.XXX/XXXX-XX
        return this.value.replace(
            /^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/,
            '$1.$2.$3/$4-$5'
        );
    }

    toString(): string {
        return this.value;
    }
}