console.log('Starting');
const fs = require('fs');
const http = require('http');
const url = require('url');
const slugify = require('slugify');

const productData = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
const templateProductOverView = fs.readFileSync(
  `${__dirname}/templates/template-overview.html`,
  'utf-8'
);
const templateProductCard = fs.readFileSync(
  `${__dirname}/templates/template-card.html`,
  'utf-8'
);
const templateProduct = fs.readFileSync(
  `${__dirname}/templates/template-product.html`,
  'utf-8'
);

const data = JSON.parse(productData);

const replaceTemplate = (temp, product) => {
  let output = temp.replace(/{%PRODUCTNAME%}/g, product.productName);
  output = output.replace(/{%IMAGE%}/g, product.image);
  output = output.replace(/{%PRICE%}/g, product.price);
  output = output.replace(/{%FROM%}/g, product.from);
  output = output.replace(/{%NUTRIENTS%}/g, product.nutrients);
  output = output.replace(/{%QUANTITY%}/g, product.quantity);
  output = output.replace(/{%DESCRIPTION%}/g, product.description);
  output = output.replace(/{%ID%}/g, product.id);

  if (!product.organic)
    output = output.replace(/{%NOT_ORGANIC%}/g, 'not-organic');
  return output;
};

const server = http.createServer((req, res) => {
  let { pathname, query } = url.parse(req.url, true);

  if (pathname === '/overview' || pathname === '/') {
    let overviewPage = data
      .map((el) => replaceTemplate(templateProductCard, el))
      .join('');
    // console.log('overviewPage', overviewPage);

    const output = templateProductOverView.replace(
      /{%PRODUCT_CARDS%}/g,
      overviewPage
    );

    res.writeHead(200, { 'Content-type': 'text/html' });

    res.end(output);
  } else if (pathname === '/product') {
    console.log('fff', pathname, query);
    const product = data[query.id];
    const output = replaceTemplate(templateProduct, product);
    res.writeHead(200, { 'Content-type': 'text/html' });

    res.end(output);
  } else if (pathname === '/api') {
    // res.end('This is from the product');
    const templateData = fs.readFileSync(
      `${__dirname}/templates/product.html`,
      'utf-8'
    );
    res.writeHead(200, { 'Content-type': 'text/html' });

    res.end(templateData);
  } else {
    res.writeHead(400, { 'Content-type': 'text/html', 'my-own-header': '123' });
    res.end('<h1>Page not found!</h1>');
  }
  //   res.end('hello');
});

server.listen(8000, '127.0.0.1', () => {
  console.log('Listening to requests on port 8000');
});
