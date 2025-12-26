export class GapptUser {
    entrySequence!: string; // maps to K00001
    status!: string;        // maps to F00001
  
    static create(props: Partial<GapptUser>): GapptUser {
      const instance = new GapptUser();
      Object.assign(instance, props);
      return instance;
    }
  }