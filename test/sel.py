import unittest
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager

class UITest(unittest.TestCase):
    def setUp(self):
        options = webdriver.ChromeOptions()
        options.add_argument("--headless")
        options.add_argument("--no-sandbox")
        options.add_argument("--disable-dev-shm-usage")

        self.driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=options)
        self.driver.get("http://localhost:3000")

    def tearDown(self):
        self.driver.quit()

    def test_form_displayed(self):
        form = self.driver.find_element(By.TAG_NAME, 'form')
        self.assertIsNotNone(form)

    def test_submit_valid_term(self):
        input_box = self.driver.find_element(By.NAME, 'term')
        input_box.send_keys("python selenium")
        submit_btn = self.driver.find_element(By.CSS_SELECTOR, 'button[type="submit"]')
        submit_btn.click()

        self.assertIn("/result", self.driver.current_url)
        body_text = self.driver.find_element(By.TAG_NAME, 'body').text
        self.assertIn("python selenium", body_text)

if __name__ == "__main__":
    unittest.main()
