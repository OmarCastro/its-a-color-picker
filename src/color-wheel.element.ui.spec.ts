import { test, expect } from '../test-utils/ui-tests.ts'

test('base test visual testing', async ({ page }) => {
  await page.goto('./build/docs/test-page.html');
  
  const colorWheel = page.locator('.test--base .test__view color-wheel')

  await expect.soft(await colorWheel.screenshot()).toMatchSnapshot('color-wheel-default.png');
});


test('lightness visual testing', async ({ page }) => {
  await page.goto('./build/docs/test-page.html');
    
  const colorWheel = page.locator('.test--lightness .test__view color-wheel')

  await expect.soft(await colorWheel.screenshot()).toMatchSnapshot('color-wheel-lightness-50.png');
  await colorWheel.evaluate(node => node.setAttribute("lightness", "75"))
  await expect.soft(await colorWheel.screenshot()).toMatchSnapshot('color-wheel-lightness-75.png');
});

test('value visual testing', async ({ page }) => {
  await page.goto('./build/docs/test-page.html');
    
  const colorWheel = page.locator('.test--value .test__view color-wheel')

  await expect.soft(await colorWheel.screenshot()).toMatchSnapshot('color-wheel-value-50.png');
  await colorWheel.evaluate(node => node.setAttribute("value", "75"))
  await expect.soft(await colorWheel.screenshot()).toMatchSnapshot('color-wheel-value-75.png');
  await colorWheel.evaluate(node => node.setAttribute("value", "100"))
  await expect.soft(await colorWheel.screenshot()).toMatchSnapshot('color-wheel-value-100.png');

});

test('value ui-mode visual testing', async ({ page }) => {
  await page.goto('./build/docs/test-page.html');

  const testView = page.locator('.test--ui-mode .test__view')
  const colorWheel = testView.locator('color-wheel')
  
  await testView.evaluate(node => node.setAttribute("style", '--ui-mode: "desktop"'))
  await expect.soft(await colorWheel.screenshot()).toMatchSnapshot('color-wheel-ui-mode-desktop.png');
  await testView.evaluate(node => node.setAttribute("style", '--ui-mode: "mobile"'))
  await expect.soft(await colorWheel.screenshot()).toMatchSnapshot('color-wheel-ui-mode-mobile.png');
});




test('slider should follow mouse position when dragging the mouse in desktop mode', async ({ page }) => {
  await page.goto('./build/docs/test-page.html');
    
  const colorWheelElement = page.locator('.test--desktop-ui-drag .test__view color-wheel');
  await colorWheelElement.scrollIntoViewIfNeeded();
  const colorWheel = colorWheelElement.locator('.container');
  const slider = colorWheelElement.getByRole("slider")
  const sliderBoundingBox = await slider.boundingBox();
  const colorWheelBoundingBox = await colorWheel.boundingBox();
  test.fail(!sliderBoundingBox || !colorWheelBoundingBox, "bounding box is null")
  if(!sliderBoundingBox || !colorWheelBoundingBox){
    throw new Error("Should have failed already") 
    //also, the if condition stops TS complaining that boundingBox is possibly null 
  }
  
  const centerPoint = {
    x: colorWheelBoundingBox.x + colorWheelBoundingBox.width  / 2,
    y: colorWheelBoundingBox.y + colorWheelBoundingBox.height / 2
  }

  const getSturation = async () => await colorWheelElement.evaluate(node => parseInt(node.getAttribute("saturation") as string))
  const getHue = async () => await colorWheelElement.evaluate(node => parseInt(node.getAttribute("hue") as string))

  await page.mouse.move(centerPoint.x, centerPoint.y)
  await page.mouse.down()
  await page.mouse.move(centerPoint.x, colorWheelBoundingBox.y)
  expect.soft(await getSturation()).toEqual(100);
  expect.soft(await getHue()).toBeCloseTo(0);
  await page.mouse.move(colorWheelBoundingBox.x, colorWheelBoundingBox.y)
  expect.soft(await getHue()).toBeCloseTo(45, -1);
  await page.mouse.move(colorWheelBoundingBox.x, centerPoint.y)
  expect.soft(await getHue()).toBeCloseTo(90, -1);
  await page.mouse.move(colorWheelBoundingBox.x, colorWheelBoundingBox.y + colorWheelBoundingBox.height)
  expect.soft(await getHue()).toBeCloseTo(135, -1);
  await page.mouse.move(centerPoint.x, colorWheelBoundingBox.y + colorWheelBoundingBox.height)
  expect.soft(await getHue()).toBeCloseTo(180, -1);
  await page.mouse.move(colorWheelBoundingBox.x + colorWheelBoundingBox.width, colorWheelBoundingBox.y + colorWheelBoundingBox.height)
  expect.soft(await getHue()).toBeCloseTo(225, -1);
  await page.mouse.move(colorWheelBoundingBox.x + colorWheelBoundingBox.width, centerPoint.y)
  expect.soft(await getHue()).toBeCloseTo(270, -1);
  await page.mouse.move(colorWheelBoundingBox.x + colorWheelBoundingBox.width, colorWheelBoundingBox.y)
  expect.soft(await getHue()).toBeCloseTo(315, -1);
  await page.mouse.up()
});

test('slider rotate following mouse theta position when dragging the mouse in mobile ui mode', async ({ page }) => {
  await page.goto('./build/docs/test-page.html');
    
  const colorWheelElement = page.locator('.test--mobile-ui-drag .test__view color-wheel');
  await colorWheelElement.scrollIntoViewIfNeeded();
  const colorWheel = colorWheelElement.locator('.container');
  const slider = colorWheelElement.getByRole("slider")
  const sliderBoundingBox = await slider.boundingBox();
  const colorWheelBoundingBox = await colorWheel.boundingBox();
  test.fail(!sliderBoundingBox || !colorWheelBoundingBox, "bounding box is null")
  if(!sliderBoundingBox || !colorWheelBoundingBox){
    throw new Error("Should have failed already") 
    //also, the if condition stops TS complaining that boundingBox is possibly null 
  }
  
  const centerPoint = {
    x: colorWheelBoundingBox.x + colorWheelBoundingBox.width  / 2,
    y: colorWheelBoundingBox.y + colorWheelBoundingBox.height / 2
  }

  const getHue = async () => await colorWheelElement.evaluate(node => parseInt(node.getAttribute("hue")  ?? "0"))

  await page.mouse.move(centerPoint.x, colorWheelBoundingBox.y + colorWheelBoundingBox.height * 0.1)
  await page.mouse.down()
  await page.mouse.move(centerPoint.x, colorWheelBoundingBox.y)
  expect.soft(await getHue()).toBeCloseTo(0);
  await page.mouse.move(colorWheelBoundingBox.x, colorWheelBoundingBox.y)
  expect.soft(await getHue()).toBeCloseTo(315, -1);
  await page.mouse.move(colorWheelBoundingBox.x, centerPoint.y)
  expect.soft(await getHue()).toBeCloseTo(270, -1);
  await page.mouse.move(colorWheelBoundingBox.x, colorWheelBoundingBox.y + colorWheelBoundingBox.height)
  expect.soft(await getHue()).toBeCloseTo(225, -1);
  await page.mouse.move(centerPoint.x, colorWheelBoundingBox.y + colorWheelBoundingBox.height)
  expect.soft(await getHue()).toBeCloseTo(180, -1);
  await page.mouse.move(colorWheelBoundingBox.x + colorWheelBoundingBox.width, colorWheelBoundingBox.y + colorWheelBoundingBox.height)
  expect.soft(await getHue()).toBeCloseTo(135, -1);
  await page.mouse.move(colorWheelBoundingBox.x + colorWheelBoundingBox.width, centerPoint.y)
  expect.soft(await getHue()).toBeCloseTo(90, -1);
  await page.mouse.move(colorWheelBoundingBox.x + colorWheelBoundingBox.width, colorWheelBoundingBox.y)
  expect.soft(await getHue()).toBeCloseTo(45, -1);
  await page.mouse.up()
});


test('slider should follow mouse vertical position when dragging the mouse in mobile ui mode', async ({ page }) => {
  await page.goto('./build/docs/test-page.html');
    
  const colorWheelElement = page.locator('.test--mobile-ui-drag .test__view color-wheel');
  await colorWheelElement.scrollIntoViewIfNeeded();
  const colorWheel = colorWheelElement.locator('.container');
  const slider = colorWheelElement.getByRole("slider")
  const sliderBoundingBox = await slider.boundingBox();
  const colorWheelBoundingBox = await colorWheel.boundingBox();
  test.fail(!sliderBoundingBox || !colorWheelBoundingBox, "bounding box is null")
  if(!sliderBoundingBox || !colorWheelBoundingBox){
    throw new Error("Should have failed already") 
    //also, the if condition stops TS complaining that boundingBox is possibly null 
  }
  
  const sliderCenterPoint = {
    x: sliderBoundingBox.x + sliderBoundingBox.width  / 2,
    y: sliderBoundingBox.y + sliderBoundingBox.height / 2
  }

  const getSturation = async () => await colorWheelElement.evaluate(node => parseInt(node.getAttribute("saturation") ?? "0"))

  expect.soft(await getSturation()).toEqual(0);
  await page.mouse.move(sliderCenterPoint.x, sliderCenterPoint.y)
  await page.mouse.down()
  await page.mouse.move(sliderCenterPoint.x, colorWheelBoundingBox.y)
  expect.soft(await getSturation()).toEqual(100);
  await page.mouse.up()
});