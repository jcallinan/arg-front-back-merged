import { useState } from 'react';
import { useApi } from './useApi';
import type { ClearChecks } from '@api/api-schema/api';
import { formatNumberToMMDDYY } from '@utils/dateFormat';

type ValidateSingleCheckPayload = ClearChecks.ValidateSingleCheck.RequestBody;
type ProcessMultipleChecksPayload = ClearChecks.ProcessMultipleChecks.RequestBody;

interface ValidationResult {
  isValid: boolean;
  errors?: Array<{
    field?: string;
    message?: string;
    code?: string;
  }>;
  warnings?: Array<{
    field?: string;
    message?: string;
    code?: string;
  }>;
  items?: {
    checkNo: string;
    checkAmount: number;
    checkDate: string;
    isValid: boolean;
    errors?: Array<{
      field: string;
      message: string;
      code: string;
    }>;
    warnings?: Array<{
      message: string;
    }>;
  };
}

interface ProcessingResult {
  totalProcessed: number;
  successful: number;
  failed: number;
  results: Array<{
    checkNo?: string;
    checkAmount?: number;
    checkDate?: string;
    message?: string;
    errors?: Array<{
      field?: string;
      message?: string;
      code?: string;
    }>;
  }>;
}

export const useClearChecks = () => {
  const api = useApi();
  const [isValidating, setIsValidating] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [processingError, setProcessingError] = useState<string | null>(null);

  const validateSingleCheck = async (
    checkNo: string,
    checkAmount: number,
    clearDate: string
  ): Promise<ValidationResult> => {
    setIsValidating(true);
    setValidationError(null);

    try {
      const payload: ValidateSingleCheckPayload = {
        checkNo,
        checkAmount,
        checkDate: formatNumberToMMDDYY(clearDate) || ''
      };

      const response = await api.clearChecks.validateSingleCheck(payload);

      // The actual response might be in response.data directly
      const responseData = response.data?.data || response.data;
      
      if (!responseData) {
        return {
          isValid: false,
          errors: [{
            field: 'general',
            message: 'Invalid response format',
            code: 'INVALID_RESPONSE'
          }]
        };
      }

      // Check if the response has items structure
      if ('items' in responseData && responseData.items) {
        const items = responseData.items as {
          checkNo: string;
          checkAmount: number;
          checkDate: string;
          isValid: boolean;
          errors?: Array<{ field: string; message: string; code: string }>;
          warnings?: Array<{ message: string }>;
        };
        
        return {
          isValid: items.isValid || false,
          items,
          errors: items.errors || [],
          warnings: items.warnings || []
        };
      }

      // If no items structure, assume direct response format
      const typedResponse = responseData as {
        isValid?: boolean;
        errors?: Array<{ field: string; message: string; code: string }>;
        warnings?: Array<{ message: string }>;
      };

      return {
        isValid: typedResponse.isValid || false,
        errors: typedResponse.errors || [],
        warnings: typedResponse.warnings || []
      };
    } catch (error) {
      setValidationError(error instanceof Error ? error.message : 'Failed to validate check');
      return {
        isValid: false,
        errors: [{
          field: 'general',
          message: 'Failed to validate check',
          code: 'VALIDATION_ERROR'
        }]
      };
    } finally {
      setIsValidating(false);
    }
  };

  const processMultipleChecks = async (
    checks: Array<{
      checkNo: string;
      checkAmount: number;
      clearDate: string;
    }>
  ): Promise<ProcessingResult> => {
    setIsProcessing(true);
    setProcessingError(null);

    try {
      const payload: ProcessMultipleChecksPayload = {
        checks: checks.map(check => ({
          checkNo: check.checkNo,
          checkAmount: check.checkAmount,
          checkDate: formatNumberToMMDDYY(check.clearDate) || ''
        }))
      };

      const response = await api.clearChecks.processMultipleChecks(payload);
      
      const results = response.data?.data?.results?.map(result => ({
        checkNo: result.checkNo || '',
        checkAmount: result.checkAmount || 0,
        checkDate: result.checkDate || '',
        message: result.message,
        errors: result.errors?.map(error => ({
          field: error.field || '',
          message: error.message || '',
          code: error.code || ''
        }))
      })) || [];

      return {
        totalProcessed: response.data?.data?.totalProcessed || 0,
        successful: response.data?.data?.successful || 0,
        failed: response.data?.data?.failed || 0,
        results
      };
    } catch (error) {
      setProcessingError(error instanceof Error ? error.message : 'Failed to process checks');
      throw error;
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    validateSingleCheck,
    processMultipleChecks,
    isValidating,
    isProcessing,
    validationError,
    processingError
  };
};
