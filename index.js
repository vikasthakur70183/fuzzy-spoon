var express=require('express');
var app=express();
var path=require('path');
var port=3000;
var bodyParser=require('body-parser');
var fs=require('fs');
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'Views')));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

let items=require('./items.json');


let priceList=[
    {"name":"Mouse","price":500},
    {"name":"Keyboard","price":1000},
    {"name":"Display","price":10000},
    {"name":"CPU","price":35000},
    {"name":"Laptop","price":47000}
]

app.get('/',(req,res)=>{
    res.sendFile(path.join(__dirname,"Views","Shop.html"));
})



app.post('/getcart',(req,res)=>{

    let product_name=req.body.item;
    let Quantity=req.body.qty;

    let product_price=priceList.find(item=>item.name===product_name);

    let total=Number(product_price.price)*Number(Quantity)
    let order={
        id:items.length+1,
        item:product_name,
        qty:Quantity,
        total:total
    }
    items.push(order);
    fs.writeFileSync('./items.json',JSON.stringify(items), 'utf-8');
    res.send(items);
})

function calculateTotalCost(items) {
    let totalCost = 0;
    items.forEach(item => {
        totalCost += item.total;
    });
    return totalCost;
}


app.get('/cart', (req, res) => {
    const total=calculateTotalCost(items);
    res.render('cart', { items: items ,total});
})


app.listen(port,()=>
{console.log(`Server is running at http://localhost:${port}`)}
)
