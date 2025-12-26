package com.arg.pages;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.PageFactory;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.time.Duration;
import java.util.List;

public class OpenPayablesPage {
    private WebDriver driver;
    private WebDriverWait wait;

    // Locators
    @FindBy(css = ".title")
    private WebElement pageTitle;

    @FindBy(name = "openPayable") // Assuming data-name or name attribute acts as selector for custom dropdown
    private WebElement reportTypeDropdown;

    @FindBy(name = "companyNo")
    private WebElement companyDropdown;

    @FindBy(name = "holdVoucher")
    private WebElement holdVoucherDropdown;

    @FindBy(name = "applyFilters")
    private WebElement generateReportButton;

    @FindBy(css = ".anticon-sync")
    private WebElement resetButton;

    @FindBy(css = ".ant-table-row")
    private List<WebElement> tableRows;

    // Dynamic locators for date fields
    private By date1Field = By.name("date1");
    private By date2Field = By.name("date2");
    private By date3Field = By.name("date3");
    private By date4Field = By.name("date4");

    public OpenPayablesPage(WebDriver driver) {
        this.driver = driver;
        this.wait = new WebDriverWait(driver, Duration.ofSeconds(10));
        PageFactory.initElements(driver, this);
    }

    public String getPageTitle() {
        wait.until(ExpectedConditions.visibilityOf(pageTitle));
        return pageTitle.getText();
    }

    public void selectReportType(String reportType) {
        // Need to handle custom dropdown interaction - this might need adjustment based
        // on specific implementation
        // For standard Select, we'd use Select class. For custom divs, we click and
        // select option.
        // Assuming clicking the dropdown opens a list
        wait.until(ExpectedConditions.elementToBeClickable(reportTypeDropdown)).click();

        // Find option in the dropdown list - generic xpath for antd-like dropdowns
        WebElement option = wait.until(ExpectedConditions.visibilityOfElementLocated(
                By.xpath("//div[contains(@class, 'ant-select-item-option-content') and text()='" + reportType + "']")));
        option.click();
    }

    public void selectCompany(String company) {
        wait.until(ExpectedConditions.elementToBeClickable(companyDropdown)).click();
        WebElement option = wait.until(ExpectedConditions.visibilityOfElementLocated(
                By.xpath("//div[contains(@class, 'ant-select-item-option-content') and text()='" + company + "']")));
        option.click();
    }

    public void selectHoldVoucher(String status) {
        if (holdVoucherDropdown.isDisplayed()) {
            holdVoucherDropdown.click();
            WebElement option = wait.until(ExpectedConditions.visibilityOfElementLocated(
                    By.xpath("//div[contains(@class, 'ant-select-item-option-content') and text()='" + status + "']")));
            option.click();
        }
    }

    public void clickGenerateReport() {
        wait.until(ExpectedConditions.elementToBeClickable(generateReportButton)).click();
    }

    public void clickReset() {
        wait.until(ExpectedConditions.elementToBeClickable(resetButton)).click();
    }

    public int getReportRowCount() {
        // Wait for table to potentially load or be present
        try {
            wait.until(ExpectedConditions.visibilityOfElementLocated(By.cssSelector(".ant-table-row")));
        } catch (Exception e) {
            return 0; // Return 0 if no rows found/timed out
        }
        return tableRows.size();
    }

    public boolean isDateFieldsVisible() {
        return !driver.findElements(date1Field).isEmpty() &&
                !driver.findElements(date2Field).isEmpty() &&
                !driver.findElements(date3Field).isEmpty() &&
                !driver.findElements(date4Field).isEmpty();
    }

    public void setDate1(String date) {
        wait.until(ExpectedConditions.visibilityOfElementLocated(date1Field)).sendKeys(date);
    }

    public void setDate2(String date) {
        wait.until(ExpectedConditions.visibilityOfElementLocated(date2Field)).sendKeys(date);
    }

    public void setDate3(String date) {
        wait.until(ExpectedConditions.visibilityOfElementLocated(date3Field)).sendKeys(date);
    }

    public void setDate4(String date) {
        wait.until(ExpectedConditions.visibilityOfElementLocated(date4Field)).sendKeys(date);
    }
}
