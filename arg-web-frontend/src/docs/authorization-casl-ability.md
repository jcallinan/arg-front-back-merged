## Authorization with CASL & Ability in ARG Frontend

This document describes how we integrate **CASL / Ability** with the ARG frontend to manage **AP permissions** (using `rights` from the ME API) and how to use a **single reusable wrapper** for button‑level authorization.

The initial implementation is scoped to **Voucher Entry (all process types)** without changing existing data/API flows. The same patterns can be reused across the rest of the app.

---

## 1. Data sources for authorization

- **Auth / ME API** (already in use via `useAuth`):
  - Encrypted response (`items.iv`, `items.payload`) → decrypted by `cryptoUtils.ts`.
  - Decrypted payload contains:
    - `navigation`: hierarchical menu tree (Dashboard → Account Payables → Voucher Management → …)
    - `rights`: flat list of permission keys, e.g.:
      - `account-payable::voucher::flexi::upload::rw`
      - `account-payable::voucher::sogas::upload::rw`
      - `account-payable::voucher::voucher::rw`

- **Current usage (before CASL)**:
  - `permissionUtils.ts` uses `navigation` + DisplayName to decide **module/menu access** (e.g. Voucher Entry visible or not).
  - Buttons and fields are not yet gated by `rights`.

With CASL we add a **second layer**:

- **Navigation access**: stays as‑is (via `navigation` and DisplayNames).
- **Action/button access**: new CASL Ability built from `rights`.

---

## 2. Normalizing rights (`permissionUtils.ts`)

The ME API can return encrypted or already-decrypted user data. We add a helper in `permissionUtils.ts` to safely extract the `rights` array from any supported shape:

```12:56:src/utils/permissionUtils.ts
export function extractRights(authResponse: any): string[] {
  if (!authResponse) {
    return [];
  }

  let processedResponse = authResponse;

  try {
    if (
      authResponse.items &&
      typeof authResponse.items === 'object' &&
      'iv' in authResponse.items &&
      'payload' in authResponse.items
    ) {
      try {
        processedResponse = decryptData(authResponse.items as any);
      } catch (error) {
        console.error('❌ Failed to decrypt rights data:', error);
        processedResponse = authResponse;
      }
    }

    if (Array.isArray((processedResponse as any).rights)) {
      return (processedResponse as any).rights;
    }

    if (
      (processedResponse as any).items &&
      Array.isArray((processedResponse as any).items.rights)
    ) {
      return (processedResponse as any).items.rights;
    }
  } catch (error) {
    console.error('❌ Error extracting rights from auth response:', error);
  }

  return [];
}
```

**Contract:**  
`extractRights(lastLoginResponse)` returns a **flat string[]** such as:

- `account-payable::voucher::voucher::rw`
- `account-payable::voucher::flexi::upload::rw`
- `account-payable::voucher::sogas::upload::rw`

---

## 3. Building the CASL Ability from rights (`config/accessControl.ts`)

We treat each right as:

- **Base key (subject)**: everything before the final `::r` / `::rw`.  
  Example: `account-payable::voucher::flexi::upload`
- **Permission suffix**:
  - `r`  → read
  - `rw` → read + write

The Ability uses **actions** `'read'` and `'manage'`:

- Every right grants at least: `can('read', subject)`.
- When the suffix is `::rw`, we additionally grant: `can('manage', subject)`.

```1:39:src/config/accessControl.ts
import { AbilityBuilder, createMongoAbility, MongoAbility } from '@casl/ability';

type Actions = 'read' | 'manage';
type Subjects = string;

export type AppAbility = MongoAbility<[Actions, Subjects]>;

export function buildAbilityForRights(rights: string[] = []): AppAbility {
  const { can, build } = new AbilityBuilder<AppAbility>(createMongoAbility);

  rights.forEach((right) => {
    if (typeof right !== 'string' || right.trim() === '') {
      return;
    }

    const match = right.match(/^(.*)::(r|rw)$/i);
    if (!match) {
      return;
    }

    const subject = match[1];
    const permission = match[2].toLowerCase() as 'r' | 'rw';

    can('read', subject);

    if (permission === 'rw') {
      can('manage', subject);
    }
  });

  return build();
}
```

**Examples:**

- `account-payable::voucher::voucher::rw`
  - subject: `account-payable::voucher::voucher`
  - ability: `can('read', subject)` and `can('manage', subject)`
- `account-payable::voucher::flexi::entries::r`
  - subject: `account-payable::voucher::flexi::entries`
  - ability: `can('read', subject)` only

---

## 4. AbilityContext: providing Ability across the app

We expose a single **global Ability instance** using React Context, built from `lastLoginResponse` → `rights`:

```1:40:src/context/AbilityContext.tsx
import React, { createContext, useContext, useMemo } from "react";
import type { ReactNode } from "react";
import { createMongoAbility } from "@casl/ability";
import type { AppAbility } from "@/config/accessControl";
import { buildAbilityForRights } from "@/config/accessControl";
import { useAuth } from "@/modules/auth/customhooks/useAuth";
import { extractRights } from "@utils/permissionUtils";

const defaultAbility: AppAbility = createMongoAbility<AppAbility["conditions"]>([] as any);

const AbilityContext = createContext<AppAbility>(defaultAbility);

interface AbilityProviderProps {
  children: ReactNode;
}

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
```

### 4.1. Wiring the provider in `main.tsx`

`AbilityProvider` is mounted **inside** `AuthProvider` so it can read `lastLoginResponse`:

```15:35:src/main.tsx
ReactDOM.createRoot(document.getElementById("root")!).render(
   <Provider store={store}>
      <QueryClientProvider client={querysClient}>
         <TokenTimingProvider>
            <AuthProvider>
               <AbilityProvider>
                  <BrowserRouter>
                     <ConfigProvider
                        theme={{
                           token: {
                              colorPrimaryBorder: "#2d2d2d",
                              colorPrimaryHover: "#2d2d2d",
                           },
                        }}
                     >
                        <AppRoutes />
                     </ConfigProvider>
                  </BrowserRouter>
               </AbilityProvider>
            </AuthProvider>
         </TokenTimingProvider>
      </QueryClientProvider>
   </Provider>
);
```

This is a **pure wrapper**: no routes, layouts, or module flows are changed—only the authorization context is added.

---

## 5. Generic button wrapper: `PermissionGuard`

To avoid repeating permission checks in every component, we define a **single reusable wrapper** that controls button visibility based on RW access for a given right key.

```1:60:src/shared-components/permissions/PermissionGuard.tsx
import type { ReactNode } from "react";
import { useAbility } from "@context/AbilityContext";

export interface PermissionGuardProps {
  rightKey: string;
  children: ReactNode;
  fallback?: ReactNode;
}

const normalizeRightKey = (rightKey: string): string => {
  if (!rightKey) return "";
  return rightKey.replace(/::(r|rw)$/i, "");
};

const PermissionGuard: React.FC<PermissionGuardProps> = ({
  rightKey,
  children,
  fallback = null,
}) => {
  const ability = useAbility();
  const subject = normalizeRightKey(rightKey);

  const canManage = subject ? ability.can("manage", subject) : false;

  if (!canManage) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};

export default PermissionGuard;
```

**Behavior:**

- `rightKey` can be either:
  - Base: `account-payable::voucher::flexi::upload`
  - Full: `account-payable::voucher::flexi::upload::rw` (the `::rw` is stripped automatically).
- The wrapper checks `ability.can('manage', subject)`:
  - If the user has **RW** for that right → children are rendered.
  - If the user only has **R** or nothing → children are **not rendered** (button is hidden).

This matches the requirement: *“if the user has only read permission hide the button itself; only show if user has both RW read and write permission.”*

---

## 6. Voucher Entry: applying PermissionGuard (all process types)

Voucher Entry already uses navigation permissions (`hasVoucherEntryAccess`) to allow/deny the **entire screen**. We add **button-level** checks using `PermissionGuard` without changing any existing business logic or API calls.

### 6.1. Voucher Entry header actions (`VoucherEntry.tsx`)

We gate:

- **Create New Entry** (NORMAL process) by `account-payable::voucher::voucher::rw`.
- **Flexi CSV Upload** by `account-payable::voucher::flexi::upload::rw`.
- **Sogas CSV Upload** by `account-payable::voucher::sogas::upload::rw`.

```35:76:src/modules/accounts-payable/voucher-management/sub-modules/voucher-entry/VoucherEntry.tsx
import { useAuth } from "@modules/auth/customhooks/useAuth";
import { hasVoucherEntryAccess } from "@utils/permissionUtils";
import PermissionGuard from "@shared-components/permissions/PermissionGuard";
```

```235:276:src/modules/accounts-payable/voucher-management/sub-modules/voucher-entry/VoucherEntry.tsx
{selectedProcessTypeApi === "NORMAL" && (
  <>
    <CompanyName
      value={selectedCompany}
      onChange={setSelectedCompany}
    />
    <PermissionGuard rightKey="account-payable::voucher::voucher">
      <CustomStyledButton
        name="createNewEntry"
        label={<h6>{VOUCHER_ENTRY_TEXTS.createNewEntry}</h6>}
        onClick={() => {
          navigate(`create-new-entry`, {
            state: {
              mode: "create",
              processType: selectedProcessType,
            },
          });
        }}
        icon={<img src={plusIcon} alt="plus" className="plus-icon" />}
      />
    </PermissionGuard>
  </>
)}
```

```263:285:src/modules/accounts-payable/voucher-management/sub-modules/voucher-entry/VoucherEntry.tsx
{selectedProcessTypeApi === "FLEXI" && (
  <>
    <PermissionGuard rightKey="account-payable::voucher::flexi::upload">
      <CustomStyledButton
        name="uploadCSV"
        label={<h6>{UPLOAD_CSV_MODAL_TEXTS.TITLE}</h6>}
        onClick={() => {
          setUploadSource("Flexi");
          setIsModalVisible(true);
        }}
        icon={
          <img src={uploadIcon} alt="upload" className="plus-icon" />
        }
      />
    </PermissionGuard>
    <CustomStyledButton
      name="downloadTemplate"
      label={<h6>{VOUCHER_ENTRY_TEXTS.downloadTemplate}</h6>}
      onClick={handleDownloadFlexiTemplate}
      loading={isDownloading}
      icon={
        <img src={downloadIcon} alt="download" className="file-icons" />
      }
    />
  </>
)}
```

```301:335:src/modules/accounts-payable/voucher-management/sub-modules/voucher-entry/VoucherEntry.tsx
{selectedProcessTypeApi === "SOGAS" && (
  <>
    {/* ... SOGAS type dropdown ... */}
    <PermissionGuard rightKey="account-payable::voucher::sogas::upload">
      <CustomStyledButton
        name="uploadCSV"
        label={<h6>{UPLOAD_CSV_MODAL_TEXTS.TITLE}</h6>}
        onClick={() => {
          setUploadSource("Sogas");
          setIsModalVisible(true);
        }}
        icon={<img src={upload} alt="upload" className="plus-icon" />}
      />
    </PermissionGuard>
    <CustomStyledButton
      name="downloadTemplate"
      label={<h6>{VOUCHER_ENTRY_TEXTS.downloadTemplate}</h6>}
      onClick={handleDownloadSogasTemplate}
      loading={isDownloading}
      icon={
        <img src={downloadIcon} alt="download" className="file-icons" />
      }
    />
    {/* ... uploaded file tag ... */}
  </>
)}
```

**Result:**  
For Voucher Entry:

- Users with **only** `::r` for these rights will still reach the screen (if navigation allows) but **will not see**:
  - Create New Entry button.
  - Flexi upload CSV button.
  - Sogas upload CSV button.
- Users with the corresponding **`::rw`** entries see the buttons and follow the existing flows (no API or payload changes).

---

## 7. How to use PermissionGuard elsewhere

Going forward, to protect any button or clickable action:

- Identify its **backend right key** (without the final `::r/::rw`), e.g.:
  - `payment::selection::payment-vendor`
  - `vendor-management::owner-mapping`
  - `clear-checks::upload`
- Wrap the button or control:

```tsx
import PermissionGuard from "@shared-components/permissions/PermissionGuard";

<PermissionGuard rightKey="payment::selection::payment-vendor">
  <CustomStyledButton
    name="addPayment"
    label={<h6>Add Payment</h6>}
    onClick={handleAddPayment}
  />
</PermissionGuard>
```

This ensures a **single source of truth** for button-level permissions:

- **Navigation/menu visibility** → still handled via `navigation` + existing utilities.
- **Buttons / actions** → handled via `PermissionGuard` + CASL Ability built from `rights`.

---

## 8. Summary

- **One-time setup**:
  - Added CASL packages and an **Ability builder** (`config/accessControl.ts`).
  - Exposed a global **AbilityContext** wired to ME API `rights`.
  - Created a reusable **PermissionGuard** component for any button or control.
- **Voucher Entry**:
  - Wrapped **Create New Entry**, **Flexi upload CSV**, and **Sogas upload CSV** in `PermissionGuard` using their respective right keys.
  - No existing API calls, hooks, or flows were changed; only visibility is controlled.
- **Next modules** can adopt the same pattern by wrapping buttons with `PermissionGuard` and passing the appropriate backend right key.


