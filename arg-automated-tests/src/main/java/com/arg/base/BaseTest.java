package com.arg.base;

import com.arg.utils.ExtentManager;
import com.aventstack.extentreports.ExtentReports;
import com.aventstack.extentreports.ExtentTest;
import com.aventstack.extentreports.Status;
import com.aventstack.extentreports.markuputils.ExtentColor;
import com.aventstack.extentreports.markuputils.MarkupHelper;
import org.openqa.selenium.OutputType;
import org.openqa.selenium.TakesScreenshot;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.testng.ITestResult;
import org.testng.annotations.*;

import java.io.File;
import java.io.IOException;
import java.lang.reflect.Method;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.Duration;
import org.openqa.selenium.devtools.DevTools;
import java.util.Optional;
import java.util.HashMap;
import java.util.Map;

public class BaseTest {
    protected WebDriver driver;
    protected static ExtentReports extent;
    protected ThreadLocal<ExtentTest> test = new ThreadLocal<>();

    @BeforeSuite
    public void setUpSuite() {
        extent = ExtentManager.getInstance();
    }

    @BeforeMethod
    public void setUp(Method method) {
        ExtentTest extentTest = extent.createTest(method.getName());
        test.set(extentTest);

        ChromeOptions options = new ChromeOptions();
        options.addArguments("--remote-allow-origins=*");
        options.addArguments("--headless=new"); // Use new headless mode
        options.addArguments("--no-sandbox");
        options.addArguments("--disable-dev-shm-usage");
        options.addArguments("--window-size=1920,1080");

        driver = new ChromeDriver(options);
        driver.manage().window().maximize();
        driver.manage().timeouts().implicitlyWait(Duration.ofSeconds(10));

        // Inject Bypass Header
        try {
            DevTools devTools = ((ChromeDriver) driver).getDevTools();
            devTools.createSession();
            // Use generic Network if possible or specific version available in classpath
            // For safety with Selenium 4.x, often v85+ works.
            // Safer to use generic Network.enable() if strictly typed, but let's try strict
            // first.
            // If v118 is not found, we might need to adjust based on selenium-java version
            // dependency.
            // Using generic import if available or wildcard for now to avoid version
            // mismatch issues in snippet.
            // Actually, best to use: devTools.send(Network.enable(Optional.empty(),
            // Optional.empty(), Optional.empty()));

            // Simplified approach using just what's needed
            devTools.send(org.openqa.selenium.devtools.v85.network.Network.enable(Optional.empty(), Optional.empty(),
                    Optional.empty()));
            Map<String, Object> headers = new HashMap<>();
            headers.put("x-backend-bypass-token", "selenium_bypass_secret");
            devTools.send(org.openqa.selenium.devtools.v85.network.Network
                    .setExtraHTTPHeaders(new org.openqa.selenium.devtools.v85.network.model.Headers(headers)));

        } catch (Exception e) {
            System.err.println("Failed to initialize DevTools for header injection: " + e.getMessage());
            // Fallback or ignore? Ideally we need this for bypass.
        }

        // Navigate to the app - UPDATE THIS URL IF NEEDED
        driver.get("http://localhost:5173/login");

        // With bypass, we might land logged in or need to hit a protected route
        // directly?
        // If the bypass token is in headers, the backend will treat us as logged in for
        // data calls,
        // but the Frontend might still check for a cookie or local storage to determine
        // 'isLoggedIn' UI state.
        // We might need to manually set a cookie in the browser to fool the frontend
        // AuthGuard/Context.

        // Mock frontend auth cookie if needed
        // driver.manage().addCookie(new Cookie("access-token", "mock_frontend_token"));
    }

    @AfterMethod
    public void tearDown(ITestResult result) {
        if (result.getStatus() == ITestResult.FAILURE) {
            test.get().log(Status.FAIL, MarkupHelper.createLabel(result.getName() + " FAILED ", ExtentColor.RED));
            test.get().fail(result.getThrowable());

            try {
                String screenshotPath = captureScreenshot(result.getName());
                test.get().addScreenCaptureFromPath(screenshotPath);
            } catch (IOException e) {
                test.get().warning("Failed to capture screenshot: " + e.getMessage());
            }
        } else if (result.getStatus() == ITestResult.SUCCESS) {
            test.get().log(Status.PASS, MarkupHelper.createLabel(result.getName() + " PASSED ", ExtentColor.GREEN));
        } else {
            test.get().log(Status.SKIP, MarkupHelper.createLabel(result.getName() + " SKIPPED ", ExtentColor.ORANGE));
            test.get().skip(result.getThrowable());
        }

        if (driver != null) {
            driver.quit();
        }
    }

    @AfterSuite
    public void tearDownSuite() {
        if (extent != null) {
            extent.flush();
        }
    }

    public WebDriver getDriver() {
        return driver;
    }

    public ExtentTest getTest() {
        return test.get();
    }

    private String captureScreenshot(String methodName) throws IOException {
        TakesScreenshot ts = (TakesScreenshot) driver;
        File source = ts.getScreenshotAs(OutputType.FILE);
        String destPath = System.getProperty("user.dir") + "/test-output/screenshots/" + methodName + "_"
                + System.currentTimeMillis() + ".png";
        File destination = new File(destPath);

        // Ensure directory exists
        Path path = Paths.get(destPath).getParent();
        if (!Files.exists(path)) {
            Files.createDirectories(path);
        }

        Files.copy(source.toPath(), destination.toPath());
        return destPath;
    }
}
