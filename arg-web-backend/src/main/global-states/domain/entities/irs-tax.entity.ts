export class IRSTaxEntity {
    irsTax!: string;
  
    constructor(partial: Partial<IRSTaxEntity>) {
      Object.assign(this, partial);
    }
  
    static create(partial: Partial<IRSTaxEntity>): IRSTaxEntity {
      return new IRSTaxEntity(partial);
    }
  }
  