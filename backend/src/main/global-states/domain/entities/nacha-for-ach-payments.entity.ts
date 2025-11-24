export class NachaForAchPaymentsEntity {
    /**
     * NACHA formatted ACH output record (maps to RECACH column in ACHFIL)
     */
    achOutput!: string;
  
    constructor(partial: Partial<NachaForAchPaymentsEntity>) {
      Object.assign(this, partial);
    }
  
    static create(partial: Partial<NachaForAchPaymentsEntity>): NachaForAchPaymentsEntity {
      return new NachaForAchPaymentsEntity(partial);
    }
  }
  