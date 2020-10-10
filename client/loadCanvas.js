const puppeteer = require('puppeteer');
const http = require('http');

let scrape = async () => {
    let send = (data) => {
        const req = http.request({
            hostname: 'localhost',
            port: 8000,
            path: '/api/displays/InkyWhat/',
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': data.length
            }
        }, res => {
          console.log(`statusCode: ${res.statusCode}`);

          res.on('data', d => {
            process.stdout.write(d)
          })
        });

        req.on('error', error => {
          console.error(error)
        });

        req.write(data);
        req.end();
    };



    const browser = await puppeteer.launch({headless: false});
    const page = await browser.newPage();
    page.on('console', message => console.log(`${message.type().substr(0, 3).toUpperCase()} ${message.text()}`))
    await page.goto('http://localhost:8000/viewer/?key=InkyWhat');

    const imageData = await page.evaluate(async () => {
        function normal(imageData) {
            let pixels = '';
            let i = -1;
            for (let pixel of imageData.data) {
                i++;

                // RGBA
                if (i % 4 !== 0) {
                    continue;
                }

                if (pixel < 10) {
                    pixels += '0';
                } else {
                    pixels += '1';
                }
            }
            return pixels;
        }

        function delay(time) {
            return new Promise(function (resolve) {
                setTimeout(resolve, time)
            });
        }

        await delay(1000);
        const canvas = document.querySelector('#overlay');
        const ctx = canvas.getContext('2d');

        return normal(ctx.getImageData(0, 0, canvas.width, canvas.height));
    });

    send(JSON.stringify({'display_data': imageData}));
}

scrape();