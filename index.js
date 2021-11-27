const puppeteer = require('puppeteer');
const prompt = require('prompt');

async function checkerWorker(username, password) {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  const divUl = '[role=dialog] ul'

  console.clear()
  console.log("Starting connection with Instagram")
  await page.goto('https://instagram.com', { waitUntil: 'networkidle2' });
  await console.log('Stablished the connection')

  await page.click('input[name=username]');
  await console.log('Clicked at username input')
  await page.type('input[name=username]', username);
  await console.log('Completed username')
  await page.click('input[name=password]');
  await console.log('Clicked at password')
  await page.type('input[name=password]', password);
  await console.log('Completed the password')
  await page.click('button[type="submit"]');
  await console.log('Login...')
  await page.waitForNavigation('networkidle2');
  await console.log('Login concluded')

  await page.goto(`http://instagram.com/${username}`);
  console.log('Indo para o perfil...')
  await console.log('perfil carregado')
  await page.click(`[href="/${username}/followers/"]`)
  await console.log('Cliked at followers')
  const detailElm = await page.waitForSelector(divUl)
  console.log(detailElm._remoteObject.description.split('.'))[2]
  const urls = await page.$$eval(`${detailElm._remoteObject.description} > li > a`, (el) => {
    return el.map((a) => a.getAttribute("href"));
  });

  console.log(detailElm._remoteObject.description)
  await page.screenshot({ path: 'example.png' });

  await browser.close();
};

async function startCheckerPrivate() {

  console.log("Instagram Follower Checker")

  prompt.message = "";

  prompt.start();

  let username = ''
  let password = ''

  prompt.get({
    properties: {
      username: {
        description: "Your username",
        pattern: /^[a-z](?:_?[a-z0-9]+)*$/i,
        message: "Username should start with some letter",
        required: true
      },
      password: {
        description: "Your password"
      }
    }
  }, function (err, result) {
    if (err) { return onErr(err); }
    username = result.username
    password = result.password

    checkerWorker(username, password)
  });

  function onErr(err) {
    console.log(err);
    return 1;
  }
}



startCheckerPrivate();