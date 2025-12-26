/**
 * Factory for creating Sequelize model mocks
 * This is useful for testing repositories and services that work with Sequelize models
 */
export class SequelizeModelFactory {
  /**
   * Creates a basic Sequelize model mock that simulates the actual model behavior
   */
  static createMockSequelizeModel<T extends Record<string, any>>(data: T): any {
    return {
      ...data,
      _attributes: data,
      dataValues: data,
      _creationAttributes: data,
      isNewRecord: false,
      toJSON: () => data,
      get: (key: string) => (data as any)[key],
      set: (key: string, value: any) => {
        (data as any)[key] = value;
      },
      update: jest.fn().mockResolvedValue(data),
      save: jest.fn().mockResolvedValue(data),
      destroy: jest.fn().mockResolvedValue(true),
      reload: jest.fn().mockResolvedValue(data),
      // Add all properties from the data object as direct properties
      ...Object.keys(data).reduce(
        (acc, key) => {
          acc[key] = (data as any)[key];
          return acc;
        },
        {} as Record<string, any>
      ),
    };
  }

  /**
   * Creates a Sequelize model mock with specific methods mocked
   */
  static createMockSequelizeModelWithMethods<T extends Record<string, any>>(
    data: T,
    methods: Record<string, jest.Mock> = {}
  ): any {
    const baseMock = this.createMockSequelizeModel(data);

    return {
      ...baseMock,
      ...methods,
    };
  }

  /**
   * Creates a Sequelize model mock that can be updated
   */
  static createUpdatableSequelizeModel<T extends Record<string, any>>(
    data: T
  ): any {
    let currentData = { ...data };

    return {
      ...data,
      _attributes: currentData,
      dataValues: currentData,
      _creationAttributes: data,
      isNewRecord: false,
      toJSON: () => currentData,
      get: (key: string) => (currentData as any)[key],
      set: (key: string, value: any) => {
        (currentData as any)[key] = value;
      },
      update: jest.fn().mockImplementation((updateData: Partial<T>) => {
        currentData = { ...currentData, ...updateData };
        return Promise.resolve(this.createMockSequelizeModel(currentData));
      }),
      save: jest.fn().mockImplementation(() => {
        return Promise.resolve(this.createMockSequelizeModel(currentData));
      }),
      destroy: jest.fn().mockResolvedValue(true),
      reload: jest
        .fn()
        .mockResolvedValue(this.createMockSequelizeModel(currentData)),
      // Add all properties from the current data object as direct properties
      ...Object.keys(currentData).reduce(
        (acc, key) => {
          Object.defineProperty(acc, key, {
            get: () => (currentData as any)[key],
            set: (value: any) => {
              (currentData as any)[key] = value;
            },
            enumerable: true,
            configurable: true,
          });
          return acc;
        },
        {} as Record<string, any>
      ),
    };
  }

  /**
   * Creates a Sequelize model mock for bulk operations
   */
  static createBulkSequelizeModel<T extends Record<string, any>>(data: T): any {
    return {
      ...data,
      _attributes: data,
      dataValues: data,
      _creationAttributes: data,
      isNewRecord: false,
      toJSON: () => data,
      get: (key: string) => (data as any)[key],
      set: (key: string, value: any) => {
        (data as any)[key] = value;
      },
      update: jest.fn().mockResolvedValue(data),
      save: jest.fn().mockResolvedValue(data),
      destroy: jest.fn().mockResolvedValue(true),
      reload: jest.fn().mockResolvedValue(data),
      // Add all properties from the data object as direct properties
      ...Object.keys(data).reduce(
        (acc, key) => {
          acc[key] = data[key];
          return acc;
        },
        {} as Record<string, any>
      ),
    };
  }

  /**
   * Creates multiple Sequelize model mocks from an array of data
   */
  static createMultipleSequelizeModels<T extends Record<string, any>>(
    dataArray: T[]
  ): any[] {
    return dataArray.map((data) => this.createMockSequelizeModel(data));
  }

  /**
   * Creates a Sequelize model mock for testing associations
   */
  static createSequelizeModelWithAssociations<T extends Record<string, any>>(
    data: T,
    associations: Record<string, any> = {}
  ): any {
    const baseMock = this.createMockSequelizeModel(data);

    return {
      ...baseMock,
      // Add association methods
      hasOne: jest.fn(),
      hasMany: jest.fn(),
      belongsTo: jest.fn(),
      belongsToMany: jest.fn(),
      // Add association data
      ...associations,
    };
  }

  /**
   * Creates a Sequelize model mock for testing transactions
   */
  static createSequelizeModelWithTransaction<T extends Record<string, any>>(
    data: T
  ): any {
    const baseMock = this.createMockSequelizeModel(data);

    return {
      ...baseMock,
      // Add transaction-related properties
      sequelize: {
        startUnmanagedTransaction: jest.fn(),
        transaction: jest.fn(),
        commit: jest.fn(),
        rollback: jest.fn(),
      },
    };
  }

  /**
   * Creates a Sequelize model mock for testing pagination
   */
  static createSequelizeModelForPagination<T extends Record<string, any>>(
    data: T,
    page: number,
    itemIndex: number
  ): any {
    const paginatedData = {
      ...data,
      // Add pagination-specific properties if they exist in the data
      ...((data as any).entryNo && {
        entryNo: (page - 1) * 10 + itemIndex + 1,
      }),
      ...((data as any).vendorNo && {
        vendorNo: (page - 1) * 10 + itemIndex + 1,
      }),
      ...((data as any).companyNo && {
        companyNo: (page - 1) * 10 + itemIndex + 1,
      }),
    };

    return this.createMockSequelizeModel(paginatedData);
  }
}
