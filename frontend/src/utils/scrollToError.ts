export const scrollToError = (fieldName: string) => {
  // Try to find element by name or data-name attribute
  const element = document.querySelector(`[name="${fieldName}"], [data-name="${fieldName}"]`);
  if (element) {
    // Find the closest scrollable container
    const container = element.closest('.content-div-container') || document.documentElement;
    
    // Calculate the element's position relative to the container
    const containerRect = container.getBoundingClientRect();
    const elementRect = element.getBoundingClientRect();
    const relativeTop = elementRect.top - containerRect.top;
    
    // Scroll the container
    container.scrollTo({
      top: container.scrollTop + relativeTop - containerRect.height / 3, // Position element 1/3 from the top
      behavior: 'smooth'
    });

    // Focus the element for better UX
    (element as HTMLElement).focus();
  }
};
