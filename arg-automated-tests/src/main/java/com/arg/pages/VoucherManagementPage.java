package com.arg.pages;

import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.PageFactory;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.time.Duration;

public class VoucherManagementPage {
    private WebDriverWait wait;

    // Navigation links in sidebar
    @FindBy(xpath = "//li[.//span[text()='Voucher Entry']]")
    private WebElement voucherEntryMenu;

    @FindBy(xpath = "//li[.//span[text()='Purchase Journal']]")
    private WebElement purchaseJournalMenu;

    @FindBy(xpath = "//li[.//span[text()='Check Inquiry']]")
    private WebElement checkInquiryMenu;

    @FindBy(xpath = "//li[.//span[text()='Voucher Maintenance']]")
    private WebElement voucherMaintenanceMenu;

    public VoucherManagementPage(WebDriver driver) {
        this.wait = new WebDriverWait(driver, Duration.ofSeconds(10));
        PageFactory.initElements(driver, this);
    }

    public void navigateToVoucherEntry() {
        wait.until(ExpectedConditions.elementToBeClickable(voucherEntryMenu)).click();
    }

    public void navigateToPurchaseJournal() {
        wait.until(ExpectedConditions.elementToBeClickable(purchaseJournalMenu)).click();
    }

    public void navigateToCheckInquiry() {
        wait.until(ExpectedConditions.elementToBeClickable(checkInquiryMenu)).click();
    }

    public void navigateToVoucherMaintenance() {
        wait.until(ExpectedConditions.elementToBeClickable(voucherMaintenanceMenu)).click();
    }
}
