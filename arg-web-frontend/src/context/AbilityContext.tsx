import React, { createContext, useContext, useMemo } from "react";
import type { ReactNode } from "react";
import { createMongoAbility } from "@casl/ability";
import type { AppAbility } from "@/config/accessControl";
import { buildAbilityForRights } from "@/config/accessControl";
import { useAuth } from "@/modules/auth/customhooks/useAuth";
import { extractRights } from "@utils/permissionUtils";

const defaultAbility: AppAbility = createMongoAbility([]) as AppAbility;

const AbilityContext = createContext<AppAbility>(defaultAbility);

interface AbilityProviderProps {
  children: ReactNode;
}

/**
 * AbilityProvider
 *
 * Builds a CASL Ability instance from the decrypted ME API `rights` array
 * and exposes it via React context for use across the application.
 */
export const AbilityProvider: React.FC<AbilityProviderProps> = ({ children }) => {
  const { lastLoginResponse } = useAuth();

  const rights = useMemo(
    () => extractRights(lastLoginResponse),
    [lastLoginResponse]
  );

  const ability = useMemo(
    () => buildAbilityForRights(rights),
    [rights]
  );

  return (
    <AbilityContext.Provider value={ability}>
      {children}
    </AbilityContext.Provider>
  );
};

export const useAbility = (): AppAbility => {
  const context = useContext(AbilityContext);
  return context;
};


