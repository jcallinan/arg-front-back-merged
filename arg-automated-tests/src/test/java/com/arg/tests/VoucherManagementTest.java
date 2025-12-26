package com.arg.tests;

import com.arg.base.BaseTest;
import com.arg.pages.VoucherManagementPage;
import com.aventstack.extentreports.Status;
import org.testng.Assert;
import org.testng.annotations.Test;

public class VoucherManagementTest extends BaseTest {

    @Test(description = "Verify Voucher Management Navigation")
    public void verifyNavigation() {
        driver.get("http://localhost:5173/accounts-payable/voucher-management");
        VoucherManagementPage vmPage = new VoucherManagementPage(driver);

        test.get().log(Status.INFO, "Navigating to Check Inquiry");
        vmPage.navigateToCheckInquiry();
        Assert.assertTrue(driver.getCurrentUrl().contains("check-inquiry"), "Failed to navigate to Check Inquiry");

        test.get().log(Status.INFO, "Navigating to Purchase Journal");
        vmPage.navigateToPurchaseJournal();
        Assert.assertTrue(driver.getCurrentUrl().contains("purchase-journal"),
                "Failed to navigate to Purchase Journal");
    }
}
