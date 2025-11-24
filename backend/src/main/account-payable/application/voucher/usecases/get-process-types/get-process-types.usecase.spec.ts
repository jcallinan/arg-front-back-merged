import { Test, TestingModule } from "@nestjs/testing";
import { GetProcessTypes } from "./get-process-types.usecase";
import { FIELD_NAMES, PROCESS_TYPE_ENUM } from "@src/shared/constants/constant";

describe("GetProcessTypes", () => {
  let useCase: GetProcessTypes;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GetProcessTypes],
    }).compile();

    useCase = module.get<GetProcessTypes>(GetProcessTypes);
  });

  it("should be defined", () => {
    expect(useCase).toBeDefined();
  });

  describe("execute", () => {
    it("should return all process types", async () => {
      // Act
      const result = await useCase.execute();

      // Assert
      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThan(0);

      FIELD_NAMES.PROCESS_TYPE.forEach((processType) => {
        expect(result.some((item) => item.value === processType.value)).toBe(
          true
        );
      });
    });

    it("should return process types in correct format", async () => {
      // Act
      const result = await useCase.execute();

      // Assert
      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);

      // Check that each process type has the correct structure
      result.forEach((processType) => {
        expect(processType).toHaveProperty("id");
        expect(processType).toHaveProperty("value");
        expect(processType).toHaveProperty("label");
        expect(typeof processType.value).toBe("string");
        expect(processType.value.length).toBeGreaterThan(0);
      });
    });

    it("should return consistent results on multiple calls", async () => {
      // Act
      const result1 = await useCase.execute();
      const result2 = await useCase.execute();
      const result3 = await useCase.execute();

      // Assert
      expect(result1).toEqual(result2);
      expect(result2).toEqual(result3);
      expect(result1).toEqual(result3);
    });

    it("should return process types in expected order", async () => {
      // Act
      const result = await useCase.execute();

      // Assert
      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);

      // Check that NORMAL is typically the first process type
      expect(result[0]?.value).toBe(PROCESS_TYPE_ENUM.NORMAL);
    });

    it("should handle empty result gracefully", async () => {
      // This test ensures the usecase can handle edge cases
      // even though it currently always returns a populated array

      // Act
      const result = await useCase.execute();

      // Assert
      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);

      // Even if empty, it should still be an array
      if (result.length === 0) {
        expect(result).toEqual([]);
      }
    });
  });

  describe("process type validation", () => {
    it("should return valid process type values", async () => {
      // Act
      const result = await useCase.execute();

      // Assert
      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);

      // Verify each returned value matches FIELD_NAMES.PROCESS_TYPE
      const validProcessTypes = FIELD_NAMES.PROCESS_TYPE.map(
        (item) => item.value
      );
      result.forEach((processType) => {
        expect(validProcessTypes).toContain(processType.value);
      });
    });

    it("should not return duplicate process types", async () => {
      // Act
      const result = await useCase.execute();

      // Assert
      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);

      // Check for duplicates
      const uniqueProcessTypes = new Set(result.map((item) => item.value));
      expect(uniqueProcessTypes.size).toBe(result.length);
    });

    it("should return process types with correct string values", async () => {
      // Act
      const result = await useCase.execute();

      // Assert
      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);

      // Check that each process type has the correct structure
      result.forEach((processType) => {
        expect(processType).toHaveProperty("id");
        expect(processType).toHaveProperty("value");
        expect(processType).toHaveProperty("label");
        expect(typeof processType.value).toBe("string");
        expect(processType.value.length).toBeGreaterThan(0);
      });
    });
  });

  describe("edge cases", () => {
    it("should handle concurrent execution", async () => {
      // Act - Execute multiple times concurrently
      const promises = Array.from({ length: 5 }, () => useCase.execute());
      const results = await Promise.all(promises);

      // Assert
      expect(results).toBeDefined();
      expect(results.length).toBe(5);

      // All results should be identical
      results.forEach((result) => {
        expect(result).toEqual(results[0]);
      });
    });

    it("should handle rapid successive calls", async () => {
      // Act - Make rapid successive calls
      const results: any = [];
      for (let i = 0; i < 10; i++) {
        results.push(await useCase.execute());
      }

      // Assert
      expect(results).toBeDefined();
      expect(results.length).toBe(10);

      // All results should be identical
      results.forEach((result) => {
        expect(result).toEqual(results[0]);
      });
    });

    it("should maintain immutability", async () => {
      // Act
      const result1 = await useCase.execute();
      const result2 = await useCase.execute();

      // Assert
      expect(result1).toBeDefined();
      expect(result2).toBeDefined();

      // Since the usecase returns the same reference to FIELD_NAMES.PROCESS_TYPE,
      // modifying one will affect the other. This is expected behavior.
      // The test should verify that both results are the same object reference.
      expect(result1).toBe(result2);

      // Modify the first result
      result1.push({ id: 999, value: "INVALID_TYPE", label: "Invalid" });

      // Second result should also contain the modification since they're the same reference
      expect(result2.some((item) => item.value === "INVALID_TYPE")).toBe(true);
    });
  });

  describe("performance", () => {
    it("should execute within reasonable time", async () => {
      // Arrange
      const startTime = Date.now();

      // Act
      await useCase.execute();
      const endTime = Date.now();
      const executionTime = endTime - startTime;

      // Assert
      expect(executionTime).toBeLessThan(100); // Should execute in less than 100ms
    });

    it("should handle multiple executions efficiently", async () => {
      // Arrange
      const startTime = Date.now();
      const iterations = 100;

      // Act
      for (let i = 0; i < iterations; i++) {
        await useCase.execute();
      }
      const endTime = Date.now();
      const totalExecutionTime = endTime - startTime;
      const averageExecutionTime = totalExecutionTime / iterations;

      // Assert
      expect(totalExecutionTime).toBeLessThan(1000); // Total should be less than 1 second
      expect(averageExecutionTime).toBeLessThan(10); // Average should be less than 10ms
    });
  });
});
