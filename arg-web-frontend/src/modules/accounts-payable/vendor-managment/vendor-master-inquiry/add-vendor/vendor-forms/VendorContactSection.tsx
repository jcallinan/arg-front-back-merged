import React from "react";
import { Collapse, Switch } from "antd";
import itemDeleteIcon from "@assets/icons/item-delete-icon.svg";
import { DefaultButton } from "@/widget-library/Buttons";
import { CustomPrefixInput } from "@/widget-library/Input";
import { CustomSelectDropdown } from "@/widget-library/Dropdown";
import { useDropdownData } from "@/hooks/useDropdownData";
import { validateEmail } from "@/utils/validation";

interface Contact {
  id: number;
  data: {
    name: string;
    type: string;
    email: string;
    includeAch: boolean;
    formTypeCode: string;
    formTypeDescription: string;
    comments: string;
    sequenceNumber?: number;
    isDeleted: boolean; // Track if contact is marked for deletion
  };
}

interface VendorFormContactsProps {
  contacts: Contact[];
  onAdd: () => void;
  onDelete: (id: number) => void;
  onChange: (id: number, field: string, value: string | boolean) => void;
  errors?: Record<string, string>; // Add errors prop for API validation errors
}

const VendorFormContacts: React.FC<VendorFormContactsProps> = ({
  contacts,
  onAdd,
  onDelete,
  onChange,
  errors,
}) => {
  const [validationErrors, setValidationErrors] = React.useState<
    Record<string, Record<string, string>>
  >({});

  // Dropdown data hook following the country pattern
  const { data: formTypeOptions, isLoading: isLoadingFormType } =
    useDropdownData("VENDOR_FORM_TYPE");

  // Compute Form Type descriptions for each contact (like Terms Code pattern)
  const getComputedFormTypeDescription = React.useCallback((contactId: number) => {
    const contact = contacts.find(c => c.id === contactId);
    if (
      contact?.data.formTypeCode &&
      formTypeOptions &&
      formTypeOptions.length > 0 &&
      !isLoadingFormType
    ) {
      // Trim the value to match dropdown options
      const trimmedValue = contact.data.formTypeCode.trim();

      const selectedOption = formTypeOptions.find(
        (option) => option.value === trimmedValue
      );
      return selectedOption?.label || "";
    }
    return "";
  }, [contacts, formTypeOptions, isLoadingFormType]);

  React.useEffect(() => {
    if (!isLoadingFormType && formTypeOptions && formTypeOptions.length > 0) {
      contacts.forEach(contact => {
        const computedDescription = getComputedFormTypeDescription(contact.id);
        if (computedDescription && !contact.data.formTypeDescription) {
          onChange(contact.id, "formTypeDescription", computedDescription);
        }
      });
    }
  }, [contacts, formTypeOptions, isLoadingFormType, getComputedFormTypeDescription, onChange]);

  const handleBlur = (contactId: number, field: string) => () => {
    setValidationErrors((prev) => {
      const contactErrors = { ...prev[contactId] };
      delete contactErrors[field];
      if (Object.keys(contactErrors).length === 0) {
        const { [contactId]: _, ...rest } = prev;
        return rest;
      }
      return {
        ...prev,
        [contactId]: contactErrors,
      };
    });
  };


  // Handle Form Type Code selection and auto-populate description
  const handleFormTypeChange = (contactId: number, selectedValue: string) => {
    const selectedOption = formTypeOptions?.find(
      (option) => option.value === selectedValue
    );

    onChange(contactId, "formTypeCode", selectedValue);

    if (selectedOption && selectedOption.label) {
      onChange(contactId, "formTypeDescription", selectedOption.label);
    } else {
      onChange(contactId, "formTypeDescription", "");
    }
  };
  const genExtra = (id: number) => (
    <img
      src={itemDeleteIcon}
      alt="Delete"
      onClick={(e) => {
        e.stopPropagation();
        onDelete(id);
      }}
      className="delete-icon"
    />
  );

  const getPanelHeader = (contact: Contact, index: number) => (
    <div className="panel-header line-item">
      <h5 className="line-item-title">
        Vendor Contact {index + 1}
        {contact.data.name && (
          <span style={{ fontWeight: 600, marginLeft: 8 }}>
            {contact.data.name}
          </span>
        )}
      </h5>
      <div className="panel-details flex-align">
        {[
          ["Contact Name", contact.data.name],
          ["Form Type", contact.data.formTypeCode],
          ["Email", contact.data.email],
          ["Include ACH Email", contact.data.includeAch ? "Y" : "N"],
        ].map(([label, value], idx) => (
          <React.Fragment key={label}>
            <div className="flex-align label-value-pair">
              <span className="p-s separator">{label}</span>
              <span className="sub-title">{value || "--"}</span>
            </div>
            {idx < 3 && <span className="p-s separator"> | </span>}
          </React.Fragment>
        ))}
      </div>
    </div>
  );

  // Check for contact-related errors
  const apiErrorsByContactId = React.useMemo(() => {
    const result: Record<number, Record<string, string>> = {};

    if (!errors) return result;

    // Build mapping of payload indices to contact ids using same include logic as save
    const includedContacts = contacts
      .map((c, idx) => ({ c, idx }))
      .filter(({ c }) => c.data.name || c.data.email || c.data.comments || c.data.isDeleted)
      .map(({ c }) => c);

    const fieldMap: Record<string, string> = {
      contactname: "name",
      emailaddress: "email",
      formtype: "formTypeCode",
      formtypedescription: "formTypeDescription",
      filler: "comments",
      sendachemail: "includeAch",
    };

    Object.entries(errors).forEach(([key, message]) => {
      const m = key.match(/^contactdetails\.(\d+)\.(\w+)/i);
      if (!m) return;
      const apiIndex = parseInt(m[1], 10);
      const apiField = m[2].toLowerCase();
      const uiField = fieldMap[apiField];
      const contactAtIndex = includedContacts[apiIndex];
      if (!uiField || !contactAtIndex) return;

      const contactId = contactAtIndex.id;
      if (!result[contactId]) result[contactId] = {};
      result[contactId][uiField] = String(message || "Invalid value");
    });

    return result;
  }, [errors, contacts]);

  return (
    <div className="add-vendor-section vendor-contacts-section">
      <div className="content-card-header flex-between">
        <div className="flex-column">
          <h5 className="section-title">Vendor Form Type Contacts</h5>
        </div>
        <DefaultButton
          onClick={onAdd}
          className="ant-Button"
          label={<h6>Add Vendor Contact</h6>}
          name=""
        />
      </div>
      <div className="vendor-divider"></div>

      {/* API validation errors for contacts are shown inline beneath each field */}

      <div className="collapse-container">
        {contacts.filter(contact => !contact.data.isDeleted).map((contact, filteredIndex) => (
          <Collapse accordion key={contact.id} className="collapse-panel">
            <Collapse.Panel
              header={getPanelHeader(contact, filteredIndex)}
              key={contact.id}
              extra={genExtra(contact.id)}
              className="custom-collapse-panel"
            >
              <div>
                <div className="contact-fields-grid">
                  <div className="form-field">
                    <label className="sub-title">Form Type Code</label>
                    <CustomSelectDropdown
                      name={`formTypeCode${contact.id}`}
                      placeholder="Select"
                      value={contact.data.formTypeCode?.trim() || ""}
                      onChange={(value) =>
                        handleFormTypeChange(contact.id, value)
                      }
                      options={
                        formTypeOptions?.map((option) => ({
                          label: option.label || "",
                          value: option.value || "",
                        })) || []
                      }
                      loading={isLoadingFormType}
                    />
                    {apiErrorsByContactId[contact.id]?.formTypeCode && (
                      <div className="error-message">
                        {apiErrorsByContactId[contact.id].formTypeCode}
                      </div>
                    )}
                  </div>
                  <div className="form-field">
                    <label className="sub-title">Form Type Description</label>
                    <CustomPrefixInput
                      name={`formTypeDesc${contact.id}`}
                      placeholder=""
                      value={
                        contact.data.formTypeDescription ||
                        getComputedFormTypeDescription(contact.id) ||
                        ""
                      }
                      onChange={(e) =>
                        onChange(
                          contact.id,
                          "formTypeDescription",
                          e.target.value
                        )
                      }
                      disabled={true}
                    />
                  </div>
                  <div className="form-field">
                    <label className="sub-title">Contact Name</label>
                    <div>
                      <CustomPrefixInput
                        name={`contactName${contact.id}`}
                        placeholder=""
                        value={contact.data.name}
                        onChange={(e) => {
                          const value = e.target.value;

                          if (value.length > 50) {
                            setValidationErrors((prev) => ({
                              ...prev,
                              [contact.id]: {
                                ...prev[contact.id],
                                name: "Cannot exceed 50 characters",
                              },
                            }));
                            return;
                          }

                          // Clear local validation
                          setValidationErrors((prev) => {
                            const contactErrors = { ...prev[contact.id] };
                            delete contactErrors.name;
                            return {
                              ...prev,
                              [contact.id]: contactErrors,
                            };
                          });

                          onChange(contact.id, "name", value);
                        }}
                        onBlur={handleBlur(contact.id, "name")}
                        status={(validationErrors[contact.id]?.name || apiErrorsByContactId[contact.id]?.name) ? "error" : ""}
                        maxLength={51}
                      />

                      {(validationErrors[contact.id]?.name || apiErrorsByContactId[contact.id]?.name) && (
                        <div className="error-message">
                          {validationErrors[contact.id]?.name || apiErrorsByContactId[contact.id]?.name}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="form-field">
                    <label className="sub-title">Email</label>
                    <div>
                      <CustomPrefixInput
                        name={`email${contact.id}`}
                        placeholder=""
                        value={contact.data.email}
                        onChange={(e) => {
                          const validation = validateEmail(e);
                          onChange(contact.id, "email", validation.value);

                          if (validation.hasError) {
                            setValidationErrors((prev) => ({
                              ...prev,
                              [contact.id]: {
                                ...prev[contact.id],
                                email: validation.errorMessage!,
                              },
                            }));
                          } else {
                            setValidationErrors((prev) => {
                              const newErrors = { ...prev };
                              if (newErrors[contact.id]) {
                                const { email, ...rest } = newErrors[contact.id];
                                if (Object.keys(rest).length === 0) {
                                  delete newErrors[contact.id];
                                } else {
                                  newErrors[contact.id] = rest;
                                }
                              }
                              return newErrors;
                            });
                          }
                        }}
                         onBlur={handleBlur(contact.id, "email")}
                         status={(validationErrors[contact.id]?.email || apiErrorsByContactId[contact.id]?.email) ? "error" : ""}
                         maxLength={60}
                      />

                      {(validationErrors[contact.id]?.email || apiErrorsByContactId[contact.id]?.email) && (
                        <div className="error-message">
                          {validationErrors[contact.id]?.email || apiErrorsByContactId[contact.id]?.email}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="comment-field">
                    <label className="sub-title">Comments</label>
                    <div>
                      <CustomPrefixInput
                        name={`comments${contact.id}`}
                        placeholder=""
                        value={contact.data.comments}
                        onChange={(e) => {
                          const value = e.target.value;

                          if (value.length > 113) {
                            setValidationErrors((prev) => ({
                              ...prev,
                              [contact.id]: {
                                ...prev[contact.id],
                                comments: "Cannot exceed 113 characters",
                              },
                            }));
                            return;
                          }

                          setValidationErrors((prev) => {
                            const contactErrors = { ...prev[contact.id] };
                            delete contactErrors.comments;
                            return {
                              ...prev,
                              [contact.id]: contactErrors,
                            };
                          });

                          onChange(contact.id, "comments", value);
                        }}
                        onBlur={handleBlur(contact.id, "comments")}
                        status={(validationErrors[contact.id]?.comments || apiErrorsByContactId[contact.id]?.comments) ? "error" : ""}
                        maxLength={114}
                      />
                      {(validationErrors[contact.id]?.comments || apiErrorsByContactId[contact.id]?.comments) && (
                        <div className="error-message">
                          {validationErrors[contact.id]?.comments || apiErrorsByContactId[contact.id]?.comments}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="toggle-field">
                    <label className="sub-title">Include ACH Email</label>
                    <Switch
                      checked={contact.data.includeAch}
                      onChange={(checked) =>
                        onChange(contact.id, "includeAch", checked)
                      }
                    />
                    {apiErrorsByContactId[contact.id]?.includeAch && (
                      <div className="error-message">
                        {apiErrorsByContactId[contact.id].includeAch}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Collapse.Panel>
          </Collapse>
        ))}
      </div>
    </div>
  );
};

export default VendorFormContacts;
