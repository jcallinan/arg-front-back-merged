package com.arg.tests;

import com.arg.base.BaseTest;
import com.arg.pages.LoginPage;
import com.aventstack.extentreports.Status;
import org.testng.Assert;
import org.testng.annotations.Test;

public class LoginTest extends BaseTest {

    @Test(priority = 1, description = "Verify Login Page Title")
    public void verifyLoginPageTitle() {
        test.get().log(Status.INFO, "Verify the title of the login page.");
        LoginPage loginPage = new LoginPage(driver);
        String title = loginPage.getPageTitle();
        test.get().log(Status.INFO, "Page title is: " + title);

        // Adjust expected title based on actual app
        Assert.assertTrue(title.contains("ARG") || title.contains("Login"), "Title did not match!");
    }

    @Test(priority = 2, description = "Verify SSO Button Present")
    public void verifySSOButtonPresent() {
        test.get().log(Status.INFO, "Verifying SSO button is displayed.");
        LoginPage loginPage = new LoginPage(driver);

        Assert.assertTrue(loginPage.isSSOButtonDisplayed(), "SSO Button is not displayed!");
        test.get().log(Status.PASS, "SSO Button is displayed.");
    }
}
