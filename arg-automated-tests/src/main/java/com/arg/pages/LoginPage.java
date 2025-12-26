package com.arg.pages;

import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.PageFactory;

public class LoginPage {
    private WebDriver driver;

    // Locators - Updated for SSO
    @FindBy(xpath = "//button[@data-name='login-with-microsoft']")
    private WebElement ssoLoginButton;

    public LoginPage(WebDriver driver) {
        this.driver = driver;
        PageFactory.initElements(driver, this);
    }

    public boolean isSSOButtonDisplayed() {
        return ssoLoginButton.isDisplayed();
    }

    public String getPageTitle() {
        return driver.getTitle();
    }
}
