const express = require('express');
const PORT = 3000;
const app = express();
let products = require('./data');

app.use(express.urlencoded({ extended: true }));
app.use(express.static('./views'));

app.set('view engine', 'ejs');
app.set('views', './views');

app.get('/', (req, resp) => {
    return resp.render('index', { products })
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

const fs = require('fs');

app.post('/save', (req, resp) => {
    const id = Number(req.body.id);
    const name = req.body.name;
    const quantity = Number(req.body.quantity);
    const brand = req.body.brand;

    const params = {
        "id": id,
        "name": name,
        "quantity": quantity,
        "brand": brand
    }

    products.push(params);

    // Chuyển đổi mảng products thành chuỗi JSON
    const jsonData = JSON.stringify(products);

    // Ghi dữ liệu vào file data.js
    fs.writeFile('./data.js', `module.exports = ${jsonData}`, (err) => {
        if (err) {
            console.error('Error writing data to file:', err);
        } else {
            console.log('Data saved to file.');
        }
    });

    return resp.redirect('/');
});


app.post('/delete', (req, resp) => {
    const selectedIds = req.body.selectedItem;

    // Kiểm tra xem selectedIds có tồn tại và là một mảng không
    if (!selectedIds || !Array.isArray(selectedIds)) {
        return resp.redirect('/');
    }

    // Chuyển các id sản phẩm từ dạng string sang number
    const selectedIdsArray = selectedIds.map(id => Number(id));

    // Lọc và xóa các sản phẩm có id nằm trong danh sách selectedIdsArray
    products = products.filter(item => !selectedIdsArray.includes(item.id));

    console.log('Data deleted: ', JSON.stringify(products));

    // Chuyển danh sách sản phẩm mới thành JSON
    const jsonData = JSON.stringify(products);

    // Ghi dữ liệu vào file data.js
    fs.writeFile('./data.js', `module.exports = ${jsonData}`, (err) => {
        if (err) {
            console.error('Error writing data to file:', err);
        } else {
            console.log('Data saved to file.');
        }
    });

    return resp.redirect('/');
});